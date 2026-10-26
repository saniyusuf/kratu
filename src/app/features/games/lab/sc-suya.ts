// @ts-nocheck
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
  if (o.cap === 'hula') front = '<path d="M-3.6 -36.3 Q-3.7 -40.8 0 -41 Q3.7 -40.8 3.6 -36.3 Z" fill="' + cc + '"/><path d="M-3.3 -38.2 l.8 -.9 l.8 .9 l.8 -.9 l.8 .9 l.8 -.9 l.8 .9 l.8 -.9 l.6 .7" stroke="' + c2 + '" stroke-width=".42" fill="none"/><path d="M-3.6 -36.4 H3.6" stroke="#000" stroke-opacity=".2" stroke-width=".4"/>';
  if (o.cap === 'zanna') front = '<path d="M-3.7 -36.2 L-3.4 -40.2 Q0 -42.2 3.6 -40.6 L3.7 -36.2 Q0 -37.2 -3.7 -36.2 Z" fill="' + cc + '"/><path d="M-3.4 -40.2 Q.4 -39 3.6 -40.6 M-1 -39.6 L-.6 -36.8" stroke="' + c2 + '" stroke-width=".4" fill="none"/>';
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
const zanko = (x0, x1, y, c) => { let s = '<g fill="' + c + '">'; for (let x = x0; x <= x1; x += 7) s += '<path d="M' + x + ' ' + y + ' l1.3 -3.6 l1.3 3.6 Z"/>'; return s + '</g>'; };
const stars = (n) => { let s = ''; for (let i = 0; i < n; i++) s += '<circle cx="' + n1((i * 47.3 + 11) % 320) + '" cy="' + n1(4 + (i * 17.9) % 52) + '" r="' + (i % 4 ? .45 : .8) + '"/>'; return s; };
/* a shop front: a painted block, a zinc awning on two posts, a lit kiosk or a closed shutter */
const shop = (x, w, c, lit, goods = '') => '<path d="M' + x + ' 118 V76 H' + (x + w) + ' V118 Z" fill="' + c + '"/><path d="M' + (x + w * .78) + ' 118 V76 H' + (x + w) + ' V118 Z" fill="#000" opacity=".18"/>' + zanko(x, x + w - 2, 76, c) +
  (lit ? '<path d="M' + (x + 4) + ' 118 V94 H' + (x + w - 4) + ' V118 Z" fill="' + U('kiosk') + '"/>' + goods + '<path d="M' + (x + 4) + ' 118 L' + (x - 10) + ' 132 H' + (x + w + 10) + ' L' + (x + w - 4) + ' 118 Z" fill="#FFC870" opacity=".14"/>'
    : '<path d="M' + (x + 4) + ' 118 V94 H' + (x + w - 4) + ' V118 Z" fill="' + U('shut') + '"/><path d="M' + (x + w / 2) + ' 112 v4" stroke="#1A1420" stroke-width=".8"/>') +
  '<path d="M' + (x - 3) + ' 92 L' + x + ' 85 H' + (x + w) + ' L' + (x + w + 3) + ' 92 Z" fill="' + U('zinc') + '"/><path d="M' + (x - 3) + ' 92 H' + (x + w + 3) + '" stroke="#3A3A44" stroke-width=".6"/>' +
  '<path d="M' + (x - 1) + ' 118 V92 M' + (x + w + 1) + ' 118 V92" stroke="#3A2A22" stroke-width="1"/>';
