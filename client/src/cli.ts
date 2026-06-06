// CLI for the QBO client. Run via: npm run qbo <command>
//   authurl                       print the authorize URL
//   exchange <code> <realmId>     exchange an auth code for tokens
//   ping                          verify the connection (prints company info)

import { generateAuthUrl, exchangeCode } from './auth.ts';
import { getCompanyInfo } from './qbo.ts';
import { runParse } from './report.ts';
import { loadCoa } from './coa.ts';
import { postCatchup } from './post.ts';
import { runInvoice } from './invoice.ts';

const [cmd, ...args] = process.argv.slice(2);
const DATA_DIR = new URL('../data', import.meta.url).pathname;

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
    case 'parse': {
      await runParse(DATA_DIR, { showPersonal: args.includes('--show-personal') }); // offline; no QBO connection
      break;
    }
    case 'load-coa': {
      await loadCoa({ commit: args.includes('--commit') }); // dry-run unless --commit
      break;
    }
    case 'post': {
      await postCatchup(DATA_DIR, { commit: args.includes('--commit') }); // dry-run unless --commit
      break;
    }
    case 'invoice': {
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const period = args.find((a) => /^\d{4}-\d{2}$/.test(a)) ?? thisMonth; // default: current month
      await runInvoice(period, { commit: args.includes('--commit') }); // dry-run unless --commit
      break;
    }
    default:
      console.log(
        'Commands:\n' +
          '  npm run qbo authurl\n' +
          '  npm run qbo exchange <code> <realmId>\n' +
          '  npm run qbo ping\n' +
          '  npm run qbo parse [--show-personal]   (offline: classify CSVs in client/data/)\n' +
          '  npm run qbo load-coa [--commit]       (create chart of accounts)\n' +
          '  npm run qbo post [--commit]           (post catch-up journal entries)\n' +
          '  npm run qbo invoice [YYYY-MM] [--commit]  (DoWhat → Salon Lyol; default current month)',
      );
  }
}

main().catch((e: Error) => {
  console.error('✗', e.message);
  process.exit(1);
});
