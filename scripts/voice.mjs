// Records what the catalogue says but the assets lack: a line with no clip, or whose text changed since it was recorded.
//   npm run voice            every missing or changed line       --dry-run   list only
//   npm run voice -- --only s_back        one line (both voices)  --force     re-record even if unchanged
// Provider: KRATU_TTS in .env (google = the Translate voice used for every clip so far; add others in synth()).
// Every clip is normalised to −18.5 dB mean and encoded opus 24 kHz mono. The key, if any, is read from .env and never printed.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const env = existsSync('.env') ? Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])) : {};
const PROVIDER = env.KRATU_TTS || process.env.KRATU_TTS || 'google', TARGET_DB = -18.5;
const args = process.argv.slice(2), only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null, dry = args.includes('--dry-run'), force = args.includes('--force');
const H = (t) => createHash('sha1').update(t).digest('hex').slice(0, 10);
/**
 * Which voice reads a language. The clips live in audio/ha and audio/en; English is asked for as en-NG so the children
 * hear Nigerian English rather than American — the only accent difference this recorder honours (Sani 2026-09-24).
 */
const VOICE = { ha: 'ha', en: 'en-NG' };
export const ttsLang = (lang) => VOICE[lang] || lang;

async function synth(text, lang) {
  if (PROVIDER === 'google') { const r = await fetch('https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + ttsLang(lang) + '&q=' + encodeURIComponent(text), { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (!r.ok) throw new Error('tts ' + r.status); return Buffer.from(await r.arrayBuffer()); }
  throw new Error('unknown provider ' + PROVIDER);
}
function chunks(text) { const parts = text.split(/(?<=[.!?,:])\s+/).map((t) => t.trim()).filter(Boolean), out = []; let cur = ''; for (const t of parts) { if (cur.length + t.length + 1 > 180 && cur) { out.push(cur); cur = t; } else cur = (cur + ' ' + t).trim(); } if (cur) out.push(cur); return out; }
async function record(text, lang, dest) {
  const tmp = join(tmpdir(), 'kratu-voice-' + Date.now()); mkdirSync(tmp, { recursive: true });
  const files = []; for (const [i, c] of chunks(text).entries()) { const f = join(tmp, 'p' + i + '.mp3'); writeFileSync(f, await synth(c, lang)); files.push(f); }
  writeFileSync(join(tmp, 'list.txt'), files.map((f) => `file '${f}'\n`).join(''));
  const raw = join(tmp, 'raw.wav'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'), '-ac', '1', '-ar', '24000', raw]);
  const det = execFileSync('ffmpeg', ['-i', raw, '-af', 'volumedetect', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'] }).toString() + ''; const m = /mean_volume:\s*(-?[\d.]+) dB/.exec(det) || /mean_volume:\s*(-?[\d.]+) dB/.exec(execFileSync('ffmpeg', ['-i', raw, '-af', 'volumedetect', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }));
  const gain = m ? (TARGET_DB - parseFloat(m[1])).toFixed(2) : '0';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', 'volume=' + gain + 'dB', '-c:a', 'libopus', '-b:a', '24k', '-ac', '1', dest]);
  rmSync(tmp, { recursive: true, force: true });
}
if (args.includes('--word')) { const text = args[args.indexOf('--text') + 1], lang = args[args.indexOf('--lang') + 1], dest = args[args.indexOf('--dest') + 1]; await record(text, lang, dest); console.log('made  ' + dest); process.exit(0); }
const lines = JSON.parse(readFileSync('content/lines.json', 'utf8')); const plan = [];
for (const r of lines) {
  if (r.status !== 'live' || r.voice !== 'laila') continue; if (only && r.key !== only) continue;
  const texts = typeof r.text === 'string' ? { any: r.text } : r.text, rec = typeof r.recorded === 'string' ? { any: r.recorded } : (r.recorded || {});
  for (const [g, text] of Object.entries(texts)) { const key = g === 'any' ? r.key : r.key + '_' + g, dest = `public/assets/audio/${r.lang}/${key}.ogg`; if (force || !existsSync(dest) || rec[g] !== H(text)) plan.push({ r, g, key, text, dest }); }
}
console.log(plan.length ? plan.map((p) => `${p.key}  ← “${p.text}”`).join('\n') : 'nothing to record'); if (dry || !plan.length) process.exit(0);
let made = 0, failed = 0;
for (const p of plan) { try { mkdirSync(`public/assets/audio/${p.r.lang}`, { recursive: true }); await record(p.text, p.r.lang, p.dest); if (typeof p.r.text === 'string') p.r.recorded = H(p.text); else { p.r.recorded = typeof p.r.recorded === 'object' && p.r.recorded ? p.r.recorded : {}; p.r.recorded[p.g] = H(p.text); } made++; console.log('made  ' + p.dest); } catch (e) { failed++; console.log('FAIL  ' + p.key + ' ' + (e.message || e)); } }
writeFileSync('content/lines.json', JSON.stringify(lines, null, 1) + '\n');
console.log(`voice: ${made} made, ${failed} failed, ${plan.length - made - failed} skipped`); process.exit(failed ? 1 : 0);
