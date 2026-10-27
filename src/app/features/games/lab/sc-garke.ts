// @ts-nocheck
/*
 * Ƙirgen shanu, drawn (Sani 2026-10-26: "the background and all other things too, improve the game"). A Fulani camp
 * (ruga) at dusk, drawn in the same hand as Kasuwar shanu (its people and cattle come from sc-shanu's kit): the sun
 * going down behind the hills and flat-topped acacias, egrets and a skein of birds flying home, a far herd coming in
 * along the horizon in its own dust with a herder behind. On the left the camp: grass-mat huts, the calabash stand,
 * a woman pounding grain in a mortar, a pot on the fire with its smoke, an old man on his mat. On the right, above the
 * game's own pen: a woman walking with a calabash of milk on her head, a girl milking a cow, a boy leading a calf.
 * The game's herd, herdsman and pen stand across the front, so the life is in the middle band.
 *
 * Classes: everything of sc-shanu.css (.x-w cheers and frowns, .x-eg egrets, .x-du dust, .x-calf hops) because the
 * svg also carries .sh4; and for sc-garke.css (transform and opacity only, keyframes gk-…):
 *   .gk-sun (glow) · .gk-birds · .gk-smoke · .gk-fl (flames) · .gk-pound (pestle and arms) · .gk-walk / .gk-bob (the
 *   milk woman) · .gk-milk (the milker's hands) · .gk-lead (the boy and the calf) · .gk-far (the herd coming in)
 */
import { shanuKit, dabSpec, dabbaAlone } from './sc-shanu';

const { P, lg, person, cow, cowLive, calf, egret, near_ } = shanuKit;

/* a flat-topped acacia, dark against the dusk: a leaning trunk that forks, and its umbrella of a crown */
const acacia = (x, y, s, col = '#4A3A3E') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + col + '">' +
  '<path d="M-1.2 0 Q-.6 -8 1 -13 L2.6 -13 Q1.2 -7 1.4 0Z"/><path d="M1.6 -12 L-7 -18 M1.8 -12 L9 -19 M1.6 -12.6 L1.4 -19" stroke="' + col + '" stroke-width="1.1" stroke-linecap="round"/>' +
  '<path d="M-16 -18.4 Q-10 -23.6 0 -23.4 Q12 -23.8 18 -19 Q12 -17.4 2 -18 Q-8 -17 -16 -18.4Z"/></g>';

/* a Fulani grass-mat hut (bukka): a low dome of woven mats, its seams and its dark doorway */
const hut = (x, y, s, c = '#C9A15E', d = '#8E6A36') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
  '<ellipse cy=".4" rx="17" ry="1.8" fill="#3C2810" opacity=".25"/>' +
  '<path d="M-16 0 Q-17 -15 0 -17 Q17 -15 16 0Z" fill="' + c + '"/>' +
  '<path d="M-12 -9 Q0 -13 12 -9 M-15 -3 Q0 -6 15 -3 M-8 -14.6 Q0 -16.6 8 -14.6" stroke="' + d + '" stroke-width=".6" fill="none"/>' +
  '<path d="M-10 -1 Q-9 -10 -4 -14 M4 -14.6 Q10 -10 10 -1" stroke="' + d + '" stroke-width=".45" fill="none" opacity=".7"/>' +
  '<path d="M3 0 V-8 Q6 -10.6 9 -8 V0Z" fill="#3A2614"/><path d="M0 -17 Q-1 -18.6 1.4 -19" stroke="' + d + '" stroke-width=".8" fill="none"/>' +
  '<path d="M0 -17 Q12 -15.4 16 0 L8 0 Q8 -10 0 -16Z" fill="#000" opacity=".12"/></g>';

