// Chart-of-accounts definitions + loader. Mirrors ../chart-of-accounts.md.
// NOTE: AccountType/AccountSubType use the QBO API enums; a few subtypes may need a
// tweak on first run against a live company — the loader reports per-account failures.
// GST/HST control accounts and Retained Earnings are managed by QBO, so not created here.

import { getAccounts, createAccount } from './qbo.ts';

export interface AccountDef {
  num: string;
  name: string;
  type: string;
  subType: string;
}

export const ACCOUNTS: AccountDef[] = [
  { num: '1000', name: 'CIBC Chequing - Corporate', type: 'Bank', subType: 'Checking' },
  { num: '1010', name: 'CIBC Chequing - Corporate 2', type: 'Bank', subType: 'Checking' },
  { num: '1100', name: 'Accounts Receivable', type: 'Accounts Receivable', subType: 'AccountsReceivable' },
  { num: '1200', name: 'Prepaid Expenses', type: 'Other Current Asset', subType: 'PrepaidExpenses' },
  { num: '1500', name: 'Computer & Office Equipment', type: 'Fixed Asset', subType: 'OtherFixedAssets' },
  { num: '1510', name: 'Accumulated Depreciation', type: 'Fixed Asset', subType: 'AccumulatedDepreciation' },
  { num: '2000', name: 'Accounts Payable', type: 'Accounts Payable', subType: 'AccountsPayable' },
  { num: '2100', name: 'CIBC Credit Card - Corporate', type: 'Credit Card', subType: 'CreditCard' },
  { num: '2110', name: 'CIBC Credit Card - Corporate (2026)', type: 'Credit Card', subType: 'CreditCard' },
  { num: '2300', name: 'Due to Shareholder - Frederick Ferguson', type: 'Other Current Liability', subType: 'OtherCurrentLiabilities' },
  { num: '2400', name: 'Payroll Liabilities', type: 'Other Current Liability', subType: 'OtherCurrentLiabilities' },
  { num: '2500', name: 'Corporate Income Tax Payable', type: 'Other Current Liability', subType: 'OtherCurrentLiabilities' },
  { num: '3000', name: 'Common Shares', type: 'Equity', subType: 'OwnersEquity' },
  { num: '4000', name: 'Roux Subscription Revenue', type: 'Income', subType: 'ServiceFeeIncome' },
  { num: '4900', name: 'Other Income', type: 'Other Income', subType: 'OtherMiscellaneousIncome' },
  { num: '5000', name: 'Cloud Infrastructure - GCP', type: 'Cost of Goods Sold', subType: 'OtherCostsOfServiceCos' },
  { num: '5010', name: 'AI / LLM API', type: 'Cost of Goods Sold', subType: 'OtherCostsOfServiceCos' },
  { num: '5020', name: 'Email & Communications', type: 'Cost of Goods Sold', subType: 'OtherCostsOfServiceCos' },
  { num: '5030', name: 'Authentication', type: 'Cost of Goods Sold', subType: 'OtherCostsOfServiceCos' },
  { num: '6000', name: 'Software & Subscriptions', type: 'Expense', subType: 'DuesSubscriptions' },
  { num: '6010', name: 'Domains & DNS', type: 'Expense', subType: 'OfficeGeneralAdministrativeExpenses' },
  { num: '6100', name: 'Professional Fees - Accounting', type: 'Expense', subType: 'LegalProfessionalFees' },
  { num: '6110', name: 'Professional Fees - Legal', type: 'Expense', subType: 'LegalProfessionalFees' },
  { num: '6120', name: 'Incorporation & Registration Fees', type: 'Expense', subType: 'LegalProfessionalFees' },
  { num: '6200', name: 'Contractors', type: 'Expense', subType: 'OfficeGeneralAdministrativeExpenses' },
  { num: '6300', name: 'Advertising & Marketing', type: 'Expense', subType: 'AdvertisingPromotional' },
  { num: '6400', name: 'Bank Charges', type: 'Expense', subType: 'BankCharges' },
  { num: '6410', name: 'Interest Expense', type: 'Expense', subType: 'OtherMiscellaneousServiceCost' },
  { num: '6500', name: 'Office Supplies', type: 'Expense', subType: 'SuppliesMaterials' },
  { num: '6600', name: 'Meals & Entertainment', type: 'Expense', subType: 'EntertainmentMeals' },
  { num: '6610', name: 'Travel', type: 'Expense', subType: 'Travel' },
  { num: '6700', name: 'Telephone & Internet', type: 'Expense', subType: 'Utilities' },
  { num: '6800', name: 'Insurance', type: 'Expense', subType: 'Insurance' },
  { num: '6900', name: 'Dues & Memberships', type: 'Expense', subType: 'DuesSubscriptions' },
  { num: '7000', name: 'Foreign Exchange Gain/Loss', type: 'Other Expense', subType: 'OtherMiscellaneousExpense' },
];

export async function loadCoa(opts: { commit?: boolean } = {}): Promise<void> {
  if (!opts.commit) {
    console.log(`\nDry run — ${ACCOUNTS.length} accounts defined (existing ones are skipped at commit):`);
    for (const a of ACCOUNTS) console.log(`  ${a.num}  ${a.name}  [${a.type} / ${a.subType}]`);
    console.log('\nGST/HST + Retained Earnings are managed by QBO (not created here).');
    console.log('Re-run with --commit to create these in QBO. (Enable "Account numbers" in QBO settings first.)\n');
    return;
  }

  const existing = await getAccounts();
  const byName = new Set(existing.map((a) => String(a.Name ?? '').toLowerCase()));
  const byNum = new Set(existing.map((a) => a.AcctNum).filter(Boolean).map(String));

  let created = 0, skipped = 0, failed = 0;
  for (const a of ACCOUNTS) {
    if (byName.has(a.name.toLowerCase()) || byNum.has(a.num)) {
      skipped++; console.log(`  skip ${a.num} ${a.name} (exists)`); continue;
    }
    try {
      await createAccount({ Name: a.name, AcctNum: a.num, AccountType: a.type, AccountSubType: a.subType });
      created++; console.log(`  ✓ ${a.num} ${a.name}`);
    } catch (e) {
      failed++; console.log(`  ✗ ${a.num} ${a.name}: ${(e as Error).message}`);
    }
  }
  console.log(`\nCreated ${created}, skipped ${skipped}, failed ${failed}.\n`);
}
