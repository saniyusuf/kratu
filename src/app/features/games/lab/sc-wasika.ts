// @ts-nocheck
import { arewaCap } from './capsArewa';
/*
 * Marubucin wasiƙa, drawn (Sani 2026-10-25, reworked 2026-10-26: "make the things more real and add sound and make the
 * letter thing bigger too"). The big letter now fills the middle of the screen, so the street is laid out around it:
 *   left  — the NIPOST post office: plastered walls, the green fascia with its sign, burglar-barred windows, a wall of
 *           brass P.O. boxes, the green door, an old air conditioner, the flag on the roof; a red pillar box in front
 *           with a woman posting her letter, an old man reading his, a bicycle against the wall;
 *   right — the public letter writer at his typewriter under a striped umbrella, a young man waiting with his
 *           envelope;
 *   between the letter and the keys — two boys with a tyre, a goat, hens pecking; behind the letter, the town.
 * Plaster, mud, sand and tar carry light pattern textures; people have shaded skin, faces with noses and lips, hands,
 * sandals and the folds and embroidery of their clothes.
 *
 * Also here: the game's own post rider (an okada with a rider in a cap and a POST bag), the envelope's paper, stamp
 * and postmark, the ink alphabet the names are written in, the ink splat of a wrong letter, and the game's sounds.
 *
 * Classes animated by sc-wasika.css (transform and opacity only):
 *   .x-body · .x-head · .x-al / .x-ar · .x-eo / .x-eh · .x-ms / .x-mf
 *   people: .q1 (the queue) · .x-writer · .x-poster · .x-reader · .x-kid1 (jumps) · .x-kid2 · .x-tyre · .x-roll
 *   .x-goat · .x-hen · .x-wire · .x-cloud · .x-flag
 */
const SK = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#9A6436'];
const SKL = ['#9A6436', '#7A4E2A', '#A8723E', '#8A5632', '#B07A48'];   // the lit side of each skin
const sk = (i) => 'url(#ws4-sk' + (i % SK.length) + ')';
const lg = (id, ...c) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const lgx = (id, ...c) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const zanko = (x0, x1, y, h = 4) => { let s = ''; for (let x = x0; x <= x1; x += 7) s += '<path d="M' + x + ' ' + y + ' l1.3 -' + h + ' l1.3 ' + h + ' Z"/>'; return s; };
const relief = (x, y, s = 1) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="none" stroke="#FFF1D6" stroke-width=".55" opacity=".8"><path d="M-5 0 q5 -5 10 0 q-5 5 -10 0 Z"/><circle r="1.2"/><path d="M-7 5 l3.5 -2 l3.5 2 l3.5 -2 l3.5 2"/></g>';
const cloud = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-cloud"><ellipse rx="12" ry="3" fill="#fff" opacity=".9"/><ellipse cx="7" cy="-1.6" rx="7" ry="3.4" fill="#fff" opacity=".9"/><ellipse cx="-5" cy="-1" rx="5" ry="2.6" fill="#fff" opacity=".9"/><ellipse cy="1.6" rx="11" ry="1.4" fill="#C9DCE6" opacity=".6"/></g></g>';
// a seeded scatter so the textures look the same on every load
const rnd = (s) => () => (s = (s * 9301 + 49297) % 233280) / 233280;

/* ---------------- a head on its own origin (radius 5.2); the invisible ring centres its box on the neck ---------------- */
function head(o) {
  const s = o.skin % SK.length, hc = o.hatc || '#fff', hc2 = o.hatc2 || '#C62828';
  let back = '', top = '', ears = '<g fill="' + SK[s] + '"><ellipse cx="-5.1" cy=".6" rx="1.05" ry="1.4"/><ellipse cx="5.1" cy=".6" rx="1.05" ry="1.4"/></g><g fill="#000" opacity=".22"><ellipse cx="-5.2" cy=".7" rx=".45" ry=".8"/><ellipse cx="5.2" cy=".7" rx=".45" ry=".8"/></g>';
  if (o.hat === 'hula' || o.hat === 'zanna' || o.hat === 'borno') top = arewaCap(o.hat, 0, -1.4, 5.35, hc, o.hatc2, o.hatc3, o.capside || 1);
  if (o.hat === 'kallabi') top = '<path d="M-5.6 -.6 Q-6.4 -8.6 0 -9.2 Q6.4 -8.6 5.6 -.6 Q0 -4.2 -5.6 -.6 Z" fill="' + hc + '"/><path d="M-2.6 -8.4 Q-6.6 -13.6 -1.4 -12 Q0 -15.4 1.6 -12 Q6.6 -13.4 2.8 -8.4 Z" fill="' + hc + '"/><path d="M-5 -3.4 Q0 -7.2 5 -3.4 M-1.4 -12 Q-.6 -10 0 -8.6 M1.6 -12 Q.8 -10 .4 -8.6" stroke="' + hc2 + '" stroke-width=".6" fill="none"/><path d="M2 -9 Q6.2 -8.4 5.6 -.6 Q4.4 -2.4 3 -3 Z" fill="#000" opacity=".14"/>';
  if (o.hat === 'cap') top = '<path d="M-5.4 -1.2 Q-5.8 -7.6 0 -8 Q5.8 -7.6 5.4 -1.2 Z" fill="' + hc + '"/><path d="M3.4 -2.2 Q9 -2.6 10.4 -1 Q7 -.2 3.4 -.8 Z" fill="' + hc2 + '"/><path d="M0 -8 V-1.4" stroke="rgba(0,0,0,.2)" stroke-width=".4"/><circle cy="-8" r=".6" fill="' + hc2 + '"/>';
  if (o.hat === 'hijab') { back = '<path d="M-6.2 0 Q-6.9 -8.8 0 -9.2 Q6.9 -8.8 6.2 0 L8.4 11.6 Q0 14.4 -8.4 11.6 Z" fill="' + hc + '"/>'; ears = '';
    top = '<path d="M-5.5 1.2 Q-6.1 -7.4 0 -7.7 Q6.1 -7.4 5.5 1.2 Q4.9 -3.6 0 -3.9 Q-4.9 -3.6 -5.5 1.2 Z" fill="' + hc + '"/><path d="M-5.3 1.2 Q-4.6 5.8 0 6 Q4.6 5.8 5.3 1.2 L8.3 11.6 Q0 14.2 -8.3 11.6 Z" fill="' + hc + '"/><path d="M2 6 Q4.6 5.8 5.3 1.2 L8.3 11.6 Q5 12.8 2.6 13 Z" fill="#000" opacity=".15"/><path d="M-3 7 Q-1 10 -2 13 M2 7.4 Q3 10 2.4 13" stroke="rgba(0,0,0,.14)" stroke-width=".5" fill="none"/>'; }
  if (o.hat === 'bare') top = '<path d="M-5 -1.6 Q-5 -5.6 0 -5.8 Q5 -5.6 5 -1.6 Q3 -3.4 0 -3.4 Q-3 -3.4 -5 -1.6 Z" fill="#1A0E06" opacity=".8"/>';
  const beard = o.beard ? '<path d="M-4.7 1.2 Q-4.2 8 0 8.8 Q4.2 8 4.7 1.2 Q2.8 4.4 0 4.4 Q-2.8 4.4 -4.7 1.2 Z" fill="' + o.beard + '"/><path d="M-2.2 2.6 Q0 1.8 2.2 2.6" stroke="' + o.beard + '" stroke-width=".9" fill="none"/><path d="M-2 6 Q0 7.6 2 6" stroke="rgba(0,0,0,.18)" stroke-width=".4" fill="none"/>' : '';
  const eye = (x) => '<ellipse cx="' + x + '" cy="-.3" rx="1.05" ry=".62" fill="#F6EEDF"/><circle cx="' + (x + .12) + '" cy="-.3" r=".52" fill="#2A1508"/><circle cx="' + (x + .3) + '" cy="-.48" r=".17" fill="#fff"/><path d="M' + (x - 1.1) + ' -.5 Q' + x + ' -1.3 ' + (x + 1.1) + ' -.5" stroke="#1A0E06" stroke-width=".38" fill="none"/>';
  return '<g class="x-head"><circle cy="5.4" r="11" fill="none"/>' + back + ears +
    '<path d="M-2.2 3.6 L-2 8 H2 L2.2 3.6 Z" fill="' + SK[s] + '"/><path d="M-2 5.6 Q0 7 2 5.6 V8 H-2 Z" fill="#000" opacity=".25"/>' +
    '<path d="M0 -5.2 C3.2 -5.2 5.2 -3.2 5.2 0 C5.2 3.4 3 5.6 0 5.6 C-3 5.6 -5.2 3.4 -5.2 0 C-5.2 -3.2 -3.2 -5.2 0 -5.2 Z" fill="' + sk(s) + '"/>' +
    '<path d="M1.2 -5 A5.2 5.2 0 0 1 1 5.5 A3.8 5.3 0 0 0 1.2 -5 Z" fill="#000" opacity=".14"/><path d="M-3.6 3.6 Q0 6.6 3.6 3.6 Q0 5.2 -3.6 3.6 Z" fill="#000" opacity=".12"/>' +
    (o.cheek ? '<g fill="#E8735A" opacity=".25"><circle cx="-3" cy="2" r="1.1"/><circle cx="3" cy="2" r="1.1"/></g>' : '') +
    '<g class="x-eo">' + eye(-1.95) + eye(1.95) + '</g>' +
    '<g class="x-eh" fill="none" stroke="#1A0E06" stroke-width=".55" stroke-linecap="round"><path d="M-2.9 0 q.95 -1.1 1.9 0 M1 0 q.95 -1.1 1.9 0"/></g>' +
    '<path d="M-3.1 -2.3 q1.1 -.8 2.3 -.3 M3.1 -2.3 q-1.1 -.8 -2.3 -.3" stroke="#1E1008" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
    '<path d="M-.15 -.1 Q-.5 1.2 -1.1 1.6 Q-.6 2.3 0 2 Q.6 2.3 1.1 1.6 Q.5 1.2 .2 -.1 Z" fill="#000" opacity=".2"/><circle cx="-.1" cy=".9" r=".28" fill="#fff" opacity=".2"/>' +
    (o.specs ? '<g fill="none" stroke="#2A1A10" stroke-width=".38"><circle cx="-1.95" cy="-.3" r="1.45"/><circle cx="1.95" cy="-.3" r="1.45"/><path d="M-.5 -.4 h1 M-3.4 -.4 L-5 -.9 M3.4 -.4 L5 -.9"/></g><g fill="#fff" opacity=".25"><circle cx="-2.4" cy="-.8" r=".4"/><circle cx="1.5" cy="-.8" r=".4"/></g>' : '') +
    beard +
    '<g class="x-ms"><path d="M-1.8 2.75 Q0 2.2 1.8 2.75 Q0 3.4 -1.8 2.75 Z" fill="#4A2412" opacity=".75"/><path d="M-1.5 2.95 Q0 4.3 1.5 2.95 Q0 3.5 -1.5 2.95 Z" fill="#7A3A22" opacity=".8"/><path d="M-1.8 2.75 Q0 3.6 1.8 2.75" stroke="#2A0E06" stroke-width=".4" fill="none" stroke-linecap="round"/></g>' +
    '<g class="x-mf"><path d="M-1.6 3.9 Q0 2.7 1.6 3.9" stroke="#2A0E06" stroke-width=".55" fill="none" stroke-linecap="round"/><path d="M-1.3 4 Q0 4.6 1.3 4" stroke="#7A3A22" stroke-width=".5" fill="none"/></g>' +
    '<path d="M-3.8 -3.4 Q-2 -4.8 -.4 -4.6" stroke="#fff" stroke-width=".7" fill="none" opacity=".12" stroke-linecap="round"/>' +
    top + '</g>';
}