/* the calabash stand: two forked posts and a crossbar, the calabashes stacked on it, their lids carved */
const stand = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
  '<path d="M-8 0 V-12 M8 0 V-12 M-9.4 -14 L-8 -12 L-6.6 -14 M6.6 -14 L8 -12 L9.4 -14" stroke="#6B4422" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
  '<path d="M-10 -12.4 H10" stroke="#7A5230" stroke-width="1.4"/>' +
  [[-5, '#D9A55A'], [0, '#E6B866'], [5, '#C98A3A']].map(([cx, c], i) => '<ellipse cx="' + cx + '" cy="-15" rx="3.4" ry="2.6" fill="' + c + '"/>' +
    '<path d="M' + (cx - 3) + ' -15.6 Q' + cx + ' -14.2 ' + (cx + 3) + ' -15.6" stroke="#7A4A26" stroke-width=".35" fill="none"/>' +
    (i === 1 ? '<ellipse cx="0" cy="-19.4" rx="2.6" ry="2" fill="#D9A55A"/><path d="M-2.2 -19.8 l1 -.8 1 .8 1 -.8 1 .8" stroke="#7A4A26" stroke-width=".3" fill="none"/>' : '')).join('') +
  '<path d="M-6.8 -9 Q-4 -6 -1 -9 M1 -9 Q4 -6 6.8 -9" stroke="#D9A55A" stroke-width=".9" fill="none"/></g>';

/* the cooking fire: three stones, the black pot, flames that flicker and a smoke that rises and drifts */
const fire = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
  '<g class="gk-smoke"><path d="M0 -10 q-2 -4 0 -8 q2 -4 0 -8" stroke="#E8E0D8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/></g>' +
  '<g class="gk-smoke s2"><path d="M1 -10 q2 -4 0 -8 q-2 -4 0 -8" stroke="#E8E0D8" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".45"/></g>' +
  '<g class="gk-fl"><path d="M-3.6 0 Q-3 -4 -1 -5 Q-1.4 -2.6 0 -2 Q.6 -5.6 2.4 -6.4 Q2 -3 3.8 0Z" fill="#F6A623"/><path d="M-1.6 0 Q-1 -2.6 0 -3 Q.6 -2 1.6 0Z" fill="#FFE08A"/></g>' +
  '<path d="M-4.6 -5.6 Q-5 -11 0 -11.4 Q5 -11 4.6 -5.6 Q0 -4 -4.6 -5.6Z" fill="#2A2420"/><path d="M-4 -10 Q0 -11.6 4 -10" stroke="#5A504A" stroke-width=".5" fill="none"/>' +
  '<g fill="#6E6258"><ellipse cx="-4.4" cy="-.6" rx="2" ry="1.4"/><ellipse cx="4.4" cy="-.6" rx="2" ry="1.4"/><ellipse cx="0" cy=".2" rx="1.6" ry="1"/></g></g>';

/* a mortar and its pestle; the woman's arms and the pestle rise and fall together (.gk-pound) */
const pounder = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
  person({ x: 0, y: 0, s: 1, skin: 3, dress: 'wom', c: '#7B1FA2', t: '#FFD54A', w: '#1E6FA8', w2: '#FFD54A', cap: 'kallabi', capc: '#C62828', capc2: '#FFD54A', al: 'head', ar: 'head', cls: 'gk-pnd' }) +
  '<g class="gk-pound"><path d="M0 -50 V-11" stroke="#8B5A2B" stroke-width="2.2" stroke-linecap="round"/></g>' +
  '<path d="M-5.6 -13 H5.6 L4 -6 Q5 -2 4.4 0 H-4.4 Q-5 -2 -4 -6Z" fill="#7A4A22"/><path d="M-5.6 -13 H5.6" stroke="#4E2E14" stroke-width=".9"/><path d="M-4 -6 H4" stroke="#4E2E14" stroke-width=".5" opacity=".6"/></g>';

/* a skein of birds going home: little dark Vs whose wings beat */
const birds = (x, y, s, cls) => '<g class="gk-birds ' + cls + '"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" stroke="#3A2E3A" stroke-width=".7" fill="none" stroke-linecap="round">' +
  // round five: the skein glides, one path for the six birds (their wing beats were too small to see)
  '<path d="' + [[0, 0], [-5, 2.4], [-10, 4.8], [-5, -2.4], [-10, -4.6], [-15, 6.8]].map(([bx, by], i) => 'M' + (bx - 2) + ' ' + (by - 1 + (i % 2) * .5) + ' Q' + (bx - 1) + ' ' + (by - 1.6) + ' ' + bx + ' ' + by + ' Q' + (bx + 1) + ' ' + (by - 1.6) + ' ' + (bx + 2) + ' ' + (by - 1 - (i % 2) * .4)).join('') + '"/></g></g>';

