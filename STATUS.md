# Status — Meshentics QBO bookkeeping

_Snapshot: 2026-06-05 ~15:30 EDT. Overwrite this section each session so work can resume cold._

## ▶ Resume here (prioritized next steps)

_Note: `--commit` must be passed as `npm run qbo <cmd> -- --commit` (the `--` separator;
without it npm swallows the flag and you get a silent dry-run)._

1. **Go to PRODUCTION.** Sandbox is fully validated (see rollup). To run the real books:
   in the Intuit app → **Keys & credentials → Production** tab (you may need to complete
   the app's required fields first); set `QBO_ENVIRONMENT=production` + the Production
   `QBO_CLIENT_ID/SECRET` in `client/.env`; `npm run qbo authurl` → authorize against the
   **real Meshentics company** → `exchange` → `ping`.
2. **Load the COA into the real company:** `npm run qbo load-coa -- --commit`
   (skips the 3 CIBC GL accounts already created live + any QBO defaults).
3. **Run the catch-up (→ 2300 Due to Shareholder):** drop **personal-card CSVs only**
   (Amex/BMO/personal Visa — **NOT** the corporate CIBC export; the feed owns that) in
   `client/data/` → `npm run qbo parse -- --show-personal` (review split) →
   `npm run qbo post -- --commit`.
4. **In QBO "For Review":** categorize the 1 pending chequing item (2025-09-24
   "CANADIAN OUTLET" $20.00 on …1011); accept feed items going forward.
5. **After the new 2026 card (2110) is activated:** connect its CIBC feed and map to the
   card GL account. (Not connectable today — card was only mailed 2026-06-05.)
6. **Provision the GCS secured store** for source docs + OAuth secrets (backlog S6).

## Current rollup

**Done**
- Architecture decided + recorded: [ADRs 0001–0004](decisions/) (repo as audit home, QBO API/OAuth, GCS storage, FYE July 31).
- Corporate facts confirmed ([company-profile.md](company-profile.md)): incorporated **2025-08-15** (federal CBCA, Ontario), FYE **July 31**, first spend **~May 2025**.
- **CRA fully set up:** BN `777028630`, RC0001 (income tax), RT0001 (GST/HST, effective **2026-05-05**), email notifications on.
- QBO **company file exists**; settings to verify (FY start month = August, BN, no multicurrency) + sales tax to configure — not yet done.
- Catch-up method = **vendor-first** ([catch-up-plan.md](catch-up-plan.md)); business/personal vendor calls finalized ([vendor-classification.md](vendor-classification.md)).
- **Client tooling complete & SANDBOX-validated end-to-end (2026-06-05)** ([client/](client/)):
  Intuit dev app registered (`Meshentics Bookkeeping`), connected to a **Canadian sandbox**
  company. `load-coa -- --commit` created 27 accounts (8 QBO defaults skipped, 0 failed) —
  all account types/subtypes accepted. `post -- --commit` created 4 catch-up JEs from a
  synthetic CSV (Dr expense / Cr 2300), and re-run skipped all 4 (**idempotency confirmed**).
  8 unit tests pass. Secrets in `client/.env` + `client/.tokens.json` (both gitignored).
- **CIBC bank feeds connected (2026-06-05, via Claude-for-Chrome)** — both corporate
  chequing accounts linked, history back to **2024-06-06** (CIBC ~24-month limit), nothing
  accepted. Chrome created 3 GL accounts live by name: `CIBC Chequing - Corporate`,
  `CIBC Chequing - Corporate 2`, `CIBC Credit Card - Corporate`. COA loader updated to
  match (added `1010` chequing-2, `2110` 2026 card) — [client/src/coa.ts](client/src/coa.ts), [chart-of-accounts.md](chart-of-accounts.md).
- **Feeds are NOT the catch-up engine.** The corporate accounts have almost no history
  (1 chequing txn total). Meshentics has run on Frederick's **personal cards → 2300**, so
  the catch-up is the **API/CLI 2300 reconstruction** ([post.ts](client/src/post.ts): Dr expense / Cr 2300, never
  touches the fed accounts → no double-book). **Guardrail: only personal-card CSVs in `client/data/`.**

**Not done (PRODUCTION side)**
- Nothing done on the **real Meshentics company** yet: not connected, COA not loaded,
  **no months closed, nothing posted.** (All validation so far is in the throwaway sandbox.)
- Production Intuit keys not yet used; real-company settings not verified (FY start = August,
  BN, no multicurrency); sales tax/HST not configured. GCS store not provisioned.
- **Corporate credit card:** no active card yet (only the 2110 card mailed 2026-06-05,
  not activated) — no card feed possible until it's live.

## Open items
- **For Frederick:** register Intuit app (blocker); drop CSVs in `client/data/`; confirm **Uber/taxi** treatment (transport vs personal — currently personal).
- **For Mike (year-end):** see [mike-review-queue.md](mike-review-queue.md) — HST backdate, FYE confirm, startup costs, trademark/IP, meals 50%, GST self-assess, salary vs dividends, transport/commuting, card-interest mechanism.
- **Full backlog:** [backlog.md](backlog.md).

## Key docs
[backlog.md](backlog.md) · [company-profile.md](company-profile.md) · [chart-of-accounts.md](chart-of-accounts.md) · [vendor-classification.md](vendor-classification.md) · [catch-up-plan.md](catch-up-plan.md) · [mike-review-queue.md](mike-review-queue.md) · [decisions/](decisions/) · [client/README.md](client/README.md) · charter: [docs/meshentics-bookkeeping-CLAUDE.md](docs/meshentics-bookkeeping-CLAUDE.md)
