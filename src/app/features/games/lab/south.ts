// @ts-nocheck
/*
 * The drawing kit for the Yoruba and Igbo games (Sani 2026-11-06), in the hand of the Hausa scenes (sc-jirgi.ts): a
 * 320 x 200 picture sliced to fill the screen, people in 60 x 140 boxes with arms, heads and faces that cheer and frown,
 * light from the upper left, a few slow loops. Only the world is new: the south-west and the south-east, their dress,
 * houses, trees, roads and water.
 *
 * Classes animated by sk.css (scoped .sk5; transform and opacity only, for cheap tablets):
 *   people   .x-fig (a whole person; .hop jumps on cheer, .sway dances) · .x-head (shakes when sad) · .x-al / .x-ar arms
 *            · .x-wv an arm that waves on cheer · .x-cl a clapping arm · .x-ms / .x-mf smile and frown
 *   idle     .x-cl0 clouds · .x-bird · .x-rip ripples · .x-leaf palm fronds · .x-smoke · .x-bob · .x-drive · .x-glow
 */
export const P = 'sk5';
export const SKT = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#4F2F17', '#94603A'];
export const f1 = (n) => (+n).toFixed(1);
export const mix = (a, b, t) => { if (!/^#[0-9a-fA-F]{6}$/.test(a)) return a; const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
export const dk = (c, t = 0.25) => mix(c, '#1a0e06', t);
export const lt = (c, t = 0.25) => mix(c, '#ffffff', t);

/* ---------- gradients and patterns (each scene has its own id prefix, so two scenes never share ids) ---------- */
export function kit(id) {
  const q = P + id + '-';
  const lg = (n, c, y1 = 0, y2 = 1) => '<linearGradient id="' + q + n + '" x1="0" y1="' + y1 + '" x2="0" y2="' + y2 + '">' +
    c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
  const u = (n) => 'url(#' + q + n + ')';
  const defs = (extra = '') => '<defs>' +
    // adire eleko: indigo with resist circles and lines; aso-oke: woven stripes; george: a big-check madras; isiagu: the lion heads
    '<pattern id="' + q + 'adire" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#1F3A78"/><circle cx="4" cy="4" r="2.2" fill="none" stroke="#C9D6F2" stroke-width=".7"/><path d="M0 0 h8" stroke="#8FA6DB" stroke-width=".5"/></pattern>' +
    '<pattern id="' + q + 'aso" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#7A2E5C"/><path d="M1 0 v6 M4 0 v6" stroke="#E8B830" stroke-width=".9"/><path d="M2.5 0 v6" stroke="#F4EBD0" stroke-width=".4"/></pattern>' +
    '<pattern id="' + q + 'aso2" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#2E5E8A"/><path d="M1 0 v6 M4 0 v6" stroke="#F4EBD0" stroke-width=".8"/></pattern>' +
    '<pattern id="' + q + 'george" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#8E1B2A"/><path d="M0 2.5 h10 M0 7.5 h10" stroke="#E8B830" stroke-width="1.2" opacity=".8"/><path d="M2.5 0 v10 M7.5 0 v10" stroke="#1F4E2E" stroke-width="1.2" opacity=".7"/></pattern>' +
    '<pattern id="' + q + 'isiagu" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#8E1B1B"/><g fill="#E8C35A"><circle cx="4.5" cy="4.5" r="1.7"/><circle cx="3.8" cy="4" r=".35" fill="#3A1A0A"/><circle cx="5.2" cy="4" r=".35" fill="#3A1A0A"/></g><path d="M0 0 l9 9 M9 0 l-9 9" stroke="#3A0E0E" stroke-width=".35" opacity=".5"/></pattern>' +
    '<pattern id="' + q + 'lace" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#F4EBD0"/><circle cx="2.5" cy="2.5" r=".8" fill="none" stroke="#C9B88F" stroke-width=".4"/></pattern>' +
    '<pattern id="' + q + 'zinc" width="3" height="4" patternUnits="userSpaceOnUse"><rect width="3" height="4" fill="#9A6A48"/><path d="M1.5 0 v4" stroke="#C08A5E" stroke-width=".9"/><path d="M0 0 v4" stroke="#6E4630" stroke-width=".4"/></pattern>' +
    '<pattern id="' + q + 'zincg" width="3" height="4" patternUnits="userSpaceOnUse"><rect width="3" height="4" fill="#A9B2B4"/><path d="M1.5 0 v4" stroke="#D5DBDC" stroke-width=".9"/><path d="M0 0 v4" stroke="#7E8789" stroke-width=".4"/></pattern>' +
    '<pattern id="' + q + 'laterite" width="14" height="10" patternUnits="userSpaceOnUse"><rect width="14" height="10" fill="#B4643A"/><circle cx="3" cy="3" r=".6" fill="#8E4A28"/><circle cx="10" cy="7" r=".5" fill="#CC7A4C"/><circle cx="7" cy="1" r=".4" fill="#8E4A28"/></pattern>' +
    '<pattern id="' + q + 'thatch" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#C9A35A"/><path d="M0 4 L2 0 M2 4 L4 0" stroke="#9C7A3A" stroke-width=".5"/></pattern>' +
    '<pattern id="' + q + 'uli" width="24" height="16" patternUnits="userSpaceOnUse"><rect width="24" height="16" fill="#C8784A"/><path d="M2 8 q5 -6 10 0 t10 0" stroke="#2A1A10" stroke-width=".7" fill="none" opacity=".75"/><circle cx="12" cy="3" r="1.4" fill="none" stroke="#2A1A10" stroke-width=".6" opacity=".7"/></pattern>' +
    lg('day', ['#7FC3EC', '#B9E0F4', '#EAF4E8']) + lg('morn', ['#F6C98F', '#FBE3B4', '#F4EFD8']) + lg('dusk', ['#3B2E5E', '#9A4F5A', '#E8935A']) +
    lg('night', ['#0E1530', '#25305A', '#4A3E62']) + lg('rain', ['#5C6A78', '#8A97A2', '#C9CFC9']) + lg('lagoon', ['#5DB3D6', '#3F93BE', '#2E7AA6']) +
    lg('river', ['#7FA9A0', '#5E8F86', '#4B7A72']) + lg('grass', ['#7FAF4E', '#5E9440']) + lg('earth', ['#C98A5A', '#A86A3E']) + extra + '</defs>';
  return { q, u, lg, defs };
}

/* ---------- people (60 x 140 box, feet on y 134, placed by a nested svg) ---------- */
const POSE = {
  down: ['M16 45 Q11 68 13 90', [13, 92]],
  wave: ['M16 45 Q5 30 9 10', [9, 8]],
  up: ['M16 45 Q8 26 12 8', [12, 6]],
  load: ['M16 45 Q5 28 17 8', [17, 7]],
  clap: ['M16 45 Q15 62 27 64', [28, 64]],
  fwd: ['M16 45 Q9 62 3 70', [2, 71]],
  out: ['M16 45 Q4 52 -2 44', [-3, 42]],
  hip: ['M16 45 Q4 60 15 76', [15, 77]],
  staff: ['M16 45 Q8 64 9 78', [9, 79]],
  hold: ['M16 45 Q14 64 24 70', [25, 70]],
  play: ['M16 45 Q10 60 20 58', [22, 57]],
};
const mir = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => (60 - +x) + ' ' + y);
function arm(side, pose, sleeve, sk, cls = '', w = 9, hold = '') {
  const L = side === 'l';
  let [d, [hx, hy]] = POSE[pose] || POSE.down;
  if (!L) { d = mir(d); hx = 60 - hx; }
  if (/wave|load|up/.test(pose)) cls += ' x-up';
  return '<g class="x-a' + side + (cls ? ' ' + cls : '') + '" style="transform-origin:' + (L ? '16px 45px' : '44px 45px') + '">' +
    '<path d="' + d + '" stroke="' + dk(sleeve, 0.3) + '" stroke-width="' + (w + 1.4) + '" stroke-linecap="round" fill="none"/>' +
    '<path d="' + d + '" stroke="' + sleeve + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>' +
    '<circle cx="' + hx + '" cy="' + hy + '" r="3.7" fill="' + sk + '"/>' + (hold ? '<g transform="translate(' + hx + ' ' + hy + ')">' + hold + '</g>' : '') + '</g>';
}

/** the build's hats, drawn over a head whose crown is near (x, y), half-width w (same frame as capsArewa.arewaCap) */
export function hat(kind, x, y, w, c = '#C0392B', c2 = '#F4EBD0') {
  const P2 = (dx, dy) => f1(x + dx * w) + ' ' + f1(y - dy * w);
  if (kind === 'fila') // abetí-ajá, the "dog's ear" cap: a soft crown with its two flaps turned down over the ears
    return '<g class="cap-f"><path d="M' + P2(-1.02, 0) + ' C' + P2(-1.05, .9) + ' ' + P2(-.5, 1.25) + ' ' + P2(.1, 1.22) + ' C' + P2(.8, 1.18) + ' ' + P2(1.08, .8) + ' ' + P2(1.02, 0) + ' Q' + P2(0, -.14) + ' ' + P2(-1.02, 0) + ' Z" fill="' + c + '"/>' +
      '<path d="M' + P2(-1.02, .05) + ' L' + P2(-1.22, -.62) + ' L' + P2(-.62, .02) + ' Z M' + P2(1.02, .05) + ' L' + P2(1.22, -.62) + ' L' + P2(.62, .02) + ' Z" fill="' + dk(c, 0.18) + '"/>' +
      '<path d="M' + P2(-.98, .18) + ' Q' + P2(0, .06) + ' ' + P2(.98, .18) + '" stroke="' + c2 + '" stroke-width="' + f1(w * .1) + '" fill="none"/>' +
      '<path d="M' + P2(-.2, 1.2) + ' Q' + P2(.4, .7) + ' ' + P2(.9, .5) + '" stroke="' + dk(c, 0.22) + '" stroke-width="' + f1(w * .06) + '" fill="none"/></g>';
  if (kind === 'gobi') // the tall fila, pressed over to one side
    return '<g class="cap-g"><path d="M' + P2(-1, 0) + ' L' + P2(-.9, 1.1) + ' Q' + P2(-.3, 1.9) + ' ' + P2(1.25, 1.55) + ' L' + P2(1.0, .9) + ' L' + P2(1, 0) + ' Q' + P2(0, -.12) + ' ' + P2(-1, 0) + ' Z" fill="' + c + '"/>' +
      '<path d="M' + P2(-.9, 1.1) + ' Q' + P2(.2, 1.15) + ' ' + P2(1.0, .9) + '" stroke="' + dk(c, 0.25) + '" stroke-width="' + f1(w * .07) + '" fill="none"/>' +
      '<path d="M' + P2(-.98, .16) + ' Q' + P2(0, .04) + ' ' + P2(.98, .16) + '" stroke="' + c2 + '" stroke-width="' + f1(w * .1) + '" fill="none"/></g>';
  if (kind === 'okpu') // the Igbo men's cap, soft and round, often red, with a black band or stripes
    return '<g class="cap-o"><path d="M' + P2(-1.02, 0) + ' C' + P2(-1.06, .85) + ' ' + P2(-.6, 1.08) + ' ' + P2(0, 1.08) + ' C' + P2(.6, 1.08) + ' ' + P2(1.06, .85) + ' ' + P2(1.02, 0) + ' Q' + P2(0, -.12) + ' ' + P2(-1.02, 0) + ' Z" fill="' + c + '"/>' +
      '<path d="M' + P2(-1.0, .2) + ' Q' + P2(0, .08) + ' ' + P2(1.0, .2) + '" stroke="' + c2 + '" stroke-width="' + f1(w * .16) + '" fill="none"/>' +
      '<path d="M' + P2(-.6, .95) + ' Q' + P2(-.2, .5) + ' ' + P2(-.4, .3) + '" stroke="' + lt(c, 0.25) + '" stroke-width="' + f1(w * .08) + '" fill="none" opacity=".6"/></g>';
  if (kind === 'okpuf') // a titled man's red cap with an eagle feather
    return hat('okpu', x, y, w, c, c2) + '<path d="M' + P2(.5, .9) + ' Q' + P2(1.3, 2.2) + ' ' + P2(1.0, 2.9) + ' Q' + P2(.75, 2.1) + ' ' + P2(.3, .95) + ' Z" fill="#F4F1EA" stroke="#5A4A3A" stroke-width=".3"/>';
  if (kind === 'gele') // the women's head-tie, tied high with its pleats fanned out
    return '<g class="cap-gl"><path d="M' + P2(-1.1, -.1) + ' Q' + P2(-1.4, 1.2) + ' ' + P2(-.4, 1.5) + ' Q' + P2(-.2, 2.4) + ' ' + P2(.6, 2.2) + ' Q' + P2(1.6, 2.0) + ' ' + P2(1.3, .9) + ' Q' + P2(1.25, .2) + ' ' + P2(1.1, -.1) + ' Q' + P2(0, .2) + ' ' + P2(-1.1, -.1) + ' Z" fill="' + c + '"/>' +
      '<path d="M' + P2(-.9, .5) + ' Q' + P2(0, 1.5) + ' ' + P2(1.1, .6) + ' M' + P2(-.6, 1.2) + ' Q' + P2(.2, 2.0) + ' ' + P2(1.2, 1.4) + ' M' + P2(-.2, 1.6) + ' Q' + P2(.4, 2.3) + ' ' + P2(.9, 1.9) + '" stroke="' + dk(c, 0.22) + '" stroke-width="' + f1(w * .07) + '" fill="none"/>' +
      '<path d="M' + P2(-1.0, .1) + ' Q' + P2(0, .35) + ' ' + P2(1.05, .1) + '" stroke="' + lt(c, 0.35) + '" stroke-width="' + f1(w * .08) + '" fill="none"/></g>';
  if (kind === 'tie') // the Igbo head-tie, smaller, knotted at the front
    return '<g class="cap-t"><path d="M' + P2(-1.08, -.1) + ' C' + P2(-1.2, 1.0) + ' ' + P2(-.4, 1.35) + ' ' + P2(.2, 1.3) + ' C' + P2(.9, 1.25) + ' ' + P2(1.25, .9) + ' ' + P2(1.08, -.1) + ' Q' + P2(0, .15) + ' ' + P2(-1.08, -.1) + ' Z" fill="' + c + '"/>' +
      '<path d="M' + P2(-.3, 1.2) + ' q' + f1(w * .3) + ' ' + f1(-w * .7) + ' ' + f1(w * .7) + ' ' + f1(-w * .2) + ' q' + f1(-w * .1) + ' ' + f1(w * .5) + ' ' + f1(-w * .7) + ' ' + f1(w * .2) + ' Z" fill="' + dk(c, 0.18) + '"/>' +
      '<path d="M' + P2(-.9, .4) + ' Q' + P2(0, .9) + ' ' + P2(.95, .4) + '" stroke="' + c2 + '" stroke-width="' + f1(w * .08) + '" fill="none"/></g>';
  if (kind === 'ade') // an Oba's beaded crown, tall and conical, with its veil of beads over the face and a bird on top
    return '<g class="cap-ade"><path d="M' + P2(-1.05, 0) + ' L' + P2(-.55, 2.6) + ' Q' + P2(0, 2.9) + ' ' + P2(.55, 2.6) + ' L' + P2(1.05, 0) + ' Z" fill="#F2C230"/>' +
      [0.5, 1.0, 1.5, 2.0].map((k) => '<path d="M' + P2(-1.05 + k * .19, k) + ' L' + P2(1.05 - k * .19, k) + '" stroke="' + (k === 1 ? '#C62828' : '#1F5B8A') + '" stroke-width="' + f1(w * .16) + '"/>').join('') +
      '<path d="M' + P2(-.25, 2.75) + ' q' + f1(w * .25) + ' ' + f1(-w * .45) + ' ' + f1(w * .5) + ' 0" fill="#1F5B8A"/>' +
      Array.from({ length: 9 }, (_, i) => '<path d="M' + P2(-.95 + i * .2375, 0) + ' v' + f1(w * (1.0 + (i % 2) * .15)) + '" stroke="' + ['#F2C230', '#C62828', '#1F5B8A'][i % 3] + '" stroke-width="' + f1(w * .09) + '"/>').join('') + '</g>';
  if (kind === 'crownr') // the Obi of Onitsha's red cap with its coral and the white feathers
    return hat('okpu', x, y, w * 1.05, '#B71C1C', '#E64A19') + '<g fill="#F4F1EA" stroke="#8A7A6A" stroke-width=".3"><path d="M' + P2(-.3, 1.0) + ' Q' + P2(-.8, 2.4) + ' ' + P2(-.5, 3.0) + ' Q' + P2(-.2, 2.2) + ' ' + P2(.0, 1.0) + ' Z"/><path d="M' + P2(.1, 1.05) + ' Q' + P2(.4, 2.6) + ' ' + P2(.9, 3.1) + ' Q' + P2(.75, 2.2) + ' ' + P2(.4, 1.0) + ' Z"/></g>';
  return '';
}

function head(o, sk) {
  const cy = 25;
  let back = '', front = '';
  if (o.hat === 'hair') front = '<path d="M19.4 23 Q18.4 12.6 30 12.8 Q41.6 12.6 40.6 23 Q37 16.6 30 17 Q23 16.6 19.4 23 Z" fill="#1E120A"/>';
  else if (o.hat === 'braids') front = '<path d="M19.4 23 Q18.4 12.6 30 12.8 Q41.6 12.6 40.6 23 Q37 16.6 30 17 Q23 16.6 19.4 23 Z" fill="#1E120A"/><path d="M24 14 V9 M30 13 V7.6 M36 14 V9" stroke="#1E120A" stroke-width="1.8" stroke-linecap="round"/>';
  else if (o.hat) front = hat(o.hat, 30, o.hat === 'gele' || o.hat === 'tie' ? 20 : 18.5, 11.4, o.hatc || '#C0392B', o.hatc2 || '#F4EBD0');
  const veil = o.hat === 'ade';
  return '<g class="x-head" style="transform-origin:30px 37px">' + back +
    '<path d="M26 32 h8 v10 h-8 Z" fill="' + dk(sk, 0.1) + '"/>' +
    '<path d="M19.6 23.6 q-2.6 .2 -2.2 2.8 q.4 2.4 2.6 2 Z M40.4 23.6 q2.6 .2 2.2 2.8 q-.4 2.4 -2.6 2 Z" fill="' + dk(sk, 0.08) + '"/>' +
    '<path d="M30 ' + (cy - 11.4) + ' C36.6 ' + (cy - 11.4) + ' 40.8 ' + (cy - 6.2) + ' 40.6 ' + cy + ' C40.4 ' + (cy + 6.4) + ' 36.4 ' + (cy + 11.8) + ' 30 ' + (cy + 11.8) + ' C23.6 ' + (cy + 11.8) + ' 19.6 ' + (cy + 6.4) + ' 19.4 ' + cy + ' C19.2 ' + (cy - 6.2) + ' 23.4 ' + (cy - 11.4) + ' 30 ' + (cy - 11.4) + ' Z" fill="' + sk + '"/>' +
    '<path d="M36.6 15.6 Q41.4 20 40.4 27.4 Q39 34.4 31.4 36.6 Q37 32 37.6 25.6 Q38 20 36.6 15.6 Z" fill="' + dk(sk, 0.28) + '" opacity=".7"/>' +
    '<path d="M23 18.6 q3.8 -3.6 9 -3 q-5 .8 -7.6 4 Z" fill="' + lt(sk, 0.4) + '" opacity=".45"/>' +
    '<path d="M24.3 24.2 q1.5 -2.4 3 0 q-1.5 2.2 -3 0 Z M32.7 24.2 q1.5 -2.4 3 0 q-1.5 2.2 -3 0 Z" fill="#1A0E06"/><path d="M25.9 23.3 h.7 v.7 h-.7 Z M34.3 23.3 h.7 v.7 h-.7 Z" fill="#fff" opacity=".85"/>' +
    '<path d="M23.2 21 q2.4 -1.4 4.8 -.2 M32 20.8 q2.4 -1.2 4.8 .2" stroke="#1A0E06" stroke-width="1" fill="none" stroke-linecap="round"/>' +
    '<path d="M29.8 23.4 q.4 2.4 .8 3.4 M27.4 27.6 q1.2 1.2 2.6 .5 q1.4 .7 2.6 -.5" stroke="' + dk(sk, 0.45) + '" stroke-width=".85" fill="none" stroke-linecap="round"/>' +
    '<path class="x-ms" d="M26.2 30.4 Q30 33.8 33.8 30.4" stroke="#3A1A0A" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
    '<path class="x-mf" d="M26.6 32.6 Q30 30 33.4 32.6" stroke="#3A1A0A" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0"/>' +
    (o.beard ? '<path d="M21.4 28 Q22 37.6 30 38.4 Q38 37.6 38.6 28 Q36 33.4 30 33.4 Q24 33.4 21.4 28 Z" fill="' + (o.beard === 'w' ? '#E8E4DC' : '#24160C') + '"/>' : '') +
    (o.marks ? '<path d="M21.6 26.4 h3 M21.8 28.4 h3 M21.6 30.4 h3 M35.4 26.4 h3 M35.2 28.4 h3 M35.4 30.4 h3" stroke="' + dk(sk, 0.4) + '" stroke-width=".6"/>' : '') +
    front + (o.beads ? '<path d="M24 38 Q30 44 36 38" stroke="#E64A19" stroke-width="2.4" fill="none"/><path d="M24 38 Q30 44 36 38" stroke="#FF8A65" stroke-width=".8" fill="none" stroke-dasharray="1 1.4"/>' : '') +
    (o.load ? '<g transform="translate(30 ' + (o.hat === 'gele' ? -4 : 4) + ') scale(1.4)">' + o.load + '</g>' : '') + (o.face || '') + '</g>';
}
function body(o, sk) {
  const r = o.robe, r2 = o.robe2 || dk(o.robe, 0.2), t = o.trim || '#F4EBD0';
  if (o.kind === 'man') // buba and sokoto, or an agbada over them (o.agbada), or an Igbo isiagu (robe = a pattern url)
    return '<path d="M21 118 h7 v14 h-9 Z M32 118 h7 l2 14 h-9 Z" fill="' + (o.trou || '#E8DFC8') + '"/><path d="M17 131 h11 v3 h-12 Z M32 131 h11 l1 3 h-12 Z" fill="#3A2416"/>' +
      (o.agbada ? '<path d="M14 43 Q30 37 46 43 Q60 72 58 112 Q48 117 40 115 L38 70 L22 70 L20 115 Q12 117 2 112 Q0 72 14 43 Z" fill="' + r + '"/>' +
        '<path d="M38 70 L40 115 Q48 117 58 112 Q60 72 46 43 Q44 60 38 70 Z" fill="#000" opacity=".14"/>' +
        '<path d="M24 46 Q30 64 36 46" fill="none" stroke="' + t + '" stroke-width="1.6"/><path d="M23 52 q-3 10 3 14 q5 2 7 -4" stroke="' + t + '" stroke-width="1.2" fill="none"/>'
      : '<path d="M15 43 Q30 38 45 43 L48 98 Q30 103 12 98 Z" fill="' + r + '"/><path d="M38 42 Q44 42 45 43 L48 98 Q43 100 40 100 Z" fill="#000" opacity=".14"/>' +
        '<path d="M25 44 L30 54 L35 44" fill="none" stroke="' + t + '" stroke-width="1.3"/><path d="M14 96 Q30 101 47 96" stroke="' + t + '" stroke-width="1.1" fill="none"/>' +
        '<path d="M20 98 L22 120 H38 L40 98 Z" fill="' + (o.trou || '#E8DFC8') + '"/>');
  if (o.kind === 'boy')
    return '<path d="M22 108 h6 v24 h-7 Z M32 108 h6 l1 24 h-7 Z" fill="' + (o.trou || '#3B4A6B') + '"/><path d="M19 130 h9 v4 h-10 Z M32 130 h9 l1 4 h-10 Z" fill="#3A2416"/>' +
      '<path d="M17 45 Q30 40 43 45 L46 110 Q30 114 14 110 Z" fill="' + r + '"/><path d="M36 45 Q42 44 43 45 L46 110 Q42 112 38 112 Z" fill="#000" opacity=".14"/>' +
      '<path d="M25 46 L30 54 L35 46" fill="none" stroke="' + t + '" stroke-width="1.2"/>';
  // woman / girl: a buba blouse, an iro (or george) wrapper, sometimes an ipele over the shoulder
  return '<path d="M20 130 h8 v4 h-9 Z M32 130 h8 l1 4 h-9 Z" fill="' + dk(sk, 0.35) + '"/>' +
    '<path d="M14 43 Q30 38 46 43 L49 84 L11 84 Z" fill="' + r + '"/><path d="M37 41 Q43 41 46 43 L49 84 L39 84 Z" fill="#000" opacity=".13"/>' +
    '<path d="M23 43 Q30 51 37 43" fill="none" stroke="' + t + '" stroke-width="1.4"/>' +
    '<path d="M10 82 L50 82 L53 131 Q30 135 7 131 Z" fill="' + (o.wrap || '#2F6B9A') + '"/><path d="M10 82 L50 82 L50.6 88 L9.4 88 Z" fill="' + (o.wrap2 || dk(o.wrap || '#2F6B9A', 0.3)) + '"/>' +
    '<path d="M42 90 Q40 110 45 131 M20 92 Q18 112 16 131" stroke="rgba(0,0,0,.22)" stroke-width="1.1" fill="none"/>' +
    (o.ipele ? '<path d="M44 44 Q52 70 49 96 L42 94 Q44 70 38 46 Z" fill="' + o.ipele + '"/>' : '');
}
/** a standing person with feet at (x, y), h units tall. o: kind man|woman|boy|girl, skin, robe, robe2, trim, trou, wrap,
 *  wrap2, ipele, agbada, hat (fila gobi okpu okpuf gele tie ade crownr hair braids), hatc, hatc2, beads, beard, marks,
 *  al / ar (arm poses), alc / arc (arm classes), hl / hr (things in the hands), load (on the head), cls, flip */
export function person(x, y, h, o) {
  const s = h / 140, sk = SKT[(o.skin || 0) % SKT.length], w = o.kind === 'man' ? 11 : 8.6;
  const arms = arm('l', o.al || 'down', o.sl || o.robe, sk, o.alc || '', w, o.hl || '') + arm('r', o.ar || 'down', o.sl || o.robe, sk, o.arc || '', w, o.hr || '');
  const inner = '<ellipse cx="30" cy="135" rx="22" ry="3.4" fill="rgba(40,24,10,.28)"/>' +
    '<g class="x-fig' + (o.cls ? ' ' + o.cls : '') + '" style="transform-origin:30px 134px"' + (o.flip ? ' transform="translate(60 0) scale(-1 1)"' : '') + '>' + (o.behind || '') +
    body(o, sk) + arms + head(o, sk) + (o.front || '') + '</g>';
  return '<svg x="' + f1(x - 30 * s) + '" y="' + f1(y - 134 * s) + '" width="' + f1(60 * s) + '" height="' + f1(140 * s) + '" viewBox="0 0 60 140" overflow="visible">' + inner + '</svg>';
}
/** a tiny far-off figure for crowds */
export const tiny = (x, y, c, hc, s = 1, sk = '#6B4022') => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')"><path d="M-2.4 0 L-2 -6 Q0 -7 2 -6 L2.4 0 Z" fill="' + c + '"/><circle cy="-8" r="1.7" fill="' + sk + '"/>' +
  (hc ? '<path d="M-1.9 -8.6 Q0 -11.4 1.9 -8.6 Z" fill="' + hc + '"/>' : '') + '</g>';
export function crowd(x0, x1, y, n, cols, hats, s = 1) {
  let g = ''; for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i + 0.5) / n + ((i * 7) % 5 - 2) * 0.5, yy = y + ((i * 3) % 4) * 0.6;
    g += tiny(x, yy, cols[i % cols.length], hats[(i * 5) % hats.length], s, SKT[i % SKT.length]); }
  return g;
}

