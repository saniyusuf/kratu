// Voice comparison for Sani (9 Nov 2026): the same Laila lines in each voice we have or could use, read back by
// PlotWeaver's recogniser for a character error score, and saved as small ogg clips for a listening page.
//   node tools/voice_board.mjs <out dir>
// Keys stay in tools/.env.plotweaver and .env and are never printed. Only Laila's catalogue lines are sent anywhere.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { encode } from '../scripts/encode.mjs';

const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const pwKey = /^PLOTWEAVER_API_KEY=(.+)$/m.exec(readFileSync('tools/.env.plotweaver', 'utf8'))[1].trim();
const spKey = /^SPITCH_API_KEY=(.+)$/m.exec(readFileSync('.env', 'utf8'))[1].trim();
const N = 30, SHOW = ['s_w_name', 's_gate_first', 'app_cat_start_animals', 's_o_turn', 's_pop_intro', 's_g_fish_how', 's_n_intro', 's_retry_name'];

const LANGS = {
  ha: { rows: 'content/lines.json', dir: 'public/assets/audio/ha', live: (r) => r.status === 'live' && r.lang === 'ha',
        sources: [{ id: 'google', label: 'Google Hausa (the app today)', file: true }, { id: 'pw-amina', label: 'PlotWeaver Amina', pw: 'amina' }, { id: 'sp-zainab', label: 'Spitch Zainab', sp: 'zainab' }] },
  yo: { rows: 'content/langs/yo/lines.json', git: 'b22e1fd:langs/yo/public/assets/audio/yo', dir: 'langs/yo/public/assets/audio/yo',
        sources: [{ id: 'sp-funmi', label: 'Spitch Funmi (the Yoruba demo until today)', git: true }, { id: 'pw-morenike', label: 'PlotWeaver Morenike (now in the build)', file: true }] },
  ig: { rows: 'content/langs/ig/lines.json', dir: 'langs/ig/public/assets/audio/ig',
        sources: [{ id: 'sp-amara', label: 'Spitch Amara (the Igbo demo, kept)', file: true }, { id: 'pw-adaeze', label: 'PlotWeaver Adaeze', pw: 'adaeze' }] },
  pcm: { rows: 'content/langs/pcm/lines.json', git: '3f350ba:langs/pcm/public/assets/audio/pcm', dir: 'langs/pcm/public/assets/audio/pcm',
        sources: [{ id: 'pw-adaeze', label: 'PlotWeaver Adaeze (the first Pidgin voice)', git: true }, { id: 'pw-yemi', label: 'PlotWeaver Yemi (now in the build)', file: true }] },
};

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) { let p = Array.from({ length: b.length + 1 }, (_, j) => j); for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[b.length]; }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function asr(file, lang) {
  for (let i = 0; ; i++) { const fd = new FormData(); fd.append('file', new Blob([readFileSync(file)]), 'a.ogg'); fd.append('language', lang);
    const r = await fetch('https://api.plotweaver.app/v1/transcriptions', { method: 'POST', headers: { 'X-API-Key': pwKey }, body: fd }); if (r.ok) return (await r.json()).text; if (i > 4) throw new Error('asr ' + r.status); await wait(3000 * (i + 1)); }
}
async function fetchTo(url, init, dest, ext) {
  for (let i = 0; ; i++) { const r = await fetch(url, init); if (r.ok) { const tmp = dest + '.' + ext; writeFileSync(tmp, Buffer.from(await r.arrayBuffer())); encode(tmp, dest, { lufs: -17.7 }); rmSync(tmp); return; } if ([400, 401, 402, 403].includes(r.status) || i > 4) throw new Error(url + ' ' + r.status); await wait(3000 * (i + 1)); }
}
const pw = (text, lang, voice, dest) => fetchTo('https://api.plotweaver.app/v1/speech', { method: 'POST', headers: { 'X-API-Key': pwKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ text, language: lang, voice_id: voice }) }, dest, 'wav');
const sp = (text, lang, voice, dest) => fetchTo('https://api.spitch.app/v1/speech', { method: 'POST', headers: { Authorization: 'Bearer ' + spKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ language: lang, voice, text, format: 'mp3' }) }, dest, 'mp3');

const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const board = existsSync(join(OUT, 'board.json')) ? JSON.parse(readFileSync(join(OUT, 'board.json'), 'utf8')) : {};
for (const [code, L] of Object.entries(LANGS)) {
  if (ONLY && !ONLY.includes(code)) continue;
  const rows = JSON.parse(readFileSync(L.rows, 'utf8')).filter(L.live || ((r) => r.status === 'draft' || r.status === 'live'));
  const all = rows.flatMap((r) => typeof r.text === 'string' ? [{ key: r.key, k: r.key, t: r.text, en: r.en }] : r.text.m ? [{ key: r.key, k: r.key + '_m', t: r.text.m, en: r.en }] : [{ key: r.key, k: r.key, t: r.text.any, en: r.en }]);
  const pool = all.filter((p) => p.t.length > 25 && p.t.length < 160), step = Math.max(1, Math.floor(pool.length / N));
  const sample = pool.filter((_, i) => i % step === 0).slice(0, N);
  for (const k of SHOW) { const p = all.find((x) => x.key === k); if (p && !sample.includes(p)) sample.push(p); }
  board[code] = { sources: L.sources.map((s) => ({ id: s.id, label: s.label, err: 0, chars: 0 })), lines: [] };
  for (const p of sample) {
    const line = { key: p.key, text: p.t, en: p.en, show: SHOW.includes(p.key), heard: {} };
    for (const [si, s] of L.sources.entries()) {
      const d = join(OUT, code, s.id); mkdirSync(d, { recursive: true }); const dest = join(d, p.k + '.ogg');
      try {
        if (!existsSync(dest)) {
          if (s.file) { const f = join(L.dir, p.k + '.ogg'); if (!existsSync(f)) continue; writeFileSync(dest, readFileSync(f)); }
          else if (s.git) { try { writeFileSync(dest, execFileSync('git', ['show', L.git + '/' + p.k + '.ogg'], { maxBuffer: 1 << 24, stdio: ['ignore', 'pipe', 'ignore'] })); } catch { continue; } }
          else if (s.pw) await pw(p.t, code, s.pw, dest); else if (s.sp) await sp(p.t, code, s.sp, dest);
        }
        const got = fold(await asr(dest, code)), ref = fold(p.t), e = lev(ref, got);
        board[code].sources[si].err += e; board[code].sources[si].chars += ref.length; line.heard[s.id] = { text: got, err: +(100 * e / ref.length).toFixed(1) };
      } catch (e) { console.log('skip', code, s.id, p.k, String(e.message || e).slice(0, 80)); }
    }
    board[code].lines.push(line);
  }
  for (const s of board[code].sources) s.cer = s.chars ? +(100 * s.err / s.chars).toFixed(1) : null;
  console.log(code, board[code].sources.map((s) => `${s.id} ${s.cer}%`).join(' · '));
  writeFileSync(join(OUT, 'board.json'), JSON.stringify(board, null, 1));
}
