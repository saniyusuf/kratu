// One demo language's build inputs, from content/langs/<code>/ → langs/<code>/ (Hausa's own files are never touched).
//   node scripts/build-content.mjs --lang sw
// The overlay langs/<code>/public is added to that build's assets by angular.json (configurations sw / yo / ig), which
// also leaves out Hausa's clips.json, words.json, media.json and audio/ha. English clips and every picture are shared.
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

export const langDir = (code) => 'content/langs/' + code;
export const outDir = (code) => 'langs/' + code + '/public/assets';
export function loadLang(code) {
  const pack = JSON.parse(readFileSync(langDir(code) + '/lang.json', 'utf8'));
  const lines = JSON.parse(readFileSync(langDir(code) + '/lines.json', 'utf8'));
  const words = JSON.parse(readFileSync(langDir(code) + '/words.json', 'utf8'));
  return { pack, lines, words };
}
/** The Hausa rows a language build speaks: the same live keys, in that language. */
export const spoken = (r) => r.status === 'live' && r.lang === 'ha';
/** A word's own clip in this language, or the word it shares one with when the two names are the same. */
export function clipOwner(w, names) { const of = typeof w.ha_clip === 'object' && w.ha_clip ? w.ha_clip.of : null; return of && names[of] === names[w.key] ? of : w.key; }
export const forms = (text) => typeof text === 'string' ? { any: text } : text;
/** A build with its own English voice (lang.json → english) keeps Laila's English lines and the English word names in
 *  audio/<english.dir>; the children's sample voices (sx_w_*) stay the shared ones. */
export const ownEnglish = (pack) => pack.english?.dir || null;
export const enOwner = (w) => typeof w.en_clip === 'object' && w.en_clip ? w.en_clip.of : w.key;

export function buildLang(code) {
  const { pack, lines: L, words: names } = loadLang(code), en = ownEnglish(pack);
  const ha = JSON.parse(readFileSync('content/lines.json', 'utf8')), W = JSON.parse(readFileSync('content/words.json', 'utf8'));
  const byKey = new Map(L.map((r) => [r.key, r]));
  const out = outDir(code); mkdirSync(out + '/audio/' + code, { recursive: true });
  const clips = {};
  for (const r of ha) {
    if (r.status !== 'live') continue;
    if (r.lang === 'en') { for (const [g, text] of Object.entries(forms(r.text))) { const key = g === 'any' ? r.key : r.key + '_' + g; clips[key] = { file: 'audio/' + (en && r.voice === 'laila' ? en : 'en') + '/' + key + '.ogg', ha: '', en: r.en || text }; } continue; }
    const x = byKey.get(r.key); if (!x) continue;   // the lint reports it
    for (const [g, text] of Object.entries(forms(x.text))) { const key = g === 'any' ? r.key : r.key + '_' + g; clips[key] = { file: 'audio/' + code + '/' + key + '.ogg', ha: text, en: x.en || '' }; }
  }
  writeFileSync(out + '/clips.json', JSON.stringify(clips));
  const wByKey = Object.fromEntries(W.words.map((w) => [w.key, w]));
  // a picture of this language's own (langs/<code>/public/assets/pictures-<code>/<key>.webp) wins over the shared one in this
  // build only: the people, dress and dishes a Yoruba, Igbo or Kenyan child would recognise; animals and objects stay shared
  const ownPic = (k) => existsSync(out + '/pictures-' + code + '/' + k + '.webp') ? 'pictures-' + code + '/' + k + '.webp' : null;
  const pic = (w) => !w.picture ? undefined : typeof w.picture === 'string' ? (ownPic(w.key) || w.picture) : pic(wByKey[w.picture.of]);
  const replaced = new Set(W.words.filter((w) => ownPic(w.key) && typeof w.picture === 'string').map((w) => 'assets/' + w.picture));
  const enClip = (w) => { const v = w.en_clip; if (!v) return undefined; return typeof v === 'object' ? enClip(wByKey[v.of]) : 'audio/' + (en || 'en') + '/word_' + w.key + '.ogg'; };
  const groups = Object.fromEntries(W.groups.map((g) => [g, []]));
  for (const w of W.words) for (const g of w.groups) groups[g].push({ k: w.key, img: pic(w), haClip: names[w.key] ? 'audio/' + code + '/word_' + clipOwner(w, names) + '.ogg' : undefined, enClip: enClip(w), ha: names[w.key] || '', en: w.en });
  writeFileSync(out + '/words.json', JSON.stringify(groups));
  // every media file this build ships: the shared ones (pictures, films, English) and this language's clips
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(dir + '/' + e.name) : [dir + '/' + e.name]);
  // a language with its own first-screen photos and example films (gender-*.webp, example-m/f.*) leaves out the Hausa ones
  const ownFaces = existsSync(out + '/gender-boy.webp') && existsSync(out + '/example-m.mp4');
  const SKIP = en ? /^assets\/(clips\.json|words\.json|media\.json|audio\/ha\/|audio\/en\/(app_|word_))/ : /^assets\/(clips\.json|words\.json|media\.json|audio\/ha\/)/;
  const shared = walk('public/assets').map((f) => ({ path: 'assets/' + f.slice('public/assets/'.length), size: statSync(f).size })).filter((f) => !SKIP.test(f.path) && !replaced.has(f.path) && !(ownFaces && /^assets\/(gender-|example-)/.test(f.path)));
  const own = walk(out).filter((f) => !/\/media\.json$/.test(f)).map((f) => ({ path: 'assets/' + f.slice(out.length + 1), size: statSync(f).size }));
  const media = shared.concat(own).sort((a, b) => a.path.localeCompare(b.path)), total = media.reduce((a, f) => a + f.size, 0);
  writeFileSync(out + '/media.json', JSON.stringify({ total, files: media }));
  // the app's language pack (what the screens need; the voice settings stay with the scripts)
  const { tts, status, english, ...app } = pack;
  writeFileSync('src/app/core/lang/lang.' + code + '.ts', '// Generated by `node scripts/build-content.mjs --lang ' + code + '` from content/langs/' + code + '/lang.json. Never edit by hand.\n' +
    "import { LangPack } from './lang-pack';\n\nexport const LANG: LangPack = " + JSON.stringify(app, null, 1) + ';\n');
  console.log(`content[${code}]: ${Object.keys(clips).length} clips, ${Object.keys(names).length} word names, ${Object.keys(pack.ui || {}).length} screen texts`);
  console.log(`media[${code}]:   ${media.length} files, ${(total / 1048576).toFixed(1)} MB`);
}
