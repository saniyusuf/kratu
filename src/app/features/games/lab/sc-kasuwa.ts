// @ts-nocheck
import { arewaCap } from './capsArewa';
/*
 * Hanzarin kasuwa, drawn (Sani 2026-10-25: "a busy northern market at mid-morning, the same quality as Hawan Sallah").
 * 320×200, sliced to fill any landscape screen. Far back: the town's red-earth houses with zanko horns, a minaret and
 * its dome, neem trees and a dum palm. Behind the board: rows of stalls under zinc roofs and coloured umbrellas, and
 * a crowd walking with loads on their heads. Left: a mai kosai frying under a shade, a mai baro pushing his wheelbarrow,
 * a tomato seller in zani and kallabi with her calabashes and enamel basins and her daughter. Right: a keke napep,
 * a donkey with panniers, women selling peppers and onions, goats and chickens wandering. The middle is open trodden
 * ground so the game's stall reads clearly.
 *
 * Moving parts (sc-kasuwa.css animates transform and opacity only):
 *   .x-p a person (hop / sway) · .x-h a head (shake, nod) · .x-a an arm (clap, raise). Faces live in one shared <defs>
 *   head and switch through custom properties set by the CSS: --eo/--eh (open or happy eyes), --ms/--mf (smile or frown)
 *   extra person classes: .x-cl claps on cheer · .x-up raises both arms · .x-hop jumps · .x-nod nods
 */
const PF = 'kw4';
const SKIN = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#94603A', '#53321A'];
const lg = (id, ...c) => '<linearGradient id="' + PF + '-' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const U = (id) => 'url(#' + PF + '-' + id + ')';
const n2 = (v) => +v.toFixed(2), n1 = (v) => +v.toFixed(1);

/* ---------------- people ---------------- */
/* an arm hangs from its shoulder at the local origin; the empty circle centres the box on the shoulder so
   transform-box: fill-box turns it there. The right arm is the left one mirrored. */
const ARM = {
  down: ['M0 0 Q-3 6.5 -2.4 12.6', -2.4, 13.2], hip: ['M0 0 Q-4.6 5 -.8 10', -.5, 10.3],
  front: ['M0 0 Q-1.5 6.5 3.4 8.4', 3.8, 8.4], head: ['M0 0 Q-4.4 -4 -.8 -11.4', -.5, -12],
  up: ['M0 0 Q-4 -6 -3.4 -13', -3.4, -13.6], out: ['M0 0 Q-5 3 -7.4 7.4', -7.6, 8],
  lap: ['M0 0 Q-2.6 6 2.2 7.6', 2.6, 7.6], push: ['M0 0 Q-1 6 4.6 9.6', 5, 9.8],
};
function arm(side, pose, sleeve, sk, hold = '', cls = 'x-a', w = 3.2) {
  const [d, hx, hy] = ARM[pose] || ARM.down;
  return '<g transform="translate(' + (side < 0 ? -4.5 : 4.5) + ' -29.6)' + (side > 0 ? ' scale(-1 1)' : '') + '"><g class="' + cls + '"><circle r="15" fill="none"/>' +
    '<path d="' + d + '" stroke="' + sleeve + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>' +
    '<circle cx="' + hx + '" cy="' + hy + '" r="1.3" fill="' + sk + '"/>' + hold + '</g></g>';
}
const headDef = '<g id="' + PF + '-hd">' + '<rect x="-1.2" y="-33" width="2.4" height="3" fill="currentColor"/><rect x="-1.2" y="-33" width="2.4" height="3" fill="#000" opacity=".18"/>' +
    '<ellipse cx="-3.7" cy="-35" rx=".7" ry="1" fill="currentColor"/><ellipse cx="3.7" cy="-35" rx=".7" ry="1" fill="currentColor"/>' +
    '<circle cy="-35.2" r="3.75" fill="currentColor"/><circle cy="-35.2" r="3.75" fill="' + U('sh') + '"/>' +
  '<g style="opacity:var(--eo,1)" fill="#1A0E06"><circle cx="-1.35" cy="-35.5" r=".46"/><circle cx="1.35" cy="-35.5" r=".46"/></g>' +
  '<g style="opacity:var(--eh,0)" fill="none" stroke="#1A0E06" stroke-width=".4" stroke-linecap="round"><path d="M-2 -35.3 q.65 -.8 1.3 0 M.7 -35.3 q.65 -.8 1.3 0"/></g>' +
  '<path style="opacity:var(--ms,1)" d="M-1.2 -33.4 Q0 -32.3 1.2 -33.4" stroke="#3A1A0A" stroke-width=".42" fill="none" stroke-linecap="round"/>' +
  '<path style="opacity:var(--mf,0)" d="M-1.1 -32.7 Q0 -33.6 1.1 -32.7" stroke="#3A1A0A" stroke-width=".42" fill="none" stroke-linecap="round"/>' +
  '<path d="M-2.1 -36.6 l1.3 -.25 M2.1 -36.6 l-1.3 -.25" stroke="#1A0E06" stroke-width=".3" stroke-linecap="round"/>' +
    '<path d="M.1 -35 q.6 1.1 -.3 1.3" stroke="#000" stroke-opacity=".3" stroke-width=".3" fill="none"/>' + '</g>';
