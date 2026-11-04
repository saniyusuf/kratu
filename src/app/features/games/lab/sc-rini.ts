// @ts-nocheck
import { person, neem, zanko, bird, goat, dk, lt, f1 } from './sc-jirgi';
import { liveAC } from './audioctx';
/*
 * Karofi (the Kano dye pits), a Rubutu game (Sani 2026-11-02: "super realistic with good details and performant").
 * The old indigo dye pits outside Kofar Mata in Kano, in the morning. Behind, the red-earth city wall (ganuwa) with its
 * buttresses and zanko horns, and the gate itself; neem trees over the wall. Lines of dyed cloth hang to dry: deep indigo
 * with white circles, stripes and ladders where the cloth was tied, and a few lighter blues. On the packed earth the pits
 * sit in their round raised rims, their surface dark indigo with a coppery froth. A dyer stirs his pit with a long pole;
 * another lifts a dripping cloth; a third, seated on a log, beats folded cloth with two mallets to give it its sheen. A
 * woman and a girl choose cloth; a boy watches; a goat noses at a bundle. Pots and bags of ash and indigo stand about.
 *
 * The game (games2.ts 'j-rini'): a white cloth hangs on the dyers' frame with the picture pinned at its corner. Say or
 * tap the letters of its name: each right letter is dyed into the cloth, white on indigo (the resist), with a splash.
 * A wrong letter spoils the cloth with a rust stain and the next cloth comes. A word finished: the whole cloth goes
 * indigo round its white letters and is carried off to the drying line.
 *
 * Transform and opacity only; the scene is one fixed drawing, built once (rest.ts).
 * Classes for sc-rini.css: people .x-fig .x-head .x-al .x-ar .x-wv .x-cl .x-ms .x-mf; idle .x-cloth .x-stir .x-beat .x-drip
 * .x-bird .x-goat .x-froth
 */
const P = 'rn4';
const u = (id) => 'url(#' + P + '-' + id + ')';
const lg = (id, c, y1 = 0, y2 = 1, x1 = 0, x2 = 0) => '<linearGradient id="' + P + '-' + id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' +
  c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const rg = (id, c, op = [1, 0], cx = 0.5, cy = 0.5, r = 0.5) => '<radialGradient id="' + P + '-' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">' +
  '<stop offset="0" stop-color="' + c + '" stop-opacity="' + op[0] + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="' + op[1] + '"/></radialGradient>';