export function garkeScene(): string {
  const defs = '<defs>' + lg('gksky', '#6E5C8E', '#C9788A', '#F2A65E', '#F8CF86') + lg('gkgr', '#C99A62', '#B48452', '#9C7044') + lg('gkhill', '#8C6A78', '#A47A74') +
    '<radialGradient id="' + P + '-gksun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF1C2"/><stop offset=".3" stop-color="#FFD58A" stop-opacity=".75"/><stop offset="1" stop-color="#FFB86A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + P + '-sh" cx=".38" cy=".36" r=".7"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>' +
    '<radialGradient id="' + P + '-du" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F0C99A" stop-opacity=".8"/><stop offset="1" stop-color="#F0C99A" stop-opacity="0"/></radialGradient>' +
    shanuKit.defs() + '</defs>';

  // the dusk: the sun low over the hills, a glow round it, a few long clouds lit from below
  const sky = '<rect width="320" height="200" fill="url(#' + P + '-gksky)"/>' +
    '<g class="gk-sun"><circle cx="252" cy="46" r="34" fill="url(#' + P + '-gksun)"/></g><circle cx="252" cy="48" r="10" fill="#FFE3A0"/>' +
    '<g fill="#F7C49A" opacity=".55"><ellipse cx="70" cy="34" rx="34" ry="2.2"/><ellipse cx="96" cy="40" rx="22" ry="1.6"/><ellipse cx="236" cy="28" rx="40" ry="2.4"/><ellipse cx="262" cy="36" rx="20" ry="1.4"/></g>' +
    '<g fill="#B06A7A" opacity=".35"><ellipse cx="74" cy="35.6" rx="30" ry="1"/><ellipse cx="240" cy="30" rx="34" ry="1"/></g>';
  const hills = '<path d="M0 90 Q36 78 74 86 T150 84 T226 80 T320 86 V104 H0Z" fill="url(#' + P + '-gkhill)" opacity=".7"/>' +
    '<path d="M0 98 Q60 92 120 97 T240 95 T320 97 V106 H0Z" fill="#9A7064" opacity=".6"/>' +
    acacia(24, 99, 1.1) + acacia(300, 99, 1.2) + acacia(278, 97, .55, '#5E4A50');
  // the far herd coming home along the horizon, raising its dust, its herder behind with his staff
  const farHerd = '<g class="gk-far"><g opacity=".75">' +
    '<g class="x-du d1"><ellipse cx="290" cy="100" rx="34" ry="5" fill="url(#' + P + '-du)"/></g>' +
    [[208, 'wf', 0], [216, 'rb', 0], [223, 'wf', 0], [231, 'gu', 0], [238, 'rb', 0], [246, 'wf', 0], [212, 'rb', 0], [227, 'wf', 0]].map(([x, k], i) => cow(x + 60, 101 + (i % 2) * .8, i > 5 ? .26 : .3, k, 0)).join('') +
    person({ x: 316, y: 102, s: .2, skin: 2, c: '#5D4A86', cap: 'malafa', capc: '#D9B464', capc2: '#6B3A1E', al: 'staff', ar: 'down', cls: 'x-w x-hr', hl: '<path d="M-7.9 -36 L-6.8 1.4" stroke="#6B4422" stroke-width=".9"/>' }) +
    '</g></g>';
  const ground = '<path d="M0 104 Q160 100 320 104 V200 H0Z" fill="url(#' + P + '-gkgr)"/>' +
    '<g fill="#7A5A3A" opacity=".25"><ellipse cx="60" cy="132" rx="50" ry="2.4"/><ellipse cx="250" cy="138" rx="60" ry="2.6"/><ellipse cx="160" cy="170" rx="90" ry="3"/></g>' +
    '<g stroke="#8E8A40" stroke-width=".6" fill="none" opacity=".7">' + [[14, 116], [52, 122], [134, 112], [190, 118], [292, 120], [118, 128]].map(([x, y]) => '<path d="M' + x + ' ' + y + ' q-1 -3 -3 -4 M' + x + ' ' + y + ' q0 -4 1 -5 M' + x + ' ' + y + ' q1 -3 3.4 -3.6"/>').join('') + '</g>';

  // the left, beside the kraal: two huts, the calabash stand, the cooking fire, a woman pounding grain
  const camp = hut(2, 104, .75, '#B88A4C', '#7E5A2E') + hut(26, 107, .95) + stand(46, 110, .7) +
    near_(fire(12, 118, .8), 12, 118, 1.05, 2) + near_(pounder(34, 120, .45), 34, 120, 1.1, 2);
  // Nothing of the scene sits where the game's kraal stands (svg x 55–265, y 60–130 on a 16:10 tablet and a 7-inch one
  // alike, Sani 2026-10-26): the life is to its left, its right and below it.
  // below the camp on the left: a herder in his malafa drives a few cows home and out of sight; an old man on his mat on the right
  const herder = (x, y, s, sk, c, flip, cls = '') => person({ x, y, s, skin: sk, c, t: '#E9D9A6', cap: 'malafa', capc: '#D9B464', capc2: '#6B3A1E', al: 'staff', ar: 'down', flip, cls: 'x-w x-hr ' + cls,
    hl: '<path d="M-7.9 -36 L-6.8 1.4" stroke="#6B4422" stroke-width=".9" stroke-linecap="round"/>' });
  const drive = '<g class="gk-drive"><g class="x-du d2"><ellipse cx="16" cy="140" rx="30" ry="4" fill="url(#' + P + '-du)"/></g>' +
    cowLive(-8, 140, .8, 'rb', 1, 'up', 'gk-wk') + cowLive(10, 141.4, .82, 'wf', 1, 'up', 'gk-wk b') + cowLive(27, 140, .78, 'gu', 1, 'up', 'gk-wk') + cowLive(44, 141.6, .8, 'wf', 1, 'up', 'gk-wk b') +
    herder(62, 142, .55, 2, '#5D4A86', 1) + '</g>';
  const oldMan = '<g transform="translate(298 140) scale(.52)"><g class="x-sit"><path d="M-10 0 H12 L13 1.4 H-11Z" fill="#B88B3A" opacity=".8"/>' +
    person({ x: 0, y: 0, s: 1, skin: 4, dress: 'sit', c: '#E9E2D2', t: '#3F6E8C', cap: 'turban', capc: '#3F6E8C', beard: '#E8E4DC', al: 'front', ar: 'down', cls: 'x-w' }) + '</g></g>';

  // the right, beside the kraal: a hut, and the milk woman walking with her calabash
  const milkWoman = '<g class="gk-walk"><g class="gk-bob">' + person({ x: 0, y: 0, s: .42, skin: 5, dress: 'wom', c: '#1E3A6E', t: '#FFD54A', w: '#2B2B2B', w2: '#C62828', cap: 'kallabi', capc: '#2B2B2B', capc2: '#FFD54A', al: 'head', ar: 'down', cls: 'x-w',
    load: '<g><ellipse cy="-39.4" rx="5" ry="3.2" fill="#E6B866"/><path d="M-5 -39.4 Q0 -36 5 -39.4" stroke="#8A5A22" stroke-width=".4" fill="none"/><path d="M-4.8 -40.6 Q0 -44 4.8 -40.6 Q0 -42.2 -4.8 -40.6Z" fill="#F7F2E4"/><path d="M-3.4 -41.2 h6.8" stroke="#C98A3A" stroke-width=".35"/></g>' }) + '</g></g>';
  const right = hut(312, 107, .9, '#C29858', '#846034') + near_('<g transform="translate(286 114)">' + milkWoman + '</g>', 286, 114, 1.1, 2);

  // below the kraal on the right, the cattle being cattle: two bulls locking horns while a herder leans on his staff and
  // watches, an egret riding a cow's back, a girl milking, a boy leading a calf
  const fight = '<g class="x-du d1"><ellipse cx="246" cy="152" rx="24" ry="3.6" fill="url(#' + P + '-du)"/></g>' +
    '<g class="gk-butt l">' + cowLive(230, 153, 1.3, 'rb', 0, 'drink', 'gk-bull') + '</g><g class="gk-butt r">' + cowLive(261, 153.6, 1.3, 'wf', 1, 'drink', 'gk-bull') + '</g>' +
    herder(284, 157, .72, 4, '#8A5A2E', 1);
  const milking = '<g transform="translate(298 172) scale(1.25)">' + cowLive(0, 0, .95, 'gu', 1, 'up', 'x-dr') +
    '<g transform="translate(-4 0) scale(.5)"><g class="gk-milk">' + person({ x: 0, y: 0, s: 1, skin: 3, dress: 'sit', c: '#2E7D32', t: '#FFD54A', cap: 'kallabi', capc: '#FFD54A', capc2: '#2E7D32', al: 'front', ar: 'front', cls: 'x-w', flip: 1 }) + '</g></g>' +
    '<path d="M-12 0 Q-12.6 -3.4 -10 -3.6 Q-7.4 -3.4 -8 0Z" fill="#D9A55A"/><ellipse cx="-10" cy="-3.5" rx="2" ry=".5" fill="#FFFDF4"/>' +
    egret(4, -15, .32, 'gk-ride') + '</g>';
  const lead = '<g transform="translate(214 174) scale(1.4)"><g class="gk-lead">' + person({ x: 0, y: 0, s: .5, skin: 0, c: '#F4EBD0', t: '#C62828', cap: 'hula', capc: '#7A1F2B', capc2: '#E9C46A', al: 'out', ar: 'down', cls: 'x-w x-kid', flip: 1 }) +
    '<path d="M5.4 -8.4 Q11 -5 15.6 -7.4" stroke="#6B4422" stroke-width=".4" fill="none"/>' + calf(20, 0, .66, 'rb', 0) + '</g></g>';

  // the evening light over everything, warm at the bottom
  const light = '<rect width="320" height="200" fill="#F2A65E" opacity=".08"/>';

  return '<svg class="scene ' + P + ' gk" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + defs + sky +
    birds(60, 52, 1.1, 'b1') + birds(250, 46, .8, 'b2') + egret(140, 64, .7, 'e1') + egret(190, 58, .55, 'e2') + hills + ground + farHerd +
    camp + right + drive + oldMan + fight + milking + lead + light + '</svg>';
}