function head(o, sk) {
  let back = '', front = '';
  const cc = o.capc || '#fff', c2 = o.capc2 || '#C62828';
  if (o.cap === 'mayafi' || o.cap === 'hijab') back = '<path d="M-4.6 -35 Q-4.8 -41 0 -41.2 Q4.8 -41 4.6 -35 L6.6 -27.5 Q0 -25.5 -6.6 -27.5 Z" fill="' + cc + '"/>';
  if (o.cap === 'hula' || o.cap === 'zanna' || o.cap === 'borno') front = arewaCap(o.cap, 0, -36.3, 3.7, cc, o.capc2, o.capc3, o.capside || 1);
  if (o.cap === 'turban') front = '<path d="M-4 -35.8 Q-4.4 -41.6 0 -41.8 Q4.4 -41.6 4 -35.8 Q2 -37.8 0 -37.6 Q-2 -37.8 -4 -35.8 Z" fill="' + cc + '"/><path d="M-3.8 -38 Q0 -40.6 3.8 -38.6 M-3.6 -39.8 Q0 -42 3.4 -40.4" stroke="#000" stroke-opacity=".13" stroke-width=".45" fill="none"/>' +
    '<path d="M3.6 -36.4 Q5.6 -32 4.4 -28" stroke="' + cc + '" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
  if (o.cap === 'kallabi') front = '<path d="M-3.9 -35.6 Q-4.4 -40.6 0 -40.8 Q4.4 -40.6 3.9 -35.6 Q0 -38.2 -3.9 -35.6 Z" fill="' + cc + '"/>' +
    '<path d="M-2.6 -40 Q-6 -45.4 -1.2 -44.2 Q0 -47 1.4 -44.2 Q6 -45.6 2.6 -40 Z" fill="' + cc + '"/><path d="M-1.2 -44.2 Q-.6 -42 -.4 -40.6 M1.4 -44.2 Q.8 -42 .5 -40.6 M-3.6 -37.4 Q0 -40 3.6 -37.4" stroke="' + c2 + '" stroke-width=".42" fill="none"/>';
  if (o.cap === 'mayafi' || o.cap === 'hijab') front = '<path d="M-4 -35.4 Q-4.2 -40.2 0 -40.3 Q4.2 -40.2 4 -35.4 Q2.6 -39 0 -39 Q-2.6 -39 -4 -35.4 Z" fill="' + cc + '"/><path d="M-4 -35.4 Q-2.6 -39 0 -39 Q2.6 -39 4 -35.4" stroke="#000" stroke-opacity=".15" stroke-width=".4" fill="none"/>';
  if (o.cap === 'scarf') front = '<path d="M-3.9 -35.8 Q-4.2 -40.4 0 -40.6 Q4.2 -40.4 3.9 -35.8 Q0 -38 -3.9 -35.8 Z" fill="' + cc + '"/><path d="M3.4 -38 l2 -1 l-.6 2.2 Z" fill="' + cc + '"/>';
  const big = o.child ? ' transform="translate(0 -31.6) scale(1.16) translate(0 31.6)"' : '';
  return '<g' + big + '><g class="x-h"><circle cx="0" cy="-31.6" r="12" fill="none"/>' + back +
    '<use href="#' + PF + '-hd" color="' + sk + '"/>' +
    (o.beard ? '<path d="M-2.8 -33.6 Q0 -29.4 2.8 -33.6 Q1.6 -32 0 -32 Q-1.6 -32 -2.8 -33.6 Z" fill="' + o.beard + '"/>' : '') +
    front + (o.load || '') + '</g></g>';
}
/* the clothes, standing or sitting (sitting drops the upper body by 8) */
function clothesRaw(o) {
  const t = o.trim || '#C9A227', sd = '<path d="M0 0" />';
  const feet = (c, y = 0) => '<path d="M-3.8 ' + (y - .2) + ' q-.3 -1.2 1 -1.2 h1.8 v1.3 Z M3.8 ' + (y - .2) + ' q.3 -1.2 -1 -1.2 h-1.8 v1.3 Z" fill="' + c + '"/>';
  if (o.kind === 'man' && !o.seat) return feet('#3A2A1E') + '<path d="M-3.6 -4.4 L-3.6 -1.2 H3.6 L3.6 -4.4 Z" fill="' + (o.robe2 || o.robe) + '"/>' +
    '<path d="M-5 -31 Q0 -32.6 5 -31 Q9.4 -20 12 -5 Q0 -2.2 -12 -5 Q-9.4 -20 -5 -31 Z" fill="' + o.robe + '"/>' +
    '<path d="M.4 -32.4 Q3.6 -32.2 5 -31 Q9.4 -20 12 -5 Q6.6 -3.4 1.4 -3 Q3 -16 .4 -32.4 Z" fill="#000" opacity=".13"/>' +
    '<path d="M-3 -24 Q-6.4 -14 -8.4 -5.6 M-.6 -18 Q-1.2 -10 -2 -3.4 M3.6 -22 Q6 -12 7.6 -4.4" stroke="#000" stroke-opacity=".14" stroke-width=".45" fill="none"/>' +
    '<path d="M-2 -31.4 L0 -26.6 L2 -31.4" stroke="' + t + '" stroke-width=".55" fill="none"/><circle cx="-2.2" cy="-22" r="1.6" fill="none" stroke="' + t + '" stroke-width=".45"/><path d="M-3.6 -18.6 q2 1.4 4 0 M-3 -16.6 q1.6 1.1 3 0" stroke="' + t + '" stroke-width=".4" fill="none"/>' +
    '<path d="M-11.6 -5.2 Q0 -2.4 11.6 -5.2" stroke="' + t + '" stroke-width=".45" fill="none" opacity=".7"/>';
  if (o.kind === 'man') return feet('#3A2A1E') +
    '<path d="M-5 -23 Q0 -24.4 5 -23 Q8 -15 8.4 -10 Q8.8 -8.2 7.2 -7.6 L5.4 -1.4 Q0 -.4 -5.4 -1.4 L-7.2 -7.6 Q-8.8 -8.2 -8.4 -10 Q-8 -15 -5 -23 Z" fill="' + o.robe + '"/>' +
    '<path d="M.4 -24.2 Q3.6 -24 5 -23 Q8 -15 8.4 -10 Q8.8 -8.2 7.2 -7.6 L5.4 -1.4 Q3 -1 1.6 -1 Q2.4 -12 .4 -24.2 Z" fill="#000" opacity=".13"/>' +
    '<path d="M-7.8 -8.4 Q0 -6.6 7.8 -8.4 M-2 -7 Q-2.4 -4 -3 -1.4 M2.4 -7 Q2.8 -4 3.2 -1.4" stroke="#000" stroke-opacity=".16" stroke-width=".45" fill="none"/>' +
    '<path d="M-2 -23.4 L0 -18.8 L2 -23.4" stroke="' + t + '" stroke-width=".55" fill="none"/><circle cx="-2.2" cy="-15" r="1.4" fill="none" stroke="' + t + '" stroke-width=".45"/>';
  if (o.kind === 'jal') return feet('#3A2A1E') +
    '<path d="M-4.5 -31 Q0 -32.4 4.5 -31 Q6 -16 6.4 -2.4 Q0 -1.2 -6.4 -2.4 Q-6 -16 -4.5 -31 Z" fill="' + o.robe + '"/>' +
    '<path d="M.6 -32 Q3.4 -32 4.5 -31 Q6 -16 6.4 -2.4 Q4 -1.8 2 -1.7 Q2.4 -16 .6 -32 Z" fill="#000" opacity=".13"/>' +
    '<path d="M-1.4 -31.4 V-25.6 M-2.6 -14 Q-3 -8 -3.6 -2.4 M2 -16 Q2.6 -9 3 -2" stroke="#000" stroke-opacity=".16" stroke-width=".45" fill="none"/><path d="M-1.4 -31.4 V-25.6" stroke="' + t + '" stroke-width=".5"/>';
  if (o.kind === 'boy') return feet('#3A2A1E') + '<path d="M-3.4 -12 L-3.6 -1.2 H-.5 L-.4 -12 Z M.4 -12 L.5 -1.2 H3.6 L3.4 -12 Z" fill="' + (o.robe2 || '#E9E2CF') + '"/>' +
    '<path d="M-4.4 -31 Q0 -32.4 4.4 -31 Q5.4 -20 5.8 -11.6 Q0 -10.4 -5.8 -11.6 Q-5.4 -20 -4.4 -31 Z" fill="' + o.robe + '"/>' +
    '<path d="M.6 -32 Q3.4 -32 4.4 -31 Q5.4 -20 5.8 -11.6 Q3.6 -11 1.8 -10.9 Q2.2 -20 .6 -32 Z" fill="#000" opacity=".13"/><path d="M-1.4 -31.4 V-26" stroke="' + t + '" stroke-width=".5"/>';
  if (o.kind === 'girl') return feet('#6B2A2A') +
    '<path d="M-4.4 -31 Q0 -32.4 4.4 -31 Q6.2 -16 6.6 -1.8 Q0 -.6 -6.6 -1.8 Q-6.2 -16 -4.4 -31 Z" fill="' + o.robe + '"/>' +
    '<path d="M.6 -32 Q3.4 -32 4.4 -31 Q6.2 -16 6.6 -1.8 Q4.4 -1.2 2 -1.2 Q2.6 -16 .6 -32 Z" fill="#000" opacity=".13"/>' +
    '<path d="M-6.4 -5 Q0 -3.6 6.4 -5" stroke="' + t + '" stroke-width=".7" fill="none"/><path d="M-6 -9 Q0 -7.6 6 -9" stroke="' + t + '" stroke-width=".4" fill="none"/>';
  /* woman: a blouse (riga) over a zani wrapper with an ankara pattern; seated, the wrapper falls over her knees */
  const w = o.wrap || '#2F6B9A', w2 = o.wrap2 || '#FFB300', top = o.top || w;
  const dots = (ys) => ys.map((y) => [-3.4, -1.1, 1.2, 3.5].map((x) => '<path d="M' + x + ' ' + (y - .7) + ' l.7 .7 l-.7 .7 l-.7 -.7 Z"/>').join('')).join('');
  const lower = o.seat
    ? '<path d="M-5.6 -13.4 Q0 -14.6 5.6 -13.4 Q8.6 -10 8.6 -7.8 Q8.6 -6.4 7.2 -6 L5.6 -.9 Q0 0 -5.6 -.9 L-7.2 -6 Q-8.6 -6.4 -8.6 -7.8 Q-8.6 -10 -5.6 -13.4 Z" fill="' + w + '"/>' +
      '<path d="M-8.4 -7.6 Q0 -6 8.4 -7.6" stroke="' + w2 + '" stroke-width=".9" fill="none"/><path d="M-6.4 -2.6 Q0 -1.6 6.4 -2.6" stroke="' + w2 + '" stroke-width=".7" fill="none"/>' +
      '<g fill="' + w2 + '">' + dots([-10.6, -4.6]) + '</g><path d="M1 -14.4 Q4.6 -14 5.6 -13.4 Q8.6 -10 8.6 -7.8 Q8.6 -6.4 7.2 -6 L5.6 -.9 Q4 -.5 2.6 -.5 Q2.6 -8 1 -14.4 Z" fill="#000" opacity=".12"/>'
    : '<path d="M-5.4 -21 Q0 -22 5.4 -21 Q6.2 -11 5 -1 Q0 0 -5 -1 Q-6.2 -11 -5.4 -21 Z" fill="' + w + '"/>' +
      '<path d="M-5.6 -16 Q0 -15 5.7 -16 M-5.5 -6.6 Q0 -5.6 5.5 -6.6" stroke="' + w2 + '" stroke-width="1" fill="none"/><g fill="' + w2 + '">' + dots([-11.2, -3.2]) + '</g>' +
      '<path d="M4.8 -21 Q1.6 -12 2.6 -1" stroke="#000" stroke-opacity=".22" stroke-width=".5" fill="none"/>' +
      '<path d="M1 -21.6 Q4 -21.6 5.4 -21 Q6.2 -11 5 -1 Q3.6 -.6 2.6 -1 Q1.6 -12 1 -21.6 Z" fill="#000" opacity=".12"/>';
  const ys = o.seat ? 8 : 0;
  const blouse = '<g transform="translate(0 ' + ys + ')"><path d="M-4.6 -31 Q0 -32.3 4.6 -31 Q5.6 -26 5.8 -20 Q0 -18.8 -5.8 -20 Q-5.6 -26 -4.6 -31 Z" fill="' + top + '"/>' +
    '<path d="M.6 -32 Q3.6 -32 4.6 -31 Q5.6 -26 5.8 -20 Q3.6 -19.4 1.8 -19.3 Q2.4 -26 .6 -32 Z" fill="#000" opacity=".12"/>' +
    '<path d="M-1.6 -31.3 Q0 -29.4 1.6 -31.3 M-5.8 -20 Q0 -18.8 5.8 -20" stroke="' + t + '" stroke-width=".55" fill="none"/></g>';
  return feet('#7A2E1A') + lower + blouse;
}

