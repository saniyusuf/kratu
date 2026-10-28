// @ts-nocheck
import { arewaCap } from './capsArewa';
/*
 * Mai suya, drawn (Sani 2026-10-25: "a roadside suya spot at night, the same quality as Hawan Sallah"). 320×200,
 * sliced to fill any landscape screen. Behind: a northern street after Isha, flat-roofed houses with zanko horns, a
 * minaret and a crescent moon, shop fronts under zinc awnings (one kiosk still lit), a string of bulbs on poles.
 * The game's grill and suya man stand on the left, so the scene gives them a kerosene lantern on its post, the smoke
 * rising over them and the generator humming in the corner. Right of Laila: the helper on a low stool fanning a
 * brazier of coals, bowls of onions, tomatoes and yaji on a small table, customers waiting on a wooden bench (two men
 * in babban riga and hula / rawani, a woman in mayafi, a boy), and an okada parked in front with its headlight on.
 *
 * Moving parts (sc-suya.css animates transform and opacity only):
 *   .x-p a person (hop) · .x-h a head (shake, nod) · .x-a an arm (clap, raise). Faces live in one shared <defs>
 *   head and switch through custom properties set by the CSS: --eo/--eh (open or happy eyes), --ms/--mf (smile or frown)
 *   extra person classes: .x-cl claps on cheer · .x-up raises both arms · .x-hop jumps · .x-nod nods
 */
const PF = 'sy4';
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

/* ---------------- the street at night ---------------- */
/* the parapet of a Hausa house (round five): a tall curved zanko horn at each corner and small rounded crenels between,
   one path per wall instead of a row of triangles */
const zanko = (x0, x1, y, c) => { let d = 'M' + x0 + ' ' + (y + .4) + 'Q' + n1(x0 - .4) + ' ' + n1(y - 3) + ' ' + n1(x0 - 1.2) + ' ' + n1(y - 5.6) + 'Q' + n1(x0 + 1.6) + ' ' + n1(y - 3.4) + ' ' + n1(x0 + 2.8) + ' ' + y;
  for (let x = x0 + 6; x < x1 - 5; x += 6) d += 'L' + n1(x - 1.2) + ' ' + y + 'Q' + n1(x - 1) + ' ' + n1(y - 1.9) + ' ' + x + ' ' + n1(y - 2) + 'Q' + n1(x + 1) + ' ' + n1(y - 1.9) + ' ' + n1(x + 1.2) + ' ' + y;
  d += 'L' + n1(x1 - .8) + ' ' + y + 'Q' + n1(x1 + .4) + ' ' + n1(y - 3.4) + ' ' + n1(x1 + 3.2) + ' ' + n1(y - 5.6) + 'Q' + n1(x1 + 2.4) + ' ' + n1(y - 3) + ' ' + n1(x1 + 2) + ' ' + (y + .4) + 'Z';
  return '<path d="' + d + '" fill="' + c + '"/>'; };
const stars = (n) => { let d = ''; for (let i = 0; i < n; i++) { const r = i % 4 ? .45 : .8, x = n1((i * 47.3 + 11) % 320 - r), y = n1(4 + (i * 17.9) % 52); d += 'M' + x + ' ' + y + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0'; } return '<path d="' + d + '"/>'; };
/* a shop front: a painted block, a zinc awning on two posts, a lit kiosk or a closed shutter */
const shop = (x, w, c, lit, goods = '') => '<path d="M' + x + ' 118 V76 H' + (x + w) + ' V118 Z" fill="' + c + '"/><path d="M' + (x + w * .78) + ' 118 V76 H' + (x + w) + ' V118 Z" fill="#000" opacity=".18"/>' + zanko(x, x + w - 2, 76, c) +
  (lit ? '<path d="M' + (x + 4) + ' 118 V94 H' + (x + w - 4) + ' V118 Z" fill="' + U('kiosk') + '"/>' + goods + '<path d="M' + (x + 4) + ' 118 L' + (x - 10) + ' 132 H' + (x + w + 10) + ' L' + (x + w - 4) + ' 118 Z" fill="#FFC870" opacity=".14"/>'
    : '<path d="M' + (x + 4) + ' 118 V94 H' + (x + w - 4) + ' V118 Z" fill="' + U('shut') + '"/><path d="M' + (x + w / 2) + ' 112 v4" stroke="#1A1420" stroke-width=".8"/>') +
  '<path d="M' + (x - 3) + ' 92 L' + x + ' 85 H' + (x + w) + ' L' + (x + w + 3) + ' 92 Z" fill="' + U('zinc') + '"/><path d="M' + (x - 3) + ' 92 H' + (x + w + 3) + '" stroke="#3A3A44" stroke-width=".6"/>' +
  '<path d="M' + (x - 1) + ' 118 V92 M' + (x + w + 1) + ' 118 V92" stroke="#3A2A22" stroke-width="1"/>';
/* the kiosk's shelves (round five): the goods are one tile shared by every shelf — tins with a lit rim, packets, a bottle
   or two, three rows of six — laid over the shelf boards, instead of fifty-four little rectangles */
let shelfN = 0;
const shelves = (x, y) => { const id = PF + '-gd' + (shelfN++);
  return '<pattern id="' + id + '" href="#' + PF + '-goods" x="' + (x + 1) + '" y="' + n1(y - 3.4) + '"/><rect x="' + (x + 1) + '" y="' + n1(y - 3.4) + '" width="17.4" height="15.4" fill="url(#' + id + ')"/>' +
    '<path d="M' + x + ' ' + y + ' h18 M' + x + ' ' + (y + 6) + ' h18 M' + x + ' ' + (y + 12) + ' h18" stroke="#6B4A2E" stroke-width=".7"/>'; };
const goodsTile = () => { const C = ['#E8A21E', '#C62828', '#2E7D32', '#1F5FA8', '#F4F1EA', '#AD1457'], by = {}; let hl = '', tops = '';
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const c = C[(i + r * 2) % 6], x = n1(i * 2.9), y0 = r * 6, kind = (i * 5 + r * 3) % 4;
    // a tin, a tall packet, a bottle, a short box
    by[c] = (by[c] || '') + (kind === 2 ? 'M' + n1(x + .6) + ' ' + (y0 + 3.4) + 'v-2Q' + n1(x + .6) + ' ' + (y0 + .9) + ' ' + n1(x + .95) + ' ' + (y0 + .6) + 'v-.6h.5v.6Q' + n1(x + 1.8) + ' ' + (y0 + .9) + ' ' + n1(x + 1.8) + ' ' + (y0 + 1.4) + 'v2Z'
      : 'M' + x + ' ' + (y0 + 3.4) + 'V' + n1(y0 + [0.6, 0, 0, 1.4][kind]) + 'h2.2V' + (y0 + 3.4) + 'Z');
    if (kind === 0) tops += 'M' + x + ' ' + n1(y0 + .9) + 'h2.2';
    hl += 'M' + n1(x + .4) + ' ' + n1(y0 + [1, .4, 1.4, 1.8][kind]) + 'v1.6'; }
  return '<pattern id="' + PF + '-goods" width="17.4" height="18" patternUnits="userSpaceOnUse">' + Object.keys(by).map((c) => '<path d="' + by[c] + '" fill="' + c + '"/>').join('') +
    '<path d="' + tops + '" stroke="#C9CCD2" stroke-width=".35"/><path d="' + hl + '" stroke="#fff" stroke-opacity=".45" stroke-width=".35"/></pattern>'; };
const bulbs = (cls, pts) => '<g class="' + cls + '">' + pts.map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + U('glow') + '"/>').join('') + '</g>';
/* an okada parked on the street (round five, Sani 2026-10-27: realism): the everyday 100 cc bike of the north, facing
   left, its headlamp lit, spoked wheels on fat tyres, the red tank and side panels, the long black seat, the chrome
   exhaust running back under it, the bulbs' light on the tank and the seat */