/* ---------- the dyed cloths: tie-dye (adire-like) patterns of the Kano pits, white resist on indigo ---------- */
const INDIGO = ['#1B2A6B', '#22337A', '#16245E', '#2B3F8C', '#3D5AA8'];
/** the other colours the pits sell today beside indigo: kola brown, maroon, green, purple, gold, sky blue */
const DYES = ['#7A3A1E', '#7A1F2B', '#2E6B3A', '#5B2C6F', '#B9811E', '#2F7FB0', '#0F5E5A'];
function pattern(kind, w, h, c) {
  const W = '#E9EEF6';
  if (kind === 0) {   // rows of small tied circles
    let s = ''; for (let y = 3; y < h - 1; y += 4.2) for (let x = 2.6 + ((y / 4.2) % 2) * 1.6; x < w - 1; x += 3.4) s += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r=".9"/><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r=".35" fill="' + c + '"/>';
    return '<g fill="' + W + '" opacity=".85">' + s + '</g>';
  }
  if (kind === 1) {   // stitched stripes and a ladder down the middle
    let s = ''; for (let y = 2.4; y < h; y += 3.6) s += 'M1 ' + f1(y) + ' H' + f1(w - 1) + ' ';
    return '<path d="' + s + '" stroke="' + W + '" stroke-width=".5" stroke-dasharray="1.2 .8" opacity=".75"/><path d="M' + f1(w / 2 - 1.4) + ' 1 V' + f1(h - 1) + ' M' + f1(w / 2 + 1.4) + ' 1 V' + f1(h - 1) + '" stroke="' + W + '" stroke-width=".6" opacity=".7"/>';
  }
  if (kind === 2) {   // big tied rings
    let s = ''; for (let y = 5; y < h; y += 9) for (let x = 4.6 + ((y / 9) % 2) * 3; x < w; x += 7) s += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="2.6"/><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="1.2"/>';
    return '<g fill="none" stroke="' + W + '" stroke-width=".55" opacity=".8">' + s + '</g>';
  }
  if (kind === 4) {   // folded on the bias: diagonal bands
    let s = ''; for (let x = -h; x < w; x += 4.2) s += 'M' + f1(x) + ' 0 l' + h + ' ' + h + ' ';
    return '<path d="' + s + '" stroke="' + W + '" stroke-width=".9" opacity=".6"/>';
  }
  if (kind === 5) {   // one big sunburst, tied from the middle
    const cx = w / 2, cy = h * 0.46; let s = '', r = '';
    for (let a = 0; a < 360; a += 22.5) { const t = a * Math.PI / 180; s += 'M' + f1(cx + Math.cos(t) * 4) + ' ' + f1(cy + Math.sin(t) * 4) + ' L' + f1(cx + Math.cos(t) * 9) + ' ' + f1(cy + Math.sin(t) * 9) + ' '; }
    for (const rr of [2, 5.6, 9.6]) r += '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + rr + '"/>';
    return '<g fill="none" stroke="' + W + '" stroke-width=".6" opacity=".75">' + r + '<path d="' + s + '"/></g>';
  }
  if (kind === 6) {   // stitched zigzags
    let s = ''; for (let y = 3; y < h; y += 5) { s += 'M0 ' + f1(y); for (let x = 0; x < w; x += 3) s += ' L' + f1(x + 1.5) + ' ' + f1(y - 1.6) + ' L' + f1(x + 3) + ' ' + f1(y); s += ' '; }
    return '<path d="' + s + '" fill="none" stroke="' + W + '" stroke-width=".55" opacity=".7"/>';
  }
  if (kind === 7) {   // dipped twice: a deeper band at the foot, a dotted line where the dips meet
    return '<rect y="' + f1(h * 0.55) + '" width="' + w + '" height="' + f1(h * 0.5) + '" fill="#000" opacity=".22"/><path d="M0 ' + f1(h * 0.55) + ' H' + w + '" stroke="' + W + '" stroke-width=".6" stroke-dasharray=".6 1.2" opacity=".8"/>' +
      '<g fill="' + W + '" opacity=".6"><circle cx="' + f1(w * 0.3) + '" cy="' + f1(h * 0.28) + '" r="1.2"/><circle cx="' + f1(w * 0.7) + '" cy="' + f1(h * 0.28) + '" r="1.2"/><circle cx="' + f1(w * 0.5) + '" cy="' + f1(h * 0.78) + '" r="1.4"/></g>';
  }
  // folded-and-clamped squares
  let s = ''; for (let y = 2; y < h - 2; y += 6) for (let x = 2; x < w - 2; x += 6) s += 'M' + x + ' ' + y + ' h3 v3 h-3 Z ';
  return '<path d="' + s + '" fill="none" stroke="' + W + '" stroke-width=".5" opacity=".7"/>';
}
/** a cloth hanging over a line at (x, y): width w, drop h; the fold over the line, a soft sag, its tie-dye pattern */
function hanging(x, y, w, h, c, kind, cls = '') {
  const id = P + '-cl' + x + '-' + y;
  return '<g class="x-cloth ' + cls + '" style="transform-origin:' + f1(x + w / 2) + 'px ' + y + 'px"><clipPath id="' + id + '"><path d="M0 0 H' + w + ' V' + f1(h - 1) + ' Q' + f1(w * 0.75) + ' ' + f1(h + 1.2) + ' ' + f1(w / 2) + ' ' + h + ' Q' + f1(w * 0.25) + ' ' + f1(h - 1.2) + ' 0 ' + f1(h + 0.4) + ' Z"/></clipPath>' +
    '<g transform="translate(' + x + ' ' + y + ')"><g clip-path="url(#' + id + ')"><rect width="' + w + '" height="' + (h + 2) + '" fill="' + c + '"/>' + pattern(kind, w, h, c) +
    '<path d="M' + f1(w * 0.3) + ' 0 V' + h + ' M' + f1(w * 0.68) + ' 0 V' + h + '" stroke="#000" stroke-width="1.6" opacity=".14"/><path d="M' + f1(w * 0.48) + ' 0 V' + h + '" stroke="#fff" stroke-width="1.2" opacity=".08"/></g>' +
    '<path d="M-.4 -.6 H' + f1(w + 0.4) + ' V1.6 H-.4 Z" fill="' + dk(c, 0.25) + '"/></g></g>';
}
/** a dye pit: a raised round rim of cement and mud, indigo inside with a coppery froth and a sheen; centre (x, y), rx */
function pit(x, y, rx, k) {
  const ry = rx * 0.34;
  return '<g><ellipse cx="' + x + '" cy="' + f1(y + ry * 0.5) + '" rx="' + f1(rx * 1.12) + '" ry="' + f1(ry * 1.25) + '" fill="rgba(40,20,6,.28)"/>' +
    '<ellipse cx="' + x + '" cy="' + y + '" rx="' + f1(rx * 1.08) + '" ry="' + f1(ry * 1.16) + '" fill="' + u('rim') + '"/>' +
    '<path d="M' + f1(x - rx * 1.08) + ' ' + y + ' Q' + x + ' ' + f1(y + ry * 1.9) + ' ' + f1(x + rx * 1.08) + ' ' + y + ' V' + f1(y + ry * 0.5) + ' Q' + x + ' ' + f1(y + ry * 2.4) + ' ' + f1(x - rx * 1.08) + ' ' + f1(y + ry * 0.5) + ' Z" fill="#8E7356"/>' +
    '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + u('dye') + '"/>' +
    '<g class="x-froth f' + k + '"><ellipse cx="' + f1(x - rx * 0.2) + '" cy="' + f1(y - ry * 0.1) + '" rx="' + f1(rx * 0.36) + '" ry="' + f1(ry * 0.36) + '" fill="#6B4A7A" opacity=".75"/>' +
    '<ellipse cx="' + f1(x - rx * 0.24) + '" cy="' + f1(y - ry * 0.16) + '" rx="' + f1(rx * 0.22) + '" ry="' + f1(ry * 0.2) + '" fill="#A8743E" opacity=".75"/>' +
    '<g fill="#C9A06A" opacity=".8"><circle cx="' + f1(x - rx * 0.36) + '" cy="' + f1(y - ry * 0.05) + '" r="' + f1(rx * 0.04) + '"/><circle cx="' + f1(x - rx * 0.1) + '" cy="' + f1(y + ry * 0.08) + '" r="' + f1(rx * 0.05) + '"/><circle cx="' + f1(x - rx * 0.02) + '" cy="' + f1(y - ry * 0.2) + '" r="' + f1(rx * 0.03) + '"/></g></g>' +
    '<path d="M' + f1(x + rx * 0.2) + ' ' + f1(y - ry * 0.5) + ' Q' + f1(x + rx * 0.55) + ' ' + f1(y - ry * 0.4) + ' ' + f1(x + rx * 0.7) + ' ' + f1(y - ry * 0.1) + '" stroke="#9DB2E6" stroke-width=".7" fill="none" opacity=".45"/>' +
    // the coppery sheen on the dye, rippling out as the pole stirs
    '<g class="x-sheen s' + (k % 3) + '"><ellipse cx="' + x + '" cy="' + y + '" rx="' + f1(rx * 0.55) + '" ry="' + f1(ry * 0.5) + '" fill="none" stroke="#B88A5A" stroke-width=".5"/><ellipse cx="' + x + '" cy="' + y + '" rx="' + f1(rx * 0.8) + '" ry="' + f1(ry * 0.74) + '" fill="none" stroke="#8FA4D8" stroke-width=".4"/></g>' +
    '<path d="M' + f1(x - rx * 1.06) + ' ' + f1(y - 0.3) + ' Q' + x + ' ' + f1(y - ry * 1.3) + ' ' + f1(x + rx * 1.06) + ' ' + f1(y - 0.3) + '" stroke="#D9C7AA" stroke-width=".6" fill="none" opacity=".7"/>' +
    '<g fill="#1B2A6B" opacity=".55"><path d="M' + f1(x + rx * 0.9) + ' ' + f1(y + ry * 0.6) + ' q.5 2.4 0 3.6 q-.6 -1.2 0 -3.6 Z"/><path d="M' + f1(x - rx * 0.7) + ' ' + f1(y + ry * 0.9) + ' q.4 1.8 0 2.8 q-.5 -1 0 -2.8 Z"/></g></g>';
}
/** a clay pot (of ash water or indigo leaf), base centre (x, y), width w */
const pot = (x, y, w, c = '#A85C34') => '<g><ellipse cx="' + x + '" cy="' + f1(y + 0.4) + '" rx="' + f1(w * 0.55) + '" ry="' + f1(w * 0.12) + '" fill="rgba(40,20,6,.3)"/>' +
  '<path d="M' + f1(x - w * 0.28) + ' ' + y + ' Q' + f1(x - w * 0.62) + ' ' + f1(y - w * 0.5) + ' ' + f1(x - w * 0.26) + ' ' + f1(y - w * 0.86) + ' H' + f1(x + w * 0.26) + ' Q' + f1(x + w * 0.62) + ' ' + f1(y - w * 0.5) + ' ' + f1(x + w * 0.28) + ' ' + y + ' Z" fill="' + c + '"/>' +
  '<path d="M' + x + ' ' + f1(y - w * 0.86) + ' H' + f1(x + w * 0.26) + ' Q' + f1(x + w * 0.62) + ' ' + f1(y - w * 0.5) + ' ' + f1(x + w * 0.28) + ' ' + y + ' H' + x + ' Z" fill="' + dk(c, 0.18) + '"/>' +
  '<ellipse cx="' + x + '" cy="' + f1(y - w * 0.86) + '" rx="' + f1(w * 0.3) + '" ry="' + f1(w * 0.08) + '" fill="' + dk(c, 0.4) + '"/><path d="M' + f1(x - w * 0.4) + ' ' + f1(y - w * 0.56) + ' Q' + x + ' ' + f1(y - w * 0.48) + ' ' + f1(x + w * 0.4) + ' ' + f1(y - w * 0.56) + '" stroke="' + lt(c, 0.25) + '" stroke-width=".5" fill="none"/></g>';
