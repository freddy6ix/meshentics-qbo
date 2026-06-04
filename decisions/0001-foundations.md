# ADR-0001 — Foundations: audit-trail home, structure, and working conventions

- **Status:** Accepted (foundations) / Open items pending Frederick
- **Date:** 2026-06-04 EDT
- **Decider:** Bookkeeping agent (architecture delegated per charter §3)
- **Charter:** [docs/meshentics-bookkeeping-CLAUDE.md](../docs/meshentics-bookkeeping-CLAUDE.md)

---

## Context

The charter (§3) delegates the architecture of the bookkeeping system to the agent,
with the requirement that each decision be written down with its rationale and
revisited as we learn. We are starting from near-zero (§2): a QBO subscription
exists, but no company file, chart of accounts, ingested docs, or closed months.

This ADR records the decisions that are unambiguously the agent's to make and are
stable regardless of later choices. Decisions that the charter tells us to raise
with Frederick (§8 gating facts, §10 QBO-interface) are listed under "Open
decisions" and are **not** settled here.

---

## Decisions

### 1. Audit-trail / project-memory home → this repo (`meshentics-qbo`)

The audit trail, decisions, and project memory live in this dedicated repo,
**separate from the product repo** (`salon-mgmt-app`).

**Rationale.** (a) Entity separation (§5) — Meshentics' books must never be
entangled with Salon Lyol's or any tenant's; a dedicated repo enforces that at the
filesystem boundary. (b) The repo is already purpose-named and otherwise empty.
(c) Version-controlled reasoning gives an auditable history of treatments and
decisions without storing any PII. (d) Supersedes the prior-art proposal to keep
the audit log inside the product repo (`docs/qbo-audit/meshentics/`), which the
charter explicitly marks as optional, not binding.

### 2. Repository structure

- `docs/` — the charter and any reference material.
- `decisions/` — ADRs, one file per decision (`NNNN-slug.md`), append-only history.
- `audit/` — monthly audit logs, **one file per calendar month**
  (`YYYY-MM.md`), per charter §9. Template at `audit/_TEMPLATE.md`.

### 3. Working conventions

- **No PII in the repo, ever** (§6). Raw statements, account numbers, balances, and
  personal financial lines stay in the chosen secured storage (see Open decision B).
  The repo records treatments and reasoning only.
- **Toronto time** on every timestamp, labelled **EDT** (mid-March → early Nov) or
  **EST** otherwise (§9). Query the system clock; never compute the offset by hand.
- **Month-by-month catch-up** from the first 2025 Meshentics spend; close each month
  before advancing; **flag** any month with missing source docs rather than guess (§4).
- **CRA treatments are flagged for Mike (CPA) to validate at year-end**, not guessed
  mid-stream (§7). Mike validates; he does not pick account names or cadence in-flight.
- **Personally-paid pre-incorporation Meshentics costs → _Due to Shareholder_**
  (shareholder-loan contra), per CRA startup-cost treatment, pending Mike's year-end
  validation (§4).

### 4. Automation level → operate manually through catch-up (provisional)

Begin the catch-up by operating manually rather than building tooling first. Revisit
once the QBO-interface decision (Open decision A) is made — the charter's §10
strategic note may justify investing in the QBO API path that Roux needs anyway.

**Rationale.** We do not yet know volume, the QBO interface, or the source-doc
pipeline; building automation now would be premature. Manual operation through the
first month or two will surface the real shape of the work.

---

## Open decisions — RESOLVED 2026-06-04 EDT

**A. QBO interface (charter §10).** → **Resolved: real QBO API / OAuth 2.0
integration.** See [ADR-0002](0002-qbo-interface.md).

**B. Source-document storage (charter §3/§6).** → **Resolved: IAM-walled GCS bucket.**
See [ADR-0003](0003-source-doc-storage.md).

**Gating facts (charter §8).** Confirmed 2026-06-04 — see
[company-profile.md](../company-profile.md): incorporation **2025-08-15** (federal CBCA,
Ontario registration), fiscal year-end **June 30**, HST **registered**, province
**Ontario**, CRA income-tax account **RC0001** active. Still needed before booking: HST
effective date (+ RT number); payroll (RP) account if any; first 2025 spend month; which
personal accounts to ingest.

---

## Consequences

- Decisions 1–3 are stable and can be relied on immediately.
- The chart of accounts (charter §11 step 3) is deferred until the §8 gating facts —
  especially HST status and incorporation date — are known, since they change account
  structure and tax treatment.
- This ADR will be superseded in part by follow-up ADRs that settle Open decisions A & B.
