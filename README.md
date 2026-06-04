# meshentics-qbo

Bookkeeping system of record for **Meshentics Technologies Inc.** — a federal
Canadian corporation, the operating company building **Roux** (salon-management
SaaS). This repo holds the **reasoning, decisions, and audit trail** for bringing
Meshentics' QuickBooks Online (QBO) books current and keeping them current.

> **No PII lives here.** Raw statements, account numbers, and personal financial
> lines never enter this repo, git history, or any markdown. This repo records
> *treatments and reasoning* only (e.g. "expense X → Due to Shareholder, per CRA
> startup-cost treatment") — never the underlying numbers. See
> [docs/meshentics-bookkeeping-CLAUDE.md §6](docs/meshentics-bookkeeping-CLAUDE.md).

## Layout

| Path | Purpose |
|------|---------|
| [docs/meshentics-bookkeeping-CLAUDE.md](docs/meshentics-bookkeeping-CLAUDE.md) | The project charter / mandate. Read first. |
| [company-profile.md](company-profile.md) | Canonical non-PII corporate facts (incorporation, FYE, HST, sources, entity separation) that drive treatment. |
| [chart-of-accounts.md](chart-of-accounts.md) | Draft chart of accounts for the QBO company file. |
| [catch-up-plan.md](catch-up-plan.md) | Month-by-month catch-up roadmap (May 2025 → present) + critical path. |
| [backlog.md](backlog.md) | Product backlog — everything outstanding (interim home before a GitHub Project). |
| [mike-review-queue.md](mike-review-queue.md) | Running list of treatments/decisions to validate with Mike (CPA) at year-end. |
| [decisions/](decisions/) | Architecture Decision Records (ADRs) — one file per decision, with rationale. |
| [audit/](audit/) | Append-only audit logs, **one file per calendar month**. Template: [audit/_TEMPLATE.md](audit/_TEMPLATE.md). |

## Status (as of 2026-06-04 EDT)

Catch-up bookkeeping is **not yet started**. Current phase: foundations.

- ✅ Audit-trail home decided ([ADR-0001](decisions/0001-foundations.md)) — this repo.
- ✅ Working conventions recorded ([ADR-0001](decisions/0001-foundations.md)).
- ✅ QBO interface decided ([ADR-0002](decisions/0002-qbo-interface.md)) — real QBO API / OAuth 2.0.
- ✅ Source-doc storage decided ([ADR-0003](decisions/0003-source-doc-storage.md)) — IAM-walled GCS bucket.
- ✅ Confirmed facts ([company-profile.md](company-profile.md)): **incorporated 2025-08-15**
      (federal CBCA, registered in **Ontario**), HST **registered**, CRA corporate-income-tax
      account **RC0001** active, first spend **~May 2025**.
- ✅ **Fiscal year-end July 31** recommended/adopted ([ADR-0004](decisions/0004-fiscal-year-end.md));
      first FY 2025-08-15 → 2026-07-31, first T2 due 2027-01-31.
- ✅ Draft [chart of accounts](chart-of-accounts.md) and [catch-up plan](catch-up-plan.md) (May 2025 → present).
- ✅ **GST/HST (RT0001) account active** (confirmed 2026-06-04), **effective 2026-05-05**
      (backdate to 2025-08-15 pending Mike — [mike-review-queue.md](mike-review-queue.md)).
      CRA email notifications enabled.
- ⏳ **Gating facts** still needed (§8): payroll (RP) account if/when salary, the specific
      personal accounts to ingest.
- ✅ QBO company file exists ("Meshentics Technologies Inc."); settings to verify + chart of accounts not yet loaded (see [backlog.md](backlog.md) S1–S5).
- 🔁 Catch-up method pivoted to **vendor-first** (corporate account barely used historically; nearly all spend is shareholder-funded SaaS on personal cards).
- ❌ No months closed.

## Conventions (summary)

- **Toronto time** on every timestamp, explicitly labelled **EDT** or **EST**
  (query the system clock; never compute the offset by hand).
- **Strict entity separation** — Meshentics ≠ Salon Lyol (a separate corp /
  platform tenant) ≠ Frederick (shareholder). Never commingle.
- **Catch-up runs month by month**; each month is closed before advancing, and
  any month with missing source docs is flagged rather than guessed.