/** a folded stack of finished cloth, base (x, y) */
const stack = (x, y, cs) => '<g>' + cs.map((c, i) => '<path d="M' + x + ' ' + f1(y - i * 2.4) + ' h18 l-.6 -2.4 h-16.8 Z" fill="' + c + '"/><path d="M' + f1(x + 0.6) + ' ' + f1(y - i * 2.4 - 1.2) + ' h16.8" stroke="#fff" stroke-width=".25" opacity=".4"/>').join('') +
  '<path d="M' + x + ' ' + y + ' h18" stroke="rgba(0,0,0,.25)" stroke-width=".6"/></g>';

export function riniScene(): string {
  const defs = '<defs>' +
    lg('sky', ['#9CC7E2', '#BFDCEB', '#E8E6D6', '#F2DDB4'], 0, 1) +
    lg('wall', ['#C47A44', '#B56C3A', '#9E5A2E'], 0, 1) +
    lg('ground', ['#C79A64', '#BB8C58', '#A9784A'], 0, 1) +
    lg('rim', ['#D6C3A2', '#B9A27E'], 0, 1) +
    rg('dye', '#101A48', [1, 0.92], 0.42, 0.4, 0.7) +
    rg('sun', '#FFF2C8', [0.9, 0], 0.5, 0.5, 0.5) +
    rg('vign', '#1A1208', [0, 0.32], 0.5, 0.42, 0.78) + '</defs>';
  const sky = '<rect width="320" height="110" fill="' + u('sky') + '"/><circle cx="262" cy="20" r="34" fill="' + u('sun') + '"/>' +
    '<g fill="#fff" opacity=".7"><ellipse cx="60" cy="22" rx="18" ry="3"/><ellipse cx="70" cy="19.6" rx="9" ry="3.4"/><ellipse cx="200" cy="34" rx="14" ry="2.4"/></g>' +
    bird(100, 30, 1, 'b1') + bird(110, 26, 0.8, 'b2') + bird(214, 44, 0.9, 'b3');
  // the city wall and Kofar Mata gate
  let butt = '';
  for (let x = 6; x < 320; x += 26) if (x < 242 || x > 316) butt += '<path d="M' + x + ' 104 L' + (x + 1.6) + ' 66 H' + (x + 7.4) + ' L' + (x + 9) + ' 104 Z"/>';
  const wall = neem(30, 72, 1.4) + neem(222, 70, 1.6) + neem(300, 74, 1.2) +
    '<g fill="#E0CDA6"><path d="M268 56 L270 30 Q123 27 126 30 L128 56 Z"/></g><path d="M270.6 34 h5 M270.2 42 h5.6" stroke="#2E7D32" stroke-width=".8"/><path d="M271 30 L273 23 L275 30 Z" fill="#2E7D32"/>' +
    '<path d="M0 70 H320 V106 H0 Z" fill="' + u('wall') + '"/>' + zanko(0, 318, 70, 5.2, '#B56C3A') +
    '<g fill="#A55E30" opacity=".85">' + butt + '</g>' +
    '<path d="M0 70 H320" stroke="#D99464" stroke-width=".8" opacity=".6"/>' +
    '<g fill="#8A4A24" opacity=".35">' + Array.from({ length: 30 }, (_, k) => '<rect x="' + ((k * 41) % 316) + '" y="' + (74 + (k * 13) % 28) + '" width="' + (2 + (k % 3)) + '" height=".8" rx=".4"/>').join('') + '</g>' +
    '<g transform="translate(150 0)">' +
    // the gate: twin towers and a deep pointed arch, with its old wooden doors folded back
    '<path d="M98 106 V54 H112 L113 50 L118 54 V106 Z M142 106 V54 L147 50 L148 54 H162 V106 Z" fill="#C98048"/>' + zanko(98, 116, 54, 4.4, '#C98048') + zanko(142, 160, 54, 4.4, '#C98048') +
    '<path d="M112 106 V64 H148 V106 Z" fill="#BD7442"/>' + zanko(112, 146, 64, 4.4, '#BD7442') +
    '<path d="M118 106 V84 Q130 66 142 84 V106 Z" fill="#3A2214"/><path d="M118 106 V84 Q130 66 142 84 V86 Q130 70 118 86 Z" fill="#E2B27E" opacity=".55"/>' +
    '<path d="M118.6 106 V86 L124 90 V106 Z M141.4 106 V86 L136 90 V106 Z" fill="#6B4022"/><path d="M120 92 v12 M122.4 93 v11 M140 92 v12 M137.6 93 v11" stroke="#4A2A14" stroke-width=".5"/>' +
    '<path d="M101 64 h4 v8 h-4 Z M155 64 h4 v8 h-4 Z" fill="#4A2A14"/><path d="M101 64 q2 -3 4 0 M155 64 q2 -3 4 0" fill="#4A2A14"/>' +
    '<g fill="#F4EBD0" opacity=".75"><path d="M126 76 l1.2 -2 l1.2 2 Z M131.6 76 l1.2 -2 l1.2 2 Z"/></g>' + '</g>';
  // the ground, the drying lines and their cloths
  const pole = (x, y0, y1) => '<path d="M' + x + ' ' + y1 + ' V' + y0 + '" stroke="#6B4A2A" stroke-width="1.6"/><path d="M' + (x - 1.2) + ' ' + y0 + ' l1.2 -1.6 l1.2 1.6" stroke="#6B4A2A" stroke-width="1" fill="none"/>';
  const lines = pole(4, 86, 128) + pole(92, 84, 124) + pole(170, 86, 124) + pole(250, 84, 126) + pole(318, 86, 128) +
    '<path d="M4 87 Q48 92 92 85 M170 87 Q210 92 250 85 Q284 92 318 87" stroke="#3A2A1A" stroke-width=".5" fill="none"/>' +
    hanging(10, 88.4, 16, 26, INDIGO[0], 5, 'c1') + hanging(28, 89.4, 14, 24, DYES[1], 4, 'c2') + hanging(44, 89.6, 18, 27, INDIGO[3], 2, 'c3') + hanging(64, 89, 14, 22, DYES[4], 6, 'c1') +
    hanging(176, 88.6, 16, 25, DYES[2], 0, 'c2') + hanging(194, 89.6, 15, 24, INDIGO[0], 7, 'c3') + hanging(212, 89.4, 16, 23, DYES[3], 5, 'c1') + hanging(230, 88, 15, 25, INDIGO[2], 3, 'c2') +
    hanging(256, 88.4, 15, 26, DYES[0], 6, 'c3') + hanging(274, 89.4, 17, 24, INDIGO[1], 4, 'c1') + hanging(294, 89, 16, 25, DYES[6], 1, 'c2');
  const ground = '<path d="M0 104 Q160 100 320 104 V200 H0 Z" fill="' + u('ground') + '"/>' +
    '<g fill="#8E6438" opacity=".22">' + Array.from({ length: 46 }, (_, k) => '<ellipse cx="' + ((k * 67) % 320) + '" cy="' + (110 + (k * 31) % 88) + '" rx="' + (0.8 + (k % 4) * 0.5) + '" ry=".45"/>').join('') + '</g>' +
    '<g fill="#1B2A6B" opacity=".12"><ellipse cx="70" cy="150" rx="26" ry="5"/><ellipse cx="262" cy="148" rx="30" ry="6"/><ellipse cx="150" cy="128" rx="20" ry="3"/></g>';
  // the pits, nearest the edges so the middle stays open for the game's cloth and Laila
  const pits = pit(150, 122, 9, 0) + pit(186, 120, 8, 1) + pit(36, 136, 13, 2) + pit(78, 150, 12, 3) + pit(250, 142, 13, 4) + pit(292, 160, 12, 5);
  // the dyers and their work
  const pole2 = '<path d="M44 50 L94 136" stroke="#7A5A34" stroke-width="2.6" stroke-linecap="round"/><path d="M90 129 L94 136" stroke="#1B2A6B" stroke-width="2.8" stroke-linecap="round"/>';
  // the cloth he lifts from the pit, held up in both hands, dripping
  const lift = '<path d="M1 68 Q30 72 59 68 L57 116 Q30 121 3 116 Z" fill="#1B2A6B"/><path d="M1 68 Q30 72 59 68 L59 72 Q30 76 1 72 Z" fill="#2B3F8C"/>' +
    '<g fill="none" stroke="#E9EEF6" stroke-width="1" opacity=".75"><circle cx="13" cy="84" r="3.4"/><circle cx="30" cy="86" r="3.4"/><circle cx="47" cy="84" r="3.4"/><circle cx="21" cy="101" r="3.4"/><circle cx="39" cy="101" r="3.4"/></g>' +
    '<path d="M18 71 Q20 94 16 118 M42 71 Q40 94 44 118" stroke="#000" stroke-width="2.4" opacity=".12" fill="none"/>' +
    '<g class="x-drip"><path d="M10 117 q1.2 4 0 6 q-1.2 -2 0 -6 Z M30 120 q1.2 5 0 7 q-1.2 -2 0 -7 Z M50 117 q1 4 0 6 q-1 -2 0 -6 Z" fill="#22337A"/></g>';
  const mallets = (cls) => '<g class="' + cls + '"><path d="M0 0 l-4 -6" stroke="#6B4A2A" stroke-width="1.4"/><rect x="-8" y="-11" width="7" height="4.4" rx="1.4" fill="#8A5A30" transform="rotate(-30 -4.5 -8.8)"/></g>';
  // more hands at work: a dyer at the far-left pit dipping a cloth, a man on the right shaking out a wet maroon one
  const dipper = '<g transform="translate(20 134)">' +
    '<path d="M-2 -9 L-3 0 M2 -9 L3 0" stroke="#2B3550" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M-4.4 -8 Q-5 -14 -2 -18.6 Q2 -21.4 7 -19.6 Q7.4 -16.6 4.6 -14.4 Q3.6 -11 4.4 -8 Q0 -6.6 -4.4 -8 Z" fill="#3E4A5E"/>' +
    '<path d="M-2 -18.6 Q2 -21.4 7 -19.6 Q5 -17.4 1.6 -17 Z" fill="#2B3550"/>' +
    '<circle cx="9" cy="-19.4" r="2.5" fill="#4A2E1C"/><path d="M6.8 -20.6 Q9 -23.6 11.4 -20.8 Z" fill="#F4EBD0"/>' +
    '<g class="x-dip"><path d="M6 -18 Q9 -14 10.6 -9.6 M5 -17 Q7 -12 8 -9" stroke="#3E4A5E" stroke-width="1.9" stroke-linecap="round" fill="none"/>' +
    '<path d="M7.4 -9.4 Q10 -10.4 12.4 -9.2 L13.4 0 Q10.4 1.4 8 0 Z" fill="#1B2A6B"/><path d="M8 -6 Q10.6 -7 13 -6" stroke="#E9EEF6" stroke-width=".5" opacity=".6" fill="none"/>' +
    '<circle cx="8" cy="-9.2" r="1" fill="#2B3560"/><circle cx="11" cy="-9.6" r="1" fill="#2B3560"/></g></g>';
  const blue = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="3.8" fill="#2B3560" opacity=".85"/>';   // hands stained blue to the wrist
  const shaker = person(306, 132, 30, { kind: 'man', skin: 3, robe: '#E8DFC8', trim: '#7A1F2B', trou: '#5E5040', hat: 'hula', hatc: '#F4EBD0', hatc2: '#2E6B3A', al: 'load', ar: 'load', cls: 'p7',
    behind: '<g class="x-shake"><path d="M17 7 Q-2 8 -6 12 L-8 74 Q8 80 22 76 L38 76 Q52 80 68 74 L66 12 Q62 8 43 7 Z" fill="' + DYES[1] + '"/>' +
      '<g fill="none" stroke="#F4E6D8" stroke-width="1.1" opacity=".75"><circle cx="2" cy="30" r="3"/><circle cx="2" cy="30" r="7"/><circle cx="58" cy="30" r="3"/><circle cx="58" cy="30" r="7"/><circle cx="2" cy="56" r="3"/><circle cx="2" cy="56" r="7"/><circle cx="58" cy="56" r="3"/><circle cx="58" cy="56" r="7"/></g>' +
      '<path d="M-6 12 L-8 74 M66 12 L68 74" stroke="#5E1420" stroke-width="1.4" fill="none"/><path d="M8 12 Q6 44 8 76 M52 12 Q54 44 52 76" stroke="#000" stroke-width="2.4" opacity=".14" fill="none"/></g>' });
  const people = dipper + shaker +
    person(60, 150, 40, { kind: 'man', skin: 4, robe: '#3E4A5E', trim: '#9DB2E6', trou: '#2B3550', hat: 'hula', hatc: '#F4EBD0', hatc2: '#1B2A6B', al: 'hip', ar: 'fwd', cls: 'p1', beard: 'b', front: pole2, hl: blue(15, 77), hr: blue(58, 71) }) +
    person(272, 160, 42, { kind: 'man', skin: 0, robe: '#F0E6CC', trim: '#1B2A6B', trou: '#2B3550', hat: 'zanna', hatc: '#F4EBD0', hatc2: '#1B2A6B', hatc3: '#C62828', al: 'fwd', ar: 'fwd', cls: 'p2', front: lift, hl: blue(2, 71), hr: blue(58, 71) }) +
    // the beater on his log, folded cloth on the log, two mallets going
    '<g transform="translate(96 -30)">' +
    person(28, 182, 34, { kind: 'man', skin: 2, robe: '#5E7A8E', trim: '#F4EBD0', trou: '#3A4A5A', hat: 'hula', hatc: '#E8DFC8', hatc2: '#5E3A1C', al: 'clap', ar: 'clap', alc: 'x-bt x-btl', arc: 'x-bt x-btr', cls: 'p5', beard: 'w',
      hl: '<g transform="translate(30 66)">' + mallets('') + '</g>', hr: '<g transform="translate(30 66) scale(-1 1)">' + mallets('') + '</g>' }) +
    '<g><path d="M8 186 h40 l2 -6 h-44 Z" fill="#7A5434"/><ellipse cx="7" cy="183" rx="2" ry="3" fill="#5E3E22"/><path d="M14 180 h26 l-.6 -2.6 h-24.8 Z M15 177.4 h24 l-.6 -2.2 h-22.8 Z" fill="#22337A"/>' +
    '<path d="M15 177.4 h24" stroke="#9DB2E6" stroke-width=".5" opacity=".6"/></g>' +
    '</g>' +
    // customers: a woman and a girl choosing cloth, a boy watching
    person(210, 160, 44, { kind: 'woman', skin: 1, robe: '#C2185B', trim: '#FFD54A', wrap: '#5B3A8E', wrap2: '#FFD54A', hat: 'hijab', hatc: '#F8BBD0', al: 'fwd', ar: 'down', arc: 'x-wv', cls: 'p3' }) +
    person(229, 162, 31, { kind: 'girl', skin: 3, robe: '#00897B', trim: '#FFF3C4', wrap: '#E65100', wrap2: '#FFF3C4', hat: 'hijab', hatc: '#FFE0B2', al: 'wave', ar: 'down', alc: 'x-wv', cls: 'p4' }) +
    person(188, 156, 28, { kind: 'boy', skin: 5, robe: '#F9A825', trim: '#5E3A1C', trou: '#F9A825', hat: 'hula', hatc: '#F4EBD0', hatc2: '#C62828', al: 'down', ar: 'wave', arc: 'x-wv', cls: 'p6' }) +
    goat(300, 196, 0.85, '#E9E2D6', '#4A3020') +
    // when a cloth is finished the woman buys it: her note goes across to the dyer, the folded cloth comes to her hip
    '<g class="x-note"><rect x="199" y="137.6" width="6" height="3.2" rx=".4" fill="#6FA86A"/><rect x="200" y="138.4" width="4" height="1.6" fill="none" stroke="#3E6E3A" stroke-width=".3"/></g>' +
    '<g class="x-bought"><path d="M197 141 h10 l.6 4 h-11.2 Z" fill="#22337A"/><path d="M197 142.4 h10.3" stroke="#E9EEF6" stroke-width=".35" stroke-dasharray=".6 .8"/><path d="M196.6 143.6 h11" stroke="#16245E" stroke-width=".5"/></g>';
  const things = pot(150, 140, 8, '#A85C34') + pot(158, 142, 6.4, '#8E4E2C') + pot(204, 128, 7, '#9C5630') + stack(300, 186, ['#22337A', DYES[1], '#3D5AA8', DYES[4], DYES[2]]) + stack(64, 168, [DYES[3], '#1B2A6B', DYES[0], '#4E78C0']) +
    '<g><path d="M176 140 q4 -9 12 -1 q4 7 -2 9 q-8 2 -10 -8 Z" fill="#D8CDB4"/><path d="M178 139 q4 -2 8 1" stroke="#A89A80" stroke-width=".5" fill="none"/><path d="M180 136 q2 -4 5 0" stroke="#6B5A40" stroke-width=".6" fill="none"/></g>';
  return '<svg class="scene ' + P + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + defs + sky + wall + ground + lines + pits + things + people +
    '<rect width="320" height="200" fill="' + u('vign') + '"/></svg>';
}