/* ---------------- a standing person, feet on 0, about 64 tall ---------------- */
const POSE = {
  down: ['M-5.6 -47 Q-9.4 -38 -8.8 -28.6', -8.8, -27.8], front: ['M-5.6 -47 Q-9.8 -39 -2.8 -34.4', -2, -34],
  up: ['M-5.6 -47 Q-11 -56 -8.6 -64', -8.6, -65], staff: ['M-5.6 -47 Q-11.6 -42 -11 -33.6', -11, -33],
  type: ['M-5.6 -47 Q-10 -37 -4.2 -31', -3.6, -30.6], reach: ['M-5.6 -47 Q-12 -42 -15 -36', -15.6, -35.6],
  read: ['M-5.6 -47 Q-11 -40 -5 -39', -4.4, -39.2],
};
const mir = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => (-x) + ' ' + y);
function arm(side, pose, col, s, w, trim, hold = '') {
  let [d, hx, hy] = POSE[pose]; const sx = side === 'l' ? -5.6 : 5.6;
  if (side === 'r') { d = mir(d); hx = -hx; }
  const end = d.split(' ').slice(-2).map(Number), dir = side === 'l' ? 1 : -1;
  return '<g class="x-a' + side + '"><circle cx="' + sx + '" cy="-47" r="21" fill="none"/><path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>' +
    '<path d="' + d + '" stroke="#000" stroke-width="' + (w * .4) + '" stroke-linecap="round" fill="none" opacity=".1" transform="translate(' + (side === 'l' ? .7 : -.7) + ' .3)"/>' +
    '<path d="' + d + '" stroke="#fff" stroke-width="' + (w * .22) + '" stroke-linecap="round" fill="none" opacity=".12" transform="translate(' + (side === 'l' ? -.7 : .7) + ' -.2)"/>' +
    (trim ? '<circle cx="' + end[0] + '" cy="' + end[1] + '" r="' + (w * .48) + '" fill="none" stroke="' + trim + '" stroke-width=".55"/>' : '') +
    '<g transform="translate(' + hx + ' ' + hy + ')"><ellipse rx="1.45" ry="1.7" fill="' + sk(s) + '"/><path d="M' + (dir * .9) + ' -.8 q' + (dir * 1.3) + ' .2 ' + (dir * 1.1) + ' 1.4" stroke="' + SK[s] + '" stroke-width=".8" stroke-linecap="round" fill="none"/><path d="M-.9 1.1 q.9 .7 1.8 0" stroke="#000" stroke-width=".3" opacity=".3" fill="none"/></g>' + hold + '</g>';
}
const sandal = (x, s) => '<g transform="translate(' + x + ' 0)"><path d="M-2.9 0 Q-3 -1.6 -1 -1.8 L2.4 -1.6 Q3.6 -1.2 3.4 0 Z" fill="' + sk(s) + '"/><path d="M-3.1 0 H3.6 V.5 H-3.1 Z" fill="#3A2416"/><path d="M-1.4 -1.7 L.6 -.4 L2.2 -1.6" stroke="#6B3A1E" stroke-width=".55" fill="none"/></g>';
function person(o) {
  const s = o.skin % SK.length, k = o.kind, tr = o.trim;
  let b = '<ellipse cy=".4" rx="11" ry="1.7" fill="rgba(40,24,10,.28)"/><g class="x-body">' + (o.behind || '');
  let sleeve = o.robe, w = 3.6;
  const folds = (pts) => '<path d="' + pts + '" stroke="rgba(0,0,0,.16)" stroke-width=".55" fill="none" stroke-linecap="round"/>';
  if (k === 'man') { // babban riga over trousers, the big embroidered pocket, wide sleeves
    w = 5;
    b += '<path d="M-4.6 -7 h3 v5.4 h-3 Z M1.6 -7 h3 v5.4 h-3 Z" fill="' + (o.pants || '#E8E0CC') + '"/>' + sandal(-2.9, s) + sandal(3, s) +
      '<path d="M-6 -48.5 Q0 -50.2 6 -48.5 Q12 -38 14.6 -7 Q0 -3.6 -14.6 -7 Q-12 -38 -6 -48.5 Z" fill="' + o.robe + '"/>' +
      '<path d="M1 -50 Q6 -50 6 -48.5 Q12 -38 14.6 -7 Q7 -5 1.6 -4.4 Q5 -26 1 -50 Z" fill="#000" opacity=".13"/><path d="M-6 -48.5 Q-11 -38 -13.6 -9 L-11.6 -9 Q-9 -36 -5 -47 Z" fill="#fff" opacity=".1"/>' +
      '<path d="M-2.4 -48.6 L0 -42 L2.4 -48.6" stroke="' + tr + '" stroke-width=".7" fill="none"/>' +
      '<path d="M-9.6 -40 Q-6 -42 -1.6 -40.6 L-2 -27 Q-6 -25.6 -9.8 -27.4 Z" fill="' + tr + '" opacity=".18"/><g fill="none" stroke="' + tr + '" stroke-width=".5" opacity=".9"><path d="M-7.8 -37 q1.6 -2.4 3.6 -.4 q1.2 2 -.9 2.4 q-1.6 .2 -1.1 -1.2"/><path d="M-8.6 -31 q2.6 1.6 5.6 0 M-8.4 -29 q2.6 1.6 5.4 0"/></g>' +
      folds('M-3 -30 Q-5.4 -18 -7.4 -8 M3.6 -34 Q6.4 -20 9 -8 M-.6 -26 Q-.4 -16 -1 -6 M6.4 -40 Q9 -28 11.6 -9') +
      '<path d="M-14.2 -7.4 Q0 -4.2 14.2 -7.4" stroke="' + tr + '" stroke-width=".7" fill="none"/>';
  } else if (k === 'young') { // jallabiya kaftan, trousers
    b += '<path d="M-4 -12 h3 v10.4 h-3 Z M1 -12 h3 v10.4 h-3 Z" fill="' + (o.pants || '#3A3A48') + '"/>' + sandal(-2.5, s) + sandal(2.6, s) +
      '<path d="M-5.6 -48.5 Q0 -50 5.6 -48.5 Q7.6 -30 8.6 -10 Q0 -8.4 -8.6 -10 Q-7.6 -30 -5.6 -48.5 Z" fill="' + o.robe + '"/><path d="M1 -49.6 Q5.6 -49.6 5.6 -48.5 Q7.6 -30 8.6 -10 Q4 -9 1.4 -8.8 Q3 -30 1 -49.6 Z" fill="#000" opacity=".13"/>' +
      '<path d="M-5.4 -47 Q-7 -30 -7.6 -11 L-6 -11 Q-5.4 -30 -4.2 -46 Z" fill="#fff" opacity=".1"/>' +
      '<path d="M0 -48.6 V-37" stroke="' + tr + '" stroke-width=".8"/><path d="M-1.6 -48.4 Q0 -46 1.6 -48.4" stroke="' + tr + '" stroke-width=".6" fill="none"/><g fill="' + tr + '"><circle cy="-45" r=".45"/><circle cy="-42" r=".45"/><circle cy="-39" r=".45"/></g>' +
      folds('M-3 -30 Q-4 -20 -5 -11 M3.4 -28 Q4.6 -18 5.6 -11') + '<path d="M-8.4 -10.6 Q0 -9 8.4 -10.6" stroke="' + tr + '" stroke-width=".6" fill="none"/>';
  } else if (k === 'woman') { // blouse, zani wrapper, a wrapper tying the baby on
    b += sandal(-2.6, s) + sandal(2.7, s) +
      '<path d="M-5.6 -48.5 Q0 -50 5.6 -48.5 L7.4 -29 L-7.4 -29 Z" fill="' + o.robe + '"/><path d="M1 -49.6 Q5.6 -49.6 5.6 -48.5 L7.4 -29 L2 -29 Z" fill="#000" opacity=".12"/>' +
      '<path d="M-7.6 -30 L7.6 -30 L8.8 -1.4 Q0 0 -8.8 -1.4 Z" fill="' + o.wrap + '"/><path d="M-7.6 -30 L7.6 -30 L7.8 -26.4 L-7.8 -26.4 Z" fill="' + o.wrap2 + '"/>' +
      '<path d="M-8.2 -14 H8.2 M-8.5 -6 H8.5" stroke="' + o.wrap2 + '" stroke-width="1.1"/><g fill="' + o.wrap2 + '">' + [-5, -1.6, 1.8, 5.2].map((x) => '<path d="M' + x + ' -11 l1.2 1.2 l-1.2 1.2 l-1.2 -1.2 Z"/>').join('') + '</g>' +
      '<g fill="' + o.wrap2 + '" opacity=".8">' + [-5.6, -2, 1.6, 5].map((x) => '<circle cx="' + x + '" cy="-20" r=".7"/>').join('') + '</g>' +
      '<path d="M1 -30 L2 -1 Q5.6 -.4 8.8 -1.4 L7.6 -30 Z" fill="#000" opacity=".12"/>' + folds('M-3 -26 Q-3.6 -14 -4.4 -2 M4 -26 Q4.4 -14 5 -2') +
      (o.baby ? '<path d="M-6.6 -46 L6.4 -40 L6.8 -36 L-7 -42 Z" fill="' + o.baby + '"/><path d="M-6.6 -46 L6.4 -40 M-6.8 -43.6 L6.6 -37.6" stroke="rgba(0,0,0,.22)" stroke-width=".4"/>' : '');
  } else if (k === 'kid') { // a boy in a short kaftan and shorts
    b += '<path d="M-3.6 -12 h3 v10.6 h-3 Z M.6 -12 h3 v10.6 h-3 Z" fill="' + sk(s) + '"/><path d="M-3.6 -12 h3 v10.6 h-1 Z" fill="#000" opacity=".1"/>' + sandal(-2.1, s) + sandal(2.1, s) +
      '<path d="M-4.6 -17 h9.2 v5.4 h-9.2 Z" fill="' + (o.pants || '#3A4A6A') + '"/>' +
      '<path d="M-5.4 -48.5 Q0 -50 5.4 -48.5 L7 -15 Q0 -13.8 -7 -15 Z" fill="' + o.robe + '"/><path d="M1 -49.6 Q5.4 -49.6 5.4 -48.5 L7 -15 Q3.4 -14.2 1.4 -14 Z" fill="#000" opacity=".13"/>' +
      folds('M-2.4 -34 Q-3.4 -24 -4.4 -15.6 M3 -32 Q4 -24 4.6 -15.6');
  }
  b += arm('l', o.al || 'down', sleeve, s, w, k === 'man' ? tr : '', o.hl || '');
  b += '<rect x="-1.7" y="-51.6" width="3.4" height="3.8" fill="' + SK[s] + '"/>';
  if (o.baby) b += '<g transform="translate(-6.8 -51.6)"><circle r="3.6" fill="' + sk(o.skin + 2) + '"/><path d="M-3.2 -.4 Q-3 -3.6 0 -3.8 Q3 -3.6 3.2 -.4 Q0 -2 -3.2 -.4 Z" fill="' + o.baby2 + '"/><circle cx="-1" cy=".2" r=".42" fill="#1A0E06"/><circle cx="1" cy=".2" r=".42" fill="#1A0E06"/><path d="M-.7 1.6 Q0 2.1 .7 1.6" stroke="#3A1A0A" stroke-width=".35" fill="none"/></g>';
  b += '<g transform="translate(0 -55)">' + head(o) + '</g>';
  if (o.shawl) b += '<path d="M5.4 -50 Q9.6 -44 9 -26 L6.4 -27 Q7 -40 3.6 -48 Z" fill="' + o.shawl + '"/><path d="M7.6 -44 Q8.6 -36 8 -27" stroke="rgba(0,0,0,.15)" stroke-width=".5" fill="none"/>';
  b += arm('r', o.ar || 'down', sleeve, s, w, k === 'man' ? tr : '', o.hr || '') + (o.front || '') + '</g>';
  return '<g class="x-p ' + (o.cls || '') + '">' + b + '</g>';
}
const at = (x, y, sc, inner) => '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">' + inner + '</g>';
const letterSheet = (x, y, r = 0) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><path d="M-3.6 -2.6 L3.6 -2.6 L3.6 2.6 L-3.6 2.6 Z" fill="#FBF7EC" stroke="#C9B48A" stroke-width=".25"/><path d="M-3.6 -2.6 L0 .2 L3.6 -2.6" stroke="#C9B48A" stroke-width=".3" fill="none"/><rect x="1.6" y="-2.1" width="1.4" height="1.6" fill="#2E7D32"/></g>';

