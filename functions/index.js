// The family app's name server (Sani 2026-11-25: "add the PlotWeaver server first, then deploy the family app").
// It does what tools/name-proxy.mjs does on a laptop, for the deployed app:
//   POST /api/name  the child's "Sunana …" clip (16 kHz mono WAV, about 6 s at most) → PlotWeaver STORM ASR (Hausa) → {text}
//   POST /api/say   a written name only (letters, 24 at most) → PlotWeaver's Hausa voice (Rahama) → Opus/Ogg at the app's level
// The key is the Functions secret PLOTWEAVER_KEY. Nothing here ever logs the key, the audio or the text: only sizes and times.
// Firebase Hosting (target "family") rewrites both paths here, so the app's own paths do not change.
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { spawn } from 'node:child_process';
import FFMPEG from 'ffmpeg-static';

const PLOTWEAVER_KEY = defineSecret('PLOTWEAVER_KEY');
const ASR_URL = 'https://api.plotweaver.app/v1/transcriptions';
const TTS_URL = 'https://api.plotweaver.app/v1/speech';
const SAY_VOICE = 'rahama';                         // the PlotWeaver Hausa voice nearest Laila's (239 Hz against 244 Hz)
const MAX_WAV_BYTES = 200 * 1024;                   // about 6.4 s of 16 kHz 16-bit mono; the app sends 6 s at most
const MAX_SAY_BODY = 512;
const SAY_MAX = 24;                                  // the longest name a parent can type
const NAME_TEXT = /^[\p{L}][\p{L}\p{M}' -]*$/u;
const UPSTREAM_TIMEOUT_MS = 6000;
// who may call: the family site only (same origin through the Hosting rewrite); the emulator adds its local origins
const ORIGINS = new Set(['https://kratu-family.web.app', 'https://kratu-family.firebaseapp.com']);
const LOCAL = process.env.FUNCTIONS_EMULATOR === 'true';
// a simple per-IP limit, per server instance (with maxInstances 3 the real ceiling is 3x this)
const LIMITS = { name: { max: 20, windowMs: 10 * 60 * 1000 }, say: { max: 10, windowMs: 10 * 60 * 1000 } };
const SEEN = new Map();   // "kind|ip" -> [times]

function limited(kind, ip) {
  const L = LIMITS[kind], NOW = Date.now(), K = kind + '|' + ip;
  const T = (SEEN.get(K) || []).filter((t) => NOW - t < L.windowMs);
  if (T.length >= L.max) { SEEN.set(K, T); return true; }
  T.push(NOW); SEEN.set(K, T);
  if (SEEN.size > 5000) for (const [k, v] of SEEN) if (!v.some((t) => NOW - t < L.windowMs)) SEEN.delete(k);
  return false;
}
function clientIp(req) { return String(req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim() || 'unknown'; }
function originOk(req) {
  const O = req.headers.origin;
  if (!O) return true;                              // same-origin POSTs from some browsers carry no Origin; the Hosting rewrite is the only way in
  return ORIGINS.has(O) || (LOCAL && /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(O));
}
function isWav(B) { return B.length > 44 && B.toString('ascii', 0, 4) === 'RIFF' && B.toString('ascii', 8, 12) === 'WAVE'; }
function json(res, code, body) { res.set('Cache-Control', 'no-store'); res.status(code).json(body); }

/** WAV in, Opus/Ogg out, at the app's loudness (-14 LUFS, peaks under -1.5 dBTP, 24 kHz mono). */
function encodeClip(WAV) {
  return new Promise((ok, bad) => {
    const F = spawn(FFMPEG, ['-loglevel', 'error', '-i', 'pipe:0', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,aresample=24000', '-ac', '1', '-c:a', 'libopus', '-b:a', '32k', '-f', 'ogg', 'pipe:1']);
    const OUT = []; F.stdout.on('data', (c) => OUT.push(c)); F.on('error', bad);
    F.on('close', (code) => (code === 0 ? ok(Buffer.concat(OUT)) : bad(new Error('ffmpeg ' + code))));
    F.stdin.on('error', () => undefined); F.stdin.end(WAV);
  });
}

async function name(req, res, KEY) {
  const WAV = req.rawBody || Buffer.alloc(0);
  if (WAV.length > MAX_WAV_BYTES) return json(res, 413, { error: 'clip too long' });
  if (!isWav(WAV)) return json(res, 400, { error: 'a WAV clip only' });
  const FORM = new FormData();
  FORM.append('language', 'ha');
  FORM.append('file', new Blob([WAV], { type: 'audio/wav' }), 'name.wav');
  const T0 = Date.now();
  try {
    const R = await fetch(ASR_URL, { method: 'POST', headers: { 'X-API-Key': KEY }, body: FORM, signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
    if (!R.ok) { console.log(`name: upstream ${R.status} in ${Date.now() - T0} ms`); return json(res, 502, { error: 'upstream ' + R.status }); }
    const D = await R.json();
    console.log(`name: ${(WAV.length / 32000).toFixed(1)} s clip, answered in ${Date.now() - T0} ms`);   // never the key, the audio or the text
    return json(res, 200, { text: typeof D?.text === 'string' ? D.text : '' });
  } catch (e) {
    console.log(`name: upstream failed after ${Date.now() - T0} ms (${e?.name || 'error'})`);
    return json(res, 504, { error: 'upstream failed' });
  }
}

async function say(req, res, KEY) {
  const RAW = req.rawBody || Buffer.alloc(0);
  if (RAW.length > MAX_SAY_BODY) return json(res, 413, { error: 'too long' });
  let TEXT = '';
  try { TEXT = String(JSON.parse(RAW.toString('utf8'))?.text || '').replace(/\s+/g, ' ').trim(); } catch { /* not JSON */ }
  if (!TEXT || TEXT.length > SAY_MAX || !NAME_TEXT.test(TEXT)) return json(res, 400, { error: 'a name only' });
  const T0 = Date.now();
  try {
    const R = await fetch(TTS_URL, { method: 'POST', headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ text: TEXT, language: 'ha', voice_id: SAY_VOICE, normalize: true }), signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
    if (!R.ok) { console.log(`say: upstream ${R.status} in ${Date.now() - T0} ms`); return json(res, 502, { error: 'upstream ' + R.status }); }
    const OGG = await encodeClip(Buffer.from(await R.arrayBuffer()));
    console.log(`say: ${TEXT.length} letters, ${OGG.length} bytes, answered in ${Date.now() - T0} ms`);   // never the key or the name
    res.set('Cache-Control', 'no-store'); res.set('Content-Type', 'audio/ogg'); return res.status(200).send(OGG);
  } catch (e) {
    console.log(`say: failed after ${Date.now() - T0} ms (${e?.name || 'error'})`);
    return json(res, 504, { error: 'upstream failed' });
  }
}

export const familyApi = onRequest({
  region: 'europe-west1',          // the nearest Firebase Hosting rewrite region to Nigeria in practice (Belgium)
  secrets: [PLOTWEAVER_KEY],
  memory: '512MiB', timeoutSeconds: 30, maxInstances: 3, concurrency: 40,
  cors: false, invoker: 'public',
}, async (req, res) => {
  const PATH = (req.path || req.url || '').replace(/\/+$/, '');
  const KIND = PATH.endsWith('/api/name') ? 'name' : PATH.endsWith('/api/say') ? 'say' : null;
  if (!KIND) return json(res, 404, { error: 'not found' });
  if (req.method !== 'POST') { res.set('Allow', 'POST'); return json(res, 405, { error: 'POST only' }); }
  if (!originOk(req)) return json(res, 403, { error: 'not allowed' });
  if (limited(KIND, clientIp(req))) { res.set('Retry-After', '600'); return json(res, 429, { error: 'slow down' }); }
  const KEY = (PLOTWEAVER_KEY.value() || '').trim();
  if (!KEY) { console.log('familyApi: no key set'); return json(res, 503, { error: 'not ready' }); }
  return KIND === 'name' ? name(req, res, KEY) : say(req, res, KEY);
});