const okada = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="1" cy=".4" rx="17" ry="1.8" fill="#000" opacity=".4"/>' +
  '<ellipse cx="-22" cy=".2" rx="9" ry="1.6" fill="#FFF6C8" opacity=".12"/>' +
  '<circle cx="-11" cy="-5" r="5.2" fill="#121212"/><circle cx="11" cy="-5" r="5.2" fill="#121212"/>' +
  '<path d="M-14.6 -5 a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0 -7.2 0 M7.4 -5 a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0 -7.2 0" stroke="#A9AAB2" stroke-width=".55" fill="none"/>' +
  '<path d="M-11 -8.6 V-1.4 M-14.1 -6.8 L-7.9 -3.2 M-14.1 -3.2 L-7.9 -6.8 M11 -8.6 V-1.4 M7.9 -6.8 L14.1 -3.2 M7.9 -3.2 L14.1 -6.8" stroke="#7A7B84" stroke-width=".25"/>' +
  '<path d="M-11.9 -5 a.9 .9 0 1 0 1.8 0a.9 .9 0 1 0 -1.8 0 M10.1 -5 a.9 .9 0 1 0 1.8 0a.9 .9 0 1 0 -1.8 0" fill="#C9CAD0"/>' +
  '<path d="M-11 -5 L-8.2 -16.4" stroke="#B8BAC2" stroke-width="1.3" stroke-linecap="round"/>' +
  '<path d="M-15.6 -8.6 Q-11 -12.4 -6.6 -8.8 L-7.6 -8.2 Q-11 -10.8 -14.6 -8.2Z M7 -9.6 Q11.6 -13.2 16 -9 L15 -8.4 Q11.6 -11.4 8 -8.8Z" fill="#9E1818"/>' +
  '<path d="M-4.6 -6.6 Q-5 -10.6 -1.4 -11 L3.4 -10.8 Q5.4 -9 4.2 -6.4 Q0 -5 -4.6 -6.6Z" fill="#33343A"/><path d="M-3.8 -9.6 h7 M-3.6 -8.2 h7" stroke="#55565E" stroke-width=".4"/>' +
  '<path d="M-2 -6.4 Q3 -5.4 9 -6.2 L13.6 -7.4" stroke="#D8DAE0" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M9.4 -7.6 l5.4 -.9 l.4 1.6 l-5.4 .8Z" fill="#C2C4CA"/>' +
  '<path d="M-8.8 -13 L-6.4 -10.6 L4 -10.4 L8.6 -11.6 L13 -13 L12.6 -10.4 L4.6 -8.8 L-5.6 -9Z" fill="#7E1414"/>' +
  '<path d="M-8.4 -14.2 Q-7.6 -17.6 -3.4 -17.4 L1.4 -16.6 Q2.8 -14 1.2 -12.4 L-6.6 -12.2 Q-8.6 -12.6 -8.4 -14.2Z" fill="#C21E1E"/><path d="M-7.2 -15.6 Q-4.4 -17 -.4 -16.2" stroke="#FFD9A0" stroke-opacity=".55" stroke-width=".7" fill="none" stroke-linecap="round"/>' +
  '<path d="M.6 -16.8 Q7 -17.8 13.2 -15.8 Q13.8 -14.6 13 -14 Q7 -15 1.4 -14.6Z" fill="#17171A"/><path d="M2 -16.6 Q7 -17.4 12.4 -15.8" stroke="#5A5A62" stroke-width=".35" fill="none"/>' +
  '<path d="M9 -14.2 L13.2 -14.4 L14.6 -11.4 L12.6 -10.6Z" fill="#B71C1C"/><circle cx="14.8" cy="-12.4" r=".75" fill="#FF3A2A"/>' +
  '<path d="M-8.4 -16.6 L-9.4 -21.2 M-11.6 -21.6 L-6.8 -20.8 M-10.6 -21.4 L-11.4 -24" stroke="#2A2A2E" stroke-width=".8" stroke-linecap="round"/><ellipse cx="-11.6" cy="-24.4" rx=".9" ry=".6" fill="#8A8C94"/>' +
  '<path d="M-12.8 -16.8 Q-13.8 -18.8 -11.6 -19.8 L-9 -19.2 L-9.4 -16Z" fill="#26272C"/><ellipse cx="-13.2" cy="-17.6" rx="1" ry="1.5" fill="#FFF6C8"/><ellipse cx="-13.6" cy="-17.6" rx="2.6" ry="2.6" fill="#FFF6C8" opacity=".18"/></g>';
const generator = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy=".4" rx="11" ry="1.4" fill="#000" opacity=".35"/><g class="x-gen">' +
  '<path d="M-9 0 V-12 H9 V0" stroke="#1F1F22" stroke-width="1.4" fill="none"/><path d="M-8 -1.4 H8 V-11 H-8 Z" fill="#E8A21E"/><path d="M2 -1.4 H8 V-11 H2 Z" fill="#000" opacity=".18"/>' +
  '<path d="M-6 -11 h8 v-3 h-8 Z" fill="#C62828"/><circle cx="-4" cy="-6" r="2.4" fill="#2A2A2E"/><path d="M-5.6 -6 h3.2 M-4 -7.6 v3.2" stroke="#6A6A70" stroke-width=".4"/><path d="M4 -8 h3 v4 h-3 Z" fill="#2A2A2E"/><path d="M8 -9 h3 v-2" stroke="#3A3A40" stroke-width="1" fill="none"/></g>' +
  '<g class="x-exh" fill="#8A8494"><circle cx="12" cy="-14" r="1.6" opacity=".35"/><circle cx="13.4" cy="-17.6" r="2.2" opacity=".2"/></g>' +
  '<path d="M-9 -4 Q-16 -2 -20 -20 Q-22 -50 -4 -100" stroke="#121016" stroke-width=".6" fill="none"/></g>';
const lantern = (x, y) => '<g transform="translate(' + x + ' ' + y + ')"><circle r="16" fill="' + U('lamp') + '" class="x-lamp"/><path d="M0 -10 V-6" stroke="#2A2420" stroke-width=".5"/><path d="M-2.6 -6 Q0 -9 2.6 -6 Z" fill="#B23A22"/>' +
  '<path d="M-2.6 4 Q-4 0 -2.6 -5.4 H2.6 Q4 0 2.6 4 Z" fill="#FFE7A8" opacity=".7"/><path d="M0 2 Q-1.4 -.4 0 -3.4 Q1.4 -.4 0 2 Z" fill="#FFB02E" class="x-flame"/><path d="M-3.6 4 H3.6 V6 H-3.6 Z" fill="#B23A22"/><path d="M-3.4 -5 Q-5.6 0 -3.4 5 M3.4 -5 Q5.6 0 3.4 5" stroke="#5A2A1A" stroke-width=".5" fill="none"/></g>';
