// @ts-nocheck
import { person, hut, rumbu, dum, neem, bird, goat, dk, lt, f1 } from './sc-jirgi';
import { liveAC } from './audioctx';
/*
 * Ruwan sama (rain on the farm), a Karatu game (Sani 2026-11-02: "super realistic with good details and performant").
 * The first rains over a family millet farm at the edge of a village in the north. The sky is heavy with storm cloud and,
 * far off on the right, rain already falls in grey curtains. The village sits on the horizon: round mud huts with thatch,
 * a rumbu granary, dum palms, a big baobab (kuka) and a neem. The farm is fresh ridges of red-brown earth running away to
 * the horizon, sown and waiting. On the left the farmer rests on his hoe in his malafa hat, his wife beside him with a
 * calabash on her head; on the right, by their hut and its zana-mat fence, a boy and a girl look up at the sky, with a goat
 * and the hens. Cattle egrets walk the furrows, as they do when the rains come.
 *
 * The game (games2.ts 'j-ruwa'): a rain cloud carries the word across the sky to one of six seedlings on the near ridge.
 * Read it aloud: the cloud darkens and rains, the earth darkens, the millet shoots up and heads out. Wrong: the cloud blows
 * away dry, a gust of dust, the seedling wilts. All six rained on is a harvest.
 *
 * Everything moves with transform and opacity only; the scene is one fixed drawing, built once (rest.ts).
 * Classes for sc-ruwa.css: .x-fig .x-head .x-al .x-ar .x-wv .x-cl .x-ms .x-mf (people), idle: .x-cl1 .x-cl2 (sky cloud
 * drift) .x-curt (far rain) .x-bird .x-egret .x-goat .x-hen
 */
const P = 'rw4';
const u = (id) => 'url(#' + P + '-' + id + ')';
const lg = (id, c, y1 = 0, y2 = 1, x1 = 0, x2 = 0) => '<linearGradient id="' + P + '-' + id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' +
  c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const rg = (id, c, cx = 0.5, cy = 0.5, r = 0.5, op = [1, 0]) => '<radialGradient id="' + P + '-' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">' +
  '<stop offset="0" stop-color="' + c + '" stop-opacity="' + op[0] + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="' + op[1] + '"/></radialGradient>';

/** a heavy cumulus: lit top, dark flat base; (x, y) is the middle of its base, w its width */
function storm(x, y, w, top = '#C9CFD3', base = '#59646E', cls = '') {
  const s = w / 100;
  const puffs = [[-38, -6, 16], [-22, -14, 20], [-4, -20, 23], [16, -15, 19], [33, -8, 15], [-30, -2, 13], [26, -2, 13]];
  let lit = '', shade = '';
  for (const [dx, dy, r] of puffs) {
    lit += '<circle cx="' + f1(x + dx * s) + '" cy="' + f1(y + dy * s) + '" r="' + f1(r * s) + '"/>';
    shade += '<circle cx="' + f1(x + dx * s + r * s * 0.18) + '" cy="' + f1(y + dy * s + r * s * 0.32) + '" r="' + f1(r * s * 0.86) + '"/>';
  }
  return '<g class="' + cls + '"><g fill="' + top + '">' + lit + '</g><g fill="' + base + '" opacity=".55">' + shade + '</g>' +
    '<path d="M' + f1(x - 46 * s) + ' ' + f1(y) + ' Q' + f1(x) + ' ' + f1(y + 5 * s) + ' ' + f1(x + 44 * s) + ' ' + f1(y) + ' Q' + f1(x) + ' ' + f1(y - 6 * s) + ' ' + f1(x - 46 * s) + ' ' + f1(y) + ' Z" fill="' + base + '"/></g>';
}
/** the baobab (kuka): a huge swollen trunk and short twisted bare-ish branches with a few leaf clumps */
function kuka(x, y, s) {
  const c = '#8C7A68', d = dk(c, 0.25);
  return '<g><path d="M' + f1(x - 9 * s) + ' ' + y + ' Q' + f1(x - 12 * s) + ' ' + f1(y - 14 * s) + ' ' + f1(x - 7 * s) + ' ' + f1(y - 26 * s) + ' L' + f1(x + 7 * s) + ' ' + f1(y - 26 * s) +
    ' Q' + f1(x + 12 * s) + ' ' + f1(y - 14 * s) + ' ' + f1(x + 10 * s) + ' ' + y + ' Z" fill="' + c + '"/>' +
    '<path d="M' + f1(x + 2 * s) + ' ' + y + ' Q' + f1(x + 6 * s) + ' ' + f1(y - 14 * s) + ' ' + f1(x + 4 * s) + ' ' + f1(y - 26 * s) + ' L' + f1(x + 7 * s) + ' ' + f1(y - 26 * s) + ' Q' + f1(x + 12 * s) + ' ' + f1(y - 14 * s) + ' ' + f1(x + 10 * s) + ' ' + y + ' Z" fill="' + d + '"/>' +
    '<path d="M' + f1(x - 6 * s) + ' ' + f1(y - 25 * s) + ' Q' + f1(x - 14 * s) + ' ' + f1(y - 31 * s) + ' ' + f1(x - 18 * s) + ' ' + f1(y - 30 * s) + ' M' + f1(x - 3 * s) + ' ' + f1(y - 26 * s) + ' Q' + f1(x - 5 * s) + ' ' + f1(y - 34 * s) + ' ' + f1(x - 10 * s) + ' ' + f1(y - 38 * s) +
    ' M' + f1(x + 2 * s) + ' ' + f1(y - 26 * s) + ' Q' + f1(x + 4 * s) + ' ' + f1(y - 35 * s) + ' ' + f1(x + 1 * s) + ' ' + f1(y - 40 * s) + ' M' + f1(x + 5 * s) + ' ' + f1(y - 25 * s) + ' Q' + f1(x + 13 * s) + ' ' + f1(y - 31 * s) + ' ' + f1(x + 19 * s) + ' ' + f1(y - 31 * s) +
    ' M' + f1(x + 6 * s) + ' ' + f1(y - 26 * s) + ' Q' + f1(x + 10 * s) + ' ' + f1(y - 34 * s) + ' ' + f1(x + 14 * s) + ' ' + f1(y - 37 * s) + '" stroke="' + c + '" stroke-width="' + f1(2.2 * s) + '" fill="none" stroke-linecap="round"/>' +
    '<g fill="#5F7A3A" opacity=".9">' + [[-18, -31, 4], [-10, -39, 4.4], [1, -41, 4.8], [14, -38, 4.2], [19, -32, 3.8], [-4, -33, 3.6], [8, -34, 3.4]].map(([dx, dy, r]) =>
      '<ellipse cx="' + f1(x + dx * s) + '" cy="' + f1(y + dy * s) + '" rx="' + f1(r * s) + '" ry="' + f1(r * s * 0.62) + '"/>').join('') + '</g>' +
    '<g fill="#B9A98C"><ellipse cx="' + f1(x - 14 * s) + '" cy="' + f1(y - 28 * s) + '" rx="' + f1(0.9 * s) + '" ry="' + f1(1.6 * s) + '"/><ellipse cx="' + f1(x + 15 * s) + '" cy="' + f1(y - 29 * s) + '" rx="' + f1(0.9 * s) + '" ry="' + f1(1.6 * s) + '"/></g>' +
    '<path d="M' + f1(x - 7 * s) + ' ' + f1(y - 6 * s) + ' q2 -6 0 -12 M' + f1(x - 2 * s) + ' ' + f1(y - 3 * s) + ' q1.6 -8 -.4 -16" stroke="' + d + '" stroke-width=".5" fill="none" opacity=".6"/></g>';
}
/** a cattle egret walking the furrows, feet at (x, y) */
const egret = (x, y, s, cls) => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')"><g class="x-egret ' + cls + '">' +
  '<path d="M-.6 0 L-.2 -4 M1 0 L.6 -4" stroke="#C9A24A" stroke-width=".5"/>' +
  '<path d="M-3.4 -5 Q-3.6 -7.6 -.6 -8 Q2.4 -8.2 3 -6.2 Q2 -4 -.4 -3.8 Q-2.8 -3.8 -3.4 -5 Z" fill="#FAFAF4"/>' +
  '<path d="M2.4 -7 Q3.4 -9.4 3.2 -10.6 Q3.4 -11.6 4.4 -11.4 L6.4 -10.8 L4.6 -10.4 Q4 -9 3.4 -6.4 Z" fill="#FAFAF4"/><path d="M4.4 -11.2 L6.4 -10.8" stroke="#E8B04A" stroke-width=".5"/>' +
  '<circle cx="4" cy="-10.9" r=".25" fill="#1A1A1A"/><path d="M-3.4 -5 Q-1 -4.2 1.6 -5" stroke="#D8D8CE" stroke-width=".4" fill="none"/></g></g>';
