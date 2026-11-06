// @ts-nocheck
/*
 * The people and stalls inside the Yoruba and Igbo games (Sani 2026-11-06), in place of the Hausa pieces the games draw
 * (durbar.ts, kalangu.ts, sc-suya.ts, teastall.ts). Each piece keeps the Hausa one's viewBox and the classes its game
 * and gamelab.css move (the emir's .e-* parts, the guards' .dg-spear and .tassel, the fan, the band's .kakaki and
 * .drumarm, the rider's .hrs, .flag, .cloth, .flagL, .r-smile / .r-frown), so the game plays exactly as in Hausa.
 *
 *   Yoruba (Ojúde Ọba, Dùndún, Bọ̀lì, Àkàrà): the Awujale in a white agbada and a beaded crown under a royal umbrella,
 *   palace guards in aso-òkè with carved staffs, dundun drummers, dancers in iro, buba and gele.
 *   Igbo (Ofala, Ogene, Ọka na Ube, Okpa): the Obi in red with his red cap and white feathers and his fan, Ndichie
 *   attendants in red caps, an age-grade dancing in under its banner, ogene players and Atilogwu dancers.
 *
 * makeArt('yo' | 'ig') gives them by the names engine.ts and games2.ts look up (SK_ in those files).
 */
import { person, hat, dk, lt, f1, SKT } from './south';
import { talkingDrum } from './kalangu';
import { stand } from './sc-suya';
import { teaStall } from './teastall';
import { useRiders } from './durbar';

let gid = 0;

/** a hand-held fan (abẹ̀bẹ̀ / the Obi's leather fan): round, edged, with a pattern, on a short handle from (x0, y0) */
function roundFan(x0, y0, x, y, r, c, edge, mark) {
  return '<path d="M' + x0 + ' ' + y0 + ' L' + x + ' ' + y + '" stroke="#5A3A1C" stroke-width="' + f1(r * .14) + '" stroke-linecap="round"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/><circle cx="' + x + '" cy="' + y + '" r="' + f1(r * .92) + '" fill="none" stroke="' + edge + '" stroke-width="' + f1(r * .16) + '"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + f1(r * .45) + '" fill="none" stroke="' + mark + '" stroke-width="' + f1(r * .1) + '"/>' +
    '<path d="M' + f1(x - r * .62) + ' ' + y + ' H' + f1(x + r * .62) + ' M' + x + ' ' + f1(y - r * .62) + ' V' + f1(y + r * .62) + '" stroke="' + mark + '" stroke-width="' + f1(r * .07) + '"/>';
}
/** a horsetail fly-whisk (irùkẹ̀rẹ̀): a short handle and a fall of white hair */
const whisk = (x0, y0, x, y) => '<path d="M' + x0 + ' ' + y0 + ' L' + x + ' ' + y + '" stroke="#3A2416" stroke-width="2.4" stroke-linecap="round"/>' +
  '<path d="M' + x + ' ' + y + ' q-4 -14 2 -26 q2 12 6 18 q-1 -12 6 -18 q-2 16 -6 24 Z" fill="#F4F1EA" stroke="#B8B0A0" stroke-width=".5"/>';

