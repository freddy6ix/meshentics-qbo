# Chart of accounts (draft v1) — Meshentics Technologies Inc.

A small SaaS operating corporation (Ontario CCPC, HST registrant). Designed for QBO.
**Draft** — refine once the HST effective date lands and the first month's real
transactions are seen. CRA treatments flagged here are validated by Mike at year-end
([charter §7](docs/meshentics-bookkeeping-CLAUDE.md)); they are not guessed mid-stream.

Numbering: 1000s assets · 2000s liabilities · 3000s equity · 4000s revenue ·
5000s cost of revenue · 6000s operating expenses · 7000s other. Account numbers are
optional in QBO but recommended — they keep reports ordered and stable.

> **Sales tax (HST) is handled by QBO's Sales Tax module**, not hand-rolled accounts.
> Enabling it auto-creates the GST/HST payable/suspense accounts and tracks ITCs from
> the registration effective date. The 1300/2200 rows below are placeholders for what
> that module manages — do not post to them manually.

## 1000 — Assets

| # | Account | QBO type | Notes |
|---|---------|----------|-------|
| 1000 | CIBC Chequing — Corporate | Bank | The corporate operating account. |
| 1010 | CIBC Chequing — Corporate 2 | Bank | Second corporate chequing account (opened ~2026-06; $0 opening). |
| 1100 | Accounts Receivable | Accounts receivable (A/R) | Roux subscription invoices, when billing starts. |
| 1200 | Prepaid Expenses | Other current asset | Annual subscriptions/insurance paid up front. |
| 1300 | GST/HST Receivable (ITCs) | *(managed by Sales Tax module)* | Do not post manually. |
| 1500 | Computer & Office Equipment | Fixed asset | Only if capital assets are bought; else expense. |
| 1510 | Accumulated Depreciation | Fixed asset (contra) | Pairs with 1500. |

## 2000 — Liabilities

| # | Account | QBO type | Notes |
|---|---------|----------|-------|
| 2000 | Accounts Payable | Accounts payable (A/P) | Vendor bills outstanding. |
| 2100 | CIBC Credit Card — Corporate | Credit card | Existing corporate card. |
| 2110 | CIBC Credit Card — Corporate (2026) | Credit card | New card mailed 2026-06-05; in COA loader. Activate, then post once first transaction lands. |
| 2200 | GST/HST Payable | *(managed by Sales Tax module)* | Do not post manually. |
| **2300** | **Due to Shareholder — Frederick Ferguson** | **Other current liability** | **Key account.** Credit = corp owes Frederick. All personally-paid Meshentics costs and pre-incorp startup costs credit here. Single shareholder → clean. |
| 2400 | Payroll Liabilities | Other current liability | Placeholder; activate only if payroll (RP account) starts. |
| 2500 | Corporate Income Tax Payable | Other current liability | Set at year-end with Mike. |

## 3000 — Equity

| # | Account | QBO type | Notes |
|---|---------|----------|-------|
| 3000 | Common Shares | Equity | Nominal paid-in capital on incorporation. |
| 3900 | Retained Earnings | Equity | QBO system account. |
| 3950 | Dividends Declared | Equity | Only if/when dividends are paid (vs. salary — a Mike decision). |

## 4000 — Revenue

| # | Account | QBO type | Notes |
|---|---------|----------|-------|
| 4000 | Roux Subscription Revenue | Income | SaaS subscription income (platform-side; never a tenant's books — §1/§5). |
| 4900 | Other Income | Income | Misc. non-operating income. |

## 5000 — Cost of Revenue (platform & infrastructure)

Grouped separately to give gross-margin visibility as Roux scales (§1). Classifying
these as cost-of-revenue vs. operating expense is a presentation choice — confirm with
Mike; either way the deductibility is the same.

| # | Account | QBO type | Notes |
|---|---------|----------|-------|
| 5000 | Cloud Infrastructure — GCP | Cost of goods sold | `salon-mgmt-app-2026`. Likely USD-billed (see FX note). |
| 5010 | AI / LLM API — Anthropic | Cost of goods sold | USD-billed. |
| 5020 | Email Delivery — Resend | Cost of goods sold | |
| 5030 | Authentication — Auth0 | Cost of goods sold | USD-billed. |

## 6000 — Operating expenses

| # | Account | QBO type | Notes |
|---|---------|----------|-------|
| 6000 | Software & Subscriptions | Expense | Tooling not part of cost-of-revenue. |
| 6010 | Domains & DNS | Expense | GoDaddy → Cloudflare; `dowhat.{ca,pro,salon}` + existing domains (§4). |
| 6100 | Professional Fees — Accounting | Expense | Mike / CPA. |
| 6110 | Professional Fees — Legal | Expense | |
| 6120 | Incorporation & Registration Fees | Expense | First $3,000 of incorporation costs are deductible; track separately — Mike confirms. |
| 6200 | Contractors / Subcontractors | Expense | Watch for T4A/T5018 reporting thresholds. |
| 6300 | Advertising & Marketing | Expense | |
| 6400 | Bank Charges | Expense | |
| 6410 | Interest Expense | Expense | |
| 6500 | Office Supplies | Expense | |
| 6600 | Meals & Entertainment | Expense | **50% deductible** for tax — book gross, adjust at year-end (Mike). |
| 6610 | Travel | Expense | |
| 6700 | Telephone & Internet | Expense | |
| 6800 | Insurance | Expense | |
| 6900 | Dues & Memberships | Expense | |

## 7000 — Other

| # | Account | QBO type | Notes |
|---|---------|----------|-------|
| 7000 | Foreign Exchange Gain/Loss | Other expense | See FX note. |

## Cross-cutting treatment notes

- **Due to Shareholder (2300) is the backbone of the catch-up.** Until a corporate
  account is the payer, the entry pattern is: *Dr* expense (5000/6000…), *Cr* 2300.
  CIBC-paid items debit the expense and credit the bank/credit-card account normally.
- **Foreign exchange.** GCP, Anthropic, Auth0, and registrars are likely USD-billed.
  Simplest and accurate: **book the CAD amount as posted on the CIBC statement** (the
  card has already converted, FX baked into cost). For direct USD bank payments, convert
  at the transaction-date rate; differences flow to 7000.
- **HST on US digital services.** Non-resident suppliers may or may not charge GST/HST.
  Where charged and shown → claim the ITC. Where not → as a fully-taxable registrant the
  self-assessment for inputs used in commercial activity generally nets to nil — **flag
  to Mike** rather than self-assessing mid-stream.
- **Pre-registration HST** (incl. all May–mid-Aug 2025 personal spend before the HST
  effective date) is **part of expense cost, not a recoverable ITC.**