/** a hen pecking, feet at (x, y) */
const hen = (x, y, s, c = '#A0522D', cls = '') => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')"><g class="x-hen ' + cls + '" style="transform-origin:0 0">' +
  '<path d="M-.6 0 v-2 M.8 0 v-2" stroke="#D9A040" stroke-width=".5"/><path d="M-4 -4 Q-4.8 -7.6 -1 -7.4 Q2 -7.6 2.6 -5 Q2.4 -2.2 -.6 -2 Q-3.4 -2 -4 -4 Z" fill="' + c + '"/>' +
  '<path d="M-4 -4.4 Q-6 -6.6 -5 -8.6 Q-3.6 -6.4 -3 -5.6 Z" fill="' + dk(c, 0.3) + '"/><path d="M1.6 -6.2 Q2.2 -9.2 3.8 -8.6 Q4.6 -7.6 3.4 -6 Z" fill="' + c + '"/>' +
  '<path d="M2.6 -9 q.6 -.9 1.2 0" stroke="#D32F2F" stroke-width=".7" fill="none"/><path d="M4.2 -7.8 l1 .3 l-1 .3 Z" fill="#E8A030"/><circle cx="3.4" cy="-7.8" r=".22" fill="#111"/>' +
  '<path d="M-2.6 -4.6 Q-.6 -3.6 1 -4.8" stroke="' + lt(c, 0.25) + '" stroke-width=".5" fill="none"/></g></g>';
/** a mat fence (zana) of woven grass panels on poles, from x0 to x1, base y, height h */
function zana(x0, x1, y, h) {
  let s = '<path d="M' + x0 + ' ' + y + ' V' + (y - h) + ' Q' + ((x0 + x1) / 2) + ' ' + (y - h - 1.4) + ' ' + x1 + ' ' + (y - h) + ' V' + y + ' Z" fill="' + u('mat') + '"/>';
  let ln = '';
  for (let yy = y - h + 2; yy < y; yy += 2.2) ln += 'M' + x0 + ' ' + f1(yy) + ' H' + x1 + ' ';
  s += '<path d="' + ln + '" stroke="#9C7A3E" stroke-width=".35" opacity=".55"/>';
  let st = ''; for (let xx = x0 + 3; xx < x1; xx += 7) st += 'M' + xx + ' ' + (y + 0.6) + ' V' + (y - h - 2) + ' ';
  return s + '<path d="' + st + '" stroke="#6B4A28" stroke-width=".9"/>';
}

/** a bird in flight seen from the side: body, head and tail, and two wings that flap (scaleY) about the shoulder */
const flyer = (x, y, s, c, c2, d) => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')">' +
  '<path class="x-wf" style="animation-delay:' + d + 's" d="M-.6 -.2 Q-2.6 -4.2 -5.4 -5.4 Q-3 -5.6 -.2 -1.8 Z" fill="' + c2 + '"/>' +
  '<path d="M-3.6 .2 Q-1 -1 2.4 -.6 Q3.6 -1.4 4.4 -.9 L5.6 -.6 L4.3 -.3 Q3.4 .6 1.6 .7 Q-1.4 1.2 -3.6 .2 L-5.2 .9 L-4.6 -.2 Z" fill="' + c + '"/>' +
  '<path class="x-wf" style="animation-delay:' + (d + 0.05) + 's" d="M.2 -.3 Q-1.2 -4.4 -3.6 -6.2 Q-.8 -5.8 1.4 -1.4 Z" fill="' + c + '"/></g>';
