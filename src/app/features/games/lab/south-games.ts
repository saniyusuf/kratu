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

export function southGames(c: any, L: 'yo' | 'ig'): Record<string, any> {
  const { K, h, say, shuffle, micBox, line, F, io, LW, txt, spoken, letters, gaps, secs } = c;
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
  const svgBack = (inner) => '<svg class="sgback" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + inner + '</svg>';

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
    let g = '<defs><linearGradient id="sg-rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE3F4"/><stop offset="1" stop-color="#E4F2F7"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-rg)"/>';
    // Lagos Island across the lagoon: towers, the long bridge
    [[150, 30], [162, 44], [176, 36], [190, 52], [206, 40], [222, 30], [236, 46], [252, 34]].forEach(([x, hh], k) => { g += '<rect x="' + x + '" y="' + (62 - hh) + '" width="12" height="' + hh + '" fill="' + (k % 2 ? '#9AAAB6' : '#B4C2CC') + '"/>' + Array.from({ length: Math.floor(hh / 6) }, (_, j) => '<path d="M' + (x + 2) + ' ' + (64 - hh + j * 6) + ' h8" stroke="#E8F0F4" stroke-width="1" opacity=".7"/>').join(''); });
    g += '<path d="M0 58 Q80 54 140 60 L320 56" stroke="#8C98A2" stroke-width="2.4" fill="none"/>' + Array.from({ length: 14 }, (_, k) => '<path d="M' + (k * 24) + ' 58 v6" stroke="#8C98A2" stroke-width="1.4"/>').join('');
    g += water(62, 138, '#3E9CC4', '#CFEFFA');
    // the near shore at the left: the spectators' stand under canopies, drummers, flags
    g += '<path d="M0 62 Q30 60 60 64 L72 92 Q40 98 0 96 Z" fill="#D8B07A"/>';
    g += canopy(2, 84, 58, '#E8A317', '#FFFDF7', 18);
    [8, 18, 28, 38, 48].forEach((x, k) => { g += person(x, 88, 22, k % 2 ? { kind: 'woman', robe: ['#2B4C9B', '#C62828', '#7A2E5C'][k % 3], wrap: '#1E3A7A', hat: 'gele', hatc: ['#E8A317', '#2B4C9B', '#C62828'][k % 3], skin: k, al: 'wave', cls: 'sgw' } : { kind: 'man', robe: '#F4EBD0', agbada: ['#2E7D5A', '#1F3A78', '#7A2E5C'][k % 3], hat: 'fila', hatc: '#7A2E5C', skin: k, ar: 'wave', cls: 'sgw' }); });
    g += flag(64, 90, 22, '#2E7D32', '#FFFFFF');
    // the finish: a line of buoys and bunting at the right
    g += bunting(282, 70, 316, 66, ['#C62828', '#E8A317', '#2E7D32', '#2B4C9B'], 3) + Array.from({ length: 6 }, (_, k) => '<circle cx="' + (288 + (k % 2) * 3) + '" cy="' + (78 + k * 20) + '" r="2.6" fill="#E8A317" stroke="#B5651D"/>').join('') + '<path d="M288 74 V200" stroke="#FFFDF7" stroke-width=".8" stroke-dasharray="3 3" opacity=".8"/>';
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
    let g = '<defs><linearGradient id="sg-iw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8E6EE"/><stop offset="1" stop-color="#F1E6D2"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-iw)"/>';
    // the park: a long zinc-roofed shed of booking offices, the UPPER IWEKA sign, the flyover behind
    g += '<path d="M0 34 H320 V40 H0 Z" fill="#8C98A2"/>' + Array.from({ length: 9 }, (_, k) => '<rect x="' + (12 + k * 38) + '" y="40" width="5" height="22" fill="#9AA6AE"/>').join('');
    g += '<path d="M0 62 L320 58 L320 66 L0 70 Z" fill="#A8B2B8"/><path d="M0 70 H320 V96 H0 Z" fill="#E8D8B8"/>';
    for (let k = 0; k < 7; k++) { const x = 4 + k * 46; g += '<rect x="' + x + '" y="72" width="40" height="24" fill="' + ['#2E7D5A', '#C62828', '#2B4C9B', '#E8A317'][k % 4] + '" opacity=".85"/><rect x="' + (x + 4) + '" y="76" width="32" height="7" fill="#FFFDF7"/><rect x="' + (x + 12) + '" y="85" width="16" height="11" fill="#3E2E1A"/>'; }
    g += '<rect x="96" y="20" width="128" height="16" rx="2" fill="#1F4E2E"/><text x="160" y="31.6" text-anchor="middle" font-size="9" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="#FFFDF7">UPPER IWEKA PARK</text>';
    g += '<path d="M0 96 H320 V200 H0 Z" fill="#C9AE84"/><path d="M0 96 H320" stroke="#A88E64" stroke-width="2"/>';
    // the crowd of the park: a trader with her head-load, a loader in a singlet, a man in isiagu and red cap, a keke
    g += person(18, 120, 34, { kind: 'woman', robe: '#F4F1EA', wrap: '#8E1B2A', hat: 'tie', hatc: '#1F6B4A', skin: 1, al: 'load', load: '<ellipse rx="8" ry="2.6" fill="#C62828"/><path d="M-6 -2 Q0 -6 6 -2" fill="#E8A317"/>', cls: 'sgw' });
    g += person(300, 120, 36, { kind: 'man', robe: '#1E1E24', wrapper: '#B71C1C', hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', skin: 3, ar: 'wave', cls: 'sgw' });
    g += keke(278, 118, 1.6);
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
    // the street behind: a row of shops with their signs, a rusty zinc roof line, the morning sun low
    g += '<circle cx="270" cy="40" r="16" fill="#FFE7A3" opacity=".9"/>';
    const SIG = Y ? ['IYA BOLA STORES', 'GOD\'S TIME', 'ALHAJA PROVISIONS'] : ['CHIDI & SONS', 'ONYE AYALA', 'NNE OKPA VENDOR'];
    for (let k = 0; k < 3; k++) { const x = 4 + k * 106; g += '<rect x="' + x + '" y="34" width="100" height="56" fill="' + ['#E9D7B4', '#D9C8E4', '#CFE3D4'][k] + '"/><path d="M' + (x - 2) + ' 34 L' + (x + 102) + ' 30 L' + (x + 102) + ' 36 L' + (x - 2) + ' 40 Z" fill="#8E6A4A"/>' +
      '<rect x="' + (x + 8) + '" y="42" width="84" height="11" fill="' + ['#C62828', '#1F3A78', '#2E7D5A'][k] + '"/><text x="' + (x + 50) + '" y="50.4" text-anchor="middle" font-size="6.4" font-weight="800" font-family="Arial,sans-serif" fill="#FFFDF7">' + SIG[k] + '</text>' +
      '<rect x="' + (x + 36) + '" y="60" width="28" height="30" fill="#4A3424"/>'; }
    g += '<path d="M0 90 H320 V200 H0 Z" fill="#C9A274"/><path d="M0 90 H320" stroke="#9C7A52" stroke-width="2"/><path d="M0 98 H320" stroke="#B48C60" stroke-width="1" opacity=".5"/>';
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
    let g = '<defs><linearGradient id="sg-ad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4EEF4"/><stop offset="1" stop-color="#F3E7CC"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ad)"/>';
    // the market lane of Itoku: lines of adire hung to dry, in every blue
    for (let row = 0; row < 2; row++) { const y = 18 + row * 26; g += '<path d="M0 ' + y + ' Q160 ' + (y + 6) + ' 320 ' + y + '" stroke="#6B4226" stroke-width="1" fill="none"/>';
      for (let k = 0; k < 11; k++) { const x = 4 + k * 29 + row * 12, c = ['#1E3A7A', '#2B4C9B', '#163060', '#3A5DA8'][(k + row) % 4];
        g += '<path d="M' + x + ' ' + (y + 2) + ' h22 v' + (20 - row * 4) + ' q-11 3 -22 0 Z" fill="' + c + '"/>' + [0, 1, 2].map((j) => '<circle cx="' + (x + 5 + j * 6) + '" cy="' + (y + 8 + (j % 2) * 5) + '" r="2" fill="none" stroke="#C9D8F0" stroke-width=".8"/>').join(''); } }
    g += '<path d="M0 96 H320 V200 H0 Z" fill="#C9AE84"/><path d="M0 96 H320" stroke="#A88E64" stroke-width="2"/>';
    // the indigo pots sunk in the ground, a dyer bent over one, a woman selling folded cloth
    [[22, 176], [62, 184], [262, 182]].forEach(([x, y]) => { g += '<ellipse cx="' + x + '" cy="' + y + '" rx="16" ry="5" fill="#7A4A26"/><ellipse cx="' + x + '" cy="' + y + '" rx="13" ry="3.6" fill="#0E1E44"/>'; });
    g += person(36, 168, 66, { kind: 'woman', robe: '#2B4C9B', wrap: '#163060', hat: 'gele', hatc: '#3A5DA8', skin: 2, al: 'fwd', ar: 'fwd', cls: 'sgw' });
    g += '<g class="sgopp">' + person(290, 170, 70, { kind: 'woman', robe: '#E8A317', wrap: '#1E3A7A', wrap2: '#3A5DA8', hat: 'gele', hatc: '#1E3A7A', beads: 1, skin: 3, al: 'hip', ar: 'hold' }) + '</g>';
    g += '<g transform="translate(268 184)">' + [0, 1, 2, 3].map((k) => '<rect x="-12" y="' + (-k * 4) + '" width="24" height="4" rx="1" fill="' + ['#1E3A7A', '#2B4C9B', '#163060', '#3A5DA8'][k] + '"/>').join('') + '</g>';
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
    let g = '<defs><linearGradient id="sg-aw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EADCC8"/><stop offset="1" stop-color="#F3E7D2"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-aw)"/>';
    // the weaving shed: a thatched roof on posts, other looms with cloth in progress, the women of Akwete at work
    g += '<path d="M0 0 H320 V24 Q160 34 0 24 Z" fill="#B8925A"/>' + Array.from({ length: 40 }, (_, k) => '<path d="M' + (k * 8) + ' 0 L' + (k * 8 + 3) + ' 28" stroke="#8E6A3A" stroke-width="1" opacity=".6"/>').join('');
    [[30, '#B23A2E'], [280, '#1F4E2E']].forEach(([x, c]) => { g += '<rect x="' + (x - 22) + '" y="40" width="4" height="90" fill="#6B4226"/><rect x="' + (x + 18) + '" y="40" width="4" height="90" fill="#6B4226"/><rect x="' + (x - 22) + '" y="40" width="44" height="4" fill="#6B4226"/>' +
      Array.from({ length: 10 }, (_, k) => '<path d="M' + (x - 16 + k * 4) + ' 44 V100" stroke="#E8DCC0" stroke-width=".8"/>').join('') + [0, 1, 2, 3].map((k) => '<rect x="' + (x - 18) + '" y="' + (100 + k * 6) + '" width="36" height="6" fill="' + [c, '#E8A317', '#1E1E24', '#F4F1EA'][k] + '"/>').join(''); });
    g += '<path d="M0 132 H320 V200 H0 Z" fill="#B48A5A"/><path d="M0 132 H320" stroke="#8E6A3A" stroke-width="2"/>';
    g += person(30, 172, 58, { kind: 'woman', robe: '#F4F1EA', wrap: '#B23A2E', hat: 'tie', hatc: '#E8A317', skin: 1, al: 'fwd', ar: 'fwd', cls: 'sgw' });
    g += '<g class="sgopp">' + person(292, 176, 72, { kind: 'woman', robe: '#E8A317', wrap: '#1F4E2E', wrap2: '#B23A2E', hat: 'tie', hatc: '#B23A2E', beads: 1, skin: 3, al: 'hold', ar: 'hip' }) + '</g>';
    g += '<g transform="translate(262 186)">' + [0, 1, 2].map((k) => '<rect x="-14" y="' + (-k * 5) + '" width="28" height="5" rx="1" fill="' + ['#B23A2E', '#1F4E2E', '#E8A317'][k] + '"/>').join('') + '</g>';
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
    const sky = '<defs><linearGradient id="sg-ay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7D9A6"/><stop offset="1" stop-color="#F3E3C0"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ay)"/>';
    // the compound: red-earth wall, a veranda roof on carved posts, a doorway, a mango tree's shade
    let g = sky + '<path d="M0 46 H320 V120 H0 Z" fill="#B8643C"/><path d="M0 46 H320 V52 H0 Z" fill="#8E4A2A"/><path d="M0 30 L320 30 L320 50 L0 50 Z" fill="#6E5A44"/>';
    for (let x = 6; x < 320; x += 10) g += '<path d="M' + x + ' 30 V50" stroke="#5A4836" stroke-width="1.2" opacity=".6"/>';
    [22, 104, 216, 298].forEach((x) => { g += '<rect x="' + (x - 3.5) + '" y="50" width="7" height="70" fill="#7A4A26"/>' + [0, 1, 2, 3].map((k) => '<path d="M' + (x - 3.5) + ' ' + (60 + k * 15) + ' q3.5 -5 7 0" stroke="#4A2C14" stroke-width="1" fill="none"/>').join('') + '<ellipse cx="' + x + '" cy="' + (66 + 0) + '" rx="2" ry="3" fill="#4A2C14" opacity=".6"/>'; });
    g += '<rect x="140" y="64" width="40" height="56" rx="2" fill="#3E2614"/><path d="M144 68 h32 v48 h-32 Z" fill="#5A3A1E"/>';
    g += '<path d="M0 120 H320 V200 H0 Z" fill="#D8A86E"/><path d="M0 120 H320" stroke="#A9764A" stroke-width="2"/><ellipse cx="160" cy="168" rx="150" ry="20" fill="#B88350" opacity=".35"/>';
    // the watchers along the wall: an elder in agbada, women in gele and ìró, a boy
    g += person(36, 124, 46, { kind: 'woman', robe: '#2B4C9B', wrap: '#1E3A7A', hat: 'gele', hatc: '#E8A317', skin: 1, al: 'hip', cls: 'sgw' });
    g += person(62, 124, 50, { kind: 'man', robe: '#F4EBD0', agbada: '#7A2E5C', hat: 'fila', hatc: '#7A2E5C', skin: 3, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += person(262, 124, 44, { kind: 'woman', robe: '#E8A317', wrap: '#7A2E5C', hat: 'gele', hatc: '#7A2E5C', beads: 1, skin: 4, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += person(284, 124, 34, { kind: 'boy', robe: '#2E7D5A', hat: 'hair', skin: 2, cls: 'sgw' });
    // your opponent, seated on a low stool across the board: an elder (a woman for a girl)
    g += '<g class="sgopp">' + person(214, 114, 66, F ? { kind: 'woman', robe: '#F2C230', wrap: '#5A2E7A', hat: 'gele', hatc: '#5A2E7A', beads: 1, skin: 2, al: 'hold', ar: 'hold', tight: 1 }
      : { kind: 'man', robe: '#F4EBD0', agbada: '#1F3A78', hat: 'gobi', hatc: '#1F3A78', beard: 'w', skin: 2, al: 'hold', ar: 'hold' }) + '</g>';
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
    // a bead seller's table at Onitsha: a cloth-covered table, the strings of coral hung on a rail, the chief waiting
    g += '<rect x="0" y="0" width="320" height="22" fill="#7A2E1E"/><path d="M0 22 H320" stroke="#4A1A10" stroke-width="2"/>';
    for (let k = 0; k < 16; k++) { const x = 12 + k * 20; g += '<path d="M' + x + ' 22 Q' + (x + 8) + ' ' + (44 + (k % 3) * 6) + ' ' + (x + 16) + ' 22" stroke="#C93A18" stroke-width="2.6" fill="none" stroke-dasharray="2.4 1.2" opacity=".85"/>'; }
    g += '<path d="M0 138 H320 V200 H0 Z" fill="#1F4E2E"/><path d="M0 138 H320 V146 H0 Z" fill="#E8A317"/><path d="M0 142 H320" stroke="#B23A2E" stroke-width="2" stroke-dasharray="6 4"/>';
    g += person(26, 136, 48, { kind: 'woman', robe: '#F4F1EA', wrap: '#8E1B2A', hat: 'tie', hatc: '#1F6B4A', beads: 1, skin: 1, al: 'hip', cls: 'sgw' });
    g += person(52, 136, 40, { kind: 'woman', robe: '#E8A317', wrap: '#1F4E2E', hat: 'braids', skin: 4, tight: 1, cls: 'sgw' });
    // the one who will wear it: a titled man in red cap and white (a bride in george and head-tie for a girl)
    g += '<g class="sgopp">' + person(276, 140, 92, F ? { kind: 'woman', robe: '#F4F1EA', wrap: '#B23A2E', wrap2: '#E8A317', hat: 'tie', hatc: '#E8A317', skin: 2, al: 'hip', ar: 'hip' }
      : { kind: 'man', robe: '#F4F1EA', wrapper: '#B23A2E', hat: 'okpuf', hatc: '#B71C1C', hatc2: '#1E1E24', skin: 2, al: 'staff', ar: 'hip' }) + '</g>';
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
    let g = '<rect width="320" height="200" fill="#E9D3A8"/><rect x="0" y="0" width="320" height="34" fill="#9C2F22"/><path d="M0 34 H320" stroke="#5E1A10" stroke-width="3"/>';
    g += '<rect x="0" y="34" width="320" height="130" fill="#D9BC8C"/><path d="M0 164 H320 V200 H0 Z" fill="#C49A62"/>';
    // the palace verandah posts, carved with figures, either side
    [[30, 1], [290, -1]].forEach(([x]) => { g += '<rect x="' + (x - 7) + '" y="34" width="14" height="130" fill="#7A4A26"/>' + [0, 1, 2].map((k) => '<g transform="translate(' + (x - 7) + ' ' + (44 + k * 40) + ') scale(.24)" style="filter:sepia(1) saturate(1.4) brightness(.62)">' + person(30, 134, 120, { kind: k === 1 ? 'woman' : 'man', robe: '#999', wrap: '#777', hat: k === 1 ? 'gele' : 'fila', hatc: '#888', skin: k }) + '</g>').join(''); });
    // the carver, his adze over his shoulder; the guards' tall fila
    g += '<g class="sgopp">' + person(258, 176, 78, F ? { kind: 'woman', robe: '#E8A317', wrap: '#5A2E7A', hat: 'gele', hatc: '#5A2E7A', skin: 3, ar: 'hold', al: 'hip', tight: 1 }
      : { kind: 'man', robe: '#C9B48A', trou: '#6E5A3A', hat: 'fila', hatc: '#7A2E5C', skin: 3, ar: 'hold', al: 'hip' }) + '</g>';
    g += person(52, 176, 64, { kind: 'man', robe: '#F4EBD0', agbada: '#C62828', hat: 'gobi', hatc: '#C62828', skin: 1, ar: 'staff', cls: 'sgw' });
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
    let g = '<rect width="320" height="200" fill="#C8784A"/><rect x="0" y="0" width="320" height="22" fill="#6E5A3A"/>';
    for (let x = 0; x < 320; x += 6) g += '<path d="M' + x + ' 0 L' + (x + 4) + ' 22" stroke="#4E3E26" stroke-width="1" opacity=".5"/>';
    // the uli frieze already painted along the foot of the wall, faint with age
    g += '<g stroke="#2A160A" stroke-width="1.4" fill="none" opacity=".35">' + Array.from({ length: 12 }, (_, k) => '<path transform="translate(' + (k * 28 - 4) + ' 132) scale(.45)" d="' + ULI[k % ULI.length] + '"/>').join('') + '<path d="M0 130 H320 M0 156 H320"/></g>';
    g += '<path d="M0 22 H320" stroke="#3E2E1A" stroke-width="3"/><path d="M0 160 H320 V200 H0 Z" fill="#A85A34"/><path d="M0 160 H320" stroke="#7A3A1E" stroke-width="2"/>';
    // the painter, her calabash of uli dye and brush; a girl watching; an elder by the obi
    g += '<g class="sgopp">' + person(276, 182, 78, { kind: 'woman', robe: '#F4F1EA', wrap: '#1F4E2E', wrap2: '#E8A317', hat: 'tie', hatc: '#B23A2E', beads: 1, skin: 2, ar: 'up', al: 'hold' }) + '</g>';
    g += '<g transform="translate(250 176)"><ellipse rx="10" ry="4" fill="#5A3A1E"/><path d="M-10 0 Q0 10 10 0 Z" fill="#7A4A22"/><ellipse rx="8" ry="2.6" fill="#1E140C"/></g>';
    g += person(36, 182, 52, { kind: 'woman', robe: '#E8A317', wrap: '#B23A2E', hat: 'braids', skin: 4, tight: 1, cls: 'sgw' });
    g += person(60, 182, 66, { kind: 'man', robe: '#F4F1EA', wrapper: '#1F4E2E', hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', beard: 'w', beads: 1, skin: 1, ar: 'staff', cls: 'sgw' });
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
    let g = '<defs><linearGradient id="sg-kk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC48A"/><stop offset="1" stop-color="#D9E6B8"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-kk)"/>';
    // the tall forest trees whose shade the cocoa needs
    [[14, '#3E6B34'], [230, '#47753A'], [300, '#3A6330']].forEach(([x, c]) => { g += '<rect x="' + (x - 4) + '" y="10" width="8" height="160" fill="#5A4430"/><ellipse cx="' + x + '" cy="18" rx="44" ry="22" fill="' + c + '"/>'; });
    g += '<path d="M0 170 H320 V200 H0 Z" fill="#7A5A36"/><path d="M0 170 Q80 164 160 170 T320 170" stroke="#5A4026" stroke-width="2" fill="none"/>';
    for (let k = 0; k < 26; k++) g += '<ellipse cx="' + (6 + k * 12.4) + '" cy="' + (176 + (k % 3) * 6) + '" rx="5" ry="2" fill="#B07A3A" opacity=".7"/>';   // dry leaves
    // the cocoa tree: a short trunk and wide low branches, big leaves at the top
    const br = (a, b) => '<path d="M' + a[0] + ' ' + a[1] + ' Q' + ((a[0] + b[0]) / 2) + ' ' + (Math.min(a[1], b[1]) - 6) + ' ' + b[0] + ' ' + b[1] + '" stroke="#6B4A2E" stroke-width="5" fill="none" stroke-linecap="round"/>';
    g += '<path d="M104 172 L106 70 L116 70 L118 172 Z" fill="#6B4A2E"/>' + br([108, 76], [22, 48]) + br([114, 74], [208, 50]) + br([106, 122], [36, 108]) + br([116, 126], [206, 116]) + br([106, 98], [44, 86]) + br([116, 100], [168, 94]);
    [[30, 38], [60, 30], [96, 26], [130, 24], [166, 30], [200, 40], [80, 44], [146, 42]].forEach(([x, y], k) => { g += '<ellipse cx="' + x + '" cy="' + y + '" rx="24" ry="11" fill="' + (k % 2 ? '#2F5A2A' : '#3C6E32') + '" transform="rotate(' + (k % 2 ? 12 : -10) + ' ' + x + ' ' + y + ')"/>'; });
    // the farmer with his long hooked pole, and his wife with the head pan at the heap of pods
    g += '<g class="sgopp">' + person(276, 182, 70, { kind: 'man', robe: '#C9B48A', hat: 'fila', hatc: '#5A4430', skin: 3, al: 'staff', ar: 'hip' }) + '</g>';
    g += '<path d="M244 182 q14 -16 30 0 Z" fill="#E8A317"/><path d="M250 176 q8 -8 18 0" stroke="#B26A1A" stroke-width="1.4" fill="none"/>';
    g += person(304, 186, 60, { kind: 'woman', robe: '#2E7D5A', wrap: '#1E3A7A', hat: 'tie', hatc: '#E8A317', skin: 1, al: 'hip', cls: 'sgw' });
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
    let g = '<defs><linearGradient id="sg-mn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DDA8"/><stop offset="1" stop-color="#F1E6C8"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-mn)"/>';
    // oil palms: a ringed trunk and a crown of long fronds with the red bunches under them
    const palm = (x, y, s) => { let p = '<path d="M' + x + ' 200 Q' + (x + 6 * s) + ' ' + (y + 60) + ' ' + x + ' ' + y + '" stroke="#6B5236" stroke-width="' + 7 * s + '" fill="none"/>';
      for (let k = 0; k < 9; k++) { const a = -170 + k * 20, dx = Math.cos(a * Math.PI / 180) * 46 * s, dy = Math.sin(a * Math.PI / 180) * 22 * s;
        p += '<path d="M' + x + ' ' + y + ' Q' + (x + dx * .5) + ' ' + (y + dy - 14 * s) + ' ' + (x + dx) + ' ' + (y + dy + 14 * s) + '" stroke="#3E6B2A" stroke-width="' + 3 * s + '" fill="none"/>'; }
      return p + '<circle cx="' + (x - 4 * s) + '" cy="' + (y + 6 * s) + '" r="' + 5 * s + '" fill="#B2361E"/><circle cx="' + (x + 5 * s) + '" cy="' + (y + 7 * s) + '" r="' + 4.4 * s + '" fill="#C9481E"/>'; };
    g += palm(26, 40, 1) + palm(300, 30, 1.1) + palm(250, 56, .7);
    g += '<path d="M0 142 H320 V200 H0 Z" fill="#B45A30"/><path d="M0 142 H320" stroke="#8E4222" stroke-width="2"/>';
    // the oil drum with its funnel, the trader at it, the buyer with his men
    g += '<rect x="24" y="118" width="26" height="36" rx="3" fill="#2E4E7A"/><path d="M24 126 h26 M24 146 h26" stroke="#1E3456" stroke-width="2"/><ellipse cx="37" cy="118" rx="13" ry="3" fill="#7A1E10"/>';
    g += person(58, 172, 64, { kind: 'woman', robe: '#E8A317', wrap: '#7A2E5C', hat: 'tie', hatc: '#B23A2E', skin: 2, al: 'fwd', ar: 'hip', cls: 'sgw' });
    g += '<g class="sgopp">' + person(282, 176, 72, { kind: 'man', robe: '#F4F1EA', wrap: '#B23A2E', hat: 'okpu', hatc: '#B23A2E', skin: 3, al: 'hip', ar: 'hold' }) + '</g>';
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
          later(run, t + 900, () => kegs.slice(0, n).forEach((x) => x.classList.add('go'))); step(t + 2600);
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
    g += '<path d="M0 0 H320 V22 Q160 30 0 22 Z" fill="#8E7A5A"/>' + Array.from({ length: 33 }, (_, k) => '<path d="M' + (k * 10) + ' 0 V24" stroke="#6E5A3E" stroke-width="1"/>').join('');
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#C9A06A"/><path d="M0 150 H320" stroke="#A07A48" stroke-width="2"/>';
    // the narrow-strip loom: its frame, the long warp running out across the yard to the drag stone
    g += '<path d="M22 70 V150 M58 70 V150 M18 70 H62" stroke="#5A3A1E" stroke-width="4"/><rect x="28" y="96" width="24" height="10" fill="#7A2E5C"/>';
    g += Array.from({ length: 6 }, (_, k) => '<path d="M' + (32 + k * 3) + ' 106 L' + (232 + k * 2) + ' 158" stroke="#F4EBD0" stroke-width=".7"/>').join('') + '<rect x="230" y="152" width="18" height="10" rx="3" fill="#8A8A86"/>';
    g += person(40, 168, 62, { kind: 'man', robe: '#F4EBD0', agbada: '#2B4C9B', hat: 'fila', hatc: '#2B4C9B', skin: 2, al: 'fwd', ar: 'fwd', cls: 'sgw' });
    // the line the cloths ride on
    g += '<path d="M0 56 Q160 64 320 56" stroke="#5A3A1E" stroke-width="1.6" fill="none"/>';
    g += '<g class="sgopp">' + person(290, 176, 74, { kind: 'woman', robe: '#E8D7A8', wrap: '#7A2E5C', wrap2: '#E8A317', hat: 'gele', hatc: '#7A2E5C', beads: 1, skin: 3, al: 'hip', ar: 'fwd' }) + '</g>';
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
            if (m === p) { got++; if (p >= 100) hundreds++; run.good(b); mood(st, 'cheer'); say(K.en['n' + p], run); line2.classList.add('stop'); b.classList.add('sold'); knocks(run, 2, 1300, 120); step(2600); }
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
    let g = '<rect width="320" height="200" fill="#EDE0C8"/><rect x="0" y="0" width="320" height="22" fill="#2E4E7A"/>';
    // the shelves of the back wall, full of shoes
    for (let s = 0; s < 3; s++) { const y = 44 + s * 30; g += '<rect x="0" y="' + y + '" width="320" height="3" fill="#7A4A26"/>';
      for (let k = 0; k < 16; k++) { const x = 6 + k * 20, c = ['#5A3018', '#1E1E24', '#8E2A1E', '#C9A06A'][(k + s) % 4]; g += '<path d="M' + x + ' ' + y + ' q0 -8 6 -8 l8 4 q2 4 0 4 Z" fill="' + c + '"/>'; } }
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#9A7A56"/><path d="M0 150 H320" stroke="#7A5A36" stroke-width="2"/>';
    // the shoemaker at his bench with the last and the hammer
    g += '<rect x="10" y="150" width="54" height="8" fill="#6B4226"/><rect x="14" y="158" width="4" height="20" fill="#6B4226"/><rect x="56" y="158" width="4" height="20" fill="#6B4226"/>';
    g += '<rect x="6" y="112" width="70" height="18" rx="2" fill="#2E4E7A" stroke="#F2C230" stroke-width="1.4"/><text x="41" y="125" text-anchor="middle" font-size="10" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#F2C230">MADE IN ABA</text>';
    g += '<g class="sgw">' + person(36, 182, 58, { kind: 'man', robe: '#2E6B4A', hat: 'okpuf', hatc: '#1E1E24', skin: 4, al: 'fwd', ar: 'up' }) + '</g>';
    g += '<g class="sgopp">' + person(290, 180, 74, { kind: 'man', robe: '#F4F1EA', wrap: '#1E3A7A', hat: 'okpu', hatc: '#B23A2E', skin: 2, al: 'hip', ar: 'hold' }) + '</g>';
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
    let g = '<rect width="320" height="200" fill="#F6E6C8"/>';
    g += canopy(0, 70, 320, '#F4F1EA', '#2B4C9B', 50);
    g += '<path d="M0 70 H320 V200 H0 Z" fill="#E7D3AE"/><path d="M0 150 H320 V200 H0 Z" fill="#CFB68A"/>';
    // the band at the back: talking drum, gangan, the singer with the microphone
    g += '<g class="sgw">' + person(246, 104, 40, { kind: 'man', robe: '#F4EBD0', agbada: '#7A2E5C', hat: 'fila', hatc: '#7A2E5C', skin: 3, al: 'play', ar: 'play' }) + '</g>' + talkingDrum(244, 92, 16, 5);
    g += '<g class="sgw">' + person(272, 104, 42, { kind: 'man', robe: '#E8A317', hat: 'fila', hatc: '#E8A317', skin: 1, al: 'up', ar: 'hip' }) + '</g>';
    g += '<g class="sgw">' + person(296, 104, 40, { kind: 'man', robe: '#2E6B4A', hat: 'fila', hatc: '#2E6B4A', skin: 2, al: 'play', ar: 'play' }) + '</g>';
    // the table, with its cloth and the jollof
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
        wrong: () => { gs.classList.add('shake'); gf.classList.add('shake'); later(run, 1400, () => { gs.classList.add('out'); gf.classList.add('out'); }); },
      });
    },
  };

  /* ================= Igbo: Iri Ji, the New Yam festival (Lambobi, speaking) =================
     In front of the Igwe's obi the new yams are laid on the mat one by one. The child counts them and says how many. Right:
     the ogene rings, the Igwe lifts a yam and the yams are carried to the yam barn. Wrong: the elders shake their heads. */
  function yamBack() {
    let g = '<defs><linearGradient id="sg-ij" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6D8A0"/><stop offset="1" stop-color="#F3E8CC"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ij)"/>';
    // the yam barn: tall stakes with the yams tied up in rows
    for (let k = 0; k < 7; k++) { const x = 8 + k * 9; g += '<path d="M' + x + ' 40 V140" stroke="#7A5A36" stroke-width="2.4"/>' + [0, 1, 2, 3, 4, 5].map((j) => '<ellipse cx="' + (x + 3) + '" cy="' + (52 + j * 14) + '" rx="3" ry="6" fill="#8E6A42"/>').join(''); }
    // the obi: a red-earth house with its thatch, uli on the wall
    g += '<path d="M120 40 L210 22 L300 40 Z" fill="#B8925A"/><rect x="128" y="40" width="166" height="80" fill="#C2683C"/>' + [0, 1, 2, 3].map((k) => '<path d="M' + (140 + k * 40) + ' 60 q10 -10 20 0 q-10 10 -20 0" stroke="#3E2414" stroke-width="1.2" fill="none"/>').join('');
    g += '<path d="M0 120 H320 V200 H0 Z" fill="#D2A26A"/><path d="M0 120 H320" stroke="#A9764A" stroke-width="2"/>';
    // the Igwe on his stool with his red cap and fan, the elders, the ogene player
    g += '<g class="sgopp">' + person(214, 128, 58, { kind: 'man', robe: '#F4F1EA', wrap: '#B23A2E', hat: 'okpu', hatc: '#B23A2E', beard: 'w', skin: 2, al: 'staff', ar: 'hold' }) + '</g>';
    g += person(186, 126, 48, { kind: 'man', robe: '#1E1E24', wrap: '#B23A2E', hat: 'okpu', hatc: '#B23A2E', skin: 3, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += person(244, 126, 48, { kind: 'man', robe: '#F4F1EA', hat: 'okpuf', hatc: '#1E1E24', skin: 1, al: 'clap', ar: 'clap', cls: 'sgw' });
    g += person(292, 140, 54, { kind: 'man', robe: '#2E6B4A', hat: 'okpuf', hatc: '#1E1E24', skin: 4, al: 'play', ar: 'up', cls: 'sgw' });
    g += '<path d="M298 92 l6 -14 l8 2 l-6 14 Z" fill="#8A8A86"/>';   // the ogene in his hand
    g += '<rect x="40" y="150" width="240" height="34" rx="4" fill="#C9A85A"/>' + Array.from({ length: 24 }, (_, k) => '<path d="M' + (44 + k * 10) + ' 150 V184" stroke="#A88A3E" stroke-width="1"/>').join('');   // the raffia mat
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
    let g = '<defs><linearGradient id="sg-nd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3F78"/><stop offset=".6" stop-color="#C7708A"/><stop offset="1" stop-color="#F2B07A"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-nd)"/>';
    // the neighbours' houses, the electric poles and their sagging wires
    [[0, 70, '#5A4A5E'], [250, 80, '#4E4258']].forEach(([x, y, c]) => { g += '<rect x="' + x + '" y="' + y + '" width="70" height="' + (150 - y) + '" fill="' + c + '"/><path d="M' + (x - 4) + ' ' + y + ' L' + (x + 35) + ' ' + (y - 16) + ' L' + (x + 74) + ' ' + y + ' Z" fill="#3E3448"/>'; });
    g += '<path d="M78 150 V40 M242 150 V40" stroke="#3E2E2A" stroke-width="2.4"/><path d="M0 46 Q40 56 78 44 Q160 62 242 44 Q290 56 320 46" stroke="#2A2030" stroke-width="1" fill="none"/>';
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#7A6A5A"/><path d="M0 150 H320" stroke="#5A4A3E" stroke-width="2"/>';
    // the children waiting outside and the mother by the door
    g += person(24, 186, 44, { kind: 'boy', robe: '#2E7D5A', hat: 'hair', skin: 2, al: 'down', cls: 'sgw' }) + person(44, 186, 40, { kind: 'woman', robe: '#E8A317', wrap: '#7A2E5C', hat: 'braids', skin: 1, tight: 1, cls: 'sgw' });
    g += '<g class="sgopp">' + person(290, 186, 66, { kind: 'woman', robe: '#2B4C9B', wrap: '#1E3A7A', hat: 'gele', hatc: '#E8A317', skin: 3, al: 'hip', ar: 'up' }) + '</g>';
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
    g += '<path d="M0 0 H320 V30 Q160 40 0 30 Z" fill="#9A7A4A"/><rect x="0" y="30" width="320" height="94" fill="#C2683C"/>' + [0, 1, 2, 3, 4, 5].map((k) => '<path d="M' + (20 + k * 54) + ' 70 q12 -14 24 0 q-12 14 -24 0 M' + (32 + k * 54) + ' 56 v28" stroke="#3E2414" stroke-width="1.2" fill="none"/>').join('');
    g += '<path d="M0 124 H320 V200 H0 Z" fill="#D2A26A"/><path d="M0 124 H320" stroke="#A9764A" stroke-width="2"/>';
    // the elders seated along the wall, the eldest with his staff on the right
    [[28, '#F4F1EA', '#B23A2E', 2], [60, '#1E1E24', '#B23A2E', 3], [252, '#F4F1EA', '#1E1E24', 1]].forEach(([x, c, hc, s]) => { g += person(x, 150, 52, { kind: 'man', robe: c, wrap: '#B23A2E', hat: 'okpu', hatc: hc, beard: 'w', skin: s, al: 'down', cls: 'sgw' }); });
    g += '<g class="sgopp">' + person(292, 160, 66, { kind: 'man', robe: '#F4F1EA', wrap: '#B23A2E', hat: 'okpu', hatc: '#B23A2E', beard: 'w', skin: 2, al: 'staff', ar: 'fwd' }) + '</g>';
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
    let g = '<defs><linearGradient id="sg-sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0F2"/><stop offset="1" stop-color="#EAF4F7"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-sw)"/>';
    // the row of shops with their painted boards
    [[0, '#E8A317', 'PROVISIONS'], [214, '#2E7D5A', 'CHEMIST']].forEach(([x, c, t]) => { g += '<rect x="' + x + '" y="60" width="106" height="90" fill="#E7D3AE"/><rect x="' + (x + 6) + '" y="64" width="94" height="18" fill="' + c + '"/><text x="' + (x + 53) + '" y="77" text-anchor="middle" font-size="9" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#FFFDF7">' + t + '</text><rect x="' + (x + 30) + '" y="94" width="46" height="56" fill="#5A3A1E"/>'; });
    g += '<rect x="106" y="70" width="108" height="80" fill="#F0E2C2"/><rect x="138" y="96" width="44" height="54" fill="#6B4226"/>';
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#B9A688"/><path d="M0 150 H320" stroke="#8E7A5E" stroke-width="2"/>';
    // the sign writer at his trestle, and the shop owner
    g += '<g class="sgw">' + person(30, 186, 62, { kind: 'man', robe: '#F4EBD0', hat: 'fila', hatc: '#B23A2E', skin: 2, al: 'fwd', ar: 'up' }) + '</g>';
    g += '<g class="sgopp">' + person(292, 186, 70, { kind: 'man', robe: '#F4EBD0', agbada: '#2B4C9B', hat: 'fila', hatc: '#2B4C9B', skin: 3, al: 'hip', ar: 'hip' }) + '</g>';
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
    let g = '<rect width="320" height="200" fill="#E8DFCC"/><rect x="0" y="0" width="320" height="20" fill="#5A3A1E"/>';
    // shelves of the little booklets the market is famous for, posters on the wall
    for (let s = 0; s < 2; s++) { const y = 54 + s * 28; g += '<rect x="0" y="' + y + '" width="320" height="3" fill="#7A4A26"/>';
      for (let k = 0; k < 30; k++) g += '<rect x="' + (4 + k * 10.6) + '" y="' + (y - 20) + '" width="8" height="20" fill="' + ['#B23A2E', '#2E4E7A', '#E8A317', '#2E6B4A', '#F4F1EA'][(k + s * 2) % 5] + '"/>'; }
    g += '<path d="M0 140 H320 V200 H0 Z" fill="#9A8A6A"/><path d="M0 140 H320" stroke="#7A6A4A" stroke-width="2"/>';
    g += '<rect x="4" y="94" width="96" height="30" rx="2" fill="#5A3A1E"/><text x="52" y="106" text-anchor="middle" font-size="9" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#F2C230">ONITSHA MAIN</text><text x="52" y="118" text-anchor="middle" font-size="9" font-weight="800" font-family="Baloo 2,Arial,sans-serif" fill="#F2C230">MARKET PRINTERS</text>';
    g += '<g class="sgw">' + person(30, 186, 64, { kind: 'man', robe: '#F4F1EA', hat: 'okpuf', hatc: '#1E1E24', skin: 3, al: 'fwd', ar: 'fwd' }) + '</g>';
    g += '<g class="sgopp">' + person(292, 186, 70, { kind: 'woman', robe: '#E8A317', wrap: '#1F4E2E', hat: 'tie', hatc: '#1F4E2E', skin: 2, al: 'hold', ar: 'hip' }) + '</g>';
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
    let g = '<defs><linearGradient id="sg-ir" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE6F2"/><stop offset="1" stop-color="#F1EDE0"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-ir)"/>';
    g += '<rect x="0" y="60" width="320" height="90" fill="#D9CBB0"/>' + [0, 1, 2, 3, 4, 5, 6].map((k) => '<rect x="' + (8 + k * 46) + '" y="76" width="30" height="40" fill="#A9C8D8" stroke="#8E7A5E"/>').join('');
    g += '<path d="M0 150 H320 V200 H0 Z" fill="#8C8C88"/><path d="M0 150 H320" stroke="#6E6E6A" stroke-width="2"/><path d="M0 176 H320" stroke="#F2C230" stroke-width="2" stroke-dasharray="12 10"/>';
    // the stand: the papers laid out in rows under a big umbrella
    g += '<path d="M60 120 L130 104 L200 120 Z" fill="#B23A2E"/><path d="M130 104 V150" stroke="#5A3A1E" stroke-width="1.6"/>';
    g += '<rect x="64" y="134" width="132" height="16" fill="#7A5A36"/>' + Array.from({ length: 10 }, (_, k) => '<rect x="' + (66 + k * 13) + '" y="126" width="12" height="9" fill="#F4F1EA" stroke="#9A9A96" stroke-width=".4"/><path d="M' + (67 + k * 13) + ' 128 h10" stroke="#1E1E24" stroke-width="1.2"/>').join('');
    // the free readers in their fila, arguing over the headlines
    g += '<g class="sgw">' + person(24, 186, 62, { kind: 'man', robe: '#F4EBD0', hat: 'fila', hatc: '#2B4C9B', skin: 2, al: 'fwd', ar: 'hip' }) + '</g>';
    g += '<g class="sgw">' + person(52, 188, 58, { kind: 'man', robe: '#2E6B4A', hat: 'fila', hatc: '#7A2E5C', skin: 4, al: 'hip', ar: 'fwd' }) + '</g>';
    g += '<g class="sgw">' + person(270, 186, 60, { kind: 'man', robe: '#E8D7A8', agbada: '#7A4A26', hat: 'fila', hatc: '#7A4A26', skin: 1, al: 'clap', ar: 'clap' }) + '</g>';
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
        right: () => { knocks(run, 2, 1300, 120); later(run, 1200, () => paper.classList.add('sold')); },
        wrong: () => { knock(200, .3, .2); paper.classList.add('blow'); } });
    },
  };

  /* ================= Igbo: Mgba, the village wrestling (Karatu, speaking) =================
     The crier holds up the board with the word for the next bout. Read it out loud and your wrestler throws his man, the
     ogene rings and the crowd cheers. Wrong: your wrestler slips. */
  function mgbaBack() {
    let g = '<defs><linearGradient id="sg-mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4CE8C"/><stop offset="1" stop-color="#F3E3C0"/></linearGradient></defs><rect width="320" height="200" fill="url(#sg-mg)"/>';
    g += '<path d="M0 96 H320 V200 H0 Z" fill="#C98A52"/><ellipse cx="160" cy="160" rx="120" ry="30" fill="#E0B07A"/><ellipse cx="160" cy="160" rx="120" ry="30" fill="none" stroke="#A9764A" stroke-width="2" stroke-dasharray="4 4"/>';
    // the crowd round the ring: young and old, the ogene and drum players
    for (let k = 0; k < 14; k++) { const x = 6 + k * 23, y = 100 + (k % 2) * 6; if (x > 110 && x < 210) continue;
      g += person(x, y, 40 + (k % 3) * 4, { kind: k % 3 ? 'man' : 'woman', robe: ['#F4F1EA', '#B23A2E', '#1F4E2E', '#E8A317', '#2E4E7A'][k % 5], wrap: '#1F4E2E', hat: k % 3 ? (k % 2 ? 'okpuf' : 'hair') : 'tie', hatc: ['#1E1E24', '#B23A2E'][k % 2], skin: k % 5, al: 'clap', ar: 'clap', cls: 'sgw' }); }
    g += '<path d="M130 96 V30 M190 96 V30" stroke="#6B4226" stroke-width="2"/>' + talkingDrum(118, 92, 14, 5);
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

  return Y ? { 'j-rubutu': ayo, 'j-allo': door, 'j-karatu': regatta, 'j-shayi': foodStall, 'j-rini': adire, 'j-gyada': cocoa, 'j-shanu': asoOke, 'j-garke': owambe, 'j-rubutu-say': naHouse, 'j-marubuci': signWriter, 'j-ruwa': newsStand }
    : { 'j-rubutu': aka, 'j-allo': uli, 'j-karatu': lorries, 'j-shayi': foodStall, 'j-rini': akwete, 'j-gyada': palmOil, 'j-shanu': abaShoes, 'j-garke': iriJi, 'j-rubutu-say': kola, 'j-marubuci': printer, 'j-ruwa': mgba };
}
