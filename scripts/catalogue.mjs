// The catalogue of permanent content keys (Sani 2026-11-16). Every piece of content has one named key, in English, lower
// snake_case, set once and never changed or reused: word_goat, number_7, letter_a, line_pop_intro, game_balloons,
// lesson_letters, unit_letters_a_d, group_animals, name_musa. Stored data (answers, plays, lessons) holds these keys,
// never a word in some language or a file name. Files are keyed from their item: media kind first, the language last:
// pic_word_goat (shared by every language), pic_word_aunt_yo (a language's own picture), audio_word_goat_ha,
// audio_line_pop_intro_m_ha (a boy's or girl's version), audio_letter_a_en.
//
//   content/catalogue.json        the truth: key → today's internal key. New content gets a key added; an existing key is
//                                 never edited; content that disappears keeps its key, marked retired.
//   public/assets/catalogue.json  generated for the app: every key with its values per language and its files.
//
//   node scripts/catalogue.mjs           assign keys for new content, then write the app's copy
//   node scripts/catalogue.mjs --check   fail if a key was changed or removed since the last commit, or content has no key
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { lineName } from './line-names.mjs';

const CHECK = process.argv.includes('--check');
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const TRUTH = 'content/catalogue.json', OUT = 'public/assets/catalogue.json';
const LANGS = readdirSync('content/langs').filter((c) => existsSync(`content/langs/${c}/lang.json`));
const slug = (s) => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

// ---- what exists today, each with the key it should get --------------------------------------------------------------
const W = read('content/words.json'), lines = read('content/lines.json');
const NUM_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const numberOf = (k) => NUM_WORDS[k] ?? (/^[pn](\d+)$/.test(k) ? +k.slice(1) : null);
const GROUP = { lambobi_palms: 'numbers_palms', lambobi_symbols: 'numbers_symbols', lambobi_tens: 'numbers_tens', lambobi_hundreds: 'numbers_hundreds' };
const LESSON = { haruffa: 'letters', abubuwa: 'words', nemo: 'find', lambobi: 'numbers', karatu: 'reading', rubutu: 'spelling' };
const UNIT = {
  haruffa: { g0: 'a_d', g1: 'e_h', g2: 'i_l', g3: 'm_p', g4: 'q_t', g5: 'u_x', g6: 'y_z', final: 'all' },
  nemo: { q4: 'four_pictures', qnum: 'numbers' },
  lambobi: { s0: 'stage_1', s1: 'stage_2', s2: 'stage_3', s3: 'stage_4', s4: 'stage_5', test: 'test' },
  karatu: { k3: '3_letters', k45: '4_5_letters', klong: 'long_words', knum: 'numbers' },
  rubutu: { r3: '3_letters', r4: '4_letters', r5: '5_letters', rlong: 'long_words', rnum: 'numbers' },
  abubuwa: Object.fromEntries(['animals', 'food', 'home', 'body', 'nature', 'vehicles', 'people', 'actions', 'clothing', 'school'].map((g) => [g, g])),
};
const GAME = { fashe: 'balloons', 'j-durbar': 'durbar', 'j-abubuwa': 'fishing', 'j-magana': 'talking_drum', 'j-dillali': 'auctioneer',
  'j-nemo': 'market_rush', 'j-shayi': 'tea_seller', 'j-gyada': 'groundnut_pyramids', 'j-shanu': 'animal_market', 'j-garke': 'counting_herd',
  'j-suya': 'suya_seller', 'j-karatu': 'canoes', 'j-allo': 'writing_board', 'j-jirgi': 'ferry', 'j-ruwa': 'rain_on_the_farm',
  'j-rubutu': 'clay_pots', 'j-rubutu-say': 'build_the_house', 'j-marubuci': 'letter_writer', 'j-rini': 'dye_pits' };