/* ---------- the game's pieces ---------- */
/** the dyers' frame and the white cotton cloth on it, a pale woven texture and soft folds; the slots sit on top in HTML */
export function dyeCloth(): string {
  let weave = ''; for (let x = 4; x < 400; x += 4.6) weave += 'M' + f1(x) + ' 6 V230 ';
  let weft = ''; for (let y = 8; y < 230; y += 4.6) weft += 'M2 ' + f1(y) + ' H398 ';
  return '<svg class="dyc" viewBox="0 0 400 236" preserveAspectRatio="none" aria-hidden="true"><defs>' +
    '<linearGradient id="dyc-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF8F0"/><stop offset="1" stop-color="#EEE6D4"/></linearGradient>' +
    '<linearGradient id="dyc-i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--dy1,#2B3F8C)"/><stop offset=".6" style="stop-color:var(--dy2,#1B2A6B)"/><stop offset="1" style="stop-color:var(--dy3,#121D52)"/></linearGradient>' +
    '<linearGradient id="dyc-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6038"/><stop offset="1" stop-color="#5E3E22"/></linearGradient></defs>' +
    '<path d="M4 6 H396 V224 Q300 232 200 226 Q100 232 4 224 Z" fill="url(#dyc-c)"/>' +
    '<g class="dyc-ind"><path d="M4 6 H396 V224 Q300 232 200 226 Q100 232 4 224 Z" fill="url(#dyc-i)"/>' + clothDesigns() + '</g>' +
    '<path d="' + weave + '" stroke="#C9BFA8" stroke-width=".3" opacity=".14"/><path d="' + weft + '" stroke="#C9BFA8" stroke-width=".3" opacity=".1"/>' +
    '<path d="M110 6 Q114 110 106 226 M250 6 Q246 120 254 228 M330 6 Q336 100 328 224" stroke="#8A7A5A" stroke-width="7" fill="none" opacity=".07"/>' +
    '<path d="M126 6 Q130 110 122 226 M266 6 Q262 120 270 228" stroke="#fff" stroke-width="5" fill="none" opacity=".3"/>' +
    '<path d="M0 0 H400 V9 H0 Z" fill="url(#dyc-w)"/><path d="M0 0 H400" stroke="#B88A5A" stroke-width="1.4"/>' +
    '<g fill="#5E3E22"><circle cx="40" cy="4.6" r="2.4"/><circle cx="200" cy="4.6" r="2.4"/><circle cx="360" cy="4.6" r="2.4"/></g></svg>';
}
/** the four resist designs a finished cloth can show (one per word, .v0–.v3 on .dycl): rings along the hems, bias stripes,
 *  sunbursts in the corners, a stitched zigzag border */
