// Loads and validates QBO configuration from environment (client/.env, gitignored).

export type QboEnvironment = 'sandbox' | 'production';

export interface QboConfig {
  clientId: string;
  clientSecret: string;
  environment: QboEnvironment;
  redirectUri: string;
  realmId: string;
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name} — copy client/.env.example to client/.env and fill it in.`);
  return v;
}

export function loadConfig(opts: { requireRealm?: boolean } = {}): QboConfig {
  const environment = (process.env.QBO_ENVIRONMENT ?? 'sandbox') as QboEnvironment;
  if (environment !== 'sandbox' && environment !== 'production') {
    throw new Error("QBO_ENVIRONMENT must be 'sandbox' or 'production'.");
  }
  return {
    clientId: required('QBO_CLIENT_ID'),
    clientSecret: required('QBO_CLIENT_SECRET'),
    environment,
    redirectUri: process.env.QBO_REDIRECT_URI ?? 'http://localhost:8000/callback',
    realmId: opts.requireRealm ? required('QBO_REALM_ID') : (process.env.QBO_REALM_ID ?? ''),
  };
}

// QBO Accounting API minor version (pin for stable behaviour).
export const MINOR_VERSION = '73';

export function apiBase(env: QboEnvironment): string {
  return env === 'production'
    ? 'https://quickbooks.api.intuit.com'
    : 'https://sandbox-quickbooks.api.intuit.com';
}

export const AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2';
export const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
export const SCOPE = 'com.intuit.quickbooks.accounting';
