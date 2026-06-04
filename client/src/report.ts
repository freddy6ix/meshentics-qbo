// Dry-run: load card CSVs, classify, and report what WOULD be booked — no QBO calls.
// Writes the full business/review detail to data/review-output.json (gitignored) for inspection.

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadTransactions, type Txn } from './parse.ts';
import { classify, type Disposition } from './classify.ts';

const INCORP_DATE = '2025-08-15'; // before → startup cost via Due to Shareholder

interface Line extends Txn {
  disposition: Disposition;
  vendor?: string;
  account?: string;
  note?: string;
  period: 'pre-incorp' | 'post-incorp';
}

function fmt(n: number): string {
  return n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Collapse a description to a merchant-ish key so recurring charges group together
// (e.g. "SHOPPERS DRUG MART 939" / "SHOPPERS DRUG MART #13" → "SHOPPERS DRUG MART").
function merchantKey(desc: string): string {
  return desc
    .toUpperCase()
    .replace(/\d+(\.\d+)?\s*(USD|CAD|EUR|KRW|GBP)?(\s*@\s*[\d.]+)?/g, ' ')
    .replace(/[^A-Z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 3)
    .join(' ');
}

export async function runParse(dataDir: string, opts: { showPersonal?: boolean } = {}): Promise<void> {
  const txns = await loadTransactions(dataDir);
  const lines: Line[] = txns.map((t) => {
    const c = classify(t.description);
    return { ...t, ...c, period: t.date < INCORP_DATE ? 'pre-incorp' : 'post-incorp' };
  });

  const byDisp = (d: Disposition) => lines.filter((l) => l.disposition === d);
  const sum = (ls: Line[]) => ls.reduce((s, l) => s + l.amount, 0);

  const business = byDisp('business');
  const review = byDisp('review');
  const personal = byDisp('personal');
  const excluded = byDisp('excluded');

  console.log(`\nParsed ${txns.length} transactions from ${dataDir}\n`);

  // Business by account
  console.log('BUSINESS — would post (Dr expense / Cr Due to Shareholder where personally paid):');
  const byAccount = new Map<string, { vendors: Set<string>; total: number; n: number }>();
  for (const l of business) {
    const k = l.account ?? '?';
    const e = byAccount.get(k) ?? { vendors: new Set(), total: 0, n: 0 };
    e.total += l.amount; e.n += 1; if (l.vendor) e.vendors.add(l.vendor);
    byAccount.set(k, e);
  }
  for (const [acct, e] of [...byAccount].sort()) {
    console.log(`  ${acct}  $${fmt(e.total).padStart(11)}  (${e.n})  ${[...e.vendors].join(', ')}`);
  }
  console.log(`  ────  business total: $${fmt(sum(business))}  (${business.length} lines)`);
  console.log(`        pre-incorp (→ Due to Shareholder / startup): $${fmt(sum(business.filter((l) => l.period === 'pre-incorp')))}`);
  console.log(`        post-incorp: $${fmt(sum(business.filter((l) => l.period === 'post-incorp')))}`);

  // Review
  console.log(`\nREVIEW — needs a treatment decision (${review.length} lines, $${fmt(sum(review))}):`);
  const reviewByVendor = new Map<string, { total: number; n: number; note?: string }>();
  for (const l of review) {
    const k = l.vendor ?? '?';
    const e = reviewByVendor.get(k) ?? { total: 0, n: 0, note: l.note };
    e.total += l.amount; e.n += 1;
    reviewByVendor.set(k, e);
  }
  for (const [v, e] of reviewByVendor) console.log(`  ${v}: $${fmt(e.total)} (${e.n}) — ${e.note ?? ''}`);

  // Personal / excluded (aggregate only — no itemizing of personal lines, §6)
  console.log(`\nPERSONAL — left off the books: ${personal.length} lines, $${fmt(sum(personal))} (not itemized).`);
  console.log(`EXCLUDED — payments/fees/transfers: ${excluded.length} lines.`);

  // Recurring personal merchants — local hint to catch a business vendor the rules missed.
  const recur = new Map<string, { n: number; total: number }>();
  for (const l of personal) {
    const k = merchantKey(l.description);
    const e = recur.get(k) ?? { n: 0, total: 0 };
    e.n += 1; e.total += l.amount;
    recur.set(k, e);
  }
  const top = [...recur].filter(([, e]) => e.n >= 3).sort((a, b) => b[1].n - a[1].n).slice(0, 15);
  if (top.length) {
    console.log('\nRecurring personal merchants (≥3×) — confirm none are actually business:');
    for (const [k, e] of top) console.log(`  ${String(e.n).padStart(3)}×  $${fmt(e.total).padStart(10)}  ${k}`);
  }

  // Write detail for business + review only (not personal) to a gitignored file
  const out = lines
    .filter((l) => l.disposition === 'business' || l.disposition === 'review')
    .map(({ date, description, amount, source, vendor, account, disposition, period, note }) => ({
      date, source, vendor, account, disposition, period, amount, description, note,
    }));
  const outPath = join(dataDir, 'review-output.json');
  await writeFile(outPath, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${out.length} business+review lines to ${outPath} (gitignored) for your review.`);

  if (opts.showPersonal) {
    // Local-only dump so Frederick can scan for business vendors the rules don't know yet.
    // Gitignored — never committed (§6).
    const personalOut = personal.map(({ date, source, amount, description }) => ({ date, source, amount, description }));
    const pPath = join(dataDir, 'personal-output.json');
    await writeFile(pPath, JSON.stringify(personalOut, null, 2));
    console.log(`Wrote ${personalOut.length} personal lines to ${pPath} (gitignored) — scan for any business vendor I missed.`);
  } else {
    console.log('Personal lines omitted from output. Re-run with --show-personal to dump them locally for review.');
  }
  console.log('');
}