/* ---------------- things in the street ---------------- */
const postbox = (x, y, sc) => '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><ellipse cy=".4" rx="7" ry="1.3" fill="rgba(40,24,10,.32)"/>' +
  '<path d="M-4.6 0 V-18 Q-4.6 -22.6 0 -23 Q4.6 -22.6 4.6 -18 V0 Z" fill="url(#ws4-pbox)"/>' +
  '<path d="M-5.6 -18.4 Q-5.6 -25.4 0 -25.8 Q5.6 -25.4 5.6 -18.4 Z" fill="#B71C1C"/><path d="M-5.6 -18.4 Q-5.6 -25.4 0 -25.8 Q-3.6 -24 -3.8 -18.4 Z" fill="#fff" opacity=".18"/><circle cy="-26.4" r="1" fill="#9A1A1A"/>' +
  '<path d="M-5.4 -18.6 H5.4 V-16.8 H-5.4 Z M-5.4 -1.8 H5.4 V0 H-5.4 Z" fill="#8E1414"/><rect x="-3" y="-14.8" width="6" height="1.3" rx=".6" fill="#1A0606"/><path d="M-3 -14.8 h6" stroke="#E57373" stroke-width=".3"/>' +
  '<rect x="-2.4" y="-11.2" width="4.8" height="3.3" rx=".4" fill="#F4E7C9"/><path d="M-1.6 -10.2 h3.2 M-1.6 -9.1 h2.2" stroke="#8E1414" stroke-width=".3"/><path d="M-3 -6 h6 v4 h-6 Z" fill="none" stroke="#8E1414" stroke-width=".4"/><circle cx="1.8" cy="-4" r=".35" fill="#E8C35A"/>' +
  '<path d="M-3.6 -3 Q-4 -10 -3.4 -16" stroke="#fff" stroke-width=".7" opacity=".14" fill="none"/></g>';
const bicycle = (x, y, sc) => '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')" fill="none" stroke-linecap="round"><ellipse cy="0" rx="14" ry="1" fill="rgba(40,24,10,.2)" stroke="none"/>' +
  [-8, 8].map((cx) => '<circle cx="' + cx + '" cy="-5" r="5" stroke="#1E1E1E" stroke-width="1.1"/><circle cx="' + cx + '" cy="-5" r="4.2" stroke="#9A9A9A" stroke-width=".25"/><path d="M' + (cx - 4) + ' -5 H' + (cx + 4) + ' M' + cx + ' -9 V-1 M' + (cx - 2.9) + ' -7.9 L' + (cx + 2.9) + ' -2.1 M' + (cx - 2.9) + ' -2.1 L' + (cx + 2.9) + ' -7.9" stroke="#B0B0B0" stroke-width=".2"/>').join('') +
  '<path d="M-8 -5 L-2 -5 L4 -12 L-4 -12 Z M-2 -5 L-5 -13 M4 -12 L8 -5 M3.4 -14 L4 -12" stroke="#1E5AA8" stroke-width=".95" stroke-linejoin="round"/><path d="M-7 -13.4 h3.6" stroke="#2A1A10" stroke-width="1.4"/><path d="M1.6 -14.6 Q3.4 -15.4 5.4 -14.2" stroke="#2A2A2A" stroke-width=".8"/>' +
  '<path d="M-12.4 -10 h6 v-3 h-6 Z" fill="#6B4422" stroke="none"/><path d="M-8 -5 L-11 -9.8" stroke="#3A3A3A" stroke-width=".6"/></g>';
const tyre = '<g class="x-tyre"><circle r="4.4" fill="none" stroke="#1E1E1E" stroke-width="1.9"/><circle r="4.4" fill="none" stroke="#4A4A4A" stroke-width=".5" stroke-dasharray="1 1"/><path d="M-3 -3 A4.4 4.4 0 0 1 2 -3.9" stroke="#fff" stroke-width=".4" opacity=".2" fill="none"/></g>';
const goat = '<g class="x-goat"><ellipse cy=".4" rx="9" ry="1.2" fill="rgba(40,24,10,.25)"/>' +
  '<path d="M-6 -2 V-7 M-4 -2 V-7 M4 -2 V-7 M6 -2 V-7" stroke="#5A4030" stroke-width="1.1" stroke-linecap="round"/><path d="M-6 -2 v2 M-4 -2 v2 M4 -2 v2 M6 -2 v2" stroke="#2A1A10" stroke-width="1.1"/>' +
  '<path d="M-7.6 -12 Q-8 -6.4 -3 -6 L5 -6 Q8 -6.6 7.8 -11 Q6 -14 0 -13.6 Q-6 -14 -7.6 -12 Z" fill="#EDE4D3"/><path d="M-6 -12 Q0 -10 6 -12 Q4 -8 -4 -8 Z" fill="#7A4A26"/>' +
  '<path d="M-2 -6.4 Q0 -8 4 -6.6" stroke="rgba(0,0,0,.15)" stroke-width=".5" fill="none"/><path d="M-7.6 -12 l-1.8 -1.6" stroke="#EDE4D3" stroke-width="1.2" stroke-linecap="round"/>' +
  '<g class="x-ghead"><circle cx="8" cy="-12" r="5" fill="none"/><path d="M6.6 -11.4 Q7 -16.4 10 -16 Q12.6 -15.6 12.8 -12.4 Q12.4 -10.8 11 -11 L8.6 -10 Z" fill="#7A4A26"/><path d="M8.4 -15.8 Q7.4 -18.4 5.6 -18.4" stroke="#3A2A1A" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M7.4 -15 Q5 -15 4.6 -13" stroke="#5A3418" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="10.4" cy="-14.2" r=".5" fill="#1A0E06"/><path d="M12.2 -11.2 Q12 -9.6 11 -9.2" stroke="#EDE4D3" stroke-width=".8" fill="none"/></g></g>';
const hen = (x, y, c, cls = '') => '<g transform="translate(' + x + ' ' + y + ')"><g class="x-hen ' + cls + '"><ellipse cy=".2" rx="3.4" ry=".6" fill="rgba(40,24,10,.25)"/><path d="M-1 0 L-.6 -2 M1 0 L.6 -2" stroke="#D89A2A" stroke-width=".45"/>' +
  '<path d="M-3.6 -5 Q-4.6 -2 -1 -1.6 L2 -1.8 Q3.6 -2.4 3.2 -4.6 L4.2 -6.8 Q3.4 -7.8 2.4 -6.6 Q1 -5 -1 -5.4 Q-2.8 -7 -3.6 -5 Z" fill="' + c + '"/><path d="M-3.6 -5 Q-5 -7.4 -4.2 -8.2 Q-2.8 -7 -2.6 -5.4 Z" fill="#2A2A2A" opacity=".8"/>' +
  '<path d="M-2 -3.6 Q0 -2.4 1.6 -3.4" stroke="rgba(0,0,0,.2)" stroke-width=".45" fill="none"/><path d="M3.6 -7.4 l.5 -.9 l.5 .8 Z" fill="#D32F2F"/><path d="M4.2 -6.2 l1.2 .4 l-1.1 .4 Z" fill="#E8A317"/><circle cx="3.6" cy="-6.6" r=".3" fill="#1A0E06"/></g></g>';

/* the post office's wall of brass P.O. boxes */
function poBoxes(x, y, cols, rows) {
  let s = '<rect x="' + (x - 1.2) + '" y="' + (y - 1.2) + '" width="' + (cols * 4.4 + 1.6) + '" height="' + (rows * 4.4 + 1.6) + '" fill="#5A4A3A" rx=".4"/>';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const bx = x + c * 4.4, by = y + r * 4.4;
    s += '<rect x="' + bx + '" y="' + by + '" width="4" height="4" fill="url(#ws4-brass)"/><rect x="' + (bx + .6) + '" y="' + (by + .6) + '" width="2.8" height="1" fill="#2A1A10" opacity=".55"/><circle cx="' + (bx + 3.1) + '" cy="' + (by + 2.9) + '" r=".35" fill="#3A2A10"/><path d="M' + (bx + .6) + ' ' + (by + 2.6) + ' h1.4" stroke="#6A4A10" stroke-width=".35"/>'; }
  return s;
}
/* a window with the burglar bars every Nigerian window has */
const barWin = (x, y, w, h) => '<rect x="' + (x - 1) + '" y="' + (y - 1) + '" width="' + (w + 2) + '" height="' + (h + 2) + '" fill="#D9CBA6"/><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#ws4-glass)"/>' +
  '<path d="M' + x + ' ' + y + ' l' + (w * .6) + ' ' + h + ' h' + (w * .2) + ' l-' + (w * .6) + ' -' + h + ' Z" fill="#fff" opacity=".12"/>' +
  '<g stroke="#2A3A2E" stroke-width=".5">' + Array.from({ length: Math.floor(w / 2.4) }, (_, i) => '<path d="M' + (x + 1.2 + i * 2.4) + ' ' + y + ' v' + h + '"/>').join('') + '<path d="M' + x + ' ' + (y + h / 2) + ' h' + w + '"/></g>' +
  '<g fill="none" stroke="#2A3A2E" stroke-width=".45">' + Array.from({ length: Math.floor(w / 4.8) }, (_, i) => '<circle cx="' + (x + 2.4 + i * 4.8) + '" cy="' + (y + h / 2) + '" r="1.1"/>').join('') + '</g>' +
  '<path d="M' + (x - 1.6) + ' ' + (y + h + 1.2) + ' h' + (w + 3.2) + '" stroke="#BFAE86" stroke-width="1.3"/><path d="M' + (x - 1.6) + ' ' + (y + h + 1.9) + ' h' + (w + 3.2) + '" stroke="#000" stroke-width=".5" opacity=".15"/>';