function clothDesigns(): string {
  let rings = ''; for (let x = 18; x < 392; x += 26) rings += '<circle cx="' + x + '" cy="24" r="7"/><circle cx="' + x + '" cy="24" r="2.6"/><circle cx="' + x + '" cy="212" r="7"/><circle cx="' + x + '" cy="212" r="2.6"/>';
  let bias = ''; for (let x = -240; x < 400; x += 22) bias += 'M' + x + ' 10 l220 220 ';
  const sun = (cx, cy) => { let r = ''; for (const rr of [6, 14, 22, 30]) r += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '"/>'; for (let a = 0; a < 360; a += 30) { const t = a * Math.PI / 180; r += '<path d="M' + f1(cx + Math.cos(t) * 32) + ' ' + f1(cy + Math.sin(t) * 32) + ' L' + f1(cx + Math.cos(t) * 40) + ' ' + f1(cy + Math.sin(t) * 40) + '"/>'; } return r; };
  let zz = ''; for (const y of [22, 214]) { zz += 'M8 ' + y; for (let x = 8; x < 392; x += 12) zz += ' L' + (x + 6) + ' ' + (y - 7) + ' L' + (x + 12) + ' ' + y; zz += ' '; }
  zz += 'M14 34 V202 M386 34 V202';
  return '<g fill="none" stroke="#EEF2F8" opacity=".5" stroke-width="1.6">' +
    '<g class="dyd d0">' + rings + '</g>' +
    '<g class="dyd d1"><path d="' + bias + '" stroke-width="2.2" opacity=".55"/></g>' +
    '<g class="dyd d2">' + sun(40, 40) + sun(360, 40) + sun(40, 196) + sun(360, 196) + '</g>' +
    '<g class="dyd d3"><path d="' + zz + '" stroke-dasharray="5 3"/></g></g>';
}
/** the spelling cloth is always dyed indigo, so the letters keep the same strong contrast every word (Sani 2 Nov); the colours
 *  live on the drying lines and stacks around it, and only the resist design changes from word to word */