/*
 * The game's kraal (garke), drawn for Ƙirgen shanu's counting: a wide oval of packed earth fenced with cut thorn branches,
 * seen from the front. kraalBack() goes behind the cows (the earth and the far fence), kraalFront() in front of them (a
 * low near hedge), with a gap on the left where the herdsman stands and the cows come in. 640×180.
 */
const n2 = (v) => +(+v).toFixed(1);
const twigs = (pts, h, col) => pts.map(([x, y], i) => { const a = (i % 3) - 1, b = h * (.7 + (i % 4) * .12);
  return 'M' + x + ' ' + y + ' l' + (a * 4) + ' ' + (-b) + ' M' + (x + a * 2) + ' ' + (y - b * .55) + ' l' + (6 - (i % 2) * 12) + ' ' + (-b * .3) + ' M' + (x + a * 3) + ' ' + (y - b * .8) + ' l' + (-4 + (i % 2) * 8) + ' ' + (-b * .25); }).join(' ');
const arc = (y0, ry, from, to, n, dir) => Array.from({ length: n }, (_, i) => { const t = Math.PI * (from + (to - from) * i / (n - 1)); return [n2(320 - 300 * Math.cos(t)), n2(y0 + dir * ry * Math.sin(t))]; });
/* round five (Sani 2026-10-27, realism with performance): the fence is a real hedge of cut thorn branches (zariba) — a
   dense dark tangle along the ring with a ragged spiky crown, lit twigs on the sunward side, a few long branches poking
   out — drawn as one filled band and two strokes, instead of rows of stick-figure twigs */