export function wasikaScene(): string {
  const W = 320, H = 200, R = rnd(7);
  // textures: plaster speckle, mud with straw, sand grit, tar grain
  let plaster = '', mud = '', sand = '', tar = '';
  for (let i = 0; i < 14; i++) plaster += '<circle cx="' + (R() * 12).toFixed(1) + '" cy="' + (R() * 10).toFixed(1) + '" r="' + (.15 + R() * .35).toFixed(2) + '" fill="' + (i % 3 ? '#8A7A58' : '#fff') + '" opacity="' + (i % 3 ? .18 : .35) + '"/>';
  for (let i = 0; i < 10; i++) mud += '<path d="M' + (R() * 10).toFixed(1) + ' ' + (R() * 8).toFixed(1) + ' l' + (1 + R()).toFixed(1) + ' ' + (R() - .5).toFixed(1) + '" stroke="' + (i % 2 ? '#E8C08A' : '#7A3A16') + '" stroke-width=".35" opacity=".45"/>';
  for (let i = 0; i < 12; i++) sand += '<ellipse cx="' + (R() * 14).toFixed(1) + '" cy="' + (R() * 6).toFixed(1) + '" rx="' + (.25 + R() * .5).toFixed(2) + '" ry=".22" fill="' + (i % 3 ? '#A88A5C' : '#FFF2D6') + '" opacity=".5"/>';
  for (let i = 0; i < 18; i++) tar += '<circle cx="' + (R() * 8).toFixed(1) + '" cy="' + (R() * 6).toFixed(1) + '" r="' + (.15 + R() * .3).toFixed(2) + '" fill="' + (i % 2 ? '#5A544C' : '#B2AA9C') + '" opacity=".5"/>';
  const pat = (id, w, h, inner) => '<pattern id="' + id + '" width="' + w + '" height="' + h + '" patternUnits="userSpaceOnUse">' + inner + '</pattern>';
  const skins = SK.map((c, i) => '<radialGradient id="ws4-sk' + i + '" cx=".38" cy=".34" r=".75"><stop offset="0" stop-color="' + SKL[i] + '"/><stop offset="1" stop-color="' + c + '"/></radialGradient>').join('');

  // the umbrella: ten panels in two colours with ribs, a scalloped hem
  let umb = ''; for (let i = 0; i < 10; i++) { const a0 = 258 + i * 6.8, a1 = a0 + 6.8;
    umb += '<path d="M292 56 L' + a0 + ' 74 Q' + (a0 + 3.4) + ' 77.4 ' + a1 + ' 74 Z" fill="' + (i % 2 ? '#F2C230' : '#D84315') + '"/>'; }
  umb = '<path d="M292 56 Q266 60 257 75 L327 75 Q318 60 292 56 Z" fill="#D84315"/>' + umb +
    '<path d="M292 56 Q300 64 327 75 L292 75 Z" fill="#000" opacity=".12"/>' +
    '<g stroke="#7A2A0A" stroke-width=".3" opacity=".6">' + Array.from({ length: 11 }, (_, i) => '<path d="M292 56 L' + (258 + i * 6.8) + ' 74"/>').join('') + '</g><path d="M292 56 v-2.6" stroke="#4A2E16" stroke-width="1.1"/><circle cx="292" cy="53.2" r="1.1" fill="#4A2E16"/>';
  const writer = person({ kind: 'man', skin: 3, robe: '#2F4F8F', trim: '#E8C35A', hat: 'zanna', hatc: '#F4EBD0', hatc2: '#2F4F8F', specs: 1, beard: '#2A1A10', al: 'type', ar: 'type', cls: 'x-writer' });
  const right =
    at(268, 142, .68, person({ kind: 'young', skin: 4, robe: '#F4F1EA', trim: '#2E7D32', hat: 'hula', hatc: '#2E7D32', hatc2: '#FFD54A', al: 'front', ar: 'front', cls: 'q1',
      hl: letterSheet(-1, -36, -12) }));
  const left =
    at(16, 148, .7, person({ kind: 'man', skin: 1, robe: '#E8E0CC', trim: '#8B6A3A', hat: 'borno', hatc: '#F2E8CF', hatc2: '#A3242C', hatc3: '#1E5B3A', beard: '#ECE8DE', specs: 1, al: 'read', ar: 'read', cls: 'x-reader',
      hl: '<path d="M-6 -44 L3 -45.6 L3.6 -36 L-5.4 -34.6 Z" fill="#FBF7EC" stroke="#C9B48A" stroke-width=".3"/><path d="M-4.4 -42.6 h6 M-4.2 -40.6 h6.2 M-4 -38.6 h5" stroke="#5A6AA8" stroke-width=".35"/>' })) +
    at(42, 146, .64, person({ kind: 'woman', skin: 2, robe: '#0277BD', wrap: '#C62828', wrap2: '#FFF3C0', hat: 'hijab', hatc: '#F48FB1', cheek: 1, al: 'down', ar: 'reach', cls: 'x-poster',
      hr: letterSheet(15.8, -37, 20) }));
  const kids =
    at(206, 154, .42, '<g class="x-kid1">' + person({ kind: 'kid', skin: 2, robe: '#E53935', trim: '#fff', hat: 'bare', cheek: 1, al: 'up', ar: 'down', pants: '#2E4A7A' }) + '</g>') +
    '<g transform="translate(216 150.4)"><g class="x-roll">' + tyre + '</g></g>' +
    at(226, 154, .4, '<g class="x-kid2">' + person({ kind: 'kid', skin: 4, robe: '#FFB300', trim: '#fff', hat: 'hula', hatc: '#1565C0', hatc2: '#fff', cheek: 1, al: 'front', ar: 'down',
      hr: '<path d="M8.8 -27.8 L1 -14" stroke="#6B4422" stroke-width="1.6" stroke-linecap="round"/>' }) + '</g>');

  return '<svg class="scene ws4" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('ws4-sky', '#7FC3E6', '#C4E6F2', '#F4E6C4') + lg('ws4-po', '#FFFBF0', '#F1E6CC') + lg('ws4-red', '#CE8650', '#B0663A') + lg('ws4-red2', '#C27844', '#9E5A2C') +
    lg('ws4-side', '#E6CC98', '#D4B07A') + lg('ws4-road', '#8E877C', '#7E776C', '#6E675C') + lg('ws4-glass', '#7FB2CE', '#3E6E8A') + lg('ws4-fascia', '#139A4A', '#0B6B33') +
    lg('ws4-door', '#2F6B45', '#1E4A2E') + lgx('ws4-pbox', '#D83A3A', '#C62828', '#8E1414') + lg('ws4-brass', '#D8B25A', '#A8822E') + lg('ws4-pole', '#9A8A78', '#6B5A48') +
    lgx('ws4-pillar', '#E8DAB8', '#FFF8E6', '#D6C496') + skins +
    pat('ws4-plaster', 12, 10, plaster) + pat('ws4-mudt', 10, 8, mud) + pat('ws4-sandt', 14, 6, sand) + pat('ws4-tart', 8, 6, tar) +
    '<radialGradient id="ws4-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6D0"/><stop offset=".45" stop-color="#FFE7A0" stop-opacity=".5"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#ws4-sky)"/><circle cx="232" cy="30" r="22" fill="url(#ws4-sun)"/><circle cx="232" cy="30" r="6" fill="#FFF3C6"/>' +
    cloud(150, 20, 1) + cloud(300, 40, .7) + cloud(40, 24, .6) +
    // far: a minaret and dome, pale roofs and a far tree line
    '<g fill="#DCCBA8" opacity=".85"><path d="M196 100 V44 l2.6 -6 l2.6 6 V100 Z"/><ellipse cx="198.6" cy="44" rx="3.6" ry="1.6"/><path d="M198.6 38 v-4" stroke="#DCCBA8" stroke-width=".6"/><path d="M174 100 Q188 72 202 100 Z"/><path d="M188 76 v-4" stroke="#DCCBA8" stroke-width=".6"/></g>' +
    '<g fill="#9DB08A" opacity=".55"><ellipse cx="120" cy="96" rx="22" ry="7"/><ellipse cx="236" cy="94" rx="18" ry="6"/></g>' +
    '<g fill="#D9B48A" opacity=".6"><path d="M96 100 V80 H140 V100 Z M210 100 V82 H250 V100 Z"/>' + zanko(96, 138, 80, 3) + zanko(210, 248, 82, 3) + '</g>' +
    // the town behind the letter: red-earth houses with zanko horns and relief
    '<path d="M74 130 V86 H136 V130 Z" fill="url(#ws4-red)"/><path d="M74 130 V86 H136 V130 Z" fill="url(#ws4-mudt)"/><g fill="#B0663A">' + zanko(74, 134, 86) + '</g>' + relief(104, 98) +
    '<path d="M98 130 V116 a5 5 0 0 1 10 0 V130 Z" fill="#3A1E0C"/><rect x="118" y="104" width="8" height="7" fill="#2A1A10"/><path d="M118 104 h8 M122 104 v7" stroke="#E8D3A8" stroke-width=".5"/>' +
    '<path d="M136 130 V92 H210 V130 Z" fill="#E4CFA4"/><path d="M136 130 V92 H210 V130 Z" fill="url(#ws4-plaster)"/><path d="M136 92 H210 V95 H136 Z" fill="#C8B080"/>' +
    '<path d="M210 130 V88 H258 V130 Z" fill="url(#ws4-red2)"/><path d="M210 130 V88 H258 V130 Z" fill="url(#ws4-mudt)"/><g fill="#9E5A2C">' + zanko(210, 256, 88) + '</g>' + relief(234, 100) +
    // poles and wires, birds sitting on the wire
    '<path d="M76 128 V30 M260 128 V34" stroke="url(#ws4-pole)" stroke-width="1.5"/><path d="M73 34 h6 M257 38 h6" stroke="#5A4A38" stroke-width="1"/><path d="M76 34 Q170 54 260 38 Q300 46 324 42 M76 37 Q170 57 260 41 Q300 50 324 46 M-4 46 Q36 40 76 34" stroke="#2A2A2A" stroke-width=".35" fill="none"/>' +
    '<g class="x-wire">' + [[150, 47.4], [156, 48.2], [292, 44.2]].map(([x, y]) => '<g transform="translate(' + x + ' ' + y + ')"><ellipse cy="-1.4" rx="1.4" ry="1.2" fill="#3A3A4A"/><circle cx="1" cy="-2.6" r=".8" fill="#3A3A4A"/><path d="M1.7 -2.6 l.8 .2 l-.8 .3 Z" fill="#E8B23A"/><path d="M-1.2 -1.2 l-1.4 .8" stroke="#3A3A4A" stroke-width=".6"/></g>').join('') + '</g>' +
    // THE POST OFFICE (left): flag on the roof, parapet, the green NIPOST fascia, plastered walls with a green dado
    '<path d="M47 50 V28" stroke="#9A9A9A" stroke-width=".8"/><g class="x-flag"><path d="M47.4 28.4 h4.4 v8 h-4.4 Z" fill="#008751"/><path d="M51.8 28.4 h4.4 v8 h-4.4 Z" fill="#FFFFFF"/><path d="M56.2 28.4 h4.4 v8 h-4.4 Z" fill="#008751"/><path d="M47.4 30 h13.2" stroke="#000" stroke-width=".4" opacity=".08"/></g>' +
    '<path d="M-6 50 H76 V56 H-6 Z" fill="#EFE4C8"/><path d="M-6 50 H76" stroke="#fff" stroke-width=".8" opacity=".7"/><path d="M-6 56 H76" stroke="#000" stroke-width=".6" opacity=".12"/>' +
    '<path d="M-6 56 H78 V70 H-6 Z" fill="url(#ws4-fascia)"/><path d="M-6 56.4 H78" stroke="#5FD38A" stroke-width=".5"/><path d="M-6 70 H78" stroke="#063A1C" stroke-width="1.2"/>' +
    '<g transform="translate(12 63)"><circle r="5.4" fill="#fff"/><circle r="4.4" fill="#0B7A3B"/><path d="M-2.8 -1.8 h5.6 v3.8 h-5.6 Z" fill="#fff"/><path d="M-2.8 -1.8 L0 .4 L2.8 -1.8" stroke="#0B7A3B" stroke-width=".5" fill="none"/></g>' +
    '<text x="44" y="66.4" text-anchor="middle" font-size="9.6" font-weight="800" fill="#FFFFFF" font-family="Baloo 2,sans-serif" letter-spacing=".6">NIPOST</text>' +
    '<path d="M-6 70 H76 V132 H-6 Z" fill="url(#ws4-po)"/><path d="M-6 70 H76 V132 H-6 Z" fill="url(#ws4-plaster)"/>' +
    '<path d="M-6 120 H76 V132 H-6 Z" fill="#2E7D4A"/><path d="M-6 120 H76" stroke="#1B5E32" stroke-width=".8"/><path d="M-6 120 H76 V132 H-6 Z" fill="url(#ws4-plaster)" opacity=".6"/>' +
    '<path d="M70 70 V132 H76 V70 Z" fill="url(#ws4-pillar)"/><path d="M70 70 V132" stroke="#000" stroke-width=".4" opacity=".1"/>' +
    '<path d="M60 74 q3 6 1 12 M8 104 q-2 4 1 8" stroke="#9A8A68" stroke-width=".35" fill="none" opacity=".6"/>' +
    '<rect x="18" y="72.6" width="34" height="6.8" rx=".8" fill="#FFF8E1" stroke="#0B7A3B" stroke-width=".6"/><text x="35" y="77.6" text-anchor="middle" font-size="4" textLength="28" lengthAdjust="spacingAndGlyphs" font-weight="800" fill="#0B6B33" font-family="Baloo 2,sans-serif">GIDAN WAYA</text>' +
    barWin(2, 82, 14, 14) +
    '<rect x="1" y="99" width="9" height="5.4" rx=".6" fill="#D6D3CC"/><g stroke="#8A8780" stroke-width=".35">' + [2.4, 3.6, 4.8, 6, 7.2, 8.4].map((x) => '<path d="M' + x + ' 99.6 v4.2"/>').join('') + '</g><path d="M6 104.4 q.6 3 -.4 6" stroke="#5A6A70" stroke-width=".35" fill="none"/>' +
    // the door: two green leaves, one open on the dark hall
    '<path d="M20 132 V90 H38 V132 Z" fill="#E2D2A8"/><path d="M21.2 132 V91.2 H36.8 V132 Z" fill="#1E140C"/><path d="M29 132 V91.2 H36.8 V132 Z" fill="url(#ws4-door)"/><path d="M21.2 132 V91.2 L25 92.6 V131 Z" fill="url(#ws4-door)"/>' +
    '<path d="M30 94 h5.6 v14 h-5.6 Z M30 111 h5.6 v18 h-5.6 Z" fill="none" stroke="#174A2A" stroke-width=".5"/><circle cx="30.6" cy="112" r=".45" fill="#E8C35A"/><path d="M26 108 h3 v24 h-3" fill="#3A2A1E" opacity=".6"/>' +
    '<path d="M18 132 h22 v1.6 h-22 Z M16 133.6 h26 v1.6 h-26 Z" fill="#CFC2A0"/><path d="M16 135.2 h26" stroke="#000" stroke-width=".5" opacity=".15"/>' +
    // the P.O. boxes
    poBoxes(44, 84, 5, 5) + '<path d="M42.8 105.6 h24.4" stroke="#BFAE86" stroke-width="1"/>' +
    barWin(52, 108.6, 12, 9) +
    // the street: the sandy side with grit, the tarred road with grain, cracks and a patched hole, kerb stones
    '<path d="M-4 129 H324 V200 H-4 Z" fill="url(#ws4-side)"/><path d="M-4 129 H324 V200 H-4 Z" fill="url(#ws4-sandt)"/>' +
    '<g fill="#B98A50" opacity=".3"><ellipse cx="100" cy="142" rx="22" ry="1.3"/><ellipse cx="190" cy="146" rx="16" ry="1"/><ellipse cx="300" cy="146" rx="18" ry="1.2"/></g>' +
    '<path d="M-4 152 Q160 148 324 152 V200 H-4 Z" fill="url(#ws4-road)"/><path d="M-4 152 Q160 148 324 152 V200 H-4 Z" fill="url(#ws4-tart)"/>' +
    '<g fill="#CFC5B2">' + [0, 22, 44, 66, 88, 110, 132, 154, 176, 198, 220, 242, 264, 286, 308].map((x, i) => '<rect x="' + x + '" y="' + (149.4 + Math.abs(160 - x) / 160 * 1.6).toFixed(1) + '" width="20.6" height="2.6" rx=".5" fill="' + (i % 2 ? '#F2EADB' : '#2E2E2E') + '" opacity="' + (i % 2 ? .9 : .75) + '"/>').join('') + '</g>' +
    '<path d="M-4 152.4 Q160 148.6 324 152.4" stroke="#000" stroke-width=".7" opacity=".2" fill="none"/>' +
    '<g fill="none" stroke="#4A443C" stroke-width=".45" opacity=".7"><path d="M30 166 l6 2 l4 -1 l5 3 M200 184 l5 -3 l7 1 M260 170 l3 3 l6 0"/></g>' +
    '<ellipse cx="96" cy="190" rx="10" ry="2.4" fill="#5E584E" opacity=".6"/><ellipse cx="96" cy="189.6" rx="8.6" ry="1.6" fill="#4A453E" opacity=".6"/>' +
    '<g fill="#F2EADB" opacity=".55">' + [20, 70, 120, 170, 220, 270].map((x) => '<rect x="' + x + '" y="175" width="20" height="1.4" rx=".7"/>').join('') + '</g>' +
    '<g fill="#6E665A" opacity=".3"><ellipse cx="60" cy="186" rx="30" ry="3"/><ellipse cx="290" cy="192" rx="20" ry="2"/></g>' +
    // in front of the post office: the bicycle, the pillar box, the woman posting, the old man reading
    bicycle(31, 136, .9) + postbox(58, 147, 1.2) + left +
    // the letter writer under his umbrella, the young man waiting
    '<path d="M292 56 V114" stroke="#4A2E16" stroke-width="1.1"/>' + umb +
    '<g fill="#000" opacity=".12"><ellipse cx="292" cy="140" rx="30" ry="2.4"/></g>' +
    at(304, 138, .8, writer) +
    '<g transform="translate(-4 4)"><path d="M276 112 H322 V115.4 H276 Z" fill="#8B5A2B"/><path d="M276 112 H322" stroke="#B07A44" stroke-width=".7"/><path d="M276 115.4 H322" stroke="#000" stroke-width=".5" opacity=".2"/><path d="M279 115 L278 139 M318 115 L319 139" stroke="#5E3A1C" stroke-width="1.7"/><path d="M280 124 H317" stroke="#5E3A1C" stroke-width=".8"/>' +
    '<g class="x-type" transform="translate(-6 0)"><rect x="287" y="104.8" width="19" height="7.6" rx="1.4" fill="#37474F"/><rect x="287" y="104.8" width="19" height="2" rx="1" fill="#fff" opacity=".12"/><rect x="289" y="102.4" width="15" height="3" rx="1" fill="#263238"/><path d="M290 98.4 L303 98.4 L303 103 L290 103 Z" fill="#FFFFFF"/><path d="M291 99.6 h10 M291 100.8 h8 M291 102 h9" stroke="#8A8A8A" stroke-width=".3"/>' +
    '<g fill="#CFD8DC">' + [0, 1, 2, 3, 4, 5].map((i) => '<circle cx="' + (290 + i * 2.5) + '" cy="108" r=".62"/><circle cx="' + (291.2 + i * 2.5) + '" cy="110" r=".62"/>').join('') + '</g></g>' +
    letterSheet(278, 110, -8) + '<path d="M309 110 h3.6 v2 h-3.6 Z" fill="#1565C0"/><path d="M314 108 l3 3" stroke="#1F4E9C" stroke-width=".7"/></g>' +
    right +
    // between the letter and the keys: the boys and their tyre, a goat, hens
    '<g transform="translate(244 152)">' + goat + '</g>' + hen(186, 149, '#A0522D') + hen(132, 152, '#F4F0E6', 'h2') + kids +
    '</svg>';
}

