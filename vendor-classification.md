# Vendor classification

Maps recurring vendors seen on Frederick's personal cards to a business/personal call
and a chart-of-accounts target, so the catch-up posting is consistent and reusable.
**Names and treatment only — no amounts or card data here (§6).** Amounts live in the
secured-store schedule. Account numbers refer to [chart-of-accounts.md](chart-of-accounts.md).

_Last updated: 2026-06-04 EDT. Source: business/personal split of CIBC Visa ••5057, Amex, BMO MC ••8040._

## Business → book to Meshentics (pre-2025-08-15 → Due to Shareholder; after → normal)

| Vendor | Account | Notes |
|--------|---------|-------|
| Google Cloud (GCP) | 5000 Cloud infrastructure | Core hosting. |
| Anthropic | 5010 AI/LLM API | |
| OpenAI (API + ChatGPT) | 5010 AI/LLM API | Confirmed business 2026-06-04. |
| Cloudflare | 6010 Domains & DNS / CDN | Watch refunds/credits. |
| GoDaddy | 6010 Domains & DNS | |
| Squarespace (SQSP domain) | 6010 Domains & DNS | |
| Resend | 5020 Email delivery | |
| Twilio | 5020 Comms (SMS/voice) | |
| Auth0 | 5030 Authentication | (Per vendor list; not yet seen on these cards.) |
| Sentry | 6000 Software & subscriptions | Error monitoring. |
| GitHub | 6000 Software & subscriptions | |
| Formspree | 6000 Software & subscriptions | Form backend. |
| Composio | 6000 Software & subscriptions | AI agent tooling. First seen ~2025-05-13 (likely first business spend). |
| Mermaid Chart | 6000 Software & subscriptions | |
| Zoom | 6000 Software & subscriptions | Confirmed business 2026-06-04. |
| Vocalimage | 6000 Software & subscriptions | Confirmed business 2026-06-04. |
| Breeze | 6000 Software & subscriptions | Confirmed business 2026-06-04. |
| Speedpaint | 6000 Software & subscriptions | Confirmed business 2026-06-04. |
| NateAI (NateBJones) | 6900 Dues & memberships | AI mentorship/news. Confirmed business 2026-06-04. |
| Google Workspace (GSuite) | 6000 Software & subscriptions | Meshentics email/productivity. |
| Intuit / QuickBooks Online | 6000 Software & subscriptions | |
| Apple (Apple.com/CA) | 6000 software *or* 1500 equipment | Confirmed business 2026-06-04. Split case-by-case: hardware → 1500; iCloud/services → 6000. |
| LinkedIn | 6300 Advertising & marketing | Meshentics marketing. Confirmed 2026-06-04. |
| Corporations Canada; NUANS name search | 6120 Incorporation & registration fees | Pre-incorp → Due to Shareholder. |
| USPTO; CIPO (trademark/IP) | Intangible (Class 14.1?) | Treatment pending Mike — see [mike-review-queue.md](mike-review-queue.md) M8. |
| Parking / Presto / Bike Share Toronto | 6620 Transportation — local | Per Frederick (2026-06-04), business transportation. Commuting-vs-business-travel split → Mike (M9). Uber/taxi: same treatment pending confirm. |

## Card interest → shareholder loan (per Frederick 2026-06-04)

Credit-card **interest** factors into the **Due to Shareholder** balance rather than being
excluded. **Two Mike flags (M10):** (a) only the interest attributable to the *business*
charges is defensible — these cards are mostly personal; (b) the clean mechanism is usually
the corp accruing **reasonable interest on the shareholder-loan balance**, not absorbing the
personal-card interest directly. Other card fees (annual fee, cash-advance fee, balance
transfer, PaySmart installment fees) remain personal unless directed otherwise.

## Resolved (2026-06-04)

- **LinkedIn → business** (Meshentics marketing) → 6300 Advertising & marketing.
- **QuantConnect → personal** (personal investing) — excluded.
- **WeFunder → personal** (personal investing, *not* a Meshentics capital raise) — excluded.

## Personal → never cross onto the books (§4/§6)

Restaurants, groceries, fuel, LCBO/alcohol, clothing, hotels, travel, **gold bullion**
(Costco/Valcambi), **OLG lottery**, donations (CanadaHelps, political), medical, and card
fees other than interest: installment-plan ("PaySmart") fees, cash-advance fees, annual
fees, balance transfers, and payments. *(Parking/Presto/Bike → business transportation;
card **interest** → shareholder loan — see above.)*
