# Catch-up plan — Meshentics Technologies Inc.

Month-by-month catch-up from the first Meshentics spend (~**May 2025**) to present.
**Close each month before advancing; flag any month with missing source docs rather
than guess** (charter §4/§9). One audit file per month under [audit/](audit/), created
from [audit/_TEMPLATE.md](audit/_TEMPLATE.md) as each month is worked.

_Created 2026-06-04 EDT._

## Boundaries that shape each month

- **Incorporation: 2025-08-15.** Before → startup costs via **Due to Shareholder**;
  from then → ordinary corporate expenses. ([company-profile.md](company-profile.md))
- **HST effective date: 2026-05-05.** So the **entire catch-up period is pre-registration**
  → HST on those costs is expense cost, no ITCs — unless Mike backdates to 2025-08-15
  ([mike-review-queue.md](mike-review-queue.md)).
- **First fiscal year: 2025-08-15 → 2026-07-31** ([ADR-0004](decisions/0004-fiscal-year-end.md)).

## Sources by period

- **May 2025 → 2025-08-14 (pre-incorporation):** personal cards/accounts only → every
  business line books to **Due to Shareholder (2300)**.
- **2025-08-15 onward:** CIBC corporate chequing + (existing) corporate credit card,
  **plus** still-some personal payments → those personal ones continue to 2300.
- **~week of 2026-06-04 onward:** new CIBC corporate credit card becomes a go-forward source.

> **Rule — personal accounts never become QBO accounts and are never bank-fed.** Most of
> their activity is personal (§4/§6); bulk-importing it would pollute the corporate books
> and expose PII. Only the **specific Meshentics business lines** are journaled in,
> crediting **Due to Shareholder (2300)** — everything else stays off the books. Only the
> **corporate** CIBC chequing + credit card(s) exist as QBO accounts; even there, watch for
> the occasional personal/shareholder item (→ 2300).

## Month ledger

| Month | Phase | Status | Notes |
|-------|-------|--------|-------|
| 2025-05 | Pre-incorp (personal) | ⬜ Not started | First spend. Personal-only → 2300. |
| 2025-06 | Pre-incorp (personal) | ⬜ Not started | Personal-only → 2300. |
| 2025-07 | Pre-incorp (personal) | ⬜ Not started | Personal-only → 2300. |
| 2025-08 | Boundary month | ⬜ Not started | Split at 2025-08-15: pre = startup→2300; post = corporate begins. |
| 2025-09 | Corporate | ⬜ Not started | |
| 2025-10 | Corporate | ⬜ Not started | |
| 2025-11 | Corporate | ⬜ Not started | |
| 2025-12 | Corporate | ⬜ Not started | |
| 2026-01 | Corporate | ⬜ Not started | |
| 2026-02 | Corporate | ⬜ Not started | |
| 2026-03 | Corporate | ⬜ Not started | |
| 2026-04 | Corporate | ⬜ Not started | |
| 2026-05 | Corporate | ⬜ Not started | Last fully-elapsed month. |
| 2026-06 | Ongoing | ⬜ Current | Partial; transition catch-up → ongoing monthly close. |

Status legend: ⬜ Not started · 🟦 In progress · ✅ Closed · ⚠️ Closed with flagged gaps.

## Per-month routine (charter §9)

1. Pull source docs for the month into the secured store (statements, invoices).
2. Identify Meshentics business lines across **all** sources (corporate + personal).
3. Split business vs. personal — only business lines cross from personal accounts.
4. Book: CIBC-paid → normal; personally-paid → **Due to Shareholder (2300)**;
   pre-incorp business costs → startup costs via 2300.
5. Reconcile to statement balances.
6. Close the month; record treatments/decisions in `audit/YYYY-MM.md` (no PII).
7. Flag missing docs; advance.

## Critical path to first booking

1. ⬜ Stand up the QBO company file; load the [chart of accounts](chart-of-accounts.md);
   enable the Sales Tax (HST) module with the effective date.
2. ⬜ Register the Intuit Developer app + OAuth ([ADR-0002](decisions/0002-qbo-interface.md)).
3. ⬜ Provision the secured GCS store + secret storage ([ADR-0003](decisions/0003-source-doc-storage.md)).
4. ⬜ Ingest May 2025 source docs → work and close 2025-05 → advance.
