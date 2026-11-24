// Local stand-in for the name server (Sani 2026-11-24). The family app posts ONE thing to /api/name: the child's
// "Sunana …" clip as a 16 kHz mono WAV (10 s cap). This forwards it to PlotWeaver's STORM ASR (Hausa) with the key
// added here, and answers {text}. The key is read from an ignored file and never printed, logged or sent to the app.
// For release the same job moves to a small server (see CLAUDE.md, "Name server"); the app's side does not change.
//   node tools/name-proxy.mjs          (127.0.0.1:4261; ng serve family proxies /api to it, see apps/family/proxy.conf.json)
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PORT = Number(process.env.NAME_PROXY_PORT || 4261);
const UPSTREAM = 'https://api.plotweaver.app/v1/transcriptions';
const MAX_BYTES = 16000 * 2 * 10 + 44 + 1024;   // 10 s of 16 kHz 16-bit mono, plus the header
const UPSTREAM_TIMEOUT_MS = 6000;
// Where the key may live, first found wins: the env var, the repo's ignored .env, then the file the earlier tests used.
const KEY_FILES = [path.resolve('.env'), path.join(os.homedir(), 'Documents/kratu-langs/tools/.env.plotweaver')];

function readKey() {
  if (process.env.PLOTWEAVER_API_KEY) return process.env.PLOTWEAVER_API_KEY.trim();
  for (const F of KEY_FILES) {
    try {
      const M = fs.readFileSync(F, 'utf8').match(/^\s*PLOTWEAVER_API_KEY\s*=\s*['"]?([^'"\s]+)/m);
      if (M) return M[1];
    } catch { /* not there */ }
  }
  return '';
}
const KEY = readKey();
if (!KEY) { console.error('name-proxy: no PLOTWEAVER_API_KEY found (env, .env, or kratu-langs/tools/.env.plotweaver)'); process.exit(1); }

function isWav(B) { return B.length > 44 && B.toString('ascii', 0, 4) === 'RIFF' && B.toString('ascii', 8, 12) === 'WAVE'; }
function send(res, code, body) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }

http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/api/name') return send(res, 404, { error: 'not found' });
  const CHUNKS = []; let size = 0, tooBig = false;
  req.on('data', (c) => { size += c.length; if (size > MAX_BYTES) { tooBig = true; req.destroy(); } else CHUNKS.push(c); });
  req.on('end', async () => {
    if (tooBig) return;
    const WAV = Buffer.concat(CHUNKS);
    if (!isWav(WAV)) return send(res, 400, { error: 'a WAV clip only' });
    const FORM = new FormData();
    FORM.append('language', 'ha');
    FORM.append('file', new Blob([WAV], { type: 'audio/wav' }), 'name.wav');
    const T0 = Date.now();
    try {
      const R = await fetch(UPSTREAM, { method: 'POST', headers: { 'X-API-Key': KEY }, body: FORM, signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
      if (!R.ok) { console.log(`name-proxy: upstream ${R.status} in ${Date.now() - T0} ms`); return send(res, 502, { error: 'upstream ' + R.status }); }
      const D = await R.json();
      console.log(`name-proxy: ${(WAV.length / 32000).toFixed(1)} s clip, answered in ${Date.now() - T0} ms`);   // never the key, never the text
      send(res, 200, { text: typeof D.text === 'string' ? D.text : '' });
    } catch (e) {
      console.log(`name-proxy: upstream failed after ${Date.now() - T0} ms (${e?.name || 'error'})`);
      send(res, 504, { error: 'upstream failed' });
    }
  });
}).listen(PORT, '127.0.0.1', () => console.log(`name-proxy on http://127.0.0.1:${PORT}/api/name`));
