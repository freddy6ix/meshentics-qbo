# Product backlog — Meshentics QBO bookkeeping

Single place to track everything outstanding so nothing from a session is lost.
**Interim home** — to be migrated to a **GitHub Project** later (items are written as
discrete, portable units: ID, area, priority, status, notes). No PII here (§6).

_Created 2026-06-04 EDT (end of session 1)._

**Priority:** P0 now / critical-path · P1 soon · P2 later · P3 someday
**Status:** ☐ Todo · ◐ In progress · ⛔ Blocked · ✅ Done

---

## Setup & infrastructure

| ID | Item | Pri | Status | Notes |
|----|------|-----|--------|-------|
| S1 | Verify QBO company settings | P0 | ☐ | Company file exists. Confirm: **fiscal year first month = August** (FYE Jul 31), **BN 777028630** entered, **multicurrency OFF**. Gear → Account & settings → Advanced. |
| S2 | Set up QBO Sales Tax (HST) | P0 | ☐ | Ontario, **annual** filing, **effective 2026-05-05**, RT0001. Taxes menu. |
| S3 | Register Intuit Developer app + OAuth | P0 | ✅ | App **`Meshentics Bookkeeping`** registered (AppID `6ae53bdf…`); **Development** keys in `client/.env`; connected to a **Canadian sandbox** (2026-06-05). **Production** keys not yet used. |
| S4 | Build QBO API client | P0 | ✅ | Built + **sandbox-validated end-to-end (2026-06-05)**: `load-coa -- --commit` → 27 accounts, 0 failed; `post -- --commit` → 4 JEs, re-run idempotent. (Flag needs `-- ` separator.) |
| S5 | Load chart of accounts into QBO via API | P1 | ✅ | **DONE 2026-06-06** — loaded into the real Meshentics company (27 created, 8 existing skipped, 0 failed). |
| S6 | Provision secured GCS bucket + secret store | P1 | ☐ | `gs://…-qbo-meshentics/`, IAM-walled, dedicated project, **6-yr retention** (CRA), Secret Manager for OAuth tokens. [ADR-0003](decisions/0003-source-doc-storage.md). Confirm exact bucket name/project. |
| S7 | Disable Claude-for-Chrome "Act without asking" in QBO | P1 | ☐ | Seen in HIGH-RISK auto-act mode in live books; we book via API, not browser auto-actions. |

## Catch-up (vendor-first method)

| ID | Item | Pri | Status | Notes |
|----|------|-----|--------|-------|
| C1 | Adopt vendor-first catch-up method | P0 | ◐ | Corporate chequing was barely used + no corp card historically → catch-up is ~all shareholder-funded SaaS on personal cards; no corporate bank to reconcile. Rewrite [catch-up-plan.md](catch-up-plan.md) accordingly (proposed & tentatively accepted — confirm). |
| C2 | Finalize vendor list | P0 | ◐ | Known: GCP/Google, Anthropic, OpenAI, Resend, Auth0, Google Workspace, Cloudflare, GoDaddy, USPTO, Intuit/QBO + "many more." Complete it. |
| C3 | Gather vendor receipts from Gmail | P0 | ⛔ | **Offered; awaiting Frederick's go.** Search scoped to vendor billing senders, May 2025 → now → exact dates/amounts/HST. Keep figures in secured store, not repo. |
| C4 | Identify Meshentics business lines from personal cards | P0 | ✅ | **Done 2026-06-06.** 1,758 txns ingested across 5 cards (TD, BMO MC+Visa, CIBC, RBC, Amex). PDF extractors built ([tools/extract_td.py](client/tools/extract_td.py), [extract_bmo.py](client/tools/extract_bmo.py)) — every statement reconciles to the penny (TD 428, BMO 239). RBC + normalized-CSV parsers added. **Business $5,914.08/122 lines**, review $4,075 (Mike), personal $33,445. Transport→personal (M9). Tiny gap: current BMO/TD cycle (~May 26→now) not statemented. |
| C5 | Determine specific personal accounts in scope | P1 | ☐ | Which cards/debit accounts carried Meshentics charges. Per-account as we work. |
| C6 | Build shareholder-loan startup-cost schedule | P1 | ☐ | By month/vendor/category, with HST. Lives in **secured store** (has figures), not repo. |
| C7 | Post catch-up entries via API | P1 | ✅ | **DONE 2026-06-06.** Posted **122 JEs / $5,914.08** (Dr expense / Cr **2300**) to the real Meshentics company; verified idempotent. REVIEW items ($4,075) held for Mike. |

## Chart of accounts refinements

| ID | Item | Pri | Status | Notes |
|----|------|-----|--------|-------|
| A1 | Add OpenAI to AI/LLM API cost line | P2 | ☐ | Alongside Anthropic (acct ~5010). |
| A2 | Add USPTO trademark account/treatment | P2 | ☐ | Likely intangible/startup cost (Class 14.1?) not regular expense → see Mike (M8). |
| A3 | Map remaining vendors to accounts | P2 | ☐ | Google Workspace → software/subs; Cloudflare/GoDaddy → domains/DNS. Refine once real data seen. |
| A4 | Add new CIBC corporate credit card account | P1 | ✅ | Acct **2110** added to `coa.ts` + doc (card mailed 2026-06-05). **Not activated yet** → no card bank-feed possible until live; connect feed then. Also added **1010** (2nd corporate chequing). |
| A5 | Resolve duplicate shareholder account | P1 | ☐ | **Found 2026-06-06:** the real company has a pre-existing **"Shareholder Loan" $2,917.63** (Credit Card type) *separate* from our **2300 Due to Shareholder** ($5,914.08, verified). Merge into 2300 or explain — ask Mike. Also reconcile small artifacts: GST/HST Payable −$11.19, CIBC Chequing $250 (QBO) vs bank. |