/* ---------------- the post rider: an okada (Bajaj-style), a rider in a face cap with his green POST bag ---------------- */
export function postRider(): string {
  const wheel = (cx) => '<g transform="translate(' + cx + ' 100)"><g class="ws4w"><circle r="21" fill="#1A1A1A"/><circle r="17.4" fill="none" stroke="#3A3A3A" stroke-width="1.2"/><circle r="15.6" fill="none" stroke="url(#ws4r-chrome)" stroke-width="2.2"/>' +
    '<g stroke="#C8CDD2" stroke-width=".55">' + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, b = a + .5; return '<path d="M' + (3.6 * Math.cos(a)).toFixed(1) + ' ' + (3.6 * Math.sin(a)).toFixed(1) + ' L' + (15 * Math.cos(b)).toFixed(1) + ' ' + (15 * Math.sin(b)).toFixed(1) + '"/>'; }).join('') + '</g>' +
    '<circle r="4.6" fill="url(#ws4r-chrome)"/><circle r="1.6" fill="#555"/><path d="M-15 -10 A18 18 0 0 1 4 -18" stroke="#fff" stroke-width="1" opacity=".18" fill="none"/>' +
    '<g fill="#111">' + Array.from({ length: 18 }, (_, i) => { const a = i * Math.PI / 9; return '<circle cx="' + (20.4 * Math.cos(a)).toFixed(1) + '" cy="' + (20.4 * Math.sin(a)).toFixed(1) + '" r=".9"/>'; }).join('') + '</g></g></g>';
  const rs = 2;   // rider skin index
  return '<svg class="achaba ws4r" viewBox="0 0 200 130" aria-hidden="true"><defs>' +
    lg('ws4r-tank', '#E53935', '#B71C1C', '#7F0F0F') + lgx('ws4r-chrome', '#8A9096', '#F4F6F8', '#B8BEC4', '#6A7076') + lg('ws4r-chromev', '#F4F6F8', '#9AA0A6') +
    lg('ws4r-shirt', '#2E8B4A', '#1B5E32') + lg('ws4r-bag', '#3E8E3A', '#24602A') + lg('ws4r-seat', '#3A3A3A', '#121212') +
    '<radialGradient id="ws4r-skin" cx=".38" cy=".34" r=".75"><stop offset="0" stop-color="' + SKL[rs] + '"/><stop offset="1" stop-color="' + SK[rs] + '"/></radialGradient></defs>' +
    '<ellipse cx="102" cy="122" rx="88" ry="5" fill="rgba(40,24,10,.32)"/>' +
    '<g class="ws4rb">' +
    // the rear rack with the green POST box and the plate
    '<path d="M24 66 H68" stroke="#2A2A2A" stroke-width="2.4" stroke-linecap="round"/><path d="M30 66 L40 84 M60 66 L50 82" stroke="#2A2A2A" stroke-width="1.6"/>' +
    '<rect x="22" y="40" width="40" height="26" rx="2.4" fill="#F2C230"/><rect x="22" y="40" width="40" height="5" rx="2" fill="#fff" opacity=".2"/><rect x="22" y="58" width="40" height="8" fill="#000" opacity=".1"/>' +
    '<text x="42" y="57.6" text-anchor="middle" font-size="12" font-weight="800" fill="#1B5E32" font-family="Baloo 2,sans-serif">POST</text><path d="M24 46 h36" stroke="#C99A10" stroke-width=".8"/>' +
    '<path d="M14 82 Q20 70 40 70 Q58 70 66 80" stroke="url(#ws4r-tank)" stroke-width="5.4" fill="none" stroke-linecap="round"/>' +
    '<rect x="10" y="78" width="15" height="9" rx="1.2" fill="#FFFFFF" stroke="#9A9A9A" stroke-width=".6"/><path d="M12 81 h11" stroke="#2E7D32" stroke-width="1.4"/><path d="M12.6 84.4 h10" stroke="#2E7D32" stroke-width=".9" stroke-dasharray="1.6 .8"/><circle cx="8" cy="78" r="2.4" fill="#E53935"/>' +
    wheel(46) + wheel(160) +
    // the swing arm, shocks, chain guard
    '<path d="M46 100 L96 96" stroke="#2A2A2A" stroke-width="4.4" stroke-linecap="round"/><path d="M50 98 L92 94.6" stroke="#4A4A4A" stroke-width="1.6"/>' +
    '<path d="M54 98 L64 70" stroke="url(#ws4r-chromev)" stroke-width="3" stroke-linecap="round"/><path d="M55.6 92 l3 -8 M57.6 86 l3 -8" stroke="#555" stroke-width="2.4"/>' +
    // the engine block and the chrome exhaust running back
    '<path d="M88 78 h30 l4 6 v14 q0 4 -4 4 h-26 q-6 0 -6 -6 Z" fill="#3A3E44"/><g stroke="#6A7076" stroke-width="1.2">' + [82, 86, 90].map((y) => '<path d="M92 ' + y + ' h24"/>').join('') + '</g><circle cx="102" cy="96" r="5" fill="url(#ws4r-chrome)"/><circle cx="102" cy="96" r="2" fill="#555"/>' +
    '<path d="M118 92 Q114 106 92 108 L60 108" stroke="url(#ws4r-chromev)" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
    '<path d="M28 102 L66 104 Q72 106 66 112 L30 112 Q24 108 28 102 Z" fill="url(#ws4r-chromev)"/><path d="M34 104.6 L62 106" stroke="#fff" stroke-width="1.2" opacity=".5"/><path d="M28 102 Q24 108 30 112" stroke="#555" stroke-width="1.6" fill="#2A2A2A"/>' +
    '<g class="ws4puff">' + [[24, 106, 3.4], [16, 102, 4.6], [6, 96, 6]].map(([x, y, r], i) => '<circle class="p' + i + '" cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#C8C2B8" opacity=".7"/>').join('') + '</g>' +
    // side panel, the long seat, the tank with knee pad and a stripe
    '<path d="M72 70 L98 70 L96 88 L78 88 Z" fill="#1E1E1E"/><path d="M76 74 h16 v8 h-14 Z" fill="#B71C1C"/><path d="M78 76 h10" stroke="#fff" stroke-width=".9" opacity=".6"/>' +
    '<path d="M48 62 Q50 56 62 56 L108 58 Q114 60 112 66 L52 68 Q46 67 48 62 Z" fill="url(#ws4r-seat)"/><path d="M56 59 Q80 57 108 60" stroke="#fff" stroke-width=".8" opacity=".14" fill="none"/>' +
    '<path d="M104 56 Q112 46 132 48 Q144 50 146 60 L140 72 Q124 74 108 70 Z" fill="url(#ws4r-tank)"/><path d="M112 52 Q124 48 138 52" stroke="#fff" stroke-width="2" opacity=".35" fill="none" stroke-linecap="round"/>' +
    '<path d="M110 64 Q124 68 140 64" stroke="#FFD54A" stroke-width="1.4" fill="none"/><ellipse cx="118" cy="62" rx="5" ry="3.4" fill="#2A2A2A"/>' +
    // the front: forks, mudguard, headlamp with its visor, handlebar and mirror
    '<path d="M148 56 L160 100" stroke="url(#ws4r-chromev)" stroke-width="4" stroke-linecap="round"/><path d="M144 58 L156 100" stroke="#8A9096" stroke-width="1.4"/>' +
    '<path d="M144 82 Q160 72 176 84" stroke="#B71C1C" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
    '<path d="M146 46 Q158 42 166 50 Q166 60 156 62 Q146 60 146 46 Z" fill="#1E1E1E"/><circle cx="160" cy="54" r="6" fill="url(#ws4r-chrome)"/><circle cx="161" cy="54" r="4.4" fill="#FFF6C8"/><circle cx="162.4" cy="52.6" r="1.4" fill="#fff"/>' +
    '<path d="M150 46 L140 34 M140 34 h-6" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/><path d="M144 36 L148 22" stroke="#555" stroke-width="1"/><ellipse cx="148.6" cy="20.6" rx="3" ry="2.2" fill="#2A2A2A"/><ellipse cx="149" cy="20.2" rx="1.8" ry="1.2" fill="#9EC6DC"/>' +
    // the rider: trousers, sandal on the peg, the green shirt, the strap and the POST bag, arms to the bars, a face cap
    '<g class="ws4rider">' +
    '<path d="M76 62 Q100 58 120 66 L124 72 Q100 70 80 72 Z" fill="#2E3440"/><path d="M118 64 Q126 66 124 74 L116 96 L108 94 L114 72 Z" fill="#2E3440"/><path d="M116 72 L110 92" stroke="#000" stroke-width="1" opacity=".2"/>' +
    '<path d="M104 96 Q108 92 116 94 Q122 96 120 99 L104 99 Z" fill="#3A2416"/><path d="M106 95 Q112 93 117 95" stroke="url(#ws4r-skin)" stroke-width="2.4" fill="none"/>' +
    '<path d="M74 64 Q72 44 82 30 Q92 22 102 26 Q110 30 108 46 L104 64 Q90 68 74 64 Z" fill="url(#ws4r-shirt)"/><path d="M96 26 Q108 30 106 46 L102 64 L96 64 Q100 44 96 26 Z" fill="#000" opacity=".12"/>' +
    '<path d="M80 40 Q84 52 82 62 M90 34 Q94 48 92 64" stroke="rgba(0,0,0,.18)" stroke-width=".9" fill="none"/><path d="M92 26 L96 34 L100 27" stroke="#FFD54A" stroke-width="1" fill="none"/>' +
    '<path d="M98 27 L74 58" stroke="#5A3A1E" stroke-width="2.6"/><path d="M62 50 Q60 44 66 44 L80 46 Q84 48 82 54 L80 66 Q72 68 64 66 Q60 60 62 50 Z" fill="url(#ws4r-bag)"/><path d="M62 48 Q72 44 82 50 L81 56 Q72 52 62 54 Z" fill="#1E5224"/>' +
    '<text x="71.6" y="63.6" text-anchor="middle" font-size="5.6" font-weight="800" fill="#FFD54A" font-family="Baloo 2,sans-serif">POST</text><circle cx="72" cy="54" r="1" fill="#E8C35A"/>' +
    '<path d="M98 30 Q114 36 122 40 Q132 40 138 36" stroke="url(#ws4r-shirt)" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M100 34 Q114 40 122 43" stroke="#000" stroke-width="2" opacity=".12" fill="none"/>' +
    '<ellipse cx="139.6" cy="35.6" rx="3" ry="2.6" fill="url(#ws4r-skin)"/><path d="M138 33.4 q2.6 -.4 3.4 1.4" stroke="' + SK[rs] + '" stroke-width="1" fill="none"/>' +
    '<rect x="91" y="18" width="7" height="8" fill="' + SK[rs] + '"/>' +
    '<g transform="translate(96 10)"><path d="M0 -9.6 C6.6 -9.6 10 -5.6 10 .4 C10 5.6 7 9.8 1.6 10 C-4.4 10 -9.2 6 -9.4 .2 C-9.6 -6 -5.6 -9.6 0 -9.6 Z" fill="url(#ws4r-skin)"/>' +
    '<path d="M9.6 -1 Q12.2 1.6 10 3.4" fill="url(#ws4r-skin)" stroke="' + SK[rs] + '" stroke-width=".6"/><path d="M10.2 2.8 Q9.4 3.6 8.6 3" stroke="#3A1A0A" stroke-width=".5" fill="none"/>' +
    '<ellipse cx="5.4" cy="-1" rx="1.6" ry="1.1" fill="#F6EEDF"/><circle cx="6.1" cy="-1" r=".85" fill="#2A1508"/><circle cx="6.4" cy="-1.3" r=".3" fill="#fff"/><path d="M3.6 -3.4 q2 -1.2 4 -.3" stroke="#1E1008" stroke-width=".9" fill="none" stroke-linecap="round"/>' +
    '<path d="M5.4 6 Q7.6 6.8 9 5.6" stroke="#5A2412" stroke-width="1" fill="none" stroke-linecap="round"/><ellipse cx="-2.4" cy="1.6" rx="2" ry="2.6" fill="' + SK[rs] + '"/><path d="M-2.8 .4 q1 1 .2 2.4" stroke="#000" stroke-width=".5" opacity=".3" fill="none"/>' +
    '<path d="M-9.8 -1.6 Q-10.6 -12.4 0 -12.8 Q9.8 -12.6 10 -3.4 Z" fill="#F4F1EA"/><path d="M4 -12 Q9.8 -10.4 10 -3.4 L4 -2.8 Z" fill="#000" opacity=".1"/><path d="M8 -4.6 Q15 -5.4 19 -2.6 Q14 -.8 8 -1.8 Z" fill="#1B5E32"/><path d="M-6 -5 Q0 -6 6 -5" stroke="#1B5E32" stroke-width="1.6" fill="none"/><circle cx="0" cy="-12.6" r="1" fill="#1B5E32"/></g>' +
    '</g></g></svg>';
}

