// @ts-nocheck
import { arewaCap } from './capsArewa';
/*
 * Ginin bulo, drawn (Sani 2026-10-25). Magina at work on a building site in a Hausa village, savanna and low hills
 * behind. Left: a neem tree with water pots in its shade and a donkey. Behind the game's own mud house and Laila:
 * thatched round huts, a well with a woman drawing water. Right: a red-earth house going up (the finished half
 * plastered with zanko and relief, the other half bare courses of tubali), a man climbing a ladder with a pan of mud
 * on his head and another on the wall top; in front, two men tread mud and straw in a pit, rows of new bricks dry in
 * the sun, and an old builder kneels at his wooden mould. The game's house (bottom left) and Laila (bottom centre)
 * stand on open ground.
 *
 * Moving parts (sc-bulo.css animates transform and opacity only):
 *   people   .x-p (.cheerup raises arms) · .x-bd body · .x-hd head · .x-al / .x-ar arms · .x-up raised arms
 *            · .x-hh hands on head (the first treader, after a wrong answer)
 *   faces    .x-eo open eyes · .x-eh laughing eyes and mouth · .x-ms smile · .x-mf frown and brows
 *   idle     .ta / .tb the treaders stepping · .x-cl clouds · .x-pk the hen · .x-ear / .x-tail the donkey · .cy the carrier
 */
const P = 'bl4';
const SK = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#94603A'];
const n = (v) => Math.round(v * 10) / 10;
const lin = (id, stops, h) => `<linearGradient id="${P}-${id}" x1="0" y1="0" x2="${h ? 1 : 0}" y2="${h ? 0 : 1}">` +
  stops.map((c, i) => `<stop offset="${n(i / (stops.length - 1))}" stop-color="${c}"/>`).join('') + '</linearGradient>';
const rad = (id, stops, cx = .5, cy = .5, r = .5) => `<radialGradient id="${P}-${id}" cx="${cx}" cy="${cy}" r="${r}">` +
  stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('') + '</radialGradient>';
/** place a drawing; an animated class goes on an inner group so CSS transforms never fight the placement */
const at = (x, y, s, inner, cls = '', flip = false) =>
  `<g transform="translate(${n(x)} ${n(y)}) scale(${flip ? -s : s} ${s})">${cls ? `<g class="${cls}">${inner}</g>` : inner}</g>`;
const url = (id) => `url(#${P}-${id})`;
/** the sun is high on the upper left: a dark contact patch where a thing meets the ground and a soft shadow thrown to
    the lower right, foreshortened on the flat ground */
const shadow = (w, len = 1) => `<ellipse cx="${n(w * .62 * len)}" cy=".4" rx="${n(w * (1 + .55 * len))}" ry="${n(1.3 + .45 * len)}" fill="rgba(74,40,14,.2)"/>` +
  `<ellipse cx="${n(w * .12)}" cy=".1" rx="${n(w * .82)}" ry="${n(.8 + .25 * len)}" fill="rgba(48,22,6,.32)"/>`;
/** a sprinkle of marks from a fixed seed, so the mud and the ground have grain without random redraws */
function grain(x0, x1, y0, y1, k, fill, r = .35, seed = 7) {
  let s = '', v = seed;
  const rnd = () => (v = (v * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < k; i++) { const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), rr = r * (.5 + rnd()); s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rr * 1.6)}" ry="${n(rr)}"/>`; }
  return `<g fill="${fill}">${s}</g>`;
}

