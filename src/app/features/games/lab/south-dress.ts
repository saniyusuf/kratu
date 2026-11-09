// @ts-nocheck
/*
 * Dressing for the Yoruba and Igbo games' scenes (Sani 9 Nov 2026: "more realistic with details, as much as the Hausa
 * one; be free and be expressive"). The cloth people wear (ankara, adire, aṣọ òkè, lace, george, isiagu, akwete) as SVG
 * patterns, and the furniture of a southern street or compound: plastered walls that have weathered, rusted zinc, louvre
 * windows behind burglar-proof bars, signboards, poles and wires, bunting, plastic chairs, goats, hens and the agama
 * lizard nodding on a wall; crowds of real people in the middle distance and big onlookers at the edges.
 * Everything is drawn once into the scene's SVG; only light CSS loops move (transform/opacity, sg.css .x-*).
 */
import { person, dk, lt, f1, SKT } from './south';

/* ---------------- cloth ---------------- */
const pat = (id, w, h, inner, rot = 0) => '<pattern id="' + id + '" width="' + w + '" height="' + h + '" patternUnits="userSpaceOnUse"' + (rot ? ' patternTransform="rotate(' + rot + ')"' : '') + '>' + inner + '</pattern>';
export const CLOTH_DEFS = '<defs>' +
  // ankara wax prints: four strong ones
  pat('sgf-a1', 9, 9, '<rect width="9" height="9" fill="#E8731A"/><circle cx="4.5" cy="4.5" r="3.2" fill="#1F4E9A"/><circle cx="4.5" cy="4.5" r="1.5" fill="#F7C93E"/><circle cx="0" cy="0" r="1.3" fill="#7A1F1F"/><circle cx="9" cy="9" r="1.3" fill="#7A1F1F"/><circle cx="9" cy="0" r="1.3" fill="#7A1F1F"/><circle cx="0" cy="9" r="1.3" fill="#7A1F1F"/>') +
  pat('sgf-a2', 10, 8, '<rect width="10" height="8" fill="#1F7A4A"/><ellipse cx="3" cy="3" rx="3" ry="1.3" fill="#F7C93E" transform="rotate(-30 3 3)"/><ellipse cx="8" cy="6.5" rx="2.6" ry="1.1" fill="#F7C93E" transform="rotate(25 8 6.5)"/><circle cx="7.6" cy="1.6" r=".9" fill="#D84315"/><circle cx="2" cy="6.6" r=".8" fill="#FFFDF7"/>', 15) +
  pat('sgf-a3', 8, 8, '<rect width="8" height="8" fill="#6A2C8A"/><circle cx="4" cy="4" r="3" fill="none" stroke="#F2C230" stroke-width="1"/><circle cx="4" cy="4" r="1" fill="#F2C230"/><path d="M0 0 L1.4 0 L0 1.4 Z M8 8 L6.6 8 L8 6.6 Z" fill="#E86AA0"/>') +
  pat('sgf-a4', 8, 8, '<rect width="8" height="8" fill="#C62828"/><path d="M4 .6 L7.4 4 L4 7.4 L.6 4 Z" fill="#1E1E24"/><circle cx="4" cy="4" r="1" fill="#FFFDF7"/><circle cx="0" cy="0" r=".7" fill="#F7C93E"/><circle cx="8" cy="0" r=".7" fill="#F7C93E"/><circle cx="0" cy="8" r=".7" fill="#F7C93E"/><circle cx="8" cy="8" r=".7" fill="#F7C93E"/>') +
  pat('sgf-a5', 12, 6, '<rect width="12" height="6" fill="#F2C230"/><path d="M0 3 Q3 0 6 3 T12 3" stroke="#1F4E9A" stroke-width="1.6" fill="none"/><circle cx="3" cy="4.8" r=".8" fill="#C62828"/><circle cx="9" cy="1.2" r=".8" fill="#C62828"/>') +
  pat('sgf-a6', 7, 7, '<rect width="7" height="7" fill="#0E6E78"/><path d="M0 7 L3.5 0 L7 7" fill="#F28C28"/><circle cx="3.5" cy="5" r=".9" fill="#FFFDF7"/>') +
  // adire: indigo resist dye, the pale marks where the cloth was tied or starched
  pat('sgf-ad', 10, 10, '<rect width="10" height="10" fill="#1E2F6B"/><circle cx="5" cy="5" r="3.2" fill="none" stroke="#7E9BD6" stroke-width=".8"/><circle cx="5" cy="5" r="1" fill="#7E9BD6"/><path d="M0 0 h2 M8 10 h2 M0 10 l1.6 -1.6 M10 0 l-1.6 1.6" stroke="#5A78B8" stroke-width=".6"/>') +
  pat('sgf-ad2', 8, 8, '<rect width="8" height="8" fill="#243A7A"/><path d="M0 4 H8 M4 0 V8" stroke="#8FA8DA" stroke-width=".5" stroke-dasharray="1 .8"/><circle cx="2" cy="2" r=".8" fill="#8FA8DA"/><circle cx="6" cy="6" r=".8" fill="#8FA8DA"/>') +
  // aṣọ òkè: hand-woven strips, thin bright warp stripes
  pat('sgf-o1', 6, 4, '<rect width="6" height="4" fill="#7A1F3D"/><rect x="1" width=".6" height="4" fill="#F2C230"/><rect x="3.6" width="1.2" height="4" fill="#B03050"/><rect x="5.2" width=".4" height="4" fill="#F2C230"/>') +
  pat('sgf-o2', 6, 4, '<rect width="6" height="4" fill="#E8DFC8"/><rect x=".8" width=".8" height="4" fill="#2B4C9B"/><rect x="3" width=".4" height="4" fill="#C9A227"/><rect x="4.4" width="1" height="4" fill="#2B4C9B"/>') +
  pat('sgf-o3', 6, 4, '<rect width="6" height="4" fill="#1F5B4A"/><rect x="1.2" width=".5" height="4" fill="#E8C060"/><rect x="3.4" width=".9" height="4" fill="#E8C060" opacity=".7"/>') +
  // lace: white, with its open flowers
  pat('sgf-lc', 6, 6, '<rect width="6" height="6" fill="#F6F2EA"/><circle cx="3" cy="3" r="1.4" fill="none" stroke="#C8C0B2" stroke-width=".5"/><circle cx="0" cy="0" r=".6" fill="#D8D0C2"/><circle cx="6" cy="6" r=".6" fill="#D8D0C2"/><circle cx="6" cy="0" r=".6" fill="#D8D0C2"/><circle cx="0" cy="6" r=".6" fill="#D8D0C2"/>') +
  pat('sgf-lc2', 6, 6, '<rect width="6" height="6" fill="#E8B4C4"/><circle cx="3" cy="3" r="1.4" fill="none" stroke="#B87A8E" stroke-width=".5"/><circle cx="0" cy="0" r=".6" fill="#C890A2"/><circle cx="6" cy="6" r=".6" fill="#C890A2"/>') +
  // george: the Igbo women's wrapper, heavy, with its woven gold sprays
  pat('sgf-g1', 10, 10, '<rect width="10" height="10" fill="#6A1B2A"/><path d="M5 1.6 L6 4 L8.4 5 L6 6 L5 8.4 L4 6 L1.6 5 L4 4 Z" fill="#E8C060"/><circle cx="0" cy="0" r=".8" fill="#E8C060"/><circle cx="10" cy="10" r=".8" fill="#E8C060"/>') +
  pat('sgf-g2', 10, 10, '<rect width="10" height="10" fill="#1F4E6B"/><path d="M5 1.6 L6 4 L8.4 5 L6 6 L5 8.4 L4 6 L1.6 5 L4 4 Z" fill="#F2E3C4"/><circle cx="0" cy="0" r=".8" fill="#E8C060"/>') +
  pat('sgf-g3', 10, 10, '<rect width="10" height="10" fill="#2E5B2A"/><path d="M5 1.6 L6 4 L8.4 5 L6 6 L5 8.4 L4 6 L1.6 5 L4 4 Z" fill="#F2C230"/><circle cx="10" cy="0" r=".8" fill="#E8C060"/>') +
  // isiagu: the Igbo men's top, with its lion heads (a gold face in a ring of mane)
  pat('sgf-is', 12, 12, '<rect width="12" height="12" fill="#1E1E24"/><circle cx="6" cy="6" r="3.2" fill="#C9A227"/><circle cx="6" cy="6" r="2" fill="#E8C060"/><path d="M5 5.6 h.6 M6.4 5.6 h.6 M5.4 7 Q6 7.6 6.6 7" stroke="#1E1E24" stroke-width=".4" fill="none"/>' +
    [0, 45, 90, 135, 180, 225, 270, 315].map((a) => '<path d="M6 6 L' + f1(6 + Math.cos(a * Math.PI / 180) * 4.4) + ' ' + f1(6 + Math.sin(a * Math.PI / 180) * 4.4) + '" stroke="#8E7420" stroke-width=".5"/>').join('') + '<circle cx="6" cy="6" r="2" fill="#E8C060"/>') +
  pat('sgf-is2', 12, 12, '<rect width="12" height="12" fill="#7A1F1F"/><circle cx="6" cy="6" r="3" fill="#E8C060"/><circle cx="6" cy="6" r="1.8" fill="#F2D27A"/>') +
  // akwete: horizontal woven bands
  pat('sgf-ak', 6, 7, '<rect width="6" height="7" fill="#B71C1C"/><rect y="1.2" width="6" height="1" fill="#F2C230"/><rect y="3" width="6" height=".6" fill="#1E1E24"/><rect y="4.6" width="6" height="1.4" fill="#E8DFC8"/><path d="M0 4.6 L3 6 L6 4.6" fill="#1E1E24"/>') +
  // a plain check (school uniforms, market men's shirts)
  pat('sgf-ck', 6, 6, '<rect width="6" height="6" fill="#3A6EA8"/><rect width="3" height="6" fill="#FFFDF7" opacity=".35"/><rect width="6" height="3" fill="#FFFDF7" opacity=".35"/>') +
  '</defs>';