export const DYE_SETS = [['#2B3F8C', '#1B2A6B', '#121D52']];
/** one letter dyed into the cloth: an irregular indigo patch with the letter left white by the resist, and two drips */
export function dyeLetter(L: string): string {
  return '<svg class="dyl" viewBox="0 0 60 92" aria-hidden="true"><defs><linearGradient id="dyl-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--dy1,#2B3F8C)"/><stop offset="1" style="stop-color:var(--dy3,#16245E)"/></linearGradient></defs>' +
    '<path d="M6 6 Q18 2 30 5 Q44 1 55 6 Q59 24 56 44 Q60 64 55 84 Q42 89 30 86 Q16 90 5 85 Q1 64 4 44 Q0 24 6 6 Z" fill="url(#dyl-g)"/>' +
    '<path d="M8 10 Q30 6 52 10" stroke="#5E7BC8" stroke-width="1.4" fill="none" opacity=".45"/>' +
    '<text x="30" y="65" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="56" fill="#F2F5FB">' + L + '</text>' +
    '<g class="dyl-drip"><path d="M18 84 q1.4 6 0 10 q-1.6 -4 0 -10 Z M41 85 q1.2 5 0 8 q-1.4 -3 0 -8 Z" style="fill:var(--dy2,#1B2A6B)"/></g></svg>';
}
/** a wrong letter: a rust stain soaks into the cloth where the letter should be */
export function dyeSpoil(): string {
  return '<svg class="dys" viewBox="-30 -30 60 60" aria-hidden="true"><g fill="#9A5A2A" opacity=".85"><path d="M0 -18 C8 -20 10 -10 16 -12 C22 -12 20 -2 16 2 C22 8 16 16 8 14 C6 22 -2 20 -4 14 C-10 20 -18 14 -14 8 C-22 6 -20 -4 -14 -4 C-18 -12 -10 -18 -4 -14 C-4 -17 -2 -18 0 -18 Z"/></g>' +
    '<path d="M0 -18 C8 -20 10 -10 16 -12 C22 -12 20 -2 16 2 C22 8 16 16 8 14 C6 22 -2 20 -4 14 C-10 20 -18 14 -14 8 C-22 6 -20 -4 -14 -4 C-18 -12 -10 -18 -4 -14 C-4 -17 -2 -18 0 -18 Z" fill="none" stroke="#6E3A16" stroke-width="1.2" opacity=".6"/>' +
    '<circle cx="20" cy="-16" r="2" fill="#9A5A2A" opacity=".7"/><circle cx="-20" cy="12" r="1.6" fill="#9A5A2A" opacity=".7"/></svg>';
}