/** a flock crossing the sky: one group drifts across (.x-flock), each bird flaps on its own beat */
function flock(cls, y, birds) {
  return '<g class="x-flock ' + cls + '"><g transform="translate(0 ' + y + ')">' + birds.map(([dx, dy, s, c, c2, d]) => flyer(dx, dy, s, c, c2, d)).join('') + '</g></g>';
}
/** a far-off farmer bent over a short-handled hoe (fartanya), feet at (x, y); the arms and hoe swing (.x-hoe) */
function hoer(x, y, s, robe, cap, d, flip = false) {
  const sk = '#5A3A22';
  return '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ')">' +
    '<ellipse cx="1" cy=".2" rx="5" ry=".9" fill="rgba(40,20,6,.22)"/>' +
    '<path d="M-1.6 -6.4 L-2.4 0 M1.4 -6.4 L1.8 0" stroke="#3E2A1A" stroke-width="1.1" stroke-linecap="round"/>' +
    '<path d="M-2.8 -5.6 Q-3 -9 -1 -11.6 Q1.6 -13.4 4.4 -12.4 Q4.6 -10.4 2.6 -8.6 Q2 -6.6 2.6 -5.2 Q0 -4.4 -2.8 -5.6 Z" fill="' + robe + '"/>' +
    '<path d="M-1 -11.6 Q1.6 -13.4 4.4 -12.4 Q3 -11 1 -10.6 Z" fill="' + dk(robe, 0.18) + '"/>' +
    '<circle cx="5.6" cy="-12.2" r="1.6" fill="' + sk + '"/><path d="M4.2 -13 Q5.6 -14.8 7 -13.2 Z" fill="' + cap + '"/>' +
    '<g class="x-hoe" style="animation-delay:' + d + 's"><path d="M3.6 -11.4 Q5.6 -8.6 6.6 -6.6" stroke="' + robe + '" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
    '<path d="M6.4 -7 L9.6 -2.6" stroke="#7A5A34" stroke-width=".7" stroke-linecap="round"/><path d="M9 -3.4 L10.8 -.8 L8.6 -1.2 Z" fill="#8E9499"/>' +
    '<circle cx="6.5" cy="-6.8" r=".7" fill="' + sk + '"/></g></g>';
}
/** a woman sowing: bent a little, a calabash of seed on her hip, her hand dropping seed into the hole (.x-sow) */
function sower(x, y, s, robe, wrap, scarf, d) {
  const sk = '#6A4428';
  return '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy=".2" rx="4.4" ry=".9" fill="rgba(40,20,6,.22)"/>' +
    '<path d="M-3 0 Q-3.4 -4 -2.4 -7 L2.6 -7 Q3.4 -4 3 0 Z" fill="' + wrap + '"/>' +
    '<path d="M-2.4 -7 Q-2.6 -11 -.6 -13 Q2.4 -14 3.6 -12 Q3.4 -9 2.6 -7 Z" fill="' + robe + '"/>' +
    '<circle cx="3" cy="-14.2" r="1.6" fill="' + sk + '"/><path d="M1.2 -14 Q2.4 -17 5 -15 Q5.4 -13 4.4 -12.4 Q2.6 -12 1.2 -14 Z" fill="' + scarf + '"/>' +
    '<ellipse cx="-3.2" cy="-8.2" rx="2.2" ry="1.6" fill="#C9883E"/><path d="M-5.4 -8.6 Q-3.2 -9.6 -1 -8.6" stroke="#8A5520" stroke-width=".4" fill="none"/>' +
    '<g class="x-sow" style="animation-delay:' + d + 's"><path d="M2.6 -11.6 Q4.6 -9 5 -6.4" stroke="' + robe + '" stroke-width="1.2" stroke-linecap="round" fill="none"/><circle cx="5" cy="-6.2" r=".6" fill="' + sk + '"/></g>' +
    '<g class="x-seed" style="animation-delay:' + d + 's" fill="#E8D8A0"><circle cx="5.2" cy="-5" r=".3"/><circle cx="4.8" cy="-4" r=".25"/></g></g>';
}
/** a white zebu ox, side on, facing left, hooves on y 0: hump, deep dewlap, lyre horns, tapered legs that swing (.x-lg a / b) */
function ox(c, sh, far = false) {
  const hoof = (x) => '<path d="M' + f1(x - 0.75) + ' -.9 h1.5 l.2 .9 h-1.9 Z" fill="#2A2018"/>';
  const fore = (x, cl) => '<g class="x-lg ' + cl + '"><path d="M' + f1(x - 1.1) + ' -7.6 L' + f1(x + 1.1) + ' -7.6 L' + f1(x + 0.6) + ' -3.4 L' + f1(x + 0.55) + ' -.9 L' + f1(x - 0.55) + ' -.9 L' + f1(x - 0.6) + ' -3.4 Z" fill="' + sh + '"/>' + hoof(x) + '</g>';
  const hind = (x, cl) => '<g class="x-lg ' + cl + '"><path d="M' + f1(x - 1.6) + ' -9 L' + f1(x + 1.5) + ' -9 L' + f1(x + 1.1) + ' -4.4 L' + f1(x + 0.3) + ' -3 L' + f1(x + 0.55) + ' -.9 L' + f1(x - 0.55) + ' -.9 L' + f1(x - 0.6) + ' -3 L' + f1(x - 1) + ' -4.4 Z" fill="' + sh + '"/>' + hoof(x) + '</g>';
  return fore(-5.4, 'b') + hind(9.4, 'a') +
    '<path d="M11.6 -13.4 Q13.4 -10 12.6 -4.6" stroke="' + sh + '" stroke-width=".55" fill="none"/><path d="M12.2 -5.4 q.9 1.2 .3 2 q-.9 -.5 -.6 -2 Z" fill="#3A2A1E"/>' +
    // the body: neck up to the hump, the long back, the rump, belly and the deep chest with its dewlap
    '<path d="M-10.6 -13.2 Q-9.6 -15 -8.4 -15.6 Q-7.6 -18.6 -5 -17.4 Q-3.6 -16 -1 -15.6 Q5 -15.6 9.6 -15 Q12.2 -14.6 12.6 -12 Q12.8 -9.4 11.6 -8 Q10.2 -7 8 -7 Q3 -6.4 -1 -6.4 Q-4.6 -6.4 -6.6 -7.2 Q-8.6 -7.4 -9.6 -8 Q-11.4 -8.6 -12 -10.4 Q-11.8 -12 -10.6 -13.2 Z" fill="' + c + '"/>' +
    '<path d="M-12 -10.4 Q-11 -6.6 -8.6 -6.2 Q-7.6 -6.8 -7.4 -7.6 Q-9.6 -8 -12 -10.4 Z" fill="' + sh + '" opacity=".75"/>' +
    '<path d="M-6.6 -7.2 Q0 -6 8 -7 Q10.2 -7 11.6 -8 Q11.4 -9.6 10.4 -10 Q6 -8.4 -1 -8.6 Q-4.6 -8.6 -6.6 -7.2 Z" fill="' + sh + '" opacity=".45"/>' +
    '<path d="M-7.6 -17.4 Q-5.4 -18 -3.8 -16.2" stroke="' + lt(c, 0.4) + '" stroke-width=".5" fill="none" opacity=".8"/>' +
    '<path d="M7.6 -14.4 Q9.6 -12 8.6 -8.8" stroke="' + sh + '" stroke-width=".5" fill="none" opacity=".6"/>' +
    // the head, held low and forward, horns curving up and out, the ear hanging sideways
    '<path d="M-10.2 -13.4 Q-12 -14.6 -13.8 -14 Q-15.4 -13.2 -16.4 -10.6 Q-16.8 -9.4 -16 -9 Q-14.8 -8.8 -13.8 -9.8 Q-12.2 -10.6 -10.8 -10.8 Z" fill="' + c + '"/>' +
    '<path d="M-16.4 -10.6 Q-16.8 -9.4 -16 -9 Q-14.8 -8.8 -13.8 -9.8 Q-15 -9.8 -16.4 -10.6 Z" fill="' + sh + '"/>' +
    '<ellipse cx="-16.1" cy="-10.1" rx=".45" ry=".3" fill="#3A2E28"/>' +
    '<path d="M-13.2 -14 Q-14.8 -16 -14 -18.2 Q-13.6 -19 -12.6 -19.2 M-12.4 -14.2 Q-11.6 -16.8 -10 -17.8 Q-9.6 -18.4 -10.2 -19" stroke="#E8DCC0" stroke-width=".8" fill="none" stroke-linecap="round"/>' +
    '<path d="M-11.6 -13.4 Q-10 -13.8 -9 -12.8 Q-10 -12.4 -11.4 -12.8 Z" fill="' + sh + '"/>' +
    '<circle cx="-13.9" cy="-12.6" r=".38" fill="#1A1A1A"/>' +
    fore(-7.2, 'a') + hind(7.6, 'b');
}
/** the plough team: two oxen under one yoke, the beam back to the plough, the ploughman on its two handles; walks left (.x-team) */
function ploughTeam(x, y, s) {
  const man = person(33, 0.4, 19, { kind: 'man', skin: 2, robe: '#C9B48E', trim: '#6A4A2A', trou: '#B8A27A', hat: 'malafa', hatc: '#D2AC5C', hatc2: '#5A2A1A', al: 'staff', ar: 'staff', cls: 'p5' });
  return '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')">' +
    '<path class="x-fur a" d="M9 1 H27" stroke="#5A341C" stroke-width="1.8" opacity=".55" stroke-linecap="round"/>' +
    '<path class="x-fur b" d="M-8 3.4 H10" stroke="#5A341C" stroke-width="1.8" opacity=".55" stroke-linecap="round"/>' +
    '<g class="x-team">' +
    '<ellipse cx="6" cy=".4" rx="22" ry="1.4" fill="rgba(40,20,6,.22)"/>' +

    '<g transform="translate(2.6 -1.4)"><g class="x-bob b2">' + ox('#DCD3C1', '#AA9E88', true) + '</g></g>' +
    '<g class="x-bob">' + ox('#F3EEE4', '#C2B6A0') + '</g>' +
    // the yoke across both necks, with its pegs
    '<path d="M-10.8 -15.4 Q-9.2 -16.4 -6.4 -17.4" stroke="#6A4A28" stroke-width="1.5" stroke-linecap="round"/><path d="M-10.4 -15.6 v2.4 M-7.2 -17 v2.4" stroke="#4A3220" stroke-width=".5"/>' +
    // the beam, the share in the earth, and the handles
    '<path d="M-8.6 -16 Q8 -11 24 -3.2" stroke="#6A4A28" stroke-width="1" stroke-linecap="round" fill="none"/>' +
    '<path d="M23 -4 L27.6 .8 L23.4 .7 Z" fill="#5A5048"/><path d="M23.6 -3.2 L27.6 .8" stroke="#9AA0A4" stroke-width=".35"/>' +
    '<path d="M25 -2.2 L30.2 -8 M25.4 -1.6 L35.6 -8" stroke="#7A5A34" stroke-width=".8" stroke-linecap="round"/>' +
    '<g class="x-bob b3">' + man + '</g>' +
    '<g class="x-clod" fill="#6E4428"><circle cx="27.6" cy="-.4" r=".6"/><circle cx="29" cy="-1" r=".45"/><circle cx="30" cy="-.2" r=".5"/></g></g></g>';
}
export function ruwaScene(): string {
  const defs = '<defs>' +
    lg('sky', ['#5E6D7C', '#7F8E99', '#A9B2B3', '#D8C9A6', '#EBC88E'], 0, 1) +
    lg('earth', ['#9A6A40', '#A8744A', '#B57E50', '#8E5C36'], 0, 1) +
    lg('ridge', ['#C28A5A', '#A26C40'], 0, 1) +
    lg('mat', ['#D9B870', '#C29E58'], 0, 1) +
    lg('curt', ['#7D8A94', 'rgba(125,138,148,0)'], 0, 1) +
    rg('glow', '#FFE4A8', 0.5, 0.5, 0.5, [0.65, 0]) +
    rg('vign', '#1A1208', 0.5, 0.4, 0.75, [0, 0.35]) + '</defs>';
  // the sky: storm cloud massing, a warm break low on the horizon, far rain curtains
  const sky = '<rect width="320" height="104" fill="' + u('sky') + '"/>' +
    '<ellipse cx="96" cy="92" rx="90" ry="16" fill="' + u('glow') + '"/>' +
    '<g class="x-curt"><path d="M238 64 L232 98 L300 98 L304 60 Z" fill="' + u('curt') + '" opacity=".55"/>' +
    '<path d="M246 64 l-5 30 M256 64 l-5 32 M266 63 l-5 33 M276 62 l-5 34 M286 62 l-5 35 M296 61 l-5 36" stroke="#6E7B85" stroke-width=".5" opacity=".5"/></g>' +
    storm(268, 60, 120, '#9AA4AB', '#4B5560', 'x-cl1') + storm(60, 40, 110, '#B4BCC1', '#5E6872', 'x-cl2') + storm(170, 30, 140, '#A7B0B6', '#525D67', 'x-cl1') +
    storm(310, 30, 90, '#8E98A0', '#46505A', 'x-cl2') + storm(18, 70, 60, '#C4C8C8', '#6E767C', 'x-cl1') +
    bird(118, 52, 1, 'b1') + bird(130, 47, 0.8, 'b2') + bird(212, 70, 0.9, 'b3') +
    // cattle egrets flying in low ahead of the storm, and a few dark birds higher up
    flock('fk1', 74, [[0, 0, 0.9, '#FAFAF4', '#E2E2DA', 0], [9, -3, 0.8, '#FAFAF4', '#E2E2DA', -0.2], [17, 1, 0.85, '#FAFAF4', '#E2E2DA', -0.35], [-8, 3, 0.75, '#FAFAF4', '#E2E2DA', -0.15], [26, -1, 0.7, '#FAFAF4', '#E2E2DA', -0.45]]) +
    flock('fk2', 44, [[0, 0, 0.6, '#2E2A28', '#46403C', -0.1], [7, -2, 0.55, '#2E2A28', '#46403C', -0.3], [13, 1, 0.5, '#2E2A28', '#46403C', 0]]);
  // the horizon: the village and its trees
  const far = '<path d="M0 98 Q60 95 120 97 T240 96 T320 97 V106 H0 Z" fill="#7C8A62"/>' +
    '<g fill="#5E7048" opacity=".85">' + [8, 22, 34, 150, 162, 178, 196, 300, 314].map((x, i) => '<ellipse cx="' + x + '" cy="' + (96 - (i % 3)) + '" rx="' + (7 + (i % 3) * 2) + '" ry="' + (3.4 + (i % 2)) + '"/>').join('') + '</g>' +
    '<g class="x-tree t1">' + kuka(226, 99, 1.05) + '</g><g class="x-tree t2">' + neem(140, 99, 0.7) + '</g><g class="x-tree t3">' + dum(60, 99, 0.55) + dum(68, 99.4, 0.45, '#7A9A44') + '</g><g class="x-tree t2">' + dum(286, 99, 0.6) + '</g>' +
    hut(80, 100, 9, '#B98256') + hut(92, 100.6, 7.6, '#A9744A') + rumbu(102, 100.6, 5) + hut(112, 100, 8.4, '#C08A5C') +
    hut(36, 100.6, 7.4, '#B0794C') + rumbu(46, 100.6, 4.4) +
    '<path d="M74 100.6 H118" stroke="#8E6A40" stroke-width=".6" opacity=".6"/>';
  // the farm: ridges running to the horizon, darker furrows between, a few early shoots on the far ridges
  let ridges = '';
  const VX = 150, VY = 96;
  for (let i = -12; i <= 13; i++) {
    const xb = 160 + i * 34, xb2 = xb + 17;
    const xt = VX + (xb - VX) * 0.06, xt2 = VX + (xb2 - VX) * 0.06;
    ridges += '<path d="M' + f1(xb) + ' 200 L' + f1(xt) + ' ' + VY + ' L' + f1(xt2) + ' ' + VY + ' L' + f1(xb2) + ' 200 Z"/>';
  }
  let furrowLines = '';
  for (let i = -12; i <= 13; i++) { const xb = 160 + i * 34 + 17; furrowLines += 'M' + f1(xb) + ' 200 L' + f1(VX + (xb - VX) * 0.06) + ' ' + VY + ' '; }
  let shoots = '';
  for (let k = 0; k < 70; k++) {
    const i = (k * 7) % 25 - 12, t = ((k * 37) % 100) / 100, y = VY + 4 + t * t * 34, xb = 160 + i * 34 + 8.5, x = VX + (xb - VX) * (0.06 + 0.94 * (y - VY) / 104), sz = 0.4 + (y - VY) / 40;
    shoots += 'M' + f1(x) + ' ' + f1(y) + ' l' + f1(-0.6 * sz) + ' ' + f1(-1.6 * sz) + ' M' + f1(x) + ' ' + f1(y) + ' l' + f1(0.7 * sz) + ' ' + f1(-1.4 * sz) + ' ';
  }
  const farm = '<path d="M0 104 Q80 97 160 98 T320 99 V200 H0 Z" fill="' + u('earth') + '"/>' +
    '<g fill="' + u('ridge') + '" opacity=".9">' + ridges + '</g>' +
    '<path d="' + furrowLines + '" stroke="#6E4428" stroke-width="1.1" opacity=".45"/>' +
    '<path d="' + shoots + '" stroke="#6E9A3A" stroke-width=".55" stroke-linecap="round" opacity=".85"/>' +
    '<g fill="#7A4E2C" opacity=".35">' + Array.from({ length: 40 }, (_, k) => { const x = (k * 53) % 320, y = 120 + (k * 29) % 76; return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (0.6 + (k % 3) * 0.3) + '" ry=".4"/>'; }).join('') + '</g>' +
    egret(112, 116, 0.9, 'e1') + egret(124, 119, 0.8, 'e2') + egret(196, 113, 0.7, 'e3') +
    // neighbours at work on the far fields: men hoeing, a woman sowing behind them
    hoer(66, 105, 0.62, '#E2D6B8', '#F4EBD0', 0) + hoer(74, 106, 0.66, '#5B7FA6', '#E8DCC0', -0.7) + sower(84, 105.6, 0.6, '#8E3B5A', '#3E2A5A', '#E8A33C', -0.4) +
    hoer(206, 104.6, 0.58, '#C9B48E', '#E8DCC0', -0.3, true) + hoer(258, 105, 0.6, '#E9DFC6', '#2E7D32', -1.1) + sower(268, 105.4, 0.56, '#2E6B5A', '#7B2D6B', '#F2C230', -0.9) +
    // the plough team turning the near field
    ploughTeam(106, 146, 0.95);
  // the farmer and his wife (left)
  // his hoe (fartanya) stands blade-down by his foot, the handle in his right hand
  const hoe = '<path d="M56 133 L47 64" stroke="#7A5A34" stroke-width="2.6" stroke-linecap="round"/><path d="M47 64 l-.6 -2" stroke="#5E4428" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M57.4 131 L46 131.6 L45.4 134.4 L57.6 134 Z" fill="#8E9499"/><path d="M46 131.6 L57.4 131" stroke="#C4CACE" stroke-width=".6"/>';
  const left = '<g transform="translate(0 -5)"><ellipse cx="40" cy="176" rx="40" ry="7" fill="rgba(40,20,6,.18)"/>' +
    person(30, 178, 54, { kind: 'man', skin: 1, robe: '#E9DFC6', trim: '#8A6A3E', trou: '#D8CDB0', hat: 'malafa', hatc: '#D9B565', hatc2: '#7A1F2B', al: 'hip', ar: 'staff', cls: 'p1', beard: 'b', front: hoe }) +
    person(56, 179, 48, { kind: 'woman', skin: 3, robe: '#2E7D6B', trim: '#F2C230', wrap: '#7B2D6B', wrap2: '#F2C230', hat: 'hijab', hatc: '#E8A33C', al: 'load', ar: 'down', arc: 'x-wv', cls: 'p2', front: '<path class="x-flut" d="M44 34 Q53 40 58 54 Q51 50 45 45 Z" fill="#E8A33C"/>',
      load: '<path d="M-10 0 Q0 -6 10 0 Q9 4 0 5 Q-9 4 -10 0 Z" fill="#C9883E"/><path d="M-10 0 Q0 3 10 0" stroke="#8A5520" stroke-width=".8" fill="none"/>' }) + '</g>';
  // the hut, its mat fence, the children, the goat and the hens (right)
  const right = '<g transform="translate(0 -15)">' + zana(250, 320, 168, 22) +
    hut(296, 168, 30, '#B97C4E') +
    '<g><path d="M268 168 Q266 160 270 156 Q275 153 279 157 Q282 162 280 168 Z" fill="#9C5A30"/><path d="M269 158 Q274 155.4 279 158" stroke="#7A4022" stroke-width=".8" fill="none"/><ellipse cx="274" cy="156" rx="4.6" ry="1.2" fill="#6A3A1C"/></g>' +
    '<ellipse cx="248" cy="186" rx="34" ry="5.4" fill="rgba(40,20,6,.18)"/>' +
    person(236, 188, 34, { kind: 'boy', skin: 0, robe: '#3E7CB1', trim: '#F4EBD0', trou: '#3E7CB1', hat: 'hula', hatc: '#F4EBD0', hatc2: '#2E7D32', al: 'wave', ar: 'down', alc: 'x-wv', cls: 'p3' }) +
    person(256, 189, 33, { kind: 'girl', skin: 2, robe: '#E25A7A', trim: '#FFE08A', wrap: '#5B3A8E', wrap2: '#FFD54A', hat: 'hijab', hatc: '#FFD9E4', al: 'down', ar: 'wave', arc: 'x-wv', cls: 'p4', front: '<path class="x-flut f2" d="M16 34 Q7 40 3 54 Q10 50 15 45 Z" fill="#FFD9E4"/>' }) +
    goat(282, 190, 0.9, '#F2EEE6', '#5A3A22') + hen(212, 192, 1.1, '#A0522D', 'h1') + hen(222, 194, 1, '#E8E2D4', 'h2') + hen(306, 196, 1, '#5B3A22', 'h3') + '</g>';
  return '<svg class="scene ' + P + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + defs + sky + far + farm + left + right +
    '<rect width="320" height="200" fill="' + u('vign') + '"/></svg>';
}