const shelves = (x, y) => { const C = ['#E8A21E', '#C62828', '#2E7D32', '#1F5FA8', '#F4F1EA', '#AD1457']; let s = '<path d="M' + x + ' ' + y + ' h18 M' + x + ' ' + (y + 6) + ' h18 M' + x + ' ' + (y + 12) + ' h18" stroke="#6B4A2E" stroke-width=".7"/>';
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) s += '<rect x="' + (x + 1 + i * 2.9) + '" y="' + (y + r * 6 - 3.4) + '" width="2.2" height="3.4" fill="' + C[(i + r * 2) % 6] + '"/>'; return s; };
const bulbs = (cls, pts) => '<g class="' + cls + '">' + pts.map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + U('glow') + '"/>').join('') + '</g>';
const okada = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy=".4" rx="16" ry="1.6" fill="#000" opacity=".35"/>' +
  '<path class="x-beam" d="M-15 -14 L-60 -26 L-60 6 Z" fill="' + U('beam') + '"/>' +
  '<circle cx="-11" cy="-5" r="5" fill="#141414"/><circle cx="-11" cy="-5" r="2.2" fill="#7A7A80"/><circle cx="11" cy="-5" r="5" fill="#141414"/><circle cx="11" cy="-5" r="2.2" fill="#7A7A80"/>' +
  '<path d="M-11 -5 L-8 -16 M11 -5 L4 -8 L-4 -8" stroke="#8A8A90" stroke-width="1.2" fill="none"/><path d="M-5 -9 h9 v3 h-9 Z" fill="#3A3A40"/><path d="M6 -8 h7 l1 2 h-8 Z" fill="#8A8A90"/>' +
  '<path d="M-7 -14 Q-6 -17 -2 -17 L4 -16 Q5 -12 2 -10 L-6 -10 Z" fill="#B71C1C"/><path d="M-6 -15.6 Q-3 -16.6 1 -16" stroke="#fff" stroke-opacity=".4" stroke-width=".6" fill="none"/>' +
  '<path d="M2 -16.6 Q8 -17.6 13 -16 L13 -14.2 Q8 -14.8 3 -14.4 Z" fill="#1A1A1A"/><path d="M9 -10 Q12 -12 14 -10 L13 -6 H8 Z" fill="#B71C1C"/>' +
  '<path d="M-8 -16 L-9 -21 M-11 -21.4 L-6.4 -20.6" stroke="#2A2A2E" stroke-width=".9" stroke-linecap="round"/><path d="M-12.6 -17.6 a2.2 2.2 0 0 1 0 -4 l1.2 .4 v3.2 Z" fill="#C9C9CF"/><circle cx="-13.4" cy="-15.6" r="1.4" fill="#FFF6C8"/>' +
  '<circle cx="14.4" cy="-11" r=".7" fill="#FF3A2A"/></g>';
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
  const bulbPts = [];
  for (let i = 0; i <= 16; i++) { const x = 8 + i * 19, y = 58 + Math.sin(((x - 8) / 152) * Math.PI) * 0 + (((x - 8) % 152) / 152) * (1 - ((x - 8) % 152) / 152) * 16; bulbPts.push([n1(x), n1(y + 1.6)]); }
  const sky = '<rect width="320" height="200" fill="' + U('sky') + '"/><g class="x-stars" fill="#FFF6DC">' + stars(46) + '</g>' +
    '<circle cx="42" cy="38" r="18" fill="' + U('moon') + '"/><path d="M47 30 a9.4 9.4 0 1 0 0 16.4 a7.6 7.6 0 1 1 0 -16.4 Z" fill="#FFF3C4"/>';
  // the town behind: dark houses with zanko, a few lit windows, the minaret with its green light
  const town = '<g fill="#2B2340">' + '<path d="M0 100 V66 H30 V100 Z M34 100 V72 H62 V100 Z M98 100 V68 H128 V100 Z M190 100 V70 H222 V100 Z M226 100 V64 H262 V100 Z M268 100 V72 H296 V100 Z M298 100 V66 H320 V100 Z"/>' +
    zanko(0, 28, 66, '#2B2340') + zanko(34, 60, 72, '#2B2340') + zanko(98, 126, 68, '#2B2340') + zanko(190, 220, 70, '#2B2340') + zanko(226, 260, 64, '#2B2340') + zanko(268, 294, 72, '#2B2340') + zanko(298, 318, 66, '#2B2340') + '</g>' +
    '<g fill="#FFC96A" opacity=".75"><rect x="8" y="74" width="3" height="4"/><rect x="104" y="76" width="3" height="4"/><rect x="236" y="72" width="3" height="4"/><rect x="306" y="74" width="3" height="4"/><rect x="200" y="78" width="3" height="4"/></g>' +
    '<g transform="translate(170 100)" fill="#332A4A"><path d="M-16 0 V-14 H22 V0 Z"/><path d="M-4 -14 Q5 -30 14 -14 Z"/><path d="M-13 -14 L-12 -56 H-6 L-5 -14 Z"/><path d="M-14 -56 H-4 V-58.4 H-14 Z"/><path d="M-12.6 -58 L-12.2 -66 H-5.8 L-5.4 -58 Z"/><path d="M-13 -66 Q-9 -73 -5 -66 Z"/>' +
    '<path d="M-9 -72 v-3" stroke="#332A4A" stroke-width=".6"/><circle cx="-9" cy="-76" r="1" fill="none" stroke="#7A6A9A" stroke-width=".4"/><circle cx="-9" cy="-61" r=".9" fill="#5CE08A" class="x-green"/><rect x="-10" y="-46" width="2" height="3" rx="1" fill="#FFC96A" opacity=".6"/></g>';
  const street = '<path d="M0 118 H320 V200 H0 Z" fill="' + U('gr') + '"/><path d="M0 118 H320 V121 H0 Z" fill="#000" opacity=".25"/>' +
    '<ellipse cx="72" cy="150" rx="80" ry="26" fill="' + U('pool') + '"/><ellipse cx="200" cy="146" rx="40" ry="14" fill="' + U('pool') + '"/><ellipse cx="280" cy="140" rx="50" ry="16" fill="' + U('pool') + '" opacity=".7"/>' +
    '<g fill="#4A3A48" opacity=".5"><ellipse cx="150" cy="176" rx="12" ry=".8"/><ellipse cx="110" cy="190" rx="10" ry=".8"/><circle cx="170" cy="190" r=".7"/><circle cx="236" cy="196" r=".8"/></g>';
  const shops = shop(4, 34, '#5A4458', false) + shop(140, 40, '#4E4A62', true, shelves(150, 100)) + shop(186, 30, '#5E4650', false) + shop(222, 44, '#54425E', true, shelves(226, 100) + shelves(244, 100)) + shop(272, 46, '#4E4458', false) +
    '<path d="M44 118 V82 H134 V118 Z" fill="#4A3A4E"/>' + zanko(44, 132, 82, '#4A3A4E') + '<path d="M60 118 V98 a6 6 0 0 1 12 0 V118 Z M100 118 V98 a6 6 0 0 1 12 0 V118 Z" fill="#241C2A"/>';
  // the bulbs on their wire, between poles
  let wire = 'M8 59.6'; for (const [x, y] of bulbPts) wire += ' L' + x + ' ' + y;
  const lights = '<path d="M8 120 V56 M312 120 V56" stroke="#2A2024" stroke-width="1.4"/><path d="' + wire + '" stroke="#141014" stroke-width=".45" fill="none"/>' +
    bulbs('x-bulbs', bulbPts.filter((_, i) => i % 2)) + bulbs('x-bulbs x-b2', bulbPts.filter((_, i) => !(i % 2))) +
    '<g fill="#FFF0B0">' + bulbPts.map(([x, y]) => '<circle cx="' + x + '" cy="' + (y + 1.2) + '" r="1.3"/>').join('') + '</g>';
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
    person({ x: 256, y: 150, s: 1.05, kind: 'man', seat: true, sk: SKIN[1], robe: '#E9E4D8', robe2: '#D8D0BE', trim: '#8EA8C8', cap: 'hula', capc: '#F4F1EA', capc2: '#2E7D32', beard: '#1A120C', al: 'lap', ar: 'lap', cls: 'x-cl' }) +
    person({ x: 275, y: 150, s: 1, kind: 'woman', seat: true, sk: SKIN[4], top: '#7B3F8A', wrap: '#7B3F8A', wrap2: '#F2C230', trim: '#F2C230', cap: 'mayafi', capc: '#C2185B', al: 'lap', ar: 'lap', cls: 'x-cl x-nod' }) +
    person({ x: 294.5, y: 150, s: 1.05, kind: 'man', seat: true, sk: SKIN[3], robe: '#2F5E8A', robe2: '#E9E2CF', trim: '#E8D9A8', cap: 'turban', capc: '#F4F1EA', beard: '#E8E4DC', al: 'lap', ar: 'down', cls: 'x-cl' }) +
    person({ x: 312.5, y: 150, s: .78, child: true, kind: 'boy', sk: SKIN[0], robe: '#C62828', robe2: '#E9E2CF', trim: '#FFD54A', cap: 'hula', capc: '#fff', capc2: '#C62828', al: 'down', ar: 'down', cls: 'x-up x-hop' });
  const front = okada(206, 188, 1.15);
  return '<svg class="scene ' + PF + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('sky', '#0B0D2A', '#1E1A44', '#45305A') + lg('gr', '#3A2C38', '#2A2030', '#1C1622') + lg('kiosk', '#FFE3A0', '#F2A84A') + lg('shut', '#6A6878', '#4A4858') +
    '<pattern id="' + PF + '-zinc" width="2.2" height="6" patternUnits="userSpaceOnUse" patternTransform="skewX(-15)"><rect width="2.2" height="6" fill="#6E7280"/><rect width=".4" height="6" fill="#4E5260"/><rect x=".5" width=".5" height="6" fill="#8A8E9A"/></pattern>' +
    '<radialGradient id="' + PF + '-glow"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".8"/><stop offset=".3" stop-color="#FFC96A" stop-opacity=".3"/><stop offset="1" stop-color="#FFC96A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-lamp"><stop offset="0" stop-color="#FFD27A" stop-opacity=".7"/><stop offset="1" stop-color="#FF9A3A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-coal"><stop offset="0" stop-color="#FF8A2A" stop-opacity=".55"/><stop offset="1" stop-color="#FF6A1A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-pool"><stop offset="0" stop-color="#FFB45A" stop-opacity=".28"/><stop offset="1" stop-color="#FFB45A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-puff"><stop offset="0" stop-color="#B4A8C0" stop-opacity=".5"/><stop offset="1" stop-color="#B4A8C0" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-moon"><stop offset=".3" stop-color="#FFF3C4" stop-opacity=".35"/><stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="' + PF + '-beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".38"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="' + PF + '-sh" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".18"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>' +
    headDef + clothesDef() + '</defs>' +
    sky + town + shops + street + smoke + lights + left + helper + people + front + '</svg>';
}
