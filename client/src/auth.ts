// OAuth 2.0 token management for the QBO API.
// Tokens persist to client/.tokens.json (gitignored). Refresh tokens rotate on use.

import { writeFile, readFile } from 'node:fs/promises';
import { AUTH_URL, SCOPE, TOKEN_URL, loadConfig, type QboConfig } from './config.ts';

const TOKENS_FILE = new URL('../.tokens.json', import.meta.url);

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
  realmId?: string;
}

async function readTokens(): Promise<StoredTokens | null> {
  try {
    return JSON.parse(await readFile(TOKENS_FILE, 'utf8')) as StoredTokens;
  } catch {
    return null;
  }
}

async function writeTokens(t: StoredTokens): Promise<void> {
  await writeFile(TOKENS_FILE, JSON.stringify(t, null, 2));
}

function basicAuth(cfg: QboConfig): string {
  return 'Basic ' + Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString('base64');
}

export function generateAuthUrl(state = 'meshentics'): string {
  const cfg = loadConfig();
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    response_type: 'code',
    scope: SCOPE,
    redirect_uri: cfg.redirectUri,
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

async function tokenRequest(cfg: QboConfig, body: URLSearchParams): Promise<StoredTokens> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: basicAuth(cfg),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; refresh_token: string; expires_in: number };
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
}

export async function exchangeCode(code: string, realmId: string): Promise<void> {
  const cfg = loadConfig();
  const tokens = await tokenRequest(
    cfg,
    new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: cfg.redirectUri }),
  );
  tokens.realmId = realmId;
  await writeTokens(tokens);
}

// Returns a valid access token + realm, refreshing (and persisting the rotated refresh token) as needed.
export async function getAccessToken(): Promise<{ accessToken: string; realmId: string }> {
  const cfg = loadConfig();
  let tokens = await readTokens();

  // Bootstrap from env (e.g., a refresh token pasted from Intuit's OAuth Playground).
  if (!tokens && process.env.QBO_REFRESH_TOKEN) {
    tokens = {
      accessToken: '',
      refreshToken: process.env.QBO_REFRESH_TOKEN,
      expiresAt: 0,
      realmId: process.env.QBO_REALM_ID,
    };
  }
  if (!tokens) {
    throw new Error(
      'No tokens. Run `npm run qbo authurl`, authorize, then `npm run qbo exchange <code> <realmId>` — or set QBO_REFRESH_TOKEN in .env.',
    );
  }

  // Refresh if missing/expired (60s safety buffer).
  if (!tokens.accessToken || Date.now() > tokens.expiresAt - 60_000) {
    const refreshed = await tokenRequest(
      cfg,
      new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokens.refreshToken }),
    );
    refreshed.realmId = tokens.realmId ?? process.env.QBO_REALM_ID;
    await writeTokens(refreshed);
    tokens = refreshed;
  }

  const realmId = tokens.realmId ?? process.env.QBO_REALM_ID;
  if (!realmId) {
    throw new Error('No realmId (company id). Set QBO_REALM_ID in .env or re-run `exchange` with the realmId.');
  }
  return { accessToken: tokens.accessToken, realmId };
}