/* ---------- the game's pieces ---------- */
/** the word's rain cloud: a big soft cumulus, its belly darkening when it rains (.raining on the box) */
export function wordCloud(): string {
  return '<svg class="rwc" viewBox="0 0 200 80" aria-hidden="true"><defs>' +
    '<linearGradient id="rwc-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F6F7"/><stop offset=".55" stop-color="#C9D0D5"/><stop offset="1" stop-color="#8E99A2"/></linearGradient>' +
    '<linearGradient id="rwc-d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E8A94"/><stop offset=".6" stop-color="#4E5A65"/><stop offset="1" stop-color="#36404A"/></linearGradient></defs>' +
    '<g class="rwc-body">' +
    '<path d="M18 66 Q4 66 6 54 Q8 42 22 44 Q22 26 42 26 Q50 10 72 14 Q86 2 106 8 Q124 0 138 14 Q158 10 166 28 Q186 28 188 46 Q198 52 192 62 Q190 68 178 68 Z" fill="url(#rwc-g)"/>' +
    '<path class="rwc-dark" d="M18 66 Q4 66 6 54 Q8 42 22 44 Q22 26 42 26 Q50 10 72 14 Q86 2 106 8 Q124 0 138 14 Q158 10 166 28 Q186 28 188 46 Q198 52 192 62 Q190 68 178 68 Z" fill="url(#rwc-d)"/>' +
    '<path d="M44 28 Q52 16 70 18 M108 10 Q122 6 134 16 M24 46 Q28 36 40 34" stroke="#fff" stroke-width="2.4" fill="none" opacity=".6" stroke-linecap="round"/>' +
    '<path d="M14 64 Q100 74 186 64" stroke="#5E6872" stroke-width="2" fill="none" opacity=".35"/></g></svg>';
}
/** the falling rain under the cloud: two layers of streaks, each twice as tall as the box so a loop of translateY works */
export function rainSheet(): string {
  let a = '', b = '';
  for (let k = 0; k < 72; k++) {
    const x = (k * 37) % 200 + (k % 5), y = (k * 53) % 200, l = 8 + (k % 4) * 2.2;
    const d = 'M' + f1(x) + ' ' + f1(y) + ' l-1.6 ' + f1(l) + ' M' + f1(x) + ' ' + f1(y + 200) + ' l-1.6 ' + f1(l) + ' ';
    if (k % 2) a += d; else b += d;
  }
  return '<svg class="rwr" viewBox="0 0 200 400" preserveAspectRatio="none" aria-hidden="true"><g class="rwr1"><path d="' + a + '" stroke="#E6F0F6" stroke-width="1.5" stroke-linecap="round" opacity=".85"/></g>' +
    '<g class="rwr2"><path d="' + b + '" stroke="#C4D6E2" stroke-width="1.1" stroke-linecap="round" opacity=".7"/></g></svg>';
}
/** one millet (gero) plant on its ridge, drawn full grown; the game scales it from a seedling. Its own wet patch and
 *  splash rings; its seed head (.mh) shows when it heads out; a dry, drooping copy (.mw) stands in when it wilts. */
