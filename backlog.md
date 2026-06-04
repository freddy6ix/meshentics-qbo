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
| S3 | Register Intuit Developer app + OAuth | P0 | ☐ | **Frederick — runbook in [client/README.md](client/README.md).** Intuit account → client ID/secret, redirect URI `http://localhost:8000/callback`, scope `com.intuit.quickbooks.accounting`. |
| S4 | Build QBO API client | P0 | ◐ | **Foundation built** in [client/](client/): OAuth + token refresh + `ping` (connection verified by typecheck/smoke test). **Remaining:** `load-coa` and `post` (journal entries → Due to Shareholder). Test in Intuit **sandbox** first. |
| S5 | Load chart of accounts into QBO via API | P1 | ☐ | From [chart-of-accounts.md](chart-of-accounts.md). After S4. |
| S6 | Provision secured GCS bucket + secret store | P1 | ☐ | `gs://…-qbo-meshentics/`, IAM-walled, dedicated project, **6-yr retention** (CRA), Secret Manager for OAuth tokens. [ADR-0003](decisions/0003-source-doc-storage.md). Confirm exact bucket name/project. |
| S7 | Disable Claude-for-Chrome "Act without asking" in QBO | P1 | ☐ | Seen in HIGH-RISK auto-act mode in live books; we book via API, not browser auto-actions. |

## Catch-up (vendor-first method)

| ID | Item | Pri | Status | Notes |
|----|------|-----|--------|-------|
| C1 | Adopt vendor-first catch-up method | P0 | ◐ | Corporate chequing was barely used + no corp card historically → catch-up is ~all shareholder-funded SaaS on personal cards; no corporate bank to reconcile. Rewrite [catch-up-plan.md](catch-up-plan.md) accordingly (proposed & tentatively accepted — confirm). |
| C2 | Finalize vendor list | P0 | ◐ | Known: GCP/Google, Anthropic, OpenAI, Resend, Auth0, Google Workspace, Cloudflare, GoDaddy, USPTO, Intuit/QBO + "many more." Complete it. |
| C3 | Gather vendor receipts from Gmail | P0 | ⛔ | **Offered; awaiting Frederick's go.** Search scoped to vendor billing senders, May 2025 → now → exact dates/amounts/HST. Keep figures in secured store, not repo. |
| C4 | Identify Meshentics business lines from personal cards | P0 | ◐ | Frederick downloaded all CC transactions. **Most are personal** — extract only business lines. Use as cross-check vs. vendor receipts. |
| C5 | Determine specific personal accounts in scope | P1 | ☐ | Which cards/debit accounts carried Meshentics charges. Per-account as we work. |
| C6 | Build shareholder-loan startup-cost schedule | P1 | ☐ | By month/vendor/category, with HST. Lives in **secured store** (has figures), not repo. |
| C7 | Post catch-up entries via API | P1 | ☐ | Dr expense / Cr **Due to Shareholder (2300)**. After S4–S6 + C6. Organize by month for audit (§9). |

## Chart of accounts refinements

| ID | Item | Pri | Status | Notes |
|----|------|-----|--------|-------|
| A1 | Add OpenAI to AI/LLM API cost line | P2 | ☐ | Alongside Anthropic (acct ~5010). |
| A2 | Add USPTO trademark account/treatment | P2 | ☐ | Likely intangible/startup cost (Class 14.1?) not regular expense → see Mike (M8). |
| A3 | Map remaining vendors to accounts | P2 | ☐ | Google Workspace → software/subs; Cloudflare/GoDaddy → domains/DNS. Refine once real data seen. |
| A4 | Add new CIBC corporate credit card account | P1 | ☐ | Acct 2110, on issuance (~week of 2026-06-04). Go-forward source. |

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
