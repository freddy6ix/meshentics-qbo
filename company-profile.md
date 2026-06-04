# Company profile — Meshentics Technologies Inc.

Canonical, **non-PII** corporate facts that drive bookkeeping treatment and the chart
of accounts. Confirmed facts only; open items are marked. **No balances, financial
account numbers, government ID numbers, keys/passwords, or personal data here (§6)** —
those live only in the secured store (see [ADR-0003](decisions/0003-source-doc-storage.md)).

_Last updated: 2026-06-04 EDT. Source: incorporation document set provided by Frederick._

| Fact | Value | Source / status |
|------|-------|-----------------|
| Legal entity | Meshentics Technologies Inc. | Certificate of Incorporation |
| Type | Federal corporation under the CBCA; operating company building Roux | Certificate of Incorporation; charter §1 |
| Jurisdiction of incorporation | Canada (federal, CBCA) | Articles of Incorporation |
| **Incorporation date** | **2025-08-15** | Certificate of Incorporation |
| Extra-provincial registration | **Ontario**, effective 2025-08-15; commenced ON business 2025-08-15 | Ontario Initial Return |
| Registered office | Toronto, Ontario | Form 2 (street address withheld — coincides with principal's residence) |
| Share structure | Unlimited common shares; transfer-restricted (board/shareholder approval) | Articles of Incorporation |
| Director(s) | Frederick Ferguson — sole director, resident Canadian | Form 2 |
| Controlling shareholder | Frederick Ferguson — holds >75% directly, individually | Initial ISC return |
| **Fiscal year-end** | **July 31** (recommended; first FY 2025-08-15 → 2026-07-31) | [ADR-0004](decisions/0004-fiscal-year-end.md) — delegated to agent; not locked until first T2 |
| **HST registration** | **Registered (ITCs recoverable)** | Confirmed by Frederick 2026-06-04 |
| **First Meshentics spend** | **~May 2025** (pre-incorporation) → catch-up start | Confirmed by Frederick 2026-06-04 |
| Federal corporation number | _On file_ (public registry id) | Certificate of Incorporation — number kept out of repo per §6 |
| Ontario Corporation Number (OCN/BIN) | _On file_ (public registry id) | Ontario registration — number kept out of repo per §6 |
| CRA Business Number (BN) | _Issued; in secured store_ | Incorporation "what's next" email |
| CRA program account — corporate income tax (RC) | **Active (RC0001)** | Incorporation "what's next" email |
| CRA program account — GST/HST (RT) | **Active — RT0001, confirmed 2026-06-04** (number in secured store; email notifications enabled) | CRA registration-success email 2026-06-04 |
| CRA program account — payroll (RP) | **OPEN** — confirm whether one exists | Charter §8.6 |
| **HST effective date** | **2026-05-05** (voluntary; earliest the online form allowed — 30-day backdate cap) — *backdate to 2025-08-15 pending Mike's review, see [mike-review-queue.md](mike-review-queue.md)* | CRA My Business Account 2026-06-04 |
| Personal accounts to ingest as sources | **Multiple** personal credit + debit cards (specific list OPEN — enumerate per-account as statements arrive) | Confirmed by Frederick 2026-06-04 |
| Corporate accounts | CIBC corporate chequing (active); **new CIBC corporate credit card** being issued ~week of 2026-06-04 (go-forward source) | Confirmed by Frederick 2026-06-04 |

## Entity separation (charter §5 — never violate)

- **Meshentics Technologies Inc.** — these books (operating company).
- **Salon Lyol = 9937609 Canada Inc.** — a *separate* corporation, a platform tenant;
  different QBO company, different books. Never commingle.
  - ⚠️ *Hygiene note:* the incorporation confirmation email was addressed to
    `accounting@salonlyol.ca`. Consider a Meshentics-domain admin mailbox so corporate
    correspondence for the operating company doesn't route through a tenant's domain.
- **Frederick (shareholder)** — not an entity on these books; his personal accounts are
  a *source* of Meshentics transactions (business lines only cross over).

## Implications of confirmed facts

- **Catch-up period: May 2025 → present.** First Meshentics spend was ~May 2025, all
  pre-incorporation and personally funded. Months May–mid-Aug 2025 are personal-only;
  corporate (CIBC) activity begins at/after 2025-08-15. See [catch-up-plan.md](catch-up-plan.md).
- **Pre-/post-incorporation boundary = 2025-08-15.** Meshentics-related spend *before*
  2025-08-15 → **startup costs funded by the shareholder loan (→ Due to Shareholder)**,
  per CRA startup-cost treatment (Mike validates at year-end). Spend *from 2025-08-15*
  → ordinary corporate expenses (CIBC-paid normal; personally-paid still → Due to
  Shareholder until reimbursed). Charter §4.
- **First fiscal year: 2025-08-15 → 2026-07-31** (~11.5 months; [ADR-0004](decisions/0004-fiscal-year-end.md)).
  First T2 due **2027-01-31**. The catch-up should be current well ahead of that, and
  ideally before the 2026-07-31 close so Mike's first year-end review runs on clean books.
- **HST timing — material flag.** Registered **effective 2026-05-05**. ITCs are
  claimable only from that date forward, so **the entire catch-up period (May 2025 →
  early May 2026) is pre-registration** — HST paid on those costs is expense cost, **not
  recoverable**, *unless* the effective date is backdated to incorporation (2025-08-15).
  Because that backdate would cover essentially the whole first fiscal year, it's
  potentially worth real money — escalated for Mike ([mike-review-queue.md](mike-review-queue.md)).
  Note: ITCs on capital property still **on hand** at 2026-05-05 are claimable regardless.
- **Federal annual return** (corporate-law filing, **not** a tax return) window opens
  2026: file between 08-15 and 10-14 each year. Track separately from tax.
- **HST registrant** — ITCs recoverable from the registration effective date forward;
  HST paid before that date is part of expense cost. Need the effective date + RT number.
- **Single director / single controlling shareholder** — keeps the shareholder-loan
  (*Due to Shareholder*) accounting clean: one counterparty, Frederick.