export function millet(k: number): string {
  const leaf = (x, y, dx, dy, c) => '<path d="M' + x + ' ' + y + ' Q' + (x + dx * 0.5) + ' ' + (y + dy * 0.2 - 3) + ' ' + (x + dx) + ' ' + (y + dy) + ' Q' + (x + dx * 0.45) + ' ' + (y + dy * 0.1 + 1.4) + ' ' + x + ' ' + (y + 1.6) + ' Z" fill="' + c + '"/>';
  const g = ['#5E8F2E', '#6EA236', '#4E7E26'];
  const live = '<g class="mg">' +
    '<path d="M29 96 Q30 60 31 22" stroke="#7E9A3A" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M26 96 Q24 70 22 44" stroke="#86A23E" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    '<path d="M33 96 Q36 74 40 52" stroke="#86A23E" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    leaf(30, 86, -24, 8, g[0]) + leaf(30, 80, 24, 4, g[1]) + leaf(30, 68, -22, -2, g[2]) + leaf(30.6, 60, 22, -6, g[0]) + leaf(31, 48, -18, -8, g[1]) + leaf(31, 40, 16, -10, g[2]) +
    leaf(23, 58, -14, -6, g[1]) + leaf(39, 60, 14, -4, g[0]) +
    '<path d="M30 86 Q20 90 8 92 M30 80 Q44 82 52 82" stroke="#3E6A1E" stroke-width=".5" fill="none" opacity=".6"/>' +
    '<g class="mh"><path d="M30.2 24 Q28.4 10 30.6 -6 Q33 10 32 24 Z" fill="#B88A3E"/><path d="M30.6 -6 Q32.6 8 32 24 L31.2 24 Q31.6 8 30.6 -6 Z" fill="#8E6426"/>' +
    '<g fill="#D9B060">' + Array.from({ length: 10 }, (_, i) => '<circle cx="' + (29.8 + (i % 2) * 1.4) + '" cy="' + (20 - i * 2.6) + '" r=".7"/>').join('') + '</g>' +
    '<path d="M21.6 46 Q20.4 36 22.2 26 Q24 36 23.4 46 Z M39.4 54 Q38.4 44 40.4 34 Q42 44 41.2 54 Z" fill="#B08236"/></g></g>';
  const dry = '<g class="mw"><path d="M29 96 Q30 80 36 72 Q40 68 44 70" stroke="#A08A4A" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    leaf(30, 88, -16, 8, '#B39A55') + leaf(31, 82, 14, 10, '#A68A48') + leaf(36, 73, 10, 12, '#B39A55') + '</g>';
  return '<svg class="mp m' + k + '" viewBox="0 -10 60 110" aria-hidden="true">' +
    // rained-on earth: a dark wet patch spreading along the ridge, with puddles shining in the furrows either side
    '<g class="mwet"><ellipse cx="30" cy="97.6" rx="44" ry="7" fill="#4A2C16" opacity=".55"/><ellipse cx="30" cy="97" rx="26" ry="5" fill="#4A2C16"/>' +
    '<ellipse cx="2" cy="99" rx="7" ry="1.1" fill="#8E9EAA" opacity=".7"/><ellipse cx="58" cy="98.4" rx="6" ry="1" fill="#8E9EAA" opacity=".7"/><path d="M-3 98.8 h6 M54 98.2 h5" stroke="#C9D6DE" stroke-width=".4"/></g>' +
    '<ellipse cx="30" cy="97.4" rx="13" ry="3" fill="#CF9A66"/><ellipse cx="30" cy="96.6" rx="9" ry="1.8" fill="#6E4428" opacity=".7"/>' +
    '<g class="msplash"><ellipse cx="18" cy="97" rx="3" ry=".8" fill="none" stroke="#DDEBF2" stroke-width=".6"/><ellipse cx="42" cy="98" rx="3.4" ry=".9" fill="none" stroke="#DDEBF2" stroke-width=".6"/><ellipse cx="30" cy="99" rx="2.6" ry=".7" fill="none" stroke="#DDEBF2" stroke-width=".6"/></g>' +
    '<g class="mplant">' + live + dry + '</g>' +
    // after the harvest: the cut stubble, and the heads tied in a bundle (dami) laid on the ridge
    '<g class="mstub"><path d="M27 96 L26.4 86 M30 96 L30.4 84 M33 96 L34 87" stroke="#9A8A40" stroke-width="2" stroke-linecap="round"/><path d="M25.6 86 h1.6 M29.6 84 h1.6 M33.2 87 h1.6" stroke="#C9B060" stroke-width="1"/></g>' +
    '<g class="mbun"><path d="M4 94 Q20 90 40 92 L40 97 Q20 99 4 98 Z" fill="#B39A55"/><path d="M6 95 Q22 92 40 94 M6 97 Q22 95 40 96" stroke="#8E7A3A" stroke-width=".5" fill="none"/>' +
    '<path d="M40 91 Q50 88 57 92 Q50 98 40 98 Z" fill="#C9963E"/><g fill="#D9B060"><circle cx="46" cy="92" r=".9"/><circle cx="50" cy="93.4" r=".9"/><circle cx="53" cy="92.4" r=".8"/><circle cx="47" cy="95.4" r=".9"/><circle cx="51" cy="96" r=".8"/></g>' +
    '<path d="M24 91.6 Q25 95 24 98.6 M27 91.4 Q28 95 27 98.6" stroke="#6E4E22" stroke-width="1.1" fill="none"/></g>' +
    '<g class="mdust"><circle cx="18" cy="92" r="5" fill="#C9A878"/><circle cx="28" cy="88" r="6.4" fill="#D4B486"/><circle cx="40" cy="91" r="5" fill="#C9A878"/></g></svg>';
}