/* ---------------- the envelope: paper, the open flap, the photo, the stamp, the postmark ---------------- */
export function envelopeArt(): string {
  const R = rnd(3); let fib = '';
  for (let i = 0; i < 26; i++) { const x = R() * 40, y = R() * 30, a = R() * 6 - 3; fib += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' q2 ' + a.toFixed(1) + ' 4.4 ' + (a * .4).toFixed(1) + '" stroke="' + (i % 4 ? '#C9B48A' : '#FFFFFF') + '" stroke-width=".35" fill="none" opacity="' + (i % 4 ? .35 : .7) + '"/>'; }
  for (let i = 0; i < 18; i++) fib += '<circle cx="' + (R() * 40).toFixed(1) + '" cy="' + (R() * 30).toFixed(1) + '" r="' + (.2 + R() * .35).toFixed(2) + '" fill="#A8946A" opacity=".22"/>';
  // the stamp's perforated edge: a mask with half-holes along every side
  let holes = ''; for (let x = 4; x < 100; x += 8) holes += '<circle cx="' + x + '" cy="0" r="2.6"/><circle cx="' + x + '" cy="120" r="2.6"/>';
  for (let y = 4; y < 120; y += 8) holes += '<circle cx="0" cy="' + y + '" r="2.6"/><circle cx="100" cy="' + y + '" r="2.6"/>';
  const stamp = '<svg viewBox="-3 -3 106 126" aria-hidden="true"><defs><mask id="ws4-perf"><rect x="0" y="0" width="100" height="120" fill="#fff"/><g fill="#000">' + holes + '</g></mask>' +
    lg('ws4-ssky', '#5EB3E0', '#C6E6F2', '#FBE3A8') + '</defs>' +
    '<g mask="url(#ws4-perf)"><rect x="0" y="0" width="100" height="120" fill="#FFFDF6"/><rect x="0" y="0" width="100" height="120" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="3"/></g>' +
    '<rect x="10" y="10" width="80" height="84" fill="url(#ws4-ssky)"/><circle cx="68" cy="32" r="9" fill="#FFF0A8"/>' +
    // a little picture: a Hausa house with zanko horns, a dome and a palm, green fields
    '<path d="M10 80 Q50 70 90 78 V94 H10 Z" fill="#6E9E48"/><path d="M10 88 Q50 82 90 88 V94 H10 Z" fill="#4C7D34"/>' +
    '<path d="M22 82 V58 H58 V82 Z" fill="#C8783E"/><path d="M22 58 l3 -7 l3 7 M52 58 l3 -7 l3 7" fill="#C8783E"/><path d="M36 82 V72 a4 4 0 0 1 8 0 V82 Z" fill="#4A2412"/>' +
    '<path d="M27 62 q13 -6 26 0 M30 66 l4 -3 l4 3 l4 -3 l4 3 l4 -3" stroke="#FFF1D6" stroke-width="1.1" fill="none"/>' +
    '<path d="M76 84 Q74 64 77 48" stroke="#6B4422" stroke-width="2.4" fill="none"/><g fill="#2E7D32"><path d="M77 48 q-12 -4 -16 4 q9 -4 16 -4 Z"/><path d="M77 48 q12 -6 16 2 q-9 -3 -16 -2 Z"/><path d="M77 48 q-4 -10 -12 -10 q7 3 12 10 Z"/><path d="M77 48 q4 -11 12 -10 q-8 3 -12 10 Z"/></g>' +
    '<rect x="10" y="10" width="80" height="84" fill="none" stroke="#1B5E32" stroke-width="2"/>' +
    '<text x="50" y="108" text-anchor="middle" font-size="11" font-weight="800" fill="#1B5E32" font-family="Baloo 2,sans-serif" letter-spacing="1">NIGERIA</text><text x="84" y="22" text-anchor="middle" font-size="9" font-weight="800" fill="#B71C1C" font-family="Baloo 2,sans-serif">₦50</text></svg>';
  const pmark = '<svg viewBox="0 0 160 100" aria-hidden="true"><g fill="none" stroke="#2A2F6B" stroke-linecap="round">' +
    '<circle cx="50" cy="50" r="40" stroke-width="3.2"/><circle cx="50" cy="50" r="30" stroke-width="1.8"/>' +
    '<path d="M24 50 h52" stroke-width="2"/><path d="M95 30 q8 -6 16 0 t16 0 t16 0 t14 0 M95 44 q8 -6 16 0 t16 0 t16 0 t14 0 M95 58 q8 -6 16 0 t16 0 t16 0 t14 0 M95 72 q8 -6 16 0 t16 0 t16 0 t14 0" stroke-width="2.6"/></g>' +
    '<g fill="#2A2F6B" font-family="Baloo 2,sans-serif" font-weight="800" text-anchor="middle"><text x="50" y="44" font-size="12">KANO</text><text x="50" y="66" font-size="10">26·10</text></g></svg>';
  return '<svg class="flap" viewBox="0 0 620 60" preserveAspectRatio="none" aria-hidden="true"><path d="M4 60 L300 4 Q310 0 320 4 L616 60 Z" fill="#E9DDC0"/><path d="M4 60 L300 4 Q310 0 320 4 L616 60 Z" fill="url(#ws4-fib)"/>' +
    '<path d="M40 54 L304 10 Q310 8 316 10 L580 54" stroke="#D6C59C" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M4 60 L616 60" stroke="#B8A57A" stroke-width="3"/></svg>' +
    '<svg class="paper" viewBox="0 0 620 260" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="ws4-fib" width="40" height="30" patternUnits="userSpaceOnUse">' + fib + '</pattern>' +
    '<radialGradient id="ws4-pshade" cx=".45" cy=".4" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#7A5A20" stop-opacity=".16"/></radialGradient></defs>' +
    '<rect width="620" height="260" fill="#FBF6EA"/><rect width="620" height="260" fill="url(#ws4-fib)"/><rect width="620" height="260" fill="url(#ws4-pshade)"/>' +
    '<path d="M0 0 L620 0" stroke="#fff" stroke-width="3" opacity=".8"/><path d="M0 258 H620" stroke="#B8A57A" stroke-width="3" opacity=".6"/></svg>' +
    '<span class="to"><img alt=""></span>' +
    '<span class="stamp2">' + stamp + '</span><span class="pmark">' + pmark + '</span>' +
    '<div class="hand2"></div>';
}

