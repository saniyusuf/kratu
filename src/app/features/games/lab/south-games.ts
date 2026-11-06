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

  return Y ? { 'j-rubutu': ayo, 'j-allo': door, 'j-karatu': regatta } : { 'j-rubutu': aka, 'j-allo': uli, 'j-karatu': lorries };
}