const A = ['url(#sgf-a1)', 'url(#sgf-a2)', 'url(#sgf-a3)', 'url(#sgf-a4)', 'url(#sgf-a5)', 'url(#sgf-a6)'];
export const CLOTH = { ank: A, adire: ['url(#sgf-ad)', 'url(#sgf-ad2)'], oke: ['url(#sgf-o1)', 'url(#sgf-o2)', 'url(#sgf-o3)'], lace: ['url(#sgf-lc)', 'url(#sgf-lc2)'],
  george: ['url(#sgf-g1)', 'url(#sgf-g2)', 'url(#sgf-g3)'], isiagu: ['url(#sgf-is)', 'url(#sgf-is2)'], akwete: 'url(#sgf-ak)', check: 'url(#sgf-ck)' };
const HATC = ['#E8A317', '#7A2E5C', '#2B4C9B', '#C62828', '#1F7A4A', '#F2C230', '#E86AA0', '#0E6E78'];
const PLAIN = ['#F4F1EA', '#2B4C9B', '#E8A317', '#7A2E5C', '#1F7A4A', '#C62828', '#5A3A6B', '#0E6E78', '#D8C7A0'];

/** a believable person of the build, the k-th of a crowd: who they are and what they wear varies with k */
export function dressed(Y, k, more = {}) {
  const r = (n) => ((k * 7 + 3) * (n + 11)) % n;
  const kind = more.kind || ['woman', 'man', 'woman', 'man', 'woman', 'boy', 'man', 'woman'][k % 8];
  const o = { kind, skin: k % SKT.length, cls: 'sgw' };
  if (kind === 'man') {
    if (Y) { const fancy = r(3) === 0;
      Object.assign(o, { robe: r(4) === 0 ? CLOTH.lace[0] : (r(2) ? A[r(6)] : PLAIN[r(9)]), trou: r(2) ? '#E8DFC8' : '#2A2A30', hat: ['fila', 'gobi', 'fila', 'hair'][r(4)], hatc: HATC[r(8)] });
      if (fancy) { o.agbada = CLOTH.oke[r(3)]; o.robe = '#E8DFC8'; } }
    else Object.assign(o, { robe: r(3) === 0 ? CLOTH.isiagu[r(2)] : (r(2) ? A[r(6)] : PLAIN[r(9)]), trou: '#2A2A30', wrapper: r(4) === 0 ? CLOTH.george[r(3)] : 0, hat: ['okpu', 'hair', 'okpu', 'okpuf'][r(4)], hatc: ['#B71C1C', '#1E1E24', '#B71C1C'][r(3)], hatc2: '#1E1E24', beads: r(5) === 0 });
  } else if (kind === 'boy' || kind === 'girl') Object.assign(o, { kind: 'boy', robe: r(2) ? CLOTH.check : PLAIN[r(9)], trou: '#3B4A6B', hat: 'hair' });
  else {
    if (Y) Object.assign(o, { robe: r(4) === 0 ? CLOTH.lace[r(2)] : A[r(6)], wrap: r(3) === 0 ? CLOTH.adire[r(2)] : (r(2) ? CLOTH.oke[r(3)] : A[(r(6) + 2) % 6]), hat: r(5) === 0 ? 'braids' : 'gele', hatc: HATC[r(8)], ipele: r(3) === 0 ? CLOTH.oke[r(3)] : 0 });
    else Object.assign(o, { robe: r(3) === 0 ? CLOTH.lace[r(2)] : A[r(6)], wrap: CLOTH.george[r(3)], wrap2: r(2) ? A[(r(6) + 1) % 6] : 0, hat: r(5) === 0 ? 'braids' : 'tie', hatc: HATC[r(8)], beads: r(3) === 0 });
  }
  return Object.assign(o, more);
}