/* ---------------- ink: a hand-written capital, and the splat of a wrong letter ---------------- */
const INK = {
  A: 'M.6 14 L5 .4 L9.4 14 M2.4 8.8 Q5 8 7.8 8.8', B: 'M1.5 14 L1.5 .6 M1.5 .8 C9 -.4 9.4 6.4 1.8 6.8 C10.6 6.4 10.6 14.6 1.5 13.6',
  C: 'M9.2 2.6 C6.8 -.6 .6 .4 .8 7 C1 13.8 7.2 15 9.4 11.4', D: 'M1.5 .6 L1.5 14 M1.5 .6 C11 0 11 14.6 1.5 13.8',
  E: 'M9 .8 L1.5 .6 L1.5 13.8 L9.2 13.6 M1.5 7 L7 7.2', F: 'M9 .8 L1.5 .6 L1.5 14 M1.5 7 L7 7.2',
  G: 'M9 2.6 C6.6 -.6 .6 .4 .8 7 C1 14 8 15 9.2 10.6 L9.2 8 L5.6 8', H: 'M1.2 .4 L1.2 14 M8.8 .4 L8.8 14 M1.2 7 L8.8 7.2',
  I: 'M5 .4 L5 14 M2.4 .5 L7.6 .5 M2.4 13.8 L7.6 13.8', J: 'M8 .4 L8 10 C8 14.6 1.6 14.6 1.4 10.6',
  K: 'M1.4 .4 L1.4 14 M9 .6 L1.6 8.2 M4 6 L9.4 14', L: 'M1.6 .4 L1.6 13.8 L9 13.6', M: 'M.6 14 L1.4 .6 L5 9 L8.6 .6 L9.4 14',
  N: 'M1 14 L1.2 .6 L8.8 13.6 L9 .4', O: 'M5 .5 C-.6 .5 -.6 14 5 14 C10.6 14 10.6 .5 5 .5 Z', P: 'M1.5 14 L1.5 .6 C10 -.4 10 8 1.6 7.4',
  Q: 'M5 .5 C-.6 .5 -.6 14 5 14 C10.6 14 10.6 .5 5 .5 Z M6 10 L9.6 14.4', R: 'M1.5 14 L1.5 .6 C10 -.4 10 8 1.6 7.4 M4.4 7.6 L9.4 14',
  S: 'M8.8 2.2 C7 -.4 1.2 0 1.4 3.6 C1.6 7 8.8 6.4 8.8 10.4 C8.8 14.6 2 14.6 .8 11.6', T: 'M.6 .8 L9.4 .6 M5 .7 L5 14',
  U: 'M1.2 .4 L1.2 9.6 C1.2 14.8 8.8 14.8 8.8 9.6 L8.8 .4', V: 'M.6 .4 L5 14 L9.4 .4', W: 'M.2 .4 L2.6 14 L5 5 L7.4 14 L9.8 .4',
  X: 'M1 .4 L9 14 M9 .4 L1 14', Y: 'M.8 .4 L5 7.2 L9.2 .4 M5 7.2 L5 14', Z: 'M1 .8 L9 .6 L1 13.8 L9.4 13.6',
};
export function inkLetter(L: string): string {
  const d = INK[L] || INK.O, st = d.match(/M(-?[\d.]+) (-?[\d.]+)/);
  return '<svg class="ink" viewBox="-3 -2 16 18" aria-hidden="true"><g transform="skewX(-9) translate(1.6 0)">' +
    '<path d="' + d + '" fill="none" stroke="#2B3A8C" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" opacity=".22"/>' +
    '<path d="' + d + '" fill="none" stroke="#1A2466" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>' +
    (st ? '<circle cx="' + st[1] + '" cy="' + st[2] + '" r=".95" fill="#1A2466"/>' : '') + '</g></svg>';
}
export function splat(): string {
  return '<svg class="splat" viewBox="-20 -20 40 44" aria-hidden="true"><g fill="#1A2466">' +
    '<path d="M0 -11 C5 -12 6 -6 10 -7 C14 -8 13 -2 10 0 C14 3 12 8 7 7 C6 12 0 12 -2 8 C-6 12 -11 9 -9 5 C-14 4 -13 -2 -9 -2 C-12 -7 -6 -11 -3 -8 C-3 -10 -1 -11 0 -11 Z"/>' +
    '<circle cx="13" cy="-11" r="1.8"/><circle cx="-14" cy="-9" r="1.3"/><circle cx="15" cy="6" r="1.1"/><circle cx="-15" cy="9" r="1.6"/>' +
    '<path d="M2 9 Q2.6 15 1.4 19 Q.4 21 .2 18 Q.4 13 -.4 9 Z"/></g><path d="M-4 -6 Q0 -9 4 -6" stroke="#fff" stroke-width="1.2" opacity=".25" fill="none" stroke-linecap="round"/></svg>';
}

