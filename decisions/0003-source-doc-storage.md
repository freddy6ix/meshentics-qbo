# ADR-0003 — Source-document storage: IAM-walled GCS bucket

- **Status:** Accepted
- **Date:** 2026-06-04 EDT
- **Decider:** Frederick Ferguson (raised per charter §3/§6)
- **Supersedes:** ADR-0001 "Open decision B".

---

## Context

Source documents (bank/card statements, vendor invoices, CSVs) carry sensitive PII —
corporate and Frederick's personal. The charter (§6) forbids PII from entering this
repo, git, or any chat transcript; it must live in a secured store. Options were an
IAM-walled GCS bucket (prior-art proposal) vs. other secured storage.

## Decision

Store source documents in an **IAM-walled Google Cloud Storage bucket**
(`gs://…-qbo-meshentics/`), aligning with the existing GCP footprint
(`salon-mgmt-app-2026`) and the charter's prior-art convention.

## Consequences

- **Access control** — IAM-restricted to Frederick and the bookkeeping agent's
  service identity; least privilege. No public access; uniform bucket-level access.
- **PII boundary** — raw docs live only in the bucket. This repo references documents
  by opaque handle/treatment, never by content, account number, or balance (§6).
- **Layout (proposed, refine on first ingest):** partition by source and period, e.g.
  `cibc/2025-MM/…`, `personal/2025-MM/…`, `vendor-invoices/2025-MM/…`. Keep personal
  and corporate sources separated so the business/personal split (§4) is auditable.
- **Bucket naming / project** — confirm exact bucket name and whether it sits in the
  existing GCP project or a dedicated one (lean: dedicated, for blast-radius isolation).
- **Encryption/retention** — Google-managed encryption at rest by default; set a
  retention/versioning policy appropriate for CRA recordkeeping (6 years) on first use.
- **Token/secret storage (from ADR-0002)** — QBO OAuth secrets/refresh tokens can live
  in the same secured boundary (e.g. Secret Manager in the same project), not the bucket
  of source docs and never the repo.

## Open follow-ups

- Confirm exact bucket name + GCP project.
- Decide secret-store mechanism (Secret Manager vs. equivalent) for QBO tokens.
