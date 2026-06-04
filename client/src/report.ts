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

export async function runParse(dataDir: string): Promise<void> {
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

  // Write detail for business + review only (not personal) to a gitignored file
  const out = lines
    .filter((l) => l.disposition === 'business' || l.disposition === 'review')
    .map(({ date, description, amount, source, vendor, account, disposition, period, note }) => ({
      date, source, vendor, account, disposition, period, amount, description, note,
    }));
  const outPath = join(dataDir, 'review-output.json');
  await writeFile(outPath, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${out.length} business+review lines to ${outPath} (gitignored) for your review.`);
  console.log('Personal lines are intentionally omitted from the output file.\n');
}