/** the harvester who walks the ridge at the end: a grown man bent to the millet, a sickle (lauje) in his right hand */
export function reaper(): string {
  return '<svg class="rpr" viewBox="-8 -32 40 34" aria-hidden="true">' +
    '<ellipse cx="6" cy="0" rx="10" ry="1.4" fill="rgba(40,20,6,.25)"/>' +
    '<g class="rpr-legs"><path d="M2 -12 L-1 0" stroke="#5A4A30" stroke-width="2.4" stroke-linecap="round"/><path d="M6 -12 L9 0" stroke="#4A3A24" stroke-width="2.4" stroke-linecap="round"/></g>' +
    '<path d="M-1 -11 Q-2 -19 3 -25 Q9 -29 15 -26 Q15.6 -22 11 -19 Q9 -15 10 -10 Q4 -8 -1 -11 Z" fill="#E9DFC6"/>' +
    '<path d="M3 -25 Q9 -29 15 -26 Q11 -22 6 -21.6 Z" fill="#CFC2A2"/><path d="M-1 -11 Q4 -9 10 -10" stroke="#8A6A3E" stroke-width=".8" fill="none"/>' +
    '<circle cx="18" cy="-25.6" r="3.2" fill="#5A3A22"/>' +
    '<path d="M12.4 -27 Q18 -33 24 -27 Q18 -26 12.4 -27 Z" fill="#D9B565"/><path d="M14.4 -29.4 Q18 -32 21.6 -29.4" stroke="#7A1F2B" stroke-width=".9" fill="none"/>' +
    '<g class="rpr-arm"><path d="M12 -24 Q16 -18 18 -13" stroke="#E9DFC6" stroke-width="2.8" stroke-linecap="round" fill="none"/><circle cx="18.2" cy="-12.6" r="1.4" fill="#5A3A22"/>' +
    '<path d="M18.2 -12.6 L20.6 -10.6" stroke="#6B4A2A" stroke-width="1.2" stroke-linecap="round"/><path d="M20.4 -10.8 Q25.6 -12 26 -7 Q25 -10 21 -10 Z" fill="#9AA0A4"/></g>' +
    '<path d="M8 -22 Q6 -16 4 -12" stroke="#CFC2A2" stroke-width="2.6" stroke-linecap="round" fill="none"/><circle cx="4" cy="-11.6" r="1.3" fill="#5A3A22"/></svg>';
}