const VARS = { robe: '--a', robe2: '--b', trim: '--t', wrap: '--w', wrap2: '--x', top: '--y' };
const KINDS = ['man', 'man-s', 'jal', 'boy', 'girl', 'woman', 'woman-s'];
const clothesDef = () => KINDS.map((k) => { const [kind, st] = k.split('-'), o = { kind, seat: !!st };
  for (const key in VARS) o[key] = 'var(' + VARS[key] + ')';
  return '<g id="' + PF + '-c-' + k + '">' + clothesRaw(o).replace(/(fill|stroke)="(var\(--\w\))"/g, 'style="$1:$2"') + '</g>'; }).join('');
function clothes(o) {
  const t = o.trim || '#C9A227', w = o.wrap || '#2F6B9A';
  const c = { robe: o.robe, robe2: o.robe2 || o.robe, trim: t, wrap: w, wrap2: o.wrap2 || '#FFB300', top: o.top || w };
  return '<use href="#' + PF + '-c-' + o.kind + (o.seat && (o.kind === 'man' || o.kind === 'woman') ? '-s' : '') + '" style="' + Object.keys(VARS).map((k) => VARS[k] + ':' + c[k]).join(';') + '"/>';
}
/* the mayafi falls over the shoulders, in front of the blouse */
const shawl = (c, ys) => '<path d="M-5.2 ' + (-31.4 + ys) + ' Q0 ' + (-29 + ys) + ' 5.2 ' + (-31.4 + ys) + ' L7 ' + (-22 + ys) + ' Q0 ' + (-19 + ys) + ' -7 ' + (-22 + ys) + ' Z" fill="' + c + '"/><path d="M-6.8 ' + (-22.4 + ys) + ' Q0 ' + (-19.4 + ys) + ' 6.8 ' + (-22.4 + ys) + '" stroke="#000" stroke-opacity=".15" stroke-width=".5" fill="none"/><path d="M1 ' + (-29.6 + ys) + ' Q4 ' + (-30 + ys) + ' 5.2 ' + (-31.4 + ys) + ' L7 ' + (-22 + ys) + ' Q4 ' + (-20.6 + ys) + ' 2.4 ' + (-20.4 + ys) + ' Z" fill="#000" opacity=".12"/>';
function person(o) {
  const sk = o.sk || SKIN[0], ys = o.seat ? 8 : 0, sl = o.sleeve || o.robe || o.top || o.wrap;
  const al = o.al || 'down', ar = o.ar || 'down';
  let s = '<g transform="translate(' + o.x + ' ' + o.y + ') scale(' + (o.flip ? -o.s : o.s) + ' ' + o.s + ')"><ellipse rx="' + (o.seat ? 8.5 : 7.5) + '" ry="1.5" fill="#3A2410" opacity=".2"/>' +
    '<g class="x-p ' + (o.cls || '') + '">' + (o.seat && o.stool ? o.stool : '') + clothes(o) +
    '<g transform="translate(0 ' + (o.kind === 'woman' ? 0 : 0) + ')">';
  const up = '<g transform="translate(0 ' + (o.kind === 'man' && o.seat ? 8 : (o.kind === 'woman' ? ys : 0)) + ')">' +
    arm(-1, al, sl, sk, o.hl || '', o.acl || 'x-a') + arm(1, ar, sl, sk, o.hr || '', o.acr || 'x-a') +
    (o.cap === 'mayafi' ? shawl(o.capc, 0) : '') + head(o, sk) + '</g>';
  return s + up + '</g></g></g>';
}

/* ---------------- things ---------------- */
const tomatoes = (cx, cy, r, n = 7) => { let s = ''; for (let i = 0; i < n; i++) { const a = i * 2.4, rr = i ? r * (.3 + (i % 3) * .2) : 0, x = cx + Math.cos(a) * rr, y = cy - Math.abs(Math.sin(a)) * rr * .5 - (i ? 0 : r * .25);
  s += '<circle cx="' + n1(x) + '" cy="' + n1(y) + '" r="' + n1(r * .38) + '" fill="' + (i % 4 === 3 ? '#E0452A' : '#C9301F') + '"/>' + (i < 3 ? '<circle cx="' + n1(x - r * .12) + '" cy="' + n1(y - r * .14) + '" r="' + n1(r * .1) + '" fill="#fff" opacity=".35"/>' : ''); } return s; };
const peppers = (cx, cy, r, n = 8) => { let s = ''; for (let i = 0; i < n; i++) { const a = i * 2.4, rr = i ? r * (.3 + (i % 3) * .2) : 0, x = cx + Math.cos(a) * rr, y = cy - Math.abs(Math.sin(a)) * rr * .5 - (i ? 0 : r * .25);
  s += '<ellipse cx="' + n1(x) + '" cy="' + n1(y) + '" rx="' + n1(r * .36) + '" ry="' + n1(r * .22) + '" transform="rotate(' + ((i * 47) % 70 - 35) + ' ' + n1(x) + ' ' + n1(y) + ')" fill="' + (i % 3 ? '#D7261E' : '#E8A21E') + '"/>'; } return s; };
const onions = (cx, cy, r, n = 5) => { let s = ''; for (let i = 0; i < n; i++) { const x = cx + (i - (n - 1) / 2) * r * .3, y = cy + r * .12 - (i % 2) * r * .22;
  s += '<path d="M' + n1(x) + ' ' + n1(y - r * .5) + ' q' + n1(r * .42) + ' ' + n1(r * .26) + ' ' + n1(r * .06) + ' ' + n1(r * .52) + ' h' + n1(-r * .12) + ' q' + n1(-r * .36) + ' ' + n1(-r * .26) + ' ' + n1(r * .06) + ' ' + n1(-r * .52) + ' Z" fill="' + (i % 2 ? '#8E3A6A' : '#A84B7C') + '"/>'; } return s; };
/* a calabash bowl (kwarya) with pokerwork lines, a heap of goods on top */
const kwarya = (x, y, r, goods = '') => '<g transform="translate(' + x + ' ' + y + ')"><ellipse cy=".4" rx="' + n2(r * 1.05) + '" ry="' + n2(r * .22) + '" fill="#3A2410" opacity=".22"/>' +
  '<path d="M' + -r + ' ' + n2(-r * .55) + ' Q' + -r + ' 0 0 0 Q' + r + ' 0 ' + r + ' ' + n2(-r * .55) + ' Z" fill="#D9A55A"/><path d="M' + n2(r * .1) + ' ' + n2(-r * .02) + ' Q' + r + ' 0 ' + r + ' ' + n2(-r * .55) + ' L' + n2(r * .3) + ' ' + n2(-r * .55) + ' Z" fill="#000" opacity=".12"/>' +
  '<path d="M' + n2(-r * .85) + ' ' + n2(-r * .32) + ' Q0 ' + n2(-r * .12) + ' ' + n2(r * .85) + ' ' + n2(-r * .32) + '" stroke="#8B5A2B" stroke-width="' + n2(r * .07) + '" fill="none" stroke-dasharray="' + n2(r * .2) + ' ' + n2(r * .12) + '"/>' +
  '<ellipse cy="' + n2(-r * .55) + '" rx="' + r + '" ry="' + n2(r * .14) + '" fill="none" stroke="#A9743A" stroke-width="' + n2(r * .06) + '"/><g transform="translate(' + -x + ' ' + -y + ')">' + goods + '</g></g>';