const fan = '<g transform="translate(-6.6 9) rotate(-30)"><path d="M0 0 v-2.4" stroke="#6B4A2E" stroke-width=".7"/><ellipse cy="-5" rx="3.2" ry="3" fill="#D8B26A"/><path d="M-3 -5 h6 M-2.6 -6.6 h5.2 M-2.6 -3.4 h5.2" stroke="#A9843A" stroke-width=".35"/><ellipse cy="-5" rx="3.2" ry="3" fill="none" stroke="#C62828" stroke-width=".4"/></g>';
const brazier = (x, y) => '<g transform="translate(' + x + ' ' + y + ')"><circle cy="-8" r="20" fill="' + U('coal') + '" class="x-coal"/><path d="M-6 0 L-4 -6 M6 0 L4 -6 M0 0 V-6" stroke="#2A2420" stroke-width=".9"/>' +
  '<path d="M-8 -9 Q-8 -4 0 -4 Q8 -4 8 -9 Z" fill="#3A3A40"/><ellipse cy="-9" rx="8" ry="1.6" fill="#2A1A14"/><g fill="#FF7A1A"><circle cx="-4" cy="-9.4" r="1.3"/><circle cx="-.6" cy="-9.8" r="1.4"/><circle cx="3.2" cy="-9.4" r="1.2"/><circle cx="1.6" cy="-8.8" r="1" fill="#FFC23A"/><circle cx="-2.4" cy="-8.8" r=".9" fill="#FFC23A"/></g>' +
  '<path d="M-7 -11 L7 -11.6 M-7 -12.6 L7 -13" stroke="#8A8A90" stroke-width=".4"/><g fill="#7A3A1A"><rect x="-5" y="-12.6" width="2.2" height="1.4" rx=".5"/><rect x="-1.4" y="-12.8" width="2.2" height="1.4" rx=".5"/><rect x="2.2" y="-13" width="2.2" height="1.4" rx=".5"/></g>' +
  '<g class="x-smoke"><circle cx="1" cy="-20" r="3" fill="#B8B0C0" opacity=".35"/><circle cx="-1" cy="-27" r="4" fill="#B8B0C0" opacity=".25"/><circle cx="2" cy="-35" r="5" fill="#B8B0C0" opacity=".15"/></g></g>';

