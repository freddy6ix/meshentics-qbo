// Synthetic (non-PII) tests for the classifier. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from './classify.ts';

test('business platform/SaaS vendors map to accounts', () => {
  assert.equal(classify('GOOGLE *CLOUD MHWVZV G.CO/HELPPAY#').account, '5000');
  assert.equal(classify('ANTHROPIC SAN FRANCISCO CA').account, '5010');
  assert.equal(classify('OPENAI *CHATGPT SUBSCR OPENAI.COM').account, '5010');
  assert.equal(classify('CLOUDFLARE SAN FRANCISCO CA').account, '6010');
  assert.equal(classify('GODADDY#4097260549 VICTORIA BC').account, '6010');
  assert.equal(classify('GOOGLE*WORKSPACE MESHE SUPPORT').account, '6000');
  assert.equal(classify('INTUIT *QBooks Online').account, '6000');
  assert.equal(classify('LinkedIn P3026036074 Dublin IRL').account, '6300');
  assert.equal(classify('TWILIO INC SAN FRANCISCO CA').account, '5020');
});

test('transportation → Travel (6610)', () => {
  assert.equal(classify('TORONTO PARKING AUTHOR TORONTO ON').account, '6610');
  assert.equal(classify('PRESTO AUTO/RGFN8MM29S Toronto ON').account, '6610');
  assert.equal(classify('BIKE SHARE TORONTO PARKING AUT').account, '6610');
});

test('personal is the default (including lookalikes)', () => {
  assert.equal(classify('SHOPPERS DRUG MART 939 TORONTO ON').disposition, 'personal');
  assert.equal(classify('WEFUNDER* WEFUNDER 183 SAN FRANCISCO').disposition, 'personal');
  assert.equal(classify('QUANTCONNECT.COM LEWES DE').disposition, 'personal');
  assert.equal(classify('GOOGLE *YouTube Member g.co/helppay#').disposition, 'personal');
  assert.equal(classify('GOOGLE*GOOGLE NEST INTERNET').disposition, 'personal');
});

test('financing: interest → review, fees/payments → excluded', () => {
  assert.equal(classify('PURCHASE INTEREST').disposition, 'review');
  assert.equal(classify('INSTALLMENT PLAN INTEREST').disposition, 'review');
  assert.equal(classify('CASH ADVANCE FEE').disposition, 'excluded');
  assert.equal(classify('PAYSMART FEE COSTCO 50G').disposition, 'excluded');
  assert.equal(classify('PAYMENT THANK YOU/PAIEMEN T MERCI').disposition, 'excluded');
});

test('review items: trademark + Apple', () => {
  assert.equal(classify('US PATENT TRADEMARK 571-272-6500 VA').disposition, 'review');
  assert.equal(classify('APPLE.COM/CA TORONTO ON').disposition, 'review');
});
