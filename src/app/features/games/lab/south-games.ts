// @ts-nocheck
/*
 * The Yoruba and Igbo builds' OWN games (Sani 6 Nov 2026: "not replacements of the Hausa ones, completely different,
 * specific to the culture"), from the 28 Oct list (https://claude.ai/artifact/W5cJfx4ngNGtVhPPzkBgSa). Each one keeps
 * its course slot (the same words, the same skill, the same gate), but its own object, its own play and its own ending:
 *   j-rubutu  Yoruba Ayò: letter seeds sown into the pits of an ayo board; a whole word is captured into your store.
 *             Igbo Aka: red coral beads threaded onto a necklace; a whole word is clasped round the chief's neck.
 *   j-allo    Yoruba Ìlẹ̀kùn Ààfin: read the word on a panel of the palace door and the carver cuts it into a carving;
 *             every panel carved and the door swings open.  Igbo Uli: read the word on the compound wall and the painter
 *             turns it into an uli pattern; the wall fills with uli.
 * Hausa never loads this file's games (SKIN is null there). Drawn SVG, transform and opacity only (sg.css, under .sg).
 */
import { person, SKT, dk, lt, f1, water, lorry, flag, bunting, canopy, keke } from './south';
import { talkingDrum } from './kalangu';
import { liveAC } from './audioctx';
import { CLOTH_DEFS, CLOTH, dressed, band, weather, zinc, louvre, sign, poles, chair, goat, hen, agama, flags, earth, town, smoke, onlooker, cloudy, birdsAt } from './south-dress';

