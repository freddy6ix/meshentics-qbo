# Status — Meshentics QBO bookkeeping

_Snapshot: 2026-06-06 ~10:40 EDT. Overwrite this section each session so work can resume cold._

## ▶ Resume here (prioritized next steps)

_Note: `--commit` must be passed as `npm run qbo <cmd> -- --commit` (the `--` separator;
without it npm swallows the flag and you get a silent dry-run)._

**🎉 CATCH-UP IS POSTED to the real Meshentics company (production).** Connected to the
live company (realm `…0477`), loaded the COA (27 created), and posted **122 journal
entries / $5,914.08** (Dr expense / Cr 2300). Idempotent — re-running posts nothing.
Production is connected in `client/.env` (`QBO_ENVIRONMENT=production`, Playground redirect).

1. ✅ **VERIFIED in QBO (2026-06-06):** Balance Sheet as of Jun 6 2026 shows **Due to
   Shareholder - Frederick Ferguson = $5,914.08** — exact match to the catch-up total.
   **Cleanup:** a separate pre-existing **"Shareholder Loan" $2,917.63** (Credit Card type)
   account also exists — not posted to by us; merge into 2300 or explain (ask Mike). Small
   feed artifacts to reconcile: GST/HST Payable −$11.19, CIBC Chequing shows $250 vs bank.
2. **Fix the fiscal year** (backlog S1): QBO Account & settings → Advanced → **First month
   of fiscal year = August** (currently January; FYE is July 31). Also confirm BN + no
   multicurrency, and configure **Sales Tax/HST** (S2).
3. **REVIEW items for Mike** ($4,075 — NOT yet posted): card interest $2,953 (M10),
   USPTO/trademark $882 (M8), Apple $240 (hardware vs services). Decide treatment, then
   post the agreed portions (the classify rules can be flipped from `review`→`business`).
4. **(Optional, small) Recover the current BMO cycle.** The partial `BMO statement.csv`
   was removed (it double-counted the statements) but uniquely held ~May 26→Jun 3 2026,
   incl. a few business charges (GitHub/Sentry/GoDaddy). Re-download BMO **Mastercard**
   transactions for **May 26 2026 → today** as CSV → drop in `client/data/` → re-run `post
   -- --commit` (idempotent, only the new lines post). TD's current cycle has no CSV option.
5. **In QBO "For Review":** categorize the 1 pending chequing item (2025-09-24
   "CANADIAN OUTLET" $20.00 on …1011); accept feed items going forward.
7. **After the 2026 card (2110) is activated:** connect its CIBC feed → card GL account.
8. **Provision the GCS secured store** for source docs + OAuth secrets (backlog S6).

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

- **Catch-up data INGESTED & classified (2026-06-06).** 1,758 txns across 5 personal cards
  (TD Aeroplan, BMO Mastercard + Visa, CIBC Visa, RBC Visa, Amex). Built PDF extractors
  ([client/tools/extract_td.py](client/tools/extract_td.py), [extract_bmo.py](client/tools/extract_bmo.py)) — **every statement reconciles to the
  printed balance to the penny** (TD 428, BMO 239). Added RBC + normalized-CSV parsers to
  [parse.ts](client/src/parse.ts). Result: **business $5,914.08 / 122 lines** (→2300), review $4,075 (Mike),
  personal $33,445, excluded 141. Local transport reclassified personal/commuting (Mike M9).
  Raw statements stay gitignored.
- **🎉 POSTED TO PRODUCTION (2026-06-06).** Completed Intuit's app-assessment (EULA/privacy
  pages on GitHub Pages, compliance questionnaire), unlocked production keys, connected the
  **real Meshentics Technologies Inc.** company via the Playground redirect. Loaded COA
  (27 created) and **posted 122 journal entries / $5,914.08** (Dr expense / Cr 2300),
  verified idempotent. Added `intuit_tid` capture to error handling ([qbo.ts](client/src/qbo.ts)).

**Not done (PRODUCTION side)**
- Real-company **settings not verified**: FY start month still **January** (should be August),
  BN, no multicurrency; **Sales Tax/HST not configured**. GCS store not provisioned.
- **REVIEW items not posted** ($4,075: card interest, USPTO, Apple) — pending Mike.
- Current statement cycle (~May 26→now) for TD/BMO not yet captured.
- **Corporate credit card:** no active card yet (only the 2110 card mailed 2026-06-05,
  not activated) — no card feed possible until it's live.

## Open items
- **For Frederick:** register Intuit app (blocker); drop CSVs in `client/data/`; confirm **Uber/taxi** treatment (transport vs personal — currently personal).
- **For Mike (year-end):** see [mike-review-queue.md](mike-review-queue.md) — HST backdate, FYE confirm, startup costs, trademark/IP, meals 50%, GST self-assess, salary vs dividends, transport/commuting, card-interest mechanism.
- **Full backlog:** [backlog.md](backlog.md).

## Key docs
[backlog.md](backlog.md) · [company-profile.md](company-profile.md) · [chart-of-accounts.md](chart-of-accounts.md) · [vendor-classification.md](vendor-classification.md) · [catch-up-plan.md](catch-up-plan.md) · [mike-review-queue.md](mike-review-queue.md) · [decisions/](decisions/) · [client/README.md](client/README.md) · charter: [docs/meshentics-bookkeeping-CLAUDE.md](docs/meshentics-bookkeeping-CLAUDE.md)
