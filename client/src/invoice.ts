// Recurring DoWhat subscription invoice: Meshentics → Salon Lyol, $150/month + 13% HST, Net 30.
// Booked to 4000 Roux Subscription Revenue. Dry-run by default; --commit creates in QBO.
// Idempotent: each invoice carries a stable DOWHAT <period> key in PrivateNote — --commit
// skips a period already invoiced, so it is safe to re-run.

import { query, getAccounts, getInvoices, createCustomer, createItem, createInvoice, sendInvoice } from './qbo.ts';

const CUSTOMER = '9937609 Canada Inc. dba Salon Lyol';
const CUSTOMER_EMAIL = 'accounting@salonlyol.ca';
const ITEM = 'DoWhat';
const PRICE = 150;
const INCOME_ACCT_NUM = '4000'; // Roux Subscription Revenue
const HST_RATE = 0.13;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function periodLabel(period: string): string {
  const [y, m] = period.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
const key = (period: string) => `DOWHAT ${period}`;

async function findFirst(entity: string, field: string, value: string): Promise<any> {
  const r = await query(`select * from ${entity} where ${field} = '${value.replace(/'/g, "\\'")}'`);
  return (r?.QueryResponse?.[entity] ?? [])[0];
}

export async function runInvoice(period: string, opts: { commit?: boolean } = {}): Promise<void> {
  if (!/^\d{4}-\d{2}$/.test(period)) throw new Error(`Bad period "${period}" — expected YYYY-MM (e.g. 2026-06).`);
  const label = periodLabel(period);
  const tax = (PRICE * HST_RATE);
  console.log(`\nDoWhat subscription invoice — ${CUSTOMER}`);
  console.log(`  Period:  ${label}   Date: ${period}-01   Terms: Net 30`);
  console.log(`  Line:    ${ITEM} subscription — ${label}   $${PRICE.toFixed(2)} → 4000 Roux Subscription Revenue`);
  console.log(`  HST ON:  $${tax.toFixed(2)} (13%)`);
  console.log(`  Total:   $${(PRICE + tax).toFixed(2)}`);
  console.log(`  Email:   ${CUSTOMER_EMAIL}`);

  if (!opts.commit) {
    console.log('\nDry run — nothing created/sent. Re-run with --commit to create + email the invoice.\n');
    return;
  }

  // Find-or-create the customer, and make sure its billing email is set.
  let customer = await findFirst('Customer', 'DisplayName', CUSTOMER);
  if (!customer) {
    customer = (await createCustomer({ DisplayName: CUSTOMER, PrimaryEmailAddr: { Address: CUSTOMER_EMAIL } })).Customer;
    console.log(`  ✓ created customer "${CUSTOMER}" <${CUSTOMER_EMAIL}>`);
  } else if (customer.PrimaryEmailAddr?.Address !== CUSTOMER_EMAIL) {
    customer = (await createCustomer({ Id: customer.Id, SyncToken: customer.SyncToken, sparse: true, PrimaryEmailAddr: { Address: CUSTOMER_EMAIL } })).Customer;
    console.log(`  ✓ set customer email <${CUSTOMER_EMAIL}>`);
  }

  // Create the invoice if this period isn't already invoiced (else reuse it).
  let invoice = (await getInvoices()).find((i) => String(i.PrivateNote ?? '').startsWith(key(period)));
  if (invoice) {
    console.log(`  invoice ${invoice.DocNumber ?? invoice.Id} already exists for ${label}`);
  } else {
    const incomeAcct = (await getAccounts()).find((a) => String(a.AcctNum) === INCOME_ACCT_NUM);
    if (!incomeAcct) throw new Error(`Income account ${INCOME_ACCT_NUM} not found — run load-coa --commit first.`);
    const taxCode = (await query('select * from TaxCode')).QueryResponse?.TaxCode?.find((t: any) => t.Name === 'HST ON');
    if (!taxCode) throw new Error('Tax code "HST ON" not found — is sales tax set up?');
    const term = (await query('select * from Term')).QueryResponse?.Term?.find((t: any) => t.Name === 'Net 30');
    let item = await findFirst('Item', 'Name', ITEM);
    if (!item) {
      item = (await createItem({ Name: ITEM, Type: 'Service', Taxable: true, IncomeAccountRef: { value: incomeAcct.Id } })).Item;
      console.log(`  ✓ created service item "${ITEM}" → ${incomeAcct.Name}`);
    }
    invoice = (await createInvoice({
      CustomerRef: { value: customer.Id },
      TxnDate: `${period}-01`,
      GlobalTaxCalculation: 'TaxExcluded',
      PrivateNote: key(period),
      ...(term ? { SalesTermRef: { value: term.Id } } : {}),
      Line: [{
        DetailType: 'SalesItemLineDetail',
        Amount: PRICE,
        Description: `${ITEM} subscription — ${label}`,
        SalesItemLineDetail: { ItemRef: { value: item.Id }, Qty: 1, UnitPrice: PRICE, TaxCodeRef: { value: taxCode.Id } },
      }],
    })).Invoice;
    console.log(`  ✓ created invoice ${invoice.DocNumber ?? invoice.Id} — total $${invoice.TotalAmt} (due ${invoice.DueDate})`);
  }

  // Email it (unless already emailed).
  if (invoice.EmailStatus === 'EmailSent') {
    console.log(`  already emailed; skipping send`);
  } else {
    await sendInvoice(invoice.Id, CUSTOMER_EMAIL);
    console.log(`  ✓ emailed invoice ${invoice.DocNumber ?? invoice.Id} to ${CUSTOMER_EMAIL}`);
  }
  console.log();
}
