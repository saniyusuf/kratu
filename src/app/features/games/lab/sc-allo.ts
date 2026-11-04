// @ts-nocheck
import { arewaCap } from './capsArewa';
import { liveAC } from './audioctx';
/*
 * Allo, drawn (Sani 2026-10-25): a makarantar allo in a compound under a big neem tree in the morning. A red-earth
 * compound wall with zanko horns and white relief runs behind; beyond it a Sahel mud mosque with a tapering minaret
 * bristling with toron stakes. On the right, in the tree's shade, the malam sits on a sheepskin with his cane and the
 * rahala (book stand) holding the open book; boys and girls (the girls in hijab) sit on a woven mat with their own
 * allo boards, an ink pot (tawada) with reed pens, a clay water pot with a calabash cup, sandals lined up at the mat's
 * edge, a goat resting in the shade, hens by the wall, weaver birds in the sky.
 *
 * Classes animated by sc-allo.css (transform and opacity only):
 *   .x-kid (each child: rocks while reciting) · .x-lift / .x-arms (the board and arms, raised on cheer) · .x-head
 *   .x-eo / .x-eh open and happy eyes · .x-ms / .x-mf smile and frown · .x-malam · .x-goat .x-gh (goat's head)
 *   .x-hen · .x-birds · .x-crown (the neem's leaves) · .x-cloud
 */
const SK = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#9A6436'];
const lg = (id, ...c) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const zanko = (x0, x1, y, h = 4) => { let s = ''; for (let x = x0; x <= x1; x += 7) s += '<path d="M' + x + ' ' + y + ' l1.3 -' + h + ' l1.3 ' + h + ' Z"/>'; return s; };
/* zanen dagi: the Hausa interlaced knot in raised plaster, drawn once (defs) and placed with <use> */
const DAGI = '<path id="al4-dagi" d="M0 -5.6 Q3.2 -2.2 0 0 Q-3.2 -2.2 0 -5.6 Z M5.6 0 Q2.2 3.2 0 0 Q2.2 -3.2 5.6 0 Z M0 5.6 Q-3.2 2.2 0 0 Q3.2 2.2 0 5.6 Z M-5.6 0 Q-2.2 -3.2 0 0 Q-2.2 3.2 -5.6 0 Z M-3.9 -3.9 H3.9 V3.9 H-3.9 Z M-8 7.4 l2 -1.4 l2 1.4 l2 -1.4 l2 1.4 l2 -1.4 l2 1.4 l2 -1.4 l2 1.4" fill="none" stroke-linejoin="round"/>';
const relief = (x, y, s = 1) => '<use href="#al4-dagi" transform="translate(' + x + ' ' + (y - 1) + ') scale(' + (s * .8).toFixed(2) + ')"/>';
const cloud = (x, y, s) => '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M-12 0 Q-12 -1.6 -8.4 -2 Q-8 -3.8 -4 -3.4 Q-1 -5.4 3 -4.6 Q7 -6 11 -3 Q13 -1.2 12 0 Q0 2.4 -12 0 Z" fill="#fff" opacity=".8"/>';

