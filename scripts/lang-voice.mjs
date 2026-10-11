// Records a demo language: every line and every word name whose clip is missing or whose text changed.
//   node scripts/voice.mjs --lang sw [--dry-run] [--only key] [--force] [--lines-only | --words-only]
// The voice is set in content/langs/<code>/lang.json → tts: Google's free voice where it speaks the language, else a
// local MMS-family model (tools/tts_mms.py in tools/.venv-tts). What each clip was made from is kept in recorded.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadLang, outDir, forms, clipOwner, langDir, ownEnglish, enOwner } from './lang-build.mjs';
import { encode } from './encode.mjs';

const H = (t) => createHash('sha1').update(t).digest('hex').slice(0, 10);

/** Microsoft's online neural voices (the edge-tts reader), for accents Google does not have — East African English. */
function edge(text, voice, dest, enc = {}) {
  const tmp = join(tmpdir(), 'kratu-edge-' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.mp3');
  // the service drops requests now and then (a plain word one minute, fine the next): a few tries, further apart each time
  for (let i = 0; ; i++) { try { execFileSync('tools/.venv-tts/bin/edge-tts', ['--voice', voice, '--text', text, '--write-media', tmp], { stdio: ['ignore', 'ignore', 'pipe'] }); break; } catch (e) { if (i >= 4) throw e; execFileSync('sleep', [String(2 * (i + 1))]); } }
  encode(tmp, dest, enc); rmSync(tmp, { force: true });
}

/** Spitch (paid, Nigerian voices): the key is SPITCH_API_KEY in .env, read here and never printed. */
const spitchKey = () => { const m = existsSync('.env') ? /^SPITCH_API_KEY=(.+)$/m.exec(readFileSync('.env', 'utf8')) : null; if (!m) throw new Error('no SPITCH_API_KEY in .env'); return m[1].trim(); };
async function spitch(text, lang, voice, dest, enc = {}) {
  for (let i = 0; ; i++) {
    const r = await fetch('https://api.spitch.app/v1/speech', { method: 'POST', headers: { Authorization: 'Bearer ' + spitchKey(), 'Content-Type': 'application/json' }, body: JSON.stringify({ language: lang, voice, text, format: 'mp3' }) });
    if (r.ok) { const tmp = join(tmpdir(), 'kratu-spitch-' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.mp3'); writeFileSync(tmp, Buffer.from(await r.arrayBuffer())); encode(tmp, dest, enc); rmSync(tmp, { force: true }); return; }
    if (r.status === 402 || r.status === 401 || i >= 3) throw new Error('spitch ' + r.status);   // no credit or a bad key: retrying will not help
    await new Promise((res) => setTimeout(res, 2000 * (i + 1)));
  }
}

async function google(text, voice, dest, enc = {}) {
  // Google reads at most ~200 characters at a time: cut at the punctuation and join the pieces
  const parts = text.split(/(?<=[.!?,:;])\s+/).map((t) => t.trim()).filter(Boolean), chunks = []; let cur = '';
  for (const t of parts) { if (cur.length + t.length + 1 > 180 && cur) { chunks.push(cur); cur = t; } else cur = (cur + ' ' + t).trim(); } if (cur) chunks.push(cur);
  const tmp = join(tmpdir(), 'kratu-lv-' + Date.now() + '-' + Math.random().toString(36).slice(2)); mkdirSync(tmp, { recursive: true });
  const files = [];
  for (const [i, c] of chunks.entries()) {
    const r = await fetch('https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + voice + '&q=' + encodeURIComponent(c), { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error('tts ' + r.status); const f = join(tmp, 'p' + i + '.mp3'); writeFileSync(f, Buffer.from(await r.arrayBuffer())); files.push(f);
  }
  writeFileSync(join(tmp, 'list.txt'), files.map((f) => `file '${f}'\n`).join(''));
  const raw = join(tmp, 'all.wav'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'), raw]);
  encode(raw, dest, enc); rmSync(tmp, { recursive: true, force: true });
}

export async function voiceLang(code, args) {
  const { pack, lines, words: names } = loadLang(code);
  const W = JSON.parse(readFileSync('content/words.json', 'utf8'));
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null, dry = args.includes('--dry-run'), force = args.includes('--force');
  const recFile = langDir(code) + '/recorded.json', rec = existsSync(recFile) ? JSON.parse(readFileSync(recFile, 'utf8')) : {};
  const dir = outDir(code) + '/audio/' + code; mkdirSync(dir, { recursive: true });
  const plan = [];
  if (!args.includes('--words-only')) for (const r of lines) {
    if (r.status !== 'draft' && r.status !== 'live') continue; if (only && r.key !== only) continue;
    for (const [g, text] of Object.entries(forms(r.text))) { const key = g === 'any' ? r.key : r.key + '_' + g; plan.push({ key, text }); }
  }
  if (!args.includes('--lines-only')) for (const w of W.words) {
    const name = names[w.key]; if (!name || clipOwner(w, names) !== w.key) continue; if (only && w.key !== only && 'word_' + w.key !== only) continue;
    plan.push({ key: 'word_' + w.key, text: name });
  }
  // a build with its own English voice: Laila's English lines and the English word names, in that voice
  const en = ownEnglish(pack), enTodo = [];
  if (en && !args.includes('--lines-only') && !args.includes('--words-only')) {
    const enDir = outDir(code) + '/audio/' + en; mkdirSync(enDir, { recursive: true });
    const ha = JSON.parse(readFileSync('content/lines.json', 'utf8'));
    const want = ha.filter((r) => r.status === 'live' && r.lang === 'en' && r.voice === 'laila').map((r) => ({ key: r.key, text: String(r.text) }))
      .concat(W.words.filter((w) => w.en_clip === true).map((w) => ({ key: 'word_' + w.key, text: String(w.en) })));
    for (const p of want) { if (only && p.key !== only) continue; const rk = en + '/' + p.key; if (force || !existsSync(enDir + '/' + p.key + '.ogg') || rec[rk] !== H(p.text)) enTodo.push({ ...p, rk, dest: enDir + '/' + p.key + '.ogg' }); }
  }
  const todo = plan.filter((p) => force || !existsSync(dir + '/' + p.key + '.ogg') || rec[p.key] !== H(p.text));
  console.log(todo.concat(enTodo).length ? todo.concat(enTodo).map((p) => `${p.rk || p.key}  ← “${p.text}”`).join('\n') : 'nothing to record'); if (dry || !todo.concat(enTodo).length) return 0;
  let made = 0, failed = 0; const save = () => writeFileSync(recFile, JSON.stringify(Object.fromEntries(Object.entries(rec).sort()), null, 1) + '\n');
  const same = new Map();   // one recording per distinct text: a boy's and a girl's line that read the same share it
  const tts = pack.tts || {}, enc = { tempo: tts.tempo, lufs: tts.lufs }, encEn = { lufs: pack.english?.lufs };
  if (tts.provider === 'mms' && todo.length) {
    const tmp = join(tmpdir(), 'kratu-mms-' + Date.now()); mkdirSync(tmp, { recursive: true });
    const jobs = []; for (const p of todo) { if (same.has(p.text)) continue; const out = join(tmp, jobs.length + '.wav'); same.set(p.text, out); jobs.push({ text: p.text, out }); }
    writeFileSync(join(tmp, 'jobs.json'), JSON.stringify(jobs));
    execFileSync('tools/.venv-tts/bin/python', ['tools/tts_mms.py', '--model', tts.model, '--jobs', join(tmp, 'jobs.json')].concat(tts.rate ? ['--rate', String(tts.rate)] : []), { stdio: ['ignore', 'ignore', 'inherit'] });
    for (const p of todo) { try { encode(same.get(p.text), dir + '/' + p.key + '.ogg', enc); rec[p.key] = H(p.text); made++; console.log('made  ' + p.key); } catch (e) { failed++; console.log('FAIL  ' + p.key + ' ' + (e.message || e)); } }
    rmSync(tmp, { recursive: true, force: true });
  } else if (tts.provider === 'google' || tts.provider === 'edge' || tts.provider === 'spitch') {
    for (const p of todo) {
      const dest = dir + '/' + p.key + '.ogg';
      try { if (same.has(p.text)) copyFileSync(same.get(p.text), dest); else { if (tts.provider === 'edge') edge(p.text, tts.voice, dest, enc); else if (tts.provider === 'spitch') await spitch(p.text, tts.lang || code, tts.voice, dest, enc); else await google(p.text, tts.voice, dest, enc); same.set(p.text, dest); } rec[p.key] = H(p.text); made++; console.log('made  ' + p.key); if (made % 20 === 0) save(); }
      catch (e) { failed++; console.log('FAIL  ' + p.key + ' ' + (e.message || e)); }
    }
  } else if (todo.length) throw new Error('lang.json tts.provider must be google, edge, spitch or mms');
  for (const p of enTodo) { try { if (pack.english.provider !== 'edge') throw new Error('english.provider must be edge'); edge(p.text, pack.english.voice, p.dest, encEn); rec[p.rk] = H(p.text); made++; console.log('made  ' + p.rk); if (made % 20 === 0) save(); } catch (e) { failed++; console.log('FAIL  ' + p.rk + ' ' + (e.message || e)); } }
  save();
  console.log(`voice[${code}]: ${made} made, ${failed} failed`); return failed;
}