/* ---------- sky, land and water ---------- */
export const rect = (fill, y = 0, h = 200) => '<rect y="' + y + '" width="320" height="' + h + '" fill="' + fill + '"/>';
export const sun = (x, y, r, c = '#FFE7A3') => '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 2.2) + '" fill="' + c + '" opacity=".25" class="x-glow"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/>';
export const cloud = (x, y, s, c = '#fff', o = .9) => '<g class="x-cl0" style="--d:' + (40 + (x % 7) * 6) + 's"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + c + '" opacity="' + o + '"><ellipse rx="16" ry="4"/><ellipse cx="7" cy="-2.6" rx="8" ry="4.8"/><ellipse cx="-6" cy="-1.6" rx="6.4" ry="3.6"/></g></g>';
export const birds = (x, y, n = 3) => { let g = ''; for (let i = 0; i < n; i++) g += '<g class="x-bird" style="animation-delay:-' + (i * 1.7).toFixed(1) + 's"><path transform="translate(' + (x + i * 9) + ' ' + (y + (i % 2) * 4) + ')" d="M-3 0 Q-1.5 -1.6 0 0 Q1.5 -1.6 3 0" stroke="#3A3A44" stroke-width=".6" fill="none"/></g>'; return g; };
/** a rolling line of hills or forest, as one filled path from x 0 to 320 at height y, bumps of size a */
export function ridge(y, a, c, seed = 1, step = 16) {
  let d = 'M0 200 L0 ' + y; for (let x = 0; x <= 336; x += step) { const k = Math.sin(x * 0.07 * seed + seed) * a + Math.sin(x * 0.19 + seed * 2) * a * 0.4; d += ' Q' + f1(x + step / 2) + ' ' + f1(y - a - k) + ' ' + f1(x + step) + ' ' + f1(y + k * 0.3); }
  return '<path d="' + d + ' L320 200 Z" fill="' + c + '"/>';
}
/** the rainforest's edge: a band of round crowns, darker below */
export function forest(y, c = '#3F7A3A', seed = 3, n = 26) {
  let g = '<path d="M0 ' + (y + 6) + ' H320 V' + (y + 30) + ' H0 Z" fill="' + dk(c, 0.2) + '"/>';
  for (let i = 0; i < n; i++) { const x = i * 320 / (n - 1) + Math.sin(i * seed) * 4, r = 7 + ((i * seed) % 5); g += '<circle cx="' + f1(x) + '" cy="' + f1(y + 4 - (i % 3) * 2) + '" r="' + r + '" fill="' + (i % 2 ? c : lt(c, 0.08)) + '"/>'; }
  return g;
}
export const ground = (y, c, c2) => '<path d="M0 ' + y + ' Q80 ' + (y - 2) + ' 160 ' + (y + 1) + ' T320 ' + y + ' V200 H0 Z" fill="' + c + '"/>' + (c2 ? '<path d="M0 ' + (y + 14) + ' Q120 ' + (y + 10) + ' 220 ' + (y + 15) + ' T320 ' + (y + 13) + ' V200 H0 Z" fill="' + c2 + '" opacity=".5"/>' : '');
export const tufts = (y0, y1, n, c = '#5E8F3A') => { let p = ''; for (let i = 0; i < n; i++) { const x = (i * 53) % 320, y = y0 + ((i * 37) % Math.max(1, (y1 - y0))); p += 'M' + x + ' ' + y + ' l-1.6 -3.4 M' + x + ' ' + y + ' l0 -4 M' + x + ' ' + y + ' l1.6 -3.4 '; } return '<path d="' + p + '" stroke="' + c + '" stroke-width=".6" fill="none"/>'; };
export function water(y, h, fill, c = '#D4EDF6') {
  let r = ''; for (let i = 0; i < 18; i++) { const x = (i * 71) % 320, yy = y + 6 + ((i * 29) % Math.max(4, h - 10)); r += 'M' + x + ' ' + yy + ' q5 -1.6 10 0 '; }
  return '<rect y="' + y + '" width="320" height="' + h + '" fill="' + fill + '"/><g class="x-rip"><path d="' + r + '" stroke="' + c + '" stroke-width=".6" fill="none" opacity=".55" stroke-linecap="round"/></g>';
}

