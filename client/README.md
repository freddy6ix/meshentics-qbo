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
| `npm run typecheck` | Type-check the client. |

## Next (not built yet)
- `load-coa` — create the [chart of accounts](../chart-of-accounts.md) via API.
- `post` — parse card CSVs (from the secured store), filter to business lines via
  [vendor-classification.md](../vendor-classification.md), post as journal entries to *Due to Shareholder*.
