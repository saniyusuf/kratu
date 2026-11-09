// Reads back 30 lines of a demo language in two voices and reports the character error of each (the way the Spitch
// voices were chosen in October): the current clips in langs/<code>/…/audio/<code>, and a PlotWeaver voice recorded fresh.
//   node tools/voice_compare.mjs yo morenike      (key in tools/.env.plotweaver, never printed; only Laila's lines are sent)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const [code, voice, n = '30'] = process.argv.slice(2);
const key = /^PLOTWEAVER_API_KEY=(.+)$/m.exec(readFileSync('tools/.env.plotweaver', 'utf8'))[1].trim();
const out = process.env.OUT || '/tmp/kratu-compare'; mkdirSync(join(out, code), { recursive: true });
const rows = JSON.parse(readFileSync(`content/langs/${code}/lines.json`, 'utf8')).filter((r) => r.status === 'draft' || r.status === 'live');
// spread over the whole file, not the first 30
const all = rows.flatMap((r) => typeof r.text === 'string' ? [{ k: r.key, t: r.text }] : r.text.m ? [{ k: r.key + '_m', t: r.text.m }] : [{ k: r.key, t: r.text.any }]).filter((p) => p.t.length > 25 && p.t.length < 160);
const step = Math.max(1, Math.floor(all.length / +n)), sample = all.filter((_, i) => i % step === 0).slice(0, +n);

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; }
async function asr(file) {
  const fd = new FormData(); fd.append('file', new Blob([readFileSync(file)]), 'a.ogg'); fd.append('language', code);
  for (let i = 0; ; i++) { const r = await fetch('https://api.plotweaver.app/v1/transcriptions', { method: 'POST', headers: { 'X-API-Key': key }, body: fd }); if (r.ok) return (await r.json()).text; if (i > 3) throw new Error('asr ' + r.status); await new Promise((s) => setTimeout(s, 3000)); }
}
async function tts(text, dest) {
  const r = await fetch('https://api.plotweaver.app/v1/speech', { method: 'POST', headers: { 'X-API-Key': key, 'Content-Type': 'application/json' }, body: JSON.stringify({ text, language: code, voice_id: voice }) });
  if (!r.ok) throw new Error('tts ' + r.status); writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}
let e = { now: 0, pw: 0 }, c = 0; const rep = [];
for (const p of sample) {
  const cur = `langs/${code}/public/assets/audio/${code}/${p.k}.ogg`, pw = join(out, code, p.k + '.wav');
  if (!existsSync(pw)) await tts(p.t, pw);
  const ref = fold(p.t), a = existsSync(cur) ? fold(await asr(cur)) : null, b = fold(await asr(pw));
  c += ref.length; if (a !== null) e.now += lev(ref, a); e.pw += lev(ref, b);
  rep.push({ k: p.k, ref, now: a, pw: b });
}
writeFileSync(join(out, code, 'report.json'), JSON.stringify(rep, null, 1));
console.log(`${code}: ${sample.length} lines, ${c} chars · current voice ${(100 * e.now / c).toFixed(1)}% · PlotWeaver ${voice} ${(100 * e.pw / c).toFixed(1)}%`);