/** a row of people in the middle distance, between x0 and x1 with feet near y, each about h tall; poses vary */
export function band(Y, x0, x1, y, n, h, seed = 0, more = {}) {
  let g = ''; const poses = ['down', 'hip', 'clap', 'wave', 'down', 'fwd', 'hip', 'clap'];
  for (let i = 0; i < n; i++) {
    const k = i + seed * 5, x = x0 + (x1 - x0) * (i + .5) / n + ((k * 13) % 7 - 3), yy = y + ((k * 5) % 3) * 1.6, hh = h * (.9 + ((k * 3) % 4) * .05);
    const o = dressed(Y, k, Object.assign({ al: poses[k % 8], ar: poses[(k + 3) % 8], flip: k % 3 === 0 }, more));
    if (o.kind === 'boy') { g += person(x, yy, hh * .72, o); continue; }
    g += person(x, yy, hh, o);
  }
  return g;
}

/* ---------------- the built world ---------------- */
/** weathering over a wall: damp at the foot, a crack or two, a few stains and runs */
export function weather(x, y, w, h, c = '#000', seed = 1) {
  let g = '<path d="M' + x + ' ' + (y + h) + ' h' + w + ' v-' + f1(h * .14) + ' Q' + f1(x + w * .7) + ' ' + f1(y + h * .82) + ' ' + f1(x + w * .45) + ' ' + f1(y + h * .88) + ' Q' + f1(x + w * .2) + ' ' + f1(y + h * .8) + ' ' + x + ' ' + f1(y + h * .86) + ' Z" fill="' + c + '" opacity=".1"/>';
  for (let i = 0; i < 3; i++) { const cx = x + w * (((seed * 17 + i * 31) % 90) + 5) / 100, cy = y + h * (((seed * 13 + i * 23) % 50) + 10) / 100;
    g += '<path d="M' + f1(cx) + ' ' + f1(cy) + ' l' + f1(2 + i) + ' ' + f1(3 + i) + ' l-1 ' + f1(2.4) + ' l' + f1(1.6) + ' ' + f1(2.6) + '" stroke="' + c + '" stroke-opacity=".22" stroke-width=".45" fill="none"/>';
    g += '<ellipse cx="' + f1(cx + 6) + '" cy="' + f1(cy + 4) + '" rx="' + f1(4 + i * 2) + '" ry="' + f1(2 + i) + '" fill="' + c + '" opacity=".05"/>'; }
  return g;
}
/** corrugated zinc, rusted in patches, between x0..x1, top at y, depth d (a lean-to roof seen from the front) */
export function zinc(x0, x1, y, d = 8, seed = 2) {
  let g = '<path d="M' + x0 + ' ' + y + ' H' + x1 + ' L' + (x1 + 3) + ' ' + (y + d) + ' H' + (x0 - 3) + ' Z" fill="#A9B2B6"/>';
  for (let x = x0; x < x1; x += 2.4) g += '<path d="M' + f1(x) + ' ' + y + ' L' + f1(x - 1.2 + (x - x0) / (x1 - x0) * 2.4) + ' ' + (y + d) + '" stroke="#7E888E" stroke-width=".5"/>';
  for (let i = 0; i < 4; i++) { const rx = x0 + (x1 - x0) * (((seed * 19 + i * 29) % 88) + 6) / 100;
    g += '<ellipse cx="' + f1(rx) + '" cy="' + f1(y + d * .55) + '" rx="' + f1(4 + (i % 2) * 3) + '" ry="' + f1(d * .35) + '" fill="#9A5A2E" opacity=".45"/>'; }
  return g + '<path d="M' + (x0 - 3) + ' ' + (y + d) + ' H' + (x1 + 3) + '" stroke="#5E676C" stroke-width=".8"/>';
}
/** a louvre window behind burglar-proof bars, with its frame and a sill */
export function louvre(x, y, w, h, frame = '#3E5A4A') {
  let g = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#2A3640"/>';
  for (let k = 1; k < h / 2.4; k++) g += '<path d="M' + x + ' ' + f1(y + k * 2.4) + ' h' + w + '" stroke="#8FB0C0" stroke-width=".8" opacity=".75"/>';
  g += '<path d="M' + f1(x + w / 2) + ' ' + y + ' v' + h + '" stroke="' + frame + '" stroke-width="1"/>';
  for (let k = 1; k < 4; k++) g += '<path d="M' + f1(x + k * w / 4) + ' ' + y + ' v' + h + '" stroke="#1E1E24" stroke-width=".55"/>';
  g += '<path d="M' + x + ' ' + f1(y + h * .5) + ' h' + w + '" stroke="#1E1E24" stroke-width=".55"/>';
  return g + '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="none" stroke="' + frame + '" stroke-width="1.4"/><rect x="' + f1(x - 1.4) + '" y="' + f1(y + h) + '" width="' + f1(w + 2.8) + '" height="1.6" fill="#D8CDB8"/>';
}
/** a painted signboard on two legs or nailed to a wall; words in the sign painter's block letters */
export function sign(x, y, w, h, words, bg = '#1F4E9A', fg = '#FFFDF7', o = {}) {
  const fs = o.fs || Math.min(h * .52, w / Math.max(4, words.length) * 1.55);
  return (o.legs ? '<path d="M' + f1(x + w * .15) + ' ' + f1(y + h) + ' v' + o.legs + ' M' + f1(x + w * .85) + ' ' + f1(y + h) + ' v' + o.legs + '" stroke="#5A3A22" stroke-width="1.6"/>' : '') +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx=".8" fill="' + bg + '"/><rect x="' + f1(x + 1) + '" y="' + f1(y + 1) + '" width="' + f1(w - 2) + '" height="' + f1(h - 2) + '" fill="none" stroke="' + fg + '" stroke-opacity=".5" stroke-width=".4"/>' +
    '<text x="' + f1(x + w / 2) + '" y="' + f1(y + h / 2 + fs * .36) + '" text-anchor="middle" font-size="' + f1(fs) + '" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="' + fg + '">' + words + '</text>' +
    (o.sub ? '<text x="' + f1(x + w / 2) + '" y="' + f1(y + h - 1.4) + '" text-anchor="middle" font-size="' + f1(fs * .42) + '" font-weight="700" font-family="Arial,sans-serif" fill="' + fg + '" opacity=".9">' + o.sub + '</text>' : '') +
    '<path d="M' + x + ' ' + f1(y + h) + ' h' + w + '" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>';
}
/** an electricity pole with its wires sagging to the next, and a tangle of illegal connections at the top */
export function poles(xs, y, top, c = '#5A4A3A') {
  let g = '';
  xs.forEach((x, i) => { g += '<path d="M' + x + ' ' + y + ' V' + top + ' M' + (x - 5) + ' ' + (top + 2) + ' h10" stroke="' + c + '" stroke-width="1.6"/><circle cx="' + (x - 4) + '" cy="' + (top + 1) + '" r=".8" fill="#D8D0C2"/><circle cx="' + (x + 4) + '" cy="' + (top + 1) + '" r=".8" fill="#D8D0C2"/>';
    if (i) { const p = xs[i - 1]; g += '<path d="M' + (p - 4) + ' ' + (top + 1) + ' Q' + ((p + x) / 2) + ' ' + (top + 9) + ' ' + (x - 4) + ' ' + (top + 1) + ' M' + (p + 4) + ' ' + (top + 1) + ' Q' + ((p + x) / 2) + ' ' + (top + 7) + ' ' + (x + 4) + ' ' + (top + 1) + '" stroke="#2A2A2A" stroke-width=".4" fill="none"/>'; } });
  return g;
}
/** a red or blue plastic chair (every party, every shop front) */
export const chair = (x, y, s = 1, c = '#C62828') => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')"><path d="M-6 0 L-5 -9 H5 L6 0 M-5 -9 L-4.4 -20 Q0 -22 4.4 -20 L5 -9" fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M-5.6 -9 H5.6 V-7.4 H-5.6 Z" fill="' + c + '"/><path d="M-4 -19 Q0 -20.6 4 -19 V-11 H-4 Z" fill="' + c + '" opacity=".85"/><path d="M-3 -18 h2" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/></g>';
/** a goat, browsing; its head dips (x-graze) */
export const goat = (x, y, s = 1, c = '#E8E0D2', flip = 0) => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ')"><ellipse cx="0" cy="-8" rx="9" ry="5" fill="' + c + '"/><ellipse cx="-2" cy="-7" rx="4" ry="3" fill="' + dk(c, .25) + '" opacity=".5"/>' +
  '<path d="M-6 -4 V2 M-3 -4 V2 M4 -4 V2 M7 -4 V2" stroke="' + dk(c, .35) + '" stroke-width="1.3"/><path d="M-9 -9 l-2 -3" stroke="' + dk(c, .3) + '" stroke-width="1" />' +
  '<g class="x-graze" style="transform-origin:0% 60%"><path d="M7 -10 L12 -5 L15 -6 L13 -11 Z" fill="' + c + '"/><path d="M12 -11 q1 -4 -1.6 -5 M13.4 -11 q2 -3 .4 -5" stroke="#5A4A3A" stroke-width=".7" fill="none"/><circle cx="13" cy="-8" r=".5" fill="#1E1E24"/><path d="M14 -5 v2" stroke="' + dk(c, .3) + '" stroke-width=".6"/></g></g>';