/* an enamel basin (kwano) with a printed flower */
const kwano = (x, y, r, c = '#F4F1EA', rim = '#1F5FA8', goods = '') => '<g transform="translate(' + x + ' ' + y + ')"><ellipse cy=".4" rx="' + n2(r * 1.05) + '" ry="' + n2(r * .22) + '" fill="#3A2410" opacity=".22"/>' +
  '<path d="M' + -r + ' ' + n2(-r * .6) + ' L' + n2(-r * .72) + ' 0 H' + n2(r * .72) + ' L' + r + ' ' + n2(-r * .6) + ' Z" fill="' + c + '"/><path d="M' + n2(r * .2) + ' 0 H' + n2(r * .72) + ' L' + r + ' ' + n2(-r * .6) + ' H' + n2(r * .4) + ' Z" fill="#000" opacity=".1"/>' +
  '<circle cx="' + n2(-r * .3) + '" cy="' + n2(-r * .3) + '" r="' + n2(r * .13) + '" fill="#D7261E"/><circle cx="' + n2(-r * .1) + '" cy="' + n2(-r * .26) + '" r="' + n2(r * .1) + '" fill="#E8A21E"/><path d="M' + n2(-r * .44) + ' ' + n2(-r * .2) + ' l' + n2(-r * .16) + ' ' + n2(r * .1) + '" stroke="#2E7D32" stroke-width="' + n2(r * .07) + '"/>' +
  '<path d="M' + n2(-r * 1.04) + ' ' + n2(-r * .6) + ' H' + n2(r * 1.04) + '" stroke="' + rim + '" stroke-width="' + n2(r * .13) + '" stroke-linecap="round"/><g transform="translate(' + -x + ' ' + -y + ')">' + goods + '</g></g>';
/* a basin carried on the head (drawn in head coordinates, sitting on the crown) */
const headLoadRaw = (kind, c, rim) => kind === 'basin'
  ? '<g transform="translate(0 -40.4)"><path d="M-6 -2.6 L-4.4 .4 H4.4 L6 -2.6 Z" fill="' + c + '"/><path d="M-6.2 -2.6 H6.2" stroke="' + rim + '" stroke-width=".8" stroke-linecap="round"/>' + tomatoes(0, -2.6, 3.6, 6) + '</g>'
  : kind === 'tray' ? '<g transform="translate(0 -40.6)"><ellipse rx="6.6" ry="1.2" fill="#C69A5A"/><g fill="#C98E3A">' + [-4, -1.4, 1.2, 3.8, -2.6, 0, 2.6, -1.2, 1.4].map((x, i) => '<circle cx="' + x + '" cy="' + (-1 - (i > 4 ? 1.4 : 0) - (i > 6 ? 1.2 : 0)) + '" r="1.25"/>').join('') + '</g></g>'
  : '<g transform="translate(0 -40.6)"><path d="M-5 0 Q-6 -5 -2 -6 Q0 -7.5 2 -6 Q6 -5 5 0 Z" fill="#D8C49A"/><path d="M-4 -1 Q0 -3 4 -1 M-3.4 -3.6 Q0 -5 3.4 -3.6" stroke="#9C8458" stroke-width=".35" fill="none"/></g>';
const LOADS = { basin: '-lb', tray: '-lt', sack: '-ls' };
const loadDefs = () => '<g id="' + PF + '-lb">' + headLoadRaw('basin', '#F4F1EA', '#1F5FA8') + '</g><g id="' + PF + '-lr">' + headLoadRaw('basin', '#F4F1EA', '#C62828') + '</g><g id="' + PF + '-lt">' + headLoadRaw('tray') + '</g><g id="' + PF + '-ls">' + headLoadRaw('sack') + '</g>' +
  '<path id="' + PF + '-hu" d="M-3.6 -36.3 Q-3.7 -40.8 0 -41 Q3.7 -40.8 3.6 -36.3 Z" fill="currentColor"/><path id="' + PF + '-kt" d="M-4 -35.6 Q-4.4 -40.6 0 -40.8 Q4.4 -40.6 4 -35.6 Q0 -38 -4 -35.6 Z" fill="currentColor"/>';
const headLoad = (kind, c, rim) => '<use href="#' + PF + (kind === 'basin' && rim === '#C62828' ? '-lr' : LOADS[kind]) + '"/>';
const goat = (x, y, s, c = '#F2EDE4', c2 = '#5A3A22', flip = false, cls = '') => '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ')"><ellipse cy=".3" rx="8" ry="1.3" fill="#3A2410" opacity=".2"/><g class="x-goat ' + cls + '">' +
  '<path d="M-5.4 -6 L-5.8 0 M-3.6 -6 L-3.2 0 M3.4 -6 L3.2 0 M5 -6 L5.6 0" stroke="' + c2 + '" stroke-width=".9" stroke-linecap="round"/>' +
  '<path d="M-7 -9 Q-7.6 -12 -5 -12.4 L4 -12.6 Q6.6 -12.4 6.4 -9 Q6 -5.6 3 -5.6 L-4.6 -5.6 Q-7 -5.8 -7 -9 Z" fill="' + c + '"/><path d="M-6 -7.4 Q0 -5 6 -7.6 Q5.4 -5.6 3 -5.6 L-4.6 -5.6 Q-6 -5.8 -6 -7.4 Z" fill="#000" opacity=".1"/>' +
  '<path d="M-1 -12.4 Q1 -10 0 -6.2 Q2.6 -9 2 -12.4 Z" fill="' + c2 + '" opacity=".7"/><path d="M-7 -11 l-1.6 -2.2" stroke="' + c + '" stroke-width=".9" stroke-linecap="round"/>' +
  '<g class="x-gh"><circle cx="6" cy="-11.4" r="5" fill="none"/><path d="M5 -11 Q6.2 -15.4 8.4 -15.4 Q10.4 -15 10.8 -12.4 L10.6 -11.2 Q9.6 -10.4 8.6 -11.2 L7 -10 Z" fill="' + c + '"/>' +
  '<path d="M7.6 -15.2 Q6.4 -18 4.6 -18.2 M8.4 -15.4 Q7.8 -17.6 6.6 -18.4" stroke="#6B5A44" stroke-width=".55" fill="none" stroke-linecap="round"/><path d="M7.2 -14.4 l-2.4 .8 l1.6 .6 Z" fill="' + c2 + '"/>' +
  '<circle cx="9" cy="-13.6" r=".4" fill="#1A0E06"/><path d="M10 -11 l-.2 1.8 l-.6 -1.4" fill="' + c + '" stroke="' + c + '" stroke-width=".4"/></g></g></g>';
const chicken = (x, y, s, c = '#B5652E', flip = false, cls = '') => '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ')"><ellipse cy=".2" rx="3.6" ry=".7" fill="#3A2410" opacity=".2"/><g class="x-hen ' + cls + '"><circle cx="0" cy="-2.6" r="6" fill="none"/>' +
  '<path d="M-.6 -2.6 V0 M.8 -2.6 V0" stroke="#D99A2B" stroke-width=".45"/><path d="M-3.6 -5.4 Q-4.8 -8.6 -2.6 -8 Q-1 -3.6 2.4 -4.2 L3 -6.6 Q3.4 -8.2 4.6 -7.6 L5.2 -6.4 Q4.4 -2.2 1.4 -2.2 Q-3 -2.2 -3.6 -5.4 Z" fill="' + c + '"/>' +
  '<path d="M-2.6 -4.4 Q0 -3 2 -4" stroke="#000" stroke-opacity=".2" stroke-width=".4" fill="none"/><path d="M5.1 -6.8 l1 .3 l-1 .4 Z" fill="#E8A21E"/><path d="M3.6 -8 q.4 -.9 .9 -.2 q.4 -.8 .7 .1" fill="#D7261E"/><circle cx="4.3" cy="-7" r=".25" fill="#1A0E06"/></g></g>';