function hedge(pts, h, dy, seed) {
  let top = '', bot = '', k = seed;
  const R = () => (k = (k * 16807) % 2147483647) / 2147483647;
  pts.forEach(([x, y], i) => { const hh = h * (.45 + R() * .55), cl = h * (.35 + R() * .3);
    // a rounded clump of brush, then two or three thorny sticks standing out of it
    top += (i ? 'L' : 'M') + n2(x - 5) + ' ' + n2(y - cl * .8) + 'Q' + n2(x - 3) + ' ' + n2(y - cl * 1.2) + ' ' + n2(x - 1) + ' ' + n2(y - cl) +
      'L' + n2(x - 2 + R() * 3) + ' ' + n2(y - hh) + 'L' + n2(x + .4) + ' ' + n2(y - cl * 1.05) + 'L' + n2(x + 3 + R() * 4) + ' ' + n2(y - hh * (.7 + R() * .4)) + 'L' + n2(x + 2.6) + ' ' + n2(y - cl * .95) +
      'Q' + n2(x + 5) + ' ' + n2(y - cl * 1.15) + ' ' + n2(x + 6) + ' ' + n2(y - cl * .8);
    bot = 'L' + n2(x + 3) + ' ' + n2(y + dy) + bot; });
  return top + bot + 'Z';
}
export function kraalBack(): string {
  const back = arc(112, 60, .02, .98, 46, -1);
  return '<svg class="kback" viewBox="0 0 640 180" preserveAspectRatio="none" aria-hidden="true">' +
    '<ellipse cx="320" cy="116" rx="304" ry="62" fill="#A97A4A"/><ellipse cx="320" cy="112" rx="292" ry="56" fill="#C0915C"/>' +
    '<g fill="#8A6038" opacity=".5"><ellipse cx="220" cy="120" rx="60" ry="6"/><ellipse cx="420" cy="104" rx="70" ry="5"/><ellipse cx="330" cy="146" rx="90" ry="6"/></g>' +
    '<path d="' + [[150, 96], [260, 132], [380, 120], [470, 140], [520, 108], [200, 150], [310, 84]].map(([x, y]) => 'M' + (x - 4) + ' ' + y + 'a4 1.8 0 1 0 8 0a4 1.8 0 1 0 -8 0').join('') + '" fill="#6A4A2A" opacity=".6"/>' +
    '<path d="' + hedge(back, 40, 4, 7) + '" fill="#5A3A22"/>' +
    '<path d="' + hedge(back.map(([x, y]) => [x + 3, y + 1]), 26, 3, 11) + '" fill="#76502E"/>' +
    '<path d="' + twigs(back, 36, '') + '" stroke="#A47848" stroke-width="1" fill="none" stroke-linecap="round" opacity=".75"/></svg>';
}
export function kraalFront(): string {
  const near = arc(112, 62, .16, .98, 34, 1);   // the near hedge, open on the left where the cows come in
  return '<svg class="kfront" viewBox="0 0 640 180" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="' + hedge(near.map(([x, y]) => [x, y + 2]), 26, 3, 5) + '" fill="#4A2E18"/>' +
    '<path d="' + hedge(near.map(([x, y]) => [x + 4, y + 3]), 16, 2, 9) + '" fill="#6A4626"/>' +
    '<path d="' + twigs(near, 22, '') + '" stroke="#B0844E" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".8"/>' +
    // the gate posts either side of the gap
    '<path d="M' + n2(320 - 300 * Math.cos(Math.PI * .16)) + ' ' + n2(112 + 62 * Math.sin(Math.PI * .16)) + ' v-26 M22 112 v-24" stroke="#4E2E14" stroke-width="5" stroke-linecap="round"/></svg>';
}