/* ---------- trees ---------- */
const frond = (a, L, c) => { const r = a * Math.PI / 180, x = Math.cos(r) * L, y = Math.sin(r) * L;
  return '<path d="M0 0 Q' + f1(x * .5) + ' ' + f1(y * .5 - L * .28) + ' ' + f1(x) + ' ' + f1(y + L * .18) + '" stroke="' + c + '" stroke-width="' + f1(L * .16) + '" fill="none" stroke-linecap="round"/>' +
    '<path d="M0 0 Q' + f1(x * .5) + ' ' + f1(y * .5 - L * .28) + ' ' + f1(x) + ' ' + f1(y + L * .18) + '" stroke="' + dk(c, .25) + '" stroke-width="' + f1(L * .03) + '" fill="none" stroke-dasharray="' + f1(L * .05) + ' ' + f1(L * .05) + '"/>'; };
/** an oil palm: a rough trunk and a full head of arching fronds, with its bunch of red-orange fruit */
export function oilPalm(x, y, s = 1, c = '#3F8A35') {
  const H = 46 * s;
  let tr = '<path d="M' + f1(x - 2 * s) + ' ' + y + ' Q' + f1(x + 2 * s) + ' ' + f1(y - H * .5) + ' ' + f1(x) + ' ' + f1(y - H) + ' L' + f1(x + 3 * s) + ' ' + f1(y - H) + ' Q' + f1(x + 5 * s) + ' ' + f1(y - H * .5) + ' ' + f1(x + 2.2 * s) + ' ' + y + ' Z" fill="#6E5236"/>';
  for (let k = 1; k < 9; k++) tr += '<path d="M' + f1(x - 1 * s) + ' ' + f1(y - H * k / 9) + ' l' + f1(4.6 * s) + ' ' + f1(-1.4 * s) + '" stroke="#4E3A26" stroke-width="' + f1(.6 * s) + '"/>';
  let fr = ''; [-170, -145, -120, -95, -70, -45, -20, 5, -160, -30].forEach((a, i) => { fr += frond(a, (17 + (i % 3) * 3) * s, i % 2 ? c : lt(c, .1)); });
  return '<g>' + tr + '<g transform="translate(' + f1(x + 1.5 * s) + ' ' + f1(y - H) + ')"><g class="x-leaf">' + fr + '</g><circle cx="' + f1(1 * s) + '" cy="' + f1(3 * s) + '" r="' + f1(3 * s) + '" fill="#D2501E"/><circle cx="' + f1(-1.4 * s) + '" cy="' + f1(3.6 * s) + '" r="' + f1(2.2 * s) + '" fill="#A8361A"/></g></g>';
}
/** a coconut palm by the lagoon: tall, leaning, a lighter crown */
export function coconut(x, y, s = 1, lean = 1) {
  const H = 60 * s, tx = x + lean * 12 * s;
  let fr = ''; [-175, -150, -120, -60, -30, -5, -90].forEach((a, i) => { fr += frond(a, (20 + (i % 2) * 4) * s, i % 2 ? '#4E9A3E' : '#6BB04E'); });
  return '<g><path d="M' + x + ' ' + y + ' Q' + f1(x + lean * 2 * s) + ' ' + f1(y - H * .6) + ' ' + f1(tx) + ' ' + f1(y - H) + '" stroke="#8A6A46" stroke-width="' + f1(3.2 * s) + '" fill="none"/>' +
    '<g transform="translate(' + f1(tx) + ' ' + f1(y - H) + ')"><g class="x-leaf">' + fr + '</g><circle r="' + f1(2.2 * s) + '" cx="' + f1(-1.5 * s) + '" cy="' + f1(2 * s) + '" fill="#6A8A2E"/><circle r="' + f1(2.2 * s) + '" cx="' + f1(1.5 * s) + '" cy="' + f1(2.4 * s) + '" fill="#5A7A26"/></g></g>';
}
/** a plantain: three or four broad, torn leaves on a soft stem */
export function plantain(x, y, s = 1) {
  const leaf = (a, L, c) => '<g transform="translate(' + x + ' ' + f1(y - 18 * s) + ') rotate(' + a + ')"><path d="M0 0 Q' + f1(L * .5) + ' ' + f1(-L * .28) + ' ' + f1(L) + ' ' + f1(-L * .05) + ' Q' + f1(L * .5) + ' ' + f1(L * .18) + ' 0 0 Z" fill="' + c + '"/><path d="M0 0 Q' + f1(L * .5) + ' ' + f1(-L * .05) + ' ' + f1(L) + ' ' + f1(-L * .05) + '" stroke="' + dk(c, .3) + '" stroke-width="' + f1(.5 * s) + '" fill="none"/></g>';
  return '<g><path d="M' + f1(x - 1.6 * s) + ' ' + y + ' Q' + x + ' ' + f1(y - 10 * s) + ' ' + f1(x - .6 * s) + ' ' + f1(y - 19 * s) + ' L' + f1(x + 1.2 * s) + ' ' + f1(y - 19 * s) + ' Q' + f1(x + 2 * s) + ' ' + f1(y - 10 * s) + ' ' + f1(x + 1.8 * s) + ' ' + y + ' Z" fill="#7FA45A"/>' +
    '<g class="x-leaf">' + leaf(-150, 18 * s, '#5E9A3A') + leaf(-110, 20 * s, '#6FAE45') + leaf(-60, 19 * s, '#5E9A3A') + leaf(-20, 16 * s, '#7DBA50') + '</g></g>';
}
/** a big broad-crowned tree (iroko, or the udara), its crown in heaped lobes lit from the upper left */
export function bigTree(x, y, s = 1, c = '#3F7A3A', fruit = '') {
  let g = '<path d="M' + f1(x - 3 * s) + ' ' + y + ' Q' + f1(x - 2 * s) + ' ' + f1(y - 18 * s) + ' ' + f1(x - 6 * s) + ' ' + f1(y - 32 * s) + ' M' + f1(x + 3 * s) + ' ' + y + ' Q' + f1(x + 3 * s) + ' ' + f1(y - 20 * s) + ' ' + f1(x + 8 * s) + ' ' + f1(y - 30 * s) + '" stroke="#5A4028" stroke-width="' + f1(3.6 * s) + '" fill="none"/>' +
    '<path d="M' + f1(x - 4 * s) + ' ' + y + ' L' + f1(x - 3 * s) + ' ' + f1(y - 22 * s) + ' L' + f1(x + 3 * s) + ' ' + f1(y - 22 * s) + ' L' + f1(x + 4 * s) + ' ' + y + ' Z" fill="#5A4028"/>';
  const lobes = [[-14, -36, 14], [0, -44, 16], [14, -36, 14], [-24, -28, 10], [24, -28, 10], [-6, -30, 12], [8, -28, 12]];
  g += '<g class="x-crown">' + lobes.map(([dx, dy, r], i) => '<circle cx="' + f1(x + dx * s) + '" cy="' + f1(y + dy * s) + '" r="' + f1(r * s) + '" fill="' + (i % 3 === 1 ? lt(c, 0.12) : i % 2 ? dk(c, 0.1) : c) + '"/>').join('') +
    lobes.slice(0, 3).map(([dx, dy, r]) => '<circle cx="' + f1(x + (dx - r * .3) * s) + '" cy="' + f1(y + (dy - r * .35) * s) + '" r="' + f1(r * .45 * s) + '" fill="' + lt(c, 0.22) + '" opacity=".7"/>').join('') + fruit + '</g>';
  return '<g>' + g + '</g>';
}
export const bush = (x, y, s = 1, c = '#4E8A3E') => '<g><ellipse cx="' + x + '" cy="' + f1(y - 3 * s) + '" rx="' + f1(9 * s) + '" ry="' + f1(5 * s) + '" fill="' + c + '"/><ellipse cx="' + f1(x - 4 * s) + '" cy="' + f1(y - 5 * s) + '" rx="' + f1(5 * s) + '" ry="' + f1(4 * s) + '" fill="' + lt(c, .12) + '"/></g>';
/** a cocoa tree with its pods growing straight from the trunk */
export function cocoaTree(x, y, s = 1) {
  return bigTree(x, y, s * .6, '#2F6B32') + '<g fill="#C9781E">' + [[-1.8, -10], [2, -14], [-1, -18]].map(([dx, dy]) => '<ellipse cx="' + f1(x + dx * s) + '" cy="' + f1(y + dy * s) + '" rx="' + f1(1.4 * s) + '" ry="' + f1(2.6 * s) + '"/>').join('') + '</g>';
}
/** a cassava plant: thin red stems and hand-shaped leaves */
export function cassava(x, y, s = 1) {
  let g = '<path d="M' + x + ' ' + y + ' Q' + f1(x - 1 * s) + ' ' + f1(y - 8 * s) + ' ' + f1(x - 3 * s) + ' ' + f1(y - 14 * s) + ' M' + x + ' ' + y + ' Q' + f1(x + 1 * s) + ' ' + f1(y - 9 * s) + ' ' + f1(x + 3 * s) + ' ' + f1(y - 13 * s) + '" stroke="#9A4A3A" stroke-width="' + f1(.7 * s) + '" fill="none"/>';
  [[-3, -14], [3, -13], [0, -9]].forEach(([dx, dy]) => { for (let k = -2; k <= 2; k++) g += '<ellipse cx="' + f1(x + dx * s + k * 1.4 * s) + '" cy="' + f1(y + dy * s - (2 - Math.abs(k)) * s) + '" rx="' + f1(.7 * s) + '" ry="' + f1(2.4 * s) + '" transform="rotate(' + (k * 22) + ' ' + f1(x + dx * s + k * 1.4 * s) + ' ' + f1(y + dy * s - (2 - Math.abs(k)) * s) + ')" fill="#4E8A3A"/>'; });
  return '<g class="x-leaf2">' + g + '</g>';
}
/** a yam mound with its vine climbing a stake */
export const yamMound = (x, y, s = 1) => '<g><ellipse cx="' + x + '" cy="' + y + '" rx="' + f1(8 * s) + '" ry="' + f1(4 * s) + '" fill="#8E5A34"/><ellipse cx="' + f1(x - 2 * s) + '" cy="' + f1(y - 1.2 * s) + '" rx="' + f1(4 * s) + '" ry="' + f1(1.8 * s) + '" fill="#A8703E"/>' +
  '<path d="M' + x + ' ' + f1(y - 3 * s) + ' V' + f1(y - 20 * s) + '" stroke="#7A5A3A" stroke-width="' + f1(.7 * s) + '"/><path d="M' + x + ' ' + f1(y - 4 * s) + ' q' + f1(3 * s) + ' ' + f1(-3 * s) + ' 0 ' + f1(-6 * s) + ' q' + f1(-3 * s) + ' ' + f1(-3 * s) + ' 0 ' + f1(-6 * s) + ' q' + f1(3 * s) + ' ' + f1(-3 * s) + ' 0 ' + f1(-5 * s) + '" stroke="#4E8A3A" stroke-width="' + f1(.6 * s) + '" fill="none"/>' +
  [[-2, -8], [2, -12], [-2, -15], [1.6, -18]].map(([dx, dy]) => '<path d="M' + f1(x + dx * s) + ' ' + f1(y + dy * s) + ' q' + f1(dx * .9 * s) + ' ' + f1(-1.6 * s) + ' ' + f1(dx * 1.2 * s) + ' ' + f1(1 * s) + ' q' + f1(-dx * .6 * s) + ' ' + f1(1 * s) + ' ' + f1(-dx * 1.2 * s) + ' ' + f1(-1 * s) + ' Z" fill="#5E9A3A"/>').join('') + '</g>';