const want = [];   // { key, type, src }
for (const w of W.words) { const n = numberOf(w.key); want.push(n !== null ? { key: 'number_' + n, type: 'number', src: w.key } : { key: 'word_' + slug(w.key), type: 'word', src: w.key }); }
for (const g of W.groups) want.push({ key: 'group_' + (GROUP[g] || slug(g)), type: 'group', src: g });
for (const c of 'abcdefghijklmnopqrstuvwxyz') want.push({ key: 'letter_' + c, type: 'letter', src: c.toUpperCase() });
for (const r of lines) { if (/^app_en_[A-Z]$/.test(r.key)) continue; want.push({ key: 'line_' + (lineName(r.key) || slug(r.key.replace(/^(s_|app_)/, ''))), type: 'line', src: r.key }); }
for (const [src, k] of Object.entries(GAME)) want.push({ key: 'game_' + k, type: 'game', src });
for (const [src, k] of Object.entries(LESSON)) want.push({ key: 'lesson_' + k, type: 'lesson', src });
for (const [l, units] of Object.entries(UNIT)) for (const [src, k] of Object.entries(units)) want.push({ key: `unit_${LESSON[l]}_${k}`, type: 'unit', src: l + '/' + src });
if (existsSync('public/names_bank_expanded.json')) for (const k of Object.keys(read('public/names_bank_expanded.json'))) want.push({ key: 'name_' + slug(k), type: 'name', src: k });

// ---- assign: existing keys are never touched -------------------------------------------------------------------------
const truth = existsSync(TRUTH) ? read(TRUTH) : { version: 1, note: 'Permanent content keys. Never edit or remove a key: add new ones, mark old ones retired.', keys: {} };
const keys = truth.keys, problems = [], added = [];
const srcKey = (t, s) => t + ':' + s;   // numbers have three sources (one, p1, n1): one item, three forms
const bySrc = new Map(); for (const [k, v] of Object.entries(keys)) for (const s of [].concat(v.src)) bySrc.set(srcKey(v.type, s), k);
const seen = new Set();
for (const w of want) {
  const sk = srcKey(w.type, w.src); seen.add(sk);
  if (bySrc.has(sk)) continue;
  if (CHECK) { problems.push(`no key for ${w.type} "${w.src}"`); continue; }
  const k = w.key;
  if (keys[k] && keys[k].type === w.type && (w.type === 'number')) { keys[k].src = [].concat(keys[k].src, w.src); bySrc.set(sk, k); continue; }
  let kk = k, i = 2; while (keys[kk]) kk = k + '_' + i++;
  if (kk !== k) problems.push(`"${w.src}" wanted ${k}, already taken: given ${kk}. Pick a qualifier by hand if this is wrong.`);
  keys[kk] = { type: w.type, src: w.type === 'number' ? [w.src] : w.src }; bySrc.set(sk, kk); added.push(kk);
}
for (const [k, v] of Object.entries(keys)) { const gone = [].concat(v.src).every((s) => !seen.has(srcKey(v.type, s))); if (gone && !v.retired) { if (CHECK) problems.push(`${k} lost its content: mark it retired`); else { v.retired = true; problems.push(`${k} retired (its content is gone)`); } } }
for (const k of Object.keys(keys)) if (!/^[a-z][a-z0-9_]*$/.test(k)) problems.push(`bad key ${k}`);

// ---- check against the last commit: keys only ever grow -------------------------------------------------------------
if (CHECK) {
  let prev = null; try { prev = JSON.parse(execFileSync('git', ['show', 'HEAD:' + TRUTH], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })); } catch { /* first commit of the catalogue */ }
  if (prev) for (const [k, v] of Object.entries(prev.keys)) {
    if (!keys[k]) problems.push(`key ${k} was removed (keys are never removed: mark it retired)`);
    else if (keys[k].type !== v.type || JSON.stringify([].concat(v.src)) !== JSON.stringify([].concat(keys[k].src).slice(0, [].concat(v.src).length))) problems.push(`key ${k} was changed`);
  }
  if (problems.length) { console.error('catalogue: ' + problems.length + ' problem(s)\n  ' + problems.join('\n  ')); process.exit(1); }
  console.log('catalogue: ' + Object.keys(keys).length + ' keys, all good'); process.exit(0);
}
writeFileSync(TRUTH, JSON.stringify(truth, null, 1) + '\n');