/** a hen pecking (x-peck) */
export const hen = (x, y, s = 1, c = '#B5651D', flip = 0) => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ')"><g class="x-peck" style="transform-origin:30% 100%"><path d="M-5 -4 Q-6 -9 -1 -9 Q3 -10 4 -6 Q6 -6 5 -3 Q2 0 -3 -1 Q-6 -1 -5 -4 Z" fill="' + c + '"/><path d="M-5 -6 l-3 -3 l1 3 z" fill="' + dk(c, .3) + '"/>' +
  '<circle cx="4" cy="-8" r="1.9" fill="' + c + '"/><path d="M3.4 -10 l.6 -1.4 l.6 1.2 l.7 -1 l.2 1.4" fill="#C62828"/><path d="M5.8 -8 l1.4 .5 l-1.4 .4 z" fill="#E8A317"/><circle cx="4.4" cy="-8.4" r=".35" fill="#1E1E24"/></g><path d="M-1 -1 V2 M1 -1 V2" stroke="#E8A317" stroke-width=".6"/></g>';
/** the agama lizard, orange head, blue body, doing his press-ups on a wall (x-nod) */
export const agama = (x, y, s = 1, flip = 0) => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ')"><g class="x-nod" style="transform-origin:40% 100%"><path d="M-12 0 Q-6 -1 -2 -1.6 Q3 -2.2 6 -2 Q8 -1 6 0 Q2 .8 -2 .6 Q-8 .8 -12 0 Z" fill="#2B3E7A"/><path d="M-12 0 Q-20 1 -24 4" stroke="#C9A227" stroke-width="1.2" fill="none"/>' +
  '<path d="M4 -2.4 Q9 -3.6 10 -1.4 Q9 .4 4 .2 Z" fill="#E8731A"/><circle cx="7.6" cy="-1.8" r=".4" fill="#1E1E24"/><path d="M0 0 l-1 2.4 M-6 .4 l-1.4 2.2" stroke="#2B3E7A" stroke-width=".8"/></g></g>';