/* ---------- the game's sounds: WebAudio, short and gentle ---------- */
export function riniSound(run) {
  let ac = null, nb = null;
  const A = () => { if (run && run.dead) return null; try { ac = liveAC(ac); if (ac.state === 'suspended') ac.resume(); return ac; } catch (e) { return null; } };
  const noise = (a) => { if (nb) return nb; nb = a.createBuffer(1, a.sampleRate * 2, a.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return nb; };
  const burst = (a, t, dur, type, f0, f1, q, peak) => { const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = noise(a);
    f.type = type; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f).connect(g).connect(a.destination); s.start(t, Math.random()); s.stop(t + dur + .05); };
  const tone = (a, t, type, f0, f1, peak, dur) => { const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + .02); };
  return {
    /* a letter dyed: a soft dip and splash, a bubble */
    dip() { const a = A(); if (!a) return; const t = a.currentTime + .01; burst(a, t, .28, 'lowpass', 1800, 400, .7, .12); burst(a, t + .05, .16, 'bandpass', 3000, 1500, 1.4, .05); tone(a, t + .12, 'sine', 420, 900, .05, .09); },
    /* a wrong letter: a dull wet slap and a gentle falling tone */
    spoil() { const a = A(); if (!a) return; const t = a.currentTime + .01; burst(a, t, .22, 'lowpass', 600, 200, .8, .16); tone(a, t + .2, 'triangle', 330, 262, .06, .45); },
    /* a cloth finished: the cloth plunges, then the beaters' mallets on the log, then a bright little run */
    done() { const a = A(); if (!a) return; const t = a.currentTime + .01; burst(a, t, .5, 'lowpass', 1400, 300, .7, .14);
      [0, .18, .36].forEach((d) => { tone(a, t + .6 + d, 'sine', 180, 120, .14, .08); burst(a, t + .6 + d, .05, 'bandpass', 900, 700, 2, .08); });
      [659, 784, 1047].forEach((f, i) => tone(a, t + 1.25 + i * .12, 'triangle', f, f, .06, .4)); },
    close() { /* the context is shared (liveAC) */ },
  };
}
