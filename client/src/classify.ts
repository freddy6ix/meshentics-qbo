// Classifies a transaction description into a chart-of-accounts target.
// Rules mirror ../vendor-classification.md. DEFAULT IS PERSONAL (excluded): most card
// activity is personal (charter §4), so only explicit business rules cross onto the books.

export type Disposition = 'business' | 'review' | 'excluded' | 'personal';

export interface Classification {
  disposition: Disposition;
  vendor?: string;
  account?: string; // chart-of-accounts number
  note?: string;
}

interface Rule {
  pattern: RegExp;
  vendor: string;
  account?: string;
  disposition: Disposition;
  note?: string;
}

// First match wins. Financing/payments first, then business vendors.
const RULES: Rule[] = [
  // --- Card financing & payments (not Meshentics expenses) ---
  { pattern: /(PURCHASE|CASH)\s+INTEREST|INSTALLMENT PLAN INTEREST|INTEREST (PURCHASES|ADVANCES)/i, vendor: 'Card interest', disposition: 'review', note: 'Interest → shareholder loan (Mike M10): business-attributable portion only.' },
  { pattern: /PAYMENT THANK YOU|PRE-AUTHORIZED PAYMENT|AUTOMATIC PYMT|ONLINE PAYMENT|PAIEMEN/i, vendor: 'Payment', disposition: 'excluded', note: 'Card payment.' },
  { pattern: /CASH ADVANCE FEE|BALANCE TRANSFER|ONE TIME INSTALLMENT FEE|PAYSMART FEE|ANNUAL (CARD )?FEE|ANNUAL FEE REBATE|CONV(ERSION)? FEE|CONV CHQ FEE|MISC CHARGE|TRSF (TO|FROM)/i, vendor: 'Card fee/transfer', disposition: 'excluded', note: 'Card financing fee/transfer.' },

  // --- Business: platform / SaaS / infrastructure ---
  { pattern: /GOOGLE.*CLOUD/i, vendor: 'Google Cloud (GCP)', account: '5000', disposition: 'business' },
  { pattern: /ANTHROPIC/i, vendor: 'Anthropic', account: '5010', disposition: 'business' },
  { pattern: /OPENAI/i, vendor: 'OpenAI', account: '5010', disposition: 'business' },
  { pattern: /CLOUDFLARE/i, vendor: 'Cloudflare', account: '6010', disposition: 'business' },
  { pattern: /GODADDY/i, vendor: 'GoDaddy', account: '6010', disposition: 'business' },
  { pattern: /SQSP\*|SQUARESPACE/i, vendor: 'Squarespace (domain)', account: '6010', disposition: 'business' },
  { pattern: /RESEND/i, vendor: 'Resend', account: '5020', disposition: 'business' },
  { pattern: /TWILIO/i, vendor: 'Twilio', account: '5020', disposition: 'business' },
  { pattern: /SENTRY/i, vendor: 'Sentry', account: '6000', disposition: 'business' },
  { pattern: /GITHUB/i, vendor: 'GitHub', account: '6000', disposition: 'business' },
  { pattern: /FORMSPREE/i, vendor: 'Formspree', account: '6000', disposition: 'business' },
  { pattern: /COMPOSIO/i, vendor: 'Composio', account: '6000', disposition: 'business' },
  { pattern: /MERMAID/i, vendor: 'Mermaid Chart', account: '6000', disposition: 'business' },
  { pattern: /ZOOM/i, vendor: 'Zoom', account: '6000', disposition: 'business' },
  { pattern: /VOCALIMAGE/i, vendor: 'Vocalimage', account: '6000', disposition: 'business' },
  { pattern: /BREEZE/i, vendor: 'Breeze', account: '6000', disposition: 'business' },
  { pattern: /SPEEDPAINT/i, vendor: 'Speedpaint', account: '6000', disposition: 'business' },
  { pattern: /NATEBJONES|NATE AI/i, vendor: 'NateAI', account: '6900', disposition: 'business' },
  { pattern: /GOOGLE.*(WORKSPACE|GSUITE)/i, vendor: 'Google Workspace', account: '6000', disposition: 'business' },
  { pattern: /INTUIT|QBOOKS/i, vendor: 'Intuit/QBO', account: '6000', disposition: 'business' },
  { pattern: /LINKEDIN/i, vendor: 'LinkedIn', account: '6300', disposition: 'business' },
  { pattern: /APPLE\.COM|APPLE STORE/i, vendor: 'Apple', account: '6000', disposition: 'review', note: 'Business per Frederick; split hardware (1500) vs services (6000) case-by-case.' },

  // --- Business: incorporation / IP ---
  { pattern: /NUANS|CORP CANADA|CORPORATIONS CANADA/i, vendor: 'Incorporation (Corp Canada/NUANS)', account: '6120', disposition: 'business', note: 'Pre-incorp → Due to Shareholder.' },
  { pattern: /US PATENT|USPTO|CIPO/i, vendor: 'Trademark/IP (USPTO/CIPO)', disposition: 'review', note: 'Intangible (Class 14.1?) — Mike M8.' },

  // --- Business: transportation (Frederick → Travel 6610; commuting split = Mike M9) ---
  { pattern: /TORONTO PARKING|IMPARK|PRESTO|BIKE SHARE/i, vendor: 'Local transport', account: '6610', disposition: 'business', note: 'Transportation → Travel (6610); commuting split = Mike M9.' },
];

export function classify(description: string): Classification {
  for (const r of RULES) {
    if (r.pattern.test(description)) {
      return { disposition: r.disposition, vendor: r.vendor, account: r.account, note: r.note };
    }
  }
  return { disposition: 'personal' };
}