/** a line of bunting, triangles in turn */
export function flags(x0, y0, x1, y1, cols, sag = 6, n = 0) {
  const N = n || Math.round((x1 - x0) / 7); let g = '<path d="M' + x0 + ' ' + y0 + ' Q' + ((x0 + x1) / 2) + ' ' + ((y0 + y1) / 2 + sag) + ' ' + x1 + ' ' + y1 + '" stroke="#5A4A3A" stroke-width=".4" fill="none"/>';
  for (let i = 0; i < N; i++) { const t = (i + .5) / N, x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * ((x0 + x1) / 2) + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * ((y0 + y1) / 2 + sag) + t * t * y1;
    g += '<path d="M' + f1(x - 2.6) + ' ' + f1(y) + ' L' + f1(x + 2.6) + ' ' + f1(y) + ' L' + f1(x) + ' ' + f1(y + 5) + ' Z" fill="' + cols[i % cols.length] + '" class="x-flag" style="animation-delay:-' + (i % 5) * .3 + 's"/>'; }
  return g;
}
/** packed earth with stones, tyre ruts and a puddle */
export function earth(y, c = '#C9A06A', seed = 1, puddle = 1) {
  let g = '<path d="M0 ' + y + ' H320 V200 H0 Z" fill="' + c + '"/><path d="M0 ' + y + ' H320 V' + (y + 6) + ' H0 Z" fill="#000" opacity=".06"/>';
  for (let i = 0; i < 26; i++) { const x = (i * 53 + seed * 17) % 320, yy = y + 8 + ((i * 29 + seed * 7) % (200 - y - 10));
    g += '<ellipse cx="' + x + '" cy="' + yy + '" rx="' + (1 + (i % 3) * .6) + '" ry="' + (.6 + (i % 2) * .3) + '" fill="' + dk(c, .3) + '" opacity=".5"/>'; }
  g += '<path d="M-10 ' + (y + 30) + ' Q120 ' + (y + 20) + ' 330 ' + (y + 36) + ' M-10 ' + (y + 38) + ' Q120 ' + (y + 28) + ' 330 ' + (y + 44) + '" stroke="' + dk(c, .18) + '" stroke-width="1.4" fill="none" opacity=".35" stroke-dasharray="3 2"/>';
  if (puddle) g += '<ellipse cx="' + (60 + (seed * 71) % 200) + '" cy="' + (y + 18) + '" rx="16" ry="2.6" fill="#8FA9B6" opacity=".55"/><ellipse cx="' + (64 + (seed * 71) % 200) + '" cy="' + (y + 17.4) + '" rx="6" ry=".7" fill="#fff" opacity=".5"/>';
  return g;
}
/** a far line of houses and trees above y (the town beyond, pale with distance) */
export function town(y, Y, c = '#B9C4BE', seed = 1) {
  let g = '';
  for (let i = 0; i < 16; i++) { const x = i * 21 + ((i * seed * 7) % 9) - 6, w = 14 + (i * 5 + seed) % 10, h = 8 + (i * 7 + seed * 3) % 12;
    if ((i + seed) % 5 === 2) { g += '<path d="M' + (x + 6) + ' ' + y + ' V' + (y - h - 8) + '" stroke="' + dk(c, .1) + '" stroke-width="1"/><g fill="' + dk(c, .08) + '">' + [0, 60, 120, 180, 240, 300].map((a) => '<path d="M' + (x + 6) + ' ' + (y - h - 8) + ' q' + f1(Math.cos(a * Math.PI / 180) * 6) + ' ' + f1(Math.sin(a * Math.PI / 180) * 3 - 2) + ' ' + f1(Math.cos(a * Math.PI / 180) * 9) + ' ' + f1(Math.sin(a * Math.PI / 180) * 5 + 2) + '" stroke="' + dk(c, .08) + '" stroke-width="1.6" fill="none"/>').join('') + '</g>'; continue; }
    g += '<rect x="' + x + '" y="' + (y - h) + '" width="' + w + '" height="' + h + '" fill="' + c + '"/><path d="M' + (x - 1.4) + ' ' + (y - h) + ' L' + (x + w / 2) + ' ' + (y - h - 4) + ' L' + (x + w + 1.4) + ' ' + (y - h) + ' Z" fill="' + dk(c, .12) + '"/>';
    if (h > 12 && (i % 3 === 0)) g += '<rect x="' + x + '" y="' + (y - h - 8) + '" width="' + w + '" height="8" fill="' + lt(c, .06) + '"/><path d="M' + (x - 1) + ' ' + (y - h - 8) + ' h' + (w + 2) + '" stroke="' + dk(c, .12) + '" stroke-width="1.2"/>';
    g += '<rect x="' + (x + 3) + '" y="' + (y - h + 3) + '" width="3" height="3" fill="' + dk(c, .2) + '"/><rect x="' + (x + w - 6) + '" y="' + (y - h + 3) + '" width="3" height="3" fill="' + dk(c, .2) + '"/>'; }
  return g + (Y ? '' : '');
}
/** smoke rising from a fire or a pot (x-smoke) */
export const smoke = (x, y, s = 1) => [0, 1, 2].map((i) => '<ellipse class="x-smoke" style="animation-delay:-' + (i * 1.3) + 's" cx="' + x + '" cy="' + y + '" rx="' + f1(4 * s) + '" ry="' + f1(3 * s) + '" fill="#E8E4DC" opacity=".5"/>').join('');
/** an onlooker at the frame's edge, big, half out of the picture, turned to the action */
export const onlooker = (Y, x, y, h, k, more = {}) => person(x, y, h, dressed(Y, k, Object.assign({ cls: 'sgw sgonl' }, more)));
/** a soft cloud that drifts (x-cl0) */
export const cloudy = (x, y, s = 1, c = '#fff') => '<g class="x-cl0" style="--d:' + (40 + (x % 7) * 6) + 's"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + c + '" opacity=".9"><ellipse rx="18" ry="4.4"/><ellipse cx="7" cy="-3" rx="9" ry="5.4"/><ellipse cx="-7" cy="-1.8" rx="7" ry="4"/><ellipse cx="0" cy="1.6" rx="16" ry="2" fill="#D8E4EC"/></g></g>';
/** a few birds wheeling (x-bird) */
export const birdsAt = (x, y, n = 3, c = '#3A3A44') => { let g = ''; for (let i = 0; i < n; i++) g += '<g class="x-bird" style="animation-delay:-' + (i * 1.7).toFixed(1) + 's"><path transform="translate(' + (x + i * 9) + ' ' + (y + (i % 2) * 4) + ')" d="M-3 0 Q-1.5 -1.6 0 0 Q1.5 -1.6 3 0" stroke="' + c + '" stroke-width=".6" fill="none"/></g>'; return g; };