const donkey = (x, y, s, flip) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ')"><ellipse cy=".4" rx="13" ry="1.6" fill="#3A2410" opacity=".22"/>' +
  '<path d="M-8.6 -10 L-9.2 0 M-6.4 -10 L-6 0 M6.4 -10 L6 0 M8.6 -10 L9.4 0" stroke="#6E6258" stroke-width="1.5" stroke-linecap="round"/><path d="M-9.8 -.4 h1.4 M-6.8 -.4 h1.4 M5.4 -.4 h1.4 M8.8 -.4 h1.4" stroke="#2A2420" stroke-width=".8"/>' +
  '<path d="M-11 -14 Q-11.4 -19 -7 -19.4 L7 -19.6 Q10.4 -19.4 10.6 -15 Q10.4 -9.6 7 -9.4 L-7.6 -9.4 Q-11 -9.8 -11 -14 Z" fill="#8A7C70"/><path d="M-10 -11.6 Q0 -8.6 10 -12 Q9.6 -9.6 7 -9.4 L-7.6 -9.4 Q-10 -9.8 -10 -11.6 Z" fill="#E8E0D4" opacity=".7"/>' +
  '<path d="M-11 -16 Q-13.6 -14 -13 -9.4" stroke="#6E6258" stroke-width=".8" fill="none"/><g class="x-tail"><circle cx="-11" cy="-16" r="7" fill="none"/><path d="M-11 -16 Q-13.6 -14 -13 -9.4" stroke="#6E6258" stroke-width=".8" fill="none"/><path d="M-13 -9.6 l-.6 1.6 l1 0 Z" fill="#3A322C"/></g>' +
  // panniers of onions and a sack
  '<path d="M-6 -20 Q-7 -12 -4.6 -9.6 L3.6 -9.6 Q6 -12 5 -20 Z" fill="#B48A4E"/><path d="M-5.6 -17 H4.8 M-5.4 -14 H5 M-5 -11.4 H4.6" stroke="#8A6630" stroke-width=".4"/><path d="M-4.4 -20 Q0 -25 4 -20 Z" fill="#D8C49A"/>' + onions(0, -20.4, 4, 3) +
  '<path d="M7.4 -18.4 Q10 -24.6 13.6 -25.6 Q15.6 -26 17.2 -23.4 L18 -21 Q17.6 -19.4 15.6 -19.8 L13.8 -20.6 Q11.4 -16 10 -14.6 Z" fill="#8A7C70"/><path d="M16.4 -21.6 Q17.6 -20.6 17.8 -21" stroke="#3A322C" stroke-width=".4" fill="none"/>' +
  '<path d="M17.2 -22 Q18 -20.2 15.6 -19.8 L14.6 -20.2 Q15.4 -21.6 17.2 -22 Z" fill="#D8D0C4"/><circle cx="14.6" cy="-23.6" r=".45" fill="#1A0E06"/>' +
  '<g class="x-ear"><circle cx="12.8" cy="-25.4" r="5" fill="none"/><path d="M12.8 -25.4 Q11 -31.4 12.4 -32 Q14 -30 13.8 -25.4 Z M13.8 -25.6 Q14.6 -31 16 -31 Q16.6 -28.4 14.8 -25.2 Z" fill="#7A6C60"/></g>' +
  '<path d="M8 -19.4 Q10 -22 12.6 -24.6" stroke="#3A322C" stroke-width=".9" fill="none"/></g>';

/* ---------------- the market ---------------- */
const zanko = (x0, x1, y, c) => { let s = '<g fill="' + c + '">'; for (let x = x0; x <= x1; x += 7) s += '<path d="M' + x + ' ' + y + ' l1.3 -3.6 l1.3 3.6 Z"/>'; return s + '</g>'; };
const house = (x, y, w, h, c, c2) => '<path d="M' + x + ' ' + y + ' v' + -h + ' h' + w + ' v' + h + ' Z" fill="' + c + '"/><path d="M' + (x + w * .7) + ' ' + y + ' v' + -h + ' h' + w * .3 + ' v' + h + ' Z" fill="' + c2 + '" opacity=".5"/>' + zanko(x, x + w - 2, y - h, c) +
  '<path d="M' + (x + w * .3) + ' ' + y + ' v-4 a1.6 1.6 0 0 1 3.2 0 v4 Z" fill="#7A4A2A" opacity=".55"/>';
const neem = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-1.2 0 Q-1.8 -9 -.8 -16 L.8 -16 Q1.8 -9 1.2 0 Z" fill="#6B4A2E"/><path d="M0 -12 L-5 -18 M0 -11 L5 -17" stroke="#6B4A2E" stroke-width="1"/>' +
  '<g fill="#5E8A44"><ellipse cy="-22" rx="12" ry="7.6"/><ellipse cx="-7" cy="-18.6" rx="7" ry="5"/><ellipse cx="7" cy="-19" rx="7" ry="5"/></g><g fill="#78A452"><ellipse cx="-3" cy="-25" rx="7" ry="4.4"/><ellipse cx="5" cy="-23.4" rx="5" ry="3.4"/></g></g>';
const dum = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-.9 0 L-.5 -20 L.5 -20 L.9 0 Z" fill="#7A5A3A"/><path d="M0 -20 L-5 -23 M0 -20 L5 -23 M0 -20 L-3.6 -26 M0 -20 L3.6 -26 M0 -20 L0 -27 M0 -20 L-6 -20 M0 -20 L6 -20.4" stroke="#5E8A44" stroke-width="1.5" stroke-linecap="round"/></g>';
/* a zinc-roofed shed with its posts, the goods on the table and cloth hanging at the back */
const shed = (x, y, w, goods, cloth) => {
  return '<path d="M' + x + ' ' + y + ' v-20 M' + (x + w) + ' ' + y + ' v-20 M' + (x + w / 2) + ' ' + y + ' v-20" stroke="#6B4A2E" stroke-width="1"/>' +
    '<path d="M' + (x + 1) + ' ' + (y - 20) + ' h' + (w - 2) + ' v6 h' + (2 - w) + ' Z" fill="#000" opacity=".22"/>' + (cloth || '') +
    '<path d="M' + (x - 2) + ' ' + (y - 20) + ' L' + x + ' ' + (y - 26) + ' H' + (x + w + 2) + ' L' + (x + w) + ' ' + (y - 20) + ' Z" fill="' + U('zinc') + '"/>' +
    '<path d="M' + (x + w * .55) + ' ' + (y - 26) + ' h' + w * .2 + ' l-1.4 6 h' + -w * .2 + ' Z" fill="#A0643A" opacity=".55"/><path d="M' + (x - 2) + ' ' + (y - 20) + ' H' + (x + w) + '" stroke="#6E777C" stroke-width=".6"/>' +
    '<path d="M' + (x + 1) + ' ' + (y - 7) + ' h' + (w - 2) + ' v1.6 h' + (2 - w) + ' Z" fill="#8B5A2B"/><path d="M' + (x + 2) + ' ' + (y - 5.4) + ' V' + y + ' M' + (x + w - 2) + ' ' + (y - 5.4) + ' V' + y + '" stroke="#5E3A1C" stroke-width=".7"/>' + goods; };
const heaps = (x, y, cols) => cols.map((c, i) => '<path d="M' + (x + i * 4.4) + ' ' + y + ' q2 -3.4 4 0 Z" fill="' + c + '"/>').join('');
const cloth = (x, y, cs) => cs.map((c, i) => '<path d="M' + (x + i * 3) + ' ' + y + ' h2.6 v' + (8 + (i % 2) * 2) + ' l-1.3 1 l-1.3 -1 Z" fill="' + c + '"/>').join('');
const umbrella = (x, y, r, cs) => { let s = '<path d="M' + x + ' ' + y + ' V' + (y - r * 1.2) + '" stroke="#5E4A3A" stroke-width=".7"/>'; const n = cs.length;
  for (let i = 0; i < n; i++) { const a0 = Math.PI + i * Math.PI / n, a1 = a0 + Math.PI / n, top = y - r * 1.2;
    s += '<path d="M' + x + ' ' + n2(top - r * .36) + ' L' + n2(x + Math.cos(a0) * r) + ' ' + n2(top + Math.sin(a0) * -.0 + r * .1) + ' Q' + n2(x + Math.cos((a0 + a1) / 2) * r * .9) + ' ' + n2(top + r * .26) + ' ' + n2(x + Math.cos(a1) * r) + ' ' + n2(top + r * .1) + ' Z" fill="' + cs[i] + '"/>'; }
  return s + '<path d="M' + n2(x - r) + ' ' + n2(y - r * 1.1) + ' Q' + x + ' ' + n2(y - r * 1.5) + ' ' + n2(x + r) + ' ' + n2(y - r * 1.1) + '" stroke="#000" stroke-opacity=".1" stroke-width=".5" fill="none"/>'; };
