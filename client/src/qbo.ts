// Thin QBO Accounting REST wrapper. Handles auth + JSON; one place to add entities.

import { apiBase, loadConfig, MINOR_VERSION } from './config.ts';
import { getAccessToken } from './auth.ts';

async function apiRequest(method: 'GET' | 'POST', resource: string, body?: unknown): Promise<any> {
  const cfg = loadConfig();
  const { accessToken, realmId } = await getAccessToken();
  const url = `${apiBase(cfg.environment)}/v3/company/${realmId}/${resource}${
    resource.includes('?') ? '&' : '?'
  }minorversion=${MINOR_VERSION}`;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    // Capture intuit_tid (response-header transaction id) — lets Intuit support trace failures.
    const tid = res.headers.get('intuit_tid');
    throw new Error(
      `QBO ${method} ${resource} failed: ${res.status}${tid ? ` (intuit_tid ${tid})` : ''} ${await res.text()}`,
    );
  }
  return res.json();
}

export async function query(sql: string): Promise<any> {
  return apiRequest('GET', `query?query=${encodeURIComponent(sql)}`);
}

export async function getCompanyInfo(): Promise<any> {
  const r = await query('select * from CompanyInfo');
  return r?.QueryResponse?.CompanyInfo?.[0];
}

export async function getAccounts(): Promise<any[]> {
  const r = await query('select * from Account maxresults 1000');
  return r?.QueryResponse?.Account ?? [];
}

export async function createAccount(account: Record<string, unknown>): Promise<any> {
  return apiRequest('POST', 'account', account);
}

export async function getJournalEntries(): Promise<any[]> {
  const all: any[] = [];
  let start = 1;
  const page = 500;
  for (;;) {
    const r = await query(`select * from JournalEntry startposition ${start} maxresults ${page}`);
    const batch: any[] = r?.QueryResponse?.JournalEntry ?? [];
    all.push(...batch);
    if (batch.length < page) break;
    start += page;
  }
  return all;
}

export async function createJournalEntry(entry: Record<string, unknown>): Promise<any> {
  return apiRequest('POST', 'journalentry', entry);
}

export async function createPurchase(purchase: Record<string, unknown>): Promise<any> {
  return apiRequest('POST', 'purchase', purchase);
}
