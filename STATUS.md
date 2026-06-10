# Status — Meshentics QBO bookkeeping

_Snapshot: 2026-06-06 ~10:40 EDT. Overwrite this section each session so work can resume cold._

## ▶ Resume here (prioritized next steps)

_Note: `--commit` must be passed as `npm run qbo <cmd> -- --commit` (the `--` separator;
without it npm swallows the flag and you get a silent dry-run)._

**🎉 CATCH-UP POSTED & VERIFIED on the real Meshentics company (production).** Connected to
the live company (realm `…0477`), loaded COA (27 created), posted the catch-up + deposits.
Final **2300 Due to Shareholder = $7,786.10** (verified live): $5,914.08 personal-card
expenses + $750 shareholder deposits ($250 + $500) + $1,122.02 USPTO/Apple. **CIBC Chequing
= $750.** Production is in `client/.env` (`QBO_ENVIRONMENT=production`, Playground redirect).
`post -- --commit` is idempotent (re-run skips existing).

**💵 REVENUE STARTED (2026-06-06).** Built `npm run qbo invoice [YYYY-MM] [-- --commit]` —
recurring DoWhat invoice **Meshentics → 9937609 Canada Inc. dba Salon Lyol, $150/mo + 13%
HST, Net 30** → acct 4000. The command now **creates + emails** in one shot (to
`accounting@salonlyol.ca`), idempotent per month (won't double-bill or re-send). First
invoice (#150, June 2026, $169.50) **created and emailed** ✅. Each month: `npm run qbo
invoice -- --commit`. Related-party rate: $150 is prevailing market rate (Mike queue item 11).

1. ✅ **VERIFIED + CLEANED UP (2026-06-06).** Found the company was NOT empty: a prior
   Claude-for-Chrome session had entered **18 Aug-Sep 2025 expense Purchases ($2,667.63)**
   via a separate **"Shareholder Loan"** account — double-counting our catch-up. Removed all
   18, recategorized the $250 deposit → 2300, added the **$500 e-transfer (2026-04-27)** →
   2300, deactivated "Shareholder Loan" (now $0), GST/HST back to $0. Posted **USPTO →6110**
   and **Apple →6000** (business per Frederick) — 6 new JEs. Books balance; no duplicates.
2. ✅ **FY start month set to August (2026-06-06)** via Claude-for-Chrome. Books unchanged
   (verified: 2300 still $7,786.10). Still confirm BN entered + multicurrency off.
3. ⛔ **HST/Sales Tax — DO NOT touch yet (S2).** Found already configured (CRA agency,
   GST/HST # matches, HST ON 13%) but with **Quarterly** filing (vs our assumed Annual) and
   **periods open from Aug 1 2025** (vs RT0001 effective 2026-05-05 — implies a backdate was
   already set up). Two Mike/CRA decisions first: (a) confirm CRA-assigned filing frequency
   from the RT0001 registration; (b) the HST backdate decision (2025-08-15 vs 2026-05-05).
   Then reconcile QBO to match. Safe to wait — catch-up JEs have no tax codes.
4. **REVIEW item left for Mike** ($2,953, NOT posted): **card interest** (M10) — decide the
   business-attributable portion, then flip its classify rule `review`→`business` and re-post.
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
- **CPA access set up (2026-06-10):** Michael Bloomberg / M Bloomberg Professional Corp (CPA).
  **Meshentics QBO** — invited as accountant (*Invited*, pending acceptance; 2nd of 2 firm slots).
  **Salon Lyol QBO** — already Active (separate entity, §5). **CRA** — authorized as representative,
  **Level 2 · all accounts · no expiry** (online), name-match verified against the firm's BN.

**Not done (PRODUCTION side)**
- Real-company **settings not verified**: FY start month still **January** (should be August),
  BN, no multicurrency; **Sales Tax/HST not configured**. GCS store not provisioned.
- **REVIEW items not posted** ($4,075: card interest, USPTO, Apple) — pending Mike.
- Current statement cycle (~May 26→now) for TD/BMO not yet captured.
- **Corporate credit card:** no active card yet (only the 2110 card mailed 2026-06-05,
  not activated) — no card feed possible until it's live.

## Open items
- **For Frederick:** **send Articles of Incorporation + BN to Mike** (his item 1; items 2 CRA-rep & 3 QBO-invite done 2026-06-10); confirm **Uber/taxi** treatment (transport vs personal — currently personal).
- **SR&ED opportunity** flagged by Mike (2026-06-10) → [mike-review-queue.md](mike-review-queue.md) item 12. Roux R&D may qualify for refundable credits; start R&D time/cost tracking. Mike "to get back" on one other treatment item.
- **For Mike (year-end):** see [mike-review-queue.md](mike-review-queue.md) — HST backdate, FYE confirm, startup costs, trademark/IP, meals 50%, GST self-assess, salary vs dividends, transport/commuting, card-interest mechanism.
- **Full backlog:** [backlog.md](backlog.md).

## Key docs
[backlog.md](backlog.md) · [company-profile.md](company-profile.md) · [chart-of-accounts.md](chart-of-accounts.md) · [vendor-classification.md](vendor-classification.md) · [catch-up-plan.md](catch-up-plan.md) · [mike-review-queue.md](mike-review-queue.md) · [decisions/](decisions/) · [client/README.md](client/README.md) · charter: [docs/meshentics-bookkeeping-CLAUDE.md](docs/meshentics-bookkeeping-CLAUDE.md)