export function suyaScene(): string {
  shelfN = 0;
  const bulbPts = [];
  for (let i = 0; i <= 16; i++) { const x = 8 + i * 19, y = 58 + Math.sin(((x - 8) / 152) * Math.PI) * 0 + (((x - 8) % 152) / 152) * (1 - ((x - 8) % 152) / 152) * 16; bulbPts.push([n1(x), n1(y + 1.6)]); }
  const sky = '<rect width="320" height="200" fill="' + U('sky') + '"/><g class="x-stars" fill="#FFF6DC">' + stars(46) + '</g>' +
    '<circle cx="42" cy="38" r="18" fill="' + U('moon') + '"/><path d="M47 30 a9.4 9.4 0 1 0 0 16.4 a7.6 7.6 0 1 1 0 -16.4 Z" fill="#FFF3C4"/>';
  // the town behind: dark houses with zanko, a few lit windows, the minaret with its green light
  const town = '<g fill="#2B2340">' + '<path d="M0 100 V66 H30 V100 Z M34 100 V72 H62 V100 Z M98 100 V68 H128 V100 Z M190 100 V70 H222 V100 Z M226 100 V64 H262 V100 Z M268 100 V72 H296 V100 Z M298 100 V66 H320 V100 Z"/><path d="M0 100 V66 H30 V100 Z M34 100 V72 H62 V100 Z M98 100 V68 H128 V100 Z M190 100 V70 H222 V100 Z M226 100 V64 H262 V100 Z M268 100 V72 H296 V100 Z M298 100 V66 H320 V100 Z" fill="url(#' + PF + '-mud)" opacity=".5"/>' +
    zanko(0, 28, 66, '#2B2340') + zanko(34, 60, 72, '#2B2340') + zanko(98, 126, 68, '#2B2340') + zanko(190, 220, 70, '#2B2340') + zanko(226, 260, 64, '#2B2340') + zanko(268, 294, 72, '#2B2340') + zanko(298, 318, 66, '#2B2340') + '</g>' +
    '<g fill="#FFC96A" opacity=".75"><rect x="8" y="74" width="3" height="4"/><rect x="104" y="76" width="3" height="4"/><rect x="236" y="72" width="3" height="4"/><rect x="306" y="74" width="3" height="4"/><rect x="200" y="78" width="3" height="4"/></g>' +
    '<g transform="translate(170 100)" fill="#332A4A"><path d="M-16 0 V-14 H22 V0 Z"/><path d="M-4 -14 Q5 -30 14 -14 Z"/><path d="M-13 -14 L-12 -56 H-6 L-5 -14 Z"/><path d="M-14 -56 H-4 V-58.4 H-14 Z"/><path d="M-12.6 -58 L-12.2 -66 H-5.8 L-5.4 -58 Z"/><path d="M-13 -66 Q-9 -73 -5 -66 Z"/>' +
    '<path d="M-9 -72 v-3" stroke="#332A4A" stroke-width=".6"/><circle cx="-9" cy="-76" r="1" fill="none" stroke="#7A6A9A" stroke-width=".4"/><circle cx="-9" cy="-61" r=".9" fill="#5CE08A" class="x-green"/><rect x="-10" y="-46" width="2" height="3" rx="1" fill="#FFC96A" opacity=".6"/></g>';
  const street = '<path d="M0 118 H320 V200 H0 Z" fill="' + U('gr') + '"/><path d="M0 118 H320 V121 H0 Z" fill="#000" opacity=".25"/>' +
    '<ellipse cx="72" cy="150" rx="80" ry="26" fill="' + U('pool') + '"/><ellipse cx="200" cy="146" rx="40" ry="14" fill="' + U('pool') + '"/><ellipse cx="280" cy="140" rx="50" ry="16" fill="' + U('pool') + '" opacity=".7"/>' +
    '<g fill="#4A3A48" opacity=".5"><ellipse cx="150" cy="176" rx="12" ry=".8"/><ellipse cx="110" cy="190" rx="10" ry=".8"/><circle cx="170" cy="190" r=".7"/><circle cx="236" cy="196" r=".8"/></g>';
  const shops = shop(4, 34, '#5A4458', false) + shop(140, 40, '#4E4A62', true, shelves(150, 100)) + shop(186, 30, '#5E4650', false) + shop(222, 44, '#54425E', true, shelves(226, 100) + shelves(244, 100)) + shop(272, 46, '#4E4458', false) +
    '<path d="M44 118 V82 H134 V118 Z" fill="#4A3A4E"/><path d="M44 118 V82 H134 V118 Z" fill="url(#' + PF + '-mud)"/>' + zanko(44, 132, 82, '#4A3A4E') + '<path d="M60 118 V98 a6 6 0 0 1 12 0 V118 Z M100 118 V98 a6 6 0 0 1 12 0 V118 Z" fill="#241C2A"/>';
  // the bulbs on their wire, between poles
  let wire = 'M8 59.6'; for (const [x, y] of bulbPts) wire += ' L' + x + ' ' + y;
  const lights = '<path d="M8 120 V56 M312 120 V56" stroke="#2A2024" stroke-width="1.4"/><path d="' + wire + '" stroke="#141014" stroke-width=".45" fill="none"/>' +
    bulbs('x-bulbs', bulbPts.filter((_, i) => i % 2)) + bulbs('x-bulbs x-b2', bulbPts.filter((_, i) => !(i % 2))) +
    '<path fill="#FFF0B0" d="' + bulbPts.map(([x, y]) => 'M' + n1(x - 1.3) + ' ' + n1(y + 1.2) + 'a1.3 1.3 0 1 0 2.6 0a1.3 1.3 0 1 0 -2.6 0').join('') + '"/>';
  // the grill's smoke, rising behind the game's grill
  const smoke = '<g class="x-smk"><circle cx="70" cy="80" r="7" fill="' + U('puff') + '" opacity="0.66"/><circle cx="64" cy="66" r="9" fill="' + U('puff') + '" opacity="0.48"/><circle cx="72" cy="50" r="11" fill="' + U('puff') + '" opacity="0.3"/></g>' +
    '<g class="x-smk x-s2"><circle cx="104" cy="82" r="6" fill="' + U('puff') + '" opacity="0.6"/><circle cx="110" cy="68" r="8" fill="' + U('puff') + '" opacity="0.42"/><circle cx="104" cy="52" r="10" fill="' + U('puff') + '" opacity="0.27"/></g>';
  const left = lantern(12, 96) + '<path d="M12 86 V80 H8" stroke="#2A2024" stroke-width=".7" fill="none"/>' + generator(12, 186, 1);
  // the helper fanning the coals, the table of onions, tomatoes and yaji
  const helper = brazier(214, 146) +
    person({ x: 198, y: 146, s: .9, kind: 'boy', seat: false, sk: SKIN[2], robe: '#6D8B74', robe2: '#3A3A44', trim: '#E8D9A8', cap: 'hula', capc: '#E8E2D0', capc2: '#5A3A22', al: 'down', ar: 'out', acr: 'x-fan', hr: fan, cls: 'x-nod' }) +
    '<path d="M225 146 V132 M245 146 V132" stroke="#4A3020" stroke-width="1"/><path d="M222 132 h26 v-2 h-26 Z" fill="#7A5232"/><path d="M222 132 h26 v1 h-26 Z" fill="#000" opacity=".25"/>' +
    kwano(227, 130, 4.2, '#F4F1EA', '#1F5FA8', onions(227, 127.4, 5, 4)) + kwarya(236, 130, 4, tomatoes(236, 127.6, 3.8, 5)) +
    '<g transform="translate(244 130)"><path d="M-3.4 -2.4 Q0 -6 3.4 -2.4 Z" fill="#A23A16"/><path d="M-3.6 -2.4 L-2.6 0 H2.6 L3.6 -2.4 Z" fill="#F4F1EA"/><path d="M-3.7 -2.4 H3.7" stroke="#C62828" stroke-width=".5"/><g fill="#6A1E0A"><circle cx="-1" cy="-3.6" r=".3"/><circle cx="1.2" cy="-3.2" r=".3"/><circle cx=".2" cy="-4.4" r=".3"/></g></g>';
  // the customers on the bench
  const bench = '<path d="M244 150 V140 M310 150 V140 M248 150 l-2 -10 M306 150 l2 -10" stroke="#4A3020" stroke-width="1.2"/><path d="M240 138 H316 V141 H240 Z" fill="#8A5A32"/><path d="M240 140 H316 V141 H240 Z" fill="#000" opacity=".3"/>';
  const people = bench +
    person({ x: 256, y: 150, s: 1.05, kind: 'man', seat: true, sk: SKIN[1], robe: '#E9E4D8', robe2: '#D8D0BE', trim: '#8EA8C8', cap: 'borno', capc: '#FFFFFF', capc2: '#1E5B3A', capc3: '#C62828', beard: '#1A120C', al: 'lap', ar: 'lap', cls: 'x-cl' }) +
    person({ x: 275, y: 150, s: 1, kind: 'woman', seat: true, sk: SKIN[4], top: '#7B3F8A', wrap: '#7B3F8A', wrap2: '#F2C230', trim: '#F2C230', cap: 'mayafi', capc: '#C2185B', al: 'lap', ar: 'lap', cls: 'x-cl x-nod' }) +
    person({ x: 294.5, y: 150, s: 1.05, kind: 'man', seat: true, sk: SKIN[3], robe: '#2F5E8A', robe2: '#E9E2CF', trim: '#E8D9A8', cap: 'turban', capc: '#F4F1EA', beard: '#E8E4DC', al: 'lap', ar: 'down', cls: 'x-cl' }) +
    person({ x: 312.5, y: 150, s: .78, child: true, kind: 'boy', sk: SKIN[0], robe: '#C62828', robe2: '#E9E2CF', trim: '#FFD54A', cap: 'hula', capc: '#fff', capc2: '#C62828', al: 'down', ar: 'down', cls: 'x-up x-hop' });
  const front = okada(206, 188, 1.15);
  return '<svg class="scene ' + PF + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('sky', '#0B0D2A', '#1E1A44', '#45305A') + lg('gr', '#3A2C38', '#2A2030', '#1C1622') + lg('kiosk', '#FFE3A0', '#F2A84A') + lg('shut', '#6A6878', '#4A4858') +
    '<pattern id="' + PF + '-zinc" width="2.2" height="6" patternUnits="userSpaceOnUse" patternTransform="skewX(-15)"><rect width="2.2" height="6" fill="#6E7280"/><rect width=".4" height="6" fill="#4E5260"/><rect x=".5" width=".5" height="6" fill="#8A8E9A"/></pattern>' +
    goodsTile() +
    // the mud plaster (round five): smoothed by hand, the strokes of the palm, a crack, the odd darker patch of a repair
    '<pattern id="' + PF + '-mud" width="17" height="11" patternUnits="userSpaceOnUse"><path d="M1 2.4 q3 -1 6 0 M9 7.6 q3 -1.2 6.4 .2 M3 9 q2 -.6 3.6 0" stroke="#fff" stroke-opacity=".07" stroke-width=".7" fill="none"/>' +
    '<path d="M12 1 l.6 1.6 l-.8 1.4 l.4 1.2" stroke="#000" stroke-opacity=".2" stroke-width=".25" fill="none"/><ellipse cx="5" cy="5.6" rx="2.6" ry="1.4" fill="#000" opacity=".08"/></pattern>' +
    '<radialGradient id="' + PF + '-glow"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".8"/><stop offset=".3" stop-color="#FFC96A" stop-opacity=".3"/><stop offset="1" stop-color="#FFC96A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-lamp"><stop offset="0" stop-color="#FFD27A" stop-opacity=".7"/><stop offset="1" stop-color="#FF9A3A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-coal"><stop offset="0" stop-color="#FF8A2A" stop-opacity=".55"/><stop offset="1" stop-color="#FF6A1A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-pool"><stop offset="0" stop-color="#FFB45A" stop-opacity=".28"/><stop offset="1" stop-color="#FFB45A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-puff"><stop offset="0" stop-color="#B4A8C0" stop-opacity=".5"/><stop offset="1" stop-color="#B4A8C0" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-moon"><stop offset=".3" stop-color="#FFF3C4" stop-opacity=".35"/><stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + PF + '-sh" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".18"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>' +
    headDef + clothesDef() + '</defs>' +
    sky + town + shops + street + smoke + lights + left + helper + people + front + '</svg>';
}