## Mike (CPA) — year-end / first T2

Tracked in [mike-review-queue.md](mike-review-queue.md). Summary: HST backdate (2026-05-05→2025-08-15)
· confirm FYE July 31 · pre-incorp startup-cost treatment · incorporation-cost $3k rule
· meals 50% · GST/HST self-assessment on US digital services · salary vs. dividends (→ RP/RZ)
· **USPTO trademark treatment (add).**

## Go-forward / ongoing

| ID | Item | Pri | Status | Notes |
|----|------|-----|--------|-------|
| G1 | Establish ongoing monthly-close cadence | P2 | ☐ | After catch-up. Corporate card/chequing as reconciled source. |
| G2 | Decide salary vs. dividends → register RP/RZ if needed | P2 | ☐ | Drives payroll (RP) / info-returns (RZ) accounts. Mike. |
| G3 | Harvest QBO API client into Roux product | P3 | ☐ | Dogfood → product feature (§10). |

## Security & PII follow-ups

| ID | Item | Pri | Status | Notes |
|----|------|-----|--------|-------|
| P1 | Move keys/PII to secured store | P1 | ☐ | Federal corp key, Ontario company key (these are **passwords**), BN, SIN, DOB, address. Never in repo. |
| P2 | Consider safeguarding/rotating company keys | P2 | ☐ | Transmitted via email/chat this session; treat as exposed. |
| P3 | Entity-separation email hygiene | P3 | ☐ | Meshentics incorporation mail routed to `accounting@salonlyol.ca`; consider a Meshentics-domain admin mailbox. |

## Process / meta

| ID | Item | Pri | Status | Notes |
|----|------|-----|--------|-------|
| X1 | Migrate this backlog to a GitHub Project | P2 | ☐ | Items are written to port cleanly (area = label, priority/status = fields). |
| X2 | Keep backlog current each session | P0 | ◐ | Update at end of each working session. |

---

## ✅ Done this session (for the record)

- Foundations + architecture recorded: [ADR-0001](decisions/0001-foundations.md) (repo as audit home, conventions), [ADR-0002](decisions/0002-qbo-interface.md) (QBO API/OAuth), [ADR-0003](decisions/0003-source-doc-storage.md) (GCS storage), [ADR-0004](decisions/0004-fiscal-year-end.md) (FYE July 31).
- Confirmed facts → [company-profile.md](company-profile.md): incorporated **2025-08-15** (federal CBCA, Ontario), FYE **July 31**, first spend **~May 2025**.
- CRA: BN **777028630**, **RC0001** (income tax), **RT0001** (GST/HST, effective 2026-05-05) all active; email notifications on.
- Drafted [chart-of-accounts.md](chart-of-accounts.md), [catch-up-plan.md](catch-up-plan.md), [mike-review-queue.md](mike-review-queue.md).
- Decided personal accounts never become QBO accounts / never bank-fed.

## ✅ Done session 2 (2026-06-05)

- **Intuit dev app registered + connected to a Canadian sandbox**; full API path
  validated: `load-coa` (27 accounts, 0 failed) + `post` (4 JEs, idempotent). [S3, S4]
- **CIBC corporate chequing bank feeds connected** (via Claude-for-Chrome): both deposit
  accounts (…1011, …4904), history back to **2024-06-06** (~24 mo), nothing accepted.
  1 item pending review (2025-09-24 "CANADIAN OUTLET" $20 on …1011).
- **Confirmed no active corporate credit card** — only the 2110 card mailed 2026-06-05
  (not activated). No card feed possible until live.
- COA: added **1010** (2nd chequing) + **2110** (2026 card) to loader & doc. [A4]
- **Plan refined:** corporate accounts have ~no history → catch-up is the personal-card →
  **2300** reconstruction via the API pipeline. Feeds handle going-forward only. [C1]
- Next: **production** — Production keys → authorize real Meshentics company → `load-coa`,
  then `post` once real personal-card CSVs are in `client/data/`.

## ✅ Done session 3 (2026-06-06)

- **Ingested & classified the full catch-up dataset** [C4 ✅]: 1,758 txns from 5 personal
  cards. Built TD + BMO **PDF statement extractors** with penny-perfect reconciliation
  against each statement's printed balance (TD 428, BMO MC+Visa 239). Added **RBC** and
  **normalized-CSV** parsers to parse.ts. Fixed BMO foreign-currency merchant extraction.
- **Business total $5,914.08 / 122 lines** → 2300; review $4,075 (Mike: interest $2,953,
  USPTO $882, Apple $240); personal $33,445; excluded 141. 8/8 unit tests pass.
- **Local transport reclassified personal/commuting** (184 lines/$2,834) pending Mike (M9).
- Known minor gap: current statement cycle (~May 26→now) for TD/BMO; removed partial BMO
  csv (had GitHub/Sentry/GoDaddy in that window) to avoid double-count — re-download recent
  BMO csv to recover. New tools: [client/tools/](client/tools/).

## ✅ Done session 4 (2026-06-06) — PRODUCTION GO-LIVE

- **Posted the catch-up to the real Meshentics books** [S5 ✅, C7 ✅]. Completed Intuit's
  production app-assessment (EULA + privacy pages via GitHub Pages; ~6-tab compliance
  questionnaire), unlocked production keys, connected the live company via the OAuth
  Playground redirect (production blocks `localhost`). Loaded COA (27 created) + posted
  **122 JEs / $5,914.08** (Dr expense / Cr 2300), verified idempotent.
- Added `intuit_tid` capture to error handling ([qbo.ts](client/src/qbo.ts)).
- **Next:** verify in QBO; fix FY start month → August (S1); configure HST (S2); Mike's
  review items ($4,075); optional BMO current-cycle re-download.
