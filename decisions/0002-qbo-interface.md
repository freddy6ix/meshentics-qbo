# ADR-0002 — QBO interface: real QBO API / OAuth 2.0 integration

- **Status:** Accepted
- **Date:** 2026-06-04 EDT
- **Decider:** Frederick Ferguson (raised per charter §10)
- **Supersedes:** ADR-0001 "Open decision A" and the provisional manual-first stance in ADR-0001 §4.

---

## Context

Charter §10 required this choice be raised with Frederick, not decided silently:
Roux is building AI-driven QBO bookkeeping as a product feature, so Meshentics' own
books are a natural first dogfood of that capability. Options were manual entry,
Claude-for-Chrome-driven entry, or a real QBO API / OAuth 2.0 integration.

## Decision

Interface with QBO through a **real QBO API integration using OAuth 2.0**. This is
the path Roux needs anyway; building it here dogfoods the product capability while
serving Meshentics' own catch-up and ongoing close.

### Alternative explicitly rejected: Claude-for-Chrome (browser copy/paste)

On the Roux side, a Claude-for-Chrome ("QBO Claude") workflow drives the QBO web UI in
the browser via human-assisted copy/paste. Rejected as the primary mechanism here
because, at the volume of a ~13-month catch-up plus monthly close, it is **not
repeatable**, **brittle** (breaks on QBO UI changes), requires a babysat logged-in
session, and leaves **no clean programmatic audit trail**. The API gives batch posting,
determinism, and auditability instead. Claude-for-Chrome is retained only as an
occasional **fallback** for the rare UI-only screen the API doesn't expose.

> **Scope nuance:** the Accounting API cannot create the company file and a few
> company-level settings (enabling Sales Tax, some preferences) are UI-only. So initial
> company setup is a one-time UI task; the API takes over all transaction work after.

## Consequences & implementation path

- **Intuit Developer app** — register an app in the Intuit Developer portal; obtain
  client ID/secret. Scope: `com.intuit.quickbooks.accounting`.
- **OAuth 2.0 (3-legged)** — authorization-code flow to mint access + refresh tokens
  for the Meshentics company (realm ID). Refresh tokens rotate; store secrets in the
  secured store (ADR-0003), **never in this repo**.
- **Sandbox → production** — validate account creation and journal/expense posting
  against an Intuit sandbox company before touching the real Meshentics file.
- **Capabilities needed for catch-up:** create/read chart-of-accounts entries, post
  journal entries and expenses (incl. the *Due to Shareholder* contra), attach/refer
  to source docs, read for reconciliation.
- **Sequencing:** standing up the integration does **not** have to block analysis —
  source-doc gathering and the business/personal split (charter §4) can proceed in
  parallel while the OAuth app is registered. First *posting* waits on the working
  token + a drafted chart of accounts.
- Revises ADR-0001 §4: the API integration *is* the automation; manual entry is a
  fallback only.

## Open follow-ups

- Confirm whether to model this as part of the Roux codebase or a standalone client
  here. (Lean: a small standalone client in this repo first; harvest into Roux later.)
- Token/secret storage mechanism — resolve alongside ADR-0003.