export function southGames(c: any, L: 'yo' | 'ig'): Record<string, any> {
  const { K, h, say, shuffle, micBox, line, F, io, opts, LW, txt, spoken, letters, gaps, secs } = c;
  const Y = L === 'yo';
  let ac = null;
  const later = (run, ms, f) => run.later(ms, f);
  const bump = (el, cls, ms = 700) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); if (ms) setTimeout(() => el.classList.remove(cls), ms); };
  /** a short knock: a seed in a pit, a chisel on wood, a bead on the string (pitch and length vary) */
  function knock(f = 300, len = .09, vol = .5) {
    try {
      ac = liveAC(ac); const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * .55, t + len);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + len); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + len + .02);
    } catch (e) { /* no sound */ }
  }
  const knocks = (run, n, f, gap = 110) => { for (let k = 0; k < n; k++) later(run, k * gap, () => knock(f * (1 + (k % 2) * .18))); };
  /** the stage's people cheer or frown (sg.css: .sg.cheer / .sg.sad) */
  const mood = (st, kind) => { st.classList.remove('cheer', 'sad'); void st.offsetWidth; st.classList.add(kind); setTimeout(() => st.classList.remove(kind), 1600); };
  const fallback = (n) => shuffle(['cat', 'dog', 'sun', 'bus', 'cup', 'goat', 'fish']).slice(0, n);
  const pool = (w) => shuffle(w.split('').concat(shuffle('BDEGHKLMPRT'.split('').filter((x) => w.indexOf(x) < 0)).slice(0, 2)));
  const svgBack = (inner) => '<svg class="sgback" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + CLOTH_DEFS + inner + '</svg>';

  /* ---------------- shared: a speaking round with Laila listening by herself after the first press ---------------- */
  function autoRound(run, box, target, among, onRight, onMiss) {
    let quiet = 0;
    box.listen(() => { run.auto = true; return { target, among, match: (raw) => io.match(raw, target, among) }; }, (r) => {
      if (r.value === null && !r.raw) {
        if (run.auto && ++quiet < 2) { box.busy = false; box.go(); return; }
        run.auto = false; box.cue(); return;
      }
      box.busy = true;
      if (r.value === target) { box.yay(); onRight(); return; }
      run.bad(); box.nope(); onMiss();
    }, () => target);
    if (!run.auto || !box.go) { box.cue(); return; }
    box.busy = true;
    Promise.resolve(run.said).then(() => later(run, 450, () => { if (!run.dead && !run.listening) { box.busy = false; box.go(); } }));
  }

  /* ---------------- shared: spelling by tapping (one wrong letter ends the word, as in every spelling game) ---------------- */
  function spellGame(run, done, o) {
    const W = LW.length ? shuffle(LW) : fallback(4), N = W.length; let wi = 0, li = 0, words = 0, misses = 0, busy = false;
    run.scr.appendChild(o.st);
    run.clock(secs(120, N, 4), () => done({ right: words, part: words / N, misses }));
    run.remind = () => say(K.en[W[wi]], run);
    const pic = o.st.querySelector('.sgpic img'), slotsBox = o.st.querySelector(o.slots), padBox = o.st.querySelector(o.pad);
    function nextWord() { wi++; if (wi >= N) later(run, 1500, () => done({ right: words, finished: words === N, misses })); else later(run, 1700, word); }
    function word() {
      busy = false; const w = letters(W[wi]); li = 0; run.item(W[wi]); pic.src = K.pic[W[wi]];
      slotsBox.innerHTML = w.split('').map(() => '<span class="sgslot"></span>').join(''); gaps(slotsBox, W[wi]);
      o.st.style.setProperty('--n', String(w.length)); if (o.start) o.start(w);
      padBox.innerHTML = '';
      pool(w).forEach((Lt, k) => {
        const b = h('<button type="button" class="sgpiece" aria-label="' + Lt + '" style="--k:' + k + '">' + o.piece(Lt) + '</button>');
        b.onclick = () => {
          if (b.disabled || run.dead || busy) return;
          if (Lt === w[li]) {
            run.idle = 0; b.disabled = true; const slot = slotsBox.children[li]; li++;
            const br = io.rect(b), sr = io.rect(slot);
            b.style.setProperty('--tx', (sr.left + sr.width / 2 - (br.left + br.width / 2)) + 'px'); b.style.setProperty('--ty', (sr.top + sr.height / 2 - (br.top + br.height / 2)) + 'px');
            b.classList.add('fly');
            later(run, 520, () => { slot.innerHTML = o.placed(Lt); slot.classList.add('on'); b.classList.add('gone'); o.land(slot); say(K.L[Lt], run); });
            if (li >= w.length) { busy = true; later(run, 760, () => { run.good(slotsBox); words++; o.win(w, words); mood(o.st, 'cheer'); }); nextWord(); }
          } else {
            busy = true; misses++; run.bad(); mood(o.st, 'sad'); o.miss(b); nextWord();
          }
        };
        padBox.appendChild(b);
      });
      later(run, 200, () => say(K.en[W[wi]], run));
    }
    word();
  }


  /* ---------------- shared: read the words, tap the one for the picture (Karatu) ---------------- */
  function readRounds(n = 4) {
    const SPARE = ['CAT', 'DOG', 'SUN', 'BUS', 'CUP', 'BED', 'HAT', 'PEN', 'GOAT', 'FISH', 'BOOK', 'MILK', 'BREAD', 'MANGO', 'WATER', 'CHAIR'];
    const src = LW.length ? LW : ['cat', 'dog', 'sun', 'bus', 'cup'];
    return shuffle(src).map((w) => {
      const t = txt(w).toUpperCase(), all = src.map((x) => txt(x).toUpperCase()).concat(SPARE).filter((x, k, a) => x !== t && a.indexOf(x) === k);
      const near = shuffle(all).sort((a, b) => (Math.abs(a.length - t.length) - Math.abs(b.length - t.length)) || ((b[0] === t[0] ? 1 : 0) - (a[0] === t[0] ? 1 : 0)));
      return [w, [t].concat(near.slice(0, n - 1))];
    });
  }
  function pickGame(run, done, o) {
    const R = readRounds(o.n), N = R.length; let r = 0, got = 0, busy = false;
    run.scr.appendChild(o.st); const pic = o.st.querySelector('.sgpic img'), lane = o.st.querySelector(o.lanes);
    run.clock(secs(120, N, 5), () => done({ right: got, part: got / N, misses: run.miss }));
    run.remind = () => say(line(o.gid, 'how'), run);
    function round() {
      busy = false; const item = R[r]; run.item(item[0]); pic.src = K.pic[item[0]]; lane.innerHTML = ''; if (o.start) o.start();
      shuffle(item[1]).forEach((w, k) => {
        const b = h('<button type="button" class="sgopt" aria-label="' + w.toLowerCase() + '" style="--k:' + k + '">' + o.piece(w, k) + '</button>');
        b.onclick = () => {
          if (run.dead || busy) return; busy = true;
          if (w === item[1][0]) { run.good(b); got++; mood(o.st, 'cheer'); o.right(b, k); }
          else { run.bad(); mood(o.st, 'sad'); o.wrong(b, k); }
          r++; later(run, 2300, () => { if (r >= N) done({ right: got, finished: true, part: got / N, misses: run.miss }); else round(); });
        };
        lane.appendChild(b);
      });
    }
    round();
  }
  function horn(lo) { [0, .22].forEach((d) => { try { ac = liveAC(ac); const t = ac.currentTime + d, o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = lo ? 180 : (d ? 392 : 330);
    g.gain.setValueAtTime(.12, t); g.gain.setValueAtTime(.12, t + .16); g.gain.exponentialRampToValueAtTime(.001, t + .2); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + .22); } catch (e) { /* no sound */ } }); }

  /* ================= Yoruba: the Lagos boat regatta (Karatu) ================= */
  function regattaBack() {
    let g = '<defs><linearGradient id="sg-rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD0EC"/><stop offset=".5" stop-color="#CBE8F4"/><stop offset="1" stop-color="#EAF4F6"/></linearGradient>' +
      '<linearGradient id="sg-rgw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FB3CF"/><stop offset="1" stop-color="#2E7FA6"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-rg)"/>';
    g += '<circle cx="292" cy="22" r="9" fill="#FFF3C4" opacity=".9"/><circle cx="292" cy="22" r="18" fill="#FFF3C4" opacity=".25"/>' + cloudy(40, 16, 1.2) + cloudy(200, 12, .9) + birdsAt(230, 30, 4);
    // Lagos Island across the lagoon: towers of glass and concrete, the Civic Centre's curve, cranes, the long bridge on its piers
    const T = [[96, 22, 10], [108, 34, 12], [122, 28, 9], [134, 48, 13], [149, 40, 11], [162, 58, 14], [178, 44, 12], [192, 36, 10], [204, 52, 13], [219, 30, 11], [232, 42, 10], [244, 26, 12], [258, 34, 9]];
    T.forEach(([x, hh, w], k) => { const c = ['#9AAAB6', '#B4C2CC', '#A6B8C6', '#8C9EAE'][k % 4];
      g += '<rect x="' + x + '" y="' + (64 - hh) + '" width="' + w + '" height="' + hh + '" fill="' + c + '"/><rect x="' + (x + w * .62) + '" y="' + (64 - hh) + '" width="' + (w * .38) + '" height="' + hh + '" fill="#000" opacity=".08"/>' +
        Array.from({ length: Math.floor(hh / 4) }, (_, j) => '<path d="M' + (x + 1.5) + ' ' + (66 - hh + j * 4) + ' h' + (w - 3) + '" stroke="#E8F2F8" stroke-width=".7" opacity="' + (k % 2 ? .7 : .45) + '"/>').join('') +
        (k === 5 ? '<path d="M' + (x + w / 2) + ' ' + (64 - hh) + ' v-8" stroke="#8C9EAE" stroke-width=".6"/><circle cx="' + (x + w / 2) + '" cy="' + (55 - hh) + '" r=".8" fill="#E53935" class="x-flick"/>' : ''); });
    g += '<path d="M270 64 V34 L300 34" stroke="#E8A317" stroke-width="1.2" fill="none"/><path d="M270 34 L262 40" stroke="#E8A317" stroke-width=".8"/><path d="M296 34 V44" stroke="#5A5A5A" stroke-width=".4"/>';
    g += '<path d="M60 64 Q70 54 84 56 Q92 58 94 64 Z" fill="#AEBCC6"/>';
    g += '<path d="M-4 62 Q100 56 160 60 T324 58" stroke="#7E8A94" stroke-width="2.6" fill="none"/><path d="M-4 64.4 Q100 58.4 160 62.4 T324 60.4" stroke="#9AA6AE" stroke-width="1" fill="none"/>' + Array.from({ length: 18 }, (_, k) => '<path d="M' + (k * 19 + 4) + ' ' + (60 - Math.sin(k / 3) * 1.4) + ' v8" stroke="#7E8A94" stroke-width="1.6"/>').join('');
    g += Array.from({ length: 6 }, (_, k) => '<rect x="' + (20 + k * 50) + '" y="' + (57.6 - (k % 2) * .6) + '" width="5" height="2" rx=".6" fill="' + ['#E8A317', '#FFFDF7', '#C62828'][k % 3] + '" class="x-cl0" style="--d:' + (14 + k * 3) + 's"/>').join('');
    // the lagoon, deep and moving, the light broken on it
    g += '<rect y="66" width="320" height="134" fill="url(#sg-rgw)"/>' + Array.from({ length: 30 }, (_, k) => '<path d="M' + ((k * 67) % 320) + ' ' + (72 + (k * 23) % 124) + ' q4 -1.4 8 0" stroke="#D8F0FA" stroke-width=".7" fill="none" opacity="' + (.3 + (k % 3) * .15) + '" class="x-cl0" style="--d:' + (6 + k % 5) + 's"/>').join('');
    g += '<path d="M276 70 h18 l-3 3 h-12 Z" fill="#F4F1EA"/><rect x="282" y="66" width="6" height="4" fill="#E8A317"/><path d="M278 73 q8 1 14 0" stroke="#fff" stroke-width=".6" opacity=".7"/>';
    // the near shore at the left: the stand under canopies, the crowd in their best, talking drums, the flags
    g += '<path d="M0 64 Q34 60 66 66 L80 112 Q40 118 0 116 Z" fill="#D8B07A"/><path d="M0 116 Q40 118 80 112" stroke="#B8905A" stroke-width="1.4" fill="none"/>';
    g += canopy(-2, 86, 76, '#E8A317', '#FFFDF7', 22) + flags(-2, 70, 76, 72, ['#2E7D32', '#FFFDF7', '#2E7D32'], 3, 10);
    g += band(true, 4, 70, 92, 6, 24, 1, { al: 'wave', ar: 'clap' });
    g += band(true, 6, 76, 112, 5, 30, 4, { al: 'wave', ar: 'wave' });
    g += flag(74, 112, 26, '#2E7D32', '#FFFFFF') + '<path d="M0 116 h4 v6 h-4 Z" fill="#8E5A2E"/>';
    // a fisherman resting his paddle in a dugout on the far side, watching the race
    g += '<g class="x-bob"><path d="M226 98 q16 6 32 0 l-2 3 q-14 4 -28 0 Z" fill="#5A3A1E"/>' + person(242, 99, 18, { kind: 'man', robe: '#E8DFC8', hat: 'fila', hatc: '#2B4C9B', skin: 3, al: 'fwd', ar: 'fwd' }) + '</g>';
    // the finish: buoys and the judges' pontoon with bunting
    g += '<path d="M282 86 H320 V96 H282 Z" fill="#8E6A42"/><path d="M282 86 h38" stroke="#6B4E2E" stroke-width="1"/>' + flags(282, 72, 320, 70, ['#C62828', '#E8A317', '#2E7D32', '#2B4C9B'], 3, 7) + '<path d="M282 72 V86 M320 70 V86" stroke="#6B4E2E" stroke-width="1"/>';
    g += person(300, 86, 20, { kind: 'man', robe: '#F4F1EA', agbada: CLOTH.oke[1], hat: 'gobi', hatc: '#2B4C9B', skin: 2, ar: 'wave' }) + person(312, 86, 18, { kind: 'woman', robe: CLOTH.ank[2], wrap: CLOTH.ank[0], hat: 'gele', hatc: '#E8A317', skin: 4 });
    g += Array.from({ length: 6 }, (_, k) => '<g class="x-bob" style="animation-delay:-' + k * .5 + 's"><circle cx="' + (288 + (k % 2) * 3) + '" cy="' + (104 + k * 17) + '" r="2.6" fill="#E8A317" stroke="#B5651D"/></g>').join('') + '<path d="M288 100 V200" stroke="#FFFDF7" stroke-width=".8" stroke-dasharray="3 3" opacity=".8"/>';
    return svgBack(g);
  }
  const ROWC = [['#C62828', '#FFD54A'], ['#2B4C9B', '#FFFFFF'], ['#2E7D32', '#F2C230'], ['#7A2E5C', '#F4EBD0']];
  const racer = (w, k) => {
    const [c1, c2] = ROWC[k % 4], n = w.length, fs = Math.min(15, 150 / (n * .72)), fit = n > 7 ? ' textLength="104" lengthAdjust="spacingAndGlyphs"' : '';
    let pad = ''; for (let i = 0; i < 4; i++) { const x = 52 + i * 26; pad += person(x, 32, 30, { kind: 'man', robe: c2, hat: 'fila', hatc: c1, skin: i + k, al: 'fwd', ar: 'fwd', cls: 'sgpad' }) + '<path class="sgoar" d="M' + (x - 10) + ' 20 L' + (x - 22) + ' 46" stroke="#6B4226" stroke-width="2.4" stroke-linecap="round"/>'; }
    return '<svg viewBox="0 0 200 60" aria-hidden="true">' + pad + '<path d="M4 30 Q20 48 60 50 L170 50 Q194 46 198 26 Q110 34 4 30 Z" fill="' + c1 + '"/><path d="M4 30 Q110 34 198 26" stroke="' + c2 + '" stroke-width="3" fill="none"/>' +
      '<path d="M10 38 Q100 46 192 34" stroke="' + dk(c1, .35) + '" stroke-width="1.4" fill="none"/><path d="M198 26 l6 -14 l-2 16 Z" fill="' + c2 + '"/>' +
      '<rect x="44" y="34" width="112" height="15" rx="3" fill="#FFFDF7"/><text x="100" y="46.4" text-anchor="middle" font-size="' + fs.toFixed(1) + '" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#1B1B1B"' + fit + '>' + w + '</text></svg>';
  };
  const regatta = {
    cls: 'sgs sg-reg', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg reg">' + regattaBack() + '<div class="sgpic"><img alt=""></div><div class="rlanes"></div></div>');
      pickGame(run, done, { st, gid: 'j-karatu', lanes: '.rlanes', n: 4, piece: racer,
        // the right canoe's crew dig in and race over the finish line; the drums on the shore roll
        right: (b) => { b.classList.add('race'); knocks(run, 8, 140, 120); },
        // a wrong one: the crew lose the stroke and the canoe turns aside, drifting
        wrong: (b) => { b.classList.add('stall'); knock(120, .2, .4); } });
    },
  };

  /* ================= Igbo: the painted lorries of Upper Iweka (Karatu) ================= */
  function iwekaBack() {
    let g = '<defs><linearGradient id="sg-iw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8DEEA"/><stop offset="1" stop-color="#F1E6D2"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-iw)"/>' + cloudy(60, 12, .8) + cloudy(240, 8, .7) + birdsAt(120, 14, 3);
    // the flyover behind with its traffic, the long zinc shed of booking offices, each with its town on a painted board,
    // the UPPER IWEKA sign, the wires, and the whole park busy: traders, loaders, passengers with bags, a keke, a bus
    g += '<path d="M0 30 H320 V36 H0 Z" fill="#8C98A2"/><path d="M0 36 H320" stroke="#6E7A84" stroke-width="1.4"/>' + Array.from({ length: 9 }, (_, k) => '<rect x="' + (12 + k * 38) + '" y="36" width="6" height="28" fill="#9AA6AE"/><rect x="' + (12 + k * 38) + '" y="36" width="2" height="28" fill="#000" opacity=".12"/>').join('');
    [[30, '#C62828'], [96, '#F2C230'], [180, '#2B4C9B'], [250, '#F4F1EA']].forEach(([x, c]) => { g += '<rect x="' + x + '" y="24" width="18" height="6" rx="1.4" fill="' + c + '"/><rect x="' + (x + 2) + '" y="25" width="6" height="2.4" fill="#8FB0C0"/>'; });
    g += town(70, 0, '#C9CCC4', 2);
    g += zinc(-4, 324, 60, 9, 5) + '<path d="M0 69 H320 V98 H0 Z" fill="#E8D8B8"/>' + weather(0, 69, 320, 29, '#3A2A1A', 3);
    const TOWNS = ['LAGOS', 'ABUJA', 'ENUGU', 'OWERRI', 'ASABA', 'KANO', 'PH'];
    for (let k = 0; k < 7; k++) { const x = 4 + k * 46; g += '<rect x="' + x + '" y="72" width="40" height="26" fill="' + ['#2E7D5A', '#C62828', '#2B4C9B', '#E8A317'][k % 4] + '" opacity=".85"/>' + sign(x + 3, 73, 34, 8, TOWNS[k], '#FFFDF7', '#1E1E24', { fs: 5.6 }) + '<rect x="' + (x + 12) + '" y="84" width="16" height="14" fill="#3E2E1A"/><path d="M' + (x + 2) + ' 84 h8 v8 h-8 Z" fill="#2A3640"/>'; }
    g += poles([20, 150, 300], 60, 26);
    g += '<path d="M120 36 V44 M200 36 V44" stroke="#5A5A5A" stroke-width="1"/>' + sign(96, 44, 128, 15, 'UPPER IWEKA PARK', '#1F4E2E', '#FFFDF7', { fs: 9 });
    g += earth(96, '#C9AE84', 4, 1);
    // the crowd between the offices and the lorries
    g += band(0, 70, 250, 104, 9, 26, 1);
    g += person(18, 124, 36, { kind: 'woman', robe: CLOTH.ank[1], wrap: CLOTH.george[0], hat: 'tie', hatc: '#1F6B4A', skin: 1, al: 'load', load: '<ellipse rx="8" ry="2.6" fill="#C62828"/><path d="M-6 -2 Q0 -6 6 -2" fill="#E8A317"/>', cls: 'sgw' });
    g += person(44, 120, 30, { kind: 'man', robe: '#F4F1EA', trou: '#3A3A44', hat: 'hair', skin: 4, al: 'load', load: '<rect x="-7" y="-8" width="14" height="8" fill="#8E6A42"/><path d="M-7 -4 h14" stroke="#5A4026" stroke-width=".6"/>', cls: 'sgw x-idle' });
    g += person(300, 122, 38, { kind: 'man', robe: CLOTH.isiagu[0], trou: '#1E1E24', hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', skin: 3, ar: 'wave', cls: 'sgw' });
    g += keke(278, 120, 1.6) + '<rect x="290" y="132" width="18" height="10" rx="1" fill="#2E6B4A"/><path d="M290 137 h18" stroke="#1E4A30" stroke-width=".6"/>';
    return svgBack(g);
  }
  const LORC = ['#1F6B4A', '#2B4C9B', '#B23A2E', '#7A2E5C'];
  const truck = (w, k) => {
    const c = LORC[k % 4], n = w.length, fs = Math.min(12, 100 / (n * .72)), fit = n > 7 ? ' textLength="62" lengthAdjust="spacingAndGlyphs"' : '';
    // a Bedford-style lorry, front three-quarter: the painted wooden body, the destination board over the cab
    return '<svg viewBox="0 0 90 80" aria-hidden="true"><ellipse cx="45" cy="76" rx="40" ry="3.4" fill="rgba(40,24,10,.3)"/>' +
      '<path d="M6 30 H62 V66 H6 Z" fill="' + c + '"/><path d="M6 30 H62" stroke="#E8B830" stroke-width="2.4"/><path d="M6 44 H62 M6 56 H62" stroke="' + dk(c, .3) + '" stroke-width="1"/>' +
      '<path d="M10 36 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6" stroke="#F2C230" stroke-width="1.2" fill="none"/>' +
      '<path d="M62 36 H78 Q86 38 86 48 V66 H62 Z" fill="#C62828"/><path d="M65 39 H77 Q82 40 83 48 H65 Z" fill="#9FC8DA"/><rect x="78" y="56" width="8" height="5" fill="#E8E2D2"/>' +
      '<rect x="4" y="64" width="84" height="5" fill="#2A2A2A"/><circle cx="20" cy="70" r="7.6" fill="#2A2A2A"/><circle cx="20" cy="70" r="3" fill="#9E9E9E"/><circle cx="72" cy="70" r="7.6" fill="#2A2A2A"/><circle cx="72" cy="70" r="3" fill="#9E9E9E"/>' +
      '<rect x="6" y="6" width="74" height="20" rx="2" fill="#FFFDF7" stroke="' + c + '" stroke-width="2"/><text x="43" y="21.4" text-anchor="middle" font-size="' + fs.toFixed(1) + '" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#1B1B1B"' + fit + '>' + w + '</text></svg>';
  };
  const lorries = {
    cls: 'sgs sg-iwe', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg iwe">' + iwekaBack() + '<div class="sgpic"><img alt=""></div><div class="ilanes"></div></div>');
      pickGame(run, done, { st, gid: 'j-karatu', lanes: '.ilanes', n: 4, piece: truck,
        // the right lorry hoots and pulls out of the park in a cloud of dust
        right: (b) => { horn(); b.classList.add('drive'); },
        // a wrong one: a low hoot, it shudders and stays put
        wrong: (b) => { horn(true); b.classList.add('shudder'); } });
    },
  };


  /* ================= the morning food seller: Ìyá Àkàrà (Yoruba) / the okpa seller (Igbo) (Nemo hoto, speaking) =================
     A customer comes up to the stall and shows what they want (the picture in their bubble). Press Laila and say it in
     English: the seller wraps it and hands it over, the coins drop into her calabash and the customer goes off happy.
     Wrong, or too slow: the customer frowns and walks away with nothing. */
  const SHOPPERS = Y
    ? [{ kind: 'boy', robe: '#F4EBD0', trou: '#2E5E8A', hat: 'hair', skin: 2 }, { kind: 'man', robe: '#3E7CB1', agbada: '#F4EBD0', hat: 'fila', hatc: '#7A2E5C', skin: 3 },
       { kind: 'woman', robe: '#F2C230', wrap: '#5A2E7A', hat: 'gele', hatc: '#5A2E7A', beads: 1, skin: 1 }, { kind: 'woman', robe: '#F4F1EA', wrap: '#2E5E8A', hat: 'braids', tight: 1, skin: 4 },
       { kind: 'man', robe: '#2E7D5A', hat: 'gobi', hatc: '#2E7D5A', skin: 5 }]
    : [{ kind: 'boy', robe: '#F4F1EA', trou: '#7A2E1E', hat: 'hair', skin: 2 }, { kind: 'man', robe: '#B71C1C', hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', skin: 3 },
       { kind: 'woman', robe: '#F4F1EA', wrap: '#1F4E2E', hat: 'tie', hatc: '#E8A317', beads: 1, skin: 1 }, { kind: 'woman', robe: '#2B4C9B', wrap: '#2B4C9B', hat: 'braids', tight: 1, skin: 4 },
       { kind: 'man', robe: '#1E1E24', wrapper: '#E8A317', hat: 'okpu', hatc: '#1E1E24', hatc2: '#B71C1C', skin: 0 }];
  function stallBack() {
    const sky = Y ? ['#F9D9A8', '#FCEBD0'] : ['#E8EEF0', '#F6EAD6'];
    let g = '<defs><linearGradient id="sg-st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient>' +
      '<radialGradient id="sg-fire"><stop offset="0" stop-color="#FFE07A"/><stop offset=".55" stop-color="#F57C00"/><stop offset="1" stop-color="#F57C00" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#sg-st)"/>';
    // the street behind in the early morning: shops opening under rusty zinc, painted signs, louvre windows upstairs,
    // the wires overhead, people already about, and the customers who have eaten on a bench under the awning
    g += '<circle cx="270" cy="30" r="14" fill="#FFE7A3" opacity=".9"/>' + cloudy(80, 14, .9) + birdsAt(200, 20, 3);
    const SIG = Y ? ['IYA BOLA STORES', 'GOD\'S TIME', 'ALHAJA PROVISIONS'] : ['CHIDI & SONS', 'ONYE AYALA', 'NNE OKPA VENDOR'];
    const WALL = Y ? ['#E9D7B4', '#D9C8E4', '#CFE3D4'] : ['#E4DCCB', '#F0D6B8', '#CFDDE6'];
    for (let k = 0; k < 3; k++) { const x = 4 + k * 106;
      g += '<rect x="' + x + '" y="18" width="100" height="72" fill="' + WALL[k] + '"/>' + weather(x, 18, 100, 72, '#3A2A1A', k + 2) + louvre(x + 10, 22, 22, 12) + louvre(x + 68, 22, 22, 12);
      g += zinc(x - 2, x + 102, 36, 6, k + 1) + sign(x + 8, 44, 84, 11, SIG[k], ['#C62828', '#1F3A78', '#2E7D5A'][k], '#FFFDF7', { fs: 6.4 });
      g += '<rect x="' + (x + 36) + '" y="58" width="28" height="32" fill="#4A3424"/>' + (k === 1 ? '<rect x="' + (x + 6) + '" y="62" width="26" height="22" fill="#6B4226"/>' + Array.from({ length: 8 }, (_, j) => '<rect x="' + (x + 8 + (j % 4) * 6) + '" y="' + (64 + Math.floor(j / 4) * 10) + '" width="5" height="8" fill="' + ['#E8A317', '#C62828', '#2B4C9B', '#F4F1EA'][j % 4] + '"/>').join('') : '<path d="M' + (x + 8) + ' 64 h20 v16 h-20 Z" fill="none" stroke="#6E5A3E" stroke-width="1"/>'); }
    g += poles([1, 107, 213, 319], 90, 14);
    g += '<path d="M0 90 H320 V200 H0 Z" fill="#C9A274"/><path d="M0 90 H320" stroke="#9C7A52" stroke-width="2"/><path d="M0 98 H320" stroke="#B48C60" stroke-width="1" opacity=".5"/>' + earth(98, '#C9A274', 3, 0).replace('<path d="M0 98 H320 V200 H0 Z" fill="#C9A274"/>', '');
    g += band(Y, 180, 270, 96, 4, 24, 2);
    g += '<rect x="196" y="102" width="56" height="3" fill="#6B4226"/><path d="M200 105 v12 M248 105 v12" stroke="#4A2C14" stroke-width="1.6"/>' + person(212, 106, 26, dressed(Y, 1, { al: 'fwd', ar: 'down' })) + person(236, 106, 26, dressed(Y, 3, { al: 'fwd', ar: 'hip', flip: 1 }));
    g += chair(270, 118, .9, '#1F4E9A') + goat(176, 120, .8, '#E8E0D2', 1) + hen(258, 126, .9);
    // the queue still waiting, far back
    g += person(300, 118, 30, { ...SHOPPERS[3], cls: 'sgw' }) + person(286, 118, 34, { ...SHOPPERS[1], cls: 'sgw' });
    // the seller on her low stool, and her things
    g += '<g class="sgopp">' + person(30, 162, 78, Y ? { kind: 'woman', robe: '#E8A317', wrap: '#1F3A78', hat: 'gele', hatc: '#C62828', beads: 1, skin: 2, al: 'hold', ar: 'fwd' }
      : { kind: 'woman', robe: '#F4F1EA', wrap: '#B23A2E', wrap2: '#1F4E2E', hat: 'tie', hatc: '#1F4E2E', beads: 1, skin: 2, al: 'hold', ar: 'fwd' }) + '</g>';
    g += '<g transform="translate(-26 0)">';
    if (Y) {
      // the fire of three stones, the big black wok of oil with the akara frying, the basin of bean paste, a tray of akara, a loaf
      g += '<ellipse cx="100" cy="164" rx="22" ry="6" fill="url(#sg-fire)" class="sgflame"/><path d="M84 166 l6 -8 M116 166 l-6 -8 M98 168 l2 -9" stroke="#5A3A1E" stroke-width="3"/>';
      g += '<path d="M76 146 Q100 168 124 146 Z" fill="#1E1E1E"/><ellipse cx="100" cy="146" rx="24" ry="5" fill="#C98A1E"/>' + [0, 1, 2, 3, 4].map((k) => '<circle class="sgfry" style="--k:' + k + '" cx="' + (88 + k * 6) + '" cy="' + (145 + (k % 2)) + '" r="3.2" fill="#B5651D"/>').join('');
      g += '<path d="M90 140 q-4 -8 1 -14 M106 140 q4 -8 -1 -14" stroke="#fff" stroke-width="1.6" opacity=".45" fill="none" class="sgsteam"/>';
      g += '<ellipse cx="146" cy="160" rx="16" ry="5" fill="#C9C2B5"/><path d="M130 160 Q146 172 162 160 Z" fill="#9EA4A8"/><ellipse cx="146" cy="160" rx="13" ry="3.4" fill="#E8DCC0"/>';
      g += '<rect x="132" y="132" width="34" height="5" fill="#8B5A2B"/>' + [0, 1, 2, 3, 4, 5].map((k) => '<circle cx="' + (136 + (k % 3) * 9) + '" cy="' + (128 + (k > 2 ? 0 : -1)) + '" r="3.6" fill="#B5651D"/>').join('') + '<path d="M132 137 V160 M166 137 V160" stroke="#6B4226" stroke-width="2"/>';
    } else {
      // the okpa basin with its leaf-wrapped cakes and the steam, the flask of hot water, a loaf on the stool
      g += '<ellipse cx="104" cy="158" rx="26" ry="7" fill="#5A6E7A"/><path d="M78 158 Q104 178 130 158 Z" fill="#46565F"/><ellipse cx="104" cy="158" rx="22" ry="5" fill="#2E3A40"/>';
      g += [0, 1, 2, 3, 4].map((k) => '<g transform="translate(' + (90 + k * 7) + ' ' + (154 + (k % 2)) + ')"><rect x="-3.4" y="-3" width="7" height="6" rx="1.4" fill="#3F7A3A"/><path d="M-3.4 0 H3.6" stroke="#2A5A26" stroke-width=".8"/></g>').join('');
      g += '<path d="M96 146 q-4 -8 1 -14 M112 146 q4 -8 -1 -14" stroke="#fff" stroke-width="1.6" opacity=".5" fill="none" class="sgsteam"/>';
      g += '<rect x="138" y="138" width="12" height="24" rx="3" fill="#C62828"/><rect x="140" y="134" width="8" height="5" fill="#2A2A2A"/><rect x="154" y="152" width="20" height="9" rx="3" fill="#E7B46E"/><path d="M154 156 H174" stroke="#C62828" stroke-width="1.6"/>';
    }
    g += '</g>';
    // her calabash for the money
    g += '<g transform="translate(52 182)"><path d="M-12 0 Q0 12 12 0 Z" fill="#C68B4E"/><ellipse rx="12" ry="3" fill="#8B5A2B"/></g>';
    return svgBack(g);
  }
  /** what the seller hands over: wrapped in newspaper (akara) or still in its leaf (okpa), else on a little plate */
  const parcel = () => Y ? '<svg viewBox="0 0 40 30" aria-hidden="true"><path d="M4 8 L36 4 L34 26 L6 28 Z" fill="#E8E2D2"/><path d="M8 12 H30 M8 16 H28 M8 20 H31" stroke="#8A8A8A" stroke-width="1"/><circle cx="20" cy="9" r="5" fill="#B5651D"/></svg>'
    : '<svg viewBox="0 0 40 30" aria-hidden="true"><rect x="6" y="6" width="28" height="18" rx="4" fill="#3F7A3A"/><path d="M6 15 H34 M20 6 V24" stroke="#2A5A26" stroke-width="1.4"/><path d="M14 4 q2 -4 0 -6 M24 4 q2 -4 0 -6" stroke="#fff" stroke-width="1" opacity=".6" fill="none"/></svg>';
  const foodStall = {
    cls: 'sgs sg-stall', scene: 'none',
    play(run, done) {
      const MENU = Y ? ['beans', 'pepper', 'onion', 'bread', 'egg', 'tea', 'milk', 'sugar', 'water'] : ['plate', 'bread', 'egg', 'tea', 'milk', 'sugar', 'water', 'pepper', 'spoon'];
      const ORDER = shuffle(MENU).slice(0, 7), WAIT = 15000, among = MENU.map(spoken); let r = 0, got = 0, coins = 0;
      const st = h('<div class="sg stall">' + stallBack() + '<div class="scust"><div class="sbub"><img alt=""><span class="swait"><i></i></span></div><div class="sfig"></div><span class="sgot"></span></div>' +
        '<div class="sserve">' + parcel() + '</div><div class="scoins"></div></div>');
      const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
      run.clock(150, () => done({ right: got, part: got / ORDER.length }));
      run.remind = () => say(line('j-shayi', 'how'), run);
      const cust = st.querySelector('.scust'), img = cust.querySelector('img'), fill = cust.querySelector('.swait i'), fig = cust.querySelector('.sfig'), serve = st.querySelector('.sserve'), purse = st.querySelector('.scoins');
      function next() {
        const w = ORDER[r]; run.item(w); let left = WAIT, over = false;
        fig.innerHTML = '<svg viewBox="0 0 60 140" aria-hidden="true">' + person(30, 134, SHOPPERS[r % SHOPPERS.length].kind === 'boy' || SHOPPERS[r % SHOPPERS.length].tight ? 112 : 140, { ...SHOPPERS[r % SHOPPERS.length], al: 'hold', ar: 'hold' }) + '</svg>';
        cust.className = 'scust'; img.src = K.pic[w]; void cust.offsetWidth; cust.classList.add('come'); serve.className = 'sserve'; fill.style.transform = 'scaleX(1)';
        const end = () => { over = true; cust.classList.remove('waiting'); };
        const miss = () => { end(); knock(160, .14, .4); cust.classList.add('sad'); mood(st, 'sad'); later(run, 1200, () => cust.classList.add('leave')); step(2600); };
        later(run, 900, () => { if (!run.dead) cust.classList.add('waiting'); });
        (function tick() { if (over || run.dead) return;
          if (!run.listening && !box.busy) { left -= 100; fill.style.transform = 'scaleX(' + Math.max(0, left / WAIT).toFixed(3) + ')'; }
          if (left <= 0) { box.busy = true; miss(); return; }
          later(run, 100, tick); })();
        autoRound(run, box, spoken(w), among, () => {
          end(); got++; run.good(cust.querySelector('.sbub')); run.said = say(K.en[w], run); mood(st, 'cheer');
          // wrapped and handed over; the coins drop into the calabash; off they go
          serve.classList.add('fly'); later(run, 900, () => { serve.className = 'sserve'; cust.classList.add('glad'); });
          later(run, 1300, () => { coins++; knock(1400, .05, .25); later(run, 120, () => knock(1250, .05, .2)); purse.innerHTML = Array.from({ length: Math.min(coins, 12) }, (_, k) => '<i style="--k:' + k + '"></i>').join(''); });
          later(run, 1900, () => cust.classList.add('leave')); step(3000);
        }, () => miss());
      }
      function step(ms) { later(run, ms, () => { r++; if (r >= ORDER.length) done({ right: got, finished: true, part: got / ORDER.length }); else next(); }); }
      next();
    },
  };


  /* ---------------- shared: spell a word by saying its letters (or pressing them) (Rubutu, speaking) ---------------- */
  function sayLetters(run, done, o) {
    const W = LW.length ? shuffle(LW) : shuffle(['mango', 'bread', 'horse', 'chair', 'table', 'spoon', 'plate', 'onion', 'water', 'orange'].filter((w) => K.en[w] && K.pic[w])).slice(0, 4);
    let wi = 0, li = 0, words = 0, quiet = 0, stamp = '';
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), key = (L) => '<button type="button" class="sgk" data-l="' + L + '">' + L + '</button>';
    const kb = h('<div class="sgkb"><div class="sgkh">' + ABC.slice(0, 13).map(key).join('') + '</div><div class="sgkh">' + ABC.slice(13).map(key).join('') + '</div></div>');
    const box = micBox(run); run.scr.appendChild(o.st); run.scr.appendChild(kb); run.scr.appendChild(box);
    run.clock(secs(150, W.length, 4), () => done({ right: words, part: words / W.length }));
    run.remind = () => say(K.en[W[wi]], run);
    const pic = o.st.querySelector('.sgpic img'), slots = o.st.querySelector(o.slots);
    function word() {
      const w = letters(W[wi]); li = 0; run.item(W[wi]); pic.src = K.pic[W[wi]]; kb.classList.remove('locked');
      slots.innerHTML = w.split('').map(() => '<span class="sgslot"></span>').join(''); gaps(slots, W[wi]); o.st.style.setProperty('--n', String(w.length));
      if (o.start) o.start(wi); box.cue();
      later(run, 700, () => { run.said = say(K.en[W[wi]], run); if (run.auto) go(); });
    }
    function go() { box.busy = true; Promise.resolve(run.said).then(() => later(run, 450, () => { if (!run.dead && !run.listening) { box.busy = false; box.go(); } })); }
    function nextWord(ms) { later(run, ms, () => { wi++; if (wi >= W.length) done({ right: words, finished: true, part: words / W.length }); else word(); }); }
    function take(got, kbtn) {
      const w = letters(W[wi]);
      for (let k = 0; k < got.length && li < w.length; k++) {
        const L = String(got[k]).toUpperCase();
        if (L === w[li]) { const sl = slots.children[li]; o.letter(sl, L, li); sl.classList.add('on'); if (kbtn) bump(kbtn, 'good', 500); li++; }
        else { run.bad(); if (kbtn) bump(kbtn, 'bad', 700); li = -1; break; }
      }
      if (li < 0) { box.busy = true; kb.classList.add('locked'); mood(o.st, 'sad'); o.spoil(); nextWord(2600); return; }
      if (li >= w.length) { box.busy = true; kb.classList.add('locked'); words++; run.good(slots); mood(o.st, 'cheer'); o.win(words); nextWord(o.winMs || 3600); return; }
      if (run.auto && !kbtn) go(); else box.cue();
    }
    box.listen(() => { const w = letters(W[wi]); run.auto = true; stamp = wi + ':' + li; return { multi: true, word: spoken(W[wi]), target: w[li] }; }, (r) => {
      if (stamp !== wi + ':' + li || box.busy) return;
      const got = r.value || [];
      if (!got.length) { if (run.auto && ++quiet < 2) { box.busy = false; box.go(); return; } quiet = 0; run.auto = false; box.cue(); return; }
      quiet = 0; take(got);
    }, () => letters(W[wi]).slice(li).split(''));
    kb.addEventListener('click', (e) => { const b = e.target.closest('.sgk'); if (b && !run.dead && !box.busy) { run.auto = false; take([b.dataset.l], b); } });
    const onKey = (e) => { if (run.dead) { document.removeEventListener('keydown', onKey); return; }
      const L = (e.key || '').toUpperCase(); if (L.length === 1 && L >= 'A' && L <= 'Z' && !box.busy) { e.preventDefault(); run.auto = false; take([L], kb.querySelector('[data-l="' + L + '"]')); } };
    document.addEventListener('keydown', onKey); run.offs.push(() => document.removeEventListener('keydown', onKey));
    word();
  }

  /* ================= Yoruba: Àdìrẹ, tie and dye at Itoku (Rubutu, speaking) =================
     A white cloth on the dyer's board. Each letter said right is tied into the cloth with raffia (a little knot with its
     letter). The whole word tied: the cloth goes down into the indigo pot, comes up blue, the ties are cut and the white
     pattern shows where they were; it is hung on the line with the others. A wrong letter: a brown stain, the cloth is
     taken away. */
  function adireBack() {
    let g = '<defs><linearGradient id="sg-ad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCEAF2"/><stop offset="1" stop-color="#F3E7CC"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ad)"/>';
    // Ìtọ̀kú market in Abẹ́òkúta: Olúmọ Rock grey behind the zinc roofs, cloth hung everywhere to dry
    g += '<path d="M150 70 Q154 40 170 30 Q182 18 196 26 Q214 22 222 40 Q232 46 234 70 Z" fill="#9AA4A6"/><path d="M168 38 Q178 30 190 34 M200 32 Q212 34 216 46" stroke="#B8C0C2" stroke-width="1.4" fill="none"/><path d="M186 26 l2 -4 l2 4" fill="#5E7A5A"/>';
    g += town(74, true, '#B9C4BE', 2) + zinc(-4, 324, 66, 9, 3);
    for (let row = 0; row < 3; row++) { const y = 82 + row * 22; g += '<path d="M0 ' + y + ' Q160 ' + (y + 6) + ' 320 ' + y + '" stroke="#6B4226" stroke-width=".8" fill="none"/>';
      for (let k = 0; k < 12; k++) { const x = 2 + k * 27 + row * 11; if (row === 2 && x > 90 && x < 230) continue; const c = [CLOTH.adire[0], CLOTH.adire[1], '#163060', '#2B4C9B'][(k + row) % 4];
        g += '<g class="x-flag" style="animation-delay:-' + ((k + row) % 5) * .4 + 's"><path d="M' + x + ' ' + (y + 2) + ' h20 v' + (18 - row * 2) + ' q-10 3 -20 0 Z" fill="' + c + '"/><path d="M' + (x + 14) + ' ' + (y + 2) + ' v' + (18 - row * 2) + '" stroke="#000" stroke-opacity=".15" stroke-width="2"/></g>'; } }
    g += earth(150, '#C9A47A', 4, 0);
    // the indigo pots sunk in the ground, a dyer bent over one, the cloth soaking, the seller of folded cloth with her stack
    [[24, 176], [70, 190], [258, 186], [300, 172]].forEach(([x, y], k) => { g += '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="18" ry="6" fill="#5A3418"/><ellipse cx="' + x + '" cy="' + y + '" rx="16" ry="5" fill="#7A4A26"/><ellipse cx="' + x + '" cy="' + y + '" rx="13" ry="3.6" fill="#0E1E44"/><ellipse cx="' + (x - 4) + '" cy="' + (y - 1) + '" rx="4" ry="1" fill="#3A5DA8" opacity=".6"/>'; });
    g += band(true, 0, 110, 150, 5, 34, 2) + band(true, 220, 320, 150, 4, 34, 5);
    g += person(42, 182, 70, { kind: 'woman', robe: CLOTH.adire[1], wrap: CLOTH.adire[0], hat: 'gele', hatc: '#3A5DA8', skin: 2, al: 'fwd', ar: 'fwd', cls: 'sgw x-idle' });
    g += goat(120, 186, .9, '#E8E0D2') + hen(214, 190, 1, '#8E4A1E', 1) + agama(132, 148, .9);
    g += '<g class="sgopp">' + person(290, 182, 76, { kind: 'woman', robe: CLOTH.ank[4], wrap: CLOTH.adire[0], ipele: CLOTH.adire[1], hat: 'gele', hatc: '#1E3A7A', beads: 1, skin: 3, al: 'hip', ar: 'hold' }) + '</g>';
    g += '<g transform="translate(268 196)">' + [0, 1, 2, 3, 4].map((k) => '<rect x="-13" y="' + (-k * 4) + '" width="26" height="4" rx="1" fill="' + [CLOTH.adire[0], '#2B4C9B', CLOTH.adire[1], '#163060', CLOTH.adire[0]][k] + '"/>').join('') + '</g>';
    return svgBack(g);
  }
  const knot = (L) => '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="#F4F1EA" stroke="#C9B48A" stroke-width="2"/><path d="M8 14 Q20 20 32 14 M8 26 Q20 20 32 26" stroke="#B88A3A" stroke-width="2.4" fill="none"/>' +
    '<text x="20" y="26.4" text-anchor="middle" font-size="17" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#1E3A7A">' + L + '</text></svg>';
  const adire = {
    cls: 'sgs sg-adire', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg adire">' + adireBack() + '<div class="sgpic"><img alt=""></div><div class="adcloth"><div class="adslots"></div><i class="adstain"></i></div><div class="adpot"></div><div class="adline"></div></div>');
      const cloth = st.querySelector('.adcloth'), line2 = st.querySelector('.adline');
      sayLetters(run, done, { st, slots: '.adslots',
        start: () => { cloth.className = 'adcloth'; void cloth.offsetWidth; cloth.classList.add('in'); },
        letter: (sl, L) => { sl.innerHTML = knot(L); knock(520, .06, .3); },
        spoil: () => { cloth.classList.add('stain'); knock(150, .2, .4); later(run, 1300, () => cloth.classList.add('away')); },
        // down into the indigo, up blue, the ties cut: the pattern shows; then it joins the line
        win: (n) => { later(run, 300, () => cloth.classList.add('dip')); later(run, 1400, () => cloth.classList.add('blue'));
          later(run, 2400, () => { cloth.classList.add('away'); line2.insertAdjacentHTML('beforeend', '<i style="--k:' + (n - 1) + '"></i>'); }); },
        winMs: 3400 });
    },
  };

  /* ================= Igbo: Akwete, the upright loom (Rubutu, speaking) =================
     Each letter said right weaves one band across the loom, its letter woven in; the whole word woven and the weaver
     beats it tight, the Akwete diamonds come up in the cloth, she cuts it off and folds it onto her pile. A wrong letter
     tangles the thread and the piece is cut away. */
  function akweteBack() {
    let g = '<defs><linearGradient id="sg-aw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EADCC8"/><stop offset="1" stop-color="#F3E7D2"/></linearGradient>' +
      '<linearGradient id="sg-aws" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4D6" stop-opacity=".45"/><stop offset="1" stop-color="#FFF4D6" stop-opacity="0"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-aw)"/>';
    // the weaving shed at Akwete: mud walls under a deep thatch, sun through the door, the finished cloths hung to show,
    // hanks of dyed cotton drying, other women at their upright looms, baskets of thread, a hen and her chicks
    g += '<path d="M0 26 H320 V132 H0 Z" fill="#C79A6A"/>' + weather(0, 26, 320, 106, '#4A2A10', 5);
    g += '<path d="M0 0 H320 V24 Q160 36 0 24 Z" fill="#B8925A"/>' + Array.from({ length: 44 }, (_, k) => '<path d="M' + (k * 7.4) + ' 0 L' + (k * 7.4 + 3) + ' ' + (28 + (k % 3) * 1.4) + '" stroke="#8E6A3A" stroke-width="1" opacity=".65"/>').join('') + '<path d="M0 24 Q160 36 320 24" stroke="#6E4E26" stroke-width="1.6" fill="none"/>';
    g += '<path d="M0 34 Q160 42 320 34" stroke="#5A3A1E" stroke-width="1" fill="none"/>' + Array.from({ length: 14 }, (_, k) => '<path d="M' + (10 + k * 23) + ' ' + (36 + Math.sin(k / 13 * Math.PI) * 3) + ' q-2 10 0 18 q2 -10 0 -18" fill="' + ['#B23A2E', '#E8A317', '#1F4E2E', '#1E1E24', '#2B4C9B', '#F4F1EA'][k % 6] + '" opacity=".9"/>').join('');
    // finished cloths hung on the side walls
    [[70, 1], [250, 0]].forEach(([x, k]) => { g += '<path d="M' + (x - 14) + ' 58 h28" stroke="#5A3A1E" stroke-width="1.4"/><rect class="x-flag" style="animation-delay:-' + k + 's" x="' + (x - 12) + '" y="58" width="24" height="40" fill="' + CLOTH.akwete + '"/><path d="M' + (x - 12) + ' 98 h24" stroke="#7A1F14" stroke-width="1.6" stroke-dasharray="1.6 1.2"/>'; });
    // the side looms, each with its weaver
    [[30, '#B23A2E', 0], [290, '#1F4E2E', 1]].forEach(([x, c, k]) => { g += '<rect x="' + (x - 22) + '" y="40" width="4" height="92" fill="#6B4226"/><rect x="' + (x + 18) + '" y="40" width="4" height="92" fill="#6B4226"/><rect x="' + (x - 22) + '" y="40" width="44" height="4" fill="#6B4226"/>' +
      Array.from({ length: 10 }, (_, j) => '<path d="M' + (x - 16 + j * 4) + ' 44 V100" stroke="#E8DCC0" stroke-width=".8"/>').join('') + '<rect x="' + (x - 18) + '" y="100" width="36" height="22" fill="' + CLOTH.akwete + '"/><path d="M' + (x - 18) + ' 100 h36" stroke="' + c + '" stroke-width="2"/>'; });
    g += '<rect width="320" height="200" fill="url(#sg-aws)"/>';
    g += '<path d="M0 132 H320 V200 H0 Z" fill="#B48A5A"/><path d="M0 132 H320" stroke="#8E6A3A" stroke-width="2"/>' + Array.from({ length: 20 }, (_, k) => '<ellipse cx="' + ((k * 47) % 320) + '" cy="' + (140 + (k * 13) % 56) + '" rx="1.4" ry=".7" fill="#7A5A36" opacity=".5"/>').join('');
    g += person(30, 172, 58, { kind: 'woman', robe: CLOTH.ank[2], wrap: CLOTH.akwete, hat: 'tie', hatc: '#E8A317', skin: 1, al: 'fwd', ar: 'fwd', cls: 'sgw x-idle' });
    g += '<g transform="translate(70 186)"><path d="M-12 0 q12 -14 24 0 Z" fill="#A0703E"/>' + [[-6, '#B23A2E'], [0, '#E8A317'], [6, '#1F4E2E']].map(([x, c]) => '<circle cx="' + x + '" cy="-6" r="4" fill="' + c + '"/><path d="M' + (x - 3) + ' -6 h6" stroke="#fff" stroke-opacity=".4" stroke-width=".5"/>').join('') + '</g>';
    g += hen(116, 196, 1.1) + '<circle cx="128" cy="195" r="1.6" fill="#F2C230"/><circle cx="134" cy="196" r="1.6" fill="#F2C230"/>';
    g += '<g class="sgopp">' + person(292, 176, 72, { kind: 'woman', robe: CLOTH.lace[1], wrap: CLOTH.akwete, wrap2: '#B23A2E', hat: 'tie', hatc: '#B23A2E', beads: 1, skin: 3, al: 'hold', ar: 'hip' }) + '</g>';
    g += '<g transform="translate(262 188)">' + [0, 1, 2].map((k) => '<rect x="-14" y="' + (-k * 5) + '" width="28" height="5" rx="1" fill="' + (k === 1 ? CLOTH.akwete : ['#B23A2E', '#1F4E2E', '#E8A317'][k]) + '"/>').join('') + '</g>';
    return svgBack(g);
  }
  const BANDS = ['#B23A2E', '#E8A317', '#1F4E2E', '#1E1E24', '#7A2E5C', '#F4F1EA'];
  const akwete = {
    cls: 'sgs sg-akwete', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg akwete">' + akweteBack() + '<div class="sgpic"><img alt=""></div><div class="akloom"><div class="akwarp"></div><div class="akrows"></div></div></div>');
      const loom = st.querySelector('.akloom');
      sayLetters(run, done, { st, slots: '.akrows',
        start: () => { loom.className = 'akloom'; void loom.offsetWidth; loom.classList.add('in'); },
        letter: (sl, L, k) => { sl.style.setProperty('--c', BANDS[k % BANDS.length]); sl.innerHTML = '<b>' + L + '</b>'; knock(240, .08, .4); later(run, 90, () => knock(240, .06, .3)); },
        spoil: () => { loom.classList.add('tangle'); knock(120, .25, .4); later(run, 1300, () => loom.classList.add('away')); },
        win: () => { knocks(run, 4, 260, 160); later(run, 700, () => loom.classList.add('woven')); later(run, 2300, () => loom.classList.add('away')); },
        winMs: 3400 });
    },
  };

  /* ================= Yoruba: Ayò Ọlọ́pọ́n, the ayo board ================= */
  const seed = (Lt) => '<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="22" rx="16" ry="14.5" fill="#5A3A22"/><ellipse cx="20" cy="20" rx="15" ry="14" fill="#C9B48A"/>' +
    '<ellipse cx="15" cy="14" rx="6" ry="3.6" fill="#fff" opacity=".35"/><path d="M8 25 Q20 34 32 25" stroke="#8C7550" stroke-width="1.4" fill="none" opacity=".6"/>' +
    '<text x="20" y="27.4" text-anchor="middle" font-size="19" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#3B2412">' + Lt + '</text></svg>';
  function ayoBack() {
    const sky = '<defs><linearGradient id="sg-ay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7D29A"/><stop offset="1" stop-color="#F3E3C0"/></linearGradient>' +
      '<radialGradient id="sg-ayshade" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3A2A10" stop-opacity=".35"/><stop offset="1" stop-color="#3A2A10" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#sg-ay)"/>';
    // the compound in the evening: red-earth wall under its zinc eaves, a veranda on carved posts, the doorway, a mango tree
    let g = sky + '<path d="M0 46 H320 V124 H0 Z" fill="#B8643C"/>' + weather(0, 46, 320, 78, '#3A1A0A', 5) + zinc(-4, 324, 30, 18, 1);
    g += '<path d="M260 46 Q252 8 286 4 Q320 0 326 30 L326 46 Z" fill="#3F7A3A"/><path d="M268 22 Q286 10 304 18" stroke="#2E5A2A" stroke-width="2" fill="none"/>' + [[274, 30], [292, 22], [306, 34]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="2" ry="2.8" fill="#E8A317"/>').join('');
    [22, 104, 216, 298].forEach((x) => { g += '<rect x="' + (x - 3.5) + '" y="48" width="7" height="76" fill="#7A4A26"/><rect x="' + (x + 1) + '" y="48" width="2.5" height="76" fill="#000" opacity=".15"/>' + [0, 1, 2, 3].map((k) => '<path d="M' + (x - 3.5) + ' ' + (58 + k * 16) + ' q3.5 -5 7 0" stroke="#4A2C14" stroke-width="1" fill="none"/><circle cx="' + x + '" cy="' + (64 + k * 16) + '" r="1.2" fill="#4A2C14"/>').join(''); });
    g += '<rect x="138" y="62" width="44" height="62" rx="2" fill="#3E2614"/><path d="M142 66 h36 v58 h-36 Z" fill="#5A3A1E"/><path d="M142 66 h18 v58 h-18 Z" fill="' + CLOTH.ank[1] + '" opacity=".85"/><path d="M160 66 v58" stroke="#3E2614"/>';
    g += louvre(48, 64, 26, 20, '#5A3A1E') + louvre(246, 64, 26, 20, '#5A3A1E') + agama(78, 100, 1.1) + poles([6, 314], 46, 12);
    g += earth(124, '#D8A86E', 7, 0) + '<ellipse cx="160" cy="170" rx="160" ry="34" fill="url(#sg-ayshade)"/>';
    // the watchers along the wall: elders in agbada and fila, women in gele and ìró, a boy on the bench, a hen and her chicks
    g += '<rect x="8" y="122" width="80" height="4" fill="#6B4226"/><rect x="232" y="122" width="80" height="4" fill="#6B4226"/>';
    g += person(16, 128, 50, { kind: 'woman', robe: CLOTH.ank[0], wrap: CLOTH.oke[2], hat: 'gele', hatc: '#E8A317', skin: 1, al: 'hip', cls: 'sgw x-idle' });
    g += person(40, 128, 54, { kind: 'man', robe: '#F4EBD0', agbada: CLOTH.oke[0], hat: 'fila', hatc: '#7A2E5C', skin: 3, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += person(64, 128, 48, { kind: 'man', robe: CLOTH.ank[5], hat: 'gobi', hatc: '#2B4C9B', skin: 5, al: 'fwd', ar: 'hip', cls: 'sgw', flip: 1 });
    g += person(88, 128, 38, { kind: 'boy', robe: CLOTH.check, hat: 'hair', skin: 2, cls: 'sgw', al: 'up' });
    g += person(256, 128, 48, { kind: 'woman', robe: CLOTH.lace[1], wrap: CLOTH.ank[3], hat: 'gele', hatc: '#7A2E5C', beads: 1, skin: 4, al: 'clap', ar: 'clap', cls: 'sgw', flip: 1 });
    g += person(282, 128, 52, { kind: 'man', robe: CLOTH.ank[2], trou: '#2A2A30', hat: 'fila', hatc: '#C62828', skin: 0, al: 'hip', ar: 'fwd', cls: 'sgw x-idle', flip: 1 });
    g += person(306, 128, 40, { kind: 'woman', robe: CLOTH.ank[4], wrap: CLOTH.adire[0], hat: 'braids', skin: 2, tight: 1, cls: 'sgw', flip: 1 });
    g += hen(24, 190, 1.2, '#B5651D') + hen(34, 194, .6, '#E8C060', 1) + hen(42, 192, .6, '#E8C060');
    // your opponent, seated on a low stool across the board: an elder (a woman for a girl)
    g += '<g class="sgopp">' + person(214, 116, 70, F ? { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.oke[0], ipele: CLOTH.oke[0], hat: 'gele', hatc: '#5A2E7A', beads: 1, skin: 2, al: 'hold', ar: 'hold', tight: 1 }
      : { kind: 'man', robe: '#F4EBD0', agbada: CLOTH.oke[1], hat: 'gobi', hatc: '#1F3A78', beard: 'w', skin: 2, al: 'hold', ar: 'hold' }) + '</g>';
    return svgBack(g);
  }
  const ayo = {
    cls: 'sgs sg-ayo', scene: 'none',
    play(run, done) {
      let caught = 0;
      const st = h('<div class="sg ayo">' + ayoBack() + '<div class="sgpic"><img alt=""></div>' +
        '<div class="ayboard"><span class="ystore l"></span><div class="ypits"></div><span class="ystore r"><span class="yheap"></span></span></div><div class="yseeds"></div></div>');
      const heap = st.querySelector('.yheap');
      spellGame(run, done, { st, slots: '.ypits', pad: '.yseeds', piece: seed, placed: seed,
        land: () => knock(260, .07, .45),
        // the word is yours: the seeds slide out of the pits into your store, clicking, and the store fills up
        win: (w) => { const pits = st.querySelector('.ypits'); pits.classList.add('sweep'); knocks(run, w.length, 330, 90);
          later(run, 900, () => { pits.classList.remove('sweep'); caught += w.length; heap.innerHTML = Array.from({ length: Math.min(caught, 40) }, (_, k) => '<i style="--k:' + k + '"></i>').join(''); }); },
        // a wrong seed jumps out of the board and rolls away
        miss: (b) => { b.classList.add('roll'); knock(180, .12, .5); later(run, 140, () => knock(150, .1, .4)); } });
    },
  };

  /* ================= Igbo: Aka, the coral necklace ================= */
  const bead = (Lt) => '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="21" r="16" fill="#8E1E0E"/><circle cx="20" cy="20" r="15.5" fill="#D9471F"/>' +
    '<ellipse cx="14" cy="13" rx="6" ry="4" fill="#fff" opacity=".4"/><circle cx="20" cy="20" r="15.5" fill="none" stroke="#FF8A5C" stroke-width="1" opacity=".5"/>' +
    '<text x="20" y="27" text-anchor="middle" font-size="18" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#fff">' + Lt + '</text></svg>';
  function akaBack() {
    let g = '<defs><linearGradient id="sg-ak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3DCC8"/><stop offset="1" stop-color="#EBD2B4"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ak)"/>';
    // a bead seller's stall in Onitsha market: the red awning hung with strings of coral, the back wall of the next stalls
    // with their own wares (wrappers on a rail, caps on a stand), shoppers passing, the bead tray on the cloth
    g += '<path d="M0 22 H320 V138 H0 Z" fill="#E8D2B4"/>' + weather(0, 22, 320, 116, '#5A2A10', 6);
    // the rail of george wrappers, the stand of red caps
    g += '<path d="M76 58 H118" stroke="#5A3A1E" stroke-width="1.4"/>' + [0, 1, 2, 3].map((k) => '<rect x="' + (78 + k * 10) + '" y="58" width="9" height="' + (28 + (k % 2) * 6) + '" fill="' + [CLOTH.george[0], CLOTH.george[1], CLOTH.ank[3], CLOTH.george[2]][k] + '"/>').join('');
    g += '<g transform="translate(232 112)"><path d="M0 0 V-40 M-10 -40 h20" stroke="#5A3A1E" stroke-width="1.2"/>' + [[-8, -40], [8, -40], [-8, -28], [8, -28], [0, -16]].map(([x, y]) => '<path d="M' + (x - 5) + ' ' + y + ' q5 -9 10 0 Z" fill="#B71C1C"/><path d="M' + (x - 5) + ' ' + y + ' h10" stroke="#1E1E24" stroke-width="1"/>').join('') + '</g>';
    g += '<rect x="0" y="0" width="320" height="22" fill="#7A2E1E"/>' + Array.from({ length: 16 }, (_, k) => '<path d="M' + (k * 20) + ' 0 v22" stroke="#5A1A10" stroke-width=".8"/>').join('') + '<path d="M0 22 H320" stroke="#4A1A10" stroke-width="2"/>';
    for (let k = 0; k < 16; k++) { const x = 12 + k * 20; g += '<path d="M' + x + ' 22 Q' + (x + 8) + ' ' + (44 + (k % 3) * 6) + ' ' + (x + 16) + ' 22" stroke="' + (k % 4 === 3 ? '#E8A317' : '#C93A18') + '" stroke-width="2.6" fill="none" stroke-dasharray="2.4 1.2" opacity=".85"/>'; }
    g += '<path d="M0 138 H320 V200 H0 Z" fill="#1F4E2E"/><path d="M0 138 H320 V146 H0 Z" fill="#E8A317"/><path d="M0 142 H320" stroke="#B23A2E" stroke-width="2" stroke-dasharray="6 4"/>' + Array.from({ length: 22 }, (_, k) => '<path d="M' + (k * 16) + ' 152 l6 6 l6 -6" stroke="#2E6B3A" stroke-width="1" fill="none"/>').join('');
    // trays of beads on the cloth: coral, gold, a coil of ivory-coloured strings
    g += [[24, '#C93A18'], [56, '#E8A317'], [194, '#F4E7C8']].map(([x, c]) => '<g transform="translate(' + x + ' 184)"><ellipse rx="14" ry="5" fill="#8E5A2E"/><ellipse rx="12" ry="3.6" fill="#5A3418"/>' + Array.from({ length: 10 }, (_, j) => '<circle cx="' + (-9 + j * 2) + '" cy="' + (-1 + (j % 3) * .8) + '" r="1.3" fill="' + c + '"/>').join('') + '</g>').join('');
    g += person(26, 136, 48, { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.george[1], hat: 'tie', hatc: '#1F6B4A', beads: 1, skin: 1, al: 'hip', cls: 'sgw' });
    g += person(52, 136, 40, { kind: 'woman', robe: CLOTH.ank[0], wrap: CLOTH.george[2], hat: 'braids', skin: 4, tight: 1, cls: 'sgw' });
    // the one who will wear it: a titled man in red cap and isiagu (a bride in george and head-tie for a girl)
    g += '<g class="sgopp">' + person(276, 140, 92, F ? { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.george[0], wrap2: '#E8A317', hat: 'tie', hatc: '#E8A317', skin: 2, al: 'hip', ar: 'hip' }
      : { kind: 'man', robe: CLOTH.isiagu[0], wrapper: '#B23A2E', hat: 'okpuf', hatc: '#B71C1C', hatc2: '#1E1E24', skin: 2, al: 'staff', ar: 'hip' }) + '</g>';
    return svgBack(g);
  }
  const aka = {
    cls: 'sgs sg-aka', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg aka">' + akaBack() + '<div class="sgpic"><img alt=""></div><div class="akstring"><div class="akbeads"></div></div><div class="aktray"></div>' +
        '<div class="akneck"></div></div>');
      const neck = st.querySelector('.akneck');
      spellGame(run, done, { st, slots: '.akbeads', pad: '.aktray', piece: bead, placed: bead,
        land: () => knock(900, .05, .25),
        // the clasp closes, the necklace shines, and one more string goes round the wearer's neck
        win: (w, n) => { const s = st.querySelector('.akstring'); s.classList.add('shine'); knock(1300, .2, .3); later(run, 1300, () => s.classList.remove('shine'));
          neck.innerHTML = Array.from({ length: Math.min(n, 6) }, (_, k) => '<i style="--k:' + k + '"></i>').join(''); },
        // a wrong bead slips off the string and bounces away
        miss: (b) => { b.classList.add('drop'); knock(700, .06, .3); later(run, 260, () => knock(620, .05, .22)); later(run, 420, () => knock(560, .04, .15)); } });
    },
  };

  /* ================= Yoruba: Ìlẹ̀kùn Ààfin, the carved palace door ================= */
  const relief = (k) => {
    // what the carver cuts into a panel (Olowe of Ise's figures): drawn with the build's people, then stained as carved wood
    const P = [
      () => person(30, 44, 40, { kind: 'man', robe: '#999', agbada: '#888', hat: 'ade', skin: 0, ar: 'staff' }),
      () => person(22, 44, 38, { kind: 'man', robe: '#999', hat: 'fila', hatc: '#888', skin: 1, al: 'play', ar: 'play' }) + talkingDrum(34, 30, 14, 5),
      () => person(30, 44, 40, { kind: 'woman', robe: '#999', wrap: '#777', hat: 'gele', hatc: '#888', skin: 2, al: 'load', load: '<ellipse rx="7" ry="2.4" fill="#777"/>' }),
      () => '<path d="M8 34 Q30 14 52 34 Q30 40 8 34 Z" fill="#8A8A8A"/><path d="M14 33 L10 41 M46 33 L50 41 M20 35 L18 42 M40 35 L42 42" stroke="#6A6A6A" stroke-width="3"/><circle cx="54" cy="31" r="4" fill="#8A8A8A"/>' +
        '<path d="M16 30 Q30 20 44 30" stroke="#5A5A5A" stroke-width="1.2" fill="none"/><path d="M22 26 l4 6 l4 -6 l4 6 l4 -6" stroke="#5A5A5A" stroke-width="1" fill="none"/>',
      () => '<path d="M10 40 Q18 8 30 22 Q42 36 50 10" stroke="#8A8A8A" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="50" cy="10" r="4.6" fill="#8A8A8A"/><path d="M14 36 Q20 20 28 24" stroke="#5A5A5A" stroke-width="1" fill="none"/>',
      () => '<path d="M16 34 Q14 18 30 14 Q42 12 46 22 L56 20 L48 28 Q44 38 30 38 Z" fill="#8A8A8A"/><path d="M24 38 L22 46 M34 38 L36 46" stroke="#6A6A6A" stroke-width="2.4"/><circle cx="40" cy="20" r="1.6" fill="#4A4A4A"/><path d="M20 24 Q30 20 38 28" stroke="#5A5A5A" stroke-width="1.2" fill="none"/>',
      () => person(30, 44, 40, { kind: 'man', robe: '#999', hat: 'fila', hatc: '#888', skin: 3, al: 'up', ar: 'staff' }),
    ];
    return '<svg class="relief" viewBox="0 0 60 48" aria-hidden="true">' + P[k % P.length]() + '</svg>';
  };
  function doorBack() {
    let g = '<defs><linearGradient id="sg-dr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9D3A8"/><stop offset="1" stop-color="#DCC092"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-dr)"/>';
    // the Àáfin: a long red-earth wall under a deep roof, the veranda of carved posts, the courtyard swept, the chiefs waiting
    g += '<path d="M-4 0 H324 V30 L300 38 H20 L-4 30 Z" fill="#7A2A1E"/><path d="M-4 30 L20 38 H300 L324 30" stroke="#4A1610" stroke-width="2" fill="none"/>' + Array.from({ length: 34 }, (_, k) => '<path d="M' + (k * 10) + ' 0 L' + (k * 10 + 3) + ' 34" stroke="#5E1E14" stroke-width="1" opacity=".5"/>').join('');
    g += '<rect x="0" y="38" width="320" height="126" fill="#C98A5A"/>' + weather(0, 38, 320, 126, '#3A1A0A', 8);
    g += '<g fill="none" stroke="#8E4A2A" stroke-width="1.2" opacity=".6">' + Array.from({ length: 8 }, (_, k) => '<path d="M' + (k * 44 + 6) + ' 150 l8 -8 l8 8 l8 -8 l8 8"/>').join('') + '</g>';
    // the carved posts, figures one above another: the king on horseback, a mother with her child, a drummer
    [[18], [302], [70], [250]].forEach(([x], j) => { g += '<rect x="' + (x - 8) + '" y="38" width="16" height="128" fill="#6E4220"/><rect x="' + (x + 3) + '" y="38" width="5" height="128" fill="#000" opacity=".2"/>' +
      [0, 1, 2].map((k) => '<g transform="translate(' + (x - 8) + ' ' + (44 + k * 40) + ') scale(.27)" style="filter:sepia(1) saturate(1.4) brightness(.55)">' + person(30, 134, 120, { kind: (k + j) % 3 === 1 ? 'woman' : 'man', robe: '#999', wrap: '#777', hat: (k + j) % 3 === 1 ? 'gele' : ((k + j) % 3 === 2 ? 'ade' : 'fila'), hatc: '#888', skin: k, al: (k + j) % 2 ? 'up' : 'hip' }) + '</g>').join(''); });
    g += '<path d="M0 164 H320 V200 H0 Z" fill="#C49A62"/><path d="M0 164 H320" stroke="#8E6A3A" stroke-width="2"/>' + Array.from({ length: 14 }, (_, k) => '<path d="M' + (k * 24 + 4) + ' ' + (176 + (k % 3) * 6) + ' q10 -2 18 1" stroke="#A47A44" stroke-width=".7" fill="none" opacity=".6"/>').join('');
    // the chiefs in their agbada and the palace guards, the ìlàrí with their split-coloured caps
    g += person(96, 164, 52, { kind: 'man', robe: '#F4EBD0', agbada: CLOTH.oke[0], hat: 'gobi', hatc: '#7A1F3D', skin: 2, al: 'hip', ar: 'fwd', cls: 'sgw x-idle' });
    g += person(224, 164, 50, { kind: 'man', robe: '#F4EBD0', agbada: CLOTH.lace[0], hat: 'fila', hatc: '#C62828', skin: 4, al: 'fwd', ar: 'hip', cls: 'sgw', flip: 1 });
    g += person(52, 182, 72, { kind: 'man', robe: '#F4EBD0', agbada: '#C62828', hat: 'gobi', hatc: '#C62828', skin: 1, ar: 'staff', cls: 'sgw' });
    g += hen(130, 192, 1, '#5A3A1E') + agama(248, 120, 1, 1) + '<path d="M186 194 q4 -10 10 -12" stroke="#5A3A1E" stroke-width="1" fill="none"/><path d="M190 196 h24 l-4 -6 h-16 Z" fill="#B88A5A"/>';
    // the carver, his adze over his shoulder, wood shavings at his feet
    g += '<g class="sgopp">' + person(262, 186, 80, F ? { kind: 'woman', robe: CLOTH.ank[4], wrap: CLOTH.oke[2], hat: 'gele', hatc: '#5A2E7A', skin: 3, ar: 'hold', al: 'hip', tight: 1 }
      : { kind: 'man', robe: '#C9B48A', trou: '#6E5A3A', hat: 'fila', hatc: '#7A2E5C', skin: 3, ar: 'hold', al: 'hip' }) + '</g>';
    g += Array.from({ length: 7 }, (_, k) => '<path d="M' + (276 + k * 4) + ' ' + (192 + (k % 2) * 3) + ' q2 -3 4 0" stroke="#D8B07A" stroke-width="1.2" fill="none"/>').join('');
    return svgBack(g);
  }
  const door = {
    cls: 'sgs sg-door', scene: 'none',
    play(run, done) {
      const W = LW.length ? shuffle(LW).sort((a, b) => letters(a).length - letters(b).length) : fallback(6);
      const among = W.map(spoken), rows = Math.ceil(W.length / 2); let r = 0, got = 0, longest = 0;
      const st = h('<div class="sg door">' + doorBack() + '<div class="dframe" style="--rows:' + rows + '"><div class="dleaf l"></div><div class="dleaf r"></div><div class="dinside"><img alt=""></div></div></div>');
      const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
      const leaves = [st.querySelector('.dleaf.l'), st.querySelector('.dleaf.r')];
      const panels = W.map((w, k) => { const p = h('<div class="dpanel"><b></b></div>'); leaves[k % 2].appendChild(p); return p; });
      if (W.length % 2) leaves[1].appendChild(h('<div class="dpanel carved">' + relief(6) + '</div>'));
      st.querySelector('.dinside img').src = K.pic[W[W.length - 1]];
      run.clock(secs(150, W.length, 7), () => done({ right: got, part: got / W.length, longest }));
      run.remind = () => say(line('j-allo', 'how'), run);
      function next() {
        const w = W[r], p = panels[r]; run.item(w); p.querySelector('b').textContent = txt(w).toUpperCase(); p.classList.add('now');
        autoRound(run, box, spoken(w), among, () => {
          got++; longest = Math.max(longest, letters(w).length); run.good(p); run.said = say(K.en[w], run); mood(st, 'cheer');
          // the adze: five taps, chips fly, the word sinks into the wood and the carving rises
          p.classList.add('cut'); knocks(run, 5, 520, 130);
          later(run, 700, () => { p.classList.remove('now', 'cut'); p.classList.add('carved'); p.insertAdjacentHTML('beforeend', relief(r)); });
          later(run, 2300, step);
        }, () => { p.classList.add('rough'); mood(st, 'sad'); later(run, 1000, () => p.classList.remove('now')); later(run, 2400, step); });
      }
      function step() {
        r++;
        if (r >= W.length) {
          // every panel done: the door swings open on the palace courtyard
          if (got === W.length) { st.classList.add('open'); knocks(run, 3, 160, 240); }
          later(run, got === W.length ? 2200 : 300, () => done({ right: got, finished: got === W.length, part: got / W.length, longest }));
        } else next();
      }
      next();
    },
  };

  /* ================= Igbo: Uli, the painted wall ================= */
  const ULI = [   // uli motifs, black lines on cream plaster: spiral, ududu (the python), the comb, the moon, the star, the kola lobes, the tortoise shell
    'M30 24 m-14 0 a14 14 0 1 1 28 0 a10 10 0 1 1 -20 0 a6 6 0 1 1 12 0 a3 3 0 1 1 -6 0',
    'M4 30 Q14 10 24 24 T44 24 T56 14 M52 12 l6 2 l-4 5',
    'M10 12 H50 M14 12 V36 M22 12 V36 M30 12 V36 M38 12 V36 M46 12 V36',
    'M38 8 A18 18 0 1 0 38 40 A13 13 0 1 1 38 8 Z',
    'M30 6 V42 M12 24 H48 M17 11 L43 37 M43 11 L17 37',
    'M30 24 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M30 12 V36 M18 24 H42',
    'M14 24 L22 10 H38 L46 24 L38 38 H22 Z M22 10 L38 38 M38 10 L22 38',
  ];
  function uliBack() {
    let g = '<rect width="320" height="200" fill="#C8784A"/>' + weather(0, 22, 320, 138, '#4A1E0A', 9) + weather(0, 22, 320, 138, '#FFF0D8', 3);
    // the obi: the wall of red earth smoothed by hand (the strokes still show), the thatch eave, the elders' stools
    for (let k = 0; k < 40; k++) g += '<path d="M' + ((k * 37) % 320) + ' ' + (26 + (k * 23) % 100) + ' q6 -3 12 0" stroke="#A85A34" stroke-width="1.6" fill="none" opacity=".45"/>';
    g += '<rect x="0" y="0" width="320" height="22" fill="#6E5A3A"/>';
    for (let x = 0; x < 320; x += 5) g += '<path d="M' + x + ' 0 L' + (x + 4) + ' ' + (22 + (x % 3)) + '" stroke="#4E3E26" stroke-width="1" opacity=".5"/>';
    // the uli frieze already painted along the foot of the wall, faint with age, and a band of white chalk above it
    g += '<path d="M0 124 H320" stroke="#F4EBD8" stroke-width="2.4" opacity=".7"/><g stroke="#2A160A" stroke-width="1.4" fill="none" opacity=".35">' + Array.from({ length: 12 }, (_, k) => '<path transform="translate(' + (k * 28 - 4) + ' 132) scale(.45)" d="' + ULI[k % ULI.length] + '"/>').join('') + '<path d="M0 130 H320 M0 156 H320"/></g>';
    g += '<path d="M0 22 H320" stroke="#3E2E1A" stroke-width="3"/><path d="M0 160 H320 V200 H0 Z" fill="#A85A34"/><path d="M0 160 H320" stroke="#7A3A1E" stroke-width="2"/>' + Array.from({ length: 18 }, (_, k) => '<ellipse cx="' + ((k * 53) % 320) + '" cy="' + (166 + (k * 11) % 30) + '" rx="1.4" ry=".7" fill="#6E3A1E" opacity=".6"/>').join('');
    // a pot of water in the corner, the hoe against the wall, the agama on the eave
    g += '<g transform="translate(110 176)"><ellipse rx="12" ry="9" fill="#8E4A26"/><ellipse cy="-8" rx="6" ry="2" fill="#5A2A10"/><path d="M-10 -2 q10 4 20 0" stroke="#5A2A10" stroke-width="1" fill="none"/></g>';
    g += '<path d="M212 160 L222 112" stroke="#6B4226" stroke-width="2"/><path d="M218 112 q8 -2 10 6 q-6 -2 -10 -6" fill="#7A7A7A"/>' + agama(150, 22, 1.2);
    // the painter, her calabash of uli dye and brush; a girl watching; the elder on his stool by the obi
    g += '<g class="sgopp">' + person(276, 182, 78, { kind: 'woman', robe: CLOTH.ank[4], wrap: CLOTH.george[0], wrap2: '#E8A317', hat: 'tie', hatc: '#B23A2E', beads: 1, skin: 2, ar: 'up', al: 'hold' }) + '</g>';
    g += '<g transform="translate(250 178)"><ellipse rx="10" ry="4" fill="#5A3A1E"/><path d="M-10 0 Q0 10 10 0 Z" fill="#7A4A22"/><ellipse rx="8" ry="2.6" fill="#1E140C"/></g>';
    g += person(36, 182, 52, { kind: 'woman', robe: CLOTH.ank[0], wrap: '#B23A2E', hat: 'braids', skin: 4, tight: 1, cls: 'sgw' });
    g += '<rect x="56" y="176" width="22" height="6" rx="2" fill="#5A3418"/><path d="M60 182 v8 M74 182 v8" stroke="#3A2010" stroke-width="2"/>';
    g += person(66, 180, 62, { kind: 'man', robe: '#F4F1EA', wrapper: CLOTH.george[2], hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', beard: 'w', beads: 1, skin: 1, ar: 'staff', cls: 'sgw' });
    g += hen(176, 196, 1, '#3A3A3A') + hen(190, 194, .9, '#B5651D', 1);
    return svgBack(g);
  }
  const uli = {
    cls: 'sgs sg-uli', scene: 'none',
    play(run, done) {
      const W = LW.length ? shuffle(LW).sort((a, b) => letters(a).length - letters(b).length) : fallback(6);
      const among = W.map(spoken); let r = 0, got = 0, longest = 0;
      const st = h('<div class="sg uli">' + uliBack() + '<div class="uwall" style="--n:' + W.length + '"></div></div>');
      const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
      const wall = st.querySelector('.uwall'), tiles = W.map(() => { const t = h('<div class="utile"><b></b></div>'); wall.appendChild(t); return t; });
      run.clock(secs(150, W.length, 7), () => done({ right: got, part: got / W.length, longest }));
      run.remind = () => say(line('j-allo', 'how'), run);
      function next() {
        const w = W[r], t = tiles[r]; run.item(w); t.querySelector('b').textContent = txt(w).toUpperCase(); t.classList.add('now');
        autoRound(run, box, spoken(w), among, () => {
          got++; longest = Math.max(longest, letters(w).length); run.good(t); run.said = say(K.en[w], run); mood(st, 'cheer');
          // the word fades into the plaster and the painter's brush draws an uli pattern in its place
          t.classList.add('paint');
          t.insertAdjacentHTML('beforeend', '<svg class="umotif" viewBox="0 0 60 48" aria-hidden="true"><path d="' + ULI[r % ULI.length] + '" pathLength="1"/></svg>');
          later(run, 2300, () => { t.classList.remove('now'); step(); });
        }, () => { t.classList.add('smudge'); mood(st, 'sad'); later(run, 1000, () => t.classList.remove('now')); later(run, 2400, step); });
      }
      function step() { r++; if (r >= W.length) { if (got === W.length) st.classList.add('full'); later(run, got === W.length ? 1600 : 300, () => done({ right: got, finished: got === W.length, part: got / W.length, longest })); } else next(); }
      next();
    },
  };


  /* ======================================================================================================
     The number games (Lambobi), the counting game, and the last letter and reading games (6 Nov 2026, round 5).
     Each keeps its Hausa slot's skill and placement, with its own object and its own play.
     ====================================================================================================== */
  const U = (v) => (v * .3125).toFixed(2) + 'cqw';   // a point of the 320 x 200 backdrop, in the stage's own units
  const NUMS = () => shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 4).concat(shuffle([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, 4));
  const fig = (o, hh = 136) => '<svg viewBox="0 0 60 140" aria-hidden="true">' + person(30, 137, hh, o) + '</svg>';
  /** a metal gong (ogene) or a bell: two bright knocks */
  const gong = (run) => { knock(880, .3, .35); later(run, 220, () => knock(660, .3, .35)); };

  /* ================= Yoruba: Kòkó, picking cocoa pods (Lambobi, tap) =================
     A cocoa tree in the shade of the forest at Ondo; the pods grow straight out of the trunk and the branches. Laila
     says a number; the child picks that many pods into the basket, then presses the basket. Right: the farmer carries it
     off to the heap and the tree is full again. Wrong: the basket is tipped out, the pods go back on the tree. */
  const PODS = [[98, 82], [123, 92], [97, 106], [124, 118], [96, 132], [124, 144], [98, 158], [123, 168], [88, 64], [72, 58], [56, 52], [134, 70], [150, 62], [166, 56],
    [86, 118], [70, 112], [138, 126], [154, 120], [170, 128], [84, 96], [68, 90], [142, 100]].map(([x, y]) => [110 + (x - 110) * 1.55, y]);
  function cocoaBack() {
    let g = '<defs><linearGradient id="sg-kk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8EB87C"/><stop offset=".6" stop-color="#C6DAA6"/><stop offset="1" stop-color="#D9E6B8"/></linearGradient>' +
      '<radialGradient id="sg-kkl" cx=".3" cy=".1" r=".7"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".55"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#sg-kk)"/>';
    // the forest behind, layer on layer: the tall shade trees the cocoa needs, plantain, an oil palm, light falling through
    g += '<path d="M0 120 Q20 70 50 80 Q70 50 100 66 Q130 40 160 60 Q190 36 220 58 Q250 44 280 62 Q304 50 320 66 V140 H0 Z" fill="#6E9A5E" opacity=".7"/>';
    [[14, '#3E6B34', 46], [236, '#47753A', 40], [300, '#3A6330', 44], [176, '#4E7E40', 30]].forEach(([x, c, r]) => { g += '<path d="M' + (x - 4) + ' 172 L' + (x - 2) + ' 10 L' + (x + 2) + ' 10 L' + (x + 4) + ' 172 Z" fill="#5A4430"/><path d="M' + (x + 1) + ' 172 L' + (x + 2) + ' 10 L' + (x + 4) + ' 172 Z" fill="#000" opacity=".2"/>' +
      '<g class="x-leaf"><ellipse cx="' + x + '" cy="16" rx="' + r + '" ry="20" fill="' + c + '"/><ellipse cx="' + (x - r * .4) + '" cy="10" rx="' + (r * .5) + '" ry="12" fill="' + lt(c, .12) + '"/><ellipse cx="' + (x + r * .4) + '" cy="24" rx="' + (r * .5) + '" ry="10" fill="' + dk(c, .15) + '"/></g>'; });
    g += '<g transform="translate(274 168)" class="x-leaf">' + [-50, -20, 10, 40].map((a) => '<path d="M0 -60 Q' + (a * .6) + ' -86 ' + a + ' -74" stroke="#4E8A3A" stroke-width="5" fill="none" stroke-linecap="round"/>').join('') + '<path d="M0 0 V-62" stroke="#7A9A4A" stroke-width="4"/><path d="M-4 -40 q4 10 8 0 q-4 6 -8 0" fill="#7A3A5A"/></g>';
    g += '<rect width="320" height="200" fill="url(#sg-kkl)"/>' + Array.from({ length: 5 }, (_, k) => '<path d="M' + (40 + k * 34) + ' 0 L' + (70 + k * 40) + ' 170" stroke="#FFF6C8" stroke-width="' + (6 + k % 3 * 3) + '" opacity=".1"/>').join('');
    g += '<path d="M0 170 H320 V200 H0 Z" fill="#7A5A36"/><path d="M0 170 Q80 164 160 170 T320 170" stroke="#5A4026" stroke-width="2" fill="none"/>';
    for (let k = 0; k < 40; k++) g += '<ellipse cx="' + (6 + k * 8) + '" cy="' + (174 + (k % 4) * 6) + '" rx="5" ry="1.8" fill="' + ['#B07A3A', '#8E5A26', '#C9944A'][k % 3] + '" opacity=".75" transform="rotate(' + ((k * 37) % 50 - 25) + ' ' + (6 + k * 8) + ' ' + (174 + (k % 4) * 6) + ')"/>';
    // the cocoa tree: a short trunk and wide low branches, big leaves at the top, a few pods already on the trunk
    const br = (a, b) => '<path d="M' + a[0] + ' ' + a[1] + ' Q' + ((a[0] + b[0]) / 2) + ' ' + (Math.min(a[1], b[1]) - 6) + ' ' + b[0] + ' ' + b[1] + '" stroke="#6B4A2E" stroke-width="5" fill="none" stroke-linecap="round"/>';
    g += '<path d="M104 172 L106 70 L116 70 L118 172 Z" fill="#6B4A2E"/><path d="M112 172 L113 70 L116 70 L118 172 Z" fill="#000" opacity=".2"/>' + br([108, 76], [22, 48]) + br([114, 74], [208, 50]) + br([106, 122], [36, 108]) + br([116, 126], [206, 116]) + br([106, 98], [44, 86]) + br([116, 100], [168, 94]);
    g += '<path d="M106 90 q-3 8 0 14 q3 -6 0 -14" fill="#7A2E3A"/><path d="M118 140 q3 8 0 14 q-3 -6 0 -14" fill="#C9A227"/>' + '<g fill="#F4F1EA">' + [[108, 130], [114, 110], [109, 150]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r=".9"/>').join('') + '</g>';
    [[30, 38], [60, 30], [96, 26], [130, 24], [166, 30], [200, 40], [80, 44], [146, 42], [114, 18], [182, 22]].forEach(([x, y], k) => { g += '<g class="x-leaf" style="animation-delay:-' + k * .4 + 's"><ellipse cx="' + x + '" cy="' + y + '" rx="24" ry="11" fill="' + (k % 2 ? '#2F5A2A' : '#3C6E32') + '" transform="rotate(' + (k % 2 ? 12 : -10) + ' ' + x + ' ' + y + ')"/><path d="M' + (x - 18) + ' ' + y + ' L' + (x + 18) + ' ' + (y + (k % 2 ? 4 : -4)) + '" stroke="#5E8A4A" stroke-width=".7"/></g>'; });
    // the farm family at the edge of the clearing: the farmer with his long hooked pole, his wife at the heap of pods, the
    // pods being split with a cutlass, the beans fermenting under plantain leaves, a goat nosing the husks
    g += person(156, 172, 40, { kind: 'man', robe: CLOTH.ank[5], hat: 'fila', hatc: '#5A4430', skin: 4, al: 'fwd', ar: 'fwd', cls: 'sgw x-idle', flip: 1 });
    g += '<path d="M170 172 q10 -6 22 0 Z" fill="#E8A317"/><ellipse cx="182" cy="170" rx="3.6" ry="2" fill="#C9A227"/><ellipse cx="176" cy="171" rx="3" ry="1.8" fill="#7A2E3A"/>';
    g += '<g class="sgopp">' + person(276, 184, 74, { kind: 'man', robe: '#C9B48A', trou: '#6E5A3A', hat: 'fila', hatc: '#5A4430', skin: 3, al: 'staff', ar: 'hip' }) + '</g>';
    g += '<path d="M244 184 q14 -16 30 0 Z" fill="#E8A317"/><path d="M250 178 q8 -8 18 0" stroke="#B26A1A" stroke-width="1.4" fill="none"/>' + [[248, 182, '#C9A227'], [256, 179, '#7A2E3A'], [264, 182, '#E8A317']].map(([x, y, c]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="4" ry="2.4" fill="' + c + '"/>').join('');
    g += person(306, 190, 62, { kind: 'woman', robe: CLOTH.ank[0], wrap: CLOTH.adire[0], hat: 'gele', hatc: '#E8A317', skin: 1, al: 'hip', ar: 'fwd', cls: 'sgw', flip: 1 });
    g += '<path d="M12 196 q22 -12 44 0 Z" fill="#4E8A3A"/><path d="M20 192 q14 -6 28 0" stroke="#2E5A2A" stroke-width=".8" fill="none"/>' + goat(66, 194, .9, '#5A4A3A') + birdsAt(150, 50, 3, '#2A3A24');
    return svgBack(g);
  }
  const pod = (k) => '<svg viewBox="0 0 20 30" aria-hidden="true"><path d="M10 1 Q19 6 18 17 Q16 28 10 29 Q4 28 2 17 Q1 6 10 1 Z" fill="' + ['#E8A317', '#D9861E', '#C9B02A', '#E39A1E'][k % 4] + '" stroke="#8E5A14" stroke-width="1"/>' +
    '<path d="M10 2 V28 M6 4 Q4 16 6 27 M14 4 Q16 16 14 27" stroke="#8E5A14" stroke-width=".7" fill="none" opacity=".6"/><path d="M10 1 V-2" stroke="#5A4430" stroke-width="1.6"/></svg>';
  const cocoa = {
    cls: 'sgs sg-cocoa', scene: 'none',
    play(run, done) {
      const N = NUMS(); let r = 0, got = 0, reached = 0, picked = 0, busy = true;
      const st = h('<div class="sg cocoa">' + cocoaBack() + '<div class="kkpods">' + PODS.map(([x, y], k) => '<button type="button" class="kkpod" aria-label="pod" style="left:' + U(x - 7) + ';top:' + U(y - 4) + '">' + pod(k) + '</button>').join('') +
        '</div><button type="button" class="kkbask" aria-label="basket"><span class="kkin"></span></button></div>');
      run.scr.appendChild(st);
      const pods = [...st.querySelectorAll('.kkpod')], bask = st.querySelector('.kkbask'), inb = bask.querySelector('.kkin');
      run.clock(150, () => done({ right: got, part: got / 8, reached }));
      const sayN = () => say(K.en['n' + N[r]], run); run.remind = sayN;
      function next() {
        picked = 0; inb.innerHTML = ''; bask.className = 'kkbask';
        pods.forEach((p) => { p.className = 'kkpod back'; p.style.removeProperty('--tx'); p.style.removeProperty('--ty'); });
        later(run, 500, () => pods.forEach((p) => p.classList.remove('back')));
        later(run, 700, () => { busy = false; sayN(); });
      }
      pods.forEach((p, k) => p.onclick = () => {
        if (busy || run.dead || p.classList.contains('picked')) return;
        run.idle = 0; const pr = io.rect(p), br = io.rect(bask);
        p.style.setProperty('--tx', (br.left + br.width / 2 - (pr.left + pr.width / 2)) + 'px'); p.style.setProperty('--ty', (br.top + br.height * .3 - (pr.top + pr.height / 2)) + 'px');
        p.classList.add('picked'); picked++; knock(260 + (picked % 3) * 40, .07, .35);
        later(run, 450, () => inb.insertAdjacentHTML('beforeend', '<i style="--c:' + ['#E8A317', '#D9861E', '#C9B02A', '#E39A1E'][k % 4] + '"></i>'));
        bump(bask, 'hit', 400);
      });
      bask.onclick = () => {
        if (busy || run.dead || !picked) return; busy = true; const n = N[r];
        if (picked === n) {
          got++; reached = Math.max(reached, n); run.good(bask); mood(st, 'cheer'); say(K.en['n' + n], run);
          later(run, 600, () => bask.classList.add('carry')); step(2600);
        } else {
          run.bad(); mood(st, 'sad'); bask.classList.add('tip'); knocks(run, 3, 150, 90); step(2200);
        }
      };
      function step(ms) { later(run, ms, () => { r++; if (r >= N.length) done({ right: got, finished: true, part: got / 8, reached }); else next(); }); }
      next();
    },
  };

  /* ================= Igbo: Mmanụ Nkwụ, the palm-oil depot (Lambobi, tap) =================
     Twenty yellow kegs stand on two benches in fives, by the oil drum under the palms. Laila says a number; the child
     touches the keg that makes that many, and the trader fills every keg up to it with red oil. Right: the buyer's men
     carry them off. Wrong: the oil is poured back and the keg that was meant shines. */
  function oilBack() {
    let g = '<defs><linearGradient id="sg-mn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DDA8"/><stop offset="1" stop-color="#F1E6C8"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-mn)"/>' + cloudy(140, 16, .8) + birdsAt(200, 22, 3);
    // the oil palms of the compound: a far line of palms, then three big ones, ringed trunks, red bunches under the crown
    const palm = (x, y, s, c = '#3E6B2A') => { let p = '<path d="M' + x + ' 200 Q' + (x + 6 * s) + ' ' + (y + 60) + ' ' + x + ' ' + y + '" stroke="#6B5236" stroke-width="' + 7 * s + '" fill="none"/>' + Array.from({ length: 12 }, (_, k) => '<path d="M' + (x - 3 * s) + ' ' + (y + 10 + k * 13 * s) + ' h' + (6 * s) + '" stroke="#4E3A22" stroke-width="' + s + '" opacity=".6"/>').join('');
      p += '<g class="x-leaf">'; for (let k = 0; k < 9; k++) { const a = -170 + k * 20, dx = Math.cos(a * Math.PI / 180) * 46 * s, dy = Math.sin(a * Math.PI / 180) * 22 * s;
        p += '<path d="M' + x + ' ' + y + ' Q' + (x + dx * .5) + ' ' + (y + dy - 14 * s) + ' ' + (x + dx) + ' ' + (y + dy + 14 * s) + '" stroke="' + c + '" stroke-width="' + 3 * s + '" fill="none"/>'; }
      return p + '</g><circle cx="' + (x - 4 * s) + '" cy="' + (y + 6 * s) + '" r="' + 5 * s + '" fill="#B2361E"/><circle cx="' + (x + 5 * s) + '" cy="' + (y + 7 * s) + '" r="' + 4.4 * s + '" fill="#C9481E"/>'; };
    g += '<path d="M0 120 Q80 104 160 112 T320 108 V142 H0 Z" fill="#9AB37A" opacity=".6"/>' + [70, 120, 190, 220].map((x, k) => palm(x, 70 + k % 2 * 8, .4, '#6E9A5A')).join('');
    g += palm(26, 40, 1) + palm(300, 30, 1.1) + palm(250, 56, .7);
    g += '<path d="M0 142 H320 V200 H0 Z" fill="#B45A30"/><path d="M0 142 H320" stroke="#8E4222" stroke-width="2"/>' + Array.from({ length: 22 }, (_, k) => '<ellipse cx="' + ((k * 43) % 320) + '" cy="' + (150 + (k * 17) % 46) + '" rx="1.6" ry=".8" fill="#7A3A1E" opacity=".6"/>').join('');
    // the drum on the fire boiling the fruit, its smoke, the heap of red fruit, the oil drum with its funnel and the trader
    g += '<g transform="translate(110 168)"><path d="M-14 0 l5 -6 M14 0 l-5 -6 M0 2 v-8" stroke="#3A2A1A" stroke-width="3"/><ellipse cy="-2" rx="16" ry="4" fill="#F57C00" opacity=".55"/><rect x="-12" y="-28" width="24" height="24" fill="#3A3A3A"/><ellipse cy="-28" rx="12" ry="3" fill="#7A1E10"/></g>' + smoke(110, 136, 1.2);
    g += '<path d="M140 176 q16 -16 34 0 Z" fill="#B2361E"/>' + Array.from({ length: 14 }, (_, k) => '<circle cx="' + (144 + (k % 7) * 4) + '" cy="' + (172 - Math.floor(k / 7) * 4) + '" r="2" fill="' + (k % 3 ? '#C9481E' : '#1E1E1E') + '"/>').join('');
    g += '<rect x="24" y="118" width="26" height="36" rx="3" fill="#2E4E7A"/><path d="M24 126 h26 M24 146 h26" stroke="#1E3456" stroke-width="2"/><ellipse cx="37" cy="118" rx="13" ry="3" fill="#7A1E10"/>';
    g += person(58, 172, 64, { kind: 'woman', robe: CLOTH.ank[1], wrap: CLOTH.george[1], hat: 'tie', hatc: '#B23A2E', skin: 2, al: 'fwd', ar: 'hip', cls: 'sgw' });
    // a bicycle loaded with jerrycans leaning on the far palm, a goat
    g += '<g transform="translate(206 168)"><circle cx="-12" cy="0" r="7" fill="none" stroke="#2A2A2A" stroke-width="1.4"/><circle cx="12" cy="0" r="7" fill="none" stroke="#2A2A2A" stroke-width="1.4"/><path d="M-12 0 L-2 -10 H8 L12 0 M-2 -10 L-4 -14 M8 -10 L10 -14 h4" stroke="#1F4E9A" stroke-width="1.4" fill="none"/>' + [-10, -4, 2].map((x) => '<rect x="' + x + '" y="-22" width="6" height="9" rx="1" fill="#F2C230" stroke="#C9971A" stroke-width=".5"/>').join('') + '</g>' + goat(230, 194, .9, '#5A4A3A', 1);
    g += '<g class="sgopp">' + person(282, 176, 72, { kind: 'man', robe: CLOTH.isiagu[1], wrapper: CLOTH.george[0], hat: 'okpu', hatc: '#B23A2E', hatc2: '#1E1E24', skin: 3, al: 'hip', ar: 'hold' }) + '</g>';
    g += person(306, 180, 58, { kind: 'man', robe: '#1F4E2E', hat: 'hair', skin: 1, al: 'down', cls: 'sgw' });
    return svgBack(g);
  }
  const keg = '<svg viewBox="0 0 24 30" aria-hidden="true"><rect x="2" y="5" width="20" height="24" rx="3" fill="#F2C230" stroke="#B88A10" stroke-width="1"/><rect class="oil" x="3.5" y="27" width="17" height="0" fill="#C9361E"/>' +
    '<rect x="14" y="1" width="6" height="5" rx="1" fill="#E0B020" stroke="#B88A10" stroke-width=".8"/><path d="M5 5 Q5 1 11 1 V5" stroke="#B88A10" stroke-width="1.6" fill="none"/><path d="M4 13 h16" stroke="#B88A10" stroke-width=".8" opacity=".6"/></svg>';
  const palmOil = {
    cls: 'sgs sg-oil', scene: 'none',
    play(run, done) {
      const N = NUMS(); let r = 0, got = 0, reached = 0, busy = true;
      const row = (a) => '<div class="mnrow">' + Array.from({ length: 10 }, (_, j) => '<button type="button" class="mnkeg' + (j === 5 ? ' gap' : '') + '" aria-label="keg ' + (a + j + 1) + '" style="--j:' + (a + j) + '">' + keg + '</button>').join('') + '</div>';
      const st = h('<div class="sg oil">' + oilBack() + '<div class="mnbench">' + row(0) + row(10) + '</div></div>');
      run.scr.appendChild(st);
      const kegs = [...st.querySelectorAll('.mnkeg')], bench = st.querySelector('.mnbench');
      run.clock(150, () => done({ right: got, part: got / 8, reached }));
      const sayN = () => say(K.en['n' + N[r]], run); run.remind = sayN;
      function next() { bench.className = 'mnbench'; kegs.forEach((k) => k.className = 'mnkeg' + (k.style.getPropertyValue('--j') === '5' || k.style.getPropertyValue('--j') === '15' ? ' gap' : ''));
        later(run, 500, () => { busy = false; sayN(); }); }
      kegs.forEach((b, k) => b.onclick = () => {
        if (busy || run.dead) return; busy = true; const n = N[r];
        // the trader fills each keg up to the one touched, one after another
        for (let j = 0; j <= k; j++) later(run, j * 70, () => { kegs[j].classList.add('full'); if (j % 2 === 0) knock(300 + j * 12, .05, .2); });
        const t = (k + 1) * 70 + 500;
        if (k + 1 === n) {
          later(run, t, () => { got++; reached = Math.max(reached, n); run.good(b); mood(st, 'cheer'); say(K.en['n' + n], run); });
          later(run, t + 900, () => kegs.slice(0, n).forEach((x) => x.classList.add('sgo'))); step(t + 2600);
        } else {
          later(run, t, () => { run.bad(); mood(st, 'sad'); kegs[n - 1].classList.add('meant'); kegs.forEach((x) => x.classList.remove('full')); }); step(t + 2200);
        }
      });
      function step(ms) { later(run, ms, () => { r++; if (r >= N.length) done({ right: got, finished: true, part: got / 8, reached }); else next(); }); }
      next();
    },
  };

  /* ---------------- shared: prices (tens and hundreds), as in the Hausa animal market's placement ---------------- */
  const PRICES = () => { const T = [20, 30, 40, 50, 60, 70, 80, 90], H = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]; return { T, H, P: shuffle(T).slice(0, 3).concat(shuffle(H).slice(0, 5)) }; };
  const naira = (m) => '₦' + m;

  /* ================= Yoruba: Aṣọ Òkè at Ìsẹ́yìn (Lambobi, tap) =================
     The weaver sits at his narrow loom; the finished aṣọ òkè, folded with its price pinned on, rides past along the line.
     Laila says a price; the child catches the cloth with that price as it goes by. Right: the bride's mother takes it.
     Wrong: it shakes and rides on. Every cloth comes round again. */
  function okeBack() {
    let g = '<defs><linearGradient id="sg-ok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3D9B0"/><stop offset="1" stop-color="#F6EBD2"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ok)"/>';
    // the weavers' compound in Ìsẹ̀yìn: the long thatch of the weaving shed, the wall behind with hanks of dyed thread drying
    g += '<rect x="0" y="22" width="320" height="128" fill="#D8B88A"/>' + weather(0, 22, 320, 128, '#5A3A1E', 2);
    g += '<path d="M0 30 H320" stroke="#6B4226" stroke-width=".8"/>' + Array.from({ length: 16 }, (_, k) => '<path d="M' + (8 + k * 20) + ' 30 q-2 10 0 20 q2 -10 0 -20" fill="' + ['#7A1F3D', '#F2C230', '#2B4C9B', '#1F5B4A', '#E8DFC8', '#C62828'][k % 6] + '" stroke="' + ['#5A1430', '#C9971A', '#1E3A7A', '#123E30', '#B8AE98', '#8E1B1B'][k % 6] + '" stroke-width=".5"/>').join('');
    g += '<path d="M-4 0 H324 V24 Q160 34 -4 24 Z" fill="#8E7A5A"/>' + Array.from({ length: 33 }, (_, k) => '<path d="M' + (k * 10) + ' 0 L' + (k * 10 + 2) + ' 28" stroke="#6E5A3E" stroke-width="1" opacity=".7"/>').join('') + '<path d="M-4 24 Q160 34 324 24" stroke="#5A4A30" stroke-width="1.4" fill="none"/>';
    g += earth(150, '#C9A06A', 5, 0);
    // three narrow-strip looms in a row, weavers at work; the long warps running out across the yard to their drag stones
    [[22, '#7A1F3D', 0], [74, '#2B4C9B', 1], [258, '#1F5B4A', 2]].forEach(([x, c, k]) => {
      g += '<path d="M' + (x - 14) + ' 76 V150 M' + (x + 22) + ' 76 V150 M' + (x - 18) + ' 76 H' + (x + 26) + '" stroke="#5A3A1E" stroke-width="3.2"/><rect x="' + (x - 6) + '" y="102" width="20" height="9" fill="' + CLOTH.oke[k] + '"/>' +
        Array.from({ length: 5 }, (_, j) => '<path d="M' + (x - 2 + j * 3) + ' 111 L' + (x + (k === 2 ? -150 : 150) + j * 2) + ' 166" stroke="#F4EBD0" stroke-width=".6" opacity=".9"/>').join('') + '<rect x="' + (x + (k === 2 ? -158 : 146)) + '" y="160" width="16" height="9" rx="3" fill="#8A8A86"/>';
      g += person(x + 4, 162, 54, { kind: 'man', robe: k === 1 ? CLOTH.ank[5] : '#F4EBD0', trou: '#E8DFC8', hat: 'fila', hatc: c, skin: k + 1, al: 'fwd', ar: 'fwd', cls: 'sgw x-idle', flip: k === 2 }); });
    // the line the finished cloths ride on, and the buyers and sellers of the market day beyond the wall
    g += '<path d="M0 56 Q160 64 320 56" stroke="#5A3A1E" stroke-width="1.6" fill="none"/>' + '<path d="M0 54 Q160 62 320 54" stroke="#E8DFC8" stroke-width=".6" fill="none"/>';
    g += band(true, 110, 230, 150, 5, 36, 7) + hen(140, 190, 1.1, '#E8DFC8') + hen(160, 194, 1, '#5A3A1E', 1) + agama(196, 120, 1);
    g += '<g class="sgopp">' + person(292, 186, 78, { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.oke[0], ipele: CLOTH.oke[0], hat: 'gele', hatc: '#7A2E5C', beads: 1, skin: 3, al: 'hip', ar: 'fwd' }) + '</g>';
    return svgBack(g);
  }
  const OKE = [['#7A1E2E', '#E8A317'], ['#1E3A7A', '#C9D8F0'], ['#E8D7A8', '#7A4A26'], ['#2E6B4A', '#F2C230'], ['#5A2E7A', '#F4EBD0']];
  const oke = (k) => { const [a, b] = OKE[k % OKE.length]; return '<svg viewBox="0 0 40 50" aria-hidden="true"><rect x="2" y="2" width="36" height="46" rx="2" fill="' + a + '"/>' +
    [0, 1, 2, 3, 4].map((j) => '<rect x="' + (4 + j * 7) + '" y="2" width="2.2" height="46" fill="' + b + '" opacity=".85"/>').join('') + '<path d="M2 18 H38 M2 34 H38" stroke="rgba(0,0,0,.25)" stroke-width="1"/></svg>'; };
  const asoOke = {
    cls: 'sgs sg-oke', scene: 'none',
    play(run, done) {
      const { T, H, P } = PRICES(); let r = 0, got = 0, hundreds = 0, busy = true, v = 0;
      const st = h('<div class="sg oke">' + okeBack() + '<div class="okline"></div></div>'); run.scr.appendChild(st);
      const line2 = st.querySelector('.okline');
      run.clock(150, () => done({ right: got, part: got / 8, hundreds }));
      const sayP = () => say(K.en['n' + P[r]], run); run.remind = sayP;
      function next() {
        const p = P[r], opts = shuffle([p].concat(shuffle((p >= 100 ? H : T).filter((x) => x !== p)).slice(0, 3)));
        line2.className = 'okline'; line2.innerHTML = '';
        opts.forEach((m, k) => {
          const b = h('<button type="button" class="okc" aria-label="' + m + '" style="--k:' + k + '"><span class="okin">' + oke(v++) + '<b class="oktag">' + naira(m) + '</b></span></button>');
          line2.appendChild(b);
          b.onclick = () => { if (busy || run.dead) return; busy = true;
            if (m === p) { got++; if (p >= 100) hundreds++; run.good(b); mood(st, 'cheer'); say(K.en['n' + p], run); line2.classList.add('stop'); b.classList.add('sgsold'); knocks(run, 2, 1300, 120); step(2600); }
            else { run.bad(); mood(st, 'sad'); bump(b, 'no', 900); later(run, 900, () => { busy = false; step(0); }); }
          };
        });
        later(run, 400, () => { busy = false; sayP(); });
      }
      function step(ms) { busy = true; later(run, ms, () => { r++; if (r >= P.length) done({ right: got, finished: true, part: got / 8, hundreds }); else next(); }); }
      next();
    },
  };

  /* ================= Igbo: Akpụkpọ Ụkwụ Aba, the shoemakers of Ariaria (Lambobi, tap) =================
     Six boxes of new shoes on the shop shelf, each with its price. Laila says a price; the child touches that box. Right:
     the lid lifts and the pair hops into the customer's bag while the shoemaker's hammer taps. Wrong: the box rattles. */
  function abaBack() {
    let g = '<rect width="320" height="200" fill="#EDE0C8"/>' + weather(0, 22, 320, 128, '#5A3A1E', 4) + '<rect x="0" y="0" width="320" height="22" fill="#2E4E7A"/>';
    // a shoe shop off Ariaria market: the ceiling fan, shelves to the ceiling full of shoes, boxes stacked, a calendar,
    // the open door to the lane with people passing; the shoemaker at his bench, a customer trying a pair on
    g += '<path d="M160 0 v8" stroke="#3A3A3A" stroke-width="1"/><g class="x-fan" style="transform-origin:50% 50%"><path d="M160 8 l-22 2 l0 -3 Z M160 8 l22 2 l0 -3 Z" fill="#5A5A5A"/></g><circle cx="160" cy="8" r="2.6" fill="#3A3A3A"/>';
    for (let s = 0; s < 4; s++) { const y = 34 + s * 28; g += '<rect x="0" y="' + y + '" width="320" height="3" fill="#7A4A26"/><path d="M0 ' + (y + 3) + ' h320" stroke="#000" stroke-opacity=".12" stroke-width="1.4"/>';
      for (let k = 0; k < 16; k++) { const x = 6 + k * 20, c = ['#5A3018', '#1E1E24', '#8E2A1E', '#C9A06A', '#2B4C9B'][(k + s) % 5]; g += '<path d="M' + x + ' ' + y + ' q0 -8 6 -8 l8 4 q2 4 0 4 Z" fill="' + c + '"/><path d="M' + (x + 4) + ' ' + (y - 6) + ' l3 1" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>'; } }
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#9A7A56"/><path d="M0 150 H320" stroke="#7A5A36" stroke-width="2"/>' + Array.from({ length: 10 }, (_, k) => '<path d="M' + (k * 34) + ' 150 l-14 50" stroke="#8A6A46" stroke-width=".6"/>').join('');
    // boxes by the door, the calendar
    g += [0, 1, 2, 3].map((k) => '<rect x="' + (236 + (k % 2) * 4) + '" y="' + (138 - k * 8) + '" width="24" height="8" fill="' + ['#C9A06A', '#E8DCC0', '#B23A2E', '#C9A06A'][k] + '" stroke="#7A5A36" stroke-width=".5"/>').join('');
    // the shoemaker at his bench with the last and the hammer, the sign
    g += '<rect x="10" y="150" width="54" height="8" fill="#6B4226"/><rect x="14" y="158" width="4" height="20" fill="#6B4226"/><rect x="56" y="158" width="4" height="20" fill="#6B4226"/>' + '<path d="M24 150 l4 -6 h8 l2 6" fill="#5A3018"/><path d="M48 150 v-4 h6 v4" fill="#3A3A3A"/>';
    g += sign(6, 112, 70, 18, 'MADE IN ABA', '#2E4E7A', '#F2C230', { fs: 10 });
    g += '<g class="sgw x-idle">' + person(36, 182, 58, { kind: 'man', robe: CLOTH.ank[5], trou: '#2A2A30', hat: 'okpuf', hatc: '#1E1E24', skin: 4, al: 'fwd', ar: 'up' }) + '</g>';
    g += '<rect x="226" y="170" width="40" height="5" fill="#6B4226"/><path d="M230 175 v14 M262 175 v14" stroke="#4A2C14" stroke-width="2"/>' + person(244, 172, 46, dressed(0, 2, { al: 'hip', ar: 'fwd', cls: 'sgw' })) + '<path d="M250 190 q0 -5 5 -5 l6 3 q1 2 0 2 Z" fill="#8E2A1E"/>';
    g += '<g class="sgopp">' + person(290, 180, 74, { kind: 'man', robe: CLOTH.isiagu[0], wrapper: CLOTH.george[1], hat: 'okpu', hatc: '#B23A2E', hatc2: '#1E1E24', skin: 2, al: 'hip', ar: 'hold' }) + '</g>';
    return svgBack(g);
  }
  const shoes = (c) => '<svg viewBox="0 0 40 20" aria-hidden="true"><path d="M2 16 q0 -10 9 -10 l9 5 q3 2 3 5 Z" fill="' + c + '"/><path d="M17 18 q0 -10 9 -10 l9 5 q3 2 3 5 Z" fill="' + c + '"/><path d="M2 16 h21 M17 18 h21" stroke="#1E120A" stroke-width="1.6"/></svg>';
  const abaShoes = {
    cls: 'sgs sg-aba', scene: 'none',
    play(run, done) {
      const { T, H, P } = PRICES(); let r = 0, got = 0, hundreds = 0, busy = true;
      const st = h('<div class="sg aba">' + abaBack() + '<div class="abshelf"></div><span class="abbag"></span></div>'); run.scr.appendChild(st);
      const shelf = st.querySelector('.abshelf'), bag = st.querySelector('.abbag');
      run.clock(150, () => done({ right: got, part: got / 8, hundreds }));
      const sayP = () => say(K.en['n' + P[r]], run); run.remind = sayP;
      function next() {
        const p = P[r], opts = shuffle([p].concat(shuffle((p >= 100 ? H : T).filter((x) => x !== p)).slice(0, 5)));
        shelf.innerHTML = '';
        opts.forEach((m, k) => {
          const c = ['#5A3018', '#1E1E24', '#8E2A1E', '#C9A06A', '#2E4E7A', '#6B4226'][k];
          const b = h('<button type="button" class="abbox" aria-label="' + m + '" style="--k:' + k + '"><i class="ablid"></i><span class="abshoe">' + shoes(c) + '</span><b class="abtag">' + naira(m) + '</b></button>');
          shelf.appendChild(b);
          b.onclick = () => { if (busy || run.dead) return; busy = true;
            if (m === p) { got++; if (p >= 100) hundreds++; run.good(b); mood(st, 'cheer'); say(K.en['n' + p], run); knocks(run, 3, 700, 140);
              const br = io.rect(b), gr = io.rect(bag); b.style.setProperty('--tx', (gr.left + gr.width / 2 - (br.left + br.width / 2)) + 'px'); b.style.setProperty('--ty', (gr.top - (br.top + br.height / 2)) + 'px');
              b.classList.add('open'); later(run, 500, () => b.classList.add('hop')); step(2700); }
            else { run.bad(); mood(st, 'sad'); bump(b, 'no', 900); knock(140, .2, .4); step(2000); }
          };
        });
        later(run, 400, () => { busy = false; sayP(); });
      }
      function step(ms) { later(run, ms, () => { r++; if (r >= P.length) done({ right: got, finished: true, part: got / 8, hundreds }); else next(); }); }
      next();
    },
  };

  /* ---------------- shared: count what is laid out, say the number (the Hausa herd count's slot) ---------------- */
  function countSay(run, done, o) {
    const WORD = (n) => K.enText['n' + n].toLowerCase(), AMONG = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(WORD);
    const RANGE = [[2, 3], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [9, 10]], SIZES = [];
    RANGE.forEach(([a, b]) => { let n; do n = a + Math.floor(Math.random() * (b - a + 1)); while (n === SIZES[SIZES.length - 1]); SIZES.push(n); });
    let r = 0, got = 0, reached = 0, misses = 0;
    const box = micBox(run); run.scr.appendChild(o.st); run.scr.appendChild(box);
    const fin = (finished) => done({ right: got, finished, part: got / SIZES.length, reached, misses });
    run.clock(150, () => fin(false));
    run.remind = () => say(line('j-garke', 'how'), run);
    function next() {
      const n = SIZES[r]; box.busy = true;
      o.fill(n, () => {
        if (run.dead) return; box.busy = false;
        autoRound(run, box, WORD(n), AMONG, () => {
          got++; reached = Math.max(reached, n); run.good(o.st); mood(o.st, 'cheer');
          run.said = say(K.en['n' + n], run); o.right(n); later(run, 3400, step);
        }, () => { misses++; mood(o.st, 'sad'); o.wrong(n); later(run, 2400, () => misses >= 2 ? fin(false) : step()); });
      });
    }
    function step() { r++; if (r >= SIZES.length) fin(true); else next(); }
    next();
  }

  /* ================= Yoruba: Owámbẹ̀, the party (Lambobi, speaking) =================
     Under the party canopy the guests arrive in their aṣọ ẹbí, each table in one colour, and take their seats. The child
     counts them and says how many. Right: the drummers play, the guests get up and dance and the notes are sprayed.
     Wrong: they shake their heads and go to another table. */
  function partyBack() {
    let g = '<defs><linearGradient id="sg-pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E8C8"/><stop offset="1" stop-color="#EEDCB6"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-pt)"/>';
    // a Saturday owámbẹ̀ on a closed street: the hired canopies, the aṣọ ẹbí everywhere, the band on its stage, a DJ, the
    // spraying of money, an MC, the cooler of drinks and the chafing dishes
    g += '<rect x="0" y="0" width="320" height="70" fill="#E3D2AE"/>' + louvre(14, 14, 28, 22) + louvre(98, 14, 28, 22) + louvre(196, 14, 28, 22) + louvre(278, 14, 28, 22) + weather(0, 0, 320, 70, '#5A3A1E', 9);
    g += canopy(0, 70, 320, '#F4F1EA', '#2B4C9B', 50) + flags(0, 62, 320, 62, ['#2B4C9B', '#E8A317', '#FFFDF7', '#C62828'], 7, 46);
    g += '<path d="M0 70 H320 V200 H0 Z" fill="#E7D3AE"/><path d="M0 150 H320 V200 H0 Z" fill="#CFB68A"/>';
    g += band(true, 0, 230, 104, 10, 30, 3, { al: 'clap', ar: 'wave' });
    // the band on its stage at the back: the talking drum, the gangan, the bandleader singing praise
    g += '<rect x="232" y="100" width="88" height="8" fill="#5A3A1E"/><rect x="232" y="94" width="88" height="6" fill="#2B4C9B"/>';
    g += '<g class="sgw">' + person(246, 100, 40, { kind: 'man', robe: '#F4EBD0', agbada: CLOTH.oke[0], hat: 'fila', hatc: '#7A2E5C', skin: 3, al: 'play', ar: 'play' }) + '</g>' + talkingDrum(244, 88, 16, 5);
    g += '<g class="sgw">' + person(272, 100, 44, { kind: 'man', robe: CLOTH.lace[0], agbada: CLOTH.oke[1], hat: 'gobi', hatc: '#2B4C9B', skin: 1, al: 'up', ar: 'hip', hl: '<rect x="-1.4" y="-10" width="2.8" height="9" rx="1.2" fill="#1E1E24"/><circle cx="0" cy="-11" r="2.4" fill="#5A5A60"/>' }) + '</g>';
    g += '<g class="sgw">' + person(298, 100, 40, { kind: 'man', robe: CLOTH.ank[1], hat: 'fila', hatc: '#2E6B4A', skin: 2, al: 'play', ar: 'play' }) + '</g>';
    g += '<rect x="304" y="64" width="14" height="30" fill="#1E1E24"/><circle cx="311" cy="74" r="4" fill="#3A3A40"/><circle cx="311" cy="86" r="2.4" fill="#3A3A40"/>';
    // notes sprayed in the air over the dancers
    g += Array.from({ length: 8 }, (_, k) => '<rect class="x-flag" style="animation-delay:-' + k * .3 + 's" x="' + (150 + k * 9) + '" y="' + (78 + (k % 3) * 6) + '" width="5" height="2.6" fill="#7AA86A" stroke="#4E7A3E" stroke-width=".3" transform="rotate(' + (k * 23 % 40 - 20) + ' ' + (152 + k * 9) + ' ' + (79 + (k % 3) * 6) + ')"/>').join('');
    // coolers and chafing dishes along the side
    g += '<rect x="4" y="170" width="22" height="14" rx="2" fill="#C62828"/><rect x="4" y="168" width="22" height="4" rx="1" fill="#FFFDF7"/><rect x="28" y="172" width="22" height="12" rx="2" fill="#2B4C9B"/>';
    return svgBack(g);
  }
  const ASO = [['#7A2E5C', '#E8A317'], ['#1E6B5A', '#F2C230'], ['#2B4C9B', '#E8D7A8'], ['#B23A2E', '#F4EBD0'], ['#5A2E7A', '#E8A317'], ['#E8A317', '#7A1E2E'], ['#2E6B4A', '#F4EBD0']];
  const SEATS = [[22, 22], [33, 22], [44, 22], [56, 22], [67, 22], [78, 22], [8, 4], [19, 4], [81, 4], [92, 4]];
  const owambe = {
    cls: 'sgs sg-party', scene: 'none', noHow: false,
    play(run, done) {
      const st = h('<div class="sg party">' + partyBack() + '<div class="pguests"></div><div class="ptable"><i></i><i></i><i></i></div><div class="pguests front"></div><div class="pnotes"></div></div>');
      const gs = st.querySelector('.pguests'), gf = st.querySelector('.pguests.front'), notes = st.querySelector('.pnotes'); let v = 0;
      countSay(run, done, { st,
        fill: (n, then) => { const [a, b] = ASO[v++ % ASO.length]; gs.className = 'pguests'; gf.className = 'pguests front'; gs.innerHTML = ''; gf.innerHTML = ''; notes.innerHTML = '';
          for (let k = 0; k < n; k++) later(run, k * 380, () => { const [x, y] = SEATS[k], w = (k + v) % 2;
            (y > 15 ? gs : gf).insertAdjacentHTML('beforeend', '<span class="pg" style="left:' + x + 'cqw;bottom:' + y + 'cqw;--d:' + (k % 3) + '">' + fig(w ? { kind: 'woman', robe: a, wrap: a, hat: 'gele', hatc: b, beads: 1, skin: k % 5, al: 'hip' }
              : { kind: 'man', robe: b, agbada: a, hat: 'fila', hatc: a, skin: (k + 2) % 5, al: 'down' }) + '</span>'); knock(420, .04, .15); });
          later(run, n * 380 + 600, then); },
        right: () => { gs.classList.add('dance'); gf.classList.add('dance'); knocks(run, 6, 200, 170); notes.innerHTML = Array.from({ length: 10 }, (_, k) => '<i style="--k:' + k + ';left:' + (10 + k * 8) + 'cqw"></i>').join('');
          later(run, 2800, () => { gs.classList.add('out'); gf.classList.add('out'); }); },
        wrong: () => { gs.classList.add('sgshake'); gf.classList.add('sgshake'); later(run, 1400, () => { gs.classList.add('out'); gf.classList.add('out'); }); },
      });
    },
  };

  /* ================= Igbo: Iri Ji, the New Yam festival (Lambobi, speaking) =================
     In front of the Igwe's obi the new yams are laid on the mat one by one. The child counts them and says how many. Right:
     the ogene rings, the Igwe lifts a yam and the yams are carried to the yam barn. Wrong: the elders shake their heads. */
  function yamBack() {
    let g = '<defs><linearGradient id="sg-ij" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFDCEB"/><stop offset=".5" stop-color="#F6D8A0"/><stop offset="1" stop-color="#F3E8CC"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ij)"/>' + cloudy(100, 10, .8) + birdsAt(70, 18, 3);
    // Iri Ji, the new yam festival at the Igwe's palace: the yam barn with its tied rows, the obi with uli on the wall and
    // the carved door, palm-frond streamers, the crowd in isiagu and george come to see the first yam cut
    g += town(40, 0, '#C9C2A8', 4);
    for (let k = 0; k < 8; k++) { const x = 6 + k * 9; g += '<path d="M' + x + ' 36 V140" stroke="#7A5A36" stroke-width="2.4"/>' + [0, 1, 2, 3, 4, 5, 6].map((j) => '<ellipse cx="' + (x + 3) + '" cy="' + (46 + j * 13) + '" rx="3" ry="6" fill="' + ['#8E6A42', '#7A5A36', '#A07A4A'][(j + k) % 3] + '"/><path d="M' + x + ' ' + (44 + j * 13) + ' h6" stroke="#C9A85A" stroke-width=".7"/>').join(''); }
    g += '<path d="M0 36 H80" stroke="#5A4026" stroke-width="2"/>';
    g += '<path d="M116 42 L210 18 L304 42 Z" fill="#B8925A"/>' + Array.from({ length: 24 }, (_, k) => '<path d="M' + (120 + k * 7.6) + ' ' + (41 - Math.max(0, 22 - Math.abs(120 + k * 7.6 - 210) * .24)) + ' l2 ' + (Math.max(0, 22 - Math.abs(120 + k * 7.6 - 210) * .24) + 2) + '" stroke="#8E6A3A" stroke-width=".8"/>').join('');
    g += '<rect x="128" y="42" width="166" height="80" fill="#C2683C"/>' + weather(128, 42, 166, 80, '#4A1E0A', 2) + [0, 1, 2, 3].map((k) => '<path d="M' + (140 + k * 40) + ' 60 q10 -10 20 0 q-10 10 -20 0" stroke="#3E2414" stroke-width="1.2" fill="none"/><circle cx="' + (150 + k * 40) + '" cy="60" r="1.6" fill="#3E2414"/>').join('') + '<path d="M128 96 H294" stroke="#F4EBD8" stroke-width="2" opacity=".6"/>';
    g += '<rect x="262" y="78" width="20" height="44" fill="#5A3418"/><path d="M265 82 h14 v36 h-14 Z M272 82 v36 M265 94 l14 12 M279 94 l-14 12" fill="none" stroke="#3A1E0A" stroke-width=".8"/>';
    g += flags(128, 44, 294, 44, ['#D8C26A', '#9AB36A', '#E8DCA0'], 8);
    g += '<path d="M0 120 H320 V200 H0 Z" fill="#D2A26A"/><path d="M0 120 H320" stroke="#A9764A" stroke-width="2"/>' + Array.from({ length: 24 }, (_, k) => '<ellipse cx="' + ((k * 47) % 320) + '" cy="' + (126 + (k * 19) % 70) + '" rx="1.4" ry=".7" fill="#8E6A3E" opacity=".55"/>').join('');
    g += band(0, 96, 150, 124, 3, 32, 5) + band(0, 300, 320, 130, 1, 34, 6);
    // the Igwe in red cap with his fan, the elders beside him, the ogene player
    g += '<g class="sgopp">' + person(214, 128, 58, { kind: 'man', robe: CLOTH.isiagu[0], wrapper: '#B23A2E', hat: 'okpuf', hatc: '#B23A2E', hatc2: '#1E1E24', beads: 1, beard: 'w', skin: 2, al: 'staff', ar: 'hold' }) + '</g>';
    g += person(186, 126, 48, { kind: 'man', robe: CLOTH.isiagu[1], wrapper: CLOTH.george[1], hat: 'okpu', hatc: '#B23A2E', hatc2: '#1E1E24', skin: 3, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += person(244, 126, 48, { kind: 'man', robe: '#F4F1EA', wrapper: CLOTH.george[0], hat: 'okpuf', hatc: '#B71C1C', hatc2: '#1E1E24', beard: 'w', skin: 1, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += person(292, 140, 54, { kind: 'man', robe: CLOTH.ank[4], hat: 'okpuf', hatc: '#1E1E24', skin: 4, al: 'play', ar: 'up', cls: 'sgw x-idle' });
    g += '<path d="M298 92 l6 -14 l8 2 l-6 14 Z" fill="#8A8A86"/>';   // the ogene in his hand
    g += '<rect x="40" y="150" width="240" height="34" rx="4" fill="#C9A85A"/>' + Array.from({ length: 24 }, (_, k) => '<path d="M' + (44 + k * 10) + ' 150 V184" stroke="#A88A3E" stroke-width="1"/>').join('') + '<rect x="40" y="150" width="240" height="34" rx="4" fill="none" stroke="#8E6A2E" stroke-width="1.4"/>';   // the raffia mat
    g += '<g transform="translate(296 190)"><ellipse rx="10" ry="3.6" fill="#7A4A22"/><path d="M-10 0 q10 -10 20 0" fill="#8E5A2E"/><ellipse cx="-3" cy="-4" rx="4" ry="2" fill="#F4EBD8"/><ellipse cx="3" cy="-4" rx="3.6" ry="1.8" fill="#E8DCC0"/></g>' + hen(24, 194, 1.1) + goat(60, 196, .9, '#E8E0D2');
    return svgBack(g);
  }
  const yam = '<svg viewBox="0 0 60 24" aria-hidden="true"><path d="M3 12 Q4 3 20 4 Q44 2 57 10 Q58 16 44 19 Q20 23 6 19 Q2 16 3 12 Z" fill="#8E6A42" stroke="#5A3E22" stroke-width="1.2"/>' +
    '<path d="M14 8 l2 2 M28 6 l1 3 M40 8 l2 2 M22 15 l2 2 M36 15 l1 2" stroke="#5A3E22" stroke-width="1" /><ellipse cx="57" cy="11" rx="2" ry="3" fill="#E8D7A8"/></svg>';
  const iriJi = {
    cls: 'sgs sg-yam', scene: 'none', noHow: false,
    play(run, done) {
      const st = h('<div class="sg yam">' + yamBack() + '<div class="ijmat"></div></div>');
      const mat = st.querySelector('.ijmat');
      countSay(run, done, { st,
        fill: (n, then) => { mat.className = 'ijmat'; mat.innerHTML = '';
          for (let k = 0; k < n; k++) later(run, k * 400, () => { mat.insertAdjacentHTML('beforeend', '<span class="ij" style="--k:' + k + '">' + yam + '</span>'); knock(180, .08, .3); });
          later(run, n * 400 + 600, then); },
        right: () => { gong(run); later(run, 600, () => gong(run)); later(run, 1600, () => mat.classList.add('barn')); },
        wrong: () => { knock(120, .25, .4); later(run, 1200, () => mat.classList.add('out')); },
      });
    },
  };

  /* ================= Yoruba: Iná Dé!, lights on in the house (Rubutu, speaking) =================
     A two-storey house at dusk; each letter said right switches on one window, its letter in the light. The whole word
     and the light is back: "Iná dé!", the children cheer and the fan turns. A wrong letter and the light is gone. */
  function duskBack() {
    let g = '<defs><linearGradient id="sg-nd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E336A"/><stop offset=".55" stop-color="#B8668A"/><stop offset="1" stop-color="#F2B07A"/></linearGradient>' +
      '<radialGradient id="sg-ndl"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".8"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#sg-nd)"/>';
    g += Array.from({ length: 14 }, (_, k) => '<circle cx="' + ((k * 71) % 320) + '" cy="' + (6 + (k * 17) % 40) + '" r=".6" fill="#FFFDF7" class="x-flick" style="animation-delay:-' + k * .3 + 's"/>').join('');
    // the street at nightfall: the neighbours' houses, one generator lit, the others dark until NEPA brings the light
    g += town(110, true, '#4E4462', 3);
    [[0, 64, '#5A4A5E', 0], [250, 74, '#4E4258', 1]].forEach(([x, y, c, k]) => { g += '<rect x="' + x + '" y="' + y + '" width="70" height="' + (150 - y) + '" fill="' + c + '"/><path d="M' + (x - 4) + ' ' + y + ' L' + (x + 35) + ' ' + (y - 16) + ' L' + (x + 74) + ' ' + y + ' Z" fill="#3E3448"/>' +
      louvre(x + 10, y + 16, 20, 16, '#2A2030') + louvre(x + 40, y + 16, 20, 16, '#2A2030') + '<rect x="' + (x + 26) + '" y="' + (y + 44) + '" width="16" height="' + (106 - y) + '" fill="#2A2030"/>' +
      (k ? '<rect x="' + (x + 40) + '" y="' + (y + 16) + '" width="20" height="16" fill="#FFE7A3" opacity=".75" class="x-flick"/><circle cx="' + (x + 50) + '" cy="' + (y + 24) + '" r="16" fill="url(#sg-ndl)"/>' : ''); });
    g += poles([78, 160, 242], 150, 36, '#2E2228') + '<rect x="230" y="138" width="16" height="12" rx="2" fill="#C62828"/><path d="M232 138 v-3 h4" stroke="#5A5A5A" stroke-width=".8" fill="none"/>' + smoke(234, 134, .6);
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#6A5A50"/><path d="M0 150 H320" stroke="#4A3A34" stroke-width="2"/>' + Array.from({ length: 18 }, (_, k) => '<ellipse cx="' + (k * 19 + 6) + '" cy="' + (160 + (k * 7) % 34) + '" rx="1.4" ry=".6" fill="#3A2E2A" opacity=".6"/>').join('');
    // everyone outside waiting for the light: children with a football, a mother on a bench, a man fanning himself
    g += person(24, 188, 44, { kind: 'boy', robe: CLOTH.check, hat: 'hair', skin: 2, al: 'up', ar: 'up', cls: 'sgw' }) + person(46, 188, 40, { kind: 'woman', robe: CLOTH.ank[3], wrap: CLOTH.ank[0], hat: 'braids', skin: 1, tight: 1, cls: 'sgw', al: 'hip' });
    g += '<circle cx="64" cy="190" r="4" fill="#FFFDF7" stroke="#1E1E24" stroke-width=".6"/><path d="M62 188 l2 2 l2 -2" stroke="#1E1E24" stroke-width=".5" fill="none"/>';
    g += '<rect x="226" y="176" width="40" height="3" fill="#6B4226"/><path d="M230 179 v10 M262 179 v10" stroke="#6B4226" stroke-width="2"/>';
    g += person(240, 178, 42, { kind: 'man', robe: '#F4EBD0', hat: 'fila', hatc: '#2B4C9B', skin: 4, al: 'fwd', ar: 'hip', cls: 'sgw x-idle', hl: '<path class="x-fan" d="M0 0 L-5 -8 Q0 -11 5 -8 Z" fill="#C9A06A"/>' });
    g += '<g class="sgopp">' + person(290, 190, 68, { kind: 'woman', robe: CLOTH.ank[4], wrap: CLOTH.adire[0], hat: 'gele', hatc: '#E8A317', skin: 3, al: 'hip', ar: 'up' }) + '</g>' + agama(114, 148, .9);
    return svgBack(g);
  }
  const naHouse = {
    cls: 'sgs sg-nepa', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg nepa">' + duskBack() + '<div class="sgpic"><img alt=""></div><div class="nhouse"><i class="nroof"></i><div class="nwin"></div><i class="ndoor"></i><b class="nsay">Iná dé!</b></div></div>');
      const hs = st.querySelector('.nhouse');
      sayLetters(run, done, { st, slots: '.nwin',
        start: () => { hs.className = 'nhouse'; },
        letter: (sl, Lt) => { sl.innerHTML = '<b>' + Lt + '</b>'; knock(900, .03, .2); },
        spoil: () => { hs.classList.add('dark'); knock(90, .4, .4); },
        win: () => { hs.classList.add('lit'); knocks(run, 3, 520, 120); },
        winMs: 3000 });
    },
  };

  /* ================= Igbo: Ọjị, the kola bowl (Rubutu, speaking) =================
     The carved kola bowl lies on the mat before the elders. Each letter said right is a kola lobe laid in the bowl, its
     letter on it. The whole word: the eldest lifts the bowl and the lobes are shared. A wrong letter: the bowl tips. */
  function kolaBack() {
    let g = '<defs><linearGradient id="sg-oj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9D2A6"/><stop offset="1" stop-color="#F3E6CA"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-oj)"/>';
    // inside the obi at dusk: the thatch on its rafters, the red wall with uli and a chalk line, the carved posts, the
    // ikenga on its shelf, the elders on their stools in isiagu and red caps, the young man who will break the kola
    g += '<path d="M0 0 H320 V30 Q160 40 0 30 Z" fill="#9A7A4A"/>' + Array.from({ length: 40 }, (_, k) => '<path d="M' + (k * 8) + ' 0 L' + (k * 8 + 3) + ' ' + (30 + (k % 3)) + '" stroke="#7A5A30" stroke-width=".9" opacity=".7"/>').join('') + '<path d="M0 6 Q160 14 320 6 M0 18 Q160 26 320 18" stroke="#5A3E1E" stroke-width="1.6" fill="none"/>';
    g += '<rect x="0" y="30" width="320" height="94" fill="#C2683C"/>' + weather(0, 30, 320, 94, '#4A1E0A', 7) + [0, 1, 2, 3, 4, 5].map((k) => '<path d="M' + (20 + k * 54) + ' 70 q12 -14 24 0 q-12 14 -24 0 M' + (32 + k * 54) + ' 56 v28" stroke="#3E2414" stroke-width="1.2" fill="none"/>').join('') + '<path d="M0 98 H320" stroke="#F4EBD8" stroke-width="2.4" opacity=".55"/>';
    [8, 312].forEach((x) => { g += '<rect x="' + (x - 5) + '" y="30" width="10" height="94" fill="#5A3418"/><path d="M' + (x - 4) + ' 50 l4 6 l4 -6 M' + (x - 4) + ' 70 l4 6 l4 -6 M' + (x - 4) + ' 90 l4 6 l4 -6" stroke="#3A1E0A" stroke-width=".8" fill="none"/>'; });
    g += '<rect x="96" y="42" width="30" height="3" fill="#5A3418"/><g transform="translate(111 42)"><path d="M-4 0 v-12 h8 v12 Z" fill="#3A2210"/><path d="M-4 -12 q-6 -8 -2 -14 M4 -12 q6 -8 2 -14" stroke="#3A2210" stroke-width="2" fill="none"/><circle cy="-8" r="1" fill="#E8C060"/></g>';
    g += '<path d="M0 124 H320 V200 H0 Z" fill="#D2A26A"/><path d="M0 124 H320" stroke="#A9764A" stroke-width="2"/>' + Array.from({ length: 18 }, (_, k) => '<path d="M' + ((k * 41) % 320) + ' ' + (132 + (k * 23) % 60) + ' q6 -2 12 0" stroke="#B48A5A" stroke-width="1.4" fill="none" opacity=".6"/>').join('');
    // the elders seated along the wall, the eldest with his staff on the right
    [[28, CLOTH.isiagu[0], '#B23A2E', 2], [60, '#1E1E24', '#B23A2E', 3], [220, '#F4F1EA', '#B71C1C', 4], [252, CLOTH.isiagu[1], '#1E1E24', 1]].forEach(([x, c, hc, s], k) => { g += '<rect x="' + (x - 10) + '" y="146" width="20" height="5" rx="2" fill="#5A3418"/><path d="M' + (x - 7) + ' 151 v8 M' + (x + 7) + ' 151 v8" stroke="#3A1E0A" stroke-width="1.6"/>' +
      person(x, 150, 52, { kind: 'man', robe: c, wrapper: CLOTH.george[k % 3], hat: 'okpu', hatc: hc, hatc2: '#1E1E24', beard: 'w', beads: k === 3, skin: s, al: k % 2 ? 'fwd' : 'down', ar: 'down', cls: 'sgw' + (k === 1 ? ' x-idle' : '') }); });
    g += '<g transform="translate(150 184)"><ellipse rx="10" ry="3" fill="#7A4A22"/><path d="M-8 -1 q8 -6 16 0" fill="#C9A85A"/><path d="M-6 -2 l12 -2" stroke="#7A2E1E" stroke-width="1.6"/></g>';   // the dish of alligator pepper
    g += '<g class="sgopp">' + person(292, 160, 66, { kind: 'man', robe: '#F4F1EA', wrapper: '#B23A2E', hat: 'okpuf', hatc: '#B23A2E', hatc2: '#1E1E24', beard: 'w', beads: 1, skin: 2, al: 'staff', ar: 'fwd' }) + '</g>';
    return svgBack(g);
  }
  const kola = {
    cls: 'sgs sg-kola', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg kola">' + kolaBack() + '<div class="sgpic"><img alt=""></div><div class="ojbowl"><div class="ojlobes"></div></div></div>');
      const bowl = st.querySelector('.ojbowl');
      sayLetters(run, done, { st, slots: '.ojlobes',
        start: () => { bowl.className = 'ojbowl'; },
        letter: (sl, Lt, k) => { sl.innerHTML = '<b style="--c:' + (k % 2 ? '#C9837A' : '#E8D7A8') + '">' + Lt + '</b>'; knock(340, .06, .3); },
        spoil: () => { bowl.classList.add('tip'); knock(130, .25, .4); },
        win: () => { later(run, 300, () => bowl.classList.add('lift')); later(run, 1500, () => bowl.classList.add('share')); },
        winMs: 3200 });
    },
  };

  /* ================= Yoruba: the sign writer (Rubutu, letters by voice or keys) =================
     A new shop needs its signboard. Each letter said or pressed is painted on the board with one sweep of the brush. The
     whole word: the board is lifted up over the shop door and the owner claps. A wrong letter: the paint runs. */
  function signBack() {
    let g = '<defs><linearGradient id="sg-sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8D4EE"/><stop offset="1" stop-color="#EAF4F7"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-sw)"/>';
    g += cloudy(60, 20, 1) + cloudy(250, 14, .8) + town(62, true, '#C4CCD0', 4) + poles([4, 110, 210, 316], 62, 24);
    // a busy street of lock-up shops, every one with its painted board: the sign writer's own work all down the road
    const SH = [[0, '#E8A317', 'PROVISIONS', 'Mama Bisi'], [214, '#2E7D5A', 'CHEMIST', 'Patent medicine']];
    SH.forEach(([x, c, t, sub]) => { g += '<rect x="' + x + '" y="58" width="106" height="92" fill="#E7D3AE"/>' + weather(x, 58, 106, 92, '#5A3A1E', x) + zinc(x - 2, x + 108, 52, 7, x % 5 + 1) + sign(x + 6, 62, 94, 18, t, c, '#FFFDF7', { sub }) +
      '<rect x="' + (x + 28) + '" y="92" width="50" height="58" fill="#4A2E1A"/>' + Array.from({ length: 3 }, (_, k) => '<rect x="' + (x + 30) + '" y="' + (96 + k * 16) + '" width="46" height="2" fill="#8E6A42"/>' + Array.from({ length: 6 }, (_, j) => '<rect x="' + (x + 31 + j * 7.4) + '" y="' + (89 + k * 16) + '" width="5" height="7" fill="' + ['#C62828', '#2B4C9B', '#F2C230', '#FFFDF7', '#2E7D5A'][(j + k) % 5] + '"/>').join('')).join(''); });
    g += '<rect x="106" y="66" width="108" height="84" fill="#F0E2C2"/>' + weather(106, 66, 108, 84, '#5A3A1E', 4) + '<rect x="138" y="96" width="44" height="54" fill="#6B4226"/>' + zinc(104, 216, 60, 7, 2);
    g += sign(4, 120, 20, 26, 'GOD', '#C62828', '#FFFDF7', { fs: 5, sub: 'DEY' }) + sign(296, 124, 22, 22, 'NO', '#1E1E24', '#F2C230', { fs: 6, sub: 'PARKING' });
    g += earth(150, '#B9A688', 6, 1);
    // the street going about its day: an okada passing, a woman with a head-load, the sign writer at his trestle, the owner
    g += band(true, 110, 214, 150, 4, 34, 11);
    g += '<g class="sgw">' + person(30, 188, 66, { kind: 'man', robe: CLOTH.ank[2], trou: '#2A2A30', hat: 'fila', hatc: '#B23A2E', skin: 2, al: 'fwd', ar: 'up', hr: '<path d="M0 0 L2 -10" stroke="#5A3A1E" stroke-width="1.2"/><path d="M1.6 -10 l1 -3" stroke="#C62828" stroke-width="1.6"/>' }) + '</g>';
    g += '<g transform="translate(54 184)">' + [['#C62828', 0], ['#2B4C9B', 7], ['#F2C230', 14]].map(([c, x]) => '<rect x="' + x + '" y="0" width="5" height="7" rx="1" fill="' + c + '"/><rect x="' + x + '" y="0" width="5" height="2" fill="#5A5A5A"/>').join('') + '</g>';
    g += '<g class="sgopp">' + person(292, 188, 74, { kind: 'man', robe: '#F4EBD0', agbada: CLOTH.oke[1], hat: 'gobi', hatc: '#2B4C9B', skin: 3, al: 'hip', ar: 'hip' }) + '</g>';
    g += goat(250, 190, .9, '#3A2E2A') + hen(80, 196, 1, '#B5651D');
    return svgBack(g);
  }
  const signWriter = {
    cls: 'sgs sg-sign', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg sign">' + signBack() + '<div class="sgpic"><img alt=""></div><div class="swboard"><div class="swslots"></div></div></div>');
      const board = st.querySelector('.swboard');
      sayLetters(run, done, { st, slots: '.swslots',
        start: () => { board.className = 'swboard'; void board.offsetWidth; board.classList.add('in'); },
        letter: (sl, Lt) => { sl.innerHTML = '<b>' + Lt + '</b>'; knock(700, .04, .15); },
        spoil: () => { board.classList.add('run'); knock(150, .3, .35); later(run, 1400, () => board.classList.add('away')); },
        win: () => { later(run, 400, () => board.classList.add('up')); knocks(run, 2, 520, 200); },
        winMs: 3200 });
    },
  };

  /* ================= Igbo: the Onitsha printer (Rubutu, letters by voice or keys) =================
     Each letter said or pressed is a piece of metal type set into the composing stick. The whole word: the press comes
     down and a printed page slides out onto the pile of market booklets. A wrong letter: the type is spilt. */
  function pressBack() {
    let g = '<rect width="320" height="200" fill="#E8DFCC"/>' + weather(0, 20, 320, 120, '#4A3A2A', 8) + '<rect x="0" y="0" width="320" height="20" fill="#5A3A1E"/>' + Array.from({ length: 16 }, (_, k) => '<path d="M' + (k * 20) + ' 0 v20" stroke="#3A2410" stroke-width="1"/>').join('');
    // a printer's shop off Onitsha's old book market: shelves of the famous little booklets, posters and an almanac on
    // the wall, a fluorescent tube, stacks of paper; the apprentice inking, a customer waiting with her order
    for (let s = 0; s < 2; s++) { const y = 54 + s * 28; g += '<rect x="0" y="' + y + '" width="320" height="3" fill="#7A4A26"/><path d="M0 ' + (y + 3) + ' h320" stroke="#000" stroke-opacity=".14" stroke-width="1.4"/>';
      for (let k = 0; k < 30; k++) g += '<rect x="' + (4 + k * 10.6) + '" y="' + (y - 20 + (k % 4 === 3 ? 3 : 0)) + '" width="8" height="' + (k % 4 === 3 ? 17 : 20) + '" fill="' + ['#B23A2E', '#2E4E7A', '#E8A317', '#2E6B4A', '#F4F1EA'][(k + s * 2) % 5] + '"/><path d="M' + (5.4 + k * 10.6) + ' ' + (y - 14) + ' h5" stroke="#fff" stroke-opacity=".45" stroke-width=".7"/>'; }
    g += '<rect x="110" y="22" width="100" height="3" rx="1.4" fill="#F4FBFF"/><rect x="110" y="22" width="100" height="6" fill="#F4FBFF" opacity=".25"/>';
    g += '<path d="M0 140 H320 V200 H0 Z" fill="#9A8A6A"/><path d="M0 140 H320" stroke="#7A6A4A" stroke-width="2"/>' + Array.from({ length: 12 }, (_, k) => '<path d="M0 ' + (146 + k * 5) + ' h320" stroke="#8A7A5A" stroke-width=".4"/>').join('');
    g += '<rect x="4" y="94" width="96" height="30" rx="2" fill="#5A3A1E"/><rect x="6" y="96" width="92" height="26" fill="none" stroke="#F2C230" stroke-opacity=".5" stroke-width=".5"/><text x="52" y="106" text-anchor="middle" font-size="9" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#F2C230">ONITSHA MAIN</text><text x="52" y="118" text-anchor="middle" font-size="9" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#F2C230">MARKET PRINTERS</text>';
    g += '<g transform="translate(232 98)"><rect x="-18" y="0" width="36" height="26" fill="#F4F1EA" stroke="#B8AE98" stroke-width=".5"/><rect x="-18" y="0" width="36" height="8" fill="#1F4E2E"/><text y="6" text-anchor="middle" font-size="5" font-weight="800" font-family="Arial" fill="#F2C230">ALMANAC</text>' + Array.from({ length: 6 }, (_, k) => '<circle cx="' + (-12 + k * 5) + '" cy="15" r="2" fill="' + ['#B23A2E', '#2E4E7A', '#E8A317'][k % 3] + '"/><path d="M' + (-14 + k * 5) + ' 21 h4" stroke="#7A6A5A" stroke-width=".6"/>').join('') + '</g>';
    g += '<rect x="282" y="96" width="30" height="30" fill="#E8A317"/><text x="297" y="108" text-anchor="middle" font-size="5.4" font-weight="800" font-family="Arial" fill="#1E1E24">WEDDING</text><text x="297" y="116" text-anchor="middle" font-size="5.4" font-weight="800" font-family="Arial" fill="#B23A2E">CARDS</text>';
    g += '<g transform="translate(84 186)">' + [0, 1, 2, 3, 4, 5, 6].map((k) => '<rect x="-14" y="' + (-k * 3.4) + '" width="28" height="3.4" fill="' + (k % 2 ? '#F4F1EA' : '#E8DFCC') + '" stroke="#9A8A6A" stroke-width=".4"/>').join('') + '</g>';
    g += '<g class="sgw x-idle">' + person(30, 186, 64, { kind: 'man', robe: CLOTH.ank[3], trou: '#2A2A30', hat: 'okpuf', hatc: '#1E1E24', skin: 3, al: 'fwd', ar: 'fwd' }) + '</g>';
    g += '<g class="sgopp">' + person(292, 186, 70, { kind: 'woman', robe: CLOTH.lace[1], wrap: CLOTH.george[2], hat: 'tie', hatc: '#1F4E2E', skin: 2, al: 'hold', ar: 'hip' }) + '</g>';
    g += '<g transform="translate(252 186)">' + [0, 1, 2, 3, 4].map((k) => '<rect x="-12" y="' + (-k * 3.4) + '" width="24" height="3.4" fill="' + (k % 2 ? '#F4F1EA' : '#E8DFCC') + '" stroke="#9A8A6A" stroke-width=".4"/>').join('') + '</g>';
    return svgBack(g);
  }
  const printer = {
    cls: 'sgs sg-press', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg press">' + pressBack() + '<div class="sgpic"><img alt=""></div><div class="prplate"></div><div class="prstick"><div class="prslots"></div></div><div class="prpage"><b></b></div></div>');
      const stick = st.querySelector('.prstick'), plate = st.querySelector('.prplate'), page = st.querySelector('.prpage');
      let word = '';
      sayLetters(run, done, { st, slots: '.prslots',
        start: () => { stick.className = 'prstick'; plate.className = 'prplate'; page.className = 'prpage'; word = ''; },
        letter: (sl, Lt) => { sl.innerHTML = '<b>' + Lt + '</b>'; word += Lt; knock(1100, .03, .2); },
        spoil: () => { stick.classList.add('spill'); knocks(run, 4, 900, 60); },
        win: () => { page.querySelector('b').textContent = word; later(run, 300, () => { plate.classList.add('down'); knock(120, .25, .5); });
          later(run, 1000, () => { plate.classList.remove('down'); page.classList.add('out'); }); },
        winMs: 3400 });
    },
  };

  /* ---------------- shared: read the word out loud (the Hausa rain farm's slot) ---------------- */
  function readAloud(run, done, o) {
    const W = LW.length ? shuffle(LW) : shuffle(['mango', 'bread', 'water', 'chair', 'horse', 'spoon', 'plate', 'table', 'onion', 'banana', 'orange', 'flower'].filter((w) => K.en[w])).slice(0, 6);
    const among = W.map(spoken); let r = 0, got = 0;
    const box = micBox(run); run.scr.appendChild(o.st); run.scr.appendChild(box);
    run.clock(secs(150, W.length, 6), () => done({ right: got, part: got / W.length }));
    run.remind = () => say(line('j-ruwa', 'how'), run);
    function next() {
      const w = W[r]; run.item(w); o.show(txt(w).toUpperCase(), r);
      autoRound(run, box, spoken(w), among, () => { got++; run.good(o.st); mood(o.st, 'cheer'); run.said = say(K.en[w], run); o.right(r); later(run, o.ms || 3600, step); },
        () => { mood(o.st, 'sad'); o.wrong(r); later(run, 2600, step); });
    }
    function step() { r++; if (r >= W.length) done({ right: got, finished: true, part: got / W.length }); else next(); }
    next();
  }

  /* ================= Yoruba: Ìwé Ìròyìn, the newspaper stand (Karatu, speaking) =================
     The vendor holds up today's paper; its headline is the word. Read it out loud: the men at the stand nod, buy it and the
     next paper comes up. Wrong: the wind takes the paper. */
  function newsBack() {
    let g = '<defs><linearGradient id="sg-ir" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8DCEE"/><stop offset="1" stop-color="#F1EDE0"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ir)"/>';
    g += cloudy(40, 14, 1) + cloudy(220, 22, .8) + birdsAt(260, 10, 3);
    // a Lagos junction in the morning: a bank, an office block, a bus stop, a danfo, the "free readers" round the stand
    g += '<rect x="0" y="26" width="320" height="124" fill="#D9CBB0"/>' + weather(0, 26, 320, 124, '#5A3A1E', 12);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) g += '<rect x="' + (8 + k * 46) + '" y="' + (34 + r * 30) + '" width="30" height="22" fill="#A9C8D8" stroke="#8E7A5E"/><path d="M' + (8 + k * 46) + ' ' + (45 + r * 30) + ' h30 M' + (23 + k * 46) + ' ' + (34 + r * 30) + ' v22" stroke="#8E7A5E" stroke-width=".6"/>' + (k % 3 === r ? '<rect x="' + (9 + k * 46) + '" y="' + (35 + r * 30) + '" width="14" height="10" fill="#E8F2F8" opacity=".6"/>' : '');
    g += '<rect x="0" y="120" width="320" height="30" fill="#C8B898"/>' + sign(10, 122, 70, 12, 'FIRST BANK', '#1E3A7A', '#F2C230', { fs: 6.4 }) + sign(246, 122, 66, 12, 'BUKKA', '#C62828', '#FFFDF7', { fs: 6.4 });
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#8C8C88"/><path d="M0 150 H320" stroke="#6E6E6A" stroke-width="2"/><path d="M0 178 H320" stroke="#F2C230" stroke-width="2" stroke-dasharray="12 10"/><rect x="0" y="150" width="320" height="6" fill="#B8B4AA"/>';
    g += '<g transform="translate(176 148) scale(.9)"><rect x="0" y="-26" width="58" height="22" rx="3" fill="#F2C230"/><path d="M0 -12 H58" stroke="#1E1E24" stroke-width="2.4"/><rect x="4" y="-23" width="12" height="8" fill="#5A7A8A"/><rect x="20" y="-23" width="12" height="8" fill="#5A7A8A"/><rect x="36" y="-23" width="12" height="8" fill="#5A7A8A"/><circle cx="12" cy="-3" r="4" fill="#1E1E24"/><circle cx="46" cy="-3" r="4" fill="#1E1E24"/><text x="29" y="-6" text-anchor="middle" font-size="3.6" font-weight="800" fill="#1E1E24" font-family="Arial,sans-serif">OSHODI-OBALENDE</text></g>';
    // the stand: the papers laid out in rows under a big umbrella
    g += '<path d="M60 120 L130 104 L200 120 Z" fill="#B23A2E"/><path d="M60 120 L130 104 L95 120 Z" fill="#FFFDF7" opacity=".85"/><path d="M130 104 L165 120 H200 Z" fill="#FFFDF7" opacity=".85"/><path d="M130 104 V150" stroke="#5A3A1E" stroke-width="1.6"/>';
    g += '<rect x="64" y="134" width="132" height="16" fill="#7A5A36"/>' + Array.from({ length: 10 }, (_, k) => '<rect x="' + (66 + k * 13) + '" y="126" width="12" height="9" fill="#F4F1EA" stroke="#9A9A96" stroke-width=".4"/><path d="M' + (67 + k * 13) + ' 128 h10" stroke="' + ['#1E1E24', '#C62828', '#1E3A7A'][k % 3] + '" stroke-width="1.2"/><rect x="' + (67 + k * 13) + '" y="130" width="4" height="3" fill="#9AA6AE"/>').join('');
    // the free readers in their fila, arguing over the headlines, and the vendor
    g += '<g class="sgw">' + person(24, 188, 64, { kind: 'man', robe: CLOTH.lace[0], hat: 'fila', hatc: '#2B4C9B', skin: 2, al: 'fwd', ar: 'hip' }) + '</g>';
    g += '<g class="sgw x-idle">' + person(50, 190, 60, { kind: 'man', robe: CLOTH.ank[1], hat: 'gobi', hatc: '#7A2E5C', skin: 4, al: 'hip', ar: 'up', flip: 1 }) + '</g>';
    g += '<g class="sgw">' + person(270, 188, 62, { kind: 'man', robe: '#E8D7A8', agbada: CLOTH.oke[2], hat: 'fila', hatc: '#7A4A26', skin: 1, al: 'clap', ar: 'clap' }) + '</g>';
    g += '<g class="sgw x-idle">' + person(298, 190, 58, { kind: 'woman', robe: CLOTH.ank[0], wrap: CLOTH.adire[1], hat: 'gele', hatc: '#C62828', skin: 3, al: 'hip', ar: 'fwd', flip: 1 }) + '</g>';
    return svgBack(g);
  }
  const newsStand = {
    cls: 'sgs sg-news', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg news">' + newsBack() + '<div class="nwpaper"><span class="nwhead">ÌRÒYÌN</span><b class="nww"></b><i class="nwcol"></i></div><span class="nwvend">' +
        fig({ kind: 'man', robe: '#F2C230', hat: 'fila', hatc: '#B23A2E', skin: 3, al: 'up', ar: 'up' }) + '</span></div>');
      const paper = st.querySelector('.nwpaper'), ww = st.querySelector('.nww');
      readAloud(run, done, { st,
        show: (t) => { ww.textContent = t; ww.className = 'nww l' + Math.min(12, Math.max(4, t.length)); paper.className = 'nwpaper'; void paper.offsetWidth; paper.classList.add('up'); },
        right: () => { knocks(run, 2, 1300, 120); later(run, 1200, () => paper.classList.add('sgsold')); },
        wrong: () => { knock(200, .3, .2); paper.classList.add('blow'); } });
    },
  };

  /* ================= Igbo: Mgba, the village wrestling (Karatu, speaking) =================
     The crier holds up the board with the word for the next bout. Read it out loud and your wrestler throws his man, the
     ogene rings and the crowd cheers. Wrong: your wrestler slips. */
  function mgbaBack() {
    let g = '<defs><linearGradient id="sg-mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CCBE4"/><stop offset=".5" stop-color="#F4CE8C"/><stop offset="1" stop-color="#F3E3C0"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-mg)"/>' + cloudy(60, 14, 1) + cloudy(250, 8, .8);
    // the village square on wrestling day: the big tree, the compound walls, palm-frond streamers on poles, the crowd
    // packed three deep round the ring, drummers and the ogene, the elders on chairs, boys up on the wall to see
    g += '<path d="M276 96 Q272 60 282 36" stroke="#5A3A22" stroke-width="6" fill="none"/>' + [[282, 26, 26, '#3E6B34'], [300, 40, 18, '#4E7E40'], [260, 40, 18, '#47753A']].map(([x, y, r, c]) => '<g class="x-leaf"><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/></g>').join('');
    g += '<path d="M0 70 H96 V96 H0 Z" fill="#C2683C"/>' + weather(0, 70, 96, 26, '#4A1E0A', 3) + '<path d="M-4 70 H100 L94 64 H2 Z" fill="#8E6A3A"/>';
    g += '<path d="M0 96 H320 V200 H0 Z" fill="#C98A52"/><ellipse cx="160" cy="160" rx="120" ry="30" fill="#E0B07A"/><ellipse cx="160" cy="160" rx="120" ry="30" fill="none" stroke="#A9764A" stroke-width="2" stroke-dasharray="4 4"/>';
    [40, 280].forEach((x) => { g += '<path d="M' + x + ' 96 V40" stroke="#6B4226" stroke-width="1.6"/>' + Array.from({ length: 6 }, (_, j) => '<path class="x-flag" style="animation-delay:-' + j * .3 + 's" d="M' + x + ' ' + (42 + j * 3) + ' q' + (j % 2 ? 6 : -6) + ' 8 ' + (j % 2 ? 2 : -2) + ' 18" stroke="#D8C26A" stroke-width="1.4" fill="none"/>').join(''); });
    g += [[14, 66], [30, 64], [60, 66]].map(([x, y], k) => person(x, y, 20, dressed(0, 5 + k * 8, { kind: 'boy', al: 'up', ar: 'wave' }))).join('');
    // back row, then the front row of the crowd
    g += band(0, 0, 320, 92, 16, 30, 7);
    for (let k = 0; k < 14; k++) { const x = 6 + k * 23, y = 104 + (k % 2) * 6; if (x > 110 && x < 210) continue;
      g += person(x, y, 40 + (k % 3) * 4, dressed(0, k, { al: 'clap', ar: k % 4 ? 'clap' : 'up', flip: x > 160 })); }
    g += '<path d="M130 96 V30 M190 96 V30" stroke="#6B4226" stroke-width="2"/>' + talkingDrum(118, 92, 14, 5);
    g += chair(20, 196, 1.2, '#C62828') + chair(300, 196, 1.2, '#1F4E9A');
    return svgBack(g);
  }
  const wrestler = (robe, s, cls) => '<span class="' + cls + '">' + fig({ kind: 'man', robe, sl: SKT[s], hat: 'hair', skin: s, al: 'fwd', ar: 'fwd', tight: 1 }) + '</span>';
  const mgba = {
    cls: 'sgs sg-mgba', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg mgba">' + mgbaBack() + '<div class="mgboard"><b class="mgw"></b></div><div class="mgring">' + wrestler('#B23A2E', 2, 'mgus') + '<span class="mgthem"></span></div></div>');
      const ring = st.querySelector('.mgring'), them = st.querySelector('.mgthem'), ww = st.querySelector('.mgw'), board = st.querySelector('.mgboard');
      readAloud(run, done, { st, ms: 3800,
        show: (t, r) => { ww.textContent = t; ww.className = 'mgw l' + Math.min(12, Math.max(4, t.length)); ring.className = 'mgring'; board.className = 'mgboard'; void board.offsetWidth; board.classList.add('up');
          them.innerHTML = fig({ kind: 'man', robe: ['#1F4E2E', '#2E4E7A', '#E8A317', '#5A2E7A'][r % 4], sl: SKT[(r + 3) % 5], hat: 'hair', skin: (r + 3) % 5, al: 'fwd', ar: 'fwd' }); },
        right: () => { ring.classList.add('throw'); later(run, 700, () => { knock(110, .3, .6); gong(run); }); },
        wrong: () => { ring.classList.add('slip'); knock(110, .3, .5); } });
    },
  };


  /* ======================================================================================================
     Round 6: the last slots that were Hausa games in local dress (letters aloud, naming aloud, market rush,
     money, reading signs, catching the word). Each with its own play.
     ====================================================================================================== */
  const PICW = () => LW.length ? shuffle(LW).filter((w) => K.pic[w]) : shuffle(['goat', 'cat', 'dog', 'fish', 'cup', 'bread', 'egg', 'chair', 'book', 'spoon', 'mango', 'water'].filter((w) => K.pic[w] && K.en[w])).slice(0, 6);
  const card = (w, cls = 'sgcard') => '<span class="' + cls + '"><img alt="" src="' + K.pic[w] + '"></span>';
  /** three others for a word, from the lesson's words first, then any word with a picture */
  const others = (w, W, n = 3) => { const pool = W.filter((x) => x !== w); const more = Object.keys(K.pic).filter((x) => K.en[x] && x !== w && pool.indexOf(x) < 0);
    return shuffle(pool).concat(shuffle(more)).slice(0, n); };

  /* ---------------- shared: say the letter you see (the Durbar's slot) ---------------- */
  function letterSay(run, done, o) {
    const L8 = shuffle((opts && opts.letters) || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')), N = L8.length; let i = 0, started = false; const missed = [];
    const box = micBox(run); run.scr.appendChild(o.st); run.scr.appendChild(box);
    const row = o.st.querySelector(o.row); row.innerHTML = L8.map(() => '<span></span>').join(''); row.classList.toggle('many', N > 13);
    run.remind = () => say(line('j-durbar', 'how'), run);
    function next() {
      const L = L8[i]; run.item(L); o.show(L, i); row.children[i].classList.add('now');
      later(run, 1200, () => {
        box.listen(() => ({ target: L, until: L, maxWrong: 2, limit: 6000 }), (r) => {
          box.busy = true;
          if (!started) { started = true; run.clock(Math.max(150, 20 + N * 9), () => done({ right: run.right, part: run.right / N, missed: L8.slice(i).concat(missed) })); }
          row.children[i].classList.remove('now');
          if (r.value === L) { box.yay(); run.good(o.st); mood(o.st, 'cheer'); say(K.L[L], run); row.children[i].classList.add('on'); row.children[i].textContent = L; o.right(L, i); later(run, o.ms || 3000, step); return; }
          run.bad(); box.nope(); mood(o.st, 'sad'); missed.push(L); row.children[i].classList.add('miss'); o.wrong(L, i); later(run, 2600, step);
        }, () => L);
        if (started) { box.busy = false; box.go(); } else box.cue();   // the first letter waits for a press; then she listens by herself
      });
    }
    function step() { i++; if (i >= N) done({ right: run.right, finished: true, missed }); else next(); }
    next();
  }

  /* ---------------- shared: name the picture out loud (Kalangu's and the auctioneer's slots) ---------------- */
  function nameIt(run, done, o) {
    const W = PICW(), among = W.map(spoken); let r = 0, got = 0;
    const box = micBox(run); run.scr.appendChild(o.st); run.scr.appendChild(box);
    run.clock(secs(150, W.length, 6), () => done({ right: got, part: got / W.length }));
    run.remind = () => say(line(o.gid, 'how'), run);
    function next() {
      const w = W[r]; run.item(w); o.show(w, r);
      later(run, o.wait || 900, () => autoRound(run, box, spoken(w), among, () => { got++; run.good(o.st); mood(o.st, 'cheer'); run.said = say(K.en[w], run); o.right(w, r); later(run, o.ms || 3400, step); },
        () => { mood(o.st, 'sad'); o.wrong(w, r); later(run, 2600, step); }));
    }
    function step() { r++; if (r >= W.length) done({ right: got, finished: true, part: got / W.length }); else next(); }
    next();
  }

  /* ---------------- shared: hear the word, touch its picture (the fishing and market-rush slots) ---------------- */
  function findIt(run, done, o) {
    const W = PICW(), N = W.length; let r = 0, got = 0, misses = 0, busy = true;
    run.scr.appendChild(o.st);
    run.clock(secs(150, N, 6), () => done({ right: got, part: got / N, misses }));
    const sayW = () => say(K.en[W[r]], run); run.remind = sayW;
    function next() {
      const w = W[r]; run.item(w); busy = true;
      const set = shuffle([w].concat(others(w, W, (o.n || 4) - 1)));
      o.round(set, (b, x) => {
        if (busy || run.dead) return; busy = true;
        if (x === w) { got++; run.good(b); mood(o.st, 'cheer'); o.right(b); later(run, o.ms || 2400, step); }
        else { misses++; run.bad(); mood(o.st, 'sad'); o.wrong(b); later(run, 2200, step); }
      }, () => { if (busy || run.dead) return; busy = true; misses++; run.bad(); mood(o.st, 'sad'); later(run, 1200, step); });
      later(run, o.lead || 700, () => { busy = false; sayW(); });
    }
    function step() { r++; if (r >= N) done({ right: got, finished: true, part: got / N, misses }); else next(); }
    next();
  }

  /* ---------------- shared: say the value of the note (the suya seller's slot) ---------------- */
  function noteSay(run, done, o) {
    const NOTES = shuffle([20, 50, 100, 200, 500, 1000]), WORD = (n) => K.enText['n' + n].toLowerCase(), AMONG = NOTES.map(WORD).concat(['ten', 'five', 'two', 'one']); let r = 0, got = 0;
    const box = micBox(run); run.scr.appendChild(o.st); run.scr.appendChild(box);
    run.clock(150, () => done({ right: got, part: got / NOTES.length }));
    run.remind = () => say(line('j-suya', 'how'), run);
    function next() {
      const n = NOTES[r]; o.show(n, r);
      later(run, 1000, () => autoRound(run, box, WORD(n), AMONG, () => { got++; run.good(o.st); mood(o.st, 'cheer'); run.said = say(K.en['n' + n], run); o.right(n); later(run, 3000, step); },
        () => { mood(o.st, 'sad'); o.wrong(n); later(run, 2400, step); }));
    }
    function step() { r++; if (r >= NOTES.length) done({ right: got, finished: true, part: got / NOTES.length }); else next(); }
    next();
  }
  const NOTEC = { 20: ['#C9E0B0', '#5E8A3E'], 50: ['#B8D4EC', '#2E5E8E'], 100: ['#D8E8F0', '#4A6E8A'], 200: ['#D9C6E8', '#6A4A8A'], 500: ['#BFE3DA', '#2E7A6A'], 1000: ['#F0D7B8', '#8A5A2E'] };
  const note = (n) => { const [a, b] = NOTEC[n]; return '<svg viewBox="0 0 100 50" aria-hidden="true"><rect x="1" y="1" width="98" height="48" rx="3" fill="' + a + '" stroke="' + b + '" stroke-width="2"/><circle cx="74" cy="25" r="15" fill="' + b + '" opacity=".25"/>' +
    '<text x="8" y="19" font-size="13" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="' + b + '">₦' + n + '</text><text x="92" y="44" text-anchor="end" font-size="11" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="' + b + '">' + n + '</text>' +
    '<path d="M8 30 h34 M8 36 h26" stroke="' + b + '" stroke-width="1.6" opacity=".5"/></svg>'; };

  /* ================= Yoruba: Igbá, the calabash carvers of Ọ̀yọ́ (Haruffa, speaking) =================
     The carver turns a calabash on his lap; a letter is cut into it. Say the letter: the pattern is burnt in round it and
     the calabash goes up on the rack with the others. Wrong: it cracks and is put aside. */
  function igbaBack() {
    let g = '<defs><linearGradient id="sg-ig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3DDB0"/><stop offset="1" stop-color="#F3E7CC"/></linearGradient>' +
      '<radialGradient id="sg-igs" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#FFF4D6" stop-opacity=".5"/><stop offset="1" stop-color="#FFF4D6" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#sg-ig)"/>';
    // the carvers' workshop in Ọ̀yọ́: a mud wall under a thatch eave, the finished calabashes hung on pegs in rows, a shaft of sun
    g += '<path d="M0 34 H320 V122 H0 Z" fill="#C98A5A"/>' + weather(0, 34, 320, 88, '#5A2E14', 4);
    g += '<path d="M-4 0 H324 V30 Q160 40 -4 30 Z" fill="#9A7E52"/>' + Array.from({ length: 40 }, (_, k) => '<path d="M' + (k * 8) + ' 0 L' + (k * 8 + 2) + ' ' + (32 + (k % 3)) + '" stroke="#7A6038" stroke-width=".9" opacity=".75"/>').join('') + '<path d="M-4 30 Q160 40 324 30" stroke="#5A4426" stroke-width="1.6" fill="none"/>';
    g += '<rect width="320" height="200" fill="url(#sg-igs)"/>';
    // carved calabashes on pegs, each with its own burnt pattern: two rows left, two rows right, the middle left clear for the bowl
    const gourd = (x, y, r, c, k) => '<path d="M' + x + ' ' + (y - r - 3) + ' v3" stroke="#5A3418" stroke-width="1"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" stroke="#7A4A26" stroke-width=".6"/>' +
      (k % 3 === 0 ? '<path d="M' + (x - r * .8) + ' ' + y + ' h' + (r * 1.6) + ' M' + x + ' ' + (y - r * .8) + ' v' + (r * 1.6) + '" stroke="#5A3418" stroke-width=".6"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .45) + '" fill="none" stroke="#5A3418" stroke-width=".5"/>'
        : k % 3 === 1 ? Array.from({ length: 6 }, (_, j) => '<path d="M' + x + ' ' + y + ' L' + f1(x + Math.cos(j * 1.047) * r * .85) + ' ' + f1(y + Math.sin(j * 1.047) * r * .85) + '" stroke="#5A3418" stroke-width=".5"/>').join('')
        : '<path d="M' + (x - r * .8) + ' ' + (y - r * .3) + ' q' + (r * .4) + ' -' + (r * .5) + ' ' + (r * .8) + ' 0 t' + (r * .8) + ' 0 M' + (x - r * .8) + ' ' + (y + r * .3) + ' q' + (r * .4) + ' -' + (r * .5) + ' ' + (r * .8) + ' 0 t' + (r * .8) + ' 0" stroke="#5A3418" stroke-width=".5" fill="none"/>') +
      '<ellipse cx="' + (x - r * .35) + '" cy="' + (y - r * .4) + '" rx="' + (r * .3) + '" ry="' + (r * .18) + '" fill="#fff" opacity=".35"/>';
    [[14, 52], [36, 52], [58, 52], [80, 54], [24, 78], [48, 78], [72, 80], [242, 54], [264, 52], [286, 52], [308, 52], [252, 78], [276, 78], [300, 80]].forEach(([x, y], k) => { g += gourd(x, y, 8 + (k % 3), ['#E8C98A', '#D9B070', '#C99A5A', '#B07A3E'][k % 4], k); });
    // the floor: shavings, a bench, the iron in the charcoal pot with its smoke, a basket of uncut gourds, a cat asleep
    g += '<path d="M0 122 H320 V200 H0 Z" fill="#D8B07A"/><path d="M0 122 H320" stroke="#A9764A" stroke-width="2"/>' + Array.from({ length: 30 }, (_, k) => '<path d="M' + ((k * 41) % 320) + ' ' + (130 + (k * 17) % 64) + ' q3 -2 6 0" stroke="#B07A3E" stroke-width=".7" fill="none" opacity=".7"/>').join('');
    g += '<path d="M88 152 q8 -14 24 -14 q16 0 22 14 Z" fill="#6E3E1C"/><ellipse cx="110" cy="140" rx="12" ry="3" fill="#2A1A10"/>' + [100, 106, 112, 118].map((x) => '<circle cx="' + x + '" cy="139" r="2" fill="' + (x % 12 ? '#E8501A' : '#F2A030') + '"/>').join('') + '<path d="M114 138 L132 120" stroke="#3A3A3A" stroke-width="1.6"/><path d="M130 122 l6 -6" stroke="#8E5A2E" stroke-width="2.6"/>' + smoke(108, 132, .9);
    g += '<path d="M200 168 q18 -18 36 0 Z" fill="#A0703E"/>' + Array.from({ length: 7 }, (_, k) => '<path d="M' + (202 + k * 5) + ' 168 l3 -12" stroke="#7A4A26" stroke-width=".6"/>').join('') + [[208, 156], [218, 152], [228, 156]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="6" fill="#9AB36A" stroke="#6E8A3E" stroke-width=".6"/>').join('');
    g += '<g transform="translate(150 186)"><ellipse cx="0" cy="0" rx="9" ry="4" fill="#5A4A3A"/><circle cx="8" cy="-2" r="3.2" fill="#5A4A3A"/><path d="M6 -5 l1 -2 l1.4 2 M9 -5 l1 -2 l1 2" fill="#5A4A3A"/><path d="M-9 0 q-6 2 -4 -4" stroke="#5A4A3A" stroke-width="1.4" fill="none"/></g>';
    // the helper at work on a gourd, a buyer at the door; the master carver in aṣọ òkè watching the bowl
    g += person(52, 178, 60, { kind: 'man', robe: CLOTH.ank[2], trou: '#E8DFC8', hat: 'fila', hatc: '#7A2E5C', skin: 2, al: 'fwd', ar: 'fwd', cls: 'sgw x-idle' });
    g += '<ellipse cx="66" cy="152" rx="8" ry="7" fill="#E8C98A" stroke="#7A4A26" stroke-width=".6"/>';
    g += person(190, 150, 34, dressed(Y, 2, { al: 'hip', ar: 'fwd', flip: 1, cls: 'sgw' }));
    g += '<g class="sgopp">' + person(276, 180, 70, { kind: 'man', robe: '#E8D7A8', agbada: CLOTH.oke[1], hat: 'fila', hatc: '#5A2E7A', beard: 'w', skin: 3, al: 'fwd', ar: 'hip' }) + '</g>';
    return svgBack(g);
  }
  const igba = {
    cls: 'sgs sg-igba', scene: 'none', noHow: false,
    play(run, done) {
      const st = h('<div class="sg igba">' + igbaBack() + '<div class="cbrack sgrow"></div><div class="cbbowl"><b></b><i class="cbcrack"></i></div></div>');
      const bowl = st.querySelector('.cbbowl'), b = bowl.querySelector('b');
      letterSay(run, done, { st, row: '.cbrack',
        show: (L) => { b.textContent = L; bowl.className = 'cbbowl'; void bowl.offsetWidth; bowl.classList.add('turn'); knock(500, .05, .2); },
        right: () => { bowl.classList.add('burnt'); later(run, 1300, () => bowl.classList.add('rack')); },
        wrong: () => { bowl.classList.add('crack'); knock(140, .2, .4); later(run, 1200, () => bowl.classList.add('aside')); } });
    },
  };

  /* ================= Igbo: Egwu Ọnwa, moonlight play in the village square (Haruffa, speaking) =================
     Under the full moon the children play; one at a time a child runs into the ring holding up a letter. Say it and the
     child joins the dance, and a star with that letter lights up in the sky. Wrong: the child runs back, the star stays dim. */
  function moonBack() {
    let g = '<defs><linearGradient id="sg-mo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141C3C"/><stop offset=".7" stop-color="#3A4470"/><stop offset="1" stop-color="#5A5878"/></linearGradient>' +
      '<radialGradient id="sg-moh" cx=".5" cy=".5" r=".5"><stop offset=".4" stop-color="#F6F0D2" stop-opacity=".25"/><stop offset="1" stop-color="#F6F0D2" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#sg-mo)"/>';
    for (let k = 0; k < 40; k++) g += '<circle cx="' + ((k * 71) % 320) + '" cy="' + (30 + (k * 31) % 60) + '" r="' + (k % 6 ? .5 : .9) + '" fill="#F6F0D2" opacity="' + (.35 + (k % 4) * .15) + '"/>';
    g += '<circle cx="270" cy="58" r="40" fill="url(#sg-moh)"/><circle cx="270" cy="58" r="20" fill="#F6F0D2"/><circle cx="264" cy="54" r="3.4" fill="#E2DCB8"/><circle cx="276" cy="64" r="2.4" fill="#E2DCB8"/><circle cx="276" cy="50" r="1.6" fill="#E2DCB8"/>';
    // the compound walls with their zinc roofs catching the moon, a window lit by a lantern, the iroko tree, a palm
    g += '<path d="M0 110 V88 H110 V110 Z" fill="#2A2438"/>' + zinc(-4, 114, 82, 7, 2).replace(/#A9B2B6/g, '#5A6074').replace(/#7E888E/g, '#454A5C').replace(/#9A5A2E/g, '#4A3A44');
    g += '<path d="M210 110 V94 H320 V110 Z" fill="#2A2438"/>' + zinc(206, 324, 88, 7, 5).replace(/#A9B2B6/g, '#5A6074').replace(/#7E888E/g, '#454A5C').replace(/#9A5A2E/g, '#4A3A44') + '<rect x="290" y="98" width="10" height="8" fill="#FFB347" opacity=".7"/>';
    g += '<path d="M50 110 L53 66 Q44 58 34 54 M53 70 Q60 58 74 52 M53 66 L55 44" stroke="#1E1A2C" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M47 110 L50 70 L58 70 L60 110 Z" fill="#1E1A2C"/><g fill="#1E1A2C" class="x-leaf"><circle cx="30" cy="48" r="13"/><circle cx="44" cy="34" r="16"/><circle cx="62" cy="28" r="17"/><circle cx="80" cy="38" r="15"/><circle cx="90" cy="52" r="11"/><circle cx="56" cy="46" r="15"/><circle cx="22" cy="58" r="8"/></g><g fill="#2C2840"><circle cx="40" cy="30" r="5"/><circle cx="60" cy="22" r="6"/><circle cx="82" cy="32" r="5"/></g>';
    g += '<path d="M232 94 Q228 66 236 40" stroke="#1E1A2C" stroke-width="3" fill="none"/><g transform="translate(236 40)" class="x-leaf">' + [0, 50, 110, 170, 230, 290].map((a) => '<path d="M0 0 q' + f1(Math.cos(a * Math.PI / 180) * 12) + ' ' + f1(Math.sin(a * Math.PI / 180) * 6 - 6) + ' ' + f1(Math.cos(a * Math.PI / 180) * 20) + ' ' + f1(Math.sin(a * Math.PI / 180) * 8 + 4) + '" stroke="#1E1A2C" stroke-width="2.4" fill="none"/>').join('') + '</g>';
    g += '<path d="M0 110 H320 V200 H0 Z" fill="#6A5E6E"/><ellipse cx="160" cy="160" rx="130" ry="30" fill="#7E7280"/><ellipse cx="160" cy="160" rx="130" ry="30" fill="none" stroke="#9A8EA0" stroke-width=".8" stroke-dasharray="3 3"/>';
    // the mothers on the bench by the wall, watching; the ring of children clapping; the grandmother on her stool
    g += '<rect x="130" y="112" width="64" height="3" fill="#3A2E38"/>' + person(144, 114, 24, dressed(0, 0, { al: 'clap', ar: 'clap', cls: 'sgw' })) + person(166, 114, 24, dressed(0, 2, { al: 'hip', ar: 'down', cls: 'sgw' })) + person(186, 114, 24, dressed(0, 4, { al: 'clap', ar: 'clap', flip: 1, cls: 'sgw' }));
    [[34, 150], [62, 160], [258, 160], [286, 150], [112, 136], [208, 136]].forEach(([x, y], k) => { g += person(x, y, 36, { kind: k % 2 ? 'boy' : 'woman', robe: [CLOTH.ank[0], CLOTH.check, CLOTH.ank[2], CLOTH.ank[4]][k % 4], wrap: CLOTH.george[k % 3], hat: k % 2 ? 'hair' : 'braids', skin: k % 5, tight: 1, al: 'clap', ar: 'clap', cls: 'sgw' }); });
    g += '<g class="sgopp">' + person(300, 196, 54, { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.george[0], hat: 'tie', hatc: '#1F4E2E', skin: 2, al: 'hip', ar: 'clap' }) + '</g>';
    return svgBack(g);
  }
  const egwuOnwa = {
    cls: 'sgs sg-moon', scene: 'none', noHow: false,
    play(run, done) {
      const st = h('<div class="sg moon">' + moonBack() + '<div class="mnstars sgrow"></div><div class="mnkid"><span class="mnfig"></span><b class="mncard"></b></div></div>');
      const kid = st.querySelector('.mnkid'), fig2 = kid.querySelector('.mnfig'), cardB = kid.querySelector('.mncard');
      letterSay(run, done, { st, row: '.mnstars',
        show: (L, i) => { cardB.textContent = L; fig2.innerHTML = fig({ kind: i % 2 ? 'boy' : 'woman', robe: ['#E8A317', '#B23A2E', '#1F4E2E', '#7A2E5C'][i % 4], wrap: '#2E4E7A', hat: i % 2 ? 'hair' : 'braids', skin: i % 5, tight: 1, al: 'up', ar: 'up' });
          kid.className = 'mnkid'; void kid.offsetWidth; kid.classList.add('in'); },
        right: () => { kid.classList.add('dance'); knocks(run, 4, 700, 150); later(run, 1800, () => kid.classList.add('join')); },
        wrong: () => { kid.classList.add('back'); } });
    },
  };

  /* ================= Yoruba: Àlọ́, a story by the fire with Ìjàpá (Abubuwa, speaking) =================
     Grandmother tells a tale of Ìjàpá the tortoise; each thing in the story rises in the smoke over the fire. Name it and
     the children answer "Ààlọ̀!", and Ìjàpá puts it in his bag. Wrong: the fire sinks low. */
  function aloBack() {
    let g = '<defs><linearGradient id="sg-al" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151830"/><stop offset=".6" stop-color="#2E2A48"/><stop offset="1" stop-color="#4A3A48"/></linearGradient><radialGradient id="sg-fire" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFB347" stop-opacity=".6"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="sg-moon" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#FFF6D8" stop-opacity=".35"/><stop offset="1" stop-color="#FFF6D8" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#sg-al)"/>';
    // the night: stars, the moon over the roofs, the compound walls with a lamp in a window, a plantain, a palm
    for (let k = 0; k < 46; k++) g += '<circle cx="' + ((k * 67) % 320) + '" cy="' + (4 + (k * 29) % 70) + '" r="' + (k % 5 ? .5 : .9) + '" fill="#FFF6D8" opacity="' + (.4 + (k % 4) * .15) + '"/>';
    g += '<circle cx="262" cy="30" r="26" fill="url(#sg-moon)"/><circle cx="262" cy="30" r="12" fill="#FFF3CC"/><circle cx="258" cy="27" r="2.4" fill="#E8DDB0"/><circle cx="266" cy="34" r="1.6" fill="#E8DDB0"/>';
    g += '<path d="M0 104 V58 L40 40 L84 58 V104 Z" fill="#2E2630"/><path d="M-6 60 L40 36 L88 60 Z" fill="#3E3428"/>' + Array.from({ length: 12 }, (_, k) => '<path d="M' + (-2 + k * 8) + ' ' + (58 - Math.abs(k - 5.5) * 3.6) + ' l2 6" stroke="#5A4A36" stroke-width=".7"/>').join('');
    g += '<rect x="20" y="70" width="12" height="12" fill="#FFB347" opacity=".75"/><path d="M26 70 v12 M20 76 h12" stroke="#2E2630" stroke-width="1.2"/><rect x="50" y="74" width="16" height="30" fill="#1E1820"/>';
    g += '<path d="M236 104 V64 H320 V104 Z" fill="#2E2630"/>' + zinc(232, 324, 56, 9, 4).replace(/#A9B2B6/g, '#4E5458').replace(/#7E888E/g, '#3A4044').replace(/#9A5A2E/g, '#5A3A2A');
    g += '<rect x="292" y="74" width="12" height="10" fill="#FFB347" opacity=".6"/>';
    g += '<g transform="translate(104 104)" class="x-leaf">' + [-40, -12, 18, 44].map((a) => '<path d="M0 -40 Q' + (a * .5) + ' -62 ' + a + ' -52" stroke="#1E3A2A" stroke-width="5" fill="none" stroke-linecap="round"/>').join('') + '<path d="M0 0 V-42" stroke="#2E4A2E" stroke-width="3"/></g>';
    g += '<path d="M206 104 Q204 60 212 22" stroke="#2A2420" stroke-width="3" fill="none"/><g transform="translate(212 22)" class="x-leaf">' + [0, 50, 110, 170, 230, 290].map((a) => '<path d="M0 0 q' + f1(Math.cos(a * Math.PI / 180) * 12) + ' ' + f1(Math.sin(a * Math.PI / 180) * 6 - 6) + ' ' + f1(Math.cos(a * Math.PI / 180) * 20) + ' ' + f1(Math.sin(a * Math.PI / 180) * 8 + 4) + '" stroke="#1E3022" stroke-width="2.4" fill="none"/>').join('') + '</g>';
    g += '<path d="M0 104 H320 V200 H0 Z" fill="#4A3A2E"/><ellipse cx="160" cy="150" rx="150" ry="62" fill="url(#sg-fire)"/>';
    // the storyteller's stool and her mat; the family round the fire, children in front, two grown-ups on a bench behind
    g += '<ellipse cx="160" cy="176" rx="120" ry="10" fill="#8E6A3E" opacity=".55"/>' + Array.from({ length: 16 }, (_, k) => '<path d="M' + (46 + k * 15) + ' 168 v16" stroke="#6E4E2E" stroke-width=".6" opacity=".6"/>').join('');
    g += '<rect x="226" y="146" width="70" height="4" rx="1" fill="#5A3A22"/><path d="M232 150 v14 M290 150 v14" stroke="#3E2814" stroke-width="2"/>';
    g += person(240, 150, 40, { kind: 'man', robe: '#C9B48A', hat: 'fila', hatc: '#5A2E7A', skin: 4, al: 'hip', ar: 'down', cls: 'sgw' }) + person(276, 150, 38, { kind: 'woman', robe: CLOTH.ank[3], wrap: CLOTH.adire[1], hat: 'gele', hatc: '#2B4C9B', skin: 2, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += '<g class="sgopp">' + person(64, 170, 66, { kind: 'woman', robe: '#E8D7A8', wrap: CLOTH.adire[0], hat: 'gele', hatc: '#2B4C9B', skin: 3, al: 'up', ar: 'hip' }) + '</g>';
    [[100, 182, 'boy'], [226, 184, 'woman'], [256, 180, 'boy'], [284, 184, 'woman']].forEach(([x, y, k], j) => { g += person(x, y, 36, { kind: k, robe: [CLOTH.ank[0], CLOTH.check, CLOTH.ank[4], CLOTH.ank[1]][j], wrap: CLOTH.ank[5], hat: k === 'boy' ? 'hair' : 'braids', skin: j + 1, tight: 1, al: 'clap', ar: 'clap', cls: 'sgw' }); });
    // Ìjàpá the tortoise with his bag, and a dog by the wall
    g += '<g transform="translate(206 176)"><ellipse cx="0" cy="0" rx="18" ry="11" fill="#6B5A2E"/><path d="M-14 -2 q14 -18 28 0" fill="#8E7A3E"/><path d="M-8 -6 l4 6 M0 -9 v8 M8 -6 l-4 6" stroke="#5A4A22" stroke-width="1.2"/><ellipse cx="20" cy="-4" rx="6" ry="5" fill="#8E7A3E"/><circle cx="22" cy="-6" r="1" fill="#1E1E24"/><path d="M-26 -6 q4 -10 10 -4 q2 8 -10 6 Z" fill="#C9A06A" stroke="#7A5A36"/></g>';
    g += '<g transform="translate(20 116)"><ellipse cx="0" cy="0" rx="10" ry="4" fill="#5A4636"/><circle cx="-9" cy="-3" r="3.4" fill="#5A4636"/><path d="M-11 -6 l-1 -3 l2 1" fill="#5A4636"/></g>';
    return svgBack(g);
  }
  const alo = {
    cls: 'sgs sg-alo', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg alo">' + aloBack() + '<div class="alfire"><i></i><i></i><i></i></div><div class="alsmoke"></div><b class="alsing">Ààlọ̀!</b></div>');
      const smoke = st.querySelector('.alsmoke'), fire = st.querySelector('.alfire');
      nameIt(run, done, { st, gid: 'j-magana',
        show: (w) => { smoke.className = 'alsmoke'; fire.className = 'alfire'; smoke.innerHTML = card(w); void smoke.offsetWidth; smoke.classList.add('rise'); },
        right: () => { later(run, 1300, () => smoke.classList.add('bag')); },
        wrong: () => { fire.classList.add('low'); smoke.classList.add('fade'); } });
    },
  };

  /* ================= Igbo: Nollywood, on the film set (Abubuwa, speaking) =================
     The prop for the next scene is held up on the clapperboard. Name it: "Action!", the board claps and the actors play the
     scene. Wrong: "Cut!", the director shakes his head. */
  function setBack() {
    let g = '<defs><linearGradient id="sg-se" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BCDDF0"/><stop offset="1" stop-color="#EDE4D0"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-se)"/>' + cloudy(120, 10, .8);
    // a Nollywood set in a village in Enugu: the house front with zinc roof and a carved door, washing on the line, the
    // crew's lights on stands, the camera on its tripod, the boom, the cables across the yard, a crowd of villagers watching
    g += town(56, 0, '#C9CCC4', 6);
    g += '<rect x="0" y="56" width="320" height="64" fill="#C9B08A"/>' + weather(0, 56, 320, 64, '#3A2A1A', 5);
    g += '<rect x="186" y="40" width="120" height="80" fill="#E8D7B0"/>' + weather(186, 40, 120, 80, '#3A2A1A', 2) + zinc(180, 312, 32, 9, 3) + louvre(196, 58, 26, 18) + '<rect x="230" y="70" width="30" height="50" fill="#7A4A26"/><path d="M233 73 h24 v44 h-24 Z M245 73 v44" fill="none" stroke="#4A2A10" stroke-width="1"/>' + louvre(270, 58, 26, 18);
    g += '<path d="M80 62 Q130 70 176 62" stroke="#5A4A3A" stroke-width=".5" fill="none"/>' + [[92, CLOTH.ank[1]], [112, '#F4F1EA'], [136, CLOTH.george[0]], [158, CLOTH.ank[5]]].map(([x, c], k) => '<path class="x-flag" style="animation-delay:-' + k * .5 + 's" d="M' + (x - 7) + ' ' + (63 + (k === 1 || k === 2 ? 2 : 0)) + ' h14 v' + (12 + k % 2 * 4) + ' h-14 Z" fill="' + c + '"/>').join('');
    g += '<path d="M0 120 H320 V200 H0 Z" fill="#B8A07A"/><path d="M0 120 H320" stroke="#8E7A5A" stroke-width="2"/>' + '<path d="M58 176 Q120 168 180 182 T320 176" stroke="#1E1E24" stroke-width="1" fill="none"/><path d="M20 150 Q60 160 100 152" stroke="#1E1E24" stroke-width=".8" fill="none"/>';
    g += band(0, 90, 180, 118, 5, 26, 8);
    [[20, 40], [300, 44]].forEach(([x, y]) => { g += '<path d="M' + x + ' 150 V' + y + '" stroke="#2A2A30" stroke-width="2"/><path d="M' + (x - 8) + ' 150 l8 -10 l8 10" stroke="#2A2A30" stroke-width="1.4" fill="none"/><rect x="' + (x - 9) + '" y="' + (y - 10) + '" width="18" height="14" rx="2" fill="#2A2A30"/><rect x="' + (x - 7) + '" y="' + (y - 8) + '" width="14" height="10" fill="#FFF3C0" opacity=".6"/><path d="M' + (x - 7) + ' ' + (y + 4) + ' l-14 30 h42 l-14 -30 Z" fill="#FFF3C0" opacity=".25"/>'; });
    g += '<g transform="translate(58 132)"><path d="M0 0 L-12 44 M0 0 L12 44 M0 0 V44" stroke="#2A2A30" stroke-width="2"/><rect x="-18" y="-18" width="34" height="20" rx="3" fill="#2A2A30"/><circle cx="20" cy="-8" r="7" fill="#3A3A44" stroke="#2A2A30" stroke-width="2"/><circle cx="20" cy="-8" r="3" fill="#5A7A9A"/><circle cx="-12" cy="-14" r="1.4" fill="#C62828"/></g>';
    g += '<path d="M150 112 L200 70" stroke="#2A2A30" stroke-width="1.4"/><rect x="196" y="64" width="12" height="7" rx="3" fill="#4A4A54"/>' + person(146, 124, 34, { kind: 'man', robe: '#1E1E24', trou: '#3A3A44', hat: 'hair', skin: 2, al: 'up', ar: 'up', cls: 'sgw' });
    g += person(34, 186, 58, { kind: 'man', robe: '#1E1E24', trou: '#3A3A44', hat: 'okpuf', hatc: '#1E1E24', skin: 3, al: 'fwd', ar: 'fwd', cls: 'sgw' });
    // the actors in costume: a chief and his wife; the director in his chair
    g += '<g class="sgw">' + person(208, 150, 56, { kind: 'man', robe: CLOTH.isiagu[0], wrapper: '#B23A2E', hat: 'okpuf', hatc: '#B23A2E', hatc2: '#1E1E24', beads: 1, skin: 2, al: 'staff', ar: 'up' }) + '</g>';
    g += '<g class="sgw">' + person(236, 152, 52, { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.george[1], hat: 'tie', hatc: '#E8A317', beads: 1, skin: 1, al: 'hip', ar: 'up' }) + '</g>';
    g += '<g class="sgopp">' + person(292, 186, 62, { kind: 'man', robe: CLOTH.ank[3], trou: '#2A2A30', hat: 'okpuf', hatc: '#2E4E7A', skin: 4, al: 'hip', ar: 'fwd' }) + '</g>';
    g += '<g transform="translate(266 192)"><path d="M-8 0 L-6 -12 M8 0 L6 -12 M-8 -12 L8 0 M8 -12 L-8 0" stroke="#3A2A1A" stroke-width="1"/><rect x="-8" y="-14" width="16" height="3" fill="#1E1E24"/><rect x="-8" y="-24" width="16" height="7" fill="#1E1E24"/><text y="-19" text-anchor="middle" font-size="3.4" font-weight="800" font-family="Arial" fill="#fff">DIRECTOR</text></g>';
    return svgBack(g);
  }
  const nolly = {
    cls: 'sgs sg-nolly', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg nolly">' + setBack() + '<div class="nlboard"><i class="nlclap"></i><span class="nlslate"></span></div><b class="nlcall"></b></div>');
      const board = st.querySelector('.nlboard'), slate = st.querySelector('.nlslate'), call = st.querySelector('.nlcall');
      nameIt(run, done, { st, gid: 'j-magana',
        show: (w) => { slate.innerHTML = card(w); board.className = 'nlboard'; call.className = 'nlcall'; void board.offsetWidth; board.classList.add('in'); },
        right: () => { call.textContent = 'ACTION!'; call.classList.add('on'); board.classList.add('clapped'); knock(1600, .04, .5); st.classList.add('roll'); later(run, 2600, () => st.classList.remove('roll')); },
        wrong: () => { call.textContent = 'CUT!'; call.classList.add('on', 'cut'); knock(160, .2, .4); } });
    },
  };

  /* ================= Yoruba: Ẹrù Ìyàwó, the engagement (Abubuwa, speaking) =================
     The groom's people bring in the gifts on the list, one tray at a time; the Alága, the lady with the microphone, asks
     what it is. Name it and it goes onto the gift table and both families clap. Wrong: the tray goes back out. */
  function engageBack() {
    // the ìdána in the family compound: a white-and-gold canopy, the two families in their aṣọ ẹbí facing each other across
    // the gift table, the Alága Ìjókòó with her microphone, a DJ's speakers, a photographer, chairs dressed in ribbon
    let g = '<defs><linearGradient id="sg-en" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF0D8"/><stop offset="1" stop-color="#EEDCB6"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-en)"/>';
    // the house behind: a storey building, its louvres and its balcony with people looking down
    g += '<rect x="0" y="14" width="320" height="62" fill="#E7D5B0"/>' + weather(0, 14, 320, 62, '#5A3A1E', 3) + louvre(18, 24, 26, 18) + louvre(70, 24, 26, 18) + louvre(226, 24, 26, 18) + louvre(278, 24, 26, 18);
    g += '<rect x="0" y="44" width="320" height="3" fill="#C9B48A"/>' + Array.from({ length: 40 }, (_, k) => '<rect x="' + (k * 8 + 2) + '" y="47" width="2" height="9" fill="#C9B48A"/>').join('') + '<rect x="0" y="55" width="320" height="2.4" fill="#B8A07A"/>';
    // the canopy: white with gold valance, ruched, poles wrapped in cloth
    g += '<path d="M-4 52 Q80 44 160 50 Q240 44 324 52 L324 66 H-4 Z" fill="#FFFDF7"/>' + Array.from({ length: 20 }, (_, k) => '<path d="M' + (k * 16) + ' 66 q8 7 16 0" fill="#E8B830" stroke="#C9971A" stroke-width=".5"/>').join('');
    g += '<path d="M0 50 Q80 42 160 48 Q240 42 320 50" stroke="#E8B830" stroke-width="1.2" fill="none"/>' + flags(0, 70, 320, 70, ['#7A2E5C', '#E8A317', '#2B4C9B', '#FFFDF7'], 6, 40);
    g += [8, 312].map((x) => '<rect x="' + (x - 2) + '" y="56" width="4" height="96" fill="#FFFDF7"/><path d="M' + (x - 2) + ' 60 l4 6 M' + (x - 2) + ' 72 l4 6 M' + (x - 2) + ' 84 l4 6 M' + (x - 2) + ' 96 l4 6" stroke="#E8B830" stroke-width="1.2"/>').join('');
    g += '<path d="M0 140 H320 V200 H0 Z" fill="#CDB487"/><path d="M0 140 H320" stroke="#B89E6E" stroke-width="1.6"/>';
    // a red carpet down the middle to the parents' chairs
    g += '<path d="M128 200 L144 130 H176 L192 200 Z" fill="#9B1B30"/><path d="M131 200 L146 130 M189 200 L174 130" stroke="#E8B830" stroke-width=".8"/>';
    // the bride's family on the left in gold and purple aṣọ ẹbí, the groom's on the right in blue, seated and standing behind
    for (let k = 0; k < 6; k++) g += chair(18 + k * 19, 136, .9, '#FFFDF7') + '<path d="M' + (12 + k * 19) + ' 124 q6 4 12 0" stroke="#7A2E5C" stroke-width="1.2" fill="none"/>';
    for (let k = 0; k < 6; k++) g += chair(208 + k * 19, 136, .9, '#FFFDF7') + '<path d="M' + (202 + k * 19) + ' 124 q6 4 12 0" stroke="#2B4C9B" stroke-width="1.2" fill="none"/>';
    for (let k = 0; k < 7; k++) g += person(10 + k * 17, 132, 46, { kind: k % 2 ? 'man' : 'woman', robe: k % 2 ? '#E8DFC8' : CLOTH.lace[1], agbada: k % 2 ? CLOTH.oke[0] : 0, wrap: CLOTH.oke[0], ipele: k % 4 === 0 ? CLOTH.oke[0] : 0, hat: k % 2 ? 'fila' : 'gele', hatc: k % 2 ? '#7A2E5C' : '#E8A317', skin: k, al: ['clap', 'hip', 'wave', 'clap'][k % 4], ar: ['clap', 'down', 'hip', 'clap'][k % 4], beads: k % 3 === 0, cls: 'sgw' + (k % 3 === 1 ? ' x-idle' : ''), flip: k > 3 });
    for (let k = 0; k < 7; k++) g += person(204 + k * 17, 132, 46, { kind: k % 2 ? 'woman' : 'man', robe: k % 2 ? CLOTH.lace[0] : '#F4F1EA', agbada: k % 2 ? 0 : CLOTH.oke[1], wrap: CLOTH.oke[1], hat: k % 2 ? 'gele' : 'fila', hatc: k % 2 ? '#2B4C9B' : '#1F4E9A', skin: k + 2, al: ['clap', 'wave', 'hip', 'clap'][k % 4], ar: ['clap', 'hip', 'down', 'clap'][k % 4], cls: 'sgw' + (k % 3 === 2 ? ' x-idle' : ''), flip: k < 3 });
    // the parents' seats at the head of the carpet, under a gold drape
    g += '<path d="M138 82 Q160 74 182 82 L184 112 H136 Z" fill="#E8B830" opacity=".9"/><path d="M140 84 Q160 78 180 84" stroke="#FFFDF7" stroke-width="1" fill="none"/>';
    // the gift table: the suitcase, yams, the kola and bitter kola, honey, a crate of drinks, the Bible, bags of salt and sugar
    g += '<rect x="194" y="142" width="116" height="22" rx="2" fill="#FFFDF7"/><path d="M194 142 h116 v6 q-58 6 -116 0 Z" fill="#E8B830"/><rect x="198" y="164" width="3" height="24" fill="#B8A07A"/><rect x="303" y="164" width="3" height="24" fill="#B8A07A"/>';
    g += '<rect x="282" y="122" width="22" height="18" rx="2" fill="#7A2E5C"/><rect x="290" y="119" width="6" height="3" rx="1" fill="#4A1A36"/><path d="M282 130 h22" stroke="#E8B830" stroke-width="1"/>';
    g += '<g fill="#8E5A2E">' + [0, 1, 2].map((k) => '<ellipse cx="' + (262 + k * 5) + '" cy="' + (139 - k) + '" rx="9" ry="3.4" transform="rotate(-12 ' + (262 + k * 5) + ' ' + (139 - k) + ')"/>').join('') + '</g>';
    g += '<rect x="240" y="128" width="14" height="12" fill="#C62828"/><g fill="#5A3A1E">' + [0, 1, 2].map((k) => '<rect x="' + (241 + k * 4.4) + '" y="122" width="3" height="7" rx="1"/>').join('') + '</g>';
    g += '<path d="M224 140 q-2 -8 4 -10 q6 2 4 10 Z" fill="#E8A317" opacity=".9"/><rect x="226" y="127" width="4" height="3" fill="#8E5A2E"/>';
    // the Alága Ìjókòó with her microphone, waving the families on (the game's speaker)
    g += '<g class="sgopp">' + person(40, 190, 68, { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.oke[0], ipele: CLOTH.oke[0], hat: 'gele', hatc: '#E8A317', beads: 1, skin: 2, al: 'up', ar: 'hip', hr: '', hl: '<rect x="-1.4" y="-10" width="2.8" height="9" rx="1.2" fill="#1E1E24"/><circle cx="0" cy="-11" r="2.4" fill="#5A5A60"/>' }) + '</g>';
    // the DJ's speaker and the photographer at the far edge
    g += '<rect x="296" y="150" width="20" height="36" rx="2" fill="#1E1E24"/><circle cx="306" cy="162" r="5" fill="#3A3A40"/><circle cx="306" cy="162" r="2" fill="#1E1E24"/><circle cx="306" cy="177" r="3" fill="#3A3A40"/>';
    g += person(282, 196, 64, { kind: 'man', robe: '#1E1E24', trou: '#1E1E24', hat: 'hair', skin: 4, al: 'up', ar: 'up', hl: '<rect x="-5" y="-6" width="12" height="8" rx="1.4" fill="#2A2A30"/><circle cx="1" cy="-2" r="2.6" fill="#5A6A7A"/>', cls: 'sgw', flip: 1 });
    return svgBack(g);
  }
  const eru = {
    cls: 'sgs sg-eru', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg eru">' + engageBack() + '<div class="erbear"><span class="erman">' + fig({ kind: 'man', robe: '#2B4C9B', agbada: '#2B4C9B', hat: 'fila', hatc: '#F4F1EA', skin: 2, al: 'up', ar: 'up' }) + '</span><span class="ertray"></span></div><div class="ertable"></div></div>');
      const bear = st.querySelector('.erbear'), tray = st.querySelector('.ertray'), table = st.querySelector('.ertable');
      nameIt(run, done, { st, gid: 'j-dillali', wait: 1300,
        show: (w) => { tray.innerHTML = card(w); bear.className = 'erbear'; void bear.offsetWidth; bear.classList.add('in'); },
        right: (w) => { knocks(run, 4, 500, 150); later(run, 900, () => { table.insertAdjacentHTML('beforeend', card(w, 'ergift')); bear.classList.add('out'); }); },
        wrong: () => { later(run, 600, () => bear.classList.add('out')); } });
    },
  };

  /* ================= Igbo: Ọ̀bịbịa Ụlọ, home for Christmas (Abubuwa, speaking) =================
     The family is back from the city and the big striped bag is opened in front of Nne. Each thing comes out of the bag;
     name it and it goes to Nne, who dances. Wrong: it goes back into the bag. */
  function homeBack() {
    let g = '<defs><linearGradient id="sg-hm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BCDDF0"/><stop offset=".55" stop-color="#F7D9A0"/><stop offset="1" stop-color="#F3E8CC"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-hm)"/>' + cloudy(250, 14, 1) + birdsAt(230, 30, 3);
    // Christmas homecoming to the village: the family's storey house with its balcony and louvres, the wall and gate with
    // the welcome banner, the palm and the orange tree, the neighbours come out to greet them, the dusty car loaded high
    g += '<path d="M218 116 Q214 70 224 30" stroke="#6B5236" stroke-width="4" fill="none"/><g transform="translate(224 30)" class="x-leaf">' + [0, 40, 80, 130, 180, 230, 290].map((a) => '<path d="M0 0 q' + f1(Math.cos(a * Math.PI / 180) * 14) + ' ' + f1(Math.sin(a * Math.PI / 180) * 7 - 7) + ' ' + f1(Math.cos(a * Math.PI / 180) * 24) + ' ' + f1(Math.sin(a * Math.PI / 180) * 9 + 5) + '" stroke="#3E6B2A" stroke-width="3" fill="none"/>').join('') + '</g>';
    g += '<rect x="20" y="20" width="190" height="96" fill="#F4F1EA"/>' + weather(20, 20, 190, 96, '#5A4A3A', 4) + '<path d="M12 22 L115 2 L218 22 Z" fill="#8E3A2A"/>' + Array.from({ length: 20 }, (_, k) => '<path d="M' + (16 + k * 10) + ' ' + (22 - Math.max(0, 20 - Math.abs(16 + k * 10 - 115) * .19)) + ' v' + (Math.max(0, 20 - Math.abs(16 + k * 10 - 115) * .19)) + '" stroke="#6E2A1E" stroke-width=".7"/>').join('');
    g += louvre(36, 28, 26, 16) + louvre(166, 28, 26, 16) + '<rect x="20" y="52" width="190" height="4" fill="#C9C2B0"/>' + Array.from({ length: 24 }, (_, k) => '<path d="M' + (22 + k * 8) + ' 46 v6" stroke="#8E8A80" stroke-width="1"/>').join('') + '<path d="M20 46 h190" stroke="#8E8A80" stroke-width="1.2"/>';
    g += '<rect x="96" y="66" width="32" height="50" fill="#5A3A1E"/><path d="M99 69 h26 v44 h-26 Z M112 69 v44" fill="none" stroke="#3A2010" stroke-width="1"/>' + louvre(40, 64, 30, 22) + louvre(152, 64, 30, 22);
    g += '<path d="M0 100 H20 M210 100 H320" stroke="#C9B49A" stroke-width="32"/><path d="M210 84 H320" stroke="#B8A388" stroke-width="2"/>';
    g += '<path d="M60 18 Q115 26 170 18" stroke="#5A4A3A" stroke-width=".5" fill="none"/>' + flags(20, 18, 210, 18, ['#C62828', '#1F7A4A', '#F2C230', '#F4F1EA'], 6);
    g += '<path d="M0 116 H320 V200 H0 Z" fill="#C98A52"/><path d="M0 116 H320" stroke="#A9764A" stroke-width="2"/>' + earth(116, '#C98A52', 7, 0).replace('<path d="M0 116 H320 V200 H0 Z" fill="#C98A52"/>', '');
    // the orange tree on the right with fruit
    g += '<path d="M300 118 V86" stroke="#6B4A2E" stroke-width="4"/><g class="x-leaf"><circle cx="300" cy="78" r="18" fill="#3E7A34"/><circle cx="288" cy="86" r="10" fill="#4E8A40"/></g>' + [[292, 74], [306, 82], [298, 90], [310, 70]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="2.4" fill="#F28C1A"/>').join('');
    // the car that brought them, still dusty from Lagos, with boxes and a mattress tied on top
    g += '<g transform="translate(250 128)"><ellipse cy="8" rx="50" ry="4" fill="#000" opacity=".12"/><path d="M-44 0 h88 v-14 q-4 -8 -14 -8 l-10 -14 h-34 l-12 14 q-14 0 -18 8 Z" fill="#E8E2D8" stroke="#8A8478"/><path d="M-44 -6 h88" stroke="#C9A06A" stroke-width="4" opacity=".4"/><rect x="-24" y="-34" width="22" height="10" fill="#9AC0D4"/><rect x="2" y="-34" width="18" height="10" fill="#9AC0D4"/><circle cx="-26" cy="2" r="8" fill="#2A2A2A"/><circle cx="-26" cy="2" r="3" fill="#8A8A8A"/><circle cx="26" cy="2" r="8" fill="#2A2A2A"/><circle cx="26" cy="2" r="3" fill="#8A8A8A"/>' +
      '<rect x="-28" y="-46" width="44" height="10" rx="2" fill="' + CLOTH.ank[2] + '"/><rect x="-22" y="-54" width="16" height="8" fill="#C9A06A"/><rect x="-4" y="-52" width="14" height="6" fill="#E8DCC0"/><path d="M-30 -42 L18 -42 M-30 -38 L18 -38" stroke="#1E1E24" stroke-width=".5"/><circle cx="40" cy="-10" r="2" fill="#F2E08A"/></g>';
    g += hen(170, 140, 1, '#B5651D') + goat(206, 144, .9, '#5A4A3A', 1);
    // the children back from Lagos, the father, the neighbours; Nne with her arms up
    g += person(150, 150, 30, dressed(0, 3, { al: 'wave', ar: 'down' })) + person(126, 148, 28, dressed(0, 6, { al: 'clap', ar: 'clap' }));
    g += person(160, 188, 52, { kind: 'man', robe: CLOTH.ank[1], trou: '#2A2A30', hat: 'okpuf', hatc: '#1E1E24', skin: 3, al: 'hip', ar: 'clap', cls: 'sgw' });
    g += person(186, 190, 36, { kind: 'boy', robe: CLOTH.check, hat: 'hair', skin: 2, al: 'clap', ar: 'clap', cls: 'sgw' }) + person(206, 190, 34, { kind: 'woman', robe: CLOTH.ank[0], wrap: CLOTH.george[1], hat: 'braids', skin: 1, tight: 1, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += '<g class="sgopp">' + person(40, 188, 62, { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.george[0], hat: 'tie', hatc: '#B23A2E', beads: 1, skin: 2, al: 'up', ar: 'up' }) + '</g>';
    return svgBack(g);
  }
  const homecoming = {
    cls: 'sgs sg-home', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg home"><div class="hmwrap">' + homeBack() + '</div><div class="hmbag"><i></i></div><span class="hmthing"></span><div class="hmnne"></div></div>');
      const thing = st.querySelector('.hmthing'), nne = st.querySelector('.hmnne'), bag = st.querySelector('.hmbag');
      nameIt(run, done, { st, gid: 'j-dillali', wait: 1100,
        show: (w) => { thing.innerHTML = card(w); thing.className = 'hmthing'; bump(bag, 'sgshake', 600); void thing.offsetWidth; thing.classList.add('out'); },
        right: (w) => { later(run, 900, () => { thing.classList.add('nne'); }); later(run, 1600, () => nne.insertAdjacentHTML('beforeend', card(w, 'hmgot'))); knocks(run, 3, 600, 160); },
        wrong: () => { later(run, 600, () => thing.classList.add('back')); } });
    },
  };

  /* ================= Yoruba: Bojúbojú, hide and seek in the compound (Nemo hoto, tap) =================
     Four friends are hiding behind the pots, the door, the mortar and the woodpile, each holding something. Laila says a
     word; find the friend holding it: caught, they come out laughing. Wrong: that friend ducks back down. */
  const HIDES = [[13, 'pot'], [36, 'door'], [64, 'mortar'], [87, 'wood']];
  function hideBack() {
    let g = '<defs><linearGradient id="sg-bj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0F0"/><stop offset="1" stop-color="#F3E7CC"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-bj)"/>' + cloudy(60, 20, 1) + cloudy(250, 14, .8);
    // the family compound in the afternoon: rooms round the yard with zinc roofs, a shuttered window, washing on the line,
    // a mango tree throwing shade, the mothers on a bench, a goat and hens about
    g += town(46, Y, '#C9C2B0', 3);
    g += '<path d="M0 50 H320 V130 H0 Z" fill="#B8643C"/>' + weather(0, 50, 320, 80, '#4A1E0A', 6) + zinc(-4, 324, 42, 10, 6);
    [[18, '#2E5A4A'], [292, '#2E5A4A']].forEach(([x, c]) => { g += '<rect x="' + (x - 10) + '" y="66" width="20" height="18" fill="' + c + '"/><path d="M' + x + ' 66 v18" stroke="#1E3A2E" stroke-width="1"/>' + Array.from({ length: 6 }, (_, j) => '<path d="M' + (x - 10) + ' ' + (68 + j * 3) + ' h20" stroke="#1E3A2E" stroke-width=".5"/>').join(''); });
    g += '<rect x="142" y="76" width="36" height="54" fill="#5A3A22"/><path d="M144 78 q16 -6 32 0 v50 h-32 Z" fill="' + CLOTH.ank[3] + '" opacity=".9"/><path d="M160 76 v54" stroke="#3A2414" stroke-width=".8"/>';
    g += '<path d="M40 60 Q120 72 200 62" stroke="#5A4A3A" stroke-width=".5" fill="none"/>' + [[56, CLOTH.ank[0]], [76, '#F4F1EA'], [100, CLOTH.ank[4]], [124, CLOTH.adire[0]], [180, '#E8A317']].map(([x, c], k) => '<path class="x-flag" style="animation-delay:-' + k * .4 + 's" d="M' + (x - 7) + ' ' + (62 + (x - 40) * .1) + ' h14 v' + (12 + k % 2 * 4) + ' h-14 Z" fill="' + c + '"/>').join('');
    g += '<path d="M232 130 Q228 90 236 64" stroke="#5A3A22" stroke-width="5" fill="none"/>' + [[236, 52, 26, '#3E6B34'], [250, 62, 18, '#4E7E40'], [220, 64, 16, '#47753A']].map(([x, y, r, c]) => '<g class="x-leaf"><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/></g>').join('') + '<ellipse cx="226" cy="74" rx="2" ry="3" fill="#E8A317"/><ellipse cx="248" cy="70" rx="2" ry="3" fill="#C9A227"/>';
    g += '<path d="M0 130 H320 V200 H0 Z" fill="#D8A86E"/><path d="M0 130 H320" stroke="#A9764A" stroke-width="2"/><ellipse cx="236" cy="134" rx="34" ry="5" fill="#000" opacity=".1"/>';
    g += '<rect x="262" y="110" width="44" height="3" fill="#6B4226"/><path d="M266 113 v16 M302 113 v16" stroke="#4A2C14" stroke-width="2"/>' + person(274, 114, 26, dressed(Y, 0, { al: 'hip', ar: 'down', cls: 'sgw' })) + person(294, 114, 26, dressed(Y, 2, { al: 'clap', ar: 'down', flip: 1, cls: 'sgw' }));
    g += goat(18, 196, .9, '#E8E0D2') + hen(308, 196, 1.1) + hen(296, 192, .9, '#3A3A3A', 1) + '<ellipse cx="200" cy="122" rx="6" ry="4" fill="#8FA9B6" opacity=".6"/><path d="M188 128 h22 l-3 -8 h-16 Z" fill="#3E7A8E"/>';
    g += '<g class="sgopp">' + person(160, 128, 52, { kind: 'boy', robe: CLOTH.check, hat: 'hair', skin: 2, al: 'up', ar: 'up' }) + '</g>';   // the seeker, eyes covered, counting
    return svgBack(g);
  }
  const cover = { pot: '<svg viewBox="0 0 60 56"><ellipse cx="30" cy="34" rx="28" ry="21" fill="#9A5A2E"/><ellipse cx="30" cy="16" rx="16" ry="5" fill="#6E3E1C"/><path d="M6 32 q24 10 48 0" stroke="#6E3E1C" stroke-width="2" fill="none"/></svg>',
    door: '<svg viewBox="0 0 60 56"><rect x="6" y="0" width="48" height="56" fill="#6B4226"/><path d="M12 6 h36 v20 h-36 Z M12 30 h36 v22 h-36 Z" fill="none" stroke="#4A2C14" stroke-width="2"/><circle cx="46" cy="30" r="2.4" fill="#E8C060"/></svg>',
    mortar: '<svg viewBox="0 0 60 56"><path d="M8 10 h44 l-6 30 h-32 Z" fill="#8E5A2E"/><rect x="20" y="40" width="20" height="16" fill="#7A4A22"/><ellipse cx="30" cy="10" rx="22" ry="5" fill="#5A3418"/><path d="M36 10 L48 -10" stroke="#C9A06A" stroke-width="5"/></svg>',
    wood: '<svg viewBox="0 0 60 56">' + [0, 1, 2, 3, 4].map((k) => '<rect x="' + (2 + (k % 2) * 6) + '" y="' + (12 + k * 9) + '" width="52" height="8" rx="4" fill="' + (k % 2 ? '#8E6A42' : '#7A5A36') + '"/>').join('') + '</svg>' };
  const hideSeek = {
    cls: 'sgs sg-hide', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg hide">' + hideBack() + '<div class="hsrow">' + HIDES.map(([x, c], k) => '<button type="button" class="hspot" style="left:' + x + 'cqw;--k:' + k + '" aria-label="' + c + '"><span class="hsfriend"><span class="hsf"></span><span class="hsitem"></span></span><span class="hscover">' + cover[c] + '</span></button>').join('') + '</div></div>');
      const spots = [...st.querySelectorAll('.hspot')];
      findIt(run, done, { st, n: 4, lead: 1100,
        round: (set, pick) => spots.forEach((b, k) => {
          b.className = 'hspot'; b.querySelector('.hsitem').innerHTML = card(set[k]);
          b.querySelector('.hsf').innerHTML = fig({ kind: k % 2 ? 'woman' : 'boy', robe: ['#E8A317', '#7A2E5C', '#2B4C9B', '#B23A2E'][k], wrap: '#2B4C9B', hat: k % 2 ? 'braids' : 'hair', skin: k + 1, tight: 1, al: 'up', ar: 'down' });
          later(run, 150 + k * 120, () => b.classList.add('peek')); b.onclick = () => pick(b, set[k]); }),
        right: (b) => { b.classList.add('caught'); knocks(run, 3, 800, 120); },
        wrong: (b) => { b.classList.remove('peek'); b.classList.add('duck'); } });
    },
  };

  /* ================= Igbo: the wheelbarrow boys of Onitsha Main Market (Nemo hoto, tap) =================
     Wheelbarrows piled with goods are pushed past the shop, one behind the other. Laila says a word; stop the barrow that
     carries it before it is gone. Right: it is unloaded into the shop. Wrong: the boy shouts and pushes on. */
  function barrowBack() {
    let g = '<rect width="320" height="200" fill="#EADFC8"/>';
    // Onitsha Main Market: the long concrete line of lock-up shops, two storeys, each with its name board and wares
    // spilling out (bales of cloth, wrappers on rails, buckets), the wires overhead, the traders at their doors,
    // the alley churned by barrows
    g += '<rect x="0" y="0" width="320" height="22" fill="#CFC6B4"/>' + Array.from({ length: 8 }, (_, k) => louvre(6 + k * 40, 4, 26, 12)).join('') + '<rect x="0" y="20" width="320" height="3" fill="#9A9488"/>';
    const NAMES = ['EMEKA & BROS', 'NNEKA FABRICS', 'IFEANYI', 'GOD DEY', 'OBIOMA', 'CHUKWU NA'];
    for (let k = 0; k < 6; k++) { const x = k * 56; g += '<rect x="' + (x + 2) + '" y="24" width="52" height="72" fill="' + ['#C9B08A', '#BFA47E'][k % 2] + '"/>' + weather(x + 2, 24, 52, 72, '#3A2A1A', k + 1) + sign(x + 4, 26, 48, 9, NAMES[k], ['#B23A2E', '#2E4E7A', '#1F4E2E'][k % 3], '#FFFDF7', { fs: 5 }) +
      '<rect x="' + (x + 6) + '" y="38" width="44" height="58" fill="#3E2E1E"/>' + [0, 1, 2].map((j) => '<rect x="' + (x + 8 + j * 14) + '" y="40" width="12" height="' + (34 + (j % 2) * 6) + '" fill="' + [CLOTH.ank[(k + j) % 6], CLOTH.george[(k + j) % 3], CLOTH.lace[(k + j) % 2], CLOTH.isiagu[0]][(k + j) % 4] + '"/>').join('') +
      '<rect x="' + (x + 8) + '" y="84" width="16" height="12" fill="' + ['#E8A317', '#F4F1EA', '#7A2E5C', '#2E6B4A'][k % 4] + '"/><path d="M' + (x + 8) + ' 90 h16" stroke="#000" stroke-opacity=".2"/>'; }
    g += poles([28, 140, 252], 24, 4);
    g += '<path d="M0 96 H320 V200 H0 Z" fill="#9A8A6A"/><path d="M0 96 H320" stroke="#7A6A4A" stroke-width="2"/>' + '<path d="M-10 140 Q120 132 330 146 M-10 150 Q120 142 330 156" stroke="#7A6A4A" stroke-width="1.4" fill="none" stroke-dasharray="3 2" opacity=".6"/><ellipse cx="200" cy="176" rx="20" ry="3" fill="#6A7A82" opacity=".45"/>';
    g += [[60, 0], [170, 2], [230, 4]].map(([x, k]) => person(x, 100, 30, dressed(0, k, { al: 'hip', ar: k % 4 ? 'down' : 'wave', cls: 'sgw' }))).join('');
    g += chair(116, 104, .9, '#1F4E9A') + '<rect x="8" y="88" width="14" height="14" rx="2" fill="#2B4C9B"/><rect x="24" y="92" width="10" height="10" rx="2" fill="#C62828"/>';
    g += '<g class="sgopp">' + person(292, 104, 56, { kind: 'woman', robe: CLOTH.ank[1], wrap: CLOTH.george[2], hat: 'tie', hatc: '#B23A2E', skin: 2, al: 'hip', ar: 'fwd' }) + '</g>';
    return svgBack(g);
  }
  const barrowSvg = '<svg viewBox="0 0 90 50" aria-hidden="true"><path d="M8 12 h52 l-6 18 h-40 Z" fill="#7A8A96" stroke="#4A5A66" stroke-width="1.4"/><path d="M60 14 L86 30 M14 30 L10 46 M54 30 L58 44" stroke="#4A5A66" stroke-width="2.4"/><circle cx="34" cy="40" r="8" fill="#2A2A2A"/><circle cx="34" cy="40" r="3" fill="#8A8A8A"/></svg>';
  const barrows = {
    cls: 'sgs sg-barrow', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg barrow">' + barrowBack() + '<div class="bwlane"></div></div>'); const lane = st.querySelector('.bwlane');
      findIt(run, done, { st, n: 3, lead: 500,
        round: (set, pick, gone) => { lane.innerHTML = '';
          set.forEach((x, k) => { const b = h('<button type="button" class="bw" style="--k:' + k + '" aria-label="barrow"><span class="bwload">' + card(x) + '</span>' + barrowSvg + '<span class="bwboy">' + fig({ kind: 'man', robe: ['#F4F1EA', '#2E4E7A', '#1F4E2E'][k], hat: 'hair', skin: k + 2, al: 'fwd', ar: 'fwd', tight: 1 }) + '</span></button>');
            b.onclick = () => { lane.classList.add('stop'); pick(b, x); };
            b.addEventListener('animationend', (e) => { if (e.animationName === 'sg-push' && k === set.length - 1) gone(); });
            lane.appendChild(b); });
          lane.className = 'bwlane'; void lane.offsetWidth; lane.classList.add('sgo'); },
        right: (b) => { b.classList.add('unload'); knocks(run, 2, 400, 160); },
        wrong: (b) => { bump(b.querySelector('.bwboy'), 'no', 900); } });
    },
  };

  /* ================= Yoruba: Èsúsú, the women's savings meeting (Lambobi, speaking) =================
     Each member comes up to the table with her contribution. Say how much the note is: the Alájọ writes it in her card
     and drops it in the box. Wrong: the member holds on to it and goes back. */
  function esusuBack() {
    let g = '<rect width="320" height="200" fill="#F2E3C4"/>';
    // the market women's àjọ under the canopy at the end of the day: stalls behind, the collector at her table with the
    // box and the card, the members queuing with their contribution, a radio, a fan going
    g += '<path d="M0 58 H320 V150 H0 Z" fill="#E7D3AE"/>' + weather(0, 58, 320, 92, '#5A3A1E', 7);
    [[150, 'PROVISIONS', '#C62828'], [222, 'JESU NI', '#1F4E9A'], [290, 'ỌLỌ́RUN', '#1F7A4A']].forEach(([x, w, c]) => { g += sign(x - 30, 62, 60, 12, w, c, '#FFFDF7', { fs: 7 }); });
    for (let s = 0; s < 3; s++) { const x = 122 + s * 70; g += '<rect x="' + x + '" y="78" width="54" height="28" fill="#6B4226"/>' + Array.from({ length: 12 }, (_, j) => '<rect x="' + (x + 2 + (j % 6) * 8.6) + '" y="' + (80 + Math.floor(j / 6) * 13) + '" width="7" height="11" fill="' + ['#E8A317', '#C62828', '#2B4C9B', '#F4F1EA', '#1F7A4A', '#7A2E5C'][(j + s) % 6] + '"/>').join(''); }
    g += canopy(0, 60, 320, '#2E6B4A', '#FFFDF7', 40);
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#CFB68A"/><path d="M0 150 H320" stroke="#A98C5A" stroke-width="1.6"/>';
    for (let k = 0; k < 6; k++) g += person(150 + k * 26, 130, 40, Object.assign(dressed(Y, k * 2, { kind: 'woman', al: k % 2 ? 'hip' : 'fwd', ar: 'down', cls: 'sgw' + (k % 3 ? '' : ' x-idle') })));
    g += '<rect x="20" y="132" width="110" height="20" rx="3" fill="#8E5A2E"/><path d="M20 136 h110" stroke="#6B4226" stroke-width=".8"/><rect x="26" y="152" width="4" height="26" fill="#6B4226"/><rect x="120" y="152" width="4" height="26" fill="#6B4226"/>';
    g += '<rect x="86" y="118" width="30" height="16" rx="2" fill="#5A6A78" stroke="#3A4A58"/><rect x="96" y="116" width="10" height="3" fill="#2A3A48"/><rect x="70" y="124" width="12" height="9" rx="1.6" fill="#1E1E24"/><circle cx="74" cy="128" r="2.6" fill="#5A5A5A"/><path d="M80 124 l4 -8" stroke="#1E1E24" stroke-width=".6"/>';
    g += '<rect x="112" y="122" width="10" height="11" rx="1" fill="#F4F1EA" stroke="#B8AE98" stroke-width=".4"/><path d="M114 125 h6 M114 128 h6 M114 131 h4" stroke="#7A6A5A" stroke-width=".4"/>';
    g += '<g transform="translate(14 150)"><path d="M0 0 v-30" stroke="#5A5A5A" stroke-width="1.2"/><circle cx="0" cy="-34" r="7" fill="#DDE4E8" stroke="#5A5A5A" stroke-width=".8"/><g class="x-fan" style="transform-origin:50% 50%"><path d="M0 -34 l0 -6 l2 1 Z M0 -34 l5 3 l-2 1 Z M0 -34 l-5 3 l0 -2 Z" fill="#8FB0C0"/></g></g>';
    g += chair(140, 196, 1.1, '#C62828') + chair(160, 196, 1.1, '#1F4E9A') + hen(200, 196, 1) + agama(296, 52, 1, 1);
    g += '<g class="sgopp">' + person(52, 136, 58, { kind: 'woman', robe: CLOTH.lace[0], wrap: CLOTH.oke[0], ipele: CLOTH.oke[0], hat: 'gele', hatc: '#2E6B4A', beads: 1, skin: 3, al: 'fwd', ar: 'hip' }) + '</g>';
    return svgBack(g);
  }
  const esusu = {
    cls: 'sgs sg-esusu', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg esusu">' + esusuBack() + '<div class="esmem"><span class="esfig"></span><span class="esnote"></span></div><div class="escard"><b>ÀJỌ</b></div></div>');
      const mem = st.querySelector('.esmem'), nt = st.querySelector('.esnote'), fg = st.querySelector('.esfig'), cardEl = st.querySelector('.escard');
      noteSay(run, done, { st,
        show: (n, r) => { nt.innerHTML = note(n); fg.innerHTML = fig({ kind: 'woman', robe: ['#E8A317', '#7A2E5C', '#2B4C9B', '#B23A2E', '#2E6B4A', '#5A2E7A'][r], wrap: '#1E3A7A', hat: 'gele', hatc: '#E8A317', skin: r, al: 'up', ar: 'hip' });
          mem.className = 'esmem'; void mem.offsetWidth; mem.classList.add('in'); },
        right: (n) => { mem.classList.add('pay'); later(run, 900, () => { knock(1300, .05, .3); cardEl.insertAdjacentHTML('beforeend', '<i>₦' + n + '</i>'); }); later(run, 1500, () => mem.classList.add('sgo')); },
        wrong: () => { later(run, 500, () => mem.classList.add('sgo')); } });
    },
  };

  /* ================= Igbo: Ọ̀gụ́gụ́ Ego, counting the day's takings at the shop (Lambobi, speaking) =================
     Closing time at the shop. The Oga holds up each note from the day's sales; say how much it is and the apprentice adds
     it to the right pile. Wrong: the Oga frowns and puts it back in the bag. */
  function closeBack() {
    let g = '<defs><linearGradient id="sg-cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9A86A"/><stop offset="1" stop-color="#F3DDB8"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-cl)"/>';
    // closing time in the shop: the evening light through the door, shelves of bales of cloth, the bulb lit, the
    // calendar, the shutters half down, the apprentice by the counter, the Oga with the takings
    g += '<rect x="0" y="0" width="320" height="26" fill="#8E6A42"/>' + Array.from({ length: 14 }, (_, k) => '<path d="M0 ' + (2 + k * 1.8) + ' h320" stroke="#6E4E2A" stroke-width=".5"/>').join('');
    g += '<rect x="0" y="26" width="320" height="96" fill="#C9B08A"/>' + weather(0, 26, 320, 96, '#3A2A1A', 5) + [0, 1, 2].map((s) => '<rect x="0" y="' + (50 + s * 26) + '" width="320" height="3" fill="#7A4A26"/>' + Array.from({ length: 16 }, (_, k) => '<rect x="' + (4 + k * 20) + '" y="' + (32 + s * 26) + '" width="16" height="18" fill="' + [CLOTH.ank[k % 6], CLOTH.george[(k + s) % 3], CLOTH.isiagu[k % 2], CLOTH.lace[s % 2], '#B23A2E'][(k + s) % 5] + '"/><path d="M' + (4 + k * 20) + ' ' + (41 + s * 26) + ' h16" stroke="#000" stroke-opacity=".18" stroke-width=".6"/>').join('')).join('');
    g += '<path d="M160 0 v10" stroke="#3A3A3A" stroke-width=".8"/><circle cx="160" cy="13" r="3.4" fill="#FFF3C0"/><circle cx="160" cy="13" r="12" fill="#FFF3C0" opacity=".25"/>';
    g += '<path d="M0 122 H320 V200 H0 Z" fill="#9A7A56"/>' + Array.from({ length: 10 }, (_, k) => '<path d="M' + (k * 34) + ' 122 l-12 78" stroke="#8A6A46" stroke-width=".6"/>').join('') + '<rect x="60" y="138" width="200" height="16" rx="2" fill="#6B4226"/><path d="M60 142 h200" stroke="#4A2C14" stroke-width=".8"/>';
    g += '<g transform="translate(30 150)"><rect x="-12" y="-14" width="24" height="16" rx="2" fill="#2E4E7A"/><path d="M-12 -8 h24" stroke="#1E3456" stroke-width="1"/><rect x="-4" y="-17" width="8" height="3" fill="#1E3456"/></g>';
    g += '<g transform="translate(290 152)">' + [0, 1, 2].map((k) => '<rect x="-14" y="' + (-k * 6 - 6) + '" width="28" height="6" fill="' + [CLOTH.ank[3], CLOTH.george[0], CLOTH.ank[5]][k] + '"/>').join('') + '</g>';
    g += '<g class="sgopp">' + person(258, 186, 72, { kind: 'man', robe: CLOTH.isiagu[0], wrapper: CLOTH.george[1], hat: 'okpu', hatc: '#B23A2E', hatc2: '#1E1E24', skin: 3, al: 'up', ar: 'hip' }) + '</g>';
    g += person(46, 186, 56, { kind: 'boy', robe: CLOTH.ank[4], trou: '#3B4A6B', hat: 'hair', skin: 2, al: 'fwd', ar: 'fwd', cls: 'sgw x-idle' });
    return svgBack(g);
  }
  const takings = {
    cls: 'sgs sg-takings', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg takings">' + closeBack() + '<span class="tknote"></span><div class="tkpiles">' + [20, 50, 100, 200, 500, 1000].map((n) => '<span class="tkp" data-n="' + n + '"><b>₦' + n + '</b></span>').join('') + '</div></div>');
      const nt = st.querySelector('.tknote');
      noteSay(run, done, { st,
        show: (n) => { nt.innerHTML = note(n); nt.className = 'tknote'; void nt.offsetWidth; nt.classList.add('up'); },
        right: (n) => { const p = st.querySelector('.tkp[data-n="' + n + '"]'), pr = io.rect(p), nr = io.rect(nt);
          nt.style.setProperty('--tx', (pr.left + pr.width / 2 - (nr.left + nr.width / 2)) + 'px'); nt.style.setProperty('--ty', (pr.top - (nr.top + nr.height / 2)) + 'px');
          later(run, 700, () => nt.classList.add('pile')); later(run, 1500, () => { p.classList.add('has'); knock(1200, .04, .25); }); },
        wrong: () => { later(run, 500, () => nt.classList.add('back')); } });
    },
  };

  /* ================= Yoruba: the okada ride through Ibadan (Karatu, speaking) =================
     You ride pillion on the okada; at each junction a sign. Read it out loud: the rider turns and you ride on to the next.
     Wrong: he brakes, shrugs, and the next sign comes. */
  function okadaBack() {
    let g = '<defs><linearGradient id="sg-ok2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BCDDF0"/><stop offset="1" stop-color="#F1EDE0"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ok2)"/>' + cloudy(80, 24, 1.2) + cloudy(220, 14, .9) + birdsAt(150, 30, 3);
    // the brown roofs of Ibadan over the hills, Cocoa House standing up out of them, the road with its kerb and gutter,
    // a roadside shop and a woman selling oranges under her umbrella, other bikes going the other way
    g += '<path d="M0 84 Q60 54 120 66 Q180 46 240 62 Q290 50 320 58 V104 H0 Z" fill="#A9B8A0" opacity=".7"/>';
    g += '<rect x="196" y="22" width="18" height="50" fill="#E8E2D6"/>' + Array.from({ length: 10 }, (_, k) => '<path d="M196 ' + (26 + k * 4.4) + ' h18" stroke="#9AA4AA" stroke-width=".8"/>').join('') + '<rect x="202" y="16" width="6" height="6" fill="#C9C2B0"/><path d="M205 16 v-6" stroke="#5A5A5A" stroke-width=".6"/>';
    for (let k = 0; k < 24; k++) { const x = k * 14 - 4, y = 70 + (k % 4) * 6 - Math.sin(k / 3) * 10; g += '<rect x="' + (x + 1) + '" y="' + (y + 12) + '" width="13" height="' + (26 - (k % 3) * 2) + '" fill="' + ['#D9C6A2', '#CDB892', '#E2D2B2'][k % 3] + '"/><rect x="' + (x + 4) + '" y="' + (y + 16) + '" width="3" height="3" fill="#5A4A3A" opacity=".6"/>' +
      '<path d="M' + x + ' ' + (y + 14) + ' L' + (x + 7) + ' ' + y + ' L' + (x + 15) + ' ' + (y + 14) + ' Z" fill="' + ['#8E5A3A', '#A0683E', '#7A4A30'][k % 3] + '"/><path d="M' + (x + 3) + ' ' + (y + 8) + ' l3 -5" stroke="#5A3A22" stroke-width=".5" opacity=".6"/>'; }
    g += poles([30, 130, 250, 340], 104, 54);
    g += '<path d="M0 104 H320 V200 H0 Z" fill="#8C8C88"/><path d="M0 104 H320 V112 H0 Z" fill="#B8A07A"/><path d="M0 112 H320" stroke="#5A5A56" stroke-width="1.6"/>' + Array.from({ length: 18 }, (_, k) => '<rect x="' + (k * 18) + '" y="112" width="9" height="3" fill="' + (k % 2 ? '#F4F1EA' : '#1E1E24') + '"/>').join('');
    g += '<path d="M0 150 H320" stroke="#F2C230" stroke-width="2" stroke-dasharray="14 12" class="okdash"/><path d="M40 170 q20 -2 40 2 M200 182 q24 -3 50 0" stroke="#6E6E6A" stroke-width="1" fill="none"/><ellipse cx="250" cy="176" rx="14" ry="2.4" fill="#5A6A72" opacity=".4"/>';
    g += '<rect x="262" y="80" width="56" height="26" fill="#E8DCC4"/>' + zinc(258, 322, 74, 7, 3) + '<rect x="268" y="88" width="20" height="18" fill="#3A2E28"/><rect x="292" y="86" width="20" height="10" fill="#1F4E9A"/><text x="302" y="93.4" text-anchor="middle" font-size="5" font-weight="800" font-family="Arial" fill="#fff">GSM</text>';
    g += '<path d="M232 104 v-20" stroke="#5A5A5A" stroke-width=".8"/><path d="M216 86 q16 -12 32 0 Z" fill="#C62828"/><path d="M216 86 q8 -6 16 0 Z" fill="#F4F1EA"/>' + person(236, 106, 26, dressed(Y, 4, { al: 'fwd', ar: 'hip', cls: 'sgw' })) + '<path d="M224 98 q8 -6 16 0 Z" fill="#6E5A3A"/>' + [226, 230, 234, 238].map((x) => '<circle cx="' + x + '" cy="96" r="1.8" fill="#E8A317"/>').join('');
    g += '<g transform="translate(300 134) scale(-.45 .45)" opacity=".85"><circle cx="-20" cy="20" r="10" fill="#2A2A2A"/><circle cx="20" cy="20" r="10" fill="#2A2A2A"/><path d="M-20 20 L-6 4 H12 L20 20" stroke="#2B4C9B" stroke-width="4" fill="none"/></g>' + person(296, 132, 24, { kind: 'man', robe: '#C62828', hat: 'fila', hatc: '#1E1E24', skin: 4, al: 'fwd', ar: 'fwd', tight: 1, flip: 1 });
    return svgBack(g);
  }
  const okadaSvg = (s) => '<svg viewBox="0 0 120 90" aria-hidden="true"><circle cx="22" cy="72" r="14" fill="#2A2A2A"/><circle cx="22" cy="72" r="5" fill="#8A8A8A"/><circle cx="98" cy="72" r="14" fill="#2A2A2A"/><circle cx="98" cy="72" r="5" fill="#8A8A8A"/>' +
    '<path d="M22 72 L48 50 H80 L98 72 M80 50 L90 30 h10" stroke="#B23A2E" stroke-width="5" fill="none"/><rect x="44" y="42" width="40" height="10" rx="4" fill="#1E1E24"/>' +
    '<g transform="translate(44 -6)">' + person(30, 66, 70, { kind: 'man', robe: '#E8A317', hat: 'fila', hatc: '#2B4C9B', skin: s, al: 'fwd', ar: 'fwd', tight: 1 }) + '</g><g transform="translate(22 -2)">' + person(30, 62, 54, { kind: 'boy', robe: '#2E6B4A', hat: 'hair', skin: 2, al: 'fwd', ar: 'down', tight: 1 }) + '</g></svg>';
  const okada = {
    cls: 'sgs sg-okada', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg okada">' + okadaBack() + '<div class="oksign"><i></i><b class="okw"></b></div><span class="okbike">' + okadaSvg(3) + '</span></div>');
      const sign = st.querySelector('.oksign'), ww = st.querySelector('.okw'), bike = st.querySelector('.okbike');
      readAloud(run, done, { st,
        show: (t) => { ww.textContent = t; ww.className = 'okw l' + Math.min(12, Math.max(4, t.length)); sign.className = 'oksign'; bike.className = 'okbike'; void sign.offsetWidth; sign.classList.add('in'); },
        right: () => { horn(false); bike.classList.add('ride'); later(run, 600, () => sign.classList.add('past')); },
        wrong: () => { bike.classList.add('brake'); knock(120, .2, .35); later(run, 900, () => sign.classList.add('past')); } });
    },
  };

  /* ================= Igbo: the Enugu train (Karatu, speaking) =================
     The train runs down the line from Enugu; at each station its board. Read the board out loud and the train stops,
     the passengers get on and the whistle blows. Wrong: the train runs through without stopping. */
  function trainBack() {
    let g = '<defs><linearGradient id="sg-tr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9D4EC"/><stop offset="1" stop-color="#EAF2E4"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-tr)"/>' + cloudy(60, 16, 1.1) + cloudy(200, 10, .9) + birdsAt(120, 24, 4);
    // the line from Enugu through the green hills (Milliken Hill behind): hills on hills, palms, a village in the valley,
    // the station with its long roof and its name board, passengers with their loads, a woman selling oranges
    g += '<path d="M0 70 Q50 30 110 48 Q170 22 230 44 Q280 30 320 46 V120 H0 Z" fill="#8FB47A"/>' + '<path d="M0 90 Q60 50 120 76 T240 64 T320 80 V120 H0 Z" fill="#6E9A5A"/>';
    g += town(100, 0, '#C8C0A8', 9);
    g += [20, 70, 150, 230, 290].map((x, k) => '<path d="M' + x + ' 110 V80" stroke="#6B5236" stroke-width="3"/><g class="x-leaf" style="animation-delay:-' + k * .6 + 's">' + [0, 40, 90, 140, 180].map((a) => '<path d="M' + x + ' 80 q' + f1(Math.cos(-a * Math.PI / 180) * 8) + ' ' + f1(-Math.sin(a * Math.PI / 180) * 6 - 4) + ' ' + f1(Math.cos(-a * Math.PI / 180) * 14) + ' ' + f1(-Math.sin(a * Math.PI / 180) * 4 + 4) + '" stroke="#3E6B2A" stroke-width="2.6" fill="none"/>').join('') + '</g>').join('');
    g += '<path d="M0 120 H320 V200 H0 Z" fill="#B8A688"/><rect x="0" y="122" width="320" height="18" fill="#D8CDB8"/><path d="M0 140 H320" stroke="#F2C230" stroke-width="1.4"/>';
    // the station roof over the platform on the left
    g += '<path d="M30 93 v3 M80 93 v3" stroke="#5A4A3A"/><path d="M-4 94 H110 L104 102 H2 Z" fill="#8E3A2A"/>' + [8, 50, 96].map((x) => '<path d="M' + x + ' 102 V140" stroke="#5A4A3A" stroke-width="2"/>').join('') + sign(30, 84, 50, 9, 'ENUGU', '#1F4E2E', '#FFFDF7', { fs: 6.4 });
    g += '<path d="M0 150 H320 M0 160 H320" stroke="#6A6A6A" stroke-width="2.4"/>' + Array.from({ length: 32 }, (_, k) => '<rect x="' + (k * 10) + '" y="148" width="5" height="14" fill="#7A5A36"/>').join('') + Array.from({ length: 30 }, (_, k) => '<circle cx="' + ((k * 37) % 320) + '" cy="' + (166 + (k * 7) % 30) + '" r=".9" fill="#8A7A5A"/>').join('');
    // passengers waiting on the platform, their loads at their feet
    [[30, 'woman'], [52, 'man'], [72, 'boy']].forEach(([x, k], j) => { g += person(x, 136, 40, { kind: k, robe: [CLOTH.ank[1], CLOTH.isiagu[0], CLOTH.check][j], wrap: CLOTH.george[0], wrapper: k === 'man' ? CLOTH.george[2] : 0, hat: k === 'woman' ? 'tie' : (k === 'man' ? 'okpu' : 'hair'), hatc: '#B23A2E', hatc2: '#1E1E24', skin: j + 1, al: 'down', cls: 'sgw tpax' }); });
    g += '<rect x="88" y="130" width="14" height="8" rx="1" fill="' + CLOTH.check + '"/><path d="M118 138 q8 -10 16 0 Z" fill="#A0703E"/>' + [122, 126, 130].map((x) => '<circle cx="' + x + '" cy="132" r="2" fill="#F28C1A"/>').join('') + person(140, 138, 26, dressed(0, 2, { al: 'hip', ar: 'down', cls: 'sgw' }));
    return svgBack(g);
  }
  const trainSvg = '<svg viewBox="0 0 300 70" aria-hidden="true"><rect x="0" y="10" width="86" height="44" rx="6" fill="#1F4E2E"/><rect x="86" y="18" width="20" height="36" fill="#1F4E2E"/><rect x="92" y="4" width="10" height="16" fill="#2A2A2A"/>' +
    [0, 1, 2].map((k) => '<rect x="' + (10 + k * 24) + '" y="18" width="18" height="14" rx="2" fill="#CFE6F2"/>').join('') + '<rect x="110" y="14" width="90" height="40" rx="4" fill="#E8A317"/><rect x="204" y="14" width="90" height="40" rx="4" fill="#E8A317"/>' +
    [0, 1, 2].map((k) => '<rect x="' + (118 + k * 26) + '" y="22" width="18" height="14" rx="2" fill="#CFE6F2"/><rect x="' + (212 + k * 26) + '" y="22" width="18" height="14" rx="2" fill="#CFE6F2"/>').join('') +
    [20, 70, 130, 180, 224, 274].map((x) => '<circle cx="' + x + '" cy="58" r="8" fill="#2A2A2A"/>').join('') + '</svg>';
  const train = {
    cls: 'sgs sg-train', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg train">' + trainBack() + '<div class="trboard"><b class="trw"></b></div><span class="trtrain">' + trainSvg + '</span></div>');
      const board = st.querySelector('.trboard'), ww = st.querySelector('.trw'), tr = st.querySelector('.trtrain');
      readAloud(run, done, { st, ms: 3800,
        show: (t) => { ww.textContent = t; ww.className = 'trw l' + Math.min(12, Math.max(4, t.length)); board.className = 'trboard'; tr.className = 'trtrain'; st.classList.remove('boarding'); void tr.offsetWidth; tr.classList.add('come'); later(run, 50, () => board.classList.add('in')); },
        right: () => { horn(false); st.classList.add('boarding'); later(run, 1800, () => { tr.classList.add('leave'); horn(false); }); },
        wrong: () => { tr.classList.add('through'); } });
    },
  };

  /* ================= Yoruba: the pigeons of the Ọba's palace (Abubuwa, tap) =================
     Pigeons come down into the palace courtyard, each with a picture tied to its foot. Laila says a word; touch the pigeon
     with that picture and it flies up to the roof. Wrong: it flaps off. */
  function palaceBack() {
    let g = '<defs><linearGradient id="sg-pp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BCDDF0"/><stop offset="1" stop-color="#F4E7C9"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-pp)"/>' + cloudy(50, 14, 1) + cloudy(280, 22, .8);
    // the Ọba's palace: the long red wall under the great roof, carved posts (each a figure), the bronze-studded door,
    // the umbrellas of state, drummers on the veranda, the palace guard, chiefs waiting, a peacock in the yard
    g += '<path d="M0 50 H320 V124 H0 Z" fill="#C2683C"/>' + weather(0, 50, 320, 74, '#4A1E0A', 8);
    g += '<path d="M-6 52 L160 22 L326 52 Z" fill="#7A3E22"/>' + Array.from({ length: 34 }, (_, k) => '<path d="M' + (k * 10 - 6) + ' ' + (52 - Math.max(0, 30 - Math.abs(k * 10 - 166) * .18)) + ' L' + (k * 10 - 4) + ' 52" stroke="#5A2A14" stroke-width=".8"/>').join('') + '<path d="M-6 52 H326" stroke="#4A2010" stroke-width="2"/>';
    [40, 90, 230, 280].forEach((x, k) => { g += '<rect x="' + (x - 5) + '" y="52" width="10" height="72" fill="#5A3418"/>' + '<circle cx="' + x + '" cy="62" r="3.4" fill="#4A2810"/><path d="M' + (x - 4) + ' 70 h8 v14 h-8 Z M' + (x - 3) + ' 88 h6 M' + (x - 4) + ' 94 l4 6 l4 -6 M' + (x - 3) + ' 108 h6 v8 h-6 Z" fill="none" stroke="#3A1E0A" stroke-width=".8"/><circle cx="' + (x - 1.4) + '" cy="61" r=".6" fill="#E8C060"/><circle cx="' + (x + 1.4) + '" cy="61" r=".6" fill="#E8C060"/>'; });
    g += '<rect x="132" y="66" width="56" height="58" fill="#3A2210"/><rect x="136" y="70" width="48" height="54" fill="#4A2C14"/><path d="M140 74 h40 v46 h-40 Z M160 74 v46" fill="none" stroke="#2A1408" stroke-width="2"/>' + Array.from({ length: 12 }, (_, k) => '<circle cx="' + (146 + (k % 3) * 6 + (k > 5 ? 22 : 0) - (k > 5 ? 0 : 0)) + '" cy="' + (82 + Math.floor((k % 6) / 3) * 26) + '" r="1.4" fill="#C9A23A"/>').join('');
    g += '<path d="M132 66 Q160 52 188 66" stroke="#E8C060" stroke-width="2" fill="none"/>';
    g += flags(0, 54, 120, 54, ['#F2C230', '#C62828', '#1F7A4A'], 6) + flags(200, 54, 320, 54, ['#F2C230', '#C62828', '#1F7A4A'], 6);
    // umbrellas of state either side of the door
    [[112, '#C62828'], [208, '#7A2E5C']].forEach(([x, c]) => { g += '<path d="M' + x + ' 124 V70" stroke="#5A3A22" stroke-width="1.4"/><path d="M' + (x - 16) + ' 74 Q' + x + ' 56 ' + (x + 16) + ' 74 Z" fill="' + c + '"/>' + Array.from({ length: 7 }, (_, j) => '<path d="M' + (x - 15 + j * 5) + ' 74 v5" stroke="#E8C060" stroke-width="1.6"/>').join('') + '<circle cx="' + x + '" cy="62" r="2" fill="#E8C060"/>'; });
    g += '<path d="M0 124 H320 V200 H0 Z" fill="#D8B07A"/><path d="M0 124 H320 V132 H0 Z" fill="#B88A5A"/><path d="M0 124 H320" stroke="#A9764A" stroke-width="2"/>';
    // the drummers sit on the veranda edge; the chiefs wait by the posts
    [[64, '#5A3A22'], [80, '#7A4A26']].forEach(([x, c], k) => { g += '<path d="M' + (x - 4) + ' 126 q4 -14 8 0 Z" fill="' + c + '"/><path d="M' + (x - 4) + ' 118 h8" stroke="#E8DFC8" stroke-width=".6"/>' + person(x, 128, 30, { kind: 'man', robe: k ? CLOTH.oke[2] : '#F4F1EA', hat: 'fila', hatc: '#C62828', skin: k + 2, al: 'play', ar: 'fwd', tight: 1, cls: 'sgw x-idle' }); });
    g += person(252, 128, 40, { kind: 'man', robe: '#E8DFC8', agbada: CLOTH.oke[0], hat: 'fila', hatc: '#2B4C9B', skin: 4, al: 'hip', ar: 'down', cls: 'sgw', flip: 1 });
    g += '<g transform="translate(250 178) scale(.8)"><path d="M0 0 q-18 -6 -30 -24 q14 6 30 14 Z" fill="#1F7A6A"/>' + [0, 1, 2, 3].map((j) => '<circle cx="' + (-8 - j * 6) + '" cy="' + (-4 - j * 5) + '" r="1.6" fill="#E8C060"/>').join('') + '<ellipse cx="2" cy="-4" rx="6" ry="4" fill="#2B4C9B"/><path d="M6 -6 q2 -8 0 -12" stroke="#2B4C9B" stroke-width="2" fill="none"/><path d="M6 -18 l-1 -3 M6 -18 l1 -3" stroke="#2B4C9B" stroke-width=".5"/><path d="M0 0 v4 M4 0 v4" stroke="#8E7A5A" stroke-width=".7"/></g>';
    g += '<g class="sgopp">' + person(292, 128, 60, { kind: 'man', robe: '#F4EBD0', agbada: CLOTH.lace[0], hat: 'ade', hatc: '#E8C060', beads: 1, skin: 2, al: 'staff', ar: 'hip' }) + '</g>';
    g += person(26, 130, 50, { kind: 'man', robe: '#B23A2E', hat: 'fila', hatc: '#B23A2E', skin: 3, al: 'fwd', ar: 'down', cls: 'sgw' });
    return svgBack(g);
  }
  const pigeon = '<svg viewBox="0 0 60 44" aria-hidden="true"><ellipse cx="28" cy="26" rx="18" ry="12" fill="#B8BCC8"/><circle cx="44" cy="16" r="8" fill="#9AA0B0"/><path d="M50 16 l7 2 -7 2 Z" fill="#E8A317"/><circle cx="46" cy="14" r="1.4" fill="#1E1E24"/>' +
    '<path class="pgw" d="M18 22 Q26 2 40 18 Z" fill="#8E94A4"/><path d="M10 26 L0 20 L4 30 Z" fill="#7A8090"/><path d="M26 38 v5 M32 38 v5" stroke="#C0584A" stroke-width="2"/><path d="M36 22 q4 4 10 0" stroke="#5E9A7A" stroke-width="2" fill="none"/></svg>';
  const pigeons = {
    cls: 'sgs sg-pigeon', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg pigeon">' + palaceBack() + '<div class="pgyard"></div></div>'); const yard = st.querySelector('.pgyard');
      findIt(run, done, { st, n: 4, lead: 1200,
        round: (set, pick) => { yard.innerHTML = '';
          set.forEach((x, k) => { const b = h('<button type="button" class="pg" style="--k:' + k + ';left:' + (10 + k * 21) + 'cqw" aria-label="pigeon"><span class="pgb">' + pigeon + '</span>' + card(x) + '</button>'); b.onclick = () => pick(b, x); yard.appendChild(b); }); },
        right: (b) => { b.classList.add('roof'); knocks(run, 3, 900, 90); },
        wrong: (b) => { b.classList.add('flap'); } });
    },
  };

  /* ================= Igbo: the udara tree (Abubuwa, tap) =================
     The children shake the udara tree and the ripe fruits drop, each with a picture. Laila says a word; catch the fruit
     with that picture before it reaches the ground: it goes in the basket. Wrong: it rolls away. */
  function udaraBack() {
    let g = '<defs><linearGradient id="sg-ud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6E2EE"/><stop offset=".5" stop-color="#D8ECC8"/><stop offset="1" stop-color="#F1E8CC"/></linearGradient>' +
      '<radialGradient id="sg-uds" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#sg-ud)"/>';
    // the udara tree in the middle of the compound in the dry season: the houses behind, the far bush, the huge crown
    // heavy with orange fruit, light coming through, its deep shade where the family sits; children shaking a branch
    g += '<path d="M0 150 Q80 130 160 140 T320 134 V170 H0 Z" fill="#9AB37A" opacity=".7"/>' + '<rect x="6" y="134" width="70" height="36" fill="#E8D7B0"/>' + zinc(2, 80, 128, 7, 2) + louvre(14, 144, 18, 12) + '<rect x="48" y="146" width="14" height="24" fill="#5A3A1E"/>';
    g += '<rect x="244" y="138" width="70" height="32" fill="#C2683C"/>' + zinc(240, 318, 132, 7, 5) + louvre(280, 146, 18, 12) + '<rect x="254" y="148" width="14" height="22" fill="#4A2A10"/>';
    g += '<path d="M150 200 Q144 120 160 60" stroke="#6B4A2E" stroke-width="16" fill="none"/><path d="M154 200 Q150 120 162 64" stroke="#000" stroke-width="5" opacity=".18" fill="none"/>' + '<path d="M156 110 Q120 90 90 80 M160 96 Q200 80 236 74 M158 80 Q140 60 110 52" stroke="#6B4A2E" stroke-width="6" fill="none" stroke-linecap="round"/>';
    g += '<g class="x-leaf"><ellipse cx="160" cy="44" rx="170" ry="44" fill="#3E7A34"/><ellipse cx="80" cy="34" rx="70" ry="26" fill="#4E8E40"/><ellipse cx="250" cy="38" rx="70" ry="26" fill="#4E8E40"/><ellipse cx="160" cy="20" rx="60" ry="18" fill="#5A9A4A"/>' +
      Array.from({ length: 30 }, (_, k) => '<ellipse cx="' + ((k * 61) % 320) + '" cy="' + (14 + (k * 23) % 64) + '" rx="7" ry="3.6" fill="' + (k % 3 ? '#2E6A2A' : '#68A858') + '" opacity=".75" transform="rotate(' + ((k * 41) % 60 - 30) + ' ' + ((k * 61) % 320) + ' ' + (14 + (k * 23) % 64) + ')"/>').join('') + '</g>';
    [[60, 60], [120, 70], [200, 66], [260, 58], [96, 48], [230, 46], [30, 50], [290, 46], [176, 76], [140, 30]].forEach(([x, y]) => { g += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="#E89A2A"/><circle cx="' + (x - 2) + '" cy="' + (y - 2) + '" r="2" fill="#FFD27A" opacity=".7"/><path d="M' + x + ' ' + (y - 6) + ' v-3" stroke="#5A3A22" stroke-width=".8"/>'; });
    g += '<path d="M0 170 H320 V200 H0 Z" fill="#B8925A"/><ellipse cx="160" cy="176" rx="110" ry="10" fill="url(#sg-uds)"/>' + Array.from({ length: 14 }, (_, k) => '<ellipse cx="' + ((k * 53) % 320) + '" cy="' + (176 + (k * 7) % 22) + '" rx="3" ry="1.2" fill="#8E6A3A" opacity=".6" transform="rotate(' + (k * 23 % 40 - 20) + ' ' + ((k * 53) % 320) + ' ' + (176 + (k * 7) % 22) + ')"/>').join('');
    g += '<circle cx="214" cy="188" r="4" fill="#E89A2A"/><circle cx="220" cy="191" r="3" fill="#C98A2A"/>';
    // a mat for the fruit already gathered, a goat in the shade
    g += '<rect x="194" y="182" width="40" height="5" rx="2" fill="#C9A85A"/>' + goat(256, 194, 1, '#E8E0D2', 1);
    g += '<g class="sgopp">' + person(40, 196, 46, { kind: 'boy', robe: CLOTH.check, trou: '#3B4A6B', hat: 'hair', skin: 2, al: 'up', ar: 'up' }) + '</g>' + person(288, 196, 44, { kind: 'woman', robe: CLOTH.ank[0], wrap: CLOTH.george[1], hat: 'braids', skin: 1, tight: 1, al: 'clap', ar: 'clap', cls: 'sgw' });
    return svgBack(g);
  }
  const udara = {
    cls: 'sgs sg-udara', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg udara">' + udaraBack() + '<div class="udfall"></div><span class="udbask"></span></div>'); const fall = st.querySelector('.udfall');
      findIt(run, done, { st, n: 4, lead: 500,
        round: (set, pick, gone) => { fall.innerHTML = ''; fall.className = 'udfall';
          set.forEach((x, k) => { const b = h('<button type="button" class="ud" style="--k:' + k + ';left:' + (12 + k * 20) + 'cqw" aria-label="udara"><i class="udf"></i>' + card(x) + '</button>'); b.onclick = () => { fall.classList.add('stop'); pick(b, x); };
            b.addEventListener('animationend', (e) => { if (e.animationName === 'sg-drop2' && k === set.length - 1) gone(); }); fall.appendChild(b); });
          void fall.offsetWidth; fall.classList.add('sgo'); },
        right: (b) => { b.classList.add('caught'); knock(600, .06, .3); },
        wrong: (b) => { b.classList.add('roll'); } });
    },
  };

  return Y ? { 'j-rubutu': ayo, 'j-allo': door, 'j-karatu': regatta, 'j-shayi': foodStall, 'j-rini': adire, 'j-gyada': cocoa, 'j-shanu': asoOke, 'j-garke': owambe, 'j-rubutu-say': naHouse, 'j-marubuci': signWriter, 'j-ruwa': newsStand,
      'j-durbar': igba, 'j-magana': alo, 'j-dillali': eru, 'j-nemo': hideSeek, 'j-suya': esusu, 'j-jirgi': okada, 'j-abubuwa': pigeons }
    : { 'j-rubutu': aka, 'j-allo': uli, 'j-karatu': lorries, 'j-shayi': foodStall, 'j-rini': akwete, 'j-gyada': palmOil, 'j-shanu': abaShoes, 'j-garke': iriJi, 'j-rubutu-say': kola, 'j-marubuci': printer, 'j-ruwa': mgba,
      'j-durbar': egwuOnwa, 'j-magana': nolly, 'j-dillali': homecoming, 'j-nemo': barrows, 'j-suya': takings, 'j-jirgi': train, 'j-abubuwa': udara };
}
