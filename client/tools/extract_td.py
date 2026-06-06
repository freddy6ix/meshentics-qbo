#!/usr/bin/env python3
"""Extract transactions from TD Aeroplan Visa PDF statements.

Validates each statement by reconciliation:
    PREVIOUS STATEMENT BALANCE + sum(signed transactions) == TOTAL NEW BALANCE
Charges are positive (money out); payments/credits negative — matching the repo's
Txn convention (amount > 0 = expense).

Usage: python3 extract_td.py <pdf...>            # report-only reconciliation
       python3 extract_td.py --csv OUT <pdf...>  # also write normalized CSV
"""
import re, sys, subprocess, datetime, csv

MONTHS = {m: i for i, m in enumerate(
    ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'], 1)}

TXN = re.compile(
    r'^\s*([A-Z]{3})\s+(\d{1,2})\s+([A-Z]{3})\s+(\d{1,2})\s+(.+?)\s+(-?\$[\d,]+\.\d{2})\s*$')
STMT_DATE = re.compile(r'STATEMENT DATE:\s+([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})')
MONEY = lambda s: float(s.replace('$', '').replace(',', ''))


def pdftext(path):
    return subprocess.run(['pdftotext', '-layout', path, '-'],
                          capture_output=True, text=True, check=True).stdout


def closing_date(text):
    m = STMT_DATE.search(text)
    mon = datetime.datetime.strptime(m.group(1)[:3], '%b').month
    return datetime.date(int(m.group(3)), mon, int(m.group(2)))


def extract(path):
    text = pdftext(path)
    close = closing_date(text)
    rows, opening, new_balance = [], None, None
    for line in text.splitlines():
        if 'PREVIOUS STATEMENT BALANCE' in line:
            mm = re.search(r'(-?\$[\d,]+\.\d{2})', line)
            if mm and opening is None:
                opening = MONEY(mm.group(1))
            continue
        if 'TOTAL NEW BALANCE' in line:
            mm = re.search(r'(-?\$[\d,]+\.\d{2})', line)
            if mm:
                new_balance = MONEY(mm.group(1))
            continue
        m = TXN.match(line)
        if not m:
            continue
        mon, day = MONTHS[m.group(1)], int(m.group(2))
        y = close.year
        try:
            d = datetime.date(y, mon, day)
        except ValueError:
            continue
        if d > close:
            d = datetime.date(y - 1, mon, day)
        amt = MONEY(m.group(6))           # '-$' → negative already handled by MONEY? no:
        if m.group(6).lstrip().startswith('-'):
            amt = -abs(amt)
        rows.append({'date': d.isoformat(), 'description': m.group(5).strip(),
                     'amount': round(amt, 2), 'source': 'td', 'file': path})
    return rows, opening, new_balance, close


def main(argv):
    out_csv = None
    if argv and argv[0] == '--csv':
        out_csv, argv = argv[1], argv[2:]
    all_rows, ok = [], True
    print(f"{'statement':<40} {'open':>12} {'Σtxn':>11} {'=close?':>12} {'n':>4}  recon")
    for path in sorted(argv):
        rows, opening, newbal, close = extract(path)
        s = round(sum(r['amount'] for r in rows), 2)
        calc = round((opening or 0) + s, 2)
        good = newbal is not None and abs(calc - newbal) < 0.01
        ok &= good
        name = path.split('/')[-1].replace('TD_AEROPLAN_VISA_INFINITE_PRIVILEGE_4962_', '').replace('.pdf','')
        print(f"{name:<40} {opening:>12,.2f} {s:>11,.2f} {newbal:>12,.2f} {len(rows):>4}  {'OK' if good else 'MISMATCH ('+str(calc)+')'}")
        all_rows.extend(rows)
    print(f"\nTotal transactions extracted: {len(all_rows)}   All reconciled: {ok}")
    if out_csv:
        with open(out_csv, 'w', newline='') as f:
            w = csv.DictWriter(f, fieldnames=['date','description','amount','source'])
            w.writeheader()
            for r in all_rows:
                w.writerow({k: r[k] for k in ['date','description','amount','source']})
        print(f"Wrote {len(all_rows)} rows → {out_csv}")
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