/* ---------- buildings ---------- */
/** a house of the south: plastered walls, a pitched zinc roof (rusty or new), louvred windows and a door; base (x, y), width w */
export function house(x, y, w, h, wall = '#E9D7B4', roof = 'zinc', o = {}) {
  const k = kit(o.id || 'h'), rh = h * 0.55, door = o.door || '#6B4A2A', fill = roof === 'zincg' ? '#A9B2B4' : '#9A6A48';
  let s = '<path d="M' + x + ' ' + y + ' V' + f1(y - h) + ' H' + f1(x + w) + ' V' + y + ' Z" fill="' + wall + '"/>' +
    '<path d="M' + f1(x + w * .62) + ' ' + y + ' V' + f1(y - h) + ' H' + f1(x + w) + ' V' + y + ' Z" fill="#000" opacity=".1"/>' +
    '<path d="M' + x + ' ' + f1(y - h * .14) + ' H' + f1(x + w) + ' V' + y + ' H' + x + ' Z" fill="' + dk(wall, .25) + '" opacity=".55"/>' +
    '<path d="M' + f1(x - w * .06) + ' ' + f1(y - h + .4) + ' L' + f1(x + w * .5) + ' ' + f1(y - h - rh) + ' L' + f1(x + w * 1.06) + ' ' + f1(y - h + .4) + ' Z" fill="url(#' + P + (o.pid || 'z') + '-' + roof + ')"/>' +
    '<path d="M' + f1(x - w * .06) + ' ' + f1(y - h + .4) + ' L' + f1(x + w * .5) + ' ' + f1(y - h - rh) + ' L' + f1(x + w * 1.06) + ' ' + f1(y - h + .4) + '" stroke="' + dk(fill, .3) + '" stroke-width=".6" fill="none"/>';
  const nw = Math.max(1, Math.floor(w / 18));
  for (let i = 0; i < nw; i++) { const wx = x + w * (i + .5) / (nw + .6) - 2.6, wy = y - h * .72; s += '<rect x="' + f1(wx) + '" y="' + f1(wy) + '" width="5.2" height="' + f1(h * .34) + '" fill="#4A3A2E"/><path d="M' + f1(wx) + ' ' + f1(wy + 1.4) + ' h5.2 M' + f1(wx) + ' ' + f1(wy + 2.8) + ' h5.2 M' + f1(wx) + ' ' + f1(wy + 4.2) + ' h5.2" stroke="#BFC7C9" stroke-width=".55"/>'; }
  s += '<rect x="' + f1(x + w * .78) + '" y="' + f1(y - h * .6) + '" width="' + f1(w * .13) + '" height="' + f1(h * .6) + '" fill="' + door + '"/>';
  if (o.sign) s += '<rect x="' + f1(x + w * .08) + '" y="' + f1(y - h - .2) + '" width="' + f1(w * .84) + '" height="' + f1(h * .2) + '" fill="' + (o.signc || '#FFFDF7') + '"/><text x="' + f1(x + w * .5) + '" y="' + f1(y - h + h * .15) + '" font-size="' + f1(h * .14) + '" text-anchor="middle" font-family="Baloo 2,system-ui" font-weight="800" fill="' + (o.signt || '#1F3A78') + '">' + o.sign + '</text>';
  return '<g>' + s + '</g>';
}
/** a Yoruba compound house: a long low house with a deep veranda on carved posts (opó), under a hipped zinc roof */
export function compound(x, y, w, h, wall = '#C8784A', o = {}) {
  let s = '<path d="M' + x + ' ' + y + ' V' + f1(y - h) + ' H' + f1(x + w) + ' V' + y + ' Z" fill="' + wall + '"/>' +
    '<path d="M' + x + ' ' + f1(y - h * .16) + ' H' + f1(x + w) + ' V' + y + ' H' + x + ' Z" fill="' + dk(wall, .3) + '" opacity=".5"/>' +
    '<path d="M' + f1(x - w * .05) + ' ' + f1(y - h) + ' L' + f1(x + w * .12) + ' ' + f1(y - h * 1.55) + ' H' + f1(x + w * .88) + ' L' + f1(x + w * 1.05) + ' ' + f1(y - h) + ' Z" fill="url(#' + P + (o.pid || 'z') + '-' + (o.roof || 'zinc') + ')"/>' +
    '<path d="M' + f1(x - w * .05) + ' ' + f1(y - h) + ' H' + f1(x + w * 1.05) + '" stroke="#5A3A22" stroke-width="1"/>' +
    '<path d="M' + f1(x + w * .1) + ' ' + f1(y - h * .82) + ' H' + f1(x + w * .9) + ' V' + y + ' H' + f1(x + w * .1) + ' Z" fill="' + dk(wall, .45) + '"/>';
  const n = Math.max(3, Math.round(w / 12));
  for (let i = 0; i <= n; i++) { const px = x + w * .1 + (w * .8) * i / n;
    s += '<path d="M' + f1(px - 1.3) + ' ' + y + ' V' + f1(y - h * .98) + ' H' + f1(px + 1.3) + ' V' + y + ' Z" fill="#7A4A26"/>' +
      '<path d="M' + f1(px - 1.3) + ' ' + f1(y - h * .7) + ' h2.6 M' + f1(px - 1.3) + ' ' + f1(y - h * .45) + ' h2.6" stroke="#E8C39A" stroke-width=".5"/><circle cx="' + f1(px) + '" cy="' + f1(y - h * .58) + '" r=".9" fill="#5A3418"/>'; }
  return '<g>' + s + '</g>';
}
/** an Igbo obi: the father's meeting house, red-earth walls with uli lines, a low door, a thick thatch (or zinc) roof */
export function obi(x, y, w, h, o = {}) {
  const pid = o.pid || 'z';
  return '<g><path d="M' + x + ' ' + y + ' V' + f1(y - h) + ' H' + f1(x + w) + ' V' + y + ' Z" fill="url(#' + P + pid + '-uli)"/>' +
    '<path d="M' + f1(x + w * .64) + ' ' + y + ' V' + f1(y - h) + ' H' + f1(x + w) + ' V' + y + ' Z" fill="#000" opacity=".12"/>' +
    '<path d="M' + f1(x + w * .4) + ' ' + y + ' V' + f1(y - h * .62) + ' Q' + f1(x + w * .5) + ' ' + f1(y - h * .76) + ' ' + f1(x + w * .6) + ' ' + f1(y - h * .62) + ' V' + y + ' Z" fill="#2A1A10"/>' +
    '<path d="M' + f1(x - w * .1) + ' ' + f1(y - h + 1) + ' L' + f1(x + w * .5) + ' ' + f1(y - h * 1.9) + ' L' + f1(x + w * 1.1) + ' ' + f1(y - h + 1) + ' Q' + f1(x + w * .5) + ' ' + f1(y - h + 3) + ' ' + f1(x - w * .1) + ' ' + f1(y - h + 1) + ' Z" fill="url(#' + P + pid + '-' + (o.roof || 'thatch') + ')"/>' +
    '<path d="M' + f1(x + w * .5) + ' ' + f1(y - h * 1.9) + ' L' + f1(x + w * 1.1) + ' ' + f1(y - h + 1) + ' L' + f1(x + w * .7) + ' ' + f1(y - h + 2) + ' Z" fill="#000" opacity=".14"/></g>';
}
/** a market shed: a zinc lean-to on poles with a counter of goods (colours) under it */
export function shed(x, y, w, goods = ['#C62828', '#E8A317', '#4E8A3A'], o = {}) {
  const pid = o.pid || 'z', h = 16;
  let s = '<path d="M' + f1(x - 2) + ' ' + f1(y - h) + ' L' + f1(x + w + 2) + ' ' + f1(y - h - 3) + ' L' + f1(x + w + 3) + ' ' + f1(y - h + 2) + ' L' + f1(x - 3) + ' ' + f1(y - h + 4) + ' Z" fill="url(#' + P + pid + '-' + (o.roof || 'zinc') + ')"/>' +
    '<path d="M' + f1(x + 1) + ' ' + f1(y - h + 3) + ' V' + y + ' M' + f1(x + w - 1) + ' ' + f1(y - h + 1) + ' V' + y + '" stroke="#5A4028" stroke-width="1"/>' +
    '<rect x="' + x + '" y="' + f1(y - 6) + '" width="' + w + '" height="6" fill="#8B5A2B"/><rect x="' + x + '" y="' + f1(y - 6) + '" width="' + w + '" height="1" fill="#B07A44"/>';
  const n = Math.max(2, Math.floor(w / 5));
  for (let i = 0; i < n; i++) s += '<ellipse cx="' + f1(x + 2.5 + i * (w - 5) / (n - 1)) + '" cy="' + f1(y - 7.4) + '" rx="2.3" ry="1.7" fill="' + goods[i % goods.length] + '"/>';
  return '<g>' + s + '</g>';
}
export const umbrella = (x, y, c1, c2, s = 1) => '<g><path d="M' + x + ' ' + y + ' V' + f1(y - 14 * s) + '" stroke="#5A4A3A" stroke-width="' + f1(.6 * s) + '"/><path d="M' + f1(x - 11 * s) + ' ' + f1(y - 12 * s) + ' Q' + x + ' ' + f1(y - 22 * s) + ' ' + f1(x + 11 * s) + ' ' + f1(y - 12 * s) + ' Z" fill="' + c1 + '"/>' +
  '<path d="M' + x + ' ' + f1(y - 18.6 * s) + ' L' + f1(x - 4 * s) + ' ' + f1(y - 12 * s) + ' L' + f1(x + 4 * s) + ' ' + f1(y - 12 * s) + ' Z" fill="' + c2 + '"/></g>';