export function makeArt(L) {
  const Y = L === 'yo';
  // Ojúde Ọba's horsemen: the Balogun families' riders in flowing agbada of aso-òkè colours and white or coloured turbans, no veils
  if (Y) useRiders([
    { coat: ['#8B5A2B', '#4E2E14'], mane: '#1A0E06', cap: ['#7A2E5C', '#E8B830', '#F4EBD0'], pat: 'diamond', plume: '#E8B830', robe: '#F4EBD0', trim: '#7A2E5C', turban: '#7A2E5C', veil: false, spear: false, skin: 0, flag: ['#7A2E5C', '#E8B830'] },
    { coat: ['#B5562A', '#7A3416'], mane: '#4E1E08', cap: ['#1F3A78', '#E8B830', '#FFFFFF'], pat: 'stripe', plume: '#FFFFFF', robe: '#5B8FC9', trim: '#E8B830', turban: '#FFFFFF', veil: false, spear: true, skin: 1, flag: ['#1F3A78', '#E8B830'] },
    { coat: ['#E8E4DC', '#A9A49A'], mane: '#8C877C', cap: ['#2E7D5A', '#E8B830', '#7A2E5C'], pat: 'check', plume: '#2E7D5A', robe: '#2E7D5A', trim: '#F4EBD0', turban: '#F4EBD0', veil: false, spear: false, skin: 2, flag: ['#2E7D5A', '#F4EBD0'] },
    { coat: ['#3A2A20', '#120A06'], mane: '#000000', cap: ['#E8B830', '#7A2E5C', '#FFFFFF'], pat: 'star', plume: '#7A2E5C', robe: '#7A2E5C', trim: '#E8B830', turban: '#E8B830', veil: false, spear: false, skin: 3, flag: ['#E8A317', '#7A2E5C'] },
    { coat: ['#C9A262', '#8B6A34'], mane: '#3A2410', cap: ['#C2185B', '#FFFFFF', '#1F3A78'], pat: 'diamond', plume: '#C2185B', robe: '#FFFFFF', trim: '#C2185B', turban: '#1F3A78', veil: false, spear: true, skin: 0, flag: ['#C2185B', '#FFFFFF'] },
    { coat: ['#9A8478', '#5E4A40'], mane: '#2B1E18', cap: ['#1F3A78', '#E8B830', '#C62828'], pat: 'stripe', plume: '#E8B830', robe: '#1F3A78', trim: '#E8B830', turban: '#FFFFFF', veil: false, spear: false, skin: 1, flag: ['#1F3A78', '#FFFFFF'] },
  ]);

  /* ---------------- the king on his throne (Hausa: emirThrone, 200 x 250) ---------------- */
  function emirThrone() {
    const id = 'sa' + (gid++), sk = SKT[1], skd = dk(sk, .3), ink = '#1A0E06';
    const robe = Y ? '#F4EBD0' : '#B71C1C', robeD = dk(robe, .2), trim = Y ? '#C9A227' : '#F4EBD0';
    const g1 = Y ? '#6A1B4D' : '#B71C1C', g2 = Y ? '#E8B830' : '#F4F1EA';
    // the royal umbrella: eight gores, a scalloped valance, a fringe
    let gores = ''; for (let k = 0; k < 8; k++) { const a = 8 + k * 23, b = a + 23;
      gores += '<path d="M100 -4 Q' + f1(100 + (a - 100) * .55) + ' -2 ' + a + ' 50 L' + b + ' 50 Q' + f1(100 + (b - 100) * .55) + ' -2 100 -4 Z" fill="' + (k % 2 ? g2 : g1) + '"/>'; }
    let val = 'M8 50 H192 V58'; for (let k = 8; k > 0; k--) val += ' Q' + f1(8 + k * 23 - 11.5) + ' 68 ' + (8 + (k - 1) * 23) + ' 58'; val += ' Z';
    let fringe = ''; for (let x = 10; x <= 190; x += 4) fringe += '<path d="M' + x + ' 60 v' + (3 + (x % 3)) + '" stroke="#E8B830" stroke-width="1.1"/>';
    const umbrella = '<path d="M98.6 50 H101.4 V96 H98.6 Z" fill="#5A3A1C"/>' + gores + '<path d="' + val + '" fill="' + (Y ? '#E8B830' : '#1E1E24') + '"/>' + fringe +
      (Y ? '<path d="M96 -4 q4 -8 8 0 q-2 -2 -4 -1 q-2 -1 -4 1 Z" fill="#E8B830"/><path d="M100 -10 l4 -3 l-1 3 Z" fill="#E8B830"/>' : '<circle cx="100" cy="-6" r="3.4" fill="#E8B830"/>');
    // the throne: a carved wooden back with a velvet panel, the seat, a mat in front
    const throne = '<path d="M62 96 Q62 76 100 74 Q138 76 138 96 L142 206 H58 Z" fill="#6E4026"/>' +
      '<path d="M70 98 Q70 84 100 82 Q130 84 130 98 L133 196 H67 Z" fill="' + (Y ? '#5B1F3E' : '#7F1414') + '"/>' +
      '<path d="M66 100 Q66 80 100 78 Q134 80 134 100" fill="none" stroke="#C9A227" stroke-width="1.6" stroke-dasharray="3 2"/>' +
      '<path d="M46 178 H154 L158 196 H42 Z" fill="#7A4A26"/><path d="M42 196 H158 V204 H42 Z" fill="#4E2E14"/>' +
      '<path d="M14 228 H186 L192 244 H8 Z" fill="' + (Y ? '#2E5E8A' : '#1F4E2E') + '"/><path d="M14 228 H186" stroke="#E8B830" stroke-width="1.4"/>' +
      Array.from({ length: 21 }, (_, k) => '<path d="M' + (16 + k * 8.4) + ' 236 l4 3 l4 -3" stroke="#E8B830" stroke-width=".9" fill="none"/>').join('');
    // the king's body: a wide robe over the seat, the legs and slippers below it, coral beads at the neck
    const bodyK = '<path d="M80 204 H120 L122 224 H78 Z" fill="' + (Y ? '#E8DFC8' : '#F4F1EA') + '"/>' +
      '<path d="M76 224 Q76 230 88 230 H98 V222 H80 Z M124 224 Q124 230 112 230 H102 V222 H120 Z" fill="' + (Y ? '#7A2E5C' : '#1E1E24') + '"/>' +
      '<path d="M72 128 Q100 120 128 128 Q150 150 154 200 Q130 210 100 207 Q70 210 46 200 Q50 150 72 128 Z" fill="' + robe + '"/>' +
      '<path d="M128 128 Q150 150 154 200 Q140 205 128 206 Q134 160 116 126 Z" fill="#000" opacity=".12"/>' +
      '<path d="M88 126 Q100 152 112 126" fill="none" stroke="' + trim + '" stroke-width="2"/><path d="M86 136 q-4 14 4 20 q8 3 10 -6" fill="none" stroke="' + trim + '" stroke-width="1.4"/>' +
      '<path d="M94 118 H106 V130 H94 Z" fill="' + dk(sk, .1) + '"/>' +
      '<path d="M89 124 Q100 136 111 124" fill="none" stroke="#C62828" stroke-width="3.2"/><path d="M89 124 Q100 136 111 124" fill="none" stroke="#FF8A65" stroke-width="1" stroke-dasharray="1.2 1.6"/>' +
      (Y ? '' : '<path d="M86 128 Q100 146 114 128" fill="none" stroke="#C62828" stroke-width="3"/><path d="M86 128 Q100 146 114 128" fill="none" stroke="#FF8A65" stroke-width="1" stroke-dasharray="1.2 1.6"/>');
    // the head: face, the crown (a beaded Yoruba ade with a short fringe, or the Obi's red cap and white feathers)
    const crown = Y
      ? '<path d="M88.5 98 L93 66 Q100 61 107 66 L111.5 98 Z" fill="#F2C230"/>' +
        [74, 82, 90].map((y, k) => '<path d="M' + f1(92.6 - (y - 66) * .1 + (98 - y) * .14) + ' ' + y + ' H' + f1(107.4 + (y - 66) * .1 - (98 - y) * .14) + '" stroke="' + (k === 1 ? '#C62828' : '#1F5B8A') + '" stroke-width="2.2"/>').join('') +
        '<path d="M96 64 q4 -7 8 0 q-2 -1.6 -4 -1 q-2 -.6 -4 1 Z" fill="#1F5B8A"/>' +
        Array.from({ length: 9 }, (_, k) => '<path d="M' + f1(89.6 + k * 2.6) + ' 97 v' + (2.6 + (k % 2)) + '" stroke="' + ['#F2C230', '#C62828', '#1F5B8A'][k % 3] + '" stroke-width="1"/>').join('')
      : hat('crownr', 100, 98.5, 11.4);
    const face = '<path d="M89.6 104 q-2.6 .2 -2.2 2.8 q.4 2.4 2.6 2 Z M110.4 104 q2.6 .2 2.2 2.8 q-.4 2.4 -2.6 2 Z" fill="' + dk(sk, .08) + '"/>' +
      '<ellipse cx="100" cy="107" rx="10.6" ry="12.4" fill="' + sk + '"/><path d="M104 96 Q111 100 110.4 108 Q109 116 101 119.4 Q107 114 107.6 107 Q108 100 104 96 Z" fill="' + skd + '" opacity=".6"/>' +
      '<path class="e-brow calm" d="M92 103 Q95 101.6 98.2 102.6 M101.8 102.6 Q105 101.6 108 103" stroke="' + ink + '" stroke-width="1" fill="none" stroke-linecap="round"/>' +
      '<path class="e-brow cross" d="M92 101.8 L98.2 103.8 M108 101.8 L101.8 103.8" stroke="' + ink + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
      '<path d="M93 106.2 q2.1 -1.6 4.2 0 q-2.1 1.5 -4.2 0 Z M102.8 106.2 q2.1 -1.6 4.2 0 q-2.1 1.5 -4.2 0 Z" fill="#F2ECE2"/>' +
      '<g class="e-pupils"><circle cx="95.2" cy="106.2" r="1" fill="' + ink + '"/><circle cx="105" cy="106.2" r="1" fill="' + ink + '"/></g>' +
      '<path d="M99.8 106 q.5 3 1 4.4 M97.6 111.2 q1.2 1 2.4 .4 q1.2 .6 2.4 -.4" stroke="' + skd + '" stroke-width=".8" fill="none" stroke-linecap="round"/>' +
      (Y ? '' : '<path d="M90.6 112 Q91.4 121 100 121.6 Q108.6 121 109.4 112 Q106 117 100 117 Q94 117 90.6 112 Z" fill="#2A1A10"/>') +
      '<path class="e-smile" d="M95.6 116.2 Q100 119 104.4 116.2" stroke="#2A1408" stroke-width=".9" fill="none" stroke-linecap="round"/>' +
      '<path class="e-frown" d="M95.6 117.6 Q100 115.4 104.4 117.6" stroke="#2A1408" stroke-width=".9" fill="none" stroke-linecap="round"/>';
    // the arms: resting on the knees with the whisk or the fan, folded when cross, the near one raised to wave when pleased
    const sl = (d, w = 12) => '<path d="' + d + '" stroke="' + robeD + '" stroke-width="' + (w + 1.4) + '" stroke-linecap="round" fill="none"/><path d="' + d + '" stroke="' + robe + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>';
    const hand = (x, y, r = 4.4) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + sk + '"/>';
    const held = Y ? whisk(137, 172, 146, 150) : roundFan(137, 172, 148, 146, 13, '#E8C35A', '#B71C1C', '#1E1E24');
    const rest = '<g class="e-rest"><g class="e-armL">' + sl('M75 132 Q58 148 61 172') + hand(62, 174) + '</g>' + sl('M125 132 Q142 148 138 170') + held + hand(137, 172) + '</g>';
    const fold = '<g class="e-fold">' + sl('M75 132 Q76 154 116 150', 11) + sl('M125 132 Q124 154 84 150', 11) + hand(116, 150, 4) + hand(84, 150, 4) + '</g>';
    const wave = '<g class="e-wave">' + sl('M75 132 L58 113', 11) + '<g class="e-fore">' + sl('M58 113 L55 88', 10) +
      '<path d="M50.6 88 Q49.6 80 51 76 L53 76 L53.4 72 L55.4 72 L55.8 75 L57.6 73.4 L59 76 Q60 84 58.6 88 Z" fill="' + sk + '"/></g></g>';
    return '<svg class="emir dur" viewBox="0 0 200 250" aria-hidden="true">' + umbrella + throne + bodyK + rest + fold + wave +
      '<g class="e-head">' + face + crown + '</g></svg>';
  }

  /* ---------------- the guards and attendants (Hausa: dogari 90 x 262, maiFanka 150 x 270) ---------------- */
  const GUARD = Y
    ? [{ robe: '#7A2E5C', hat: 'fila', hatc: '#7A2E5C', hatc2: '#E8B830', trou: '#7A2E5C' }, { robe: '#2E5E8A', hat: 'fila', hatc: '#2E5E8A', hatc2: '#F4EBD0', trou: '#2E5E8A' },
      { robe: '#F4EBD0', hat: 'gobi', hatc: '#7A2E5C', trou: '#E8DFC8', agbada: 1 }, { robe: '#E8A317', hat: 'fila', hatc: '#5B1F3E', trou: '#E8DFC8' }]
    : [{ robe: '#1E1E24', hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', trou: '#F4F1EA', beads: 1 }, { robe: '#F4F1EA', hat: 'okpuf', hatc: '#B71C1C', hatc2: '#1E1E24', trou: '#8E1B2A', beads: 1 },
      { robe: '#8E1B2A', hat: 'okpu', hatc: '#B71C1C', hatc2: '#E8B830', trou: '#F4F1EA' }, { robe: '#F4F1EA', hat: 'okpu', hatc: '#1E1E24', hatc2: '#B71C1C', trou: '#1E1E24' }];
  function dogari(v = 0) {
    const o = GUARD[v % GUARD.length], s = 248 / 140, hx = 42 + 21 * s, hy = 258 - 55 * s;
    const top = Y ? '<path d="M' + f1(hx - 4) + ' 30 Q' + f1(hx) + ' 14 ' + f1(hx + 4) + ' 30 Z" fill="#C9A227"/><circle cx="' + f1(hx) + '" cy="16" r="3" fill="#C9A227"/>'
      : '<path d="M' + f1(hx - 5) + ' 34 L' + f1(hx) + ' 14 L' + f1(hx + 5) + ' 34 Z" fill="#B9BEC6"/>';
    return '<svg class="dogari dur" viewBox="0 0 90 262" aria-hidden="true">' +
      person(42, 258, 248, { kind: 'man', skin: v + 1, ...o, ar: 'staff', beard: v === 2 }) +
      '<g class="dg-spear"><path d="M' + f1(hx) + ' 30 V252" stroke="#5A3A1C" stroke-width="3.4" stroke-linecap="round"/>' + top +
      '<g class="tassel"><path d="M' + f1(hx) + ' 34 v8" stroke="' + (Y ? '#C62828' : '#E8B830') + '" stroke-width="1"/><path d="M' + f1(hx - 2.6) + ' 41 h5.2 l1.6 10 h-8.4 Z" fill="' + (Y ? '#C62828' : '#E8B830') + '"/></g>' +
      '<circle cx="' + f1(hx) + '" cy="' + f1(hy) + '" r="6" fill="' + SKT[(v + 1) % SKT.length] + '"/></g></svg>';
  }
  function maiFanka() {
    const s = 250 / 140, px = 80 - 8 * s, py = 126.5 + 77 * s;
    const who = Y ? { kind: 'woman', skin: 4, robe: '#F4EBD0', wrap: '#7A2E5C', hat: 'gele', hatc: '#E8B830', ipele: '#7A2E5C' }
      : { kind: 'man', skin: 4, robe: '#F4F1EA', trou: '#B71C1C', hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', beads: 1 };
    return '<svg class="fanka dur" viewBox="0 0 150 270" aria-hidden="true">' + person(px, py, 250, { ...who, ar: 'play' }) +
      '<g class="fan">' + roundFan(80, 126, 106, 78, 24, Y ? '#C9A35A' : '#E8C35A', Y ? '#7A2E5C' : '#B71C1C', Y ? '#1F3A78' : '#1E1E24') +
      '<circle cx="80" cy="126" r="6.4" fill="' + SKT[4] + '"/></g></svg>';
  }

  /* ---------------- the band behind the court (Hausa: sallahBand, 0 -28 220 92) ---------------- */
  const dundun = '<g transform="rotate(-16 15 64)"><path d="M3 57 Q15 62 27 57 L27 71 Q15 66 3 71 Z" fill="#8B5A2B"/>' +
    '<path d="M3 58 L27 70 M3 62 L27 66 M3 66 L27 62 M3 70 L27 58" stroke="#F1E2C0" stroke-width=".6"/><ellipse cx="3" cy="64" rx="1.8" ry="7" fill="#F1E2C0"/><ellipse cx="27" cy="64" rx="1.8" ry="7" fill="#E9D6AE"/></g>';
  const ogene = '<g transform="rotate(-24 22 70)"><path d="M23 67 L2 58 Q-2 63 2 68 L23 73 Z" fill="#8A8F96"/><path d="M23 67 L2 58 Q0 60 1 62 L23 69 Z" fill="#C9CED6"/><ellipse cx="2" cy="63" rx="2.4" ry="5" fill="#4A4E54"/></g>';
  const stick = '<path d="M0 0 Q-6 4 -11 11" stroke="#4E2E14" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  function sallahBand() {
    const H = 86, mk = (x, o) => person(x, 62, H, { kind: 'man', ...o });
    const guard = (x, v) => { const o = GUARD[v % GUARD.length], s = H / 140, hx = x + 21 * s;
      return mk(x, { ...o, skin: v, ar: 'staff' }) + '<path d="M' + f1(hx) + ' -24 V60" stroke="#5A3A1C" stroke-width="1.6"/>'; };
    const player = (x, i, inst, o) => '<g class="kakaki">' + mk(x, { skin: i, ...o, al: 'hold', ar: 'play', arc: 'drumarm', hr: stick, front: inst }) + '</g>';
    const C = Y ? [['#7A2E5C', 'fila', '#E8B830'], ['#2E5E8A', 'fila', '#F4EBD0'], ['#E8A317', 'gobi', '#7A2E5C'], ['#F4EBD0', 'fila', '#1F3A78']]
      : [['#F4F1EA', 'okpu', '#B71C1C'], ['#1E1E24', 'okpu', '#B71C1C'], ['#8E1B2A', 'okpu', '#1E1E24'], ['#F4F1EA', 'okpuf', '#B71C1C']];
    const inst = (k) => Y ? dundun : (k % 2 ? dundun.replace(/#8B5A2B/, '#6E4026') : ogene);
    return '<svg class="sallah sk5b" viewBox="0 -28 220 92" aria-hidden="true">' + guard(14, 0) +
      [44, 76, 110, 140].map((x, k) => player(x, k + 1, inst(k), { robe: C[k][0], hat: C[k][1], hatc: C[k][2], hatc2: '#1E1E24' })).join('') + guard(200, 1) + '</svg>';
  }

  /* ---------------- Ofala: an age-grade dances in under its banner (Hausa: durbarRider, -54 -116 316 342) ---------------- */
  const AGE = [['#F4F1EA', '#8E1B2A'], ['#1E1E24', '#E8B830'], ['#F4F1EA', '#1F4E2E'], ['#B71C1C', '#F4F1EA'], ['#E8A317', '#1E1E24'], ['#2E5E8A', '#F4F1EA']];
  function ageGrade(Lt, vi = 0) {
    const [top, wrap] = AGE[vi % AGE.length], s = 185 / 140;
    const o = (i, extra) => ({ kind: 'man', skin: vi + i, robe: top, trou: wrap, hat: i === 1 ? 'okpuf' : 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', cls: 'dance', ...extra });
    const px = 139, flagCols = [wrap, '#E8B830'];
    let men = person(40, 214, 185, o(0, { al: 'wave', ar: 'down', hl: whisk(0, 0, -2, -14) })) +
      person(115, 214, 185, o(1, { ar: 'up', al: 'hip' })) +
      person(192, 214, 185, o(2, { al: 'down', ar: 'wave', beads: 1 }));
    men = men.replace(/class="x-ms"/g, 'class="x-ms r-smile"').replace(/class="x-mf"/g, 'class="x-mf r-frown"');
    return '<svg class="rider dur sk5r" viewBox="-54 -116 316 342" aria-hidden="true">' +
      '<g class="dust"><circle cx="40" cy="210" r="7"/><circle cx="115" cy="211" r="6"/><circle cx="192" cy="210" r="7"/></g>' +
      '<g class="hrs" style="transform-box:view-box;transform-origin:120px 214px">' +
      '<g class="flag"><path d="M' + px + ' -100 L' + px + ' 120" stroke="#5E3A1C" stroke-width="4" stroke-linecap="round"/><path d="M' + (px - 2.5) + ' -100 l2.5 -12 l2.5 12 Z" fill="#C9A227"/>' +
      '<g class="cloth"><path class="fglow" d="M' + (px - 1) + ' -94 Q' + (px - 56) + ' -104 ' + (px - 156) + ' -92 Q' + (px - 142) + ' -40 ' + (px - 156) + ' 14 Q' + (px - 56) + ' 4 ' + px + ' 14 Z" fill="none" stroke="#FFD400" stroke-width="28" stroke-linejoin="round"/>' +
      '<path d="M' + (px - 1) + ' -94 Q' + (px - 56) + ' -104 ' + (px - 156) + ' -92 Q' + (px - 142) + ' -40 ' + (px - 156) + ' 14 Q' + (px - 56) + ' 4 ' + px + ' 14 Z" fill="' + flagCols[0] + '"/>' +
      '<path d="M' + (px - 8) + ' -84 Q' + (px - 58) + ' -92 ' + (px - 142) + ' -82 Q' + (px - 130) + ' -40 ' + (px - 142) + ' 4 Q' + (px - 58) + ' -4 ' + (px - 8) + ' 4 Z" fill="#FFFFFF"/>' +
      '<path d="M' + (px - 156) + ' -92 l-10 8 l10 6 M' + (px - 156) + ' 14 l-10 -8 l10 -6" fill="' + flagCols[1] + '"/>' +
      '<text x="' + (px - 75) + '" y="-1" text-anchor="middle" class="flagL">' + Lt + '</text></g></g>' +
      men + '</g></svg>';
  }

  /* ---------------- the drummers' square (Hausa: KL.dancers, KL.band) ---------------- */
  const hanky = (x, y, c) => '<path d="M' + x + ' ' + y + ' q-6 -8 -2 -14 q4 4 10 2 q-2 6 -8 12 Z" fill="' + c + '"/>';
  const hair = '<path d="M19.4 24 Q18.4 13.6 30 13.8 Q41.6 13.6 40.6 24 Q37 17.6 30 18 Q23 17.6 19.4 24 Z" fill="#1E120A"/><path d="M24 15 V10 M30 14 V8.6 M36 15 V10" stroke="#1E120A" stroke-width="1.8" stroke-linecap="round"/>';
  const defs = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="k4-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A0703E"/><stop offset="1" stop-color="#6E4626"/></linearGradient>' +
    '<linearGradient id="k4-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9CED6"/><stop offset="1" stop-color="#7A8088"/></linearGradient></defs></svg>';
  /** a person in the kalangu stage's frame and classes (kalangu.css moves .kl-body, .kl-head, .kl-al, .kl-ar, .kl-ms / .kl-mf) */
  const kfig = (o, sc = 1) => '<svg class="kl-fig" viewBox="-14 -14 88 152" aria-hidden="true">' +
    person(30, 134, 140 * sc, { ...o, cls: 'kl-body', alc: 'kl-al', arc: 'kl-ar' }).replace('class="x-head"', 'class="x-head kl-head"').replace('class="x-ms"', 'class="x-ms kl-ms"').replace('class="x-mf" opacity="0"', 'class="x-mf kl-mf"') + '</svg>';
  function dancers() {
    const D = Y ? [
      [{ kind: 'woman', skin: 0, robe: '#E8A317', trim: '#7A2E5C', wrap: '#7A2E5C', wrap2: '#E8B830', ipele: '#7A2E5C', hat: 'gele', hatc: '#E8A317', al: 'up', ar: 'out', hl: hanky(0, 0, '#FFFFFF') }, 1],
      [{ kind: 'man', skin: 1, robe: '#F4EBD0', robe2: '#7A2E5C', agbada: '#F4EBD0', trim: '#7A2E5C', hat: 'gobi', hatc: '#7A2E5C', hatc2: '#E8B830', al: 'out', ar: 'up' }, 1],
      [{ kind: 'woman', skin: 2, robe: '#2E7D5A', trim: '#E8B830', wrap: '#14503A', hat: 'braids', tight: 1, al: 'clap', ar: 'clap' }, .8],
      [{ kind: 'man', skin: 3, robe: '#1F3A78', trim: '#C9D6F2', hat: 'fila', hatc: '#1F3A78', hatc2: '#C9D6F2', beard: 'w', marks: 1, al: 'hip', ar: 'up', hr: roundFan(0, 0, 3, -12, 8, '#C9A35A', '#7A2E5C', '#1F3A78') }, 1],
    ] : [
      [{ kind: 'woman', skin: 0, robe: '#F4F1EA', trim: '#8E1B2A', wrap: '#8E1B2A', wrap2: '#E8B830', hat: 'tie', hatc: '#8E1B2A', hatc2: '#E8B830', beads: 1, al: 'up', ar: 'out', hl: hanky(0, 0, '#E8B830') }, 1],
      [{ kind: 'man', skin: 1, robe: '#B71C1C', trim: '#E8B830', trou: '#F4F1EA', hat: 'okpu', hatc: '#1E1E24', hatc2: '#E8B830', sash: '#E8B830', al: 'up', ar: 'up' }, 1],
      [{ kind: 'woman', skin: 2, robe: '#E8A317', trim: '#1F4E2E', wrap: '#1F4E2E', hat: 'braids', tight: 1, beads: 1, al: 'clap', ar: 'clap' }, .8],
      [{ kind: 'man', skin: 3, robe: '#F4F1EA', trim: '#B71C1C', wrapper: '#8E1B2A', hat: 'okpuf', hatc: '#B71C1C', hatc2: '#1E1E24', beads: 1, beard: 'w', al: 'hip', ar: 'up', hr: roundFan(0, 0, 3, -12, 8, '#E8C35A', '#B71C1C', '#1E1E24') }, 1],
    ];
    return defs + D.map(([o, s], i) => '<span class="kl-dn d' + i + '">' + kfig(o, s) + '</span>').join('');
  }
  function band() {
    const tdrum = (o) => kfig({ ...o, kind: 'man', behind: talkingDrum(-12, 70, 26, 8.5), al: 'M16 46 Q2 54 -2 66|-3,68',
      ar: 'M44 46 Q50 66 30 72|28,72', hr: '<path d="M0 0 Q-8 -10 -15 -8" stroke="#4E2E14" stroke-width="1.8" fill="none" stroke-linecap="round"/>' });
    const igba = (o) => kfig({ ...o, kind: 'man', behind: '<path d="M18 44 L50 86" stroke="#6B4422" stroke-width="2.4"/>',
      al: 'M16 46 Q8 70 34 76|36,76', ar: 'M44 46 Q58 54 56 64|56,66',
      hl: '<path d="M0 0 L12 -10" stroke="#4E2E14" stroke-width="1.6" stroke-linecap="round"/>', hr: '<path d="M0 0 L-4 12" stroke="#4E2E14" stroke-width="1.6" stroke-linecap="round"/>',
      front: '<g class="kl-drum" style="transform-origin:46px 92px"><rect x="34" y="80" width="26" height="28" rx="3" fill="url(#k4-wood)"/>' +
        '<path d="M34 86 L60 102 M34 102 L60 86" stroke="#F1E2C0" stroke-width=".8"/><ellipse cx="47" cy="80" rx="13" ry="3.4" fill="#F1E2C0" stroke="#8B5A2B" stroke-width=".8"/>' +
        '<ellipse cx="47" cy="108" rx="13" ry="3" fill="#5E3A1C"/></g>' });
    // the lead: Yoruba, a shèkèrè player shaking the beaded gourd high; Igbo, the ogene player, the bell raised and struck
    const lead = Y
      ? kfig({ kind: 'man', skin: 0, robe: '#7A2E5C', trim: '#E8B830', hat: 'fila', hatc: '#7A2E5C', hatc2: '#E8B830',
        al: 'M16 46 Q30 42 40 24|40,24', ar: 'M44 46 Q58 34 50 18|50,18',
        behind: '<g class="kl-horn" style="transform-origin:45px 20px"><ellipse cx="45" cy="10" rx="11" ry="13" fill="#C98A3A"/><path d="M45 -3 v-6" stroke="#8B5A2B" stroke-width="3"/>' +
          '<path d="M35 6 Q45 12 55 6 M34 12 Q45 18 56 12 M36 18 Q45 23 54 18" stroke="#F4EBD0" stroke-width="1" fill="none" stroke-dasharray="1.4 1.6"/></g>' })
      : kfig({ kind: 'man', skin: 0, robe: '#F4F1EA', trim: '#B71C1C', trou: '#8E1B2A', hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24', beads: 1,
        al: 'M16 46 Q26 40 34 22|34,22', ar: 'M44 46 Q60 40 56 26|56,26', hr: '<path d="M0 0 L-12 -14" stroke="#4E2E14" stroke-width="1.8" stroke-linecap="round"/>',
        behind: '<g class="kl-horn" style="transform-origin:34px 22px"><path d="M34 24 L42 -6 Q36 -10 30 -6 Z" fill="url(#k4-steel)"/><path d="M34 24 L28 2 Q24 2 24 6 Z" fill="#8A8F96"/><path d="M30 -6 Q36 -10 42 -6" stroke="#4A4E54" stroke-width="1.4" fill="none"/></g>' });
    const C = Y ? [['#2E5E8A', '#F4EBD0', 'fila'], ['#E8A317', '#7A2E5C', 'gobi'], ['#F4EBD0', '#1F3A78', 'fila']]
      : [['#1E1E24', '#E8B830', 'okpu'], ['#8E1B2A', '#F4F1EA', 'okpu'], ['#F4F1EA', '#B71C1C', 'okpuf']];
    const m = (k) => ({ skin: k + 1, robe: C[k][0], trim: C[k][1], hat: C[k][2], hatc: Y ? C[k][0] === '#F4EBD0' ? '#1F3A78' : C[k][0] : '#B71C1C', hatc2: Y ? '#E8B830' : '#1E1E24', beads: !Y });
    return defs + '<span class="kl-bm k">' + lead + '</span>' +
      '<span class="kl-bm d1">' + (Y ? tdrum(m(0)) : igba(m(0))) + '</span>' +
      '<span class="kl-bm d2">' + (Y ? tdrum(m(1)) : igba(m(1))) + '</span>' +
      '<span class="kl-bm g">' + igba(m(2)) + '</span>' +
      '<span class="kl-notes"><i>♪</i><i>♫</i><i>♪</i><i>♫</i></span>';
  }

  /* ---------------- the people waiting to travel (Hausa: JR.waiter), and the Lagos danfo (Hausa: JR.engineBoat) ---------------- */
  const WAITERS = Y
    ? [{ kind: 'woman', robe: '#E8A317', wrap: '#1F3A78', hat: 'gele', hatc: '#1F3A78', load: '<ellipse rx="8" ry="2.4" fill="#B5BCC0"/><path d="M-6 -2 Q0 -7 6 -2" fill="#E8A317"/>' }, { kind: 'man', robe: '#F4EBD0', hat: 'fila', hatc: '#2E5E8A', hr: '<rect x="-3" y="0" width="7" height="9" rx="1" fill="#5A3A22"/>' },
      { kind: 'boy', robe: '#2E7D5A', hat: 'hair' }, { kind: 'woman', robe: '#C2185B', wrap: '#7A2E5C', wrap2: '#E8B830', hat: 'gele', hatc: '#C2185B', ipele: '#7A2E5C' }, { kind: 'man', robe: '#5B8FC9', hat: 'gobi', hatc: '#7A2E5C', agbada: '#1F3A78' }]
    : [{ kind: 'woman', robe: '#F4F1EA', wrap: '#8E1B2A', wrap2: '#E8B830', hat: 'tie', hatc: '#8E1B2A', beads: 1, load: '<ellipse rx="8" ry="2.4" fill="#C62828"/>' }, { kind: 'man', robe: '#B71C1C', hat: 'okpu', hatc: '#1E1E24', hatc2: '#B71C1C', hr: '<rect x="-3" y="0" width="7" height="9" rx="1" fill="#5A3A22"/>' },
      { kind: 'boy', robe: '#E8A317', hat: 'hair' }, { kind: 'woman', robe: '#1F6B4A', wrap: '#E8A317', hat: 'tie', hatc: '#E8A317' }, { kind: 'man', robe: '#F4F1EA', hat: 'okpuf', hatc: '#B71C1C', hatc2: '#1E1E24', wrapper: '#1F4E2E', beads: 1 }];
  const waitAt = (k) => ({ ...WAITERS[k % WAITERS.length], skin: k });
  const jrWaiter = (k) => '<svg class="jr4w" viewBox="-6 -14 72 150" overflow="visible" aria-hidden="true">' + person(30, 134, 140, { ...waitAt(k), cls: 'w-fig' }) + '</svg>';
  /** the danfo, the yellow Lagos minibus with its black stripes, side door slid open, the conductor at the door; the word
      painted big on a white panel on its side (420 x 165 like the boat, the door where the boat's plank meets the gunwale) */
  function danfoBus(word, pax) {
    const n = word.length, W = Math.max(150, Math.min(250, n * 24)), cx = 262, x = cx - W / 2, fs = Math.min(38, Math.floor(W / (n * .72)));
    const fit = n > 7 ? ' textLength="' + (W - 12) + '" lengthAdjust="spacingAndGlyphs"' : '';
    let win = ''; for (let i = 0; i < 4; i++) { const wx = 150 + i * 56; win += '<rect x="' + wx + '" y="36" width="48" height="34" rx="4" fill="#9FC8DA"/><path d="M' + (wx + 4) + ' 66 L' + (wx + 20) + ' 40" stroke="#fff" stroke-width="3" opacity=".35"/>' +
      '<circle cx="' + (wx + 24) + '" cy="52" r="7" fill="' + SKT[i % 6] + '"/><path d="M' + (wx + 12) + ' 70 Q' + (wx + 24) + ' 58 ' + (wx + 36) + ' 70 Z" fill="' + ['#7A2E5C', '#2E5E8A', '#E8A317', '#2E7D5A'][i] + '"/>'; }
    const wheel = (wx) => '<circle cx="' + wx + '" cy="140" r="20" fill="#1E1E1E"/><circle cx="' + wx + '" cy="140" r="9" fill="#9E9E9E"/><circle cx="' + wx + '" cy="140" r="3" fill="#4A4A4A"/>';
    return '<svg class="eb ' + 'sk5bus" viewBox="0 0 420 165" overflow="visible" aria-hidden="true">' +
      '<ellipse cx="220" cy="160" rx="200" ry="6" fill="rgba(0,0,0,.3)"/>' +
      '<g class="eb-wake"><circle cx="412" cy="132" r="6" fill="#B9B4AC" opacity=".6"/><circle cx="424" cy="126" r="8" fill="#C9C4BC" opacity=".4"/></g>' +
      '<path d="M22 140 V58 Q22 26 52 22 L380 18 Q404 18 406 40 L408 140 Z" fill="#F6C12B"/><path d="M22 112 H408 V122 H22 Z M22 128 H408 V132 H22 Z" fill="#1B1B1B"/>' +
      '<path d="M300 20 L380 18 Q404 18 406 40 L408 140 L330 140 Q340 80 300 20 Z" fill="#1a0e06" opacity=".08"/><path d="M26 30 Q40 22 120 21" stroke="#fff" stroke-width="3" opacity=".35" fill="none"/>' +
      '<path d="M30 36 Q30 30 38 30 L62 30 L62 70 L30 70 Z" fill="#9FC8DA"/><path d="M34 66 L52 34" stroke="#fff" stroke-width="3" opacity=".35"/>' +
      // the open door: the dark doorway, the step, the conductor leaning out with one hand on the rail
      '<path d="M76 30 H134 V140 H76 Z" fill="#2A2A2A"/><path d="M76 118 H134 V124 H76 Z" fill="#4A4A4A"/><path d="M136 30 H142 V140 H136 Z" fill="#E0A81E"/>' +
      person(96, 124, 86, { kind: 'man', skin: 2, robe: '#2E5E8A', trou: '#3B3B3B', hat: 'hair', ar: 'up', al: 'wave', alc: 'x-wv' }) +
      win + '<g class="eb-board"><rect x="' + (x - 4) + '" y="74" width="' + (W + 8) + '" height="36" rx="4" fill="#FFFFFF" stroke="#1B1B1B" stroke-width="3"/>' +
      '<text x="' + cx + '" y="' + (92 + Math.round(fs * .36)) + '" text-anchor="middle" font-size="' + fs + '" font-weight="900" letter-spacing="2"' + fit + ' fill="#1B1B1B" style="font-family:var(--disp,sans-serif)">' + word + '</text></g>' +
      '<rect x="398" y="96" width="10" height="12" rx="2" fill="#FF8A3A"/><rect x="20" y="96" width="8" height="14" rx="2" fill="#FFF6C8"/><path d="M18 136 H60 V142 H18 Z M370 136 H410 V142 H370 Z" fill="#3A3A3A"/>' +
      wheel(70) + wheel(350) +
      '<g class="eb-pax">' + person(170, 70, 34, { ...waitAt(pax), al: 'down', ar: 'down' }) + '</g>' +
      '<g class="eb-plank"><path d="M84 124 L134 124 L130 130 L80 130 Z" fill="#6A6A6A"/></g></svg>';
  }

  /* ---------------- the evening grill (Hausa: SY.stand): boli, or roast corn with ube ---------------- */
  function boli(x, lean, r) {   // a ripe plantain roasting on the grill, lying front to back, charred in patches
    const x0 = x + 1.6 + lean, x1 = x - 1.4 - lean * .4, w = 2.6 + r() * .6;
    return '<path d="M' + f1(x0) + ' 140.6 Q' + f1((x0 + x1) / 2 + 2.2) + ' 149 ' + f1(x1) + ' 158" stroke="#7A4A16" stroke-width="' + f1(w * 2 + .8) + '" stroke-linecap="round" fill="none"/>' +
      '<path d="M' + f1(x0) + ' 140.6 Q' + f1((x0 + x1) / 2 + 2.2) + ' 149 ' + f1(x1) + ' 158" stroke="#D99A2B" stroke-width="' + f1(w * 2) + '" stroke-linecap="round" fill="none"/>' +
      '<path d="M' + f1(x0 - .6) + ' 143 q1.4 3 .6 5 M' + f1(x1 + 1) + ' 152 q.8 2 .2 3.6" stroke="#3A1E0A" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".8"/>';
  }
  function corn(x, lean, r) {   // a cob of maize roasting in its rows, the husk end over the rim
    const x0 = x + 1.6 + lean, x1 = x - 1.4 - lean * .4;
    let k = '<path d="M' + f1(x0) + ' 140 L' + f1(x1) + ' 156" stroke="#8A5A14" stroke-width="7" stroke-linecap="round"/><path d="M' + f1(x0) + ' 140 L' + f1(x1) + ' 156" stroke="#E8B830" stroke-width="5.6" stroke-linecap="round"/>';
    for (let i = 0; i < 5; i++) { const t = .1 + i * .2; k += '<path d="M' + f1(x0 + (x1 - x0) * t - 2.4) + ' ' + f1(140 + 16 * t) + ' h4.8" stroke="' + (r() < .4 ? '#5A3A10' : '#B8801A') + '" stroke-width=".9"/>'; }
    return k + '<path d="M' + f1(x1) + ' 156 l-2 5 l3 -1 l1 4 Z" fill="#C9B26A"/>';
  }
  const tray = '<path d="M264 157.8 Q280 153.4 296 157.8 Z" fill="#CFC8B4"/>';
  const goods = Y
    ? tray + [266, 272, 278, 284, 290].map((x, k) => '<path d="M' + x + ' 156 q4 -5 9 -3" stroke="#E8C230" stroke-width="3.2" stroke-linecap="round" fill="none"/><path d="M' + (x + 9) + ' 153 l1.4 -.6" stroke="#4E3A12" stroke-width="1.2"/>').join('') +
      '<path d="M244 158 L254 156 L258 158 Z" fill="#B8481A"/>'
    : tray + [[268, 154.4], [274, 153.6], [280, 154.6], [286, 153.8], [271, 151], [277, 150.6], [283, 151]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="3.4" ry="2.4" fill="#4A3A6E"/><ellipse cx="' + (x - 1) + '" cy="' + (y - .8) + '" rx="1.2" ry=".6" fill="#8E7FB8" opacity=".7"/>').join('') +
      '<path d="M240 158 L256 157 Q258 154 254 152 L242 153 Z" fill="#E8B830"/>';
  const grill = () => stand({ item: Y ? boli : corn, sign: Y ? 'BỌ̀LÌ' : 'ỌKA', goods });

  // the morning tea stall: tea-and-bread stalls stand on southern streets too, so it keeps its build; its board says TEA
  const stall = () => teaStall().replace('>SHAYI<', '>TEA<');

  const art = { jrWaiter, emirThrone, dogari, maiFanka, sallahBand, dancers, band, stand: grill, teaStall: stall };
  if (!Y) art.durbarRider = ageGrade;
  if (Y) art.engineBoat = danfoBus;
  return art;
}
