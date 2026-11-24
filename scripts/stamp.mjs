// Writes public/version.json with this build's time, so settings can say which version a tablet has (Sani 19 Nov 2026).
// Run by every build script just before `ng build`; the file is ignored by git. The service worker keeps it with the
// rest of the app, so a tablet always reads the time of the copy it is running.
import { writeFileSync } from 'node:fs';
const out = process.argv[2] || 'public/version.json';
writeFileSync(out, JSON.stringify({ built: new Date().toISOString() }) + '\n');
console.log('version stamp', out);
