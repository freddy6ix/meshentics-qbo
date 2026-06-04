# Meshentics QBO client

Programmatic QBO Accounting API access for the bookkeeping catch-up and ongoing close
([ADR-0002](../decisions/0002-qbo-interface.md)). Replaces manual/Claude-for-Chrome entry.

**No secrets in git.** Credentials live in `client/.env` and tokens in `client/.tokens.json`
— both gitignored. Raw transaction data is never committed (charter §6).

## One-time setup

### 1. Register an Intuit Developer app (≈15 min — Frederick)
1. Go to https://developer.intuit.com → sign in with your Intuit account → **My Hub → App dashboard → Create an app**.
2. Choose **QuickBooks Online and Payments**. Name it e.g. `Meshentics Bookkeeping`.
3. Open the app → **Keys & credentials**. You'll use the **Development** keys first (sandbox), then **Production** keys for the real company.
4. Under **Redirect URIs**, add: `http://localhost:8000/callback` (must match `QBO_REDIRECT_URI`).
5. Scope needed: **Accounting** (`com.intuit.quickbooks.accounting`).
6. Copy the **Client ID** and **Client Secret**.

### 2. Configure
```bash
cd client
cp .env.example .env
# paste QBO_CLIENT_ID / QBO_CLIENT_SECRET; keep QBO_ENVIRONMENT=sandbox to start
npm install
```

### 3. Authorize & connect
```bash
npm run qbo authurl                       # open the printed URL, authorize
npm run qbo exchange <code> <realmId>     # from the redirect URL's ?code=...&realmId=...
npm run qbo ping                          # ✓ Connected to QBO company: ...
```
(Shortcut: paste a refresh token + realm from Intuit's OAuth 2.0 Playground into `.env` and skip straight to `ping`.)

When sandbox works, switch `QBO_ENVIRONMENT=production`, swap in the Production keys,
re-authorize against the real Meshentics company, and `ping` again.

## Commands
| Command | What it does |
|---------|--------------|
| `npm run qbo authurl` | Print the OAuth authorize URL. |
| `npm run qbo exchange <code> <realmId>` | Exchange an auth code for tokens (saved, gitignored). |
| `npm run qbo ping` | Verify the connection; prints company name + fiscal-year start. |
| `npm run qbo parse [--show-personal]` | **Offline.** Classify CSVs in `data/`; preview business/personal split. |
| `npm run qbo load-coa [--commit]` | Create the [chart of accounts](../chart-of-accounts.md). Dry-run unless `--commit`. |
| `npm run qbo post [--commit]` | Post catch-up journal entries (Dr expense / Cr Due to Shareholder). Dry-run unless `--commit`. |
| `npm run typecheck` / `npm test` | Type-check / run unit tests. |

## Validation status
`authurl`/`exchange`/`ping`/`parse` are exercised offline. **`load-coa` and `post` `--commit`
paths have not yet run against a live QBO company** — validate against an Intuit **sandbox**
first (account subtypes and journal-entry shape may need minor tweaks). `post --commit`
is **idempotent** — it skips entries already in QBO (matched by their `MESH-CATCHUP`
PrivateNote key), so it's safe to re-run or resume after a partial failure.
