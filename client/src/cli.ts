// CLI for the QBO client. Run via: npm run qbo <command>
//   authurl                       print the authorize URL
//   exchange <code> <realmId>     exchange an auth code for tokens
//   ping                          verify the connection (prints company info)

import { generateAuthUrl, exchangeCode } from './auth.ts';
import { getCompanyInfo } from './qbo.ts';

const [cmd, ...args] = process.argv.slice(2);

async function main(): Promise<void> {
  switch (cmd) {
    case 'authurl': {
      const url = generateAuthUrl();
      console.log('\n1) Open this URL, sign in, and authorize Meshentics Technologies Inc.:\n');
      console.log('   ' + url);
      console.log('\n2) After authorizing you land on your redirect URL containing ?code=...&realmId=...');
      console.log('3) Run:  npm run qbo exchange <code> <realmId>\n');
      break;
    }
    case 'exchange': {
      const [code, realmId] = args;
      if (!code || !realmId) throw new Error('Usage: npm run qbo exchange <code> <realmId>');
      await exchangeCode(code, realmId);
      console.log('✓ Tokens saved to client/.tokens.json (gitignored). Now run:  npm run qbo ping');
      break;
    }
    case 'ping': {
      const info = await getCompanyInfo();
      console.log('✓ Connected to QBO company:', info?.CompanyName);
      console.log('  Country:', info?.Country, '| Fiscal year start month:', info?.FiscalYearStartMonth);
      break;
    }
    default:
      console.log('Commands:\n  npm run qbo authurl\n  npm run qbo exchange <code> <realmId>\n  npm run qbo ping');
  }
}

main().catch((e: Error) => {
  console.error('✗', e.message);
  process.exit(1);
});