/* ---------------- the game's own pieces (Sani 2026-10-27, realism pass) ----------------
 * stand(): the mai suya behind his grill, standing on the street. A welded sheet-metal trough on angle-iron legs, the
 * coals glowing under a row of tsire sticks whose handles stick out over the rim, "SUYA" brushed on its sooty front, a
 * sack of charcoal underneath, a side table with newspaper for wrapping, sliced suya with onions and a bowl of yaji.
 * He is a grown man at street scale (head about 1/7 of his height), in a hula and a worn kaftan with a greasy apron,
 * one hand fanning the coals with a woven mafici, the other turning a stick; the coals light him from below.
 * Everything stands on the ground: his legs and slippers show under the trough, and the legs cast soft shadows.
 * note(n): a naira note held out by the child's own hand from the bottom-right corner (first person). On pay, the
 * note flies to the suya man and the arm drops away (sc-suya.css). Animated parts (transform and opacity only):
 * .sy5-fan, .sy5-coal, .sy5-smk, .sy5-nt, .sy5-arm. */
const Q = 'sy5';
const QU = (id) => 'url(#' + Q + '-' + id + ')';
const qlg = (id, x2, y2, ...c) => '<linearGradient id="' + Q + '-' + id + '" x1="0" y1="0" x2="' + x2 + '" y2="' + y2 + '">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const qrg = (id, c, o0, o1, extra = '') => '<radialGradient id="' + Q + '-' + id + '"' + extra + '><stop offset="0" stop-color="' + c + '" stop-opacity="' + o0 + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="' + o1 + '"/></radialGradient>';
/* a tiny seeded random so the coals and meat look the same every time */
const rnd = (s) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