/*
 * The kraal's cattle (Sani 2026-10-26: "beefier, different breed and gender"): drawn exactly as the market draws its cows
 * (sc-shanu's table), with a heavier barrel, and bulls beside the cows: a bull has a big hump, a deep dewlap, thicker
 * horns and no udder. Breeds: White Fulani (Bunaji), Red Bororo (Rahaji) and Sokoto Gudali, cream with short horns.
 */
const sc = (pts, cx, cy, kx, ky) => pts.map(([x, y]) => [+(cx + (x - cx) * kx).toFixed(1), +(cy + (y - cy) * ky).toFixed(1)]);
const GUDALI_HORNS = [[[200, 58], [196, 50], [196, 42], [199, 37]], [[207, 56], [211, 48], [212, 41], [209, 36]]];
function beef(base, o) {
  const b = dabSpec[base], v = { ...b, ...o };
  v.body = sc(b.body, 108, 60, 1.03, 1.13);
  if (o.bull) { v.hump = sc(b.hump, 152, 68, 1.12, 1.5); v.dewlap = sc(b.dewlap, 192, 90, 1.18, 1.3); v.hw = [b.hw[0] * 1.3, b.hw[1] * 1.4]; delete v.udder; v.k = 1.04; }
  else v.k = .98;
  return v;
}
if (dabSpec.cw && !dabSpec.kcw) Object.assign(dabSpec, {
  kcw: beef('cw', {}), kbw: beef('cw', { bull: true }),
  kcr: beef('cr', {}), kbr: beef('cr', { bull: true }),
  kcg: beef('cw', { coat: ['#F4EFE4', '#DCD3C3', '#A99D8A'], legs: ['#E2DACB', '#ADA190'], far: '#AFA494', horns: GUDALI_HORNS, hornC: '#E6DCC6', hornTip: '#6A5A44', hw: [7, 2.8], muzzle: '#4A403A' }),
  kbg: beef('cw', { bull: true, coat: ['#E6E0D6', '#BDB4A6', '#7E7466'], legs: ['#C9C0B2', '#8E8476'], far: '#8E8476', horns: GUDALI_HORNS, hornC: '#E0D4BA', hornTip: '#5A4A36', hw: [7, 2.8], muzzle: '#3A322C' }),
});
/** the counted cattle in turn: never two of a kind side by side, cows and bulls mixed */
export const KRAAL_KINDS = ['kcw', 'kbr', 'kcg', 'kbw', 'kcr', 'kbg'];
export const kraalCow = (n) => dabbaAlone(KRAAL_KINDS[n % KRAAL_KINDS.length]);