/* ---------------- the game's sounds: WebAudio, short and gentle ---------------- */
export function wasikaSound(run) {
  let ac = null, nb = null;
  const A = () => { if (run && run.dead) return null; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; } catch (e) { return null; } };
  const noise = (a) => { if (nb) return nb; nb = a.createBuffer(1, a.sampleRate * 2, a.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return nb; };
  const env = (g, t, peak, a, r) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + r); };
  const burst = (a, t, dur, type, f0, f1, q, peak) => { const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = noise(a);
    f.type = type; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q; env(g, t, peak, .008, dur);
    s.connect(f).connect(g).connect(a.destination); s.start(t, Math.random()); s.stop(t + dur + .05); };
  const tone = (a, t, type, f0, f1, peak, at, rel) => { const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + at + rel); env(g, t, peak, at, rel); o.connect(g).connect(a.destination); o.start(t); o.stop(t + at + rel + .05); };
  return {
    /* the nib scratching a letter on: three little strokes */
    pen() { const a = A(); if (!a) return; const t = a.currentTime + .01; [0, .07, .15].forEach((d, i) => burst(a, t + d, .06 + i * .015, 'bandpass', 3800 + i * 500, 2600, 2.4, .07)); },
    /* a wrong letter: a soft wet blot, then a gentle falling tone */
    blot() { const a = A(); if (!a) return; const t = a.currentTime + .01; burst(a, t, .18, 'lowpass', 1400, 220, .8, .22); tone(a, t, 'sine', 180, 70, .16, .006, .16);
      tone(a, t + .32, 'sine', 392, 392, .06, .03, .32); tone(a, t + .6, 'sine', 330, 311, .06, .03, .5); },
    /* the rubber stamp coming down on the letter */
    thud() { const a = A(); if (!a) return; const t = a.currentTime + .01; tone(a, t, 'sine', 150, 48, .4, .004, .22); burst(a, t, .07, 'lowpass', 2400, 400, .7, .2); burst(a, t + .015, .03, 'highpass', 3000, 3000, .7, .05); },
    /* the counter bell: ding-ding */
    bell() { const a = A(); if (!a) return; const t = a.currentTime + .01; [0, .17].forEach((d) => { tone(a, t + d, 'sine', 1568, 1568, .07, .004, .7); tone(a, t + d, 'sine', 2350, 2350, .03, .004, .45); tone(a, t + d, 'triangle', 3920, 3920, .012, .002, .2); }); },
    /* the okada puttering off down the road, fading away */
    putter() { const a = A(); if (!a) return; const t = a.currentTime + .02, len = 1.7;
      const o = a.createOscillator(), lp = a.createBiquadFilter(), g = a.createGain(), am = a.createGain(), lfo = a.createOscillator(), depth = a.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(52, t); o.frequency.exponentialRampToValueAtTime(95, t + len);
      lfo.type = 'square'; lfo.frequency.setValueAtTime(11, t); lfo.frequency.exponentialRampToValueAtTime(22, t + len); depth.gain.value = .5; am.gain.value = .5;
      lfo.connect(depth).connect(am.gain);
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(700, t); lp.frequency.exponentialRampToValueAtTime(380, t + len);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.16, t + .12); g.gain.setValueAtTime(.16, t + .5); g.gain.exponentialRampToValueAtTime(.0001, t + len);
      o.connect(am).connect(lp).connect(g).connect(a.destination); o.start(t); lfo.start(t); o.stop(t + len + .05); lfo.stop(t + len + .05); },
    close() { try { ac && ac.close(); } catch (e) { /* closed */ } ac = null; },
  };
}

/* (r3, Sani 2026-10-27 "more real"): the big letter no longer hangs in the sky. It is pinned to a wooden notice board
   that stands on two posts on the pavement in front of the post office: a stained frame lit from the upper right (the
   scene's sun), a plank backing with its grain and seams, the posts set in concrete collars, their shadows falling to
   the left on the pavement. wsBoard() goes behind the envelope, wsPins() (two brass drawing pins) in front of it.
   Both are 670×378 user units over the same box (16.5–83.5cqw × 10–47.8cqw); the envelope covers 25–645 × 24–280. */
export function wsBoard(): string {
  const R = rnd(17); let grain = '';
  for (let i = 0; i < 40; i++) { const x = 16 + R() * 636, y = 14 + R() * 278, l = 20 + R() * 60; grain += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' q' + (R() * 4 - 2).toFixed(1) + ' ' + (l / 2).toFixed(1) + ' 0 ' + l.toFixed(1) + '" stroke="#6E4E2C" stroke-width=".8" fill="none" opacity=".35"/>'; }
  let seams = ''; for (let x = 66; x < 650; x += 52) seams += '<path d="M' + x + ' 14 V292" stroke="#5A3C20" stroke-width="1.6" opacity=".55"/><path d="M' + (x + 1.6) + ' 14 V292" stroke="#D2B084" stroke-width=".8" opacity=".4"/>';
  let fgrain = ''; for (let i = 0; i < 6; i++) fgrain += '<path d="M2 ' + (3 + i * 1.8) + ' Q335 ' + (1 + i * 1.8 + (i % 2) * 2) + ' 668 ' + (3 + i * 1.8) + '" stroke="#2E1C0E" stroke-width=".5" fill="none" opacity=".3"/>';
  const post = (x) => '<path d="M' + x + ' 296 H' + (x + 20) + ' V370 H' + x + ' Z" fill="url(#ws5-post)"/><path d="M' + x + ' 296 H' + (x + 20) + ' V306 H' + x + ' Z" fill="#000" opacity=".35"/>' +
    '<path d="M' + (x - 30) + ' 376 L' + (x - 2) + ' 368 H' + (x + 22) + ' L' + (x - 8) + ' 377 Z" fill="rgba(40,28,14,.28)"/>' +
    '<path d="M' + (x - 7) + ' 370 Q' + (x + 10) + ' 364 ' + (x + 27) + ' 370 V374 Q' + (x + 10) + ' 378 ' + (x - 7) + ' 374 Z" fill="#B9B2A4"/><path d="M' + (x - 7) + ' 370 Q' + (x + 10) + ' 364 ' + (x + 27) + ' 370" stroke="#E2DCCE" stroke-width="1.4" fill="none"/>';
  return '<svg class="ws5b" viewBox="0 0 670 378" aria-hidden="true"><defs>' + lgx('ws5-post', '#3E2814', '#5A3A1E', '#7A5230') + lg('ws5-back', '#B48C5E', '#A07A4E', '#8E6A42') +
    lg('ws5-fr', '#7A5232', '#5A3A20', '#4A2E18') + '<radialGradient id="ws5-lit" cx=".85" cy="0" r="1"><stop offset="0" stop-color="#FFF4D8" stop-opacity=".22"/><stop offset="1" stop-color="#FFF4D8" stop-opacity="0"/></radialGradient></defs>' +
    post(70) + post(580) +
    '<rect x="0" y="0" width="670" height="306" rx="4" fill="url(#ws5-fr)"/>' + fgrain +
    '<rect x="14" y="12" width="642" height="282" fill="url(#ws5-back)"/>' + seams + grain +
    '<rect x="14" y="12" width="642" height="282" fill="url(#ws5-lit)"/>' +
    '<path d="M14 12 H656 V20 H14 Z M14 12 H22 V294 H14 Z" fill="#000" opacity=".22"/>' +
    '<path d="M0 0 H670" stroke="#B88A5C" stroke-width="3"/><path d="M670 2 V304" stroke="#9A7046" stroke-width="2.4"/><path d="M0 305 H670" stroke="#2A1A0C" stroke-width="2.4"/>' +
    // the corners of older notices peep out from behind the letter
    '<path d="M18 252 L60 248 L62 294 L18 294 Z" fill="#EFE6C8" opacity=".9"/><path d="M26 262 h28 M26 270 h22 M26 278 h26" stroke="#8A7E64" stroke-width="1.4"/>' +
    '<path d="M612 14 L656 14 L656 54 L616 58 Z" fill="#E8DFF0" opacity=".85"/><path d="M620 28 h28 M622 36 h24" stroke="#7A6E8A" stroke-width="1.4"/>' +
    '<g fill="#8A8A90"><circle cx="24" cy="22" r="2.2"/><circle cx="646" cy="22" r="2.2"/><circle cx="24" cy="284" r="2.2"/><circle cx="646" cy="284" r="2.2"/></g>' +
    '</svg>';
}
export function wsPins(): string {
  const pin = (x, y) => '<g transform="translate(' + x + ' ' + y + ')"><ellipse cx="-4" cy="5" rx="9" ry="4" fill="#000" opacity=".22"/><circle r="8" fill="#B8862A"/><circle r="8" fill="url(#ws5-pin)"/><circle cx="-2.4" cy="-2.6" r="2.4" fill="#FFF3C0" opacity=".8"/></g>';
  return '<svg class="ws5p" viewBox="0 0 670 378" aria-hidden="true"><defs><radialGradient id="ws5-pin" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#F6D77A"/><stop offset="1" stop-color="#7A5214"/></radialGradient></defs>' +
    pin(40, 36) + pin(630, 36) + '</svg>';
}