/* ---------------- people ---------------- */
function head(sk, o) {
  const hc = o.hatc || '#C2185B', h2 = o.hatc2 || '#FFD54A';
  let back = '', front = '';
  if (o.hat === 'veil') {
    back = `<path d="M-5.6 .4 Q-6 -6.6 0 -6.8 Q6 -6.6 5.6 .4 L8.4 9 Q0 11.4 -8.4 9 Z" fill="${hc}"/>`;
    front = `<path d="M-5.6 1.4 Q-6 -6.4 0 -6.6 Q6 -6.4 5.6 1.4 Q4.4 -3.6 0 -3.9 Q-4.4 -3.6 -5.6 1.4 Z" fill="${hc}"/><path d="M-4.8 -.6 Q0 -5.4 4.8 -.6" stroke="rgba(0,0,0,.15)" stroke-width=".5" fill="none"/>`;
  }
  if (o.hat === 'kallabi') front = `<path d="M-5.4 -.4 Q-6 -6.8 0 -6.8 Q6 -6.8 5.4 -.4 Q0 -4.2 -5.4 -.4 Z" fill="${hc}"/>` +
    `<path d="M-1.6 -6.2 Q-6.2 -11 -1.4 -9.8 Q0 -12.8 1.6 -9.8 Q6.4 -10.8 2 -6.2 Z" fill="${hc}"/><path d="M-1.4 -9.8 Q-.6 -8 -.4 -6.6 M1.6 -9.8 Q.8 -8 .4 -6.6" stroke="${h2}" stroke-width=".45" fill="none"/>` +
    `<path d="M-5.1 -2.2 Q0 -5.6 5.1 -2.2" stroke="${h2}" stroke-width=".7" fill="none"/><path d="M-4 -4.6 Q0 -6.4 4 -4.6" stroke="rgba(0,0,0,.18)" stroke-width=".4" fill="none"/>`;
  if (o.hat === 'hula' || o.hat === 'zanna' || o.hat === 'borno') front = arewaCap(o.hat, 0, -1.8, 5, hc, o.hatc2, o.hatc3, o.capside || 1);
  if (o.hat === 'hair') front = `<path d="M-4.9 -1.4 Q-5.2 -5.8 0 -5.8 Q5.2 -5.8 4.9 -1.4 Q2.4 -3.8 0 -3.6 Q-2.4 -3.8 -4.9 -1.4 Z" fill="#1E120A"/>`;
  return back +
    `<circle cx="-4.9" cy=".4" r="1.1" fill="${sk}"/><circle cx="4.9" cy=".4" r="1.1" fill="${sk}"/>` +
    `<circle r="5" fill="${sk}"/><circle r="5" fill="${url('shade')}"/>` +
    `<g class="x-eo" fill="#1A0E06"><circle cx="-1.8" cy="-.3" r=".62"/><circle cx="1.8" cy="-.3" r=".62"/></g>` +
    `<g class="x-eh" fill="none" stroke="#1A0E06" stroke-width=".55" stroke-linecap="round"><path d="M-2.6 0 q.8 -1.1 1.6 0 M1 0 q.8 -1.1 1.6 0"/></g>` +
    `<path d="M-.1 .3 q.8 1 -.2 1.4" stroke="rgba(30,14,4,.55)" stroke-width=".4" fill="none"/>` +
    `<path class="x-ms" d="M-1.5 2.5 Q0 3.5 1.5 2.5" stroke="#3A1A0A" stroke-width=".5" fill="none" stroke-linecap="round"/>` +
    `<path class="x-eh" d="M-1.8 2.2 Q0 4.8 1.8 2.2 Z" fill="#5A1A10"/>` +
    `<g class="x-mf" stroke="#3A1A0A" stroke-width=".5" fill="none" stroke-linecap="round"><path d="M-1.5 3.3 Q0 2.3 1.5 3.3"/><path d="M-2.8 -2 l1.7 .6 M2.8 -2 l-1.7 .6"/></g>` +
    (o.beard ? `<path d="M-4 1.6 Q0 7.4 4 1.6 Q2.6 4.2 0 4.2 Q-2.6 4.2 -4 1.6 Z" fill="#2A1A10"/>` : '') + front + (o.top || '');
}
/** an arm from the shoulder (sx, sy): a quadratic to the hand at (hx, hy) through (cx, cy) */
function arm(cls, sx, sy, a, sleeve, sk, kind, hold = '') {
  const [cx, cy, hx, hy] = a, d = `M${sx} ${sy} Q${cx} ${cy} ${hx} ${hy}`;
  let s = '';
  if (kind === 'short') {
    const t = .45, ax = sx + (cx - sx) * t, ay = sy + (cy - sy) * t, bx = cx + (hx - cx) * t, by = cy + (hy - cy) * t;
    const mx = ax + (bx - ax) * t, my = ay + (by - ay) * t;
    s = `<path d="${d}" stroke="rgba(30,14,4,.35)" stroke-width="3.3" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${sk}" stroke-width="2.7" stroke-linecap="round" fill="none"/>` +
      `<path d="M${sx} ${sy} Q${n(ax)} ${n(ay)} ${n(mx)} ${n(my)}" stroke="${sleeve}" stroke-width="3.8" stroke-linecap="round" fill="none"/>`;
  } else {
    const w = kind === 'wide' ? 4.6 : 3.5;
    s = `<path d="${d}" stroke="rgba(30,14,4,.3)" stroke-width="${w + .7}" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${sleeve}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  }
  return `<g class="${cls}" style="transform-origin:${sx}px ${sy}px">${s}<circle cx="${hx}" cy="${hy}" r="1.45" fill="${sk}"/>${hold}</g>`;
}
const GEO = { stand: [-52, -44.5, 7], sit: [-33.5, -26.5, 6.5], kneel: [-37.5, -30.5, 6.5] };
const side = (d) => `<path d="${d}" fill="${url('side')}"/>`;
function body(o, sk) {
  const t = o.trim || '#FFD54A', feet = (y = 0) => `<path d="M-4.4 ${y - 1.5} h3 l.3 1.5 h-3.6 Z M1.1 ${y - 1.5} h3 l.6 1.5 h-3.6 Z" fill="#3A2214"/>`;
  if (o.pose === 'sit') {
    const sil = 'M-6.5 -27 Q0 -29.4 6.5 -27 L8.2 -11 Q15.6 -8 15 0 Q0 1.6 -15 0 Q-15.6 -8 -8.2 -11 Z';
    return `<ellipse cx="-13" cy="-1" rx="2.4" ry="1.2" fill="${sk}"/><ellipse cx="13" cy="-1" rx="2.4" ry="1.2" fill="${sk}"/>` +
      `<path d="M-15 0 Q-16 -7.6 -9 -11.4 L9 -11.4 Q16 -7.6 15 0 Q0 1.6 -15 0 Z" fill="${o.wrap}"/>` +
      `<path d="M-14.6 -4.4 Q0 -2.6 14.6 -4.4" stroke="${o.wrap2}" stroke-width="1.1" fill="none"/><g fill="${o.wrap2}">${[-10, -5, 0, 5, 10].map((x) => `<path d="M${x} -8.2 l1.1 1.1 l-1.1 1.1 l-1.1 -1.1 Z"/>`).join('')}</g>` +
      `<path d="M-4 -10.4 Q-2 -5 -5.6 .4 M6 -10 Q9 -5 8 .6" stroke="rgba(0,0,0,.18)" stroke-width=".5" fill="none"/>` +
      `<path d="M-6.5 -27 Q0 -29.4 6.5 -27 L8.2 -10.6 Q0 -9.4 -8.2 -10.6 Z" fill="${o.robe}"/><path d="M-2.6 -27.8 Q0 -24.6 2.6 -27.8" stroke="${t}" stroke-width=".7" fill="none"/>` +
      `<path d="M-3 -22 Q-4 -16 -5 -11 M3.4 -21 Q4.6 -16 5.4 -11" stroke="rgba(0,0,0,.14)" stroke-width=".5" fill="none"/>` + side(sil);
  }
  if (o.pose === 'kneel') return `<path d="M-10.4 0 Q-11.4 -9 -7.4 -14.6 L7.4 -14.6 Q11.4 -9 10.4 0 Q0 1.2 -10.4 0 Z" fill="${o.pants}"/>` +
    `<path d="M-6.5 -31 Q0 -33.4 6.5 -31 L8 -12.6 Q0 -11 -8 -12.6 Z" fill="${o.robe}"/><path d="M-2.6 -31.8 Q0 -28.6 2.6 -31.8" stroke="${t}" stroke-width=".7" fill="none"/>` +
    side('M-6.5 -31 Q0 -33.4 6.5 -31 L8 -12.6 L11 0 Q0 1.2 -10.4 0 L-8 -12.6 Z');
  if (o.kind === 'woman') {
    const sil = 'M-7 -45 Q0 -47.6 7 -45 L8.6 -28.6 L9 -28.6 L10.2 -1.4 Q0 .4 -10.2 -1.4 L-9 -28.6 L-8.6 -28.6 Z';
    return feet() + `<path d="M-7 -45 Q0 -47.6 7 -45 L8.6 -26.5 L-8.6 -26.5 Z" fill="${o.robe}"/><path d="M-2.6 -45.6 Q0 -42.2 2.6 -45.6" stroke="${t}" stroke-width=".7" fill="none"/>` +
      `<path d="M-9 -28.6 L9 -28.6 L10.2 -1.4 Q0 .4 -10.2 -1.4 Z" fill="${o.wrap}"/><path d="M-9 -28.6 L9 -28.6 L9.15 -25.6 L-9.15 -25.6 Z" fill="${o.wrap2}"/>` +
      `<path d="M-9.7 -15 H9.7 M-10 -6 H10" stroke="${o.wrap2}" stroke-width=".9"/><g fill="${o.wrap2}">${[-7, -3.5, 0, 3.5, 7].map((x) => `<path d="M${x} -12.2 l1.2 1.2 l-1.2 1.2 l-1.2 -1.2 Z"/>`).join('')}</g>` +
      `<path d="M3.6 -25 Q2.6 -12 4.8 -1.2 M-6 -40 Q-5 -34 -6.6 -28" stroke="rgba(0,0,0,.17)" stroke-width=".55" fill="none"/>` + side(sil);
  }
  if (o.kind === 'child') return feet() + `<path d="M-4.2 -9.6 h2.6 v8.4 h-2.6 Z M1.6 -9.6 h2.6 v8.4 h-2.6 Z" fill="${sk}"/>` +
    `<path d="M-5.6 -21 L5.6 -21 L5 -9 L1 -9 L0 -15 L-1 -9 L-5 -9 Z" fill="${o.pants || '#E8E0CC'}"/>` +
    `<path d="M-6.4 -45 Q0 -47.4 6.4 -45 L8.4 -17 Q0 -15.4 -8.4 -17 Z" fill="${o.robe}"/><path d="M-2.4 -45.4 L0 -40 L2.4 -45.4" stroke="${t}" stroke-width=".7" fill="none"/>` +
    side('M-6.4 -45 Q0 -47.4 6.4 -45 L8.4 -17 Q0 -15.4 -8.4 -17 Z');
  if (o.kind === 'work') return feet() + `<path d="M-4.4 -8.4 h2.8 v7 h-2.8 Z M1.6 -8.4 h2.8 v7 h-2.8 Z" fill="${o.legs || sk}"/>` +
    `<path d="M-6.8 -23 L6.8 -23 L5.6 -7.6 L1.4 -7.6 L0 -16 L-1.4 -7.6 L-5.6 -7.6 Z" fill="${o.pants}"/><path d="M-5.8 -8.6 h4.4 M1.4 -8.6 h4.4" stroke="rgba(0,0,0,.2)" stroke-width=".8"/>` +
    `<path d="M-7 -45 Q0 -47.6 7 -45 L8.6 -20.4 Q0 -18.8 -8.6 -20.4 Z" fill="${o.robe}"/><path d="M-2.6 -45.6 Q0 -42 2.6 -45.6" stroke="${t}" stroke-width=".7" fill="none"/>` +
    `<path d="M-3 -38 Q-4.6 -30 -5.6 -21 M3 -38 Q4.6 -30 5.6 -21" stroke="rgba(0,0,0,.15)" stroke-width=".55" fill="none"/>` + (o.mud ? `<g fill="#7A4E30" opacity=".75"><circle cx="-3" cy="-27" r=".9"/><circle cx="4" cy="-33" r=".7"/><circle cx="2" cy="-24" r="1"/></g>` : '') +
    side('M-7 -45 Q0 -47.6 7 -45 L8.6 -20.4 L6.8 -20 L5.6 -1 L-5.6 -1 L-6.8 -20 L-8.6 -20.4 Z');
  // a man in a long riga
  return feet() + `<path d="M-4.6 -4.4 h3.4 v3 h-3.4 Z M1.2 -4.4 h3.4 v3 h-3.4 Z" fill="${o.pants || '#E8E0CC'}"/>` +
    `<path d="M-7 -45 Q0 -47.6 7 -45 L12.6 -3.6 Q0 -1.4 -12.6 -3.6 Z" fill="${o.robe}"/><path d="M-3.4 -45.4 L0 -37 L3.4 -45.4" stroke="${t}" stroke-width=".8" fill="none"/>` +
    `<path d="M-6 -36 h4 v5 q-2 1.2 -4 0 Z" stroke="${t}" stroke-width=".55" fill="none"/>` +
    `<path d="M-3 -36 Q-6 -20 -9 -4 M3 -36 Q6 -20 9 -4" stroke="rgba(0,0,0,.15)" stroke-width=".55" fill="none"/>` + side('M-7 -45 Q0 -47.6 7 -45 L12.6 -3.6 Q0 -1.4 -12.6 -3.6 Z');
}
/** one figure, feet (or seat) at the local origin */
function person(o) {
  const sk = SK[o.skin % SK.length], pose = o.pose || 'stand', [hy, sy, sx] = GEO[pose], hs = o.hs || .9;
  const sleeve = o.sleeveC || o.robe, sl = o.sleeve || 'long';
  return `<g class="x-p ${o.cls || ''}">${pose === 'stand' ? shadow(8, 2) : shadow(12, 1)}` +
    `<g class="x-bd">${o.back || ''}${body(o, sk)}` +
    `<rect x="-1.8" y="${hy + 3}" width="3.6" height="${n(sy - hy - 2.6)}" fill="${sk}"/>` +
    `<g class="x-hd" style="transform-origin:0px ${sy}px"><g transform="translate(0 ${hy}) scale(${hs})">${head(sk, o)}</g></g>` +
    (o.front || '') + arm('x-al', -sx, sy, o.al, sleeve, sk, sl, o.hl) + arm('x-ar', sx, sy, o.ar, sleeve, sk, sl, o.hr) +
    (o.up ? `<g class="x-up">${arm('x-ul', -sx, sy, [-sx - 6, sy - 8, -sx - 7, hy - 12], sleeve, sk, sl)}${arm('x-ur', sx, sy, [sx + 6, sy - 8, sx + 7, hy - 12], sleeve, sk, sl)}</g>` : '') +
    (o.hh ? `<g class="x-hh">${arm('x-hl', -sx, sy, [-sx - 8, sy - 8, -3.6, hy - 4.6], sleeve, sk, sl)}${arm('x-hr', sx, sy, [sx + 8, sy - 8, 3.6, hy - 4.6], sleeve, sk, sl)}</g>` : '') + `</g></g>`;
}

/* ---------------- things ---------------- */
function pot(type, fill, deco = '#F3D9B0') {
  if (type === 'tulu') return `<path d="M-4 -.6 Q-6.6 -3.6 -6.4 -8 Q-6 -12 -2.4 -13.2 L-2.2 -14.6 Q-3.2 -15.2 -3.2 -16 H3.2 Q3.2 -15.2 2.2 -14.6 L2.4 -13.2 Q6 -12 6.4 -8 Q6.6 -3.6 4 -.6 Q0 .4 -4 -.6 Z" fill="${fill}"/>` +
    `<ellipse cy="-16" rx="3.2" ry=".7" fill="#4A2412"/><path d="M-5.2 -10.8 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l.6 .6" stroke="${deco}" stroke-width=".45" fill="none" opacity=".8"/>` +
    `<ellipse cx="-2.8" cy="-7.4" rx="1.1" ry="3" fill="#fff" opacity=".16"/>`;
  return `<path d="M-3.4 -.2 Q-7.2 -1.6 -7 -5.4 Q-6.8 -8.6 -4.2 -9.4 L-4.6 -10.4 H4.6 L4.2 -9.4 Q6.8 -8.6 7 -5.4 Q7.2 -1.6 3.4 -.2 Q0 .4 -3.4 -.2 Z" fill="${fill}"/>` +
    `<ellipse cy="-10.4" rx="4.6" ry="1" fill="#4A2412"/><path d="M-6.4 -7 Q0 -5.6 6.4 -7" stroke="${deco}" stroke-width=".5" fill="none" opacity=".7"/>` +
    `<ellipse cx="-3.6" cy="-4.6" rx="1.2" ry="2.2" fill="#fff" opacity=".15"/>`;
}
const zanko = (x0, x1, y, step, h = 4) => { let s = ''; for (let x = x0; x <= x1; x += step) s += `<path d="M${n(x - 1.6)} ${y} Q${n(x - .6)} ${y - h * .5} ${n(x - .2)} ${n(y - h)} Q${n(x + .6)} ${y - h * .5} ${n(x + 1.6)} ${y} Z"/>`; return s; };
const relief = (x, y) => `<g fill="none" stroke="#FCEBD0" stroke-width=".55" opacity=".75"><path d="M${x - 5} ${y} q5 -5 10 0 q-5 5 -10 0 Z"/><circle cx="${x}" cy="${y}" r="1.2"/><path d="M${x - 7} ${y + 5} l3.5 -2 l3.5 2 l3.5 -2 l3.5 2"/></g>`;
const cloud = (x, y, s, d) => at(x, y, s, `<g fill="#fff" opacity=".85"><ellipse rx="13" ry="3.2"/><ellipse cx="7" cy="-2" rx="7.4" ry="3.8"/><ellipse cx="-5" cy="-1.4" rx="5.4" ry="3"/><ellipse cx="1" cy="-3.4" rx="4" ry="3"/></g>`, 'x-cl ' + d);
function hut(x, y, s) {
  let lines = ''; for (let k = -12; k <= 12; k += 3) lines += `<path d="M0 -31 Q${n(k * .6)} -20 ${k * 1.2} -10.6"/>`;
  return at(x, y, s, `<path d="M-12 0 V-12 Q0 -14 12 -12 V0 Q0 2 -12 0 Z" fill="${url('wall')}"/><path d="M4 -12.8 Q9 -12.6 12 -12 V0 Q8 1.4 4 1.4 Z" fill="rgba(80,30,10,.2)"/>` +
    `<path d="M-2.6 .4 V-6.6 Q0 -9.6 2.6 -6.6 V.6 Z" fill="#3A1E0C"/>` +
    `<path d="M-15.6 -10.6 Q-8 -20 0 -31 Q8 -20 15.6 -10.6 Q0 -8.4 -15.6 -10.6 Z" fill="${url('thatch')}"/><g stroke="#9C7A3A" stroke-width=".35" fill="none" opacity=".7">${lines}</g>` +
    `<path d="M-15.6 -10.6 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l.4 -1" stroke="#B48C44" stroke-width=".5" fill="none"/>` +
    `<path d="M0 -31 V-35" stroke="#6B4422" stroke-width=".8"/><circle cy="-35.4" r=".8" fill="#6B4422"/>`);
}
function chicken(x, y, s, c, flip, d) {
  return at(x, y, s, shadow(3.4, 1) + `<path d="M-.6 -2.4 L-1 0 M1 -2.4 L1.2 0" stroke="#D9A23A" stroke-width=".45"/>` +
    `<g class="x-pk ${d}"><path d="M-3.6 -5.4 Q-5.6 -9 -3.8 -9.4 Q-2.6 -7 -2 -5.4 Z" fill="${c[1]}"/><ellipse cx="-.4" cy="-4.2" rx="3.6" ry="2.5" fill="${c[0]}"/>` +
    `<path d="M-2.6 -4.6 Q-.6 -2.6 1.6 -4.4" stroke="${c[1]}" stroke-width=".5" fill="none"/><circle cx="2.8" cy="-6.6" r="1.35" fill="${c[0]}"/>` +
    `<path d="M2 -7.8 q.4 -1.2 .9 -.3 q.4 -1 .9 .1 q.3 .4 -.2 .8 Z" fill="#D32F2F"/><path d="M4 -6.8 l1.3 .4 l-1.3 .4 Z" fill="#E8A23A"/><path d="M3.4 -5.6 q.3 .9 -.2 1.2" stroke="#D32F2F" stroke-width=".55" fill="none"/>` +
    `<circle cx="3.1" cy="-6.9" r=".26" fill="#1A0E06"/></g>`, '', flip);
}
function donkey() {
  // side on, facing right, two woven panniers of wet clay across its back
  return shadow(15, 1.2) +
    `<g fill="#6E6964"><rect x="-12" y="-12" width="2.4" height="11.4" rx="1"/><rect x="9" y="-12" width="2.4" height="11.4" rx="1"/></g>` +
    `<g class="x-tail" style="transform-origin:-13px -17px"><path d="M-13 -17 Q-16 -12 -15 -5" stroke="#6E6964" stroke-width="1" fill="none"/><path d="M-15.6 -6.4 q-.4 2.6 .6 3.4 q.8 -1.4 .4 -3.4 Z" fill="#2E2A26"/></g>` +
    `<ellipse cx="0" cy="-15" rx="13.4" ry="6.6" fill="${url('donk')}"/><ellipse cx="0" cy="-10.6" rx="10" ry="2.4" fill="#D2CAC0" opacity=".6"/>` +
    `<g fill="#8E8A86"><rect x="-8" y="-12" width="2.6" height="11.4" rx="1"/><rect x="5.6" y="-12" width="2.6" height="11.4" rx="1"/></g>` +
    `<g fill="#2E2A26"><rect x="-12" y="-1.4" width="2.4" height="1.4"/><rect x="9" y="-1.4" width="2.4" height="1.4"/><rect x="-8" y="-1.4" width="2.6" height="1.4"/><rect x="5.6" y="-1.4" width="2.6" height="1.4"/></g>` +
    `<path d="M8 -18 Q11 -26 16 -28 L20 -23.6 Q15 -21 12.6 -12.6 Z" fill="#8A8580"/><path d="M9 -19 Q12 -26 16.4 -28" stroke="#2E2A26" stroke-width="1.3" fill="none"/>` +
    `<g class="x-ear" style="transform-origin:17px -28px"><path d="M15.6 -28 L14.4 -35.6 L17.2 -28.4 Z M17.4 -28.4 L18.8 -36 L19 -28 Z" fill="#7A7570"/><path d="M15.2 -29 L14.8 -33.6 M18.2 -29 L18.6 -33.6" stroke="#2E2A26" stroke-width=".4"/></g>` +
    `<path d="M15 -28.4 Q19.4 -30.4 23.2 -24 Q25.2 -20 22 -19 Q19 -19 16 -22 Z" fill="#8E8A86"/><ellipse cx="22.6" cy="-20.6" rx="2.1" ry="1.6" fill="#D8D0C4"/>` +
    `<circle cx="18.6" cy="-25.4" r=".55" fill="#1A1410"/><circle cx="23.4" cy="-20.8" r=".3" fill="#3A3430"/>` +
    // the saddle cloth, the near pannier, lumps of clay
    `<path d="M-7 -21 Q0 -23 7 -21 L7.6 -14 Q0 -12.6 -7.6 -14 Z" fill="#B23A2A"/><path d="M-7.4 -15.4 Q0 -14 7.4 -15.4" stroke="#F2C14E" stroke-width=".6" fill="none"/>` +
    `<g fill="#7E6450"><ellipse cx="-4" cy="-22.6" rx="2.8" ry="2"/><ellipse cx="0" cy="-23.6" rx="3" ry="2.2"/><ellipse cx="4" cy="-22.6" rx="2.6" ry="1.9"/></g>` +
    `<path d="M-6.4 -21.6 L6.4 -21.6 L7.2 -10.6 Q0 -8.8 -7.2 -10.6 Z" fill="#C9A35E"/>` +
    `<g stroke="#9C7A3A" stroke-width=".4" fill="none"><path d="M-6.6 -18 Q0 -16.6 6.6 -18 M-6.9 -14.4 Q0 -13 6.9 -14.4"/><path d="M-4 -21.4 L-4.4 -9.8 M0 -21.6 V-9.2 M4 -21.4 L4.4 -9.8"/></g>` +
    `<path d="M-6.4 -21.6 L6.4 -21.6 L7.2 -10.6 Q0 -8.8 -7.2 -10.6 Z" fill="${url('side')}"/>`;
}
function baobab() {
  return `<path d="M-11 0 Q-8 -22 -7.4 -38 Q-13 -46 -21 -52 L-18.6 -54.6 Q-10 -49 -5 -45 Q-5 -54 -9 -63 L-5.6 -64 Q-1 -54 0 -46 Q6 -55 15 -60 L17 -57 Q9 -50 6.4 -40 Q7.4 -20 11 0 Z" fill="${url('bark')}"/>` +
    `<path d="M-3 -6 Q-2 -22 -3 -36 M4 -4 Q3 -18 4 -32" stroke="rgba(60,40,24,.35)" stroke-width=".7" fill="none"/>` +
    `<g fill="#6F8A3C"><ellipse cx="-20" cy="-57" rx="9" ry="5"/><ellipse cx="-7" cy="-67" rx="8" ry="4.6"/><ellipse cx="16" cy="-62" rx="10" ry="5.4"/><ellipse cx="4" cy="-66" rx="6" ry="3.6"/></g>` +
    `<g fill="#86A24A"><ellipse cx="-22" cy="-59" rx="5" ry="2.4"/><ellipse cx="-6" cy="-69" rx="4.6" ry="2.2"/><ellipse cx="14" cy="-64.6" rx="6" ry="2.4"/></g>` +
    `<g stroke="#7A6248" stroke-width=".3"><path d="M-15 -53 v4 M11 -58 v5 M-3 -63 v3.6"/></g><g fill="#B9A27A"><ellipse cx="-15" cy="-48" rx=".9" ry="1.6"/><ellipse cx="11" cy="-52" rx=".9" ry="1.7"/><ellipse cx="-3" cy="-59" rx=".8" ry="1.5"/></g>`;
}
/* ---------------- the building site ---------------- */
const brick = (x, y, c = '#B5683A') => `<path d="M${x} ${y + 2.4} h6 l2.6 -.6 l-1.4 -1.4 Z" fill="rgba(60,28,8,.3)"/><path d="M${x} ${y} h6 l1.2 -1.4 h-6 Z" fill="#D49A68"/><path d="M${x} ${y} h6 v2.4 h-6 Z" fill="${c}"/><path d="M${x + 6} ${y} l1.2 -1.4 v2.4 l-1.2 1.4 Z" fill="#8A4A26"/>`;
function neem() {
  const L = [[-22, -50, 13, 9], [0, -60, 16, 10], [22, -50, 13, 9], [-12, -38, 14, 8], [12, -38, 15, 8], [-30, -36, 9, 6], [30, -38, 10, 6], [0, -44, 12, 9]];
  return shadow(14, 2.2) + `<path d="M-3.4 0 Q-2 -16 -3 -30 L-9 -40 L-7.6 -41 L-1 -33 L0 -44 L2 -44 L2 -33 L9 -42 L10.4 -41 L3.4 -30 Q2.6 -16 4 0 Z" fill="${url('bark')}"/>` +
    `<g fill="#3E6B2E">${L.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>` +
    `<g fill="#5A8A3A">${L.map(([x, y, rx, ry]) => `<ellipse cx="${x - 2}" cy="${y - 2.4}" rx="${n(rx * .7)}" ry="${n(ry * .6)}"/>`).join('')}</g>` +
    `<g fill="#79A64C">${L.map(([x, y, rx]) => `<ellipse cx="${n(x - rx * .35)}" cy="${y - 4.6}" rx="${n(rx * .35)}" ry="2"/>`).join('')}</g>`;
}
function well() {
  return shadow(9, 1.2) + `<path d="M-8.4 -8 V0 Q0 2 8.4 0 V-8 Z" fill="${url('wall')}"/><path d="M3 -8.6 Q6 -8.4 8.4 -8 V0 Q6 1.2 3 1.4 Z" fill="rgba(80,30,10,.2)"/>` +
    `<ellipse cy="-8" rx="8.4" ry="2" fill="#A35A2C"/><ellipse cy="-7.8" rx="6.6" ry="1.3" fill="#2A160A"/>` +
    `<path d="M-9 -8 V-22 M9 -8 V-22" stroke="#6B4422" stroke-width="1.2"/><path d="M-10.4 -24 L-9 -21.6 L-7.6 -24 M7.6 -24 L9 -21.6 L10.4 -24" stroke="#6B4422" stroke-width=".9" fill="none"/>` +
    `<path d="M-10 -21.8 H10" stroke="#8A5A30" stroke-width="1.3"/><path d="M1 -21.4 V-11" stroke="#D8C49A" stroke-width=".4"/>` +
    `<path d="M-1.6 -11 h5.2 l-.6 3 h-4 Z" fill="#2A2A2A"/>`;
}
function house() {
  // a red-earth house going up: the right half finished and plastered with zanko and relief, the left half still
  // bare courses of tubali stepping down, a ladder against it
  let courses = '';
  for (let r = 0; r < 9; r++) { const y = 140 - r * 3, x1 = r < 5 ? 290 : 290, x0 = 258 + Math.max(0, r - 5) * 7; for (let x = x0 + (r % 2 ? 3.5 : 0); x < x1; x += 7) courses += `<rect x="${n(Math.max(x, x0))}" y="${y - 3}" width="${n(Math.min(6.4, x1 - Math.max(x, x0) - .4))}" height="2.6" rx=".4"/>`; }
  return `<g transform="translate(290 141)">${shadow(32, 1)}</g>` +
    `<path d="M258 141 V126 H265 V122 H272 V119 H279 V116 H290 V98 H322 V141 Z" fill="#8E4A24"/>` +
    `<g fill="#B8673A">${courses}</g>` +
    `<path d="M290 141 V98 H322 V141 Z" fill="${url('wall')}"/><path d="M290 98 H322 V100.6 H290 Z" fill="#A85E2E" opacity=".6"/>` +
    `<g fill="#C27840">${zanko(292.4, 322, 98, 8.6, 6)}</g>` + relief(306, 110) +
    `<path d="M300 141 V126 Q305 120 310 126 V141 Z" fill="#3A1E0C"/><path d="M298 141 V125 Q305 117 312 125 V141" fill="none" stroke="#FCEBD0" stroke-width=".7" opacity=".7"/>` +
    `<g fill="#7A4628" opacity=".8"><ellipse cx="283" cy="115.4" rx="5" ry="1.2"/><ellipse cx="268.6" cy="118.6" rx="2.4" ry=".8"/></g>` +
    // the ladder
    `<g stroke="#7A5230" stroke-width="1" stroke-linecap="round"><path d="M262 142 L270.4 112 M268 142 L276.4 112"/>` +
    `<path d="M263 138.4 h6 M264 134.6 h6 M265.1 130.8 h6 M266.1 127 h6 M267.2 123.2 h6 M268.3 119.4 h6 M269.3 115.6 h6" stroke-width=".7"/></g>`;
}
function mudPit() {
  return `<ellipse cx="0" cy="0" rx="32" ry="7.6" fill="#B07A4A"/><ellipse cx="0" cy=".6" rx="29.4" ry="6.4" fill="${url('mud')}"/>` +
    `<g stroke="#E2C072" stroke-width=".4" opacity=".8"><path d="M-22 -1 l2 -.6 M-14 3 l2.2 .4 M-6 -3 l1.6 -.8 M8 2 l2 -.6 M16 -2 l2 .5 M22 2.4 l1.6 -.6 M-2 4 l1.8 .3"/></g>`;
}
const mudFront = `<path d="M-29.4 .4 Q-20 -4.6 -10 -3.4 Q0 -2.4 10 -3.6 Q20 -4.6 29.4 .4 Q26 6.4 0 7 Q-26 6.4 -29.4 .4 Z" fill="${url('mud')}"/><path d="M-29.4 .4 Q-20 -4.6 -10 -3.4 Q0 -2.4 10 -3.6 Q20 -4.6 29.4 .4" stroke="#5A3418" stroke-width=".5" fill="none" opacity=".5"/>` +
  `<g fill="#9A6440"><circle cx="-21" cy="-1.6" r=".8"/><circle cx="-17" cy="-2.8" r=".5"/><circle cx="7" cy="-2.6" r=".7"/><circle cx="11" cy="-3.4" r=".5"/></g>`;

export function buloScene(): string {
  const treaderA = person({ kind: 'work', skin: 1, robe: '#E8DCC0', trim: '#1565C0', pants: '#5A6E7A', legs: '#6E4428', hat: 'zanna', hatc: '#7A1F2B', hatc2: '#F4EBD0', mud: 1,
    cls: 'cheerup ta', up: 1, hh: 1, sleeve: 'short', al: [-12, -36, -11, -26], ar: [12, -36, 11, -26] });
  const treaderB = person({ kind: 'work', skin: 3, robe: '#3F7A5A', trim: '#F2C14E', pants: '#8A6A4A', legs: '#6E4428', hat: 'hair', mud: 1,
    cls: 'cheerup tb', up: 1, sleeve: 'short', al: [-12, -36, -10.4, -25.4], ar: [13, -38, 12.6, -28] });
  const pan = `<ellipse cy="-5.4" rx="3" ry=".9" fill="#E8DCC0"/><path d="M-7 -6 Q-6 -8.6 0 -8.8 Q6 -8.6 7 -6 Z" fill="#9AA0A6"/><path d="M-7 -6 H7" stroke="#6E7378" stroke-width=".6"/>` +
    `<path d="M-5.4 -8.6 Q-4 -13 0 -13.4 Q4 -13 5.4 -8.6 Z" fill="#7A4E30"/><ellipse cx="-1.6" cy="-11" rx="1.6" ry=".7" fill="#fff" opacity=".18"/>`;
  const carrier = person({ kind: 'work', skin: 0, robe: '#C9772E', trim: '#F4EBD0', pants: '#4E5A6A', hat: 'hair', top: pan, cls: 'cy', sleeve: 'short',
    al: [-12, -54, -6.6, -60.4], ar: [12, -54, 6.6, -60.4] });
  const topman = person({ kind: 'work', skin: 2, robe: '#F4EBD0', trim: '#2E7D32', pants: '#6A5A8A', hat: 'hula', hatc: '#2E7D32', hatc2: '#FFD54A',
    cls: 'cheerup tm', up: 1, sleeve: 'short', al: [-12, -36, -12, -28], ar: [14, -40, 14, -52] });
  const moulder = person({ pose: 'kneel', kind: 'work', skin: 4, robe: '#2F6B9A', trim: '#FFE08A', pants: '#7A6A52', hat: 'borno', hatc: '#F2E8CF', hatc2: '#B23A2A', hatc3: '#1E5B3A', beard: 1,
    cls: 'cheerup mo', up: 1, sleeve: 'short',
    front: `<path d="M-11 -2 h22 v4 h-22 Z" fill="#8A5A30"/><path d="M-10 -2 h9.4 v3.2 h-9.4 Z M1 -2 h9 v3.2 h-9 Z" fill="#7A4E30"/><path d="M-11 -2 h22" stroke="#C9965A" stroke-width=".6"/><path d="M-12 -.4 h-3 M12 -.4 h3" stroke="#8A5A30" stroke-width="1.2" stroke-linecap="round"/>`,
    al: [-12, -18, -6, -3], ar: [12, -18, 6, -3] });
  const drawer = person({ kind: 'woman', skin: 2, robe: '#F2C14E', trim: '#B23A2A', wrap: '#7B3F8C', wrap2: '#F2C14E', hat: 'kallabi', hatc: '#C2185B', hatc2: '#FFE08A',
    cls: 'cheerup dw', up: 1, sleeve: 'short', al: [-14, -50, -16, -56], ar: [-2, -36, -15, -44] });

  let bricks = '';
  for (let r = 0; r < 3; r++) for (let k = 0; k < 10; k++) bricks += brick(194 + k * 8 + r * 2.4, 168 + r * 4.4, (k + r) % 3 ? '#B5683A' : '#A85E34');
  let stack = '';
  for (let r = 0; r < 5; r++) for (let k = 0; k < 4 - (r > 2 ? 1 : 0); k++) stack += brick(300 + k * 3.6 + (r % 2) * 1.8 + (r > 2 ? 1.8 : 0), 150 - r * 2.6);

  const sky = `<rect width="320" height="200" fill="${url('sky')}"/><circle cx="50" cy="40" r="26" fill="${url('sun')}"/><circle cx="50" cy="40" r="8" fill="#FFF4CC"/>` +
    cloud(116, 32, 1.1, 'd0') + cloud(170, 28, .8, 'd1');
  const land = `<path d="M0 112 Q40 92 84 104 Q120 88 170 102 Q214 90 250 100 Q290 90 320 98 V130 H0 Z" fill="#B9B48C" opacity=".8"/>` +
    `<path d="M120 106 Q150 96 176 106 Z" fill="#A9A47C" opacity=".8"/>` +
    `<path d="M0 124 Q60 114 130 120 Q200 112 320 118 V140 H0 Z" fill="#C8B67E"/>` +
    `<g fill="#7E8E4A" opacity=".8"><ellipse cx="96" cy="114" rx="7" ry="2.4"/><ellipse cx="146" cy="113" rx="5" ry="2"/><rect x="95.4" y="114" width="1" height="5"/><rect x="145.6" y="113" width=".8" height="4"/></g>` +
    `<path d="M0 126 Q80 118 160 124 T320 122 V200 H0 Z" fill="${url('ground')}"/>` +
    `<ellipse cx="96" cy="170" rx="96" ry="26" fill="${url('trod')}"/>` +
    `<g fill="#B9884C" opacity=".45"><ellipse cx="170" cy="196" rx="24" ry="1.6"/><ellipse cx="60" cy="140" rx="20" ry="1.2"/></g>` +
    grain(0, 320, 128, 200, 150, 'rgba(150,96,46,.3)', .45, 3) + grain(0, 320, 128, 200, 60, 'rgba(255,236,200,.35)', .4, 17) +
    `<g fill="none" stroke="rgba(160,104,52,.25)" stroke-width=".5"><path d="M0 150 Q80 144 150 152 T320 147"/><path d="M0 172 Q90 166 170 176 T320 170"/></g>` +
    `<g stroke="#8B7A3A" stroke-width=".6" fill="none" opacity=".8"><path d="M4 196 q-1 -6 1 -10 M7 196 q1 -7 -1 -11 M312 196 q1 -6 -1 -10 M315 196 q-1 -7 1 -11"/></g>`;
  const pots = at(46, 134, .55, pot('tulu', url('pot'))) + at(54, 135, .5, pot('tukunya', url('blk'), '#C9A27A')) +
    at(193, 134, .45, pot('tulu', url('pot'))) + at(199, 135, .4, pot('tulu', url('pot')));

  const defs = '<defs>' +
    lin('sky', ['#7FC4EA', '#C4E4EE', '#F4E6C6']) + lin('ground', ['#D9B07A', '#CFA068', '#C09058']) + lin('wall', ['#D08A4E', '#B4692F']) +
    lin('thatch', ['#D8B46A', '#B08A44']) + lin('bark', ['#8A6A4C', '#6E5238', '#54402C'], true) + lin('donk', ['#9A9590', '#76716C']) +
    lin('mud', ['#9A6440', '#7A4C2E']) +
    rad('trod', [[0, '#EED0A0', .6], [.7, '#E8C994', .3], [1, '#E8C994', 0]]) +
    rad('sun', [[0, '#FFF6D0', .9], [.4, '#FFE7A0', .5], [1, '#FFE7A0', 0]]) + rad('shade', [[.45, '#000', 0], [1, '#000', .3]], .38, .3, .8) +
    rad('pot', [[0, '#E9A56C'], [.55, '#C0683A'], [1, '#7E3A1A']], .36, .35, .75) + rad('blk', [[0, '#6E5848'], [.6, '#3E2E24'], [1, '#22180F']], .36, .35, .75) +
    `<linearGradient id="${P}-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>` +
    `<linearGradient id="${P}-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF2F4" stop-opacity="0"/><stop offset="1" stop-color="#F1E6CC" stop-opacity=".3"/></linearGradient>` +
    '</defs>';

  return `<svg class="scene ${P}" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` + defs + sky + land +
    hut(180, 124, .8) + hut(198, 126, .66) + `<rect y="60" width="320" height="70" fill="${url('haze')}"/>` + house() + at(24, 132, 1.3, neem()) + pots +
    at(210, 135, 1, well()) + at(222, 140, .5, drawer) + at(287, 117, .46, topman) + at(268.6, 128.6, .5, carrier) +
    at(122, 141, .55, donkey(), '', false) + stack +
    `<g transform="translate(228 153)">${mudPit()}${at(-11, 3.4, .62, treaderA)}${at(12, 2.8, .6, treaderB)}<g transform="translate(0 2.2)">${mudFront}</g></g>` +
    bricks + brick(300, 164, '#8A5634') + brick(303, 168, '#8A5634') + at(287, 158, .66, moulder) +
    chicken(309, 192, 1.3, ['#F2EDE4', '#3A3A3A'], true, 'd0') +
    '</svg>';
}

/* ---------------- the game's own house (Sani 2026-10-26) ----------------
 * "Why are we not creating the house with the realism of the houses in the bg": the same red-earth Hausa house as the
 * one going up on the right of the scene, drawn big, built tubali by tubali. 12 brick slots (.hb, bottom course first,
 * left to right): two courses either side of the doorway, then the course over it. A slot not yet built is a faint
 * outline (.hb.ghost); a right letter drops its brick in (.drop: a thud and a dust puff), a wrong one knocks the top
 * brick off (.fall). When .site gets .done the wall is plastered: smooth red earth, zanko horns on the parapet, the
 * relief over the door, the roof beams and a pot by the door. Styles in sc-bulo.css (.glab .scr.mud2 .bhouse …). */
export function buloHouse(): string {
  const Q = 'bl4h', u = (id) => `url(#${Q}-${id})`;
  const G = 156, R = [[130, [[24, 53], [53, 82], [118, 147], [147, 176]]], [104, [[24, 46], [46, 82], [118, 154], [154, 176]]],
    [78, [[24, 62], [62, 100], [100, 138], [138, 176]]]];
  let slots = '', k = 0;
  R.forEach(([y0, xs]) => xs.forEach(([a, b]) => {
    const x = a + .7, w = b - a - 1.4, y = y0 + .7, hh = 24.6, cx = n(x + w / 2), s = (k * 37) % 11;
    // straw flecks and a thumb print or two in the mud, different on every brick
    let fl = '';
    for (let j = 0; j < 4; j++) { const fx = n(x + 4 + ((s + j * 7) % 10) / 10 * (w - 8)), fy = n(y + 6 + ((s * 3 + j * 5) % 7) / 7 * (hh - 11)); fl += `M${fx} ${fy} l${j % 2 ? 2.6 : -2.2} ${j % 3 ? .9 : -.7}`; }
    slots += `<g class="hb ghost"><rect class="gh" x="${n(x + .6)}" y="${n(y + .6)}" width="${n(w - 1.2)}" height="${hh - 1.2}" rx="4.4"/>` +
      `<g class="hbb"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${hh}" rx="5" fill="${u('brk')}"/>` +
      `<path d="M${n(x + 4)} ${n(y + 1.6)} H${n(x + w - 4)}" stroke="#E6A872" stroke-width="2" stroke-linecap="round" opacity=".55"/>` +
      `<path d="M${n(x + 3)} ${n(y + hh - 1.2)} H${n(x + w - 3)}" stroke="#6E3A1C" stroke-width="2.2" stroke-linecap="round" opacity=".45"/>` +
      `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${hh}" rx="5" fill="${u('side')}"/>` +
      `<path d="${fl}" stroke="#E2C072" stroke-width=".7" stroke-linecap="round" opacity=".75"/>` +
      `<ellipse cx="${n(x + w * (.25 + (s % 4) * .15))}" cy="${n(y + hh * .62)}" rx="2.2" ry="1.5" fill="#8A4A26" opacity=".35"/>` +
      `<text x="${cx}" y="${n(y + 18)}" text-anchor="middle"></text></g>` +
      `<g class="puff"><ellipse cx="${n(x + 3)}" cy="${y0 + 24}" rx="6" ry="3.2"/><ellipse cx="${n(x + w - 3)}" cy="${y0 + 24}" rx="6.4" ry="3.4"/><ellipse cx="${cx}" cy="${y0 + 25.4}" rx="${n(w * .4)}" ry="2.6"/></g></g>`;
    k++;
  }));
  const wall = `M22 ${G} V74 H178 V${G} Z M82 ${G} V118 Q100 100 118 118 V${G} Z`;
  let horns = ''; for (let x = 30; x <= 170; x += 14) horns += `<path d="M${x - 3.4} 70 Q${x - 1.2} 64 ${x} 60 Q${x + 1.2} 64 ${x + 3.4} 70 Z"/>`;
  const defs = `<defs>` +
    `<linearGradient id="${Q}-brk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8784A"/><stop offset=".55" stop-color="#B5683A"/><stop offset="1" stop-color="#97522C"/></linearGradient>` +
    `<linearGradient id="${Q}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D08A4E"/><stop offset="1" stop-color="#B4692F"/></linearGradient>` +
    `<linearGradient id="${Q}-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>` +
    `<linearGradient id="${Q}-lit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".78" stop-color="#3A1A08" stop-opacity="0"/><stop offset="1" stop-color="#3A1A08" stop-opacity=".28"/></linearGradient>` +
    `<radialGradient id="${Q}-pot" cx=".36" cy=".35" r=".75"><stop offset="0" stop-color="#E9A56C"/><stop offset=".55" stop-color="#C0683A"/><stop offset="1" stop-color="#7E3A1A"/></radialGradient></defs>`;
  return `<svg class="bhouse" viewBox="0 0 200 170" aria-hidden="true">` + defs +
    `<ellipse cx="116" cy="${G + 2}" rx="100" ry="7.4" fill="rgba(74,40,14,.22)"/><ellipse cx="100" cy="${G + 1}" rx="86" ry="4" fill="rgba(48,22,6,.3)"/>` +
    // the footing: a trench of trodden mud the house stands on, and the faint shape of the house to come
    `<path d="M18 ${G - 1} H182 L186 ${G + 4} Q100 ${G + 8} 14 ${G + 4} Z" fill="#8E5A34"/><path d="M18 ${G - 1} H182" stroke="#6B3E20" stroke-width="1.2"/>` +
    `<path class="plan" d="M24 ${G} V78 H176 V${G} M82 ${G} V118 Q100 100 118 118 V${G}"/>` +
    `<path class="doorhole" d="M83 ${G} V118.6 Q100 101.4 117 118.6 V${G} Z"/>` +
    slots +
    // the finish: plaster over the bricks, the parapet and its zanko horns, roof beams, the relief and the doorway
    `<g class="fin">` +
    `<path d="${wall}" fill="${u('wall')}" fill-rule="evenodd"/><path d="${wall}" fill="${u('lit')}" fill-rule="evenodd"/>` +
    `<path d="M22 74 H178 V78 H22 Z" fill="#A85E2E" opacity=".6"/>` +
    `<path d="M20 70 H180 V75 H20 Z" fill="#B86A34"/><g fill="#C27840">${horns}</g>` +
    `<path d="M18 70 Q19 58 22 50 Q24 60 27 70 Z M173 70 Q176 60 178 50 Q181 58 182 70 Z" fill="#B86A34"/>` +
    `<g fill="#7A5230"><rect x="36" y="80" width="6" height="3.6" rx="1"/><rect x="70" y="80" width="6" height="3.6" rx="1"/><rect x="124" y="80" width="6" height="3.6" rx="1"/><rect x="158" y="80" width="6" height="3.6" rx="1"/></g>` +
    `<g fill="#5A3A1E" opacity=".5"><rect x="37" y="83.6" width="5" height="1.4"/><rect x="71" y="83.6" width="5" height="1.4"/><rect x="125" y="83.6" width="5" height="1.4"/><rect x="159" y="83.6" width="5" height="1.4"/></g>` +
    `<g fill="none" stroke="#FCEBD0" stroke-width="1.3" opacity=".8"><path d="M88 92 q12 -12 24 0 q-12 12 -24 0 Z"/><circle cx="100" cy="92" r="2.6"/>` +
    `<path d="M76 102 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4"/><path d="M40 98 l5 -5 l5 5 l-5 5 Z M150 98 l5 -5 l5 5 l-5 5 Z"/></g>` +
    `<path d="M78 ${G} V117 Q100 95 122 117 V${G}" fill="none" stroke="#FCEBD0" stroke-width="1.6" opacity=".75"/>` +
    `<path d="M83 ${G} V118.6 Q100 101.4 117 118.6 V${G} Z" fill="#3A1E0C"/><path d="M86 ${G} V120 Q100 106 114 120 V${G} Z" fill="#2A1408"/>` +
    `<g transform="translate(140 ${G})"><path d="M-4 -.6 Q-8 -4 -7.6 -9 Q-7 -13.6 -2.8 -15 L-2.6 -16.8 H2.6 L2.8 -15 Q7 -13.6 7.6 -9 Q8 -4 4 -.6 Q0 .4 -4 -.6 Z" fill="${u('pot')}"/>` +
    `<ellipse cy="-16.8" rx="3" ry=".8" fill="#4A2412"/><path d="M-6 -11 l1.2 -1.2 l1.2 1.2 l1.2 -1.2 l1.2 1.2 l1.2 -1.2 l1.2 1.2 l1.2 -1.2 l1.2 1.2 l1.2 -1.2" stroke="#F3D9B0" stroke-width=".55" fill="none" opacity=".8"/></g>` +
    `</g></svg>`;
}