/* the sounds of a good count (Sani 2026-10-26: "sound effects for success, you only have for failure"): each cow's bell
   clonks as the count runs up on her, a little higher each time, and when the herd is counted they low together,
   content, and the herdsman whistles. WebAudio, on the tab's own volume. */
let gac = null;
const actx = () => { try { gac = gac || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { gac = null; } return gac; };
export function countBell(k) {
  const a = actx(); if (!a) return; const t = a.currentTime + .02, up = Math.pow(1.06, k);
  [[620, .09], [930, .05], [1480, .022]].forEach(([f, v]) => { const o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(f * up, t);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + .45); o.connect(g).connect(a.destination); o.start(t); o.stop(t + .5); });
}
export function happyHerd() {
  const a = actx(); if (!a) return; const t0 = a.currentTime + .05;
  // two contented lows, rising at the end, one a little after the other
  [[118, 0], [146, .28]].forEach(([f0, d]) => { const t = t0 + d, o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * 1.08, t + .5); o.frequency.linearRampToValueAtTime(f0 * 1.32, t + .95);
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(520, t); lp.frequency.linearRampToValueAtTime(900, t + .9);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .12); g.gain.setValueAtTime(.09, t + .75); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
    o.connect(lp).connect(g).connect(a.destination); o.start(t); o.stop(t + 1.15); });
  // the herdsman's two-note whistle
  const w = t0 + 1.05; [[1560, 0, .16], [2080, .2, .26]].forEach(([f, d, len]) => { const o = a.createOscillator(), g = a.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(f * .96, w + d); o.frequency.linearRampToValueAtTime(f, w + d + .05);
    g.gain.setValueAtTime(.0001, w + d); g.gain.exponentialRampToValueAtTime(.05, w + d + .03); g.gain.exponentialRampToValueAtTime(.0001, w + d + len); o.connect(g).connect(a.destination); o.start(w + d); o.stop(w + d + len + .05); });
}
