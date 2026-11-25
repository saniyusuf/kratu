// Deploy guard (Sani 2026-11-25): a plain `firebase deploy` must never put the wrong app on the wrong site. Every hosting
// target and the functions run this first (firebase.json "predeploy"); it stops the deploy unless KRATU_DEPLOY names
// exactly what is being deployed, and checks the build before it goes out.
//   KRATU_DEPLOY=family    firebase deploy --only functions:family,hosting:family --project kratu-app
//   KRATU_DEPLOY=school    firebase deploy --only hosting:school --project kratu-app
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const WHAT = process.argv[2];
const ALLOWED = String(process.env.KRATU_DEPLOY || '').split(',').map((s) => s.trim()).filter(Boolean);
const NEED = WHAT === 'functions' ? 'family' : WHAT;   // the functions only serve the family app
const fail = (m) => { console.error('deploy-guard: ' + m); process.exit(1); };
if (!ALLOWED.includes(NEED)) fail(`refusing to deploy "${WHAT}" without KRATU_DEPLOY=${NEED} (see tools/deploy-guard.mjs for the exact commands)`);
const DIR = { school: 'dist/kratu/browser', family: 'dist/family/browser' }[WHAT];
if (DIR) {
  if (!fs.existsSync(path.join(DIR, 'index.html'))) fail(`${DIR} has no build: run the production build first`);
  // the PlotWeaver key must never be in a build
  let KEY = (process.env.PLOTWEAVER_API_KEY || '').trim();
  for (const F of ['.env', path.join(os.homedir(), 'Documents/kratu-langs/tools/.env.plotweaver')]) { if (KEY) break; try { KEY = (fs.readFileSync(F, 'utf8').match(/^\s*PLOTWEAVER_API_KEY\s*=\s*['"]?([^'"\s]+)/m) || [])[1] || ''; } catch { /* none */ } }
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  if (KEY) for (const F of walk(DIR)) if (/\.(js|mjs|json|html|css|txt)$/.test(F) && fs.readFileSync(F, 'utf8').includes(KEY)) fail('the PlotWeaver key is in ' + F);
  if (WHAT === 'family' && !/TESTER\s*=\s*false/.test(fs.readFileSync('apps/family/src/app/family-shell.ts', 'utf8'))) fail('TESTER is on in apps/family/src/app/family-shell.ts');
}
console.log(`deploy-guard: ${WHAT} allowed`);