/** a party canopy (the owambe tent): striped cloth on poles, a scalloped edge */
export function canopy(x, y, w, c1, c2, h = 30) {
  let s = '<path d="M' + x + ' ' + f1(y - h) + ' L' + f1(x + w * .5) + ' ' + f1(y - h - 10) + ' L' + f1(x + w) + ' ' + f1(y - h) + ' Z" fill="' + c1 + '"/>';
  const n = Math.max(4, Math.round(w / 10));
  for (let i = 0; i < n; i++) { const a = x + w * i / n, b = x + w * (i + 1) / n; s += '<path d="M' + f1(a) + ' ' + f1(y - h) + ' Q' + f1((a + b) / 2) + ' ' + f1(y - h + 5) + ' ' + f1(b) + ' ' + f1(y - h) + ' Z" fill="' + (i % 2 ? c1 : c2) + '"/>'; }
  s += '<path d="M' + f1(x + 1) + ' ' + f1(y - h) + ' V' + y + ' M' + f1(x + w - 1) + ' ' + f1(y - h) + ' V' + y + ' M' + f1(x + w * .5) + ' ' + f1(y - h - 9) + ' V' + y + '" stroke="#9E9E9E" stroke-width=".9"/>';
  return '<g>' + s + '</g>';
}
/** a road: a laterite (red earth) or tarred band across the picture */
export const road = (y, h, tar) => '<path d="M0 ' + y + ' Q160 ' + (y - 2) + ' 320 ' + y + ' V' + (y + h) + ' Q160 ' + (y + h + 2) + ' 0 ' + (y + h) + ' Z" fill="' + (tar ? '#5E5A56' : '#B4643A') + '"/>' +
  (tar ? '<path d="M0 ' + (y + h / 2) + ' H320" stroke="#E8E2D2" stroke-width=".8" stroke-dasharray="8 7"/>' : '<path d="M0 ' + (y + h * .3) + ' Q160 ' + (y + h * .2) + ' 320 ' + (y + h * .32) + '" stroke="#8E4A28" stroke-width=".6" fill="none" opacity=".6"/>');