// ---- the app's copy: every key with its values per language and its files ------------------------------------------
const wBy = Object.fromEntries(W.words.map((w) => [w.key, w]));
const langWords = Object.fromEntries(LANGS.map((c) => [c, existsSync(`content/langs/${c}/words.json`) ? read(`content/langs/${c}/words.json`) : {}]));
const langLines = Object.fromEntries(LANGS.map((c) => [c, existsSync(`content/langs/${c}/lines.json`) ? Object.fromEntries(read(`content/langs/${c}/lines.json`).map((r) => [r.key, r])) : {}]));
const has = (p) => existsSync(p);
const files = {}, items = {};
const picOf = (w) => !w || !w.picture ? null : typeof w.picture === 'string' ? w.picture : picOf(wBy[w.picture.of]);
const audioPath = (lang, name) => lang === 'ha' || lang === 'en' ? `public/assets/audio/${lang}/${name}.ogg` : `langs/${lang}/public/assets/audio/${lang}/${name}.ogg`;
for (const [k, v] of Object.entries(keys)) {
  if (v.retired) { items[k] = { type: v.type, retired: true }; continue; }
  const it = { type: v.type, src: v.src };
  if (v.type === 'word' || v.type === 'number') {
    const forms = [].concat(v.src).map((s) => wBy[s]).filter(Boolean), w = forms[0];
    it.values = { ha: w.ha, en: w.en }; for (const c of LANGS) if (langWords[c][w.key]) it.values[c] = langWords[c][w.key];
    it.files = [];
    forms.forEach((f, i) => {
      const form = v.type === 'number' ? (/^p\d/.test(f.key) ? '_palm' : '') : '';
      const p = picOf(f); if (p) { const fk = `pic_${k}${form}`; if (!files[fk]) { files[fk] = 'assets/' + p; it.files.push(fk); } }
      for (const c of LANGS) { const own = `langs/${c}/public/assets/pictures-${c}/${f.key}.webp`; if (has(own)) { const fk = `pic_${k}${form}_${c}`; files[fk] = `assets/pictures-${c}/${f.key}.webp`; it.files.push(fk); } }
      if (i === 0) for (const lang of ['ha', 'en', ...LANGS]) { const src = typeof f[lang + '_clip'] === 'object' ? 'word_' + f[lang + '_clip'].of : 'word_' + f.key; if (has(audioPath(lang, src))) { const fk = `audio_${k}_${lang}`; files[fk] = audioPath(lang, src).replace(/^(public|langs\/\w+\/public)\//, ''); it.files.push(fk); } }
    });
  } else if (v.type === 'game') {
    // the game's picture on the shelf: pic_game_balloons shared, pic_game_balloons_yo a language's own, a second one _2
    it.files = [];
    for (const [q, suf] of [['', ''], ['_2', '-2']]) {
      if (has(`public/assets/games/${v.src}${suf}.webp`)) { const fk = `pic_${k}${q}`; files[fk] = `assets/games/${v.src}${suf}.webp`; it.files.push(fk); }
      for (const c of LANGS) if (has(`langs/${c}/public/assets/games/${v.src}${suf}.webp`)) { const fk = `pic_${k}${q}_${c}`; files[fk] = `assets/games/${v.src}${suf}.webp`; it.files.push(fk); }
    }
  } else if (v.type === 'letter') {
    it.files = []; if (has(audioPath('en', 'app_en_' + v.src))) { files[`audio_${k}_en`] = `assets/audio/en/app_en_${v.src}.ogg`; it.files.push(`audio_${k}_en`); }
  } else if (v.type === 'line') {
    const r = lines.find((x) => x.key === v.src); it.files = []; it.values = {};
    if (r) { const t = typeof r.text === 'string' ? { any: r.text } : r.text; it.values[r.lang] = t; it.values.en = r.en || undefined;
      for (const lang of [r.lang, ...LANGS]) for (const g of ['any', 'm', 'f']) { const name = g === 'any' ? r.key : r.key + '_' + g;   /* a language may have one text where Hausa has a boy's and a girl's, or the other way round */ if (has(audioPath(lang, name))) { const fk = `audio_${k}${g === 'any' ? '' : '_' + g}_${lang}`; files[fk] = audioPath(lang, name).replace(/^(public|langs\/\w+\/public)\//, ''); it.files.push(fk); } }
      for (const c of LANGS) if (langLines[c][r.key]) it.values[c] = langLines[c][r.key].text; }
  }
  items[k] = it;
}
writeFileSync(OUT, JSON.stringify({ version: truth.version, items, files }));
const n = (t) => Object.values(keys).filter((v) => v.type === t && !v.retired).length;
console.log(`catalogue: ${Object.keys(keys).length} keys (${n('word')} words, ${n('number')} numbers, ${n('letter')} letters, ${n('line')} lines, ${n('game')} games, ${n('lesson')} lessons, ${n('unit')} units, ${n('group')} groups, ${n('name')} names), ${Object.keys(files).length} files; ${added.length} new`);
if (problems.length) console.log('  ' + problems.join('\n  '));