/* ---------------- a head, centred on its own origin, radius 5.2 ---------------- */
function head(o) {
  const sk = SK[o.skin % SK.length], hc = o.hatc || '#fff', hc2 = o.hatc2 || '#C62828';
  let back = '', top = '', ears = '<g fill="' + sk + '"><circle cx="-5.1" cy=".5" r="1.1"/><circle cx="5.1" cy=".5" r="1.1"/></g>';
  if (o.hat === 'hula' || o.hat === 'zanna' || o.hat === 'borno') top = arewaCap(o.hat, 0, -1.4, 5.35, hc, o.hatc2, o.hatc3, o.capside || 1);
  if (o.hat === 'turban') top = '<path d="M-5.9 -.6 Q-6.8 -9.6 0 -10 Q6.8 -9.6 5.9 -.6 Q0 -4.2 -5.9 -.6 Z" fill="' + hc + '"/><path d="M-5.6 -3.4 Q0 -8.2 5.6 -3.4 M-5.9 -1.6 Q0 -6.2 5.9 -1.6 M-3 -9 Q1 -6.6 5.4 -6" stroke="rgba(0,0,0,.13)" stroke-width=".5" fill="none"/>' +
    (o.tail ? '<path d="M5.4 -1.4 Q7.6 4 6.4 10.6" stroke="' + hc + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>' : '');
  if (o.hat === 'kallabi') top = '<path d="M-5.6 -.6 Q-6.4 -8.6 0 -9.2 Q6.4 -8.6 5.6 -.6 Q0 -4.2 -5.6 -.6 Z" fill="' + hc + '"/><path d="M-2.6 -8.4 Q-6.6 -13.6 -1.4 -12 Q0 -15.4 1.6 -12 Q6.6 -13.4 2.8 -8.4 Z" fill="' + hc + '"/><path d="M-5 -3.4 Q0 -7.2 5 -3.4" stroke="' + hc2 + '" stroke-width=".7" fill="none"/>';
  if (o.hat === 'hijab') { back = '<path d="M-6.2 0 Q-6.9 -8.8 0 -9.2 Q6.9 -8.8 6.2 0 L8.4 11.6 Q0 14.4 -8.4 11.6 Z" fill="' + hc + '"/>'; ears = '';
    top = '<path d="M-5.5 1.2 Q-6.1 -7.4 0 -7.7 Q6.1 -7.4 5.5 1.2 Q4.9 -3.6 0 -3.9 Q-4.9 -3.6 -5.5 1.2 Z" fill="' + hc + '"/><path d="M-5.3 1.2 Q-4.6 5.8 0 6 Q4.6 5.8 5.3 1.2 L8.3 11.6 Q0 14.2 -8.3 11.6 Z" fill="' + hc + '"/>' +
      '<path d="M-5.4 1 Q-4.6 5.8 0 6 Q4.6 5.8 5.4 1" stroke="rgba(0,0,0,.14)" stroke-width=".5" fill="none"/><path d="M2 7 Q4 10 3.4 13" stroke="rgba(0,0,0,.12)" stroke-width=".5" fill="none"/>'; }
  const beard = o.beard ? '<path d="M-4.7 1.2 Q-4.2 8 0 8.8 Q4.2 8 4.7 1.2 Q2.8 4.4 0 4.4 Q-2.8 4.4 -4.7 1.2 Z" fill="' + o.beard + '"/><path d="M-2.2 2.6 Q0 1.8 2.2 2.6" stroke="' + o.beard + '" stroke-width=".9" fill="none"/>' : '';
  return '<g class="x-head">' + back + ears +
    '<circle r="5.2" fill="' + sk + '"/><path d="M1 -5.1 A5.2 5.2 0 0 1 1 5.1 A3.8 5.2 0 0 0 1 -5.1 Z" fill="#000" opacity=".13"/>' +
    (o.cheek ? '<g fill="#E8735A" opacity=".28"><circle cx="-3" cy="1.9" r="1.1"/><circle cx="3" cy="1.9" r="1.1"/></g>' : '') +
    '<g class="x-eo"><g fill="#1A0E06"><circle cx="-1.9" cy="-.3" r=".72"/><circle cx="1.9" cy="-.3" r=".72"/></g><g fill="#fff"><circle cx="-1.7" cy="-.55" r=".22"/><circle cx="2.1" cy="-.55" r=".22"/></g></g>' +
    '<g class="x-eh" fill="none" stroke="#1A0E06" stroke-width=".55" stroke-linecap="round"><path d="M-2.8 0 q.9 -1.1 1.8 0 M1 0 q.9 -1.1 1.8 0"/></g>' +
    '<path d="M-3 -2.5 q1.1 -.7 2.2 -.2 M3 -2.5 q-1.1 -.7 -2.2 -.2" stroke="#2A160A" stroke-width=".45" fill="none" stroke-linecap="round"/>' +
    '<path d="M-.2 .4 q-.6 1.5 .3 1.7 q.6 0 .8 -.3" stroke="rgba(40,20,8,.55)" stroke-width=".35" fill="none" stroke-linecap="round"/>' +
    (o.specs ? '<g fill="none" stroke="#2A1A10" stroke-width=".35"><circle cx="-1.9" cy="-.3" r="1.3"/><circle cx="1.9" cy="-.3" r="1.3"/><path d="M-.6 -.4 h1.2"/></g>' : '') +
    beard +
    '<path class="x-ms" d="M-1.7 2.7 Q0 4.1 1.7 2.7" stroke="#3A1A0A" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
    '<path class="x-mf" d="M-1.5 3.8 Q0 2.7 1.5 3.8" stroke="#3A1A0A" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
    top + '</g>';
}

/* ---------------- a child sitting cross-legged on the mat, holding an allo ---------------- */
let bn = 0;
function allo(write) {
  const w = (write || 3);
  let ink = ''; for (let k = 0; k < w; k++) { const y = (-13.2 + k * 2.2).toFixed(1);
    ink += 'M3.6 ' + y + ' h-1.1 v-1.1 m-.45 1.1 q-.55 .75 -1.1 0 h-.7 m-.35 0 v-.95 m-.3 .95 q-.5 -.85 -1.2 0 h-1.1 m.9 -1.5 h.35 m1.9 -.1 h.3 '; }
  return '<path d="M-1.7 -16.3 Q-1.9 -19.2 0 -19.4 Q1.9 -19.2 1.7 -16.3 H4.8 Q5.5 -16.3 5.5 -15.6 V-6.4 Q5.5 -4.8 3.9 -4.8 H-3.9 Q-5.5 -4.8 -5.5 -6.4 V-15.6 Q-5.5 -16.3 -4.8 -16.3 Z" fill="#B88A52"/>' +
    '<path d="M-4.6 -15.4 Q0 -15.9 4.6 -15.4 Q4.9 -10.6 4.5 -5.9 Q0 -5.5 -4.5 -5.9 Q-4.9 -10.6 -4.6 -15.4 Z" fill="#E6D3AA"/><path d="M5.5 -15.6 V-6.4 Q5.5 -4.8 3.9 -4.8 H1 Q4.4 -6 4.4 -15.9 Z" fill="#5A3818" opacity=".28"/>' +
    '<circle cy="-17.6" r=".45" fill="#3A2210"/><path d="' + ink + '" stroke="#24180E" stroke-width=".4" fill="none" stroke-linecap="round"/>';
}
function kid(o) {
  const sk = SK[o.skin % SK.length], g = o.girl;
  return '<g class="x-kid ' + (o.cls || '') + '">' +
    '<ellipse cx="0" cy=".4" rx="12" ry="1.8" fill="rgba(40,24,10,.25)"/>' +
    '<path d="M-10.6 -1 Q-11.2 -6.6 -4 -6.6 L4 -6.6 Q11.2 -6.6 10.6 -1 Q0 1.4 -10.6 -1 Z" fill="' + o.robe2 + '"/>' +
    '<path d="M-6 -3.4 Q0 -1.6 6 -3.4" stroke="rgba(0,0,0,.18)" stroke-width=".5" fill="none"/>' +
    '<g fill="' + sk + '"><ellipse cx="-4" cy="-1.3" rx="1.7" ry=".9"/><ellipse cx="4" cy="-1.3" rx="1.7" ry=".9"/></g>' +
    '<path d="M-5 -19.6 Q0 -21 5 -19.6 L7.6 -5 Q0 -3.6 -7.6 -5 Z" fill="' + o.robe + '"/><path d="M0 -20.4 Q5 -20.6 5 -19.6 L7.6 -5 Q3.8 -4.2 0 -4 Z" fill="#000" opacity=".13"/>' +
    (g ? '' : '<path d="M-1.6 -19.8 L0 -16.4 L1.6 -19.8" stroke="' + o.trim + '" stroke-width=".5" fill="none"/>') +
    '<g transform="translate(0 -25.6)">' + head({ ...o, cheek: 1 }) + '</g>' +
    '<g class="x-arms"><path d="M-5.2 -19 L-5.8 -10.4 M5.2 -19 L5.8 -10.4" stroke="' + o.robe + '" stroke-width="2.6" stroke-linecap="round"/><path d="M-5.2 -19 L-5.8 -10.4" stroke="#000" stroke-width="2.6" stroke-linecap="round" opacity=".08"/></g>' +
    '<g class="x-lift">' + allo(o.ink) + '<g fill="' + sk + '"><circle cx="-5.8" cy="-10.2" r="1.35"/><circle cx="5.8" cy="-10.2" r="1.35"/></g></g>' +
    '</g>';
}

/* ---------------- the malam, sitting on a sheepskin with his cane, the rahala before him ---------------- */
function malam() {
  const sk = SK[1];
  return '<g class="x-malam">' +
    '<path d="M-17 1 Q-19 -4 -12 -5 Q-6 -8 0 -6 Q8 -8 14 -5 Q20 -3 17 1 Q0 4 -17 1 Z" fill="#EFE6D2"/><path d="M-15 0 q2 -1.4 4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0" stroke="#D6C9AC" stroke-width=".6" fill="none"/>' +
    '<ellipse cx="0" cy="-.6" rx="15" ry="1.8" fill="rgba(40,24,10,.2)"/>' +
    '<path d="M-14.4 -1.4 Q-15 -9 -5 -9 L5 -9 Q15 -9 14.4 -1.4 Q0 1.6 -14.4 -1.4 Z" fill="#E7E1D3"/><path d="M0 -9 L5 -9 Q15 -9 14.4 -1.4 Q7 .6 0 1 Z" fill="#000" opacity=".08"/>' +
    '<g fill="' + sk + '"><ellipse cx="-5" cy="-2" rx="2.1" ry="1.1"/><ellipse cx="5" cy="-2" rx="2.1" ry="1.1"/></g>' +
    '<path d="M-6.6 -27 Q0 -29 6.6 -27 Q10.6 -18 11.4 -7 Q0 -5 -11.4 -7 Q-10.6 -18 -6.6 -27 Z" fill="#F4F1EA"/><path d="M0 -28.4 Q6.6 -28.4 6.6 -27 Q10.6 -18 11.4 -7 Q5.6 -5.8 0 -5.6 Z" fill="#B9B2A2" opacity=".35"/>' +
    '<path d="M-2.6 -27.2 L0 -20 L2.6 -27.2" stroke="#C9B37A" stroke-width=".6" fill="none"/><path d="M-6 -17 q2 -3 4.2 -.6 q1.4 2.4 -1 3 q-2 .4 -1.4 -1.6" stroke="#C9B37A" stroke-width=".5" fill="none"/>' +
    '<path d="M-3 -20 Q-5 -13 -6 -8 M4 -21 Q6 -14 8 -8" stroke="rgba(0,0,0,.1)" stroke-width=".6" fill="none"/>' +
    '<g transform="translate(0 -33.6)">' + head({ skin: 1, hat: 'turban', hatc: '#FBF8F0', tail: 1, beard: '#EDEAE2' }) + '</g>' +
    // left arm to the book, right arm holding the cane up over his shoulder
    '<path d="M-6.4 -26 Q-12 -18 -15.6 -14.6" stroke="#F4F1EA" stroke-width="3.6" stroke-linecap="round" fill="none"/><circle cx="-16.4" cy="-14.2" r="1.5" fill="' + sk + '"/>' +
    '<g class="x-cane"><path d="M10.4 -14 Q16 -30 25 -40" stroke="#6B4422" stroke-width=".8" fill="none" stroke-linecap="round"/>' +
    '<path d="M6.4 -26 Q12 -20 10.6 -14.6" stroke="#F4F1EA" stroke-width="3.6" stroke-linecap="round" fill="none"/><circle cx="10.4" cy="-13.8" r="1.5" fill="' + sk + '"/></g>' +
    // the rahala: two crossed carved slats and the open book
    '<g transform="translate(-21 1)"><path d="M-5 0 L4 -13 M4 0 L-5 -13" stroke="#7A4E26" stroke-width="1.5" stroke-linecap="round"/><path d="M-5 0 L4 -13" stroke="#A8743E" stroke-width=".5"/>' +
    '<path d="M-8 -14.6 L-.4 -11.6 L7.2 -14.6 L7.2 -10.8 L-.4 -8 L-8 -10.8 Z" fill="#2E6B4A"/><path d="M-7.4 -15.2 L-.4 -12.6 L6.6 -15.2 L6.6 -11.6 L-.4 -9 L-7.4 -11.6 Z" fill="#F7F0DC"/>' +
    '<path d="M-6.4 -13.6 l4.6 1.6 M-6.4 -12.2 l4.6 1.6 M1 -11.6 l4.6 -1.6 M1 -10.2 l4.6 -1.6" stroke="#5A4630" stroke-width=".3"/><path d="M-.4 -12.6 V-9" stroke="#C9B48A" stroke-width=".4"/></g>' +
    '</g>';
}

/* ---------------- animals and things ---------------- */
const goat = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-goat">' +
  '<ellipse cx="0" cy=".5" rx="11.5" ry="1.7" fill="rgba(40,24,10,.3)"/>' +
  '<path d="M-9.4 -.2 Q-11.2 -3.4 -9.2 -6.4 Q-6.4 -8.8 -.6 -8.4 Q4.6 -8.6 7.4 -6.6 Q9.6 -4.4 9 -1.2 Q8.4 .4 6 .3 L-7.6 .4 Q-9 .4 -9.4 -.2 Z" fill="#9A4A24"/>' +
  '<path d="M-8.6 -6.2 Q-4 -9 2 -8.2 Q-3 -7.4 -8.6 -5 Z" fill="#C06A38" opacity=".7"/><path d="M-9.6 -1.6 Q0 .2 9 -1.6 Q8.6 .4 6 .3 L-7.6 .4 Q-9.2 .3 -9.6 -1.6 Z" fill="#5A2810" opacity=".45"/>' +
  '<path d="M-7.6 -1 Q-8 -4.6 -4.4 -5 Q-2 -4.6 -2.2 -1.2" stroke="#7A3518" stroke-width=".6" fill="none"/><path d="M3.6 .3 Q6.6 -.6 10.6 .1 Q11.4 .6 10.4 1 H3.8 Z" fill="#7E3A1A"/><path d="M10.4 .2 l1 .2 v.6 h-1 Z" fill="#2A1A10"/>' +
  '<path d="M-9.4 -5.8 Q-11.2 -7 -10.6 -9" stroke="#7A3518" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
  '<g class="x-gh"><path d="M5 -6.6 Q6.6 -11.4 9.6 -13 L12.2 -11.6 Q10.4 -8.6 9.2 -4.4 Z" fill="#9A4A24"/><path d="M9.4 -4.6 Q10.2 -8.6 12.2 -11.6 L12.8 -10.8 Q11.2 -8 10.6 -4.4 Z" fill="#5A2810" opacity=".35"/>' +
  '<path d="M9.4 -13.4 Q12.2 -15 14.6 -12.8 L16.6 -9.6 Q16.8 -8.2 15.4 -8 Q13.6 -8.2 12.6 -9.8 Q11 -10.2 9.6 -11.6 Z" fill="#A8552A"/><path d="M14.4 -10.6 L16.6 -9.6 Q16.8 -8.2 15.4 -8 Q13.6 -8.2 13 -9.6 Z" fill="#6E3016" opacity=".5"/>' +
  '<path d="M11 -12.4 Q8.4 -12.4 7.4 -9.4 Q9.8 -9.8 11.4 -11.2 Z" fill="#7A3518"/><path d="M10.8 -13.6 Q10.4 -16.4 8.2 -17.4 M12 -13.8 Q12 -16.6 10 -18" stroke="#4A3626" stroke-width=".8" fill="none" stroke-linecap="round"/>' +
  '<circle cx="13" cy="-11.6" r=".5" fill="#140A04"/><circle cx="15.8" cy="-8.8" r=".3" fill="#2A140A"/><path d="M14.6 -8 q-.1 1.6 -.9 2.2" stroke="#6E3016" stroke-width=".6" fill="none"/></g></g></g>';
const hen = (x, y, s, c = '#B5532A', k = '') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-hen' + k + '"><ellipse cy=".4" rx="4.2" ry=".8" fill="rgba(40,24,10,.25)"/>' +
  '<path d="M-.8 -1 v1.4 h-.8 M1 -1 v1.4 h.8" stroke="#C99A3A" stroke-width=".35" fill="none"/>' +
  '<path d="M-4.4 -3.6 Q-5.4 -6.6 -4 -8.4 Q-3.2 -6.4 -1.6 -5.6 Q.8 -5 2.2 -5.8 Q2.2 -7.6 3.4 -7.8 Q4.6 -7.8 4.6 -6.4 L5.6 -5.8 L4.6 -5.3 Q4.6 -3.6 3.4 -2.2 Q1.4 -.6 -1.4 -.9 Q-3.8 -1.6 -4.4 -3.6 Z" fill="' + c + '"/>' +
  '<path d="M-4 -8.4 Q-2.6 -8.6 -2.6 -6.8 M-4.6 -7.4 Q-5.8 -7.6 -5.6 -6" stroke="#2A1A10" stroke-width=".5" fill="none" stroke-linecap="round" opacity=".7"/>' +
  '<path d="M-2.2 -4.4 Q.4 -5 2.2 -3.8 Q.6 -1.8 -2 -2.6 Z" fill="#000" opacity=".18"/><path d="M-4 -2.2 Q0 -.4 3.4 -2.2 Q1.4 -.6 -1.4 -.9 Q-3.4 -1.4 -4 -2.2 Z" fill="#000" opacity=".15"/>' +
  '<path d="M2.8 -7.6 l.3 -1 l.5 .6 l.4 -.7 l.3 .9 Z M4.4 -5.2 q.4 1 -.2 1.3 q-.4 -.6 .2 -1.3 Z" fill="#D32F2F"/><path d="M4.6 -6.2 l1 .4 l-1 .2 Z" fill="#E8B23A"/><circle cx="3.7" cy="-6.6" r=".28" fill="#140A04"/></g></g>';
const pot = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy=".4" rx="7" ry="1.3" fill="rgba(40,24,10,.25)"/><path d="M-3 -12 Q-3.4 -10 -5.6 -8.6 Q-8 -5 -5.6 -1.6 Q0 1.2 5.6 -1.6 Q8 -5 5.6 -8.6 Q3.4 -10 3 -12 Z" fill="#B0603A"/>' +
  '<path d="M2 -11 Q4 -9 6 -7 Q7.4 -3.6 5 -1.4 Q3 -.4 1 0 Q5 -4 2 -11 Z" fill="#000" opacity=".15"/><path d="M-6.2 -6 Q0 -4 6.2 -6" stroke="#E6B080" stroke-width=".4" fill="none"/><path d="M-6.4 -4.8 q1 -.8 2 0 t2 0 t2 0 t2 0 t2 0 t2 0" stroke="#7A3A1E" stroke-width=".35" fill="none"/>' +
  '<ellipse cy="-12" rx="3.4" ry=".9" fill="#8A4426"/><path d="M-5 -13.6 Q0 -10 5 -13.6 Q0 -15.2 -5 -13.6 Z" fill="#E2B85A"/><path d="M-5 -13.6 Q0 -10 5 -13.6" stroke="#A8823A" stroke-width=".4" fill="none"/></g>';
const tawada = (x, y) => '<g transform="translate(' + x + ' ' + y + ')"><ellipse cy=".3" rx="3.2" ry=".7" fill="rgba(40,24,10,.25)"/><path d="M-2.4 0 Q-3.2 -2.6 -1.6 -3.4 L1.6 -3.4 Q3.2 -2.6 2.4 0 Z" fill="#5A3A22"/><ellipse cy="-3.4" rx="1.7" ry=".45" fill="#140C06"/>' +
  '<path d="M-.6 -3.4 L-2.6 -9.6 M.4 -3.4 L1.8 -10.2 M.9 -3.4 L3.6 -8.8" stroke="#C8A86A" stroke-width=".5" stroke-linecap="round"/><path d="M-2.6 -9.6 l-.2 -.7 M1.8 -10.2 l.1 -.7" stroke="#24180E" stroke-width=".5"/></g>';
const sandal = (x, y, c, r = 0) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><ellipse cx="-1.3" rx="1.1" ry="2.5" fill="' + c + '"/><ellipse cx="1.3" cy=".3" rx="1.1" ry="2.5" fill="' + c + '"/><path d="M-2.2 -.8 h1.8 M.4 -.5 h1.8" stroke="#3A2414" stroke-width=".55"/></g>';
const dum = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-.8 0 Q-1.2 -9 -.5 -18 L.5 -18 Q1 -9 .8 0 Z" fill="#7A5A3A"/><path d="M-.5 -18 L-1.6 -26 L.6 -18 M0 -18 L2.2 -27 L.8 -18" stroke="#7A5A3A" stroke-width=".8"/>' +
  '<g fill="#5E8A3E"><path d="M-1.6 -26 q-6 -1 -9 2 q5 -4 9 -2 Z M-1.6 -26 q-3 -5 -8 -6 q6 0 8 6 Z M-1.6 -26 q2 -5 5 -6 q-2 3 -5 6 Z"/><path d="M2.2 -27 q6 -1 9 2 q-5 -4 -9 -2 Z M2.2 -27 q3 -5 8 -6 q-6 0 -8 6 Z M2.2 -27 q-2 -5 -5 -6 q2 3 5 6 Z"/></g></g>';
const bird = (x, y, s) => '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M-3 0 Q-1.6 -1.6 0 0 Q1.6 -1.6 3 0 Q1.6 -.8 0 .6 Q-1.6 -.8 -3 0 Z" fill="#4A3A22"/>';

export function alloScene(): string {
  // the neem: a wide dark crown of many leaf clusters over the school, the trunk at the right edge
  let leaves = ''; const L = [[214, 30, 20, 13], [238, 18, 24, 15], [266, 10, 26, 16], [296, 14, 26, 17], [318, 26, 18, 14], [226, 48, 16, 10], [252, 40, 22, 13], [282, 36, 24, 14], [310, 48, 16, 12], [200, 42, 12, 8], [262, 58, 14, 7], [292, 58, 14, 8]];
  const ell = (x, y, rx, ry) => 'M' + (x - rx) + ' ' + y + ' a' + rx + ' ' + ry + ' 0 1 0 ' + 2 * rx + ' 0 a' + rx + ' ' + ry + ' 0 1 0 ' + -2 * rx + ' 0 Z ';
  leaves = '<path d="' + L.map(([x, y, rx, ry]) => ell(x, y, rx, ry)).join('') + '" fill="#3E6B2E"/>';
  let hi = '<path d="' + [[232, 12, 14, 7], [262, 4, 16, 7], [296, 8, 14, 7], [246, 32, 12, 6], [280, 28, 14, 6], [214, 24, 10, 5], [310, 38, 9, 5]].map(([x, y, rx, ry]) => ell(x, y, rx, ry)).join('') + '" fill="#5B8C3E"/>';
  let sp1 = '', sp2 = ''; for (let i = 0; i < 46; i++) { const x = 196 + (i * 37) % 128, y = 6 + (i * 23) % 56, d = 'M' + x + ' ' + y + ' q1.6 -1.6 3 0 q-1.6 1 -3 0 Z'; if (i % 3) sp1 += d; else sp2 += d; }
  const speck = '<path d="' + sp1 + '" fill="#4C7D34"/><path d="' + sp2 + '" fill="#6E9E48"/>';
  const kids = [
    // back row
    [222, 143, .84, { skin: 2, girl: 1, hat: 'hijab', hatc: '#F2C94C', robe: '#F2C94C', robe2: '#D9A92C', ink: 3, cls: 'k1' }],
    [240, 143, .84, { skin: 0, hat: 'hula', hatc: '#FFFFFF', hatc2: '#2E7D32', robe: '#E9E4D6', robe2: '#C9C0AA', trim: '#2E7D32', ink: 4, cls: 'k2' }],
    [258, 143, .84, { skin: 3, girl: 1, hat: 'hijab', hatc: '#1E88A8', robe: '#1E88A8', robe2: '#15657E', ink: 2, cls: 'k3' }],
    // front row
    [232, 173, 1, { skin: 4, hat: 'hula', hatc: '#7A1F2B', hatc2: '#E9C46A', robe: '#6FA8DC', robe2: '#4C82B4', trim: '#FFFFFF', ink: 3, cls: 'k4' }],
    [255, 173, 1, { skin: 1, girl: 1, hat: 'hijab', hatc: '#C2185B', robe: '#C2185B', robe2: '#8E1046', ink: 4, cls: 'k5' }],
  ].map(([x, y, s, o]) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + kid(o) + '</g>').join('');
  const W = 320, H = 200;
  return '<svg class="scene al4" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('al4-sky', '#8FCBEA', '#CDEAF0', '#F7E8C4') + lg('al4-wall', '#CE8650', '#B4693A') + lg('al4-mos', '#E2B27A', '#C98E56') + lg('al4-g', '#E6C892', '#D7B07A', '#C99C64') +
    lg('al4-trunk', '#6B4A2E', '#4A3020') + DAGI +
    '<pattern id="al4-weave" width="3" height="2" patternUnits="userSpaceOnUse"><rect width="3" height="2" fill="#D6AE66"/><path d="M0 0 H1.5 V1 H0 Z M1.5 1 H3 V2 H1.5 Z" fill="#C49650"/><path d="M0 .05 H3" stroke="#E8C88A" stroke-width=".2"/></pattern>' +
    '<radialGradient id="al4-shade" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3A2412" stop-opacity=".3"/><stop offset=".7" stop-color="#3A2412" stop-opacity=".16"/><stop offset="1" stop-color="#3A2412" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="al4-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6D0"/><stop offset=".45" stop-color="#FFE7A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#al4-sky)"/><circle cx="58" cy="40" r="26" fill="url(#al4-sun)"/><circle cx="58" cy="40" r="7" fill="#FFF3C6"/>' +
    cloud(110, 26, 1) + cloud(30, 66, .7) +
    // far town: pale flat roofs with zanko, dum palms
    '<g fill="#D9B48A" opacity=".55"><path d="M0 100 V84 H30 V100 Z M38 100 V80 H66 V100 Z M70 100 V86 H96 V100 Z M246 100 V82 H270 V100 Z"/>' + zanko(0, 28, 84, 3) + zanko(38, 64, 80, 3) + zanko(70, 94, 86, 3) + '</g>' +
    '<g opacity=".7">' + dum(20, 96, 1.1) + dum(102, 94, .9) + dum(160, 94, .8) + '</g>' +
    // the mosque beyond the wall: mud walls with pinnacles, the tapering minaret with toron stakes
    '<g><path d="M150 106 V84 H204 V106 Z" fill="url(#al4-mos)"/><g fill="#D29A60">' + zanko(150, 202, 84, 5) + '</g>' +
    '<path d="M178 106 L180.5 40 Q185 34 189.5 40 L192 106 Z" fill="url(#al4-mos)"/><path d="M185 40 L192 106 L185 106 Z" fill="#000" opacity=".08"/><path d="M181.6 40 Q185 30.6 188.4 40 Z" fill="#D29A60"/><path d="M185 31 v-4" stroke="#8A6A3A" stroke-width=".7"/><circle cx="185" cy="26.4" r="1" fill="#E8C35A"/>' +
    '<g stroke="#7A5434" stroke-width=".7">' + [50, 62, 74, 86, 98].map((y) => { const half = 4.5 + (y - 40) * 0.0234 * 3; return '<path d="M' + (185 - half - 1.6).toFixed(1) + ' ' + y + ' h3 M' + (185 + half - 1.4).toFixed(1) + ' ' + y + ' h3 M184 ' + (y + 6) + ' h2"/>'; }).join('') + '</g>' +
    '<g stroke="#7A5434" stroke-width=".7">' + [156, 166, 196].map((x) => '<path d="M' + x + ' 92 v-2.4 M' + (x + 4) + ' 96 v-2.4"/>').join('') + '</g>' +
    '<path d="M162 106 V98 a3 3 0 0 1 6 0 V106 Z M196 106 V98 a2.6 2.6 0 0 1 5.2 0 V106 Z" fill="#5A3416"/></g>' +
    // the compound wall, red earth, zanko horns, white relief, the zaure entrance
    '<path d="M0 118 V98 H320 V118 Z" fill="url(#al4-wall)"/><g fill="#B4693A">' + zanko(0, 318, 98) + '</g>' +
    '<path d="M126 118 V92 H156 V118 Z" fill="#C27A44"/><g fill="#A9612F">' + zanko(126, 154, 92, 5) + '</g><path d="M134 118 V106 Q141 98 148 106 V118 Z" fill="#3A1E0C"/><path d="M131.6 118 V105.4 Q141 95 150.4 105.4 V118" stroke="#FFF1D6" stroke-width=".8" fill="none"/>' +
    '<g stroke="#5E2E12" stroke-width=".7" opacity=".22" transform="translate(.5 .6)">' + relief(141, 98.4, .7) + relief(16, 107) + relief(60, 107) + relief(104, 107) + relief(178, 109) + relief(222, 107) + '</g>' +
    '<g stroke="#FFF1D6" stroke-width=".6" opacity=".8">' + relief(141, 98.4, .7) + relief(16, 107) + relief(60, 107) + relief(104, 107) + relief(178, 109) + relief(222, 107) + '</g>' +
    '<path d="M0 116 H320" stroke="#9A5A30" stroke-width="1" opacity=".6"/>' +
    // the ground and the neem's shade
    '<path d="M0 117 H320 V200 H0 Z" fill="url(#al4-g)"/>' +
    '<ellipse cx="258" cy="160" rx="84" ry="30" fill="url(#al4-shade)"/>' +
    '<g fill="#B98A50" opacity=".35"><ellipse cx="40" cy="128" rx="22" ry="1.4"/><ellipse cx="150" cy="190" rx="26" ry="1.6"/><ellipse cx="110" cy="135" rx="14" ry="1"/></g>' +
    hen(210, 124, 1.1) + hen(222, 128, .9, '#F2EADB', ' h2') + hen(150, 125, .9, '#7A4A2A', ' h2') +
    // the neem: trunk, branches, crown (the crown sways a little)
    '<path d="M292 142 Q300 138 301 128 L319 128 Q320 138 326 142 Z" fill="#4A3020"/><path d="M302 140 Q298 112 292 96 Q296 94 300 102 Q302 86 298 70 Q304 76 306 92 Q310 78 318 70 Q316 86 312 100 Q316 120 318 140 Z" fill="url(#al4-trunk)"/>' +
    '<path d="M303 120 Q305 104 304 92 M311 128 Q313 112 312 104" stroke="#3E2618" stroke-width=".6" fill="none"/>' +
    '<path d="M298 72 Q284 62 262 60 M300 76 Q290 50 270 40 M306 74 Q312 50 300 30 M314 72 Q320 54 324 50" stroke="#4A3020" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
    '<g class="x-crown">' + leaves + hi + speck + '</g>' +
    '<g class="x-birds"><g transform="translate(70 44)">' + bird(0, 0, 1) + bird(9, 4, .8) + bird(-6, 6, .7) + '</g></g>' +
    // things by the tree: the clay water pot, the goat in the shade
    pot(190, 152, .95) + goat(190, 127, .8) +
    // the mat, the children with their boards, the malam
    '<path d="M207 137.4 L315 137.4 L319.6 181.6 L196.6 181.6 Z" fill="rgba(60,36,12,.22)"/>' +
    '<path d="M208 136 L314 136 L318 180 L198 180 Z" fill="url(#al4-weave)"/>' +
    '<path d="M207.1 143 L315.1 143 L315.4 146 L206.4 146 Z M202.6 167 L316.9 167 L317.2 170 L201.9 170 Z" fill="#8E2A1E" opacity=".55"/><path d="M206.4 146 L315.4 146 L315.5 147 L206.2 147 Z M201.9 170 L317.2 170 L317.3 171 L201.7 171 Z" fill="#1E140C" opacity=".4"/>' +
    '<path d="M208 136 L314 136 L318 180 L198 180 Z" fill="none" stroke="#B08040" stroke-width="1.6" stroke-dasharray="1.2 .8"/>' +
    kids + '<g transform="translate(293 163)">' + malam() + '</g>' +
    tawada(272, 177) + tawada(207, 162) +
    sandal(204, 186, '#2F4F7F', -6) + sandal(212, 187, '#8E3B2A', 4) + sandal(220, 186.4, '#3A3A3A', -2) + sandal(228, 187, '#C2185B', 6) + sandal(236, 186.6, '#5D4037', -3) + sandal(284, 185.6, '#E8E0CC', 2) +
    '</svg>';
}

/* ======================================================================================================================
 * The big allo board of the game (Sani 2026-10-26: "make the allo look like the actual hausa allo written with ink, and
 * the wash, the clean and rewrite should be like a water wash and pen writing the word quickly with ink").
 * A flat light wooden board with its rounded handle at the top, vertical grain, worn darker edges and old wash stains;
 * the word written in brown-black tawada with a reed pen (alkalami): every letter is pen strokes drawn with a slanted
 * nib (three offset passes give the thick-and-thin), ink pools where the pen lands, each letter leans and sits a little
 * differently. alloWrite(): the pen writes the word stroke by stroke (each segment appears as the pen passes it, a
 * light scratch for each stroke). alloWash(): water poured from a buta runs over the board, the ink runs down and
 * fades, a hand with a cloth wipes it clean (2.2s). Transform and opacity only; classes al4b-… (sc-allo.css).
 * ==================================================================================================================== */
// letters on a 100-high grid (baseline y=100), [width, strokes]; only M L H V Q Z, absolute
const LET = {
  A: [70, ['M5 100 L35 0 L65 100', 'M17 62 H53']],
  B: [60, ['M8 0 V100', 'M8 0 H34 Q56 0 56 24 Q56 48 34 48 H8', 'M8 48 H38 Q60 48 60 74 Q60 100 36 100 H8']],
  C: [62, ['M58 18 Q48 0 32 0 Q4 0 4 50 Q4 100 32 100 Q50 100 58 82']],
  D: [64, ['M8 0 V100', 'M8 0 H28 Q60 0 60 50 Q60 100 28 100 H8']],
  E: [54, ['M50 0 H8 V100 H52', 'M8 48 H42']],
  F: [52, ['M50 0 H8 V100', 'M8 48 H42']],
  G: [66, ['M60 18 Q50 0 34 0 Q4 0 4 50 Q4 100 34 100 Q60 100 60 74 V56 H38']],
  H: [62, ['M6 0 V100', 'M56 0 V100', 'M6 50 H56']],
  I: [20, ['M10 0 V100']],
  J: [46, ['M40 0 V70 Q40 100 20 100 Q4 100 2 84']],
  K: [60, ['M8 0 V100', 'M54 0 L10 58', 'M24 42 L58 100']],
  L: [50, ['M8 0 V100 H48']],
  M: [78, ['M6 100 V0 L39 70 L72 0 V100']],
  N: [64, ['M6 100 V0 L58 100 V0']],
  O: [70, ['M35 0 Q4 0 4 50 Q4 100 35 100 Q66 100 66 50 Q66 0 35 0']],
  P: [56, ['M8 100 V0 H32 Q56 0 56 26 Q56 52 32 52 H8']],
  Q: [70, ['M35 0 Q4 0 4 50 Q4 100 35 100 Q66 100 66 50 Q66 0 35 0', 'M40 70 L66 104']],
  R: [60, ['M8 100 V0 H32 Q56 0 56 25 Q56 50 32 50 H8', 'M30 50 L58 100']],
  S: [56, ['M52 16 Q46 0 28 0 Q6 0 6 24 Q6 44 28 50 Q52 56 52 76 Q52 100 28 100 Q8 100 4 82']],
  T: [60, ['M2 0 H58', 'M30 0 V100']],
  U: [62, ['M6 0 V66 Q6 100 31 100 Q56 100 56 66 V0']],
  V: [66, ['M4 0 L33 100 L62 0']],
  W: [86, ['M4 0 L22 100 L43 30 L64 100 L82 0']],
  X: [62, ['M4 0 L58 100', 'M58 0 L4 100']],
  Y: [62, ['M4 0 L31 50 L58 0', 'M31 50 V100']],
  Z: [58, ['M6 0 H54 L4 100 H56']],
};
/* a segment's path moved by (dx,dy), absolute M L Q only */
function shift(sg, dx, dy) { const p = (q) => (q[0] + dx).toFixed(1) + ' ' + (q[1] + dy).toFixed(1);
  const n = sg.d.match(/-?[\d.]+/g).map(Number), b = [n[n.length - 2], n[n.length - 1]];
  if (/Q/.test(sg.d)) { const q = sg.d.split('Q')[1].trim().split(/\s+/).map(Number); return 'M' + p(sg.a) + ' Q' + p([q[0], q[1]]) + ' ' + p([q[2], q[3]]); }
  return 'M' + p(sg.a) + ' L' + p(sg.b); }
/* a stroke as its segments: [{d, a:[x,y], b:[x,y], len}] */
function segs(d) {
  const t = d.match(/[MLHVQ]|-?[\d.]+/g); let i = 0, x = 0, y = 0; const out = [];
  const num = () => +t[i++];
  while (i < t.length) {
    const c = t[i++];
    if (c === 'M') { x = num(); y = num(); continue; }
    const a = [x, y]; let s, len;
    if (c === 'L') { x = num(); y = num(); s = 'L' + x + ' ' + y; len = Math.hypot(x - a[0], y - a[1]); }
    else if (c === 'H') { x = num(); s = 'H' + x; len = Math.abs(x - a[0]); }
    else if (c === 'V') { y = num(); s = 'V' + y; len = Math.abs(y - a[1]); }
    else { const cx = num(), cy = num(); x = num(); y = num(); s = 'Q' + cx + ' ' + cy + ' ' + x + ' ' + y;
      len = (Math.hypot(cx - a[0], cy - a[1]) + Math.hypot(x - cx, y - cy) + Math.hypot(x - a[0], y - a[1])) / 2; }
    out.push({ d: 'M' + a[0] + ' ' + a[1] + ' ' + s, a, b: [x, y], len });
  }
  return out;
}
let pn = 0, actx = null;
const BODY = 'M34 62 H150 Q170 62 174 48 L176 36 Q160 30 162 16 Q166 0 215 0 Q264 0 268 16 Q270 30 254 36 L256 48 Q260 62 280 62 H396 Q422 62 422 88 V414 Q422 440 398 440 H32 Q8 440 8 414 V88 Q8 62 34 62 Z';
/* the board and the word on it; returns the svg and the pen timeline (stroke start/end in ms) */
function board(word) {
  const id = ++pn, W = word.replace(/\s+/g, ' ').trim().split('').filter((c) => LET[c] || c === ' ');   // a two-word name keeps its space
  let seed = 7; for (const c of word) seed = (seed * 31 + c.charCodeAt(0)) % 9973;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const GAP = 16, SP = 34, wid = W.reduce((s, c) => s + (LET[c] ? LET[c][0] : SP), 0) + GAP * (W.length - 1);
  const sc = Math.min(1.42, 350 / wid), x0 = 215 - wid * sc / 2, y0 = 262 - 50 * sc;
  // the wood: light board, grain running from the handle down, a knot, old wash stains, darker worn edges
  // (r5) the grain lines merged into three paths by tone, for cheap tablets
  const gr = ['', '', ''];
  for (let k = 0; k < 26; k++) { const gx = 14 + k * 16 + rnd() * 8, w1 = 2 + rnd() * 5; rnd(); rnd();
    gr[k % 3] += 'M' + gx.toFixed(1) + ' 0 Q' + (gx + w1).toFixed(1) + ' 120 ' + (gx - w1 * .6).toFixed(1) + ' 240 T' + (gx + w1 * .4).toFixed(1) + ' 450 '; }
  const grain = '<path d="' + gr[0] + '" stroke="#A2723F" stroke-width="2.2" opacity=".3" fill="none"/><path d="' + gr[1] + '" stroke="#B48550" stroke-width="1.2" opacity=".3" fill="none"/><path d="' + gr[2] + '" stroke="#B48550" stroke-width="2" opacity=".22" fill="none"/>';
  const knot = '<g fill="none" stroke="#9A6A38" opacity=".45"><ellipse cx="352" cy="352" rx="9" ry="20"/><ellipse cx="352" cy="352" rx="15" ry="30" opacity=".6"/><ellipse cx="352" cy="352" rx="21" ry="42" opacity=".35"/></g><ellipse cx="352" cy="352" rx="4" ry="10" fill="#8A5A2C" opacity=".55"/>';
  const stains = '<g fill="#6B4A2A"><ellipse cx="120" cy="170" rx="70" ry="26" opacity=".06"/><ellipse cx="300" cy="330" rx="90" ry="30" opacity=".05"/><ellipse cx="200" cy="390" rx="120" ry="18" opacity=".05"/><path d="M60 300 q30 -6 60 0 t60 0" stroke="#4A3018" stroke-width="5" fill="none" opacity=".05"/></g>';
  // the word: per letter a little lean, rise and size; ink a little darker after each dip
  let ink = '', runs = '', t = 260, cx = 0; const tl = [], keys = [];
  W.forEach((c, li) => {
    if (!LET[c]) { cx += SP + GAP; return; }   // the space between two words: nothing written
    const [lw, strokes] = LET[c], rot = (rnd() - .5) * 5, dy = (rnd() - .5) * 7, s2 = .96 + rnd() * .08, op = (li % 3 === 0 ? 1 : li % 3 === 1 ? .93 : .86);
    const tx = x0 + cx * sc, ty = y0 + dy; const m = (p) => { const r = rot * Math.PI / 180, px = (p[0] - lw / 2) * s2, py = (p[1] - 50) * s2;
      return [tx + (lw / 2 + px * Math.cos(r) - py * Math.sin(r)) * sc, ty + (50 + px * Math.sin(r) + py * Math.cos(r)) * sc]; };
    let g = '';
    strokes.forEach((d) => {
      const ss = segs(d); const st = t;
      keys.push([t - 70, m(ss[0].a), 1, true]);
      g += '<circle class="al4b-s" style="--del:' + t + 'ms;--dur:40ms" cx="' + (ss[0].a[0] + .6) + '" cy="' + (ss[0].a[1] - .6) + '" r="5" fill="#170C05" opacity=".9"/>';
      ss.forEach((sg) => { const dur = Math.round(22 + sg.len * .55);
        // the slanted nib: three offset passes in ONE path (thick where the pen moves across the nib, thin along it)
        g += '<path class="al4b-s" style="--del:' + t + 'ms;--dur:' + dur + 'ms" d="' + sg.d + ' ' + shift(sg, 2.4, -2.4) + ' ' + shift(sg, 4.6, -4.6) + '" stroke-width="5.8"/>';
        keys.push([t, m(sg.a), 1]); t += dur; keys.push([t, m(sg.b), 1]); });
      const e = ss[ss.length - 1].b; if (rnd() < .5) g += '<circle class="al4b-s" style="--del:' + (t - 20) + 'ms;--dur:40ms" cx="' + (e[0] + 1) + '" cy="' + (e[1] - 1) + '" r="3.8" fill="#1A0E06" opacity=".85"/>';
      tl.push([st, t]); t += 70;
    });
    ink += '<g transform="translate(' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ') scale(' + sc.toFixed(3) + ') rotate(' + rot.toFixed(1) + ' ' + lw / 2 + ' 50) translate(' + (lw / 2 * (1 - s2)).toFixed(1) + ' ' + (50 * (1 - s2)).toFixed(1) + ') scale(' + s2.toFixed(3) + ')" opacity="' + op + '">' + g + '</g>';
    // where this letter's ink will run when it is washed
    for (let k = 0; k < 2; k++) { const rx = tx + (lw * (.2 + rnd() * .6)) * sc, ry = ty + 96 * sc, L = 22 + rnd() * 40;
      runs += '<path d="M' + rx.toFixed(1) + ' ' + ry.toFixed(1) + ' q' + (rnd() * 4 - 2).toFixed(1) + ' ' + (L / 2).toFixed(1) + ' 0 ' + L.toFixed(1) + '" stroke="#3A2414" stroke-width="' + (2 + rnd() * 3).toFixed(1) + '" stroke-linecap="round" fill="none"/>'; }
    cx += lw + GAP;
  });
  // the pen's path: comes in, lands on each stroke, follows it, lifts between strokes, goes away
  const T = t + 260, f = (p) => 'translate(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px)';
  const first = keys[0][1], last = keys[keys.length - 1][1];
  let kf = '0%{transform:' + f([first[0] + 60, first[1] - 90]) + ';opacity:0}' + (keys[0][0] / T * 100).toFixed(2) + '%{transform:' + f([first[0] + 8, first[1] - 14]) + ';opacity:1}';
  keys.forEach(([ms, p, o, lift]) => { kf += (Math.max(0, ms) / T * 100).toFixed(2) + '%{transform:' + f(lift ? [p[0] + 6, p[1] - 10] : p) + ';opacity:1}'; });
  kf += ((t - 40) / T * 100).toFixed(2) + '%{transform:' + f([last[0] + 10, last[1] - 16]) + ';opacity:1}100%{transform:' + f([last[0] + 70, last[1] - 110]) + ';opacity:0}';
  const pen = '<g class="al4b-pen al4b-p' + id + '"><g transform="rotate(30) scale(1.25)"><path d="M-3.6 -15 L0 0 L3.6 -15 Z" fill="#1A0E06"/><path d="M-3.8 -15 V-158 Q0 -163 3.8 -158 V-15 Z" fill="#D4AF6E"/><path d="M-1.2 -18 V-156" stroke="#EAD3A0" stroke-width="1.4"/><path d="M2.6 -16 V-157" stroke="#A9814A" stroke-width="1.1"/><path d="M-3.8 -76 h7.6 M-3.8 -128 h7.6" stroke="#8E6638" stroke-width="2"/><path d="M-3.6 -15 L-1.6 -26 L1.6 -26 L3.6 -15 Z" fill="#3A2414" opacity=".7"/></g></g>';
  const style = '<style>@keyframes al4b-pk' + id + '{' + kf + '}.allow2.writing .al4b-p' + id + '{animation:al4b-pk' + id + ' ' + T + 'ms linear both}</style>';
  // the wash: a buta pours, water spreads down the board, a hand with a cloth wipes
  const buta = '<g class="al4b-buta"><g transform="translate(366 62)"><g class="al4b-tilt"><path d="M-22 -2 Q-26 -30 0 -32 Q26 -30 22 -2 Q20 10 0 10 Q-20 10 -22 -2 Z" fill="#2E8B57"/><path d="M-14 -30 Q0 -40 14 -30" stroke="#1F6B42" stroke-width="4" fill="none"/><path d="M-20 -14 Q-40 -16 -52 -4 L-48 0 Q-38 -8 -21 -6 Z" fill="#2E8B57"/><path d="M-12 -24 Q-6 -28 0 -26" stroke="#7FD1A3" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M18 -22 Q34 -18 22 -2" stroke="#1F6B42" stroke-width="4" fill="none"/></g></g></g>' +
    '<path class="al4b-pour" d="M316 64 Q300 92 296 140 L304 140 Q306 98 320 68 Z" fill="#BFE3F4" opacity=".85"/>' +
    '<g class="al4b-drops" fill="#CFEAF7">' + [[-40, -20], [-28, -34], [-6, -40], [18, -32], [36, -18], [-50, 0], [48, 2]].map(([dx, dy]) => '<circle cx="300" cy="150" r="5" style="--dx:' + dx + 'px;--dy:' + dy + 'px"/>').join('') + '</g>';
  const rag = '<g class="al4b-rag"><g transform="translate(70 150)"><path d="M-74 66 Q-44 44 -20 20 L0 34 Q-26 62 -54 86 Z" fill="#7A4A26"/><path d="M-92 74 Q-76 54 -64 56 L-42 86 Q-58 96 -78 102 Z" fill="#F4F1E8"/><path d="M-64 56 L-42 86" stroke="#D8D2C2" stroke-width="2"/>' +
    '<path d="M-36 -8 Q-10 -30 30 -20 Q52 -10 44 16 Q34 40 4 42 Q-30 42 -40 20 Q-46 4 -36 -8 Z" fill="#F2EDE2"/><path d="M-30 -2 Q0 -20 38 -10 M-36 16 Q0 4 42 12" stroke="#2F4A7F" stroke-width="5" fill="none" opacity=".8"/><path d="M-20 30 Q4 36 30 26" stroke="#CFC6B2" stroke-width="3" fill="none"/>' +
    '<path d="M-24 22 Q-26 4 -8 -2 L18 -4 Q30 2 26 16 Q20 30 0 32 Q-18 32 -24 22 Z" fill="#7A4A26"/><g fill="#86532C" stroke="#5E3A1C" stroke-width="1.2"><ellipse cx="-6" cy="-4" rx="7" ry="5.5"/><ellipse cx="6" cy="-6" rx="7" ry="5.5"/><ellipse cx="18" cy="-4" rx="6.5" ry="5"/><ellipse cx="27" cy="3" rx="5.5" ry="4.5"/></g><path d="M-22 14 Q-34 6 -30 -6 Q-24 -8 -18 2" fill="#86532C" stroke="#5E3A1C" stroke-width="1.2"/><path d="M-14 -2 Q-12 -10 -4 -10 M8 -11 h6" stroke="#B07A48" stroke-width="1.4" fill="none" opacity=".7"/></g></g>';
  /* (r3, Sani 2026-10-27 "more real"): the writing face is coated with white clay (farar kasa), unevenly, the wood
     showing round it; the board has thickness, a hole in its handle with a leather thong, and it stands on a wooden
     frame planted in the sand: two legs and a ledge in front, two behind, soft shadows where they meet the ground */
  const blob = (rx, ry, j) => { const P = []; for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2, rr = 1 + (rnd() - .5) * j; P.push([215 + Math.cos(a) * rx * rr, 262 + Math.sin(a) * ry * rr]); }
    const mid = (a, b) => [((a[0] + b[0]) / 2).toFixed(1), ((a[1] + b[1]) / 2).toFixed(1)];
    let d = 'M' + mid(P[17], P[0]).join(' '); P.forEach((q, k) => { d += ' Q' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ' ' + mid(q, P[(k + 1) % 18]).join(' '); }); return d + ' Z'; };
  const clay = blob(200, 156, .1), clay2 = blob(184, 140, .08);
  const legC = (x0, y0, x1, y1, w, c, hi) => '<path d="M' + (x0 - w / 2) + ' ' + y0 + ' L' + (x1 - w / 2) + ' ' + y1 + ' L' + (x1 + w / 2) + ' ' + y1 + ' L' + (x0 + w / 2) + ' ' + y0 + ' Z" fill="' + c + '"/>' +
    (hi ? '<path d="M' + (x0 - w / 2 + 1.5) + ' ' + y0 + ' L' + (x1 - w / 2 + 1.5) + ' ' + y1 + '" stroke="#C99A60" stroke-width="2" opacity=".6"/>' : '');
  const ground = '<ellipse cx="222" cy="511" rx="200" ry="11" fill="rgba(60,36,12,.16)"/><ellipse cx="222" cy="510" rx="150" ry="5" fill="rgba(60,36,12,.22)"/>' +
    '<path d="M86 512 L344 512 L404 524 L120 524 Z" fill="rgba(70,40,14,.12)"/>' +
    [[150, 503], [292, 503], [90, 512], [342, 512]].map(([x, y]) => '<ellipse cx="' + (x + 4) + '" cy="' + (y + 1) + '" rx="14" ry="3" fill="rgba(50,28,8,.35)"/>').join('') +
    '<g fill="#B88A50" opacity=".5"><ellipse cx="70" cy="516" rx="6" ry="1.4"/><ellipse cx="380" cy="508" rx="5" ry="1.2"/><ellipse cx="250" cy="518" rx="4" ry="1"/></g>';
  const back = legC(176, 320, 150, 504, 9, '#5A3818', false) + legC(254, 320, 292, 504, 9, '#4E3014', false) + '<path d="M156 470 H286" stroke="#4E3014" stroke-width="6"/>';
  const front = legC(118, 442, 90, 514, 12, '#7A4E26', true) + legC(312, 442, 342, 514, 12, '#6A4220', true) +
    '<path d="M60 438 H372 V452 H60 Z" fill="#7E5228"/><path d="M60 438 H372 V442 H60 Z" fill="#B88850"/><path d="M60 450 H372 V452 H60 Z" fill="#4A2E12"/>' +
    '<path d="M60 452 H372 L380 466 H68 Z" fill="rgba(40,24,8,.18)"/>' +
    '<g fill="#3A2410"><circle cx="118" cy="445" r="2.2"/><circle cx="312" cy="445" r="2.2"/></g>';
  const svg = '<svg class="al4b" viewBox="0 0 430 520" aria-hidden="true">' + style +
    '<defs><linearGradient id="al4b-wd' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DDB57E"/><stop offset=".55" stop-color="#CDA066"/><stop offset="1" stop-color="#B0814A"/></linearGradient>' +
    '<radialGradient id="al4b-ed' + id + '" cx=".5" cy=".55" r=".62"><stop offset=".62" stop-color="#6E4520" stop-opacity="0"/><stop offset="1" stop-color="#6E4520" stop-opacity=".38"/></radialGradient>' +
    '<linearGradient id="al4b-wt' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CDEBF7" stop-opacity=".55"/><stop offset="1" stop-color="#8CC0DA" stop-opacity=".35"/></linearGradient>' +
    '<clipPath id="al4b-cl' + id + '"><path d="' + BODY + '"/></clipPath></defs>' +
    ground + back + '<path d="' + BODY + '" fill="#5E3A18" transform="translate(6 7)"/>' +
    '<path d="' + BODY + '" fill="url(#al4b-wd' + id + ')"/>' +
    '<g clip-path="url(#al4b-cl' + id + ')">' + grain + knot + stains +
    '<path d="' + clay + '" fill="#F3E9D2" opacity=".22"/><path d="' + clay2 + '" fill="#F3E9D2" opacity=".3"/>' +
    '<path d="' + BODY + '" fill="url(#al4b-ed' + id + ')"/><path d="' + BODY + '" fill="none" stroke="#8C5E30" stroke-width="12" opacity=".35"/>' +
    '<ellipse cx="130" cy="130" rx="110" ry="50" fill="#fff" opacity=".1"/>' +
    '<g class="al4b-ink" fill="none" stroke="#2A190C" stroke-linecap="round" stroke-linejoin="round">' + ink + '</g>' +
    '<g class="al4b-runs">' + runs + '</g>' +
    '<g class="al4b-wet"><path d="' + BODY + '" fill="url(#al4b-wt' + id + ')"/><g stroke="#fff" stroke-linecap="round" fill="none" opacity=".45">' + [60, 130, 190, 260, 330, 380].map((x, k) => '<path d="M' + x + ' 70 q' + (k % 2 ? 6 : -6) + ' 120 0 ' + (220 + k * 23) + '" stroke-width="' + (2 + k % 3) + '"/>').join('') + '</g></g></g>' +
    '<path d="' + BODY + '" fill="none" stroke="#7A4E26" stroke-width="2.4"/>' +
    '<path d="M180 22 Q215 12 250 22" stroke="#fff" stroke-width="3" opacity=".25" fill="none" stroke-linecap="round"/>' +
    '<path d="M14 400 V90 Q14 68 34 68" stroke="#FFF1D6" stroke-width="3" opacity=".3" fill="none" stroke-linecap="round"/>' +
    '<circle cx="215" cy="26" r="7" fill="#3A2210"/><circle cx="216" cy="27.4" r="5" fill="#1E1208"/><path d="M211.4 28 Q205 50 215 56 Q225 50 218.6 28" stroke="#5A3418" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M215 56 l-3 12 M215 56 l3 11" stroke="#5A3418" stroke-width="2.6" stroke-linecap="round"/>' +
    front +
    buta + rag + pen + '</svg>';
  return { svg, tl };
}
function audio() { try { actx = liveAC(actx); if (actx.state === 'suspended') actx.resume(); return actx; } catch (e) { return null; } }
function noise(a, secs) { const n = Math.floor(a.sampleRate * secs), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; }
function burst(a, t, dur, type, f0, f1, q, peak) {
  const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = noise(a, dur + .05); f.type = type; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q;
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + Math.min(.03, dur / 3)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  src.connect(f).connect(g).connect(a.destination); src.start(t); src.stop(t + dur + .05);
}
/* write `word` on the board in aw: the reed pen writes it stroke by stroke with a light scratch for each stroke */
export function alloWrite(aw, word) {
  const { svg, tl } = board(word);
  aw.innerHTML = svg; aw.classList.remove('washing', 'writing'); void aw.offsetWidth; aw.classList.add('writing');
  const a = audio(); if (!a) return;
  const t0 = a.currentTime + .02;
  tl.forEach(([s, e]) => burst(a, t0 + s / 1000, Math.max(.06, (e - s) / 1000), 'bandpass', 3800 + Math.random() * 900, 2600, 2.2, .035 + Math.random() * .015));
}
/* wash the board: water poured, the ink runs and fades, a cloth wipes it clean (2.2s); a splash, a trickle, two wipes */
export function alloWash(aw) {
  aw.classList.remove('writing'); void aw.offsetWidth; aw.classList.add('washing');
  const a = audio(); if (!a || !aw.isConnected) return;
  const t = a.currentTime + .02;
  burst(a, t + .25, .5, 'lowpass', 2400, 500, .7, .09);                      // the water lands
  burst(a, t + .35, 1.1, 'bandpass', 1800, 1100, 1.5, .03);                  // and runs down
  for (let k = 0; k < 6; k++) { const tt = t + .4 + k * .17 + Math.random() * .06, o = a.createOscillator(), g = a.createGain(), f0 = 700 + Math.random() * 600;
    o.type = 'sine'; o.frequency.setValueAtTime(f0, tt); o.frequency.exponentialRampToValueAtTime(f0 * 1.5, tt + .05);
    g.gain.setValueAtTime(.0001, tt); g.gain.exponentialRampToValueAtTime(.03, tt + .01); g.gain.exponentialRampToValueAtTime(.0001, tt + .07);
    o.connect(g).connect(a.destination); o.start(tt); o.stop(tt + .08); }
  burst(a, t + .85, .3, 'bandpass', 700, 1000, 1, .05); burst(a, t + 1.25, .3, 'bandpass', 700, 1000, 1, .05);   // the cloth
}
