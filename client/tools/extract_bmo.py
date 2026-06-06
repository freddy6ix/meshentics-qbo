#!/usr/bin/env python3
"""Extract transactions from BMO Mastercard / Visa statement PDFs (same layout).

Reconciliation: Previous total balance + sum(signed transactions) == Total balance.
Charges positive (money out); 'CR'-suffixed lines and payments are negative — matching
the repo Txn convention (amount > 0 = expense).

Usage: python3 extract_bmo.py [--csv OUT] <pdf...>
"""
import re, sys, subprocess, datetime, csv

MON = {m: i for i, m in enumerate(
    ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 1)}
TXN = re.compile(
    r'^\s*([A-Z][a-z]{2})\.?\s+(\d{1,2})\s+([A-Z][a-z]{2})\.?\s+(\d{1,2})\s+'
    r'(.+?)\s+([\d,]+\.\d{2})(\s+CR)?\s*$')
PERIOD = re.compile(r'Statement period\s+([A-Z][a-z]{2})\.?\s+(\d{1,2}),\s+(\d{4})\s*-\s*'
                    r'([A-Z][a-z]{2})\.?\s+(\d{1,2}),\s+(\d{4})')
MONEY = lambda s: float(s.replace('$', '').replace(',', '').replace('+', '').strip())


def pdftext(p):
    return subprocess.run(['pdftotext', '-layout', p, '-'],
                          capture_output=True, text=True, check=True).stdout


def amount_after(text, label):
    for line in text.splitlines():
        if label in line:
            m = re.search(r'(-?\$?[\d,]+\.\d{2})', line.split(label, 1)[1])
            if m:
                return MONEY(m.group(1))
    return None


def extract(path):
    text = pdftext(path)
    pm = PERIOD.search(text)
    end = datetime.date(int(pm.group(6)), MON[pm.group(4)], int(pm.group(5)))
    prev = amount_after(text, 'Previous total balance')
    newbal = amount_after(text, 'Total for card number') or amount_after(text, 'Total balance')
    lines = text.splitlines()
    FX = re.compile(r'^[A-Z]{3}\s+[\d.,]+@[\d.]+\s*')   # FX prefix, e.g. 'USD 21.44@1.4314'
    rows = []
    for i, line in enumerate(lines):
        m = TXN.match(line)
        if not m:
            continue
        desc = m.group(5).strip()
        # skip summary/installment lines that look transactional
        if re.search(r'Total |Subtotal|balance|installment', desc, re.I):
            continue
        # Foreign-currency txns prefix the description with 'USD <amt>@<rate>'. The merchant
        # usually follows on the SAME line; only if the rate wrapped it off is it on the next.
        if FX.match(desc):
            rem = FX.sub('', desc).strip()
            if rem:
                desc = rem
            else:
                for j in range(i + 1, min(i + 3, len(lines))):
                    if lines[j].strip():
                        desc = lines[j].strip()
                        break
        mon, day = MON.get(m.group(1)), int(m.group(2))
        if not mon:
            continue
        y = end.year
        try:
            d = datetime.date(y, mon, day)
        except ValueError:
            continue
        if d > end:
            d = datetime.date(y - 1, mon, day)
        amt = MONEY(m.group(6))
        if m.group(7):           # ' CR' suffix → credit
            amt = -amt
        rows.append({'date': d.isoformat(), 'description': desc,
                     'amount': round(amt, 2), 'source': 'bmo', 'file': path})
    return rows, prev, newbal, end


def main(argv):
    out = None
    if argv and argv[0] == '--csv':
        out, argv = argv[1], argv[2:]
    allrows, okall = [], True
    print(f"{'statement':<42} {'prev':>11} {'Σtxn':>11} {'newbal':>11} {'n':>4}  recon")
    for p in sorted(argv):
        rows, prev, newbal, end = extract(p)
        s = round(sum(r['amount'] for r in rows), 2)
        calc = round((prev or 0) + s, 2)
        good = newbal is not None and abs(calc - newbal) < 0.01
        okall &= good
        name = p.split('/')[-1].replace('.pdf', '')
        flag = 'OK' if good else f'OFF by {round(calc-(newbal or 0),2)}'
        print(f"{name:<42} {prev:>11,.2f} {s:>11,.2f} {newbal:>11,.2f} {len(rows):>4}  {flag}")
        allrows.extend(rows)
    print(f"\nTotal BMO transactions: {len(allrows)}   All reconciled: {okall}")
    if out:
        with open(out, 'w', newline='') as f:
            w = csv.DictWriter(f, fieldnames=['date', 'description', 'amount', 'source'])
            w.writeheader()
            for r in allrows:
                w.writerow({k: r[k] for k in ['date', 'description', 'amount', 'source']})
        print(f"Wrote {len(allrows)} rows → {out}")
    return 0 if okall else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
