# client/data/ — local card exports (gitignored)

Drop your downloaded card CSVs here (CIBC Visa, Amex, BMO Mastercard, …).
**Everything in this folder except this README is gitignored** — raw transaction data
and the generated `review-output.json` never get committed (charter §6).

Then, from `client/`:
```bash
npm run qbo parse
```
This reads the CSVs, classifies each line against [vendor-classification.md](../../vendor-classification.md),
and prints what would be booked (business by account, items needing review, and an
aggregate of personal lines left off the books). Detail for business+review lines is
written to `review-output.json` here for your inspection — no QBO connection required.

Supported formats (auto-detected): CIBC Visa (headerless), Amex, BMO Mastercard.
