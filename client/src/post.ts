// Posts catch-up business lines as journal entries: Dr expense / Cr Due to Shareholder
// (every line is on a personal card, so the corp owes Frederick). Refunds reverse direction.
//
// Dry-run by default (offline, no API): prints what would post. --commit fetches accounts
// and creates the entries. Only 'business' lines post; 'review'/'personal' are skipped.
//
// Idempotent: each entry carries a stable MESH-CATCHUP key in PrivateNote; --commit skips
// any key already present in QBO, so it is safe to re-run / resume after a partial failure.

import { loadTransactions } from './parse.ts';
import { classify } from './classify.ts';
import { getAccounts, getJournalEntries, createJournalEntry } from './qbo.ts';

const DUE_TO_SHAREHOLDER_NUM = '2300';

interface Intent {
  date: string;
  account: string;
  vendor: string;
  source: string;
  amount: number; // signed: + charge, - refund
}

// Stable dedupe key (also stored in PrivateNote) so --commit is idempotent.
function intentKey(i: Intent): string {
  return `MESH-CATCHUP ${i.source} ${i.date} ${Math.abs(i.amount).toFixed(2)} ${i.vendor}`;
}

function buildIntents(txns: Awaited<ReturnType<typeof loadTransactions>>): Intent[] {
  const intents: Intent[] = [];
  for (const t of txns) {
    const c = classify(t.description);
    if (c.disposition !== 'business' || !c.account || t.amount === 0) continue;
    intents.push({ date: t.date, account: c.account, vendor: c.vendor ?? '', source: t.source, amount: t.amount });
  }
  return intents;
}

export async function postCatchup(dataDir: string, opts: { commit?: boolean } = {}): Promise<void> {
  const intents = buildIntents(await loadTransactions(dataDir));
  console.log(`\n${intents.length} business lines to post (Dr expense / Cr ${DUE_TO_SHAREHOLDER_NUM} Due to Shareholder).`);

  if (!opts.commit) {
    for (const i of intents) {
      console.log(`  ${i.date}  ${i.account}  ${i.amount >= 0 ? 'Dr' : 'Cr'} ${Math.abs(i.amount).toFixed(2).padStart(10)}  ${i.vendor} (${i.source})`);
    }
    console.log('\nDry run — nothing posted. Re-run with --commit to create these journal entries.\n');
    return;
  }

  // Commit path: resolve account numbers → QBO Ids.
  const accounts = await getAccounts();
  const idByNum = new Map<string, string>();
  for (const a of accounts) if (a.AcctNum) idByNum.set(String(a.AcctNum), String(a.Id));
  const dueId = idByNum.get(DUE_TO_SHAREHOLDER_NUM);
  if (!dueId) throw new Error(`Account ${DUE_TO_SHAREHOLDER_NUM} (Due to Shareholder) not found — run load-coa --commit first.`);

  // Idempotency: skip any entry already posted (matched by MESH-CATCHUP key in PrivateNote).
  const alreadyPosted = new Set(
    (await getJournalEntries()).map((j) => String(j.PrivateNote ?? '')).filter((n) => n.startsWith('MESH-CATCHUP')),
  );

  let posted = 0, skipped = 0, duplicate = 0, failed = 0;
  for (const i of intents) {
    const key = intentKey(i);
    if (alreadyPosted.has(key)) { duplicate++; continue; }

    const expId = idByNum.get(i.account);
    if (!expId) { skipped++; console.log(`  skip ${i.date} ${i.vendor}: account ${i.account} not in QBO`); continue; }

    const amount = Math.abs(i.amount);
    const expenseIsDebit = i.amount > 0; // charge → Dr expense; refund → Cr expense
    const desc = `${i.vendor} (${i.source})`;
    const je = {
      TxnDate: i.date,
      PrivateNote: key,
      Line: [
        { Amount: amount, DetailType: 'JournalEntryLineDetail', Description: desc,
          JournalEntryLineDetail: { PostingType: expenseIsDebit ? 'Debit' : 'Credit', AccountRef: { value: expId } } },
        { Amount: amount, DetailType: 'JournalEntryLineDetail', Description: desc,
          JournalEntryLineDetail: { PostingType: expenseIsDebit ? 'Credit' : 'Debit', AccountRef: { value: dueId } } },
      ],
    };
    try {
      await createJournalEntry(je);
      posted++;
      if (posted % 25 === 0) console.log(`  ...${posted} posted`);
    } catch (e) {
      failed++; console.log(`  ✗ ${i.date} ${i.vendor}: ${(e as Error).message}`);
    }
  }
  console.log(`\nPosted ${posted}, already-present ${duplicate}, skipped ${skipped}, failed ${failed}.\n`);
}