/* the far crowd: small walkers, a few with loads on their heads; the two body shapes are drawn once in <defs>
   (coloured through currentColor) and reused */
const crowdDefs = '<g id="' + PF + '-cw"><path d="M-4.6 -30 Q0 -31.4 4.6 -30 Q6.4 -14 5.6 -1 Q0 0 -5.6 -1 Q-6.4 -14 -4.6 -30 Z" fill="currentColor"/><path d="M0 -31 Q4 -31 4.6 -30 Q6.4 -14 5.6 -1 L2 -.6 Z" fill="#000" opacity=".14"/><path d="M-4.6 -29 Q-7 -22 -6.4 -16 M4.6 -29 Q7 -22 6.4 -16" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/></g>' +
  '<g id="' + PF + '-cm"><path d="M-4.6 -30 Q0 -31.4 4.6 -30 Q9 -18 10 -3 Q0 -1 -10 -3 Q-9 -18 -4.6 -30 Z" fill="currentColor"/><path d="M0 -31 Q4 -31 4.6 -30 Q9 -18 10 -3 L2 -1.4 Z" fill="#000" opacity=".14"/><path d="M-4.6 -29 Q-7 -22 -6.4 -16 M4.6 -29 Q7 -22 6.4 -16" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M-2 -30.6 L0 -26 L2 -30.6" stroke="#fff" stroke-opacity=".5" stroke-width=".6" fill="none"/></g>';
const crowd = (x0, x1, y, step = 8.4, k0 = 0) => { const C = ['#2F6B9A', '#AD1457', '#F4EBD0', '#2E7D32', '#6A4C93', '#EF6C00', '#FFFFFF', '#00897B', '#C62828', '#8D6E63'];
  let s = ''; let k = k0; for (let x = x0; x <= x1; x += step, k++) { const c = C[k % C.length], c2 = C[(k + 4) % C.length], sk = SKIN[k % 6], yy = y + (k % 3) * 1.6, w = k % 2;
    s += '<g transform="translate(' + n2(x + (k % 4)) + ' ' + n2(yy) + ') scale(.42)"><use href="#' + PF + (w ? '-cw' : '-cm') + '" color="' + c + '"/>' +
      (w ? '<path d="M-5.6 -14 Q0 -13 5.6 -14" stroke="' + c2 + '" stroke-width="1.6"/>' : '') +
      '<use href="#' + PF + '-hd" color="' + sk + '"/>' + '<use href="#' + PF + (w ? '-kt" color="' + c2 : '-hu" color="' + (k % 3 ? '#fff' : c2)) + '"/>' +
      (k % 3 === 0 ? (w ? headLoad('basin', '#F4F1EA', '#1F5FA8') : headLoad('sack')) : '') + '</g>'; }
  return s; };
const keke = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy=".4" rx="17" ry="1.8" fill="#2A1C10" opacity=".25"/>' +
  '<path d="M-14 -6 Q-15 -20 -10 -24 L8 -25 Q14 -25 15 -18 L16 -6 Z" fill="#F2C230"/><path d="M-14 -6 L16 -6 L15.6 -10 L-14.4 -10 Z" fill="#2E7D32"/>' +
  '<path d="M-12 -24.6 Q-12 -29 -6 -29 L10 -29 Q14 -29 14 -25 Z" fill="#1F1F1F"/><path d="M-10.6 -21 L-2 -21.6 L-2 -11.6 L-11.6 -11.6 Q-12 -17 -10.6 -21 Z" fill="#2A2A2A" opacity=".85"/>' +
  '<path d="M0 -21.6 L9 -22 Q12.4 -22 13 -18 L13.4 -11.6 L0 -11.6 Z" fill="#9FC6D8" opacity=".75"/><path d="M5 -21.6 L4.4 -11.6" stroke="#5A6A70" stroke-width=".6"/>' +
  '<path d="M15 -16 L18 -15.4 L18.2 -9 L15.8 -8" fill="#F2C230"/><circle cx="17.6" cy="-13" r="1.1" fill="#FFF6C8"/><path d="M-14.6 -8 h-2 v2 h2" fill="#C62828"/>' +
  '<circle cx="-9" cy="-3" r="3.2" fill="#1A1A1A"/><circle cx="-9" cy="-3" r="1.3" fill="#9A9A9A"/><circle cx="12" cy="-3" r="3.2" fill="#1A1A1A"/><circle cx="12" cy="-3" r="1.3" fill="#9A9A9A"/>' +
  '<path d="M-6 -24 Q2 -24.8 10 -24.4" stroke="#fff" stroke-opacity=".25" stroke-width=".6" fill="none"/></g>';
const barrow = (sacks) => '<g><path d="M4 -8 L16 -9 L22 -16 L2 -15 Z" fill="#6E7E86"/><path d="M2 -15 L22 -16 L21.4 -14.6 L2.6 -13.6 Z" fill="#8E9EA6"/><path d="M4 -8 L16 -9 L19 -12.6 L3.6 -11.6 Z" fill="#000" opacity=".15"/>' +
  sacks + '<path d="M-6 -14.6 L18 -8.4 M6 -8.2 L5 -.8 M15 -9 L16 -2" stroke="#5E3A1C" stroke-width=".9" stroke-linecap="round"/>' +
  '<circle cx="19" cy="-3.6" r="3.6" fill="#1A1A1A"/><circle cx="19" cy="-3.6" r="1.4" fill="#8A8A8A"/></g>';

