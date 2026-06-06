// Reads card-export CSVs from a folder and normalizes them to a common shape.
// Supports three formats seen so far: CIBC Visa (headerless), Amex, BMO Mastercard.
// Convention: amount > 0 = money out (expense/charge); amount < 0 = credit/refund/payment.

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse as parseCsv } from 'csv-parse/sync';

export type Source = 'cibc' | 'amex' | 'bmo' | 'rbc' | 'td' | 'normalized' | 'unknown';

export interface Txn {
  date: string; // YYYY-MM-DD
  description: string;
  amount: number; // + = expense, - = credit/payment
  source: Source;
  file: string;
}

function toISO(d: string): string {
  d = String(d).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  let m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // MM/DD/YYYY
  if (m) return `${m[3]}-${m[1]}-${m[2]}`;
  m = d.match(/^(\d{4})(\d{2})(\d{2})$/); // YYYYMMDD
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return d;
}

function num(s: unknown): number {
  const n = parseFloat(String(s ?? '').replace(/[$,\s]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function detect(text: string, file: string): Source {
  const head = text.slice(0, 3000);
  // Normalized (e.g. PDF-extracted statements, source in a column) — check first: its
  // data rows start with an ISO date that the cibc rule below would otherwise claim.
  if (/^﻿?date,description,amount,source/im.test(head)) return 'normalized';
  if (/Account Type,Account Number,Transaction Date/.test(head) || /rbc/i.test(file)) return 'rbc';
  if (/Item #.*Transaction Date/s.test(head) || /bmo/i.test(file)) return 'bmo';
  if (/Date,Description,Amount,Extended Details/.test(head) || /amex/i.test(file)) return 'amex';
  if (/^﻿?"?\d{4}-\d{2}-\d{2}/m.test(head) || /cibc/i.test(file)) return 'cibc';
  return 'unknown';
}

export function parseBySource(text: string, source: Source, file: string): Txn[] {
  if (source === 'cibc') {
    const rows = parseCsv(text, { relax_column_count: true, skip_empty_lines: true, bom: true }) as string[][];
    return rows
      .filter((r) => r.length >= 2 && /^\d{4}-\d{2}-\d{2}/.test(String(r[0]).trim()))
      .map((r) => {
        const [date, description, debit, credit] = r;
        const amount = debit ? num(debit) : -num(credit); // debit = expense; credit = refund/payment
        return { date: toISO(date), description: String(description ?? '').trim(), amount, source, file };
      });
  }

  if (source === 'normalized') {
    // Pre-normalized rows (date ISO, amount signed +=charge, source per row). Used by the
    // PDF-statement extractors (e.g. tools/extract_td.py) whose output the parser can't read natively.
    const rows = parseCsv(text, { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[];
    return rows.map((r) => ({
      date: toISO(r['date']),
      description: String(r['description'] ?? '').trim(),
      amount: num(r['amount']),
      source: (String(r['source'] ?? 'unknown').trim() as Source),
      file,
    }));
  }

  if (source === 'rbc') {
    // RBC export: charges are NEGATIVE CAD$ (credits positive) — flip to repo convention (+=expense).
    const rows = parseCsv(text, { columns: true, skip_empty_lines: true, relax_quotes: true, bom: true }) as Record<string, string>[];
    return rows.map((r) => {
      const m = String(r['Transaction Date'] ?? '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      const date = m ? `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}` : toISO(r['Transaction Date']);
      const desc = String(r['Description 1'] ?? '').trim() || String(r['Description 2'] ?? '').trim();
      return { date, description: desc, amount: -num(r['CAD$']), source, file };
    });
  }

  if (source === 'amex') {
    const rows = parseCsv(text, { columns: true, skip_empty_lines: true, relax_quotes: true, bom: true }) as Record<string, string>[];
    return rows.map((r) => ({
      date: toISO(r['Date']),
      description: String(r['Description'] ?? '').trim(),
      amount: num(r['Amount']), // Amex: charges positive, payments/credits negative
      source,
      file,
    }));
  }

  if (source === 'bmo') {
    const lines = text.split(/\r?\n/);
    const headerIdx = lines.findIndex((l) => l.startsWith('Item #'));
    const csvText = (headerIdx >= 0 ? lines.slice(headerIdx) : lines).join('\n');
    const rows = parseCsv(csvText, { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[];
    return rows.map((r) => ({
      date: toISO(r['Transaction Date']),
      description: String(r['Description'] ?? '').trim(),
      amount: num(r['Transaction Amount']), // BMO: charges positive, credits negative
      source,
      file,
    }));
  }

  return [];
}

export async function loadTransactions(dir: string): Promise<Txn[]> {
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith('.csv'));
  } catch {
    throw new Error(`Data folder not found: ${dir}. Create it and drop your card CSVs in (it's gitignored).`);
  }
  if (files.length === 0) throw new Error(`No .csv files in ${dir}. Drop your card exports there.`);

  const all: Txn[] = [];
  for (const f of files) {
    const text = await readFile(join(dir, f), 'utf8');
    all.push(...parseBySource(text, detect(text, f), f));
  }
  return all;
}