export function stand(): string {
  const r = rnd(7);
  const SK = '#6B4022', SKD = '#4A2A14', SKL = '#9A5E30';
  // the coal bed, seen from a little above: lumps with glowing cracks
  let coals = '';
  for (let i = 0; i < 46; i++) { const x = n1(34 + r() * 186), y = n1(142.4 + r() * 7.6), w = n1(2.4 + r() * 3);
    coals += '<path d="M' + n1(x - w) + ' ' + y + ' q' + n1(w * .4) + ' -1.8 ' + n1(w) + ' -1.4 q' + n1(w * .7) + ' .2 ' + n1(w) + ' 1.4 q-' + n1(w) + ' 1.2 -' + n1(w * 2) + ' 0 Z" fill="' + (i % 5 ? '#2A1712' : '#3A2018') + '"/>'; }
  // the tsire sticks: lying front to back over the coals, the handles out over the front rim
  let sticks = '';
  for (let i = 0; i < 14; i++) { const x = 40 + i * 13.3 + (r() - .5) * 2, lean = (r() - .5) * 2.4;
    if (Math.abs(x - 149) < 4) continue;   // his hand holds this one (drawn with the hand)
    sticks += stick(x, lean, r); }
  // the man, behind the trough (his lower half shows under it)
  const legs = '<path d="M98.6 192 L97.4 207 L126.6 207 L125.4 192 Z" fill="#CFC4A8"/><path d="M114 192 L126.6 207 L125.4 192 Z" fill="#000" opacity=".12"/>' +
    '<path d="M100.6 206 L100.2 224 H108.6 L109.2 206 Z M114.8 206 L115.4 224 H123.8 L123.4 206 Z" fill="#3A3A42"/><path d="M119 206 L119.6 224 H123.8 L123.4 206 Z" fill="#000" opacity=".2"/>' +
    '<path d="M98.6 228.4 Q98.4 224.6 101.4 224 H109 Q110.4 226 110 228.4 Z M114 228.4 Q113.6 226 115 224 H122.6 Q125.6 224.6 125.4 228.4 Z" fill="#2A1A10"/>' +
    '<path d="M100 224.6 h9 M115 224.6 h9" stroke="#6B4A2E" stroke-width=".8"/>';
  const face = '<path d="M107 90 L106.8 100.6 Q112 104.4 117.2 100.6 L117 90 Z" fill="' + SK + '"/><path d="M107 94 Q112 98.6 117 94 L117 100.6 Q112 103.6 107 100.6 Z" fill="' + SKD + '" opacity=".55"/>' +
    '<ellipse cx="103.4" cy="85.4" rx="1.9" ry="3.1" fill="' + SK + '"/><ellipse cx="120.6" cy="85.4" rx="1.9" ry="3.1" fill="' + SKD + '"/>' +
    '<path d="M103.8 80 Q103.4 92 107.8 96.6 Q112 99.6 116.2 96.6 Q120.6 92 120.2 80 Q119.8 71.4 112 71.4 Q104.2 71.4 103.8 80 Z" fill="' + SK + '"/>' +
    '<path d="M114.6 72 Q119.8 73 120.2 80 Q120.6 92 116.2 96.6 Q114 98.2 112.4 98.4 Q117.6 90 114.6 72 Z" fill="' + SKD + '" opacity=".5"/>' +
    '<path d="M105 92 Q108 98.6 112 98.8 Q116 98.6 119 92 Q117 97.4 112 97.6 Q107 97.4 105 92 Z" fill="' + QU('glowup') + '"/>' +
    // brows, eyes, nose, mouth, a short beard
    '<path d="M106.4 81.2 Q108.4 80 110.4 80.9 M113.6 80.9 Q115.6 80 117.6 81.2" stroke="#1A0E06" stroke-width=".9" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="108.5" cy="83.9" rx="1.6" ry=".85" fill="#E9DFCF"/><ellipse cx="115.5" cy="83.9" rx="1.6" ry=".85" fill="#E2D6C4"/><circle cx="108.8" cy="83.9" r=".72" fill="#1A0E06"/><circle cx="115.8" cy="83.9" r=".72" fill="#1A0E06"/>' +
    '<path d="M106.8 83.2 Q108.5 82.4 110.2 83.2 M113.8 83.2 Q115.5 82.4 117.2 83.2" stroke="#2A160A" stroke-width=".5" fill="none"/>' +
    '<path d="M111.8 84.6 Q111.4 88 110 89.2 Q111.8 90.4 114 89.4" stroke="' + SKD + '" stroke-width=".8" fill="none" stroke-linecap="round"/><path d="M110.6 89.6 q.6 .4 1.2 0 M112.6 89.6 q.6 .4 1.2 0" stroke="#2A140A" stroke-width=".5" fill="none"/>' +
    '<path d="M104.4 86.6 Q104.8 94 108.6 97 Q112 99.4 115.4 97 Q119.2 94 119.6 86.6 Q119 92.4 116 94.8 Q112 96.4 108 94.8 Q105 92.4 104.4 86.6 Z" fill="#1A100A" opacity=".85"/>' +
    '<path d="M108.8 91.6 Q112 90.2 115.2 91.6 Q112 92.4 108.8 91.6 Z" fill="#1A100A"/><path d="M109.4 93 Q112 94.6 114.6 93" stroke="#5A1E12" stroke-width="1" fill="none" stroke-linecap="round"/>' +
    // the hula, white with a maroon and green stitched band
    arewaCap('hula', 112, 79.4, 8.9, '#EFE8D8', '#8E1F2A');
  const body = '<path d="M107 98.4 Q99 98.8 93.4 101.8 Q89.4 104.4 89 111 L87.6 156 L136.4 156 L135 111 Q134.6 104.4 130.6 101.8 Q125 98.8 117 98.4 Q112 102.4 107 98.4 Z" fill="#D8CCAE"/>' +
    '<path d="M120 99 Q125 98.8 130.6 101.8 Q134.6 104.4 135 111 L136.4 156 L124 156 Q127 120 120 99 Z" fill="#000" opacity=".16"/>' +
    '<path d="M107.4 98.6 Q112 105 116.6 98.6 M112 103.6 V116" stroke="#8E6A3A" stroke-width=".8" fill="none"/><path d="M108.4 100 Q112 104 115.6 100" stroke="#C9A24A" stroke-width=".5" fill="none" stroke-dasharray="1 .8"/>' +
    // the apron, greasy, on a neck strap
    '<path d="M99.6 113 L106.4 99.6 M124.4 113 L117.6 99.6" stroke="#3E302A" stroke-width="1.6"/>' +
    '<path d="M98.4 112.4 Q112 110.4 125.6 112.4 L128.6 156 L95.4 156 Z" fill="#4A3A30"/><path d="M116 111 Q125.6 112.4 125.6 112.4 L128.6 156 L119 156 Q120.4 130 116 111 Z" fill="#000" opacity=".22"/>' +
    '<g fill="#22180F" opacity=".4"><ellipse cx="104" cy="126" rx="3" ry="2"/><ellipse cx="117" cy="138" rx="4" ry="2.4"/><ellipse cx="108" cy="146" rx="2.4" ry="1.6"/></g>' +
    '<path d="M101 120 Q100 136 99.6 154 M110 116 Q109.4 134 109 154 M121 118 Q122 136 123 154" stroke="#000" stroke-opacity=".18" stroke-width=".6" fill="none"/>';
  // his right arm (viewer's left): fanning the coals with a woven mafici
  const fan = '<g class="sy5-fan"><path d="M73.4 139 L64 128.6" stroke="#7A5A2E" stroke-width="1.4" stroke-linecap="round"/>' +
    '<ellipse cx="58.6" cy="122.4" rx="9.6" ry="8.4" transform="rotate(-38 58.6 122.4)" fill="#D2AE68"/>' +
    '<path d="M51.4 118 L65 127 M52.6 114.4 L66.4 123.6 M50.6 121.8 L62.8 130 M55.6 113.2 L66.8 120.4" stroke="#A8823E" stroke-width=".8"/>' +
    '<ellipse cx="58.6" cy="122.4" rx="9.6" ry="8.4" transform="rotate(-38 58.6 122.4)" fill="none" stroke="#8E1F2A" stroke-width="1.3"/>' +
    '<ellipse cx="58.6" cy="122.4" rx="6" ry="5.2" transform="rotate(-38 58.6 122.4)" fill="none" stroke="#2E6B3A" stroke-width=".7"/></g>';
  const armL = '<path d="M93.4 101.8 Q86.4 104.4 84.8 114.6 L82.8 127.8 Q87.4 130.6 92.6 128.4 L94.4 116 Z" fill="#D2C6A6"/>' +
    '<path d="M93 108 Q88 116 86.6 127.4" stroke="#000" stroke-opacity=".14" stroke-width=".7" fill="none"/>' +
    '<path d="M83 125 Q77 131 71.6 135.8 L76.8 141.6 Q84 136.4 92 131 Z" fill="' + SK + '"/><path d="M76.2 140.6 Q83.2 135.8 91.4 130 L90 128.6 Q82.4 134 75.2 139.2 Z" fill="' + QU('glowup') + '"/>' +
    '<ellipse cx="87.8" cy="128.2" rx="5.6" ry="2.6" transform="rotate(-28 87.8 128.2)" fill="#C7B994"/>' + fan +
    '<path d="M70.6 136.6 Q72.6 134 75.4 135.4 Q77.8 137.6 76.6 140.8 Q74.4 142.4 72 141.2 Q70 139.4 70.6 136.6 Z" fill="' + SK + '"/><path d="M71.4 137.2 q1.4 -.6 2.4 .4 M71 139 q1.4 -.4 2.4 .6" stroke="' + SKD + '" stroke-width=".5" fill="none"/>';
  // his left arm (viewer's right): turning a stick, its handle in his fingers
  const held = stick(149, -.6, rnd(3));
  const armR = '<path d="M130.6 101.8 Q137.8 104.4 139.4 114.6 L141.6 126.4 Q137.2 129.4 132 127.4 L130.8 116 Z" fill="#C4B898"/>' +
    '<path d="M131.6 108 Q136 116 137.4 126.6" stroke="#000" stroke-opacity=".16" stroke-width=".7" fill="none"/>' +
    '<path d="M132 125.6 Q138.4 140 143.6 154.8 L151 152.4 Q146 138 142.6 124.6 Z" fill="' + SKD + '"/><path d="M144.6 154.4 L150.6 152.6 Q148 144 146 138 Q144 146 144.6 154.4 Z" fill="' + QU('glowup') + '"/>' +
    '<ellipse cx="137.4" cy="126.4" rx="5.4" ry="2.6" transform="rotate(30 137.4 126.4)" fill="#B9AC8A"/>' +
    '<path d="M143.6 154.6 Q145.2 151.2 148.8 151.6 Q152.4 152.6 152.2 156.6 Q150.8 159.6 147.4 159.2 Q144.2 158 143.6 154.6 Z" fill="' + SK + '"/><path d="M145 157.6 q2.6 .9 5.2 -.6 M145.4 155.4 q2.4 .8 4.8 -.4" stroke="' + SKD + '" stroke-width=".5" fill="none"/>';
  const man = '<g class="sy5-man">' + legs + body + face + '</g>', front = held + armL + armR;
  // the trough
  const trough = '<path d="M30 140 L222 140 L230 152 L22 152 Z" fill="#1A100C"/>' +
    '<path d="M33 141.6 L219 141.6 L225.6 150.6 L26.4 150.6 Z" fill="' + QU('bed') + '"/><path class="sy5-coal" d="M33 141.6 L219 141.6 L225.6 150.6 L26.4 150.6 Z" fill="' + QU('hot') + '"/>' + coals +
    '<path d="M30 140 L222 140" stroke="#5A4A44" stroke-width="1.2"/>' + sticks +
    '<path d="M22 151.6 L230 151.6 L230 155.6 L22 155.6 Z" fill="' + QU('rim') + '"/>' +
    '<path d="M22 155.6 L230 155.6 L226.4 195 L25.6 195 Z" fill="' + QU('sheet') + '"/>' +
    '<path d="M22 155.6 L230 155.6 L229.6 160 L22.4 160 Z" fill="#000" opacity=".35"/>' +
    '<g fill="#7A3A18" opacity=".26"><path d="M40 176 q6 -4 12 1 q2 6 -5 8 q-8 0 -7 -9 Z"/><path d="M188 168 q8 -2 10 4 q-2 8 -9 6 q-4 -4 -1 -10 Z"/><path d="M150 186 q6 -2 9 2 q-3 5 -9 3 Z"/><path d="M78 186 q5 -3 8 1 q-2 4 -8 2 Z"/></g>' +
    '<path d="M74 156 L73.6 195 M126 156 V195 M178 156 L178.4 195" stroke="#120C0A" stroke-width="1"/><path d="M75 156 L74.6 195 M127 156 V195 M179 156 L179.4 195" stroke="#6A5A54" stroke-width=".5" opacity=".6"/>' +
    '<g fill="#4A3C38">' + [70.6, 122.6, 174.6, 77.6, 129.6, 181.6].map((x, i) => '<circle cx="' + x + '" cy="' + (i < 3 ? 162 : 188) + '" r=".9"/>').join('') + '</g>' +
    // SUYA, brushed in cream paint, a red stripe under it
    '<path d="M86 184.6 Q126 181.4 168 184.2" stroke="#B3261E" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/>' +
    '<text x="127" y="180" text-anchor="middle" transform="rotate(-1.5 127 176)" font-family="\'Arial Black\',\'Baloo 2\',sans-serif" font-weight="900" font-size="18" letter-spacing="2.4" fill="#EDE0BE" opacity=".9">SUYA</text>' +
    // the angle-iron legs, a shelf bar, soft shadows where they meet the ground
    '<path d="M41 194 h4 v33 h-4 Z M207 194 h4 v33 h-4 Z" fill="#1E1614"/><path d="M33 213 H219 V216 H33 Z" fill="#241A16"/>' +
    '<path d="M26.4 194 h6.4 v39 h-6.4 Z M219.2 194 h6.4 v39 h-6.4 Z" fill="' + QU('leg') + '"/>';
  const sack = '<path d="M150 231 Q146 214 153 205 Q160 202.6 168 203.4 Q180 202.4 186 205 Q193 214 189.6 231 Z" fill="#B9A57A"/>' +
    '<path d="M150 231 Q146 214 153 205 Q160 202.6 168 203.4 Q180 202.4 186 205 Q193 214 189.6 231 Z" fill="' + QU('weave') + '"/>' +
    '<path d="M173 204 Q186 210 189.6 231 L178 231 Q178 214 173 204 Z" fill="#000" opacity=".22"/>' +
    '<g fill="#1C1412"><ellipse cx="160" cy="204.6" rx="4" ry="2.2"/><ellipse cx="168" cy="203.4" rx="4.4" ry="2.4"/><ellipse cx="177" cy="204.4" rx="4" ry="2"/></g>';
  // the side table: newspaper for wrapping, sliced suya with onions, a bowl of yaji, the knife
  let grain = ''; for (let i = 0; i < 5; i++) grain += '<path d="M236 ' + (159.2 + i * .9) + ' Q266 ' + (158.6 + i * .9 + (i % 2)) + ' 298 ' + (159.4 + i * .9) + '" stroke="#5A3A20" stroke-width=".3" fill="none" opacity=".6"/>';
  let slices = ''; const r2 = rnd(11);
  for (let i = 0; i < 16; i++) slices += '<ellipse cx="' + n1(266 + r2() * 14) + '" cy="' + n1(153.4 + r2() * 3.4) + '" rx="2" ry="1.1" transform="rotate(' + Math.round(r2() * 60 - 30) + ' ' + 273 + ' 155)" fill="' + (i % 3 ? '#6E2C12' : '#8A3E1A') + '"/>';
  const table = '<path d="M238 162 v70 h3.6 v-70 Z M291 162 v70 h3.6 v-70 Z" fill="#4A3020"/><path d="M243 166 v62 h2.4 v-62 Z M286 166 v62 h2.4 v-62 Z" fill="#2E1E14"/>' +
    '<path d="M234 157.6 H298 V162 H234 Z" fill="' + QU('wood') + '"/>' + grain + '<path d="M236 162 H296 V167 H236 Z" fill="#3E2818"/>' +
    '<path d="M237 157.8 L239 150.6 L261 150 L263.6 157.6 Z" fill="#D6CFBE"/><path d="M239 152 h21 M238.6 153.6 h22 M238.2 155.2 h23" stroke="#8A8478" stroke-width=".5" stroke-dasharray="3 1 5 1"/>' +
    '<path d="M263 157.8 Q272 154 283.6 157.8 Z" fill="#CFC8B4"/>' + slices +
    '<g fill="none" stroke="#E8D6E8" stroke-width=".6"><ellipse cx="268" cy="152.6" rx="1.6" ry="1"/><ellipse cx="275" cy="151.6" rx="1.8" ry="1.1"/><ellipse cx="279.6" cy="153.6" rx="1.4" ry=".9"/></g>' +
    '<path d="M285 152.4 L286.6 157.6 H295.4 L297 152.4 Z" fill="#F2EEE4"/><path d="M285 152.4 H297" stroke="#1F5FA8" stroke-width="1" stroke-linecap="round"/><path d="M286 152.4 Q291 147.6 296 152.4 Z" fill="#9A3A16"/>' +
    '<g fill="#5A1A08"><circle cx="289.6" cy="151" r=".4"/><circle cx="292.4" cy="150.4" r=".4"/><circle cx="291" cy="149.6" r=".35"/></g>' +
    '<path d="M244 159.4 L262 158.6" stroke="#B9BEC6" stroke-width="1.4" stroke-linecap="round"/><path d="M262 158.6 L268 158.4" stroke="#3A2618" stroke-width="2" stroke-linecap="round"/>';
  const smoke = '<g class="sy5-smk"><ellipse cx="96" cy="128" rx="10" ry="7" fill="' + QU('puff') + '"/><ellipse cx="90" cy="112" rx="13" ry="9" fill="' + QU('puff') + '" opacity=".7"/></g>' +
    '<g class="sy5-smk sy5-s2"><ellipse cx="170" cy="130" rx="11" ry="7" fill="' + QU('puff') + '"/><ellipse cx="176" cy="114" rx="14" ry="9" fill="' + QU('puff') + '" opacity=".7"/></g>';
  const ground = '<ellipse cx="128" cy="233" rx="126" ry="9" fill="' + QU('pool') + '"/><ellipse cx="128" cy="232.6" rx="110" ry="5" fill="' + QU('shadow') + '"/>' +
    '<ellipse cx="29.6" cy="233" rx="7" ry="1.6" fill="#000" opacity=".45"/><ellipse cx="222.4" cy="233" rx="7" ry="1.6" fill="#000" opacity=".45"/><ellipse cx="266" cy="232.4" rx="34" ry="2.6" fill="#000" opacity=".35"/>' +
    '<ellipse cx="170" cy="231.2" rx="22" ry="2.2" fill="#000" opacity=".4"/><ellipse cx="112" cy="228.6" rx="16" ry="1.8" fill="#000" opacity=".4"/>';
  return '<svg class="suya sy5" viewBox="0 0 300 240" aria-hidden="true"><defs>' +
    qlg('bed', 0, 1, '#FFB347', '#E8541A', '#7A1E08') + qlg('rim', 0, 1, '#E89A5A', '#5A4038', '#2A1E1A') + qlg('sheet', 0, 1, '#2C2220', '#3A2E2A', '#241A18') +
    qlg('leg', 1, 0, '#3A302C', '#1A1412') + qlg('wood', 0, 1, '#9A6A3E', '#6E4626') +
    '<linearGradient id="' + Q + '-hot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE08A" stop-opacity="0"/><stop offset=".3" stop-color="#FFE08A" stop-opacity=".55"/><stop offset=".6" stop-color="#FFD06A" stop-opacity=".2"/><stop offset=".85" stop-color="#FFE08A" stop-opacity=".5"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="' + Q + '-glowup" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF9A3A" stop-opacity=".55"/><stop offset="1" stop-color="#FF9A3A" stop-opacity="0"/></linearGradient>' +
    qrg('puff', '#C8BCD0', .38, 0) + qrg('pool', '#FF9A3A', .32, 0) + qrg('shadow', '#000', .55, 0) + qrg('torso', '#FFA040', .4, 0, ' cx=".5" cy="1" r=".9"') +
    '<pattern id="' + Q + '-weave" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 1.5 H3 M1.5 0 V3" stroke="#7A6440" stroke-width=".5" opacity=".6"/></pattern>' +
    '</defs>' + ground + sack + man +
    '<path d="M88 112 Q112 108 136 112 L137 156 L87 156 Z" fill="' + QU('torso') + '"/>' +
    smoke + trough + front + table + '</svg>';
}
/* one tsire stick: four chunks of spiced meat, the handle over the front rim */
function stick(x, lean, r) {
  const x0 = x + 1.6 + lean, y0 = 139.6, x1 = x - 1.4 - lean * .4, y1 = 159;
  let s = '<path d="M' + n1(x0) + ' ' + y0 + ' L' + n1(x1) + ' ' + y1 + '" stroke="#D9B46A" stroke-width="1.1" stroke-linecap="round"/>';
  for (let k = 0; k < 4; k++) { const t = .06 + k * .17, cx = n1(x0 + (x1 - x0) * t), cy = n1(y0 + (y1 - y0) * t), w = n1(2.3 + r() * .9 + k * .3), hh = n1(1.6 + r() * .4 + k * .2);
    s += '<rect x="' + n1(cx - w) + '" y="' + n1(cy - hh) + '" width="' + n1(w * 2) + '" height="' + n1(hh * 2) + '" rx="' + n1(hh * .9) + '" fill="' + ['#6A2A10', '#7E3416', '#5A2410', '#8A3E1A'][(k + Math.round(x)) % 4] + '"/>' +
      '<path d="M' + n1(cx - w * .6) + ' ' + n1(cy - hh * .5) + ' h' + n1(w * .9) + '" stroke="#E0A060" stroke-width=".5" stroke-linecap="round" opacity=".6"/>' +
      '<circle cx="' + n1(cx + w * .3) + '" cy="' + n1(cy + hh * .2) + '" r=".45" fill="#B8481A"/>'; }
  return s;
}