export function kasuwaScene(): string {
  const sky = '<rect width="320" height="200" fill="' + U('sky') + '"/><circle cx="50" cy="16" r="30" fill="' + U('sun') + '"/><circle cx="50" cy="16" r="7" fill="#FFF8DC"/>' +
    '<g class="x-cloud"><g fill="#fff" opacity=".85" transform="translate(70 30)"><ellipse rx="16" ry="3.6"/><ellipse cx="8" cy="-2" rx="9" ry="4.2"/><ellipse cx="-6" cy="-1.4" rx="7" ry="3.2"/></g></g>' +
    '<g class="x-cloud x-c2"><g fill="#fff" opacity=".7" transform="translate(196 22)"><ellipse rx="13" ry="3"/><ellipse cx="6" cy="-1.8" rx="7" ry="3.4"/></g></g>';
  // the town behind: red-earth houses, the minaret and its dome, trees
  const town = '<g opacity=".8">' + house(0, 58, 26, 14, '#D49A68', '#B9784A') + house(30, 58, 18, 10, '#CF9160', '#B9784A') + house(92, 58, 22, 12, '#D49A68', '#B9784A') + house(150, 58, 20, 9, '#CF9160', '#B9784A') +
    house(176, 58, 24, 13, '#D49A68', '#B9784A') + house(280, 58, 28, 12, '#D49A68', '#B9784A') + '</g>' +
    neem(60, 58, 1.2) + neem(130, 58, .9) + dum(306, 58, 1.1) + dum(14, 56, .9) +
    '<g transform="translate(236 58)"><path d="M-14 0 V-10 H20 V0 Z" fill="#EADBC0"/><path d="M8 -10 a9 8 0 0 1 0 0 Z"/><path d="M-6 -10 Q3 -24 12 -10 Z" fill="#3E8E6A"/><path d="M3 -22 v-3" stroke="#C9A227" stroke-width=".6"/>' +
    '<path d="M-12 -10 L-11 -40 H-5 L-4 -10 Z" fill="#F1E6D0"/><path d="M-8 -10 L-7.6 -40 H-5 L-4 -10 Z" fill="#000" opacity=".08"/><path d="M-13 -40 H-3 V-42 H-13 Z" fill="#D9C8A8"/><path d="M-11.6 -42 L-11.2 -50 H-4.8 L-4.4 -42 Z" fill="#F1E6D0"/>' +
    '<path d="M-12 -50 Q-8 -57 -4 -50 Z" fill="#3E8E6A"/><path d="M-8 -55 v-3" stroke="#C9A227" stroke-width=".5"/><circle cx="-8" cy="-59" r=".9" fill="none" stroke="#C9A227" stroke-width=".4"/>' +
    '<path d="M-9 -34 v-3 a1 1 0 0 1 2 0 v3 Z M-9 -26 v-3 a1 1 0 0 1 2 0 v3 Z M-9 -46 v-2 a1 1 0 0 1 2 0 v2 Z" fill="#7A6A50"/><path d="M-6 0 v-5 a3 3 0 0 1 6 0 v5 Z M6 0 v-5 a3 3 0 0 1 6 0 v5 Z" fill="#8A6A40" opacity=".7"/></g>';
  // the stall rows: zinc roofs, goods and cloth, coloured umbrellas in between
  const stalls = shed(4, 80, 30, heaps(7, 73, ['#C9301F', '#E8A21E', '#8E3A6A', '#C9301F', '#D7261E']), cloth(7, 60, ['#AD1457', '#FFB300', '#2F6B9A', '#2E7D32', '#6A4C93', '#EF6C00', '#00897B', '#C62828'])) +
    shed(40, 80, 28, heaps(43, 73, ['#E8D9A8', '#F2C230', '#9C6B3A', '#E8D9A8', '#C98E3A']), '') +
    shed(74, 80, 26, heaps(76, 73, ['#2E7D32', '#5E9A3A', '#C9301F', '#E8A21E', '#2E7D32']), cloth(77, 60, ['#2F6B9A', '#FFFFFF', '#AD1457', '#FFB300', '#2E7D32', '#6A4C93', '#C62828'])) +
    umbrella(118, 80, 11, ['#D7261E', '#F2C230', '#D7261E', '#F2C230', '#D7261E']) + umbrella(146, 79, 12, ['#2E7D32', '#fff', '#2E7D32', '#fff', '#2E7D32', '#fff']) +
    umbrella(174, 80, 11, ['#1F5FA8', '#F2C230', '#D7261E', '#2E7D32', '#1F5FA8']) + umbrella(202, 80, 10, ['#EF6C00', '#fff', '#EF6C00', '#fff', '#EF6C00']) +
    '<path d="M108 80 h80 v-6 h-80 Z" fill="#8B5A2B" opacity=".6"/>' + heaps(110, 74, ['#C9301F', '#E8A21E', '#C9301F', '#8E3A6A', '#F2C230', '#C9301F', '#2E7D32', '#E8A21E', '#C9301F', '#8E3A6A', '#E8D9A8', '#C9301F', '#F2C230', '#C9301F', '#8E3A6A', '#E8A21E', '#C9301F']) +
    shed(222, 80, 28, heaps(225, 73, ['#F2C230', '#C9301F', '#E8D9A8', '#9C6B3A', '#C9301F']), cloth(225, 60, ['#C62828', '#FFB300', '#00897B', '#AD1457', '#2F6B9A', '#FFFFFF', '#6A4C93', '#2E7D32'])) +
    shed(256, 80, 30, heaps(259, 73, ['#8E3A6A', '#A84B7C', '#C9301F', '#E8A21E', '#8E3A6A', '#C9301F']), '') +
    shed(290, 80, 30, heaps(293, 73, ['#E8D9A8', '#C98E3A', '#F2C230', '#C9301F', '#2E7D32', '#E8A21E']), cloth(293, 60, ['#2E7D32', '#F2C230', '#AD1457', '#1F5FA8', '#FFFFFF', '#EF6C00', '#6A4C93', '#C62828']));
  const ground = '<path d="M0 80 H320 V200 H0 Z" fill="' + U('gr') + '"/><path d="M0 84 Q160 80 320 84 V88 Q160 84 0 88 Z" fill="#B98A50" opacity=".25"/>' +
    '<path d="M60 200 Q96 150 130 126 Q160 104 190 126 Q226 150 262 200 Z" fill="#F1DDB2" opacity=".3"/><ellipse cx="160" cy="150" rx="70" ry="30" fill="#F1DDB2" opacity=".18"/>' +
    '<g fill="#A57A44" opacity=".35"><ellipse cx="40" cy="120" rx="14" ry="1"/><ellipse cx="280" cy="128" rx="16" ry="1"/><ellipse cx="120" cy="150" rx="10" ry=".8"/><ellipse cx="210" cy="170" rx="14" ry="1"/><circle cx="96" cy="132" r=".8"/><circle cx="230" cy="114" r=".7"/><circle cx="150" cy="186" r=".9"/><circle cx="60" cy="176" r=".8"/></g>' +
    '<path d="M100 196 Q112 186 130 184 M220 192 Q236 182 254 182" stroke="#A57A44" stroke-opacity=".3" stroke-width=".8" fill="none"/>' +
    // sand ripples, and the near ground a little darker (Sani 2026-10-27, realism)
    '<rect x="0" y="98" width="320" height="102" fill="url(#' + PF + '-rip)" opacity=".5"/><rect x="0" y="80" width="320" height="120" fill="' + U('near') + '"/>';
  const far = crowd(2, 316, 86.6, 10.4);
  // the mai kosai under her shade on the left: a seated woman frying, a tray of golden kosai, smoke rising
  const kosai = '<g><path d="M2 118 V94 M40 118 V94" stroke="#6B4A2E" stroke-width="1.3"/><path d="M-2 95 L4 89 H44 L40 95 Z" fill="#B9A06A"/><path d="M-2 95 L4 89 H44 L40 95 Z" fill="none" stroke="#8E7A4A" stroke-width=".4"/>' +
    '<path d="M0 95 h40 l-1 1.6 h-38 Z" fill="#000" opacity=".2"/><path d="M6 89.6 l-1.4 5 M12 89.6 l-1.4 5 M18 89.6 l-1.4 5 M24 89.6 l-1.4 5 M30 89.6 l-1.4 5 M36 89.6 l-1.4 5" stroke="#8E7A4A" stroke-width=".35"/>' +
    '<g class="x-smoke"><circle cx="28" cy="102" r="3" fill="#E8E2D8" opacity=".55"/><circle cx="30" cy="96" r="4" fill="#E8E2D8" opacity=".4"/><circle cx="27" cy="89" r="5" fill="#E8E2D8" opacity=".25"/></g>' +
    '<path d="M22 118 l1.4 -3 h1.6 l1 3 M31 118 l1 -3 h1.6 l1.4 3" fill="#6B6B6B"/><path d="M23.6 115.6 Q29 113 34.4 115.6" stroke="#FF8A2B" stroke-width="1.6" fill="none" opacity=".8"/>' +
    '<path d="M21 110 Q21 116 29 116 Q37 116 37 110 Z" fill="#2A2A2A"/><ellipse cx="29" cy="110" rx="8" ry="1.4" fill="#C98E3A"/><g fill="#D9A04A"><circle cx="26" cy="109.8" r="1"/><circle cx="29.4" cy="110.2" r="1"/><circle cx="32.4" cy="109.6" r="1"/></g>' +
    '<path d="M36 118 v-6 M48 118 v-6" stroke="#5E3A1C" stroke-width=".8"/><path d="M35 112 h14 v-1.4 h-14 Z" fill="#8B5A2B"/><ellipse cx="42" cy="110" rx="6" ry="1.2" fill="#C69A5A"/><g fill="#C98E3A">' + [38.6, 41, 43.4, 45.8, 40, 42.4, 44.8].map((x, i) => '<circle cx="' + x + '" cy="' + (i > 3 ? 107.8 : 109.4) + '" r="1.15"/>').join('') + '</g></g>' +
    person({ x: 13, y: 119, s: .82, kind: 'woman', seat: true, sk: SKIN[1], top: '#6A4C93', wrap: '#6A4C93', wrap2: '#F2C230', trim: '#F2C230', cap: 'kallabi', capc: '#F2C230', capc2: '#6A4C93', al: 'lap', ar: 'out', cls: 'x-cl',
      hr: '<path d="M-7.6 8 L-4 3.4" stroke="#8B5A2B" stroke-width=".7"/><ellipse cx="-3.6" cy="3" rx="1.6" ry=".9" fill="#5E3A1C"/>', stool: '<path d="M-5 -6 h10 v1.4 h-10 Z M-4 -4.6 v4.6 M4 -4.6 v4.6" fill="#8B5A2B" stroke="#6B4022" stroke-width=".8"/>' });
  // the mai baro pushing his wheelbarrow of onions and sacks
  const baro = '<g transform="translate(44 150)"><g class="x-baro">' + person({ x: 0, y: 0, s: .95, kind: 'jal', sk: SKIN[2], robe: '#E9E2CF', trim: '#9C8458', cap: 'zanna', capc: '#7A1F2B', capc2: '#E9C46A', al: 'down', ar: 'down', acl: 'x-ab', acr: 'x-ab', flip: false }) +
    '<g transform="translate(13.2 0) scale(1.1)">' + barrow('<path d="M5 -15.4 Q4 -21 9 -21.4 Q12 -22 12.6 -16 Z" fill="#D8C49A"/><path d="M12 -15.6 Q12 -21.4 17 -21 Q21 -20 20.4 -16 Z" fill="#CDB888"/>' + onions(12, -21.4, 5, 4)) + '</g></g></g>';
  // the tomato seller in the front corner, her calabashes and basins, her daughter beside her
  const seller = person({ x: 5, y: 176, s: .74, child: true, kind: 'girl', sk: SKIN[4], robe: '#F2C230', trim: '#C62828', cap: 'hijab', capc: '#C62828', al: 'down', ar: 'down', cls: 'x-hop x-up', flip: false }) +
    person({ x: 22, y: 186, s: 1.15, kind: 'woman', seat: true, sk: SKIN[0], top: '#C2185B', wrap: '#00897B', wrap2: '#FFD54A', trim: '#FFD54A', cap: 'kallabi', capc: '#00897B', capc2: '#FFD54A', al: 'lap', ar: 'front', cls: 'x-cl x-nod',
      stool: '<path d="M-6 -6.4 h12 v1.6 h-12 Z M-5 -4.8 v4.8 M5 -4.8 v4.8" fill="#8B5A2B" stroke="#6B4022" stroke-width=".9"/>' }) +
    '<path d="M28 189 L96 189 L100 178 L32 178 Z" fill="#C9A15E"/><path d="M30 186 H98 M31 183 H99 M32 180 H99" stroke="#9C7A3E" stroke-width=".35"/>' +
    kwarya(42, 186, 6.6, tomatoes(42, 182.6, 6)) + kwano(58, 186, 6, '#F4F1EA', '#1F5FA8', peppers(58, 182.8, 5.4)) + kwarya(74, 186, 6, onions(74, 183, 6)) + kwano(89, 186, 5.4, '#E8F0E6', '#C62828', tomatoes(89, 183, 5)) +
    kwarya(50, 179.6, 4.4, peppers(50, 177, 4)) + kwano(66, 179.6, 4.2, '#FFF4D8', '#2E7D32', tomatoes(66, 177, 3.8, 5)) + kwarya(82, 179.6, 4.2, tomatoes(82, 177, 3.8, 5));
  // the right side: keke napep, the pepper and onion sellers, a man carrying a sack, the donkey
  const right = keke(298, 128, 1) +
    person({ x: 262, y: 132, s: .9, kind: 'woman', sk: SKIN[3], top: '#2F6B9A', wrap: '#2F6B9A', wrap2: '#F4EBD0', trim: '#F4EBD0', cap: 'mayafi', capc: '#E9C46A', al: 'head', ar: 'down', load: headLoad('basin', '#F4F1EA', '#C62828'), acl: 'x-ah', flip: true, cls: 'x-nod' }) +
    person({ x: 300, y: 166, s: 1, kind: 'man', sk: SKIN[5], robe: '#3E5C8A', robe2: '#E9E2CF', trim: '#E8D9A8', cap: 'borno', capc: '#F2E8CF', capc2: '#A3242C', capc3: '#1E5B3A', beard: '#2A1A10', al: 'down', ar: 'hip', cls: 'x-cl', flip: true }) +
    donkey(240, 192, .95, true) +
    person({ x: 288, y: 194, s: 1.05, kind: 'woman', seat: true, sk: SKIN[2], top: '#EF6C00', wrap: '#AD1457', wrap2: '#FFD54A', trim: '#FFD54A', cap: 'kallabi', capc: '#AD1457', capc2: '#FFD54A', al: 'front', ar: 'lap', cls: 'x-cl', flip: true,
      stool: '<path d="M-6 -6.4 h12 v1.6 h-12 Z M-5 -4.8 v4.8 M5 -4.8 v4.8" fill="#8B5A2B" stroke="#6B4022" stroke-width=".9"/>' }) +
    kwano(268, 196, 5.4, '#F4F1EA', '#1F5FA8', onions(268, 193, 6)) + kwarya(312, 196, 5, peppers(312, 193, 4.6));
  // people crossing the back of the square, and the animals
  const mid = person({ x: 64, y: 106, s: .66, kind: 'woman', sk: SKIN[5], top: '#AD1457', wrap: '#AD1457', wrap2: '#FFD54A', trim: '#FFD54A', cap: 'kallabi', capc: '#FFD54A', capc2: '#AD1457', al: 'head', ar: 'down', acl: 'x-ah', load: headLoad('tray'), cls: 'x-walk' }) +
    person({ x: 84, y: 101, s: .64, kind: 'man', sk: SKIN[3], robe: '#F4F1EA', robe2: '#E0D8C4', trim: '#8EA8C8', cap: 'turban', capc: '#F4F1EA', beard: '#E8E4DC', al: 'down', ar: 'down', cls: 'x-nod' }) +
    person({ x: 236, y: 104, s: .64, kind: 'jal', sk: SKIN[0], robe: '#5E9A3A', trim: '#E8D9A8', cap: 'zanna', capc: '#1F2E5A', capc2: '#D9B36A', capside: -1, al: 'head', ar: 'down', acl: 'x-ah', load: headLoad('sack'), flip: true }) +
    person({ x: 220, y: 101, s: .6, kind: 'boy', child: true, sk: SKIN[4], robe: '#1F5FA8', robe2: '#E9E2CF', trim: '#fff', cap: 'hula', capc: '#fff', capc2: '#1F5FA8', cls: 'x-up x-hop' }) +
    goat(128, 196, .9, '#F2EDE4', '#5A3A22', false, 'x-gr') + goat(196, 194, .8, '#4A3A30', '#2A1E16', true) + chicken(156, 192, .9, '#B5652E', false, 'x-pk') + chicken(168, 196, .8, '#F2EDE4', true, 'x-pk x-pk2') + chicken(112, 112, .7, '#2A2A2A', false);
  return '<svg class="scene ' + PF + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('sky', '#7EC3E8', '#B8E0F0', '#F6EBCF') + lg('gr', '#E4C795', '#D7B27A', '#C99E64') + lg('haze', 'rgba(232,240,246,0)', 'rgba(232,240,246,.36)', 'rgba(232,240,246,0)') + lg('near', 'rgba(120,80,40,0)', 'rgba(120,80,40,0)', 'rgba(110,70,32,.2)') +
    '<pattern id="' + PF + '-rip" width="14" height="5" patternUnits="userSpaceOnUse"><path d="M0 3 Q3.5 1.6 7 3 T14 3" stroke="#B48A52" stroke-width=".35" fill="none" opacity=".6"/><path d="M2 4.6 Q5 3.6 8 4.6" stroke="#F2DDB4" stroke-width=".3" fill="none" opacity=".7"/><circle cx="11" cy="1" r=".22" fill="#9A7444"/></pattern>' +
    '' + '<pattern id="' + PF + '-zinc" width="2.2" height="6" patternUnits="userSpaceOnUse" patternTransform="skewX(-15)"><rect width="2.2" height="6" fill="#AEB7BC"/><rect width=".4" height="6" fill="#7E888E"/><rect x=".5" width=".5" height="6" fill="#C8D0D4"/></pattern>' + crowdDefs + headDef + clothesDef() + loadDefs() + '<radialGradient id="' + PF + '-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8DC"/><stop offset=".4" stop-color="#FFF1B8" stop-opacity=".6"/><stop offset="1" stop-color="#FFF1B8" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-sh" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient></defs>' +
    sky + town + stalls + ground + '<rect x="0" y="36" width="320" height="62" fill="' + U('haze') + '"/>' + far + mid + kosai + baro + right + seller + '</svg>';
}

/* the parts, shared with Dillalin kasuwa's square (sc-dillali.ts): same people, animals and market things, same faces */
export const KW = { person, goat, chicken, donkey, keke, barrow, kwarya, kwano, tomatoes, peppers, onions, headLoad, crowd, shed, heaps, cloth, umbrella, house, neem, dum, SKIN, U, lg,
  defs: () => crowdDefs + headDef + clothesDef() + loadDefs() };