/* ---------- things ---------- */
/** a danfo: the yellow Lagos bus with its black stripes */
export function danfo(x, y, s = 1, words = '') {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-26 0 V-14 Q-26 -19 -20 -19 H18 Q24 -19 26 -12 V0 Z" fill="#F6C12B"/><path d="M-26 -6 H26" stroke="#1B1B1B" stroke-width="2"/><path d="M-26 -3 H26" stroke="#1B1B1B" stroke-width=".8"/>' +
    [-22, -12, -2, 8].map((wx) => '<rect x="' + wx + '" y="-17" width="8" height="7" rx="1" fill="#9FC8DA"/>').join('') + '<path d="M18 -17 h5 l2 7 h-7 Z" fill="#9FC8DA"/>' +
    (words ? '<text x="-2" y="-11.6" font-size="3.4" text-anchor="middle" font-family="Baloo 2,system-ui" font-weight="800" fill="#1B1B1B">' + words + '</text>' : '') +
    '<circle cx="-16" cy="0" r="4" fill="#2A2A2A"/><circle cx="-16" cy="0" r="1.6" fill="#9E9E9E"/><circle cx="16" cy="0" r="4" fill="#2A2A2A"/><circle cx="16" cy="0" r="1.6" fill="#9E9E9E"/></g>';
}
/** a keke (the yellow tricycle taxi) */
export const keke = (x, y, s = 1, c = '#F6C12B') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-10 0 V-11 Q-10 -15 -6 -15 H6 Q10 -15 10 -8 L12 0 Z" fill="' + c + '"/><path d="M-10 -15 H8 L10 -17 H-12 Z" fill="#2A2A2A"/><rect x="-7" y="-12" width="10" height="6" rx="1" fill="#9FC8DA"/><circle cx="-7" cy="0" r="3" fill="#2A2A2A"/><circle cx="9" cy="0" r="3" fill="#2A2A2A"/></g>';
/** a lorry of the Onitsha and Lagos roads: a painted wooden body, a slogan on the board */
export function lorry(x, y, s = 1, body = '#1F6B4A', words = '') {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-30 -4 V-22 H12 V-4 Z" fill="' + body + '"/><path d="M-30 -22 H12" stroke="#E8B830" stroke-width="1.6"/><path d="M-30 -13 H12" stroke="' + dk(body, .3) + '" stroke-width=".6"/>' +
    '<path d="M12 -4 V-18 H21 L27 -10 V-4 Z" fill="#C62828"/><path d="M14 -16 h6 l4 5 h-10 Z" fill="#9FC8DA"/>' +
    (words ? '<rect x="-27" y="-20" width="36" height="6" fill="#FFFDF7"/><text x="-9" y="-15.4" font-size="4.4" text-anchor="middle" font-family="Baloo 2,system-ui" font-weight="800" fill="#1B1B1B">' + words + '</text>' : '') +
    '<rect x="-31" y="-5" width="59" height="3" fill="#2A2A2A"/><circle cx="-20" cy="0" r="4.4" fill="#2A2A2A"/><circle cx="-20" cy="0" r="1.6" fill="#9E9E9E"/><circle cx="18" cy="0" r="4.4" fill="#2A2A2A"/><circle cx="18" cy="0" r="1.6" fill="#9E9E9E"/></g>';
}
/** a dugout canoe with a paddler (a person drawn into it) */
export const canoe = (x, y, l, c = '#6E4026') => '<g><path d="M' + f1(x - l / 2) + ' ' + f1(y - l * .08) + ' Q' + f1(x - l * .3) + ' ' + f1(y + l * .07) + ' ' + x + ' ' + f1(y + l * .07) + ' Q' + f1(x + l * .3) + ' ' + f1(y + l * .07) + ' ' + f1(x + l / 2) + ' ' + f1(y - l * .08) + ' Z" fill="' + c + '"/><path d="M' + f1(x - l / 2) + ' ' + f1(y - l * .08) + ' Q' + x + ' ' + f1(y - l * .02) + ' ' + f1(x + l / 2) + ' ' + f1(y - l * .08) + '" stroke="' + lt(c, .25) + '" stroke-width=".6" fill="none"/></g>';
export const goat = (x, y, s, c = '#F2EEE6', c2 = '#5A3A22') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="0" cy=".3" rx="9" ry="1.1" fill="rgba(40,24,10,.3)"/><path d="M-6 -2 v-5 M-3 -2 v-5 M4 -2 v-5 M6.4 -2 v-5" stroke="' + c2 + '" stroke-width="1.3"/><ellipse cx="0" cy="-8.5" rx="8" ry="4" fill="' + c + '"/>' +
  '<path d="M6 -10 Q10 -15 12 -13 Q13 -10 10 -8 Z" fill="' + c + '"/><path d="M10 -14 q1 -3 -1 -4 M11 -14 q2 -2 1 -4" stroke="' + c2 + '" stroke-width=".7" fill="none"/><circle cx="10.6" cy="-12" r=".6" fill="#1A0E06"/><path d="M-8 -9 q-3 -1 -3 -4" stroke="' + c + '" stroke-width="1.4" fill="none"/></g>';
