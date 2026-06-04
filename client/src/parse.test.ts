// Synthetic tests for the three card-format adapters. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBySource } from './parse.ts';

test('CIBC headerless: debit=expense(+), credit=refund(-)', () => {
  const csv = '2025-05-13,"COMPOSIO COMPOSIO.DEV, CA",41.47,,4500XXXX5057\n2025-06-01,"PAYMENT THANK YOU",,100.00,4500XXXX5057\n';
  const t = parseBySource(csv, 'cibc', 'cibc.csv');
  assert.equal(t.length, 2);
  assert.equal(t[0].date, '2025-05-13');
  assert.equal(t[0].amount, 41.47);
  assert.equal(t[1].amount, -100); // credit column → negative
});

test('Amex: MM/DD/YYYY dates, charges +, payments -', () => {
  const csv =
    'Date,Description,Amount,Extended Details,Appears On Your Statement As,Address,City/State,Zip Code,Country,Reference,Category\n' +
    '04/06/2026,ANTHROPIC,201.24,"multi\nline",ANTHROPIC,addr,SF,94107,US,ref1,Computer\n' +
    '06/01/2026,ONLINE PAYMENT,-1000.00,d,P,addr,SF,94107,US,ref2,Other\n';
  const t = parseBySource(csv, 'amex', 'amex.csv');
  assert.equal(t[0].date, '2026-04-06');
  assert.equal(t[0].amount, 201.24);
  assert.equal(t[1].amount, -1000);
});

test('BMO: skip preamble, YYYYMMDD dates', () => {
  const csv =
    'Following data is valid as of 20260604:\n\n' +
    'Item #,Card #,Transaction Date,Posting Date,Transaction Amount,Description\n' +
    '1,X,20260531,20260601,66.18,GITHUB INC. SAN FRANCISCO CA\n';
  const t = parseBySource(csv, 'bmo', 'bmo.csv');
  assert.equal(t.length, 1);
  assert.equal(t[0].date, '2026-05-31');
  assert.equal(t[0].amount, 66.18);
  assert.equal(t[0].description, 'GITHUB INC. SAN FRANCISCO CA');
});