/* ---------- the game's sounds: WebAudio, short and gentle ---------- */
export function ruwaSound(run) {
  let ac = null, nb = null;
  const A = () => { if (run && run.dead) return null; try { ac = liveAC(ac); if (ac.state === 'suspended') ac.resume(); return ac; } catch (e) { return null; } };
  const noise = (a) => { if (nb) return nb; nb = a.createBuffer(1, a.sampleRate * 3, a.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return nb; };
  const src = (a, type, f, q) => { const s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); s.buffer = noise(a); s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q; s.connect(fl).connect(g).connect(a.destination); return { s, g, fl }; };
  return {
    /* the rain: a soft hiss that swells and fades, with a few heavier drops */
    rain(sec = 2.6) { const a = A(); if (!a) return; const t = a.currentTime + .02;
      const h = src(a, 'bandpass', 2600, .7); h.g.gain.setValueAtTime(.0001, t); h.g.gain.exponentialRampToValueAtTime(.11, t + .5); h.g.gain.setValueAtTime(.11, t + sec - .7); h.g.gain.exponentialRampToValueAtTime(.0001, t + sec);
      h.s.start(t, Math.random()); h.s.stop(t + sec + .05);
      const l = src(a, 'lowpass', 500, .5); l.g.gain.setValueAtTime(.0001, t); l.g.gain.exponentialRampToValueAtTime(.06, t + .7); l.g.gain.exponentialRampToValueAtTime(.0001, t + sec); l.s.start(t, Math.random()); l.s.stop(t + sec + .05);
      for (let k = 0; k < 9; k++) { const o = a.createOscillator(), g = a.createGain(), tt = t + .3 + Math.random() * (sec - .8); o.type = 'sine'; o.frequency.setValueAtTime(900 + Math.random() * 700, tt); o.frequency.exponentialRampToValueAtTime(300, tt + .05);
        g.gain.setValueAtTime(.0001, tt); g.gain.exponentialRampToValueAtTime(.035, tt + .004); g.gain.exponentialRampToValueAtTime(.0001, tt + .07); o.connect(g).connect(a.destination); o.start(tt); o.stop(tt + .09); } },
    /* far thunder: a low rolling rumble as the cloud darkens */
    thunder() { const a = A(); if (!a) return; const t = a.currentTime + .02; const r = src(a, 'lowpass', 120, .8);
      r.g.gain.setValueAtTime(.0001, t); r.g.gain.exponentialRampToValueAtTime(.22, t + .25); r.g.gain.exponentialRampToValueAtTime(.08, t + .7); r.g.gain.exponentialRampToValueAtTime(.16, t + .95); r.g.gain.exponentialRampToValueAtTime(.0001, t + 2);
      r.s.start(t, Math.random()); r.s.stop(t + 2.05); },
    /* a dry gust: wind through the stubble, rising and falling, then a soft sad fall */
    gust() { const a = A(); if (!a) return; const t = a.currentTime + .02; const w = src(a, 'bandpass', 700, 1.6);
      w.fl.frequency.setValueAtTime(500, t); w.fl.frequency.exponentialRampToValueAtTime(1400, t + .6); w.fl.frequency.exponentialRampToValueAtTime(600, t + 1.3);
      w.g.gain.setValueAtTime(.0001, t); w.g.gain.exponentialRampToValueAtTime(.07, t + .4); w.g.gain.exponentialRampToValueAtTime(.0001, t + 1.4); w.s.start(t, Math.random()); w.s.stop(t + 1.45);
      [392, 330].forEach((f, i) => { const o = a.createOscillator(), g = a.createGain(), tt = t + .5 + i * .28; o.type = 'triangle'; o.frequency.setValueAtTime(f, tt); o.frequency.exponentialRampToValueAtTime(f * .94, tt + .3);
        g.gain.setValueAtTime(.0001, tt); g.gain.exponentialRampToValueAtTime(.05, tt + .02); g.gain.exponentialRampToValueAtTime(.0001, tt + .32); o.connect(g).connect(a.destination); o.start(tt); o.stop(tt + .35); }); },
    /* the harvest: three bright notes */
    harvest() { const a = A(); if (!a) return; const t = a.currentTime + .02; [523, 659, 784, 1047].forEach((f, i) => { const o = a.createOscillator(), g = a.createGain(), tt = t + i * .14; o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, tt); g.gain.exponentialRampToValueAtTime(.07, tt + .02); g.gain.exponentialRampToValueAtTime(.0001, tt + .5); o.connect(g).connect(a.destination); o.start(tt); o.stop(tt + .55); }); },
    close() { /* the context is shared (liveAC); nothing to close */ },
  };
}
