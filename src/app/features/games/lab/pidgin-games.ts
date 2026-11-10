// @ts-nocheck
/*
 * The Nigerian Pidgin build's OWN games (Sani 10 Nov 2026, from the design page
 * https://claude.ai/artifact/WY6aRFUSm6JbvKCJoa4RJM): the eight he picked, each in its Hausa slot (same words, same skill,
 * same gate), with its own place, people, play and ending. Everyday Pidgin-speaking Nigeria, as real as Hawan Sallah:
 *   j-rubutu-say  Up NEPA!            a dark face-me-I-face-you street; each letter said lights one room; the whole word and the light is back
 *   j-suya        Puff-Puff           the puff-puff seller at dusk; say the note in the customer's hand and she bags it
 *   j-shanu       Computer Village    phone cases on the stall's hooks with their prices; tap the price Laila says
 *   j-shayi       Mama Put            the buka; say what the customer wants and Mama dishes it
 *   j-nemo        Mile 12 Market      the foodstuff market; tap the trader holding what Laila says
 *   j-dillali     Go-Slow Hawker      traffic standing still; name what the hawker holds up and the driver buys it
 *   j-durbar      Carnival Calabar    a carnival band dances up under a letter banner; say the letter and they dance past
 *   j-ruwa        Viewing Centre      the word chalked on the board; read it and the match comes on
 * Every seller, hawker and porter is a grown-up (no child labour). Drawn SVG once; transform and opacity loops only (pg.css).
 * The shared rounds (letters aloud, names aloud, find it, notes, spelling aloud, reading aloud) come from south-games.ts.
 */
import { person } from './south';
import { CLOTH, zinc, louvre, sign, poles, chair, goat, hen, earth, town, smoke, cloudy, birdsAt, weather } from './south-dress';