export const hen = (x, y, s = 1, c = '#B5651D') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-pk"><ellipse cx="0" cy="-3.6" rx="4" ry="3" fill="' + c + '"/><circle cx="3.6" cy="-6.4" r="1.8" fill="' + c + '"/><path d="M3.6 -8.4 l.6 -1.2 l.6 1.2 Z" fill="#C62828"/><path d="M5.2 -6.6 l1.4 .4 l-1.4 .5 Z" fill="#E8A317"/><path d="M-4 -4 q-2 -3 -1 -5 q1 2 2 2" fill="' + dk(c, .2) + '"/></g><path d="M-1 -.8 V0 M1 -.8 V0" stroke="#E8A317" stroke-width=".5"/></g>';
/** bunting strung between two points: little flags in the given colours */
export function bunting(x0, y0, x1, y1, cols, sag = 6) {
  let s = '<path d="M' + x0 + ' ' + y0 + ' Q' + f1((x0 + x1) / 2) + ' ' + f1((y0 + y1) / 2 + sag) + ' ' + x1 + ' ' + y1 + '" stroke="#5A4A3A" stroke-width=".4" fill="none"/>';
  const n = Math.max(3, Math.round(Math.abs(x1 - x0) / 7));
  for (let i = 1; i < n; i++) { const t = i / n, x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + x1) / 2 + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag) + t * t * y1;
    s += '<path d="M' + f1(x - 1.6) + ' ' + f1(y) + ' L' + f1(x + 1.6) + ' ' + f1(y) + ' L' + f1(x) + ' ' + f1(y + 3.6) + ' Z" fill="' + cols[i % cols.length] + '"/>'; }
  return s;
}
/** the svg every scene is drawn in */
export const sceneSvg = (cls, defs, inner) => '<svg class="scene ' + P + ' ' + cls + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + defs + inner + '</svg>';

/* ---------- the cap swap: the Hausa caps in the shared pieces become this build's hats ---------- */
/** Yoruba: the hula becomes an abetí-ajá fila, the zanna a tall gobi, the Borno cap an aso-òkè fila */
export function capYo(kind, x, y, w, c, c2) {
  const C = { hula: ['fila', c || '#2E5E8A', c2 || '#F4EBD0'], zanna: ['gobi', c || '#7A2E5C', c2 || '#E8B830'], borno: ['fila', '#7A2E5C', '#E8B830'] }[kind] || ['fila', c, c2];
  return hat(C[0], x, y, w, C[1], C[2]);
}
/** Igbo: every cap becomes an okpu, red with a black band or black with a red one, as men wear them in the east */
export function capIg(kind, x, y, w, c, c2) {
  const red = kind !== 'zanna';
  return hat('okpu', x, y, w, red ? '#B71C1C' : '#1E1E24', red ? '#1E1E24' : '#B71C1C');
}