/* naira notes, close to the real colours: [paper, ink, second tint] */
const NAIRA: Record<number, [string, string, string]> = { 20: ['#E6C77A', '#3E6B2A', '#E89A4A'], 50: ['#BFD3E6', '#23466E', '#E2A3B6'], 100: ['#C9C0E0', '#3E2E78', '#9EC4D8'],
  200: ['#C8D9B4', '#2F5A2E', '#C9A070'], 500: ['#B4D6C4', '#1E5A48', '#D8C08A'], 1000: ['#E2C9A6', '#6A3418', '#C99A3A'] };
export function note(n: number): string {
  const [pa, ink, t2] = NAIRA[n] || ['#D8D2B8', '#3A3A2A', '#B8A070'], id = Q + '-n' + n;
  let guil = ''; for (let i = 0; i < 9; i++) guil += '<path d="M10 ' + (30 + i * 11) + ' q15 -7 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="' + ink + '" stroke-width=".5" fill="none" opacity=".16"/>';
  const N = n.toLocaleString('en-GB');
  const nt = '<g class="sy5-nt"><g transform="rotate(-5 120 69)">' +
    '<path d="M12 18 L232 13 L234 128 L14 132 Z" fill="#000" opacity=".28" transform="translate(3 4)"/>' +
    '<path d="M10 14 L230 10 L232 124 L12 128 Z" fill="' + pa + '"/><path d="M10 14 L230 10 L232 124 L12 128 Z" fill="url(#' + id + 't)"/>' +
    // Sani 2026-10-28: "the number is the thing": only the amount, big and alone; the naira's colours and a faint
    // engraved texture say "money" without anything else to read or look at (no bank name, portrait or arms)
    '<clipPath id="' + id + 'c"><path d="M10 14 L230 10 L232 124 L12 128 Z"/></clipPath><g clip-path="url(#' + id + 'c)">' + guil.replace(/opacity=".16"/g, 'opacity=".08"') + '</g>' +
    '<path d="M10 14 L230 10 L232 124 L12 128 Z" fill="none" stroke="' + ink + '" stroke-width="1.6" opacity=".55"/><path d="M17 20 L223 16.4 L225 117.6 L19 121 Z" fill="none" stroke="' + ink + '" stroke-width=".7" opacity=".3"/>' +
    '<text x="121" y="' + (n >= 1000 ? 88 : 92) + '" text-anchor="middle" font-family="\'Baloo 2\',\'Arial Black\',sans-serif" font-weight="800" font-size="' + (n >= 1000 ? 54 : n >= 100 ? 64 : 72) + '" fill="' + ink + '">₦' + N + '</text></g></g>';
  // the child's hand, from the bottom-right corner: the thumb over the front of the note, the sleeve of a blue kaftan
  const SK = '#8B5A2B', SKD = '#6A4020';
  const arm = '<g class="sy5-arm"><path d="M235 80 Q246 75 253 84 Q256 93 247 98 L237 96 Z" fill="' + SKD + '"/>' +
    '<path d="M250 126 Q262 112 274 108 L304 136 L304 200 L268 200 Q254 150 250 126 Z" fill="' + SK + '"/><path d="M262 176 Q256 150 252 128 L262 124 Q266 150 276 176 Z" fill="' + SKD + '" opacity=".5"/>' +
    '<path d="M236 92 Q250 83 263 91 Q273 104 271 121 Q263 134 248 132 Q238 124 236 110 Z" fill="' + SK + '"/>' +
    '<path d="M238 100 Q243 102 247 100 M238 108 Q243 111 248 109 M239 116 Q244 119 249 117" stroke="' + SKD + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
    '<path d="M256 92 Q264 98 266 110" stroke="#B07A48" stroke-width="1.4" fill="none" opacity=".6" stroke-linecap="round"/>' +
    '<path d="M246 104 Q232 99 215 97.4 Q209.6 97.6 209.6 101.4 Q210.4 105 215.4 105.6 Q230 107.6 243 115 Z" fill="' + SK + '"/>' +
    '<path d="M215.4 105.6 Q230 107.6 243 115 L245 111 Q230 104 214 103.4 Z" fill="' + SKD + '" opacity=".6"/><ellipse cx="213.4" cy="100.6" rx="2.6" ry="1.9" fill="#D9A27A"/>' +
    '<path d="M266 142 Q284 130 306 138 L420 200 V260 H300 Q262 162 266 142 Z" fill="#2F6B9A"/><path d="M266 142 Q284 130 306 138" stroke="#E8D9A8" stroke-width="2.2" fill="none"/><path d="M272 156 Q286 150 302 156" stroke="#000" stroke-opacity=".2" stroke-width="1.3" fill="none"/></g>';
  return '<svg class="note sy5note" viewBox="0 0 300 170" aria-hidden="true"><defs><linearGradient id="' + id + 't" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + t2 + '" stop-opacity=".55"/><stop offset=".5" stop-color="' + pa + '" stop-opacity="0"/><stop offset="1" stop-color="' + t2 + '" stop-opacity=".45"/></linearGradient></defs>' +
    nt + arm + '</svg>';
}