export function pidginGames(c: any, S: any): Record<string, any> {
  const { K, h, say, shuffle, micBox, line, spoken } = c;
  const { autoRound, sayLetters, letterSay, nameIt, findIt, noteSay, readAloud, knock, knocks, mood, later, svgBack, horn, note, card, fig, PRICES, naira, U } = S;

  /* ---------------- the people: town clothes, shirts and jeans, ankara, head-ties and braids ---------------- */
  const SHIRT = ['#F4F1EA', '#2E5E8A', '#C62828', '#1F6B4A', '#E8A317', '#5A2E7A', '#3B3B44', '#7FB3D5', '#D9534F', '#0E6E78'];
  const JEANS = ['#2E4A6E', '#3B3B44', '#6B5A3E', '#1E2A44', '#4E4E56'];
  const TIEC = ['#C62828', '#E8A317', '#1F6B4A', '#5A2E7A', '#0E6E78', '#E86AA0'];
  function ub(k, more = {}) {
    const kind = more.kind || ['man', 'woman', 'man', 'woman', 'boy', 'man', 'woman', 'woman'][k % 8];
    const o = { kind, skin: k % 6, cls: 'sgw' };
    if (kind === 'man') Object.assign(o, { robe: k % 3 === 0 ? CLOTH.ank[k % 6] : SHIRT[(k * 7) % 10], trou: JEANS[k % 5], hat: 'hair' });
    else if (kind === 'boy') Object.assign(o, { robe: k % 2 ? CLOTH.check : SHIRT[(k * 3) % 10], trou: '#3B4A6B', hat: 'hair' });
    else Object.assign(o, { robe: CLOTH.ank[(k * 5) % 6], wrap: k % 2 ? CLOTH.ank[(k + 2) % 6] : JEANS[k % 5], hat: k % 3 === 0 ? 'braids' : 'tie', hatc: TIEC[k % 6], tight: k % 2 });
    return Object.assign(o, more);
  }
  /** a row of town people in the middle distance */
  function folk(x0, x1, y, n, hh, seed = 0, more = {}) {
    let g = ''; const poses = ['down', 'hip', 'clap', 'wave', 'down', 'fwd', 'hip', 'clap'];
    for (let i = 0; i < n; i++) {
      const k = i + seed * 5, x = x0 + (x1 - x0) * (i + .5) / n + ((k * 13) % 7 - 3), yy = y + ((k * 5) % 3) * 1.6, ht = hh * (.9 + ((k * 3) % 4) * .05);
      const o = ub(k, Object.assign({ al: poses[k % 8], ar: poses[(k + 3) % 8], flip: k % 3 === 0 }, more));
      g += person(x, yy, o.kind === 'boy' ? ht * .72 : ht, o);
    }
    return g;
  }
  const grad = (id, stops) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + stops.map((s, i) => '<stop offset="' + (i / (stops.length - 1)).toFixed(2) + '" stop-color="' + s + '"/>').join('') + '</linearGradient>';
  /** a car seen from the side (traffic), body colour c */
  const car = (x, y, s, c, o = {}) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (o.flip ? -s : s) + ' ' + s + ')"><ellipse cx="0" cy="1" rx="26" ry="2" fill="rgba(0,0,0,.25)"/>' +
    '<path d="M-26 -2 V-9 Q-26 -12 -22 -12 L-14 -13 L-8 -20 Q-6 -22 -2 -22 H10 Q14 -22 16 -19 L20 -13 L24 -12 Q27 -11 27 -7 V-2 Z" fill="' + c + '"/>' +
    '<path d="M-7 -19 L-12 -13 H2 V-20 H-4 Q-6 -20 -7 -19 Z M4 -20 V-13 H18 L14 -19 Q13 -20 11 -20 Z" fill="#2E3E48"/><path d="M-5 -19 L-9 -14" stroke="#9FC8DA" stroke-width="1.2" opacity=".6"/>' +
    '<path d="M-26 -8 H27" stroke="#000" stroke-opacity=".15" stroke-width="1"/><rect x="22" y="-10" width="5" height="2" rx=".8" fill="#FFE7A3"/><rect x="-26" y="-10" width="3" height="2" fill="#C62828"/>' +
    '<circle cx="-15" cy="-2" r="4.6" fill="#1E1E24"/><circle cx="-15" cy="-2" r="2" fill="#8E9498"/><circle cx="16" cy="-2" r="4.6" fill="#1E1E24"/><circle cx="16" cy="-2" r="2" fill="#8E9498"/>' + (o.extra || '') + '</g>';
  /** the yellow Lagos bus with its black stripes, from the side */
  const yellowBus = (x, y, s, words = '') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="0" cy="1" rx="34" ry="2" fill="rgba(0,0,0,.25)"/><path d="M-34 -2 V-26 Q-34 -30 -30 -30 H26 Q32 -30 34 -22 V-2 Z" fill="#F6C12B"/>' +
    '<path d="M-34 -12 H34 M-34 -9 H34" stroke="#1B1B1B" stroke-width="1.6"/>' + [-30, -19, -8, 3, 14].map((wx) => '<rect x="' + wx + '" y="-27" width="9" height="11" rx="1" fill="#2E3E48"/><path d="M' + (wx + 1) + ' -26 l3 9" stroke="#9FC8DA" stroke-width=".8" opacity=".5"/>').join('') +
    '<path d="M25 -27 h6 l3 11 h-9 Z" fill="#2E3E48"/>' + (words ? '<text x="-4" y="-4" font-size="4" text-anchor="middle" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="#1B1B1B">' + words + '</text>' : '') +
    '<circle cx="-22" cy="-2" r="5" fill="#1E1E24"/><circle cx="-22" cy="-2" r="2" fill="#8E9498"/><circle cx="22" cy="-2" r="5" fill="#1E1E24"/><circle cx="22" cy="-2" r="2" fill="#8E9498"/></g>';
  /** an okada (motorbike) with its rider */
  const okada = (x, y, s, k) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><circle cx="-9" cy="-3" r="4" fill="none" stroke="#1E1E24" stroke-width="1.6"/><circle cx="9" cy="-3" r="4" fill="none" stroke="#1E1E24" stroke-width="1.6"/>' +
    '<path d="M-9 -3 L-3 -9 H5 L9 -3 M5 -9 L7 -14" stroke="#3B3B44" stroke-width="1.6" fill="none"/><rect x="-6" y="-11" width="9" height="3" rx="1" fill="#C62828"/>' +
    '<g transform="translate(-14 -6) scale(.24)">' + person(30, 0, 120, ub(k, { kind: 'man', al: 'fwd', ar: 'fwd', cls: '' })) + '</g></g>';
  /** a generator, painted red, with its exhaust smoke */
  const gen = (x, y, s = 1, on = 1) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-9" y="-10" width="18" height="10" rx="1.4" fill="#C62828"/><rect x="-7" y="-8" width="8" height="6" rx="1" fill="#2A2A2A"/><circle cx="5" cy="-5" r="2" fill="#E8E2D2"/>' +
    '<path d="M-9 -12 H9 M-9 -12 V0 M9 -12 V0" stroke="#3B3B44" stroke-width="1"/><path d="M9 -3 h3 v-4" stroke="#5A5A5A" stroke-width="1.2" fill="none"/></g>' + (on ? smoke(x + 12 * s, y - 8 * s, .6 * s) : '');
  /** a plastic bucket / basin heaped with things: tomatoes, pepper, onions */
  const basin = (x, y, s, fill, dots) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-12 -8 L12 -8 L9 0 L-9 0 Z" fill="' + fill + '"/><ellipse cx="0" cy="-8" rx="12" ry="2.6" fill="' + fill + '"/>' +
    Array.from({ length: 11 }, (_, j) => '<circle cx="' + (-9 + (j % 6) * 3.6 + (j > 5 ? 1.8 : 0)) + '" cy="' + (-9.6 - (j > 5 ? 2.6 : 0) - (j % 2) * .6) + '" r="2" fill="' + dots[j % dots.length] + '"/>').join('') + '</g>';

  /* ======================================================================================================
     Up NEPA! (Rubutu, speaking). A face-me-I-face-you street at night in Port Harcourt: the long bungalow of rooms, the
     NEPA pole and its transformer, one neighbour's generator roaring, everyone outside in the heat. Each letter said
     right lights one room's window. The whole word and NEPA brings the light back: every bulb on, the fan turns, the
     generator goes quiet and the street shouts "Up NEPA!". A wrong letter and the light blinks out.
     ====================================================================================================== */
  function nepaBack() {
    let g = '<defs>' + grad('pg-nt', ['#141832', '#262B52', '#3E3A62']) + '<radialGradient id="pg-glow"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".7"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#pg-nt)"/>';
    g += Array.from({ length: 22 }, (_, k) => '<circle cx="' + ((k * 67) % 320) + '" cy="' + (4 + (k * 13) % 44) + '" r="' + (k % 4 ? .5 : .8) + '" fill="#FFFDF7" class="x-flick" style="animation-delay:-' + (k * .37).toFixed(2) + 's"/>').join('');
    g += '<circle cx="40" cy="22" r="9" fill="#F4EFD8"/><circle cx="44" cy="20" r="8" fill="#1A1E3A"/>';
    // the town beyond, dark, one tower with its red light, a church cross far off, a mast
    g += town(96, false, '#2A2E4A', 4) + '<path d="M276 96 V44 M270 52 h12 M272 62 h8" stroke="#3A3E5A" stroke-width="1.2"/><circle cx="276" cy="42" r="1.2" fill="#E53935" class="x-flick"/>';
    // across the road: shops with their shutters down, a kiosk with its lamp and the recharge card board
    g += '<rect x="0" y="70" width="320" height="34" fill="#2E2A40"/>' + zinc(-4, 324, 64, 7, 5).replace(/#A9B2B6/g, '#4A4E5E').replace(/#9A5A2E/g, '#3A2A24');
    for (let k = 0; k < 6; k++) g += '<rect x="' + (8 + k * 54) + '" y="76" width="38" height="28" fill="#3A3650"/>' + Array.from({ length: 6 }, (_, j) => '<path d="M' + (8 + k * 54) + ' ' + (80 + j * 4) + ' h38" stroke="#24203A" stroke-width=".8"/>').join('');
    g += '<g class="pglit">' + [22, 76, 130, 184].map((x) => '<rect x="' + (x + 4) + '" y="80" width="30" height="8" fill="#FFE7A3" opacity=".85"/>').join('') +
      '<circle cx="44" cy="84" r="2.4" fill="#FFF6C8"/><circle cx="44" cy="84" r="26" fill="url(#pg-glow)"/><circle cx="160" cy="62" r="1.6" fill="#FFF6C8"/><circle cx="160" cy="62" r="16" fill="url(#pg-glow)"/></g>';
    g += '<g><rect x="236" y="80" width="40" height="24" fill="#5A4A3A"/><rect x="240" y="84" width="32" height="12" fill="#FFE7A3" opacity=".85"/><circle cx="256" cy="90" r="22" fill="url(#pg-glow)"/>' + sign(236, 72, 40, 8, 'RECHARGE CARD', '#1F6B4A', '#FFFDF7', { fs: 3.8 }) + '</g>';
    // the NEPA pole with its transformer and the tangle of wires; a spark now and then
    g += '<path d="M44 150 V48 M34 54 h20 M36 62 h16" stroke="#4A3E36" stroke-width="2.2"/><rect x="47" y="64" width="10" height="16" rx="1.6" fill="#5E6670"/><path d="M48 66 h8 M48 70 h8 M48 74 h8" stroke="#3E464E" stroke-width=".8"/>';
    g += '<path d="M36 54 Q120 70 200 58 T324 62 M52 54 Q130 74 210 62 T324 70 M40 62 Q100 80 160 96" stroke="#16182A" stroke-width=".8" fill="none"/><circle cx="57" cy="64" r="1.6" fill="#BFE3FF" class="pgspark"/>';
    // the road in the dark, puddles catching the kiosk light
    g += '<path d="M0 104 H320 V200 H0 Z" fill="#3A3438"/><path d="M0 104 H320" stroke="#2A2428" stroke-width="2"/>' + Array.from({ length: 22 }, (_, k) => '<ellipse cx="' + (k * 15 + 4) + '" cy="' + (112 + (k * 7) % 80) + '" rx="1.4" ry=".6" fill="#2A2428" opacity=".7"/>').join('');
    g += '<ellipse cx="250" cy="116" rx="18" ry="2.4" fill="#FFE7A3" opacity=".25"/><ellipse cx="90" cy="186" rx="22" ry="3" fill="#5A6E8A" opacity=".35"/>';
    // the neighbour's generator, roaring, and the man fanning himself on his plastic chair
    g += '<g class="pggen">' + gen(286, 152, 1.4) + '</g>' + chair(258, 158, 1.1, '#1F4E9A');
    g += '<g class="sgw x-idle">' + person(258, 154, 46, ub(1, { kind: 'man', robe: '#F4F1EA', al: 'fwd', ar: 'hip', hl: '<path class="x-fan" d="M0 0 L-5 -8 Q0 -11 5 -8 Z" fill="#C9A06A"/>' })) + '</g>';
    // everyone out in the heat: a mother with a baby on her back, two boys with a ball, a woman on a bench
    g += '<rect x="10" y="176" width="44" height="3" fill="#5A3A22"/><path d="M14 179 v10 M50 179 v10" stroke="#5A3A22" stroke-width="2"/>';
    g += person(22, 178, 44, ub(3, { al: 'hip', ar: 'clap' })) + person(42, 178, 46, ub(6, { al: 'clap', ar: 'down', flip: 1 }));
    g += person(296, 196, 34, ub(4, { kind: 'boy', al: 'up', ar: 'down' })) + '<circle cx="306" cy="194" r="3.4" fill="#FFFDF7" stroke="#1E1E24" stroke-width=".6"/>';
    return svgBack(g);
  }
  const upNepa = {
    cls: 'sgs sg-pnepa', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg pnepa">' + nepaBack() + '<div class="sgpic"><img alt=""></div>' +
        '<div class="pnrow"><i class="pnroof"></i><div class="pnwin"></div><i class="pnwall"></i></div><b class="pnsay">UP NEPA!</b></div>');
      const row = st.querySelector('.pnrow');
      sayLetters(run, done, { st, slots: '.pnwin',
        start: () => { st.classList.remove('lit', 'dark'); },
        letter: (sl, Lt) => { sl.innerHTML = '<b>' + Lt + '</b>'; knock(900, .03, .2); },
        spoil: () => { st.classList.add('dark'); knock(90, .4, .4); },
        win: () => { st.classList.add('lit'); horn(); knocks(run, 3, 520, 120); },
        winMs: 3400 });
    },
  };

  /* ======================================================================================================
     Puff-Puff (Lambobi, speaking). Evening on a street corner: the puff-puff seller's big black pot of oil on its
     coal stove, the glass box of golden puff-puff, the lantern. A customer comes up holding out a naira note. Say how
     much it is: she takes it into her tin and bags the puff-puff. Wrong: the customer frowns and goes.
     ====================================================================================================== */
  function puffBack() {
    let g = '<defs>' + grad('pg-pf', ['#3E3468', '#9A5468', '#F09A5E']) + '<radialGradient id="pg-fire"><stop offset="0" stop-color="#FFE07A"/><stop offset=".55" stop-color="#F57C00"/><stop offset="1" stop-color="#F57C00" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pg-lamp"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".75"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#pg-pf)"/>';
    g += '<circle cx="250" cy="66" r="16" fill="#FFB36A" opacity=".8"/>' + cloudy(80, 22, .9, '#C48A9A') + birdsAt(180, 30, 3, '#2A2030');
    // the street: a church-and-mosque mixed street of shops closing, painted signs, a pharmacy with its green cross lit
    const SIG = ['GOD DEY STORES', 'MAMA EMEKA PROVISIONS', 'BEST LINK PHARMACY'];
    for (let k = 0; k < 3; k++) { const x = 4 + k * 106;
      g += '<rect x="' + x + '" y="52" width="100" height="62" fill="' + ['#B9A48A', '#A89AB8', '#9EB4A4'][k] + '"/>' + weather(x, 52, 100, 62, '#2A1A10', k + 4) + louvre(x + 10, 56, 20, 11) + louvre(x + 70, 56, 20, 11);
      g += zinc(x - 2, x + 102, 46, 6, k + 3) + sign(x + 6, 72, 88, 10, SIG[k], ['#C62828', '#1F3A78', '#1F6B4A'][k], '#FFFDF7', { fs: 5.4 });
      g += '<rect x="' + (x + 30) + '" y="84" width="40" height="30" fill="' + (k === 2 ? '#FFE7A3' : '#3A2A22') + '"/>' + (k === 2 ? '<path d="M' + (x + 84) + ' 86 h6 M' + (x + 87) + ' 83 v6" stroke="#2EB872" stroke-width="2.2" class="x-flick"/>' : ''); }
    g += poles([30, 150, 290], 114, 40, '#3A2A2A');
    g += '<path d="M0 114 H320 V200 H0 Z" fill="#8A7466"/><path d="M0 114 H320" stroke="#5A4A40" stroke-width="2"/>' + earth(122, '#8A7466', 6, 1).replace('<path d="M0 122 H320 V200 H0 Z" fill="#8A7466"/>', '');
    g += okada(180, 128, 1.1, 2) + folk(120, 220, 118, 3, 28, 2);
    // her stall: the coal stove and the black pot of oil, the puff-puff frying, the glass box, her basin of batter, the lantern
    g += '<g transform="translate(0 0)">';
    g += '<ellipse cx="104" cy="168" rx="22" ry="6" fill="url(#pg-fire)" class="sgflame"/><path d="M86 174 h36 l-4 -8 h-28 Z" fill="#4A4A4A"/>';
    g += '<path d="M78 150 Q104 176 130 150 Z" fill="#1E1E1E"/><ellipse cx="104" cy="150" rx="26" ry="5.4" fill="#C98A1E"/>' + [0, 1, 2, 3, 4, 5].map((k) => '<circle class="sgfry" style="--k:' + k + '" cx="' + (88 + k * 6.4) + '" cy="' + (149 + (k % 2)) + '" r="3.4" fill="#C47A2A"/>').join('');
    g += '<path d="M92 142 q-4 -8 1 -14 M112 142 q4 -8 -1 -14" stroke="#fff" stroke-width="1.6" opacity=".4" fill="none" class="sgsteam"/>';
    g += '<g transform="translate(150 166)"><rect x="-4" y="0" width="34" height="4" fill="#5A3A22"/><path d="M0 4 v20 M26 4 v20" stroke="#4A2C14" stroke-width="2"/><rect x="0" y="-22" width="26" height="22" fill="#CFE6EE" opacity=".55" stroke="#8EAAB4"/>' +
      [0, 1, 2, 3, 4, 5, 6, 7].map((k) => '<circle cx="' + (5 + (k % 4) * 5.4) + '" cy="' + (-4 - Math.floor(k / 4) * 5) + '" r="2.6" fill="#D08A30"/>').join('') + '</g>';
    g += '<g transform="translate(64 182)"><path d="M-10 0 Q0 9 10 0 Z" fill="#C9C2B5"/><ellipse rx="10" ry="2.4" fill="#E8DCC0"/></g>';
    g += '<g transform="translate(140 132)"><path d="M0 0 v-8" stroke="#3A3A3A" stroke-width=".8"/><rect x="-3" y="0" width="6" height="8" rx="1.6" fill="#E8A317" opacity=".9"/><circle cx="0" cy="4" r="18" fill="url(#pg-lamp)" class="x-flick"/></g>';
    g += '</g>';
    g += '<g class="sgopp">' + person(40, 172, 78, ub(2, { kind: 'woman', robe: CLOTH.ank[0], wrap: CLOTH.ank[3], hat: 'tie', hatc: '#C62828', al: 'hold', ar: 'fwd', tight: 0 })) + '</g>';
    g += '<g transform="translate(60 186)"><rect x="-8" y="-6" width="16" height="6" rx="1" fill="#9EA4A8"/><ellipse cx="0" cy="-6" rx="8" ry="1.6" fill="#C9CED2"/></g>';
    return svgBack(g);
  }
  const puffBag = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 10 L32 10 L35 38 L5 38 Z" fill="#F4EBD0" stroke="#B8AE98"/><path d="M8 10 Q20 4 32 10" stroke="#B8AE98" fill="none"/>' +
    [0, 1, 2, 3].map((k) => '<circle cx="' + (13 + (k % 2) * 13) + '" cy="' + (20 + Math.floor(k / 2) * 9) + '" r="5" fill="#D08A30" opacity=".9"/>').join('') + '</svg>';
  const puffPuff = {
    cls: 'sgs sg-ppuff', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg ppuff">' + puffBack() + '<div class="ppcust"><span class="ppnote"></span><span class="ppfig"></span></div><span class="ppbag">' + puffBag + '</span><span class="pptin"></span></div>');
      const cu = st.querySelector('.ppcust'), nt = st.querySelector('.ppnote'), fg = st.querySelector('.ppfig'), bag = st.querySelector('.ppbag'), tin = st.querySelector('.pptin'); let paid = 0;
      noteSay(run, done, { st,
        show: (n, r) => { nt.innerHTML = note(n); fg.innerHTML = fig(ub(r + 1, { kind: ['man', 'woman', 'boy', 'woman', 'man', 'boy'][r % 6], al: 'hip', ar: 'up' }), r % 3 === 2 ? 104 : 136);
          cu.className = 'ppcust'; bag.className = 'ppbag'; void cu.offsetWidth; cu.classList.add('in'); },
        right: () => { cu.classList.add('pay'); later(run, 800, () => { knock(1300, .05, .3); paid++; tin.innerHTML = Array.from({ length: Math.min(paid, 6) }, (_, k) => '<i style="--k:' + k + '"></i>').join(''); bag.classList.add('give'); });
          later(run, 1900, () => cu.classList.add('sgo')); },
        wrong: () => { later(run, 500, () => cu.classList.add('sgo')); } });
    },
  };

  /* ======================================================================================================
     Computer Village (Lambobi, tap). Ikeja's phone market: the plazas hung with banners, the crowd, a man selling
     chargers from a tray, the stall with its glass counter. Phone cases hang on the hooks, each with its price. Laila
     says a price; tap that case. Right: the seller unhooks it and wraps it in a nylon bag. Wrong: it shakes on its hook.
     ====================================================================================================== */
  function villageBack() {
    let g = '<defs>' + grad('pg-cv', ['#A9D2EC', '#D8EAF2', '#EEE8DA']) + '</defs><rect width="320" height="200" fill="url(#pg-cv)"/>' + cloudy(60, 12, 1) + cloudy(230, 18, .8) + birdsAt(150, 14, 3);
    // the plazas: three and four storeys, glass and tiles, every floor a banner of phones, laptops and repairs
    const B = [[0, 26, 104, '#C9CDD2'], [104, 16, 110, '#E2D6C2'], [214, 30, 106, '#BFD0D8']];
    B.forEach(([x, y, w, c], k) => { g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (120 - y) + '" fill="' + c + '"/>' + weather(x, y, w, 120 - y, '#1A1A1A', k + 7);
      for (let f = 0; f < 3; f++) g += '<rect x="' + (x + 4) + '" y="' + (y + 6 + f * 24) + '" width="' + (w - 8) + '" height="12" fill="#5A7A8A" opacity=".7"/>' + Array.from({ length: Math.floor(w / 14) }, (_, j) => '<path d="M' + (x + 4 + j * 14) + ' ' + (y + 6 + f * 24) + ' v12" stroke="#3E5260" stroke-width=".6"/>').join('');
      const BAN = [['COMPUTER VILLAGE · IKEJA', '#C62828'], ['LAPTOP REPAIRS', '#1F3A78'], ['WE BUY & SELL', '#1F6B4A'], ['SCREEN CHANGE', '#E8A317'], ['ORIGINAL CHARGERS', '#5A2E7A'], ['UK USED', '#0E6E78']];
      for (let f = 0; f < 2; f++) { const [t, bc] = BAN[(k * 2 + f) % 6]; g += sign(x + 6, y + 19 + f * 24, w - 12, 9, t, bc, '#FFFDF7', { fs: 5 }); } });
    g += poles([10, 160, 310], 120, 70, '#5A5A5A');
    // the walkway, packed: buyers, sellers calling, a charger seller with his tray, a keke squeezing through
    g += '<path d="M0 120 H320 V200 H0 Z" fill="#B4AEA4"/><path d="M0 120 H320" stroke="#8E8A82" stroke-width="2"/>' + Array.from({ length: 14 }, (_, k) => '<path d="M' + (k * 24) + ' 120 l-10 80" stroke="#A29C92" stroke-width=".6"/>').join('');
    g += folk(0, 320, 128, 13, 34, 3, { al: 'down' });
    g += '<g class="sgw x-idle">' + person(36, 192, 66, ub(5, { kind: 'man', robe: '#1F6B4A', al: 'hold', ar: 'up', hl: '<rect x="-9" y="-3" width="18" height="5" fill="#8B5A2B"/><path d="M-7 -3 v-3 M-3 -3 v-3 M1 -3 v-3 M5 -3 v-3" stroke="#1E1E24" stroke-width="1.4"/>' })) + '</g>';
    // the stall: a glass counter of phones and a pegboard behind; the seller
    g += '<rect x="70" y="58" width="180" height="66" rx="2" fill="#F4F1EA" stroke="#9A9A96"/><rect x="70" y="58" width="180" height="8" fill="#C62828"/><text x="160" y="64.4" text-anchor="middle" font-size="5" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="#FFFDF7">BLESSED HANDS PHONES</text>';
    g += Array.from({ length: 60 }, (_, k) => '<circle cx="' + (76 + (k % 15) * 12) + '" cy="' + (72 + Math.floor(k / 15) * 13) + '" r=".7" fill="#C9C2B5"/>').join('');
    g += '<rect x="70" y="140" width="180" height="26" fill="#9EB8C4" opacity=".6" stroke="#6E8A96"/><rect x="70" y="166" width="180" height="20" fill="#5A4A3A"/>' + Array.from({ length: 9 }, (_, k) => '<rect x="' + (78 + k * 19) + '" y="147" width="9" height="15" rx="1.4" fill="' + ['#1E1E24', '#E8E8E8', '#2E5E8A', '#C62828'][k % 4] + '"/><rect x="' + (79 + k * 19) + '" y="148.6" width="7" height="11" fill="#4A6A7A" opacity=".8"/>').join('');
    g += '<g class="sgopp">' + person(276, 192, 76, ub(7, { kind: 'man', robe: '#1F3A78', al: 'fwd', ar: 'hip' })) + '</g>';
    return svgBack(g);
  }
  const CASEC = ['#C62828', '#1F3A78', '#1F6B4A', '#E8A317', '#5A2E7A', '#E86AA0', '#1E1E24', '#0E6E78'];
  const pcase = (k) => '<svg viewBox="0 0 40 70" aria-hidden="true"><path d="M20 2 V8" stroke="#8E8A82" stroke-width="2"/><rect x="5" y="8" width="30" height="58" rx="6" fill="' + CASEC[k % CASEC.length] + '"/><rect x="7" y="10" width="26" height="54" rx="5" fill="none" stroke="#fff" stroke-opacity=".25"/>' +
    '<rect x="9" y="12" width="10" height="14" rx="3" fill="#1E1E24"/><circle cx="14" cy="16" r="2.4" fill="#4A5A6A"/><circle cx="14" cy="22" r="2" fill="#4A5A6A"/>' + (k % 3 === 0 ? '<circle cx="24" cy="44" r="6" fill="#fff" opacity=".25"/>' : '') + '<path d="M9 60 q11 -6 22 0" stroke="#fff" stroke-opacity=".2" fill="none"/></svg>';
  const village = {
    cls: 'sgs sg-pvill', scene: 'none',
    play(run, done) {
      const { T, H, P } = PRICES(); let r = 0, got = 0, hundreds = 0, busy = true, v = 0;
      const st = h('<div class="sg pvill">' + villageBack() + '<div class="pvhooks"></div><span class="pvbag"><svg viewBox="0 0 40 44" aria-hidden="true"><path d="M8 14 L32 14 L35 42 L5 42 Z" fill="#1E1E24"/><path d="M12 14 Q12 2 17 4 M28 14 Q28 2 23 4" stroke="#1E1E24" stroke-width="3" fill="none"/><path d="M11 20 Q20 26 29 20" stroke="#fff" stroke-opacity=".18" stroke-width="2" fill="none"/></svg></span></div>'); run.scr.appendChild(st);
      const hooks = st.querySelector('.pvhooks'), bag = st.querySelector('.pvbag');
      run.clock(150, () => done({ right: got, part: got / 8, hundreds }));
      const sayP = () => say(K.en['n' + P[r]], run); run.remind = sayP;
      function next() {
        const p = P[r], opts = shuffle([p].concat(shuffle((p >= 100 ? H : T).filter((x) => x !== p)).slice(0, 3)));
        hooks.innerHTML = ''; bag.className = 'pvbag';
        opts.forEach((m, k) => {
          const b = h('<button type="button" class="pvc" aria-label="' + m + '" style="--k:' + k + '"><span class="pvin">' + pcase(v++) + '<b class="pvtag">' + naira(m) + '</b></span></button>');
          hooks.appendChild(b);
          b.onclick = () => { if (busy || run.dead) return; busy = true;
            if (m === p) { got++; if (p >= 100) hundreds++; run.good(b); mood(st, 'cheer'); say(K.en['n' + p], run); b.classList.add('sgsold'); later(run, 700, () => bag.classList.add('give')); knocks(run, 2, 1300, 120); step(2600); }
            else { run.bad(); mood(st, 'sad'); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); later(run, 900, () => { busy = false; step(0); }); }
          };
        });
        later(run, 400, () => { busy = false; sayP(); });
      }
      function step(ms) { busy = true; later(run, ms, () => { r++; if (r >= P.length) done({ right: got, finished: true, part: got / 8, hundreds }); else next(); }); }
      next();
    },
  };

  /* ======================================================================================================
     Mama Put (Nemo hoto, speaking). The buka at lunchtime: its zinc roof and painted wall, the big pots of jollof, beans
     and stew on the coal fire, the menu board, the benches with men eating. A customer comes in showing what they want.
     Press the bird and say it in English: Mama dishes it onto the plate, the customer pays and goes to sit. Wrong, or too
     slow: the customer shakes their head and walks out.
     ====================================================================================================== */
  const DINERS = [ub(0, { kind: 'man', robe: '#2E5E8A' }), ub(3, { kind: 'woman' }), ub(4, { kind: 'boy' }), ub(5, { kind: 'man', robe: CLOTH.ank[2] }), ub(7, { kind: 'woman', hat: 'braids' })];
  function bukaBack() {
    let g = '<defs>' + grad('pg-mp', ['#F4D9A6', '#FBEBCC']) + '<radialGradient id="pg-fire2"><stop offset="0" stop-color="#FFE07A"/><stop offset=".55" stop-color="#F57C00"/><stop offset="1" stop-color="#F57C00" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#pg-mp)"/>';
    // the buka itself: a painted block wall, its zinc lean-to, the menu painted by hand
    g += '<rect x="0" y="20" width="320" height="104" fill="#DCC9A2"/>' + weather(0, 20, 320, 104, '#3A2A1A', 9) + zinc(-6, 326, 12, 10, 7);
    g += sign(10, 30, 120, 22, 'MAMA NKECHI BUKA', '#C62828', '#FFFDF7', { fs: 9, sub: 'FOOD IS READY' });
    g += '<rect x="214" y="28" width="96" height="62" rx="1.6" fill="#1E3A2A" stroke="#6B4226" stroke-width="2"/><text x="262" y="38" text-anchor="middle" font-size="6" font-weight="800" font-family="Arial,sans-serif" fill="#F2C230">MENU</text>' +
      ['JOLLOF RICE ....... 500', 'WHITE RICE & STEW .. 600', 'BEANS & DODO ....... 400', 'EBA / AMALA ........ 300', 'FISH / MEAT ........ 300', 'EGG ................ 150'].map((t, k) => '<text x="219" y="' + (47 + k * 7.4) + '" font-size="4" font-family="Arial,sans-serif" fill="#F4F1EA">' + t + '</text>').join('');
    g += louvre(150, 32, 40, 22, '#3E5A4A');
    // the benches inside, men eating with their hands, a fan on the wall, the water drum and the cups
    g += person(150, 106, 32, ub(2, { kind: 'man', al: 'clap', ar: 'hold' })) + person(172, 106, 32, ub(9, { kind: 'man', al: 'hold', ar: 'clap', flip: 1 })) + person(194, 106, 30, ub(6, { kind: 'woman', al: 'clap', ar: 'down' }));
    g += '<rect x="134" y="92" width="78" height="5" fill="#7A4E2A"/><rect x="136" y="97" width="74" height="9" fill="#5A3A1E"/>' + [0, 1, 2].map((k) => '<ellipse cx="' + (150 + k * 22) + '" cy="92" rx="5" ry="1.4" fill="#F4F1EA"/><ellipse cx="' + (150 + k * 22) + '" cy="91.4" rx="3" ry=".8" fill="#C8642A"/>').join('');
    g += '<g transform="translate(120 66)"><circle r="7" fill="#E8E2D2" stroke="#9A9A96"/><g class="pgfanb"><path d="M0 0 L-5 -3 M0 0 L5 -3 M0 0 L0 6" stroke="#5A5A5A" stroke-width="2.4" stroke-linecap="round"/></g></g>';
    g += '<rect x="290" y="96" width="18" height="26" rx="2" fill="#2E5E8A"/><rect x="292" y="92" width="14" height="5" rx="1.4" fill="#1E3A5A"/>';
    // the floor and the counter of pots on their stands: jollof, white rice, stew, beans, and the fire under the stew
    g += '<path d="M0 124 H320 V200 H0 Z" fill="#B89466"/>' + earth(124, '#B89466', 8, 0).replace('<path d="M0 124 H320 V200 H0 Z" fill="#B89466"/>', '');
    g += '<rect x="66" y="132" width="196" height="8" fill="#8B5A2B"/><path d="M70 140 V176 M258 140 V176" stroke="#5A3A22" stroke-width="3"/>';
    const POTS = [[96, '#C8642A', 'jollof'], [140, '#F4F1EA', 'rice'], [184, '#B71C1C', 'stew'], [228, '#A0622C', 'beans']];
    POTS.forEach(([x, food], k) => { g += '<path d="M' + (x - 18) + ' 112 L' + (x + 18) + ' 112 L' + (x + 15) + ' 132 L' + (x - 15) + ' 132 Z" fill="#3E3E42"/><ellipse cx="' + x + '" cy="112" rx="18" ry="4" fill="' + food + '"/>' +
      '<path d="M' + (x - 18) + ' 116 h-4 M' + (x + 18) + ' 116 h4" stroke="#3E3E42" stroke-width="2"/>' + (k === 2 ? '<ellipse cx="' + x + '" cy="138" rx="14" ry="3" fill="url(#pg-fire2)" class="sgflame"/>' : '') +
      '<path d="M' + (x - 4) + ' 106 q-3 -6 1 -11 M' + (x + 5) + ' 106 q3 -6 -1 -11" stroke="#fff" stroke-width="1.4" opacity=".4" fill="none" class="sgsteam"/>'; });
    g += '<g transform="translate(250 150)"><rect x="-10" y="0" width="20" height="4" rx="1" fill="#E8E2D2"/>' + [0, 1, 2].map((k) => '<ellipse cx="0" cy="' + (-k * 2.4) + '" rx="10" ry="2" fill="#F4F1EA" stroke="#C9C2B5" stroke-width=".4"/>').join('') + '</g>';
    g += hen(300, 188, 1) + chair(300, 170, .9, '#C62828');
    g += '<g class="sgopp">' + person(42, 176, 82, ub(1, { kind: 'woman', robe: CLOTH.ank[5], wrap: CLOTH.ank[1], hat: 'tie', hatc: '#1F6B4A', al: 'hold', ar: 'fwd',
      hr: '<g transform="rotate(-20)"><path d="M0 0 L10 -2" stroke="#8B5A2B" stroke-width="1.6"/><ellipse cx="12" cy="-2" rx="3" ry="2" fill="#C9C2B5"/></g>' })) + '</g>';
    return svgBack(g);
  }
  const plateSvg = '<svg viewBox="0 0 40 24" aria-hidden="true"><ellipse cx="20" cy="14" rx="18" ry="7" fill="#F4F1EA" stroke="#C9C2B5"/><ellipse cx="20" cy="13" rx="12" ry="4.4" fill="#C8642A"/><ellipse cx="25" cy="12" rx="4" ry="2.4" fill="#B71C1C"/></svg>';
  const mamaPut = {
    cls: 'sgs sg-pbuka', scene: 'none',
    play(run, done) {
      const MENU = ['rice', 'beans', 'egg', 'fish', 'meat', 'bread', 'water', 'yam', 'tomato'].filter((w) => K.en[w] && K.pic[w]);
      const ORDER = shuffle(MENU).slice(0, 7), WAIT = 15000, among = MENU.map(spoken); let r = 0, got = 0, coins = 0;
      const st = h('<div class="sg pbuka">' + bukaBack() + '<div class="pbcust"><div class="pbbub"><img alt=""><span class="pbwait"><i></i></span></div><div class="pbfig"></div></div>' +
        '<div class="pbserve">' + plateSvg + '</div><div class="pbcoins"></div></div>');
      const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
      run.clock(150, () => done({ right: got, part: got / ORDER.length }));
      run.remind = () => say(line('j-shayi', 'how'), run);
      const cust = st.querySelector('.pbcust'), img = cust.querySelector('img'), fill = cust.querySelector('.pbwait i'), figEl = cust.querySelector('.pbfig'), serve = st.querySelector('.pbserve'), purse = st.querySelector('.pbcoins');
      function next() {
        const w = ORDER[r], who = DINERS[r % DINERS.length]; run.item(w); let left = WAIT, over = false;
        figEl.innerHTML = '<svg viewBox="0 0 60 140" aria-hidden="true">' + person(30, 134, who.kind === 'boy' ? 104 : 136, { ...who, cls: '', al: 'hip', ar: 'hold' }) + '</svg>';
        cust.className = 'pbcust'; img.src = K.pic[w]; void cust.offsetWidth; cust.classList.add('come'); serve.className = 'pbserve'; fill.style.transform = 'scaleX(1)';
        const end = () => { over = true; cust.classList.remove('waiting'); };
        const miss = () => { end(); knock(160, .14, .4); cust.classList.add('sad'); mood(st, 'sad'); later(run, 1200, () => cust.classList.add('leave')); step(2600); };
        later(run, 900, () => { if (!run.dead) cust.classList.add('waiting'); });
        (function tick() { if (over || run.dead) return;
          if (!run.listening && !box.busy) { left -= 100; fill.style.transform = 'scaleX(' + Math.max(0, left / WAIT).toFixed(3) + ')'; }
          if (left <= 0) { box.busy = true; miss(); return; }
          later(run, 100, tick); })();
        autoRound(run, box, spoken(w), among, () => {
          end(); got++; run.good(cust.querySelector('.pbbub')); run.said = say(K.en[w], run); mood(st, 'cheer');
          serve.classList.add('fly'); later(run, 900, () => { serve.className = 'pbserve'; cust.classList.add('glad'); });
          later(run, 1300, () => { coins++; knock(1400, .05, .25); later(run, 120, () => knock(1250, .05, .2)); purse.innerHTML = Array.from({ length: Math.min(coins, 12) }, (_, k) => '<i style="--k:' + k + '"></i>').join(''); });
          later(run, 1900, () => cust.classList.add('leave')); step(3000);
        }, () => miss());
      }
      function step(ms) { later(run, ms, () => { r++; if (r >= ORDER.length) done({ right: got, finished: true, part: got / ORDER.length }); else next(); }); }
      next();
    },
  };

  /* ======================================================================================================
     Mile 12 Market (Nemo hoto, tap). Lagos's great foodstuff market at morning: the lorries in from the north being
     offloaded, porters with baskets on their heads, umbrellas, mountains of tomato baskets, pepper and onion sacks. Four
     traders sit behind their goods, each holding one up. Laila says a word; tap the trader holding it. Right: she pours
     it into the buyer's bag. Wrong: she shakes her head.
     ====================================================================================================== */
  function mileBack() {
    let g = '<defs>' + grad('pg-m12', ['#F6D29A', '#FBE6C0', '#F1E6CE']) + '</defs><rect width="320" height="200" fill="url(#pg-m12)"/>' + cloudy(50, 14, 1) + cloudy(240, 10, .8) + birdsAt(120, 20, 4);
        // the long sheds of the market, rusted zinc on poles, and the lorries backed up to them being unloaded
    g += '<rect x="0" y="32" width="320" height="62" fill="#B8A48A"/>' + zinc(-6, 326, 26, 10, 9);
    for (let k = 0; k < 9; k++) g += '<path d="M' + (8 + k * 38) + ' 36 V94" stroke="#6B5A44" stroke-width="2"/>';
    g += sign(150, 40, 124, 12, 'MILE 12 INTERNATIONAL MARKET', '#1F6B4A', '#FFFDF7', { fs: 5.6 });
    g += '<g transform="translate(64 96) scale(1.15)"><rect x="-30" y="-34" width="44" height="30" fill="#2E6B4A"/><path d="M-30 -34 h44" stroke="#1E4A32" stroke-width="2"/>' +
      Array.from({ length: 12 }, (_, j) => '<rect x="' + (-28 + (j % 6) * 7) + '" y="' + (-44 - Math.floor(j / 6) * 6) + '" width="6.4" height="6" rx="1" fill="#C8742A"/><path d="M' + (-28 + (j % 6) * 7) + ' ' + (-41 - Math.floor(j / 6) * 6) + ' h6.4" stroke="#8B4A1A" stroke-width=".5"/>').join('') +
      '<path d="M14 -24 h12 l6 10 v10 h-18 Z" fill="#E8A317"/><rect x="17" y="-21" width="9" height="6" fill="#2E3E48"/><circle cx="-20" cy="-3" r="5" fill="#1E1E24"/><circle cx="22" cy="-3" r="5" fill="#1E1E24"/>' +
      '<text x="-8" y="-12" text-anchor="middle" font-size="3.6" font-weight="800" font-family="Arial,sans-serif" fill="#F2C230">KANO - LAGOS</text></g>';
    // porters carrying baskets on their heads across the yard, umbrellas, the crowd
    g += '<path d="M0 96 H320 V200 H0 Z" fill="#A88A64"/>' + earth(100, '#A88A64', 10, 1).replace('<path d="M0 100 H320 V200 H0 Z" fill="#A88A64"/>', '');
    const tomBasket = '<path d="M-5 -2 L5 -2 L4 3 L-4 3 Z" fill="#C9A35A"/><circle cx="-2" cy="-3" r="1.6" fill="#D32F2F"/><circle cx="1.4" cy="-3.4" r="1.6" fill="#E53935"/><circle cx="0" cy="-4.6" r="1.4" fill="#C62828"/>';
    [[120, 0], [150, 1], [262, 2], [292, 3]].forEach(([x, k]) => { g += '<g class="sgw x-idle">' + person(x, 128, 40, ub(k + 2, { kind: 'man', robe: SHIRT[(k * 3) % 10], al: 'load', ar: k % 2 ? 'down' : 'load', load: tomBasket })) + '</g>'; });
    g += [[200, '#C62828', '#F2C230'], [236, '#1F3A78', '#FFFDF7']].map(([x, a, b]) => '<path d="M' + x + ' 130 V100" stroke="#5A4A3A" stroke-width="1"/><path d="M' + (x - 16) + ' 102 Q' + x + ' 88 ' + (x + 16) + ' 102 Z" fill="' + a + '"/><path d="M' + (x - 8) + ' 98 Q' + x + ' 89 ' + (x + 8) + ' 98 L' + x + ' 102 Z" fill="' + b + '" opacity=".9"/>').join('');
    // the mountains of produce in front: tomato baskets, pepper in basins, onion sacks, a heap of yams
    for (let k = 0; k < 7; k++) g += '<g transform="translate(' + (14 + k * 46) + ' 176)">' + tomBasket.replace(/-5 -2 L5 -2 L4 3 L-4 3/, '-9 -4 L9 -4 L7 4 L-7 4') + '</g>';
    g += basin(30, 196, 1.3, '#2E5E8A', ['#D32F2F', '#E8731A', '#C62828']) + basin(296, 196, 1.3, '#C62828', ['#C8A0D8', '#E8D7B8', '#B07AC2']);
    g += [[180, 196], [208, 194]].map(([x, y]) => '<path d="M' + (x - 10) + ' ' + y + ' Q' + (x - 12) + ' ' + (y - 18) + ' ' + x + ' ' + (y - 20) + ' Q' + (x + 12) + ' ' + (y - 18) + ' ' + (x + 10) + ' ' + y + ' Z" fill="#D8C49A"/><path d="M' + (x - 9) + ' ' + (y - 8) + ' h18" stroke="#B8A47A" stroke-width=".6"/>').join('');
    g += goat(240, 196, .9, '#E8E0D2', 1);
    return svgBack(g);
  }
  const TRADERS = [0, 1, 2, 3].map((k) => ub(k * 2 + 1, { kind: 'woman', robe: CLOTH.ank[k], wrap: CLOTH.ank[(k + 3) % 6], hat: k === 2 ? 'braids' : 'tie', hatc: TIEC[(k * 2 + 1) % 6], skin: (k * 2 + 1) % 6, al: 'up', ar: 'hip', tight: 0 }));
  const mile12 = {
    cls: 'sgs sg-pmile', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg pmile">' + mileBack() + '<div class="pmrow">' + [0, 1, 2, 3].map((k) => '<button type="button" class="pmt" style="--k:' + k + '" aria-label="trader ' + (k + 1) + '"><span class="pmitem"></span><span class="pmfig">' + fig({ ...TRADERS[k], cls: '' }) + '</span><span class="pmstall"></span></button>').join('') + '</div>' +
        '<span class="pmbag"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 12 L34 12 L32 38 L8 38 Z" fill="#2E5E8A"/><path d="M6 12 L34 12" stroke="#1E3A5A" stroke-width="2"/><path d="M12 12 Q20 0 28 12" stroke="#1E3A5A" stroke-width="2" fill="none"/><path d="M8 20 H32 M8 28 H32" stroke="#FFFDF7" stroke-opacity=".5" stroke-width="1.6"/></svg></span></div>');
      const ts = [...st.querySelectorAll('.pmt')], bag = st.querySelector('.pmbag');
      findIt(run, done, { st, n: 4, lead: 900,
        round: (set, pick) => { bag.className = 'pmbag'; ts.forEach((b, k) => {
          b.className = 'pmt'; b.querySelector('.pmitem').innerHTML = card(set[k]);
          later(run, 120 + k * 130, () => b.classList.add('up')); b.onclick = () => pick(b, set[k]); }); },
        right: (b) => { b.classList.add('sold'); later(run, 700, () => bag.classList.add('fill')); knocks(run, 3, 700, 110); },
        wrong: (b) => { b.classList.add('no'); } });
    },
  };

  /* ======================================================================================================
     Go-Slow Hawker (Abubuwa, speaking). Lagos traffic standing still under the flyover: yellow buses, cars, an okada
     weaving through, billboards, the sun. A hawker (always a grown-up) walks between the lanes and lifts one thing to a
     car window. Name it out loud in English: the driver's hand comes out with money and takes it, and the traffic moves
     a little. Wrong: the driver waves no and the hawker walks on.
     ====================================================================================================== */
  function goslowBack() {
    let g = '<defs>' + grad('pg-gs', ['#9ECFEB', '#D2E8F2', '#F0E6CE']) + '</defs><rect width="320" height="200" fill="url(#pg-gs)"/>' + cloudy(80, 16, 1.1) + cloudy(250, 10, .8) + birdsAt(200, 24, 3);
    // the far skyline, billboards on their legs, the flyover on its pillars
    g += town(70, false, '#B7C2C8', 6);
    g += '<path d="M220 72 V50 M260 72 V50" stroke="#6E6E6A" stroke-width="2"/>' + sign(206, 30, 70, 22, 'ENJOY COLD ZOBO', '#C62828', '#FFFDF7', { fs: 7, sub: 'MADE IN NAIJA' });
    g += '<path d="M30 72 V50" stroke="#6E6E6A" stroke-width="2"/>' + sign(6, 34, 52, 18, 'GOD IS IN CONTROL', '#1F3A78', '#F2C230', { fs: 5.4 });
    g += '<path d="M-4 78 Q160 66 324 78 V88 Q160 76 -4 88 Z" fill="#9A9890"/><path d="M-4 78 Q160 66 324 78" stroke="#7A7870" stroke-width="1.4" fill="none"/>' + [40, 120, 200, 280].map((x) => '<rect x="' + (x - 4) + '" y="84" width="8" height="30" fill="#8A8880"/>').join('');
    g += yellowBus(150, 76, .5, 'OSHODI') + car(70, 77, .5, '#E8E8E8') + car(250, 78, .5, '#C62828');
    // the road: three lanes of standing traffic, the median with its kerb painted black and white
    g += '<path d="M0 112 H320 V200 H0 Z" fill="#6A6864"/><path d="M0 112 H320" stroke="#4A4844" stroke-width="2"/>' + Array.from({ length: 16 }, (_, k) => '<rect x="' + (k * 20) + '" y="112" width="10" height="3" fill="' + (k % 2 ? '#1E1E24' : '#F4F1EA') + '"/>').join('');
    g += '<path d="M0 150 H320 M0 176 H320" stroke="#F4F1EA" stroke-width="1.2" stroke-dasharray="12 10" opacity=".7"/>';
    g += '<g class="pgedge">' + yellowBus(40, 146, 1, 'OJUELEGBA') + car(124, 146, 1, '#2E5E8A') + car(196, 146, 1, '#E8E8E8') + yellowBus(282, 146, 1, 'CMS') + '</g>';
    g += '<g class="pgedge2">' + car(18, 196, 1.2, '#1E1E24') + car(296, 196, 1.2, '#C62828', { flip: 1 }) + '</g>';
    g += okada(100, 170, 1.4, 4);
    return svgBack(g);
  }
  const goSlow = {
    cls: 'sgs sg-pslow', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg pslow">' + goslowBack() + '<div class="pshawk"><span class="pstray"></span><span class="psman"></span></div>' +
        '<div class="pscar">' + '<svg viewBox="0 0 120 82" aria-hidden="true"><ellipse cx="60" cy="78" rx="58" ry="3" fill="rgba(0,0,0,.3)"/><path d="M2 66 V36 Q2 28 10 26 L30 22 L46 6 Q50 2 58 2 H96 Q104 2 108 8 L118 26 V66 Z" fill="#E8A317"/><path d="M48 8 L34 24 H74 V8 Z M78 8 V24 H112 L104 10 Q102 8 98 8 Z" fill="#2E3E48"/>' +
        '<circle cx="92" cy="17" r="5" fill="#5E3A1C"/><path d="M82 24 Q84 18 92 18 Q100 18 102 24 Z" fill="#F4F1EA"/><rect x="2" y="46" width="116" height="5" fill="#1E1E24" opacity=".8"/><path d="M8 40 h104" stroke="#C62828" stroke-width="1.6"/>' +
        '<circle cx="26" cy="66" r="11" fill="#1E1E24"/><circle cx="26" cy="66" r="5" fill="#9AA0A6"/><circle cx="96" cy="66" r="11" fill="#1E1E24"/><circle cx="96" cy="66" r="5" fill="#9AA0A6"/><rect x="112" y="30" width="6" height="4" rx="1" fill="#FFE7A3"/>' +
        '<path d="M52 10 L40 22" stroke="#9FC8DA" stroke-width="2" opacity=".5"/><path d="M2 44 H118" stroke="#000" stroke-opacity=".15" stroke-width="2"/><rect x="60" y="34" width="10" height="3" rx="1.4" fill="#5A3A1E"/></svg>' +
        '<span class="pshand"><svg viewBox="0 0 40 20" aria-hidden="true"><path d="M0 8 H24 Q30 8 30 12 Q30 16 24 16 H0 Z" fill="#7A4A26"/><rect x="20" y="0" width="18" height="10" rx="1" fill="#C9E0B0" stroke="#5E8A3E"/></svg></span></div></div>');
      const hk = st.querySelector('.pshawk'), tray = st.querySelector('.pstray'), man = st.querySelector('.psman'), carEl = st.querySelector('.pscar');
      nameIt(run, done, { st, gid: 'j-dillali', wait: 1300,
        show: (w, r) => { tray.innerHTML = card(w); man.innerHTML = fig(ub(r * 3 + 1, { kind: r % 2 ? 'woman' : 'man', tight: 1, al: 'up', ar: 'up' }));
          hk.className = 'pshawk'; carEl.className = 'pscar'; void hk.offsetWidth; hk.classList.add('in'); },
        right: () => { carEl.classList.add('buy'); knocks(run, 2, 1300, 120); later(run, 900, () => hk.classList.add('sold')); later(run, 1500, () => { st.classList.add('move'); later(run, 1200, () => st.classList.remove('move')); }); },
        wrong: () => { carEl.classList.add('wave'); horn(true); later(run, 700, () => hk.classList.add('out')); } });
    },
  };

  /* ======================================================================================================
     Carnival Calabar (Haruffa, speaking). December on the carnival route: crowds packed behind the barriers, the
     judges' stand, the sponsors' banners, a float in the distance. A band dances up behind its banner with a letter on
     it. Say the letter: the band dances past and the crowd waves. Wrong: the band stops and turns back.
     ====================================================================================================== */
  function carnivalBack() {
    let g = '<defs>' + grad('pg-cc', ['#86C4EA', '#C2E2F2', '#F6E8CC']) + '</defs><rect width="320" height="200" fill="url(#pg-cc)"/>' + cloudy(60, 14, 1) + cloudy(200, 8, .9) + birdsAt(260, 20, 3);
    // the town behind, the hills, palms; the judges' stand with its canopy and the streamer-hung poles
    g += '<path d="M0 64 Q60 44 130 56 T260 50 T330 60 V80 H0 Z" fill="#8FB89A"/>' + town(80, false, '#D9D0BE', 8);
    g += '<rect x="214" y="44" width="100" height="38" fill="#F4F1EA"/><path d="M210 44 L264 30 L318 44 Z" fill="#1F6B4A"/><path d="M210 44 L264 30 L240 44 Z" fill="#FFFDF7" opacity=".7"/>' +
      sign(220, 48, 88, 10, 'CALABAR CARNIVAL · JUDGES', '#C62828', '#FFFDF7', { fs: 4.6 }) + [232, 252, 272, 292].map((x, k) => person(x, 82, 22, ub(k + 3, { kind: k % 2 ? 'woman' : 'man', al: 'clap', ar: 'clap' }))).join('');
    g += Array.from({ length: 7 }, (_, k) => '<path d="M' + (10 + k * 30) + ' 86 V40" stroke="#6B4226" stroke-width="1.2"/>' + Array.from({ length: 4 }, (_, j) => '<path class="x-flag" style="animation-delay:-' + ((k + j) * .3).toFixed(1) + 's" d="M' + (10 + k * 30) + ' ' + (42 + j * 4) + ' q' + (j % 2 ? 5 : -5) + ' 6 ' + (j % 2 ? 1 : -1) + ' 14" stroke="' + ['#E53935', '#F2C230', '#1E88E5', '#43A047'][(k + j) % 4] + '" stroke-width="1.4" fill="none"/>').join('')).join('');
    // the far float: a big painted head on a lorry
    g += '<g transform="translate(150 84)"><rect x="-24" y="-8" width="48" height="8" fill="#E8A317"/><circle cx="0" cy="-20" r="12" fill="#43A047"/><circle cx="-4" cy="-22" r="2" fill="#FFFDF7"/><circle cx="4" cy="-22" r="2" fill="#FFFDF7"/><path d="M-5 -15 Q0 -11 5 -15" stroke="#FFFDF7" stroke-width="1.4" fill="none"/><circle cx="-14" cy="0" r="3" fill="#1E1E24"/><circle cx="14" cy="0" r="3" fill="#1E1E24"/></g>';
    // the road, tarred, and the crowd behind the barriers on both sides
    g += '<path d="M0 90 H320 V200 H0 Z" fill="#7A7874"/><path d="M0 100 H320" stroke="#F4F1EA" stroke-width="1" stroke-dasharray="10 8" opacity=".6"/>';
    g += folk(0, 320, 104, 15, 30, 7, { al: 'wave' });
    g += '<path d="M0 108 H320" stroke="#C62828" stroke-width="2"/>' + Array.from({ length: 21 }, (_, k) => '<path d="M' + (k * 16) + ' 108 v-8 M' + (k * 16) + ' 100 h16" stroke="#E8E8E8" stroke-width="1.2"/>').join('');
    g += folk(0, 70, 196, 3, 70, 9, { al: 'wave', ar: 'clap' }) + folk(254, 320, 196, 3, 70, 11, { al: 'clap', ar: 'wave' });
    return svgBack(g);
  }
  /** a carnival dancer: the person, a feathered headdress and wings of cloth (o.behind is drawn behind the body) */
  const DANCE = [['#E53935', '#F2C230'], ['#1E88E5', '#F4F1EA'], ['#43A047', '#F2C230'], ['#8E24AA', '#FF8A65'], ['#F2C230', '#E53935']];
  const dancer = (k, hh = 136) => { const [a, b] = DANCE[k % DANCE.length];
    const plumes = [-50, -30, -10, 10, 30, 50].map((d, j) => '<path d="M30 16 Q' + (30 + d * .5) + ' ' + (-2 - Math.abs(d) * .1) + ' ' + (30 + d * .7) + ' ' + (-14 + Math.abs(d) * .2) + '" stroke="' + (j % 2 ? a : b) + '" stroke-width="3.4" stroke-linecap="round" fill="none"/>').join('');
    const wings = '<path d="M14 44 Q-8 60 -2 92 Q10 80 18 70 Z" fill="' + a + '" opacity=".9"/><path d="M46 44 Q68 60 62 92 Q50 80 42 70 Z" fill="' + a + '" opacity=".9"/><path d="M14 44 Q0 62 2 84 M46 44 Q60 62 58 84" stroke="' + b + '" stroke-width="1.6" fill="none"/>';
    return fig({ kind: k % 2 ? 'woman' : 'man', robe: a, wrap: b, trou: b, tight: 1, hat: 'hair', skin: k % 6, al: k % 2 ? 'up' : 'wave', ar: k % 2 ? 'wave' : 'up', behind: plumes + wings }, hh); };
  const carnival = {
    cls: 'sgs sg-pcarn', scene: 'none', noHow: false,
    play(run, done) {
      const st = h('<div class="sg pcarn">' + carnivalBack() + '<div class="pcrow sgrow"></div><div class="pcband"><span class="pcban"><b></b></span>' +
        [0, 1, 2].map((k) => '<span class="pcd" style="--k:' + k + '"></span>').join('') + '</div></div>');
      const band = st.querySelector('.pcband'), ban = band.querySelector('b'), ds = [...band.querySelectorAll('.pcd')];
      letterSay(run, done, { st, row: '.pcrow', ms: 3200,
        show: (L, i) => { ban.textContent = L; ds.forEach((d, k) => { d.innerHTML = dancer(i * 3 + k, k === 1 ? 140 : 128); }); band.className = 'pcband'; void band.offsetWidth; band.classList.add('in'); knocks(run, 3, 220, 140); },
        right: () => { band.classList.add('dance'); knocks(run, 6, 260, 160); later(run, 1500, () => band.classList.add('past')); },
        wrong: () => { band.classList.add('stop'); knock(140, .2, .4); later(run, 1200, () => band.classList.add('back')); } });
    },
  };

  /* ======================================================================================================
     Viewing Centre (Karatu, speaking). The football viewing centre: a zinc shed with its benches, a TV on a shelf, the
     generator outside, fans waiting in their jerseys. The word of the day is chalked on the board at the door. Read
     it out loud: the TV comes on, the match is on, the fans jump. Wrong: the screen stays snow.
     ====================================================================================================== */
  function viewingBack() {
    let g = '<defs>' + grad('pg-vc', ['#F2C88E', '#F6DEB4', '#EFE2C8']) + '</defs><rect width="320" height="200" fill="url(#pg-vc)"/>' + cloudy(240, 12, .9) + birdsAt(40, 16, 3);
    // the shed: block wall half-plastered, zinc roof, open front, the painted name
    g += '<rect x="20" y="34" width="290" height="104" fill="#B8A88E"/>' + weather(20, 34, 290, 104, '#2A1A10', 11) + zinc(14, 316, 24, 12, 11);
    g += sign(30, 38, 150, 14, 'GOAL GETTERS VIEWING CENTRE', '#1F6B4A', '#FFFDF7', { fs: 6.2, sub: 'ALL LEAGUES · ₦100 ENTRY' });
    g += '<rect x="96" y="58" width="190" height="80" fill="#3A2E28"/>';
    // inside: the benches, the fans waiting, all facing the TV on its shelf
    for (let r = 0; r < 3; r++) { const y = 104 + r * 14;
      g += folk(176 - r * 4, 280 + r * 4, y + 6, 5 + r, 34 + r * 4, r + 12, { al: r === 1 ? 'clap' : 'down', ar: 'hip' });
      g += '<rect x="' + (170 - r * 6) + '" y="' + y + '" width="' + (114 + r * 12) + '" height="8" fill="#7A4E2A"/><path d="M' + (170 - r * 6) + ' ' + y + ' h' + (114 + r * 12) + '" stroke="#A0703E" stroke-width="1"/>'; }
    g += '<rect x="218" y="69" width="68" height="4" fill="#8B5A2B"/><path d="M224 73 l4 8 M280 73 l-4 8" stroke="#6B4226" stroke-width="1.6"/>';
    // the generator outside, a poster of the league table, a plastic chair, a tray of groundnut and a cold drink cooler
    g += '<rect x="34" y="62" width="40" height="52" fill="#F4F1EA" stroke="#9A9A96"/><text x="54" y="70" text-anchor="middle" font-size="4" font-weight="800" font-family="Arial,sans-serif" fill="#1F3A78">LEAGUE TABLE</text>' +
      Array.from({ length: 7 }, (_, k) => '<path d="M38 ' + (75 + k * 5.4) + ' h32" stroke="#9AA6AE" stroke-width="1.2"/>').join('');
    g += '<path d="M0 138 H320 V200 H0 Z" fill="#B48C60"/>' + earth(138, '#B48C60', 12, 1).replace('<path d="M0 138 H320 V200 H0 Z" fill="#B48C60"/>', '');
    g += '<g class="pggen">' + gen(290, 168, 1.6) + '</g>' + chair(250, 178, 1.1, '#C62828');
    g += '<g class="sgw x-idle">' + person(20, 196, 62, ub(2, { kind: 'man', robe: '#1E88E5', al: 'hip', ar: 'fwd' })) + '</g>';
    g += '<g class="sgw">' + person(300, 196, 58, ub(4, { kind: 'man', robe: '#E53935', al: 'up', ar: 'hip', flip: 1 })) + '</g>';
    return svgBack(g);
  }
  const viewing = {
    cls: 'sgs sg-pview', scene: 'none',
    play(run, done) {
      const st = h('<div class="sg pview">' + viewingBack() + '<div class="pvtv"><span class="pvscreen"><i class="pvsnow"></i><span class="pvpitch"><i class="pvball"></i></span></span><b class="pvgoal">GOAL!</b></div>' +
        '<div class="pvboard"><span class="pvtop">TODAY</span><b class="pvw"></b></div></div>');
      const tv = st.querySelector('.pvtv'), board = st.querySelector('.pvboard'), ww = st.querySelector('.pvw');
      readAloud(run, done, { st, ms: 3800,
        show: (t) => { ww.textContent = t; ww.className = 'pvw l' + Math.min(12, Math.max(4, t.length)); tv.className = 'pvtv'; board.className = 'pvboard'; void board.offsetWidth; board.classList.add('up'); },
        right: () => { tv.classList.add('on'); later(run, 900, () => { tv.classList.add('goal'); st.classList.add('jump'); knocks(run, 4, 700, 110); later(run, 1400, () => st.classList.remove('jump')); }); },
        wrong: () => { tv.classList.add('snow'); knock(120, .3, .3); } });
    },
  };

  return { 'j-rubutu-say': upNepa, 'j-suya': puffPuff, 'j-shanu': village, 'j-shayi': mamaPut, 'j-nemo': mile12, 'j-dillali': goSlow, 'j-durbar': carnival, 'j-ruwa': viewing };
}
