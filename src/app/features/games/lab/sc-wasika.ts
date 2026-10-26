// @ts-nocheck
/*
 * Marubucin wasiƙa, drawn (Sani 2026-10-25): a northern street outside the post office in the morning. The cream
 * NIPOST-style building with its green fascia, Hausa sign and the green-white-green flag; a red pillar post box in
 * front. On the right a public letter writer sits under a big striped umbrella at a table with a typewriter, and a
 * queue waits for him: a young man holding his envelope, a woman with her baby tied on her back, an old man with a
 * stick. On the left a shop under a zinc awning, the neem's shade, and a mai ruwa pushing his cart of jerrycans;
 * red-earth houses with zanko horns and a minaret beyond, poles and wires with birds. Two children play with a tyre
 * by the post box, a bicycle leans on the wall and an achaba motorbike is parked. The bottom of the picture is the
 * plain tarred road, kept calm for the keyboard.
 *
 * Classes animated by sc-wasika.css (transform and opacity only):
 *   .x-body · .x-head · .x-al / .x-ar (arms turning at the shoulder) · .x-eo / .x-eh · .x-ms / .x-mf
 *   people: .q1 .q2 .q3 (the queue) · .x-writer · .x-ruwa (the water seller) · .x-kid1 (jumps) · .x-kid2 · .x-tyre
 *   .x-wire (birds on the wire) · .x-crown · .x-cloud
 */
const SK = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#9A6436'];
const lg = (id, ...c) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const zanko = (x0, x1, y, h = 4) => { let s = ''; for (let x = x0; x <= x1; x += 7) s += '<path d="M' + x + ' ' + y + ' l1.3 -' + h + ' l1.3 ' + h + ' Z"/>'; return s; };
const relief = (x, y, s = 1) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="none" stroke="#FFF1D6" stroke-width=".55" opacity=".85"><path d="M-5 0 q5 -5 10 0 q-5 5 -10 0 Z"/><circle r="1.2"/><path d="M-7 5 l3.5 -2 l3.5 2 l3.5 -2 l3.5 2"/></g>';
const cloud = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-cloud" fill="#fff" opacity=".85"><ellipse rx="12" ry="3"/><ellipse cx="7" cy="-1.6" rx="7" ry="3.4"/><ellipse cx="-5" cy="-1" rx="5" ry="2.6"/></g></g>';

/* ---------------- a head on its own origin (radius 5.2); the invisible ring centres its box on the neck ---------------- */
function head(o) {
  const sk = SK[o.skin % SK.length], hc = o.hatc || '#fff', hc2 = o.hatc2 || '#C62828';
  let back = '', top = '', ears = '<g fill="' + sk + '"><circle cx="-5.1" cy=".5" r="1.1"/><circle cx="5.1" cy=".5" r="1.1"/></g>';
  if (o.hat === 'hula') top = '<path d="M-5.3 -1.3 Q-5.7 -7.8 0 -8.3 Q5.7 -7.8 5.3 -1.3 Q0 -2.9 -5.3 -1.3 Z" fill="' + hc + '"/><path d="M-4.6 -3.6 l1.15 -1.2 l1.15 1.2 l1.15 -1.2 l1.15 1.2 l1.15 -1.2 l1.15 1.2 l1.15 -1.2 l1.15 1.2" stroke="' + hc2 + '" stroke-width=".5" fill="none"/><path d="M-5.3 -1.3 Q0 -2.9 5.3 -1.3" stroke="rgba(0,0,0,.2)" stroke-width=".5" fill="none"/>';
  if (o.hat === 'kallabi') top = '<path d="M-5.6 -.6 Q-6.4 -8.6 0 -9.2 Q6.4 -8.6 5.6 -.6 Q0 -4.2 -5.6 -.6 Z" fill="' + hc + '"/><path d="M-2.6 -8.4 Q-6.6 -13.6 -1.4 -12 Q0 -15.4 1.6 -12 Q6.6 -13.4 2.8 -8.4 Z" fill="' + hc + '"/><path d="M-5 -3.4 Q0 -7.2 5 -3.4 M-1.4 -12 Q-.6 -10 0 -8.6 M1.6 -12 Q.8 -10 .4 -8.6" stroke="' + hc2 + '" stroke-width=".6" fill="none"/>';
  if (o.hat === 'zanna') top = '<path d="M-5.1 -1.6 L-4.7 -7.6 Q0 -9.2 4.7 -7.6 L5.1 -1.6 Q0 -3 -5.1 -1.6 Z" fill="' + hc + '"/><path d="M.6 -9 L-.8 -2.6" stroke="rgba(0,0,0,.25)" stroke-width=".5"/>';
  if (o.hat === 'hijab') { back = '<path d="M-6.2 0 Q-6.9 -8.8 0 -9.2 Q6.9 -8.8 6.2 0 L8.4 11.6 Q0 14.4 -8.4 11.6 Z" fill="' + hc + '"/>'; ears = '';
    top = '<path d="M-5.5 1.2 Q-6.1 -7.4 0 -7.7 Q6.1 -7.4 5.5 1.2 Q4.9 -3.6 0 -3.9 Q-4.9 -3.6 -5.5 1.2 Z" fill="' + hc + '"/><path d="M-5.3 1.2 Q-4.6 5.8 0 6 Q4.6 5.8 5.3 1.2 L8.3 11.6 Q0 14.2 -8.3 11.6 Z" fill="' + hc + '"/>'; }
  if (o.hat === 'bare') top = '<path d="M-5 -1.6 Q-5 -5.6 0 -5.8 Q5 -5.6 5 -1.6 Q3 -3.4 0 -3.4 Q-3 -3.4 -5 -1.6 Z" fill="#1A0E06" opacity=".75"/>';
  const beard = o.beard ? '<path d="M-4.7 1.2 Q-4.2 8 0 8.8 Q4.2 8 4.7 1.2 Q2.8 4.4 0 4.4 Q-2.8 4.4 -4.7 1.2 Z" fill="' + o.beard + '"/><path d="M-2.2 2.6 Q0 1.8 2.2 2.6" stroke="' + o.beard + '" stroke-width=".9" fill="none"/>' : '';
  return '<g class="x-head"><circle cy="5.4" r="11" fill="none"/>' + back + ears +
    '<circle r="5.2" fill="' + sk + '"/><path d="M1 -5.1 A5.2 5.2 0 0 1 1 5.1 A3.8 5.2 0 0 0 1 -5.1 Z" fill="#000" opacity=".13"/>' +
    (o.cheek ? '<g fill="#E8735A" opacity=".28"><circle cx="-3" cy="1.9" r="1.1"/><circle cx="3" cy="1.9" r="1.1"/></g>' : '') +
    '<g class="x-eo"><g fill="#1A0E06"><circle cx="-1.9" cy="-.3" r=".72"/><circle cx="1.9" cy="-.3" r=".72"/></g><g fill="#fff"><circle cx="-1.7" cy="-.55" r=".22"/><circle cx="2.1" cy="-.55" r=".22"/></g></g>' +
    '<g class="x-eh" fill="none" stroke="#1A0E06" stroke-width=".55" stroke-linecap="round"><path d="M-2.8 0 q.9 -1.1 1.8 0 M1 0 q.9 -1.1 1.8 0"/></g>' +
    '<path d="M-3 -2.5 q1.1 -.7 2.2 -.2 M3 -2.5 q-1.1 -.7 -2.2 -.2" stroke="#2A160A" stroke-width=".45" fill="none" stroke-linecap="round"/>' +
    '<path d="M-.2 .4 q-.6 1.5 .3 1.7 q.6 0 .8 -.3" stroke="rgba(40,20,8,.55)" stroke-width=".35" fill="none" stroke-linecap="round"/>' +
    (o.specs ? '<g fill="none" stroke="#2A1A10" stroke-width=".35"><circle cx="-1.9" cy="-.3" r="1.4"/><circle cx="1.9" cy="-.3" r="1.4"/><path d="M-.5 -.4 h1"/></g>' : '') +
    beard +
    '<path class="x-ms" d="M-1.7 2.7 Q0 4.1 1.7 2.7" stroke="#3A1A0A" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
    '<path class="x-mf" d="M-1.5 3.8 Q0 2.7 1.5 3.8" stroke="#3A1A0A" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
    top + '</g>';
}

/* ---------------- a standing person, feet on 0, about 64 tall ---------------- */
const POSE = {
  down: ['M-5.6 -47 Q-9.4 -38 -8.8 -28.6', -8.8, -27.8], front: ['M-5.6 -47 Q-9.8 -39 -2.8 -34.4', -2, -34],
  up: ['M-5.6 -47 Q-11 -56 -8.6 -64', -8.6, -65], staff: ['M-5.6 -47 Q-11.6 -42 -11 -33.6', -11, -33],
  type: ['M-5.6 -47 Q-10 -37 -4.2 -31', -3.6, -30.6], push: ['M-5.6 -47 Q-10.6 -40 -12 -29.6', -12, -29],
};
const mir = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => (-x) + ' ' + y);
function arm(side, pose, col, sk, w, hold = '') {
  let [d, hx, hy] = POSE[pose]; const sx = side === 'l' ? -5.6 : 5.6;
  if (side === 'r') { d = mir(d); hx = -hx; }
  return '<g class="x-a' + side + '"><circle cx="' + sx + '" cy="-47" r="21" fill="none"/><path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>' +
    '<path d="' + d + '" stroke="#000" stroke-width="' + (w * .4) + '" stroke-linecap="round" fill="none" opacity=".07" transform="translate(' + (side === 'l' ? .6 : -.6) + ' 0)"/>' +
    '<circle cx="' + hx + '" cy="' + hy + '" r="1.5" fill="' + sk + '"/>' + hold + '</g>';
}
function person(o) {
  const sk = SK[o.skin % SK.length], k = o.kind;
  let b = '<ellipse cy=".4" rx="11" ry="1.7" fill="rgba(40,24,10,.25)"/><g class="x-body">' + (o.behind || '');
  let sleeve = o.robe, w = 3.4;
  if (k === 'man') { // babban riga over trousers
    sleeve = o.robe; w = 4.6;
    b += '<path d="M-4.6 -7 h3 v6 h-3 Z M1.6 -7 h3 v6 h-3 Z" fill="' + (o.pants || '#E8E0CC') + '"/><path d="M-5.4 -1.3 h4.2 v1.4 h-5 Z M1.2 -1.3 h4.2 l.8 1.4 h-5 Z" fill="#3A2A1E"/>' +
      '<path d="M-6 -48.5 Q0 -50.2 6 -48.5 Q10.6 -40 13.6 -7 Q0 -4 -13.6 -7 Q-10.6 -40 -6 -48.5 Z" fill="' + o.robe + '"/>' +
      '<path d="M0 -50 Q6 -50 6 -48.5 Q10.6 -40 13.6 -7 Q7 -5.2 0 -4.6 Z" fill="#000" opacity=".12"/>' +
      '<path d="M-2.4 -48.6 L0 -42 L2.4 -48.6" stroke="' + o.trim + '" stroke-width=".6" fill="none"/><path d="M-6.4 -36 q2 -3 4.2 -.6 q1.4 2.4 -1 3 q-2 .4 -1.4 -1.6" stroke="' + o.trim + '" stroke-width=".5" fill="none"/>' +
      '<path d="M-3 -32 Q-5 -20 -7 -8 M4 -34 Q6 -20 8.6 -8" stroke="rgba(0,0,0,.12)" stroke-width=".6" fill="none"/><path d="M-13.2 -7.6 Q0 -4.6 13.2 -7.6" stroke="' + o.trim + '" stroke-width=".6" fill="none"/>';
  } else if (k === 'young') { // jallabiya kaftan, trousers
    b += '<path d="M-4 -12 h3 v11 h-3 Z M1 -12 h3 v11 h-3 Z" fill="' + (o.pants || '#3A3A48') + '"/><path d="M-4.8 -1.3 h4.2 v1.4 h-5 Z M.8 -1.3 h4.2 l.8 1.4 h-5 Z" fill="#2A1A10"/>' +
      '<path d="M-5.6 -48.5 Q0 -50 5.6 -48.5 L8.4 -10 Q0 -8.4 -8.4 -10 Z" fill="' + o.robe + '"/><path d="M0 -49.6 Q5.6 -49.6 5.6 -48.5 L8.4 -10 Q4 -9 0 -8.8 Z" fill="#000" opacity=".12"/>' +
      '<path d="M0 -48.6 V-38" stroke="' + o.trim + '" stroke-width=".7"/><g fill="' + o.trim + '"><circle cy="-45" r=".45"/><circle cy="-42" r=".45"/></g><path d="M-3 -30 Q-4 -20 -5 -11" stroke="rgba(0,0,0,.12)" stroke-width=".6" fill="none"/>';
  } else if (k === 'woman') { // blouse, zani wrapper, a wrapper tying the baby on
    b += '<path d="M-5 -1.3 h4.2 v1.4 h-5 Z M1 -1.3 h4.2 l.8 1.4 h-5 Z" fill="#5A2E14"/>' +
      '<path d="M-5.6 -48.5 Q0 -50 5.6 -48.5 L7.4 -29 L-7.4 -29 Z" fill="' + o.robe + '"/>' +
      '<path d="M-7.6 -30 L7.6 -30 L8.8 -1.2 Q0 .2 -8.8 -1.2 Z" fill="' + o.wrap + '"/><path d="M-7.6 -30 L7.6 -30 L7.8 -26.4 L-7.8 -26.4 Z" fill="' + o.wrap2 + '"/>' +
      '<path d="M-8.2 -14 H8.2 M-8.5 -6 H8.5" stroke="' + o.wrap2 + '" stroke-width="1.1"/><g fill="' + o.wrap2 + '">' + [-5, -1.6, 1.8, 5.2].map((x) => '<path d="M' + x + ' -11 l1.2 1.2 l-1.2 1.2 l-1.2 -1.2 Z"/>').join('') + '</g>' +
      '<path d="M0 -30 L1 -1 Q5 -.4 8.8 -1.2 L7.6 -30 Z" fill="#000" opacity=".1"/>' +
      (o.baby ? '<path d="M-6.6 -46 L6.4 -40 L6.8 -36 L-7 -42 Z" fill="' + o.baby + '"/><path d="M-6.6 -46 L6.4 -40" stroke="rgba(0,0,0,.2)" stroke-width=".4"/>' : '');
  } else if (k === 'kid') { // a boy in a short kaftan and shorts
    b += '<path d="M-3.6 -12 h3 v11 h-3 Z M.6 -12 h3 v11 h-3 Z" fill="' + sk + '"/><path d="M-4.4 -1.3 h4 v1.4 h-4.8 Z M.6 -1.3 h4 l.8 1.4 h-4.8 Z" fill="#3A2A1E"/>' +
      '<path d="M-4.6 -17 h9.2 v5.4 h-9.2 Z" fill="' + (o.pants || '#3A4A6A') + '"/>' +
      '<path d="M-5.4 -48.5 Q0 -50 5.4 -48.5 L7 -15 Q0 -13.8 -7 -15 Z" fill="' + o.robe + '"/><path d="M0 -49.6 Q5.4 -49.6 5.4 -48.5 L7 -15 Q3.4 -14.2 0 -14 Z" fill="#000" opacity=".12"/>';
  }
  b += arm('l', o.al || 'down', sleeve, sk, w, o.hl || '');
  b += '<rect x="-1.6" y="-51.6" width="3.2" height="3.6" fill="' + sk + '"/>';
  if (o.baby) b += '<g transform="translate(-6.8 -51.6)"><circle r="3.6" fill="' + SK[(o.skin + 2) % 5] + '"/><path d="M-3.2 -.4 Q-3 -3.6 0 -3.8 Q3 -3.6 3.2 -.4 Q0 -2 -3.2 -.4 Z" fill="' + o.baby2 + '"/><circle cx="-1" cy=".2" r=".4" fill="#1A0E06"/><circle cx="1" cy=".2" r=".4" fill="#1A0E06"/></g>';
  b += '<g transform="translate(0 -55)">' + head(o) + '</g>';
  if (o.shawl) b += '<path d="M5.4 -50 Q9.6 -44 9 -26 L6.4 -27 Q7 -40 3.6 -48 Z" fill="' + o.shawl + '"/>';
  b += arm('r', o.ar || 'down', sleeve, sk, w, o.hr || '') + (o.front || '') + '</g>';
  return '<g class="x-p ' + (o.cls || '') + '">' + b + '</g>';
}
const at = (x, y, s, inner) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + inner + '</g>';

/* ---------------- things in the street ---------------- */
const jerry = (x, y, c = '#F2C230') => '<g transform="translate(' + x + ' ' + y + ')"><path d="M-2.4 0 V-6 Q-2.4 -7 -1.4 -7 H1 L2.4 -5.6 V0 Z" fill="' + c + '"/><path d="M-1.6 -7 V-8 H.2 V-7" fill="#2E6BB0"/><path d="M.6 -1 V-5.6" stroke="rgba(0,0,0,.15)" stroke-width=".6"/><path d="M-1.6 -5.6 h2" stroke="rgba(0,0,0,.25)" stroke-width=".5"/></g>';
function ruwaCart() {
  // the mai ruwa leans into the handles of his two-wheeled cart, eight yellow jerrycans in two rows
  const cans = [-34, -27, -20].map((x) => '<g transform="translate(' + x + ' -12) scale(1.35)">' + jerry(0, 0, '#F2C230') + '</g>').join('') + [-31, -24, -17].map((x) => '<g transform="translate(' + x + ' -8) scale(1.35)">' + jerry(0, 0, '#E8B020') + '</g>').join('');
  return '<g class="x-ruwa">' +
    '<ellipse cx="-14" cy=".4" rx="22" ry="1.8" fill="rgba(40,24,10,.25)"/>' +
    '<path d="M-38 -9 H-10 V-5 H-38 Z" fill="#8B5A2B"/><path d="M-38 -9 H-10" stroke="#A8743E" stroke-width=".6"/>' + cans +
    '<path d="M-10 -8 L-4.2 -29" stroke="#6B4422" stroke-width="1.4" stroke-linecap="round"/>' +
    '<g transform="translate(-31 -5)"><g class="x-wheel"><circle r="5.4" fill="none" stroke="#2A2A2A" stroke-width="1.4"/><path d="M-4 0 H4 M0 -4 V4 M-2.8 -2.8 L2.8 2.8 M-2.8 2.8 L2.8 -2.8" stroke="#6A6A6A" stroke-width=".4"/><circle r=".8" fill="#6A6A6A"/></g></g>' +
    '<g transform="translate(-16 -5)"><g class="x-wheel"><circle r="5.4" fill="none" stroke="#2A2A2A" stroke-width="1.4"/><path d="M-4 0 H4 M0 -4 V4 M-2.8 -2.8 L2.8 2.8 M-2.8 2.8 L2.8 -2.8" stroke="#6A6A6A" stroke-width=".4"/><circle r=".8" fill="#6A6A6A"/></g></g>' +
    at(8, 0, 1, person({ kind: 'young', skin: 1, robe: '#8A9A6A', trim: '#5A6A3A', pants: '#4A4A3A', hat: 'hula', hatc: '#E8E0CC', hatc2: '#7A5A3A', al: 'push', ar: 'down', cls: 'mr' })) + '</g>';
}
const postbox = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy=".4" rx="6.4" ry="1.2" fill="rgba(40,24,10,.3)"/><path d="M-4.6 0 V-18 Q-4.6 -23 0 -23.4 Q4.6 -23 4.6 -18 V0 Z" fill="#C62828"/>' +
  '<path d="M1.6 -23 Q4.6 -22 4.6 -18 V0 H1.6 Z" fill="#000" opacity=".14"/><path d="M-5.2 -18 H5.2 V-16.6 H-5.2 Z M-5.2 -1.6 H5.2 V0 H-5.2 Z" fill="#9A1A1A"/><rect x="-2.8" y="-14.6" width="5.6" height="1.1" rx=".5" fill="#2A0A0A"/>' +
  '<rect x="-2.2" y="-11" width="4.4" height="3" rx=".4" fill="#F4E7C9"/><path d="M-1.4 -10 h2.8 M-1.4 -9 h2" stroke="#9A1A1A" stroke-width=".3"/><circle cy="-20" r="1.2" fill="#FFD54A"/></g>';
const bicycle = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="none" stroke-linecap="round"><circle cx="-8" cy="-5" r="5" stroke="#2A2A2A" stroke-width="1"/><circle cx="8" cy="-5" r="5" stroke="#2A2A2A" stroke-width="1"/>' +
  '<path d="M-8 -5 L-2 -5 L4 -12 L-4 -12 Z M-2 -5 L-5 -13 M4 -12 L8 -5 M3.4 -14 L4 -12" stroke="#1E5AA8" stroke-width=".9" stroke-linejoin="round"/><path d="M-7 -13.4 h3.6" stroke="#2A1A10" stroke-width="1.4"/><path d="M1.6 -14.6 Q3.4 -15.4 5.4 -14.2" stroke="#2A2A2A" stroke-width=".8"/>' +
  '<path d="M-8 -5 L-12 -9" stroke="#8B5A2B" stroke-width="1.2" stroke-linejoin="round"/></g>';
const moto = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy=".4" rx="14" ry="1.4" fill="rgba(40,24,10,.25)"/>' +
  '<circle cx="-9" cy="-4.6" r="4.6" fill="#222"/><circle cx="-9" cy="-4.6" r="2" fill="#9A9A9A"/><circle cx="9" cy="-4.6" r="4.6" fill="#222"/><circle cx="9" cy="-4.6" r="2" fill="#9A9A9A"/>' +
  '<path d="M-10 -8 Q-8 -12 -2 -11.6 L5 -11.6 Q8 -11 9 -4.6" stroke="#2A2A2A" stroke-width="1.2" fill="none"/><path d="M-4 -12 Q-3 -15.4 3 -15 Q6 -14.6 6 -12 L-4 -11 Z" fill="#B71C1C"/><path d="M-12 -13.6 H-4 Q-3.4 -12 -4 -11.6 H-11.6 Z" fill="#1A1A1A"/>' +
  '<path d="M6 -12 L8.6 -19 M7 -19.4 H11" stroke="#3A3A3A" stroke-width="1.1" stroke-linecap="round"/><circle cx="9.6" cy="-17.6" r="1.4" fill="#FFF3C0"/><path d="M-2 -7 h6 v3 h-6 Z" fill="#5A5A5A"/><path d="M-9 -4.6 L-14 -8" stroke="#8A8A8A" stroke-width="1"/></g>';
const tyre = '<g class="x-tyre"><circle r="4.4" fill="none" stroke="#1E1E1E" stroke-width="1.8"/><circle r="4.4" fill="none" stroke="#3A3A3A" stroke-width=".5" stroke-dasharray="1 1"/></g>';

export function wasikaScene(): string {
  const W = 320, H = 200;
  // the neem on the left
  let crown = ''; [[10, 14, 26, 14], [40, 8, 24, 13], [66, 18, 18, 11], [24, 34, 22, 12], [52, 38, 16, 10], [-4, 38, 16, 12], [16, 50, 12, 7], [40, 50, 10, 6]].forEach(([x, y, rx, ry]) => { crown += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#3E6B2E"/>'; });
  [[16, 6, 14, 6], [42, 2, 14, 6], [62, 12, 9, 5], [30, 26, 10, 5]].forEach(([x, y, rx, ry]) => { crown += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#5B8C3E"/>'; });
  for (let i = 0; i < 26; i++) { const x = -6 + (i * 29) % 82, y = 2 + (i * 17) % 40; crown += '<path d="M' + x + ' ' + y + ' q1.6 -1.6 3 0 q-1.6 1 -3 0 Z" fill="' + (i % 3 ? '#4C7D34' : '#6E9E48') + '"/>'; }
  // the umbrella: eight panels in two colours, a scalloped hem
  let umb = ''; for (let i = 0; i < 8; i++) { const a0 = 250 + i * 8, a1 = a0 + 8; umb += '<path d="M282 60 L' + a0 + ' 76 Q' + (a0 + 4) + ' 79 ' + a1 + ' 76 Z" fill="' + (i % 2 ? '#F2C230' : '#D84315') + '"/>'; }
  umb = '<path d="M282 60 Q256 64 248 77 L316 77 Q308 64 282 60 Z" fill="#D84315"/>' + umb.replace(/M282 60 L(\d+) 76/g, 'M282 60 L$1 76.6') +
    '<path d="M248 77 Q282 70 316 77" stroke="rgba(0,0,0,.12)" stroke-width=".8" fill="none"/><path d="M282 60 v-2.4" stroke="#5A3A1E" stroke-width="1"/><circle cx="282" cy="57.4" r="1" fill="#5A3A1E"/>';
  const writer = person({ kind: 'man', skin: 3, robe: '#2F4F8F', trim: '#E8C35A', hat: 'hula', hatc: '#F4EBD0', hatc2: '#2F4F8F', specs: 1, beard: '#2A1A10', al: 'type', ar: 'type', cls: 'x-writer' });
  const queue =
    at(214, 140, .66, person({ kind: 'man', skin: 1, robe: '#E8E0CC', trim: '#8B6A3A', hat: 'zanna', hatc: '#B71C1C', beard: '#ECE8DE', al: 'front', ar: 'staff', cls: 'q3',
      hr: '<path d="M11 -33 L12.6 0" stroke="#6B4422" stroke-width="1.1" stroke-linecap="round"/><path d="M10 -34.6 q1.6 -1.6 2.6 .4" stroke="#6B4422" stroke-width="1.1" fill="none" stroke-linecap="round"/>' })) +
    at(231, 140, .64, person({ kind: 'woman', skin: 0, robe: '#7B1FA2', wrap: '#00897B', wrap2: '#FFD54A', hat: 'kallabi', hatc: '#7B1FA2', hatc2: '#FFD54A', baby: '#E65100', baby2: '#FFD54A', shawl: '#F2C230', cheek: 1, al: 'front', ar: 'front', cls: 'q2' })) +
    at(248, 140, .68, person({ kind: 'young', skin: 4, robe: '#F4F1EA', trim: '#2E7D32', hat: 'hula', hatc: '#2E7D32', hatc2: '#FFD54A', al: 'front', ar: 'front', cls: 'q1',
      hl: '<path d="M-4.2 -36.6 L1.8 -38.4 L2.8 -34.4 L-3.2 -32.6 Z" fill="#FFFFFF" stroke="#C9B48A" stroke-width=".3"/><path d="M-4.2 -36.6 L-.6 -35.2 L1.8 -38.4" stroke="#C9B48A" stroke-width=".3" fill="none"/>' }));
  const kids =
    at(128, 146, .5, '<g class="x-kid1">' + person({ kind: 'kid', skin: 2, robe: '#E53935', trim: '#fff', hat: 'bare', cheek: 1, al: 'up', ar: 'down', pants: '#2E4A7A' }) + '</g>') +
    '<g transform="translate(140 141)"><g class="x-roll">' + tyre + '</g></g>' +
    at(150, 146, .48, '<g class="x-kid2">' + person({ kind: 'kid', skin: 4, robe: '#FFB300', trim: '#fff', hat: 'hula', hatc: '#1565C0', hatc2: '#fff', cheek: 1, al: 'front', ar: 'down',
      hr: '<path d="M8.8 -27.8 L1 -14" stroke="#6B4422" stroke-width="1.6" stroke-linecap="round"/>' }) + '</g>');
  return '<svg class="scene ws4" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('ws4-sky', '#8ECDEB', '#CFEAF2', '#F4E6C4') + lg('ws4-po', '#FBF3DE', '#E8D8B0') + lg('ws4-red', '#CE8650', '#B0663A') + lg('ws4-red2', '#C27844', '#9E5A2C') +
    lg('ws4-side', '#E2C690', '#D4B07A') + lg('ws4-road', '#9A9184', '#8A8174', '#7E7568') + lg('ws4-shop', '#4F8FA8', '#3E7890') + lg('ws4-zinc', '#C8CDD0', '#9EA6AB') +
    lg('ws4-trunk', '#6B4A2E', '#4A3020') +
    '<radialGradient id="ws4-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6D0"/><stop offset=".45" stop-color="#FFE7A0" stop-opacity=".5"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#ws4-sky)"/><circle cx="232" cy="30" r="22" fill="url(#ws4-sun)"/><circle cx="232" cy="30" r="6" fill="#FFF3C6"/>' +
    cloud(150, 20, 1) + cloud(292, 36, .7) +
    // far: a minaret and dome, pale roofs
    '<g fill="#E2D2B0" opacity=".85"><path d="M196 96 V44 l2.6 -6 l2.6 6 V96 Z"/><ellipse cx="198.6" cy="44" rx="3.6" ry="1.6"/><path d="M198.6 38 v-4" stroke="#E2D2B0" stroke-width=".6"/><path d="M178 96 Q190 74 202 96 Z"/><circle cx="190" cy="78" r="1" /></g>' +
    '<g fill="#D9B48A" opacity=".55"><path d="M60 96 V80 H96 V96 Z M226 96 V82 H262 V96 Z"/>' + zanko(60, 94, 80, 3) + zanko(226, 260, 82, 3) + '</g>' +
    // red-earth Hausa houses either side of the post office
    '<path d="M64 128 V84 H110 V128 Z" fill="url(#ws4-red)"/><g fill="#B0663A">' + zanko(64, 108, 84) + '</g>' + relief(87, 96) +
    '<path d="M80 128 V114 a5 5 0 0 1 10 0 V128 Z" fill="#3A1E0C"/><rect x="96" y="104" width="7" height="6" fill="#2A1A10"/><path d="M96 104 h7 M99.5 104 v6" stroke="#E8D3A8" stroke-width=".5"/>' +
    '<path d="M226 128 V88 H262 V128 Z" fill="url(#ws4-red2)"/><g fill="#9E5A2C">' + zanko(226, 260, 88) + '</g>' + relief(244, 100) +
    // the post office: cream walls, green fascia, the sign, the flag, windows, steps
    '<path d="M108 128 V66 H228 V128 Z" fill="url(#ws4-po)"/><path d="M104 66 H232 V58 H104 Z" fill="#2E7D32"/><path d="M104 66 H232" stroke="#1B5E20" stroke-width="1"/><path d="M104 58 H232" stroke="#4CAF50" stroke-width=".6"/>' +
    '<path d="M108 66 V128" stroke="#E0CFA4" stroke-width="1.6"/><path d="M228 66 V128" stroke="#D8C496" stroke-width="1.6"/>' +
    '<rect x="140" y="69" width="56" height="9" rx="1" fill="#1B5E20"/><text x="168" y="75.8" text-anchor="middle" font-size="5.4" font-weight="800" fill="#FFF8E1" font-family="Baloo 2,sans-serif" letter-spacing=".3">GIDAN WAYA</text>' +
    '<path d="M168 58 V40" stroke="#8A8A8A" stroke-width=".7"/><path d="M168 40.4 h3.4 v6 h-3.4 Z" fill="#008751"/><path d="M171.4 40.4 h3.4 v6 h-3.4 Z" fill="#FFFFFF"/><path d="M174.8 40.4 h3.4 v6 h-3.4 Z" fill="#008751"/>' +
    [116, 132, 190, 206].map((x) => '<rect x="' + x + '" y="84" width="11" height="13" fill="#6FA6C6"/><rect x="' + x + '" y="84" width="11" height="4" fill="#fff" opacity=".3"/><path d="M' + (x + 5.5) + ' 84 v13 M' + x + ' 90.5 h11" stroke="#2E7D32" stroke-width=".7"/><rect x="' + (x - .8) + '" y="83.2" width="12.6" height="14.6" fill="none" stroke="#2E7D32" stroke-width=".9"/><path d="M' + (x - 1.4) + ' 98.4 h13.8" stroke="#CDB98E" stroke-width="1.2"/>').join('') +
    '<path d="M158 128 V88 H178 V128 Z" fill="#2E5A3A"/><path d="M168 88 V128" stroke="#1E3A26" stroke-width=".6"/><path d="M158 88 Q168 82 178 88" stroke="#2E7D32" stroke-width="1.2" fill="none"/><circle cx="165.6" cy="108" r=".6" fill="#FFD54A"/><circle cx="170.4" cy="108" r=".6" fill="#FFD54A"/>' +
    '<path d="M154 128 h28 v2 h-28 Z M151 130 h34 v2 h-34 Z" fill="#D6C8A6"/>' +
    '<path d="M116 106 h11 v8 h-11 Z M206 106 h11 v8 h-11 Z" fill="#E0CFA4" opacity=".7"/>' +
    // the shop on the left: blue wall, a dark doorway with goods, the zinc awning on poles
    '<path d="M-4 128 V74 H62 V128 Z" fill="url(#ws4-shop)"/><path d="M-4 74 H62 V70 H-4 Z" fill="#2F6A80"/>' +
    '<rect x="8" y="92" width="22" height="36" fill="#2A1E1A"/><g>' + [10, 14, 18, 22, 26].map((x, i) => '<rect x="' + x + '" y="' + (96 + (i % 2) * 2) + '" width="3" height="4" fill="' + ['#E53935', '#FFD54A', '#43A047', '#FB8C00', '#1E88E5'][i] + '"/>').join('') +
    '<path d="M9 104 h20 M9 112 h20" stroke="#5A4030" stroke-width=".8"/>' + [11, 16, 21, 26].map((x, i) => '<rect x="' + x + '" y="' + (106 + i % 2) + '" width="3.4" height="5" rx=".6" fill="' + ['#F5F5F5', '#C62828', '#FFB300', '#7CB342'][i] + '"/>').join('') + '</g>' +
    '<rect x="36" y="94" width="18" height="12" fill="#2A1E1A"/><path d="M36 94 h18 v12 h-18 Z" fill="none" stroke="#E8E0CC" stroke-width=".8"/><path d="M45 94 v12" stroke="#E8E0CC" stroke-width=".6"/>' +
    '<path d="M-6 84 L64 84 L70 94 L-6 94 Z" fill="url(#ws4-zinc)"/><g stroke="#8A9296" stroke-width=".5">' + Array.from({ length: 17 }, (_, i) => '<path d="M' + (-4 + i * 4.2) + ' 84 L' + (-3 + i * 4.4) + ' 94"/>').join('') + '</g><path d="M-6 94 L70 94" stroke="#7A8286" stroke-width=".8"/>' +
    '<path d="M4 94 V128 M62 94 V128" stroke="#6B4422" stroke-width="1.4"/>' +
    '<g fill="#7A3A1E"><rect x="36" y="118" width="22" height="2" rx=".8"/><path d="M38 120 v8 M56 120 v8" stroke="#5A2A12" stroke-width="1"/></g>' +
    // the neem
    '<path d="M14 132 Q20 128 20 112 Q19 94 14 78 Q8 66 -2 58 L2 55 Q12 62 18 72 Q20 58 16 44 L21 43 Q25 58 24 74 Q30 60 42 52 L45 55 Q32 66 28 82 Q26 100 28 116 Q29 128 36 132 Z" fill="url(#ws4-trunk)"/><path d="M22 120 Q24 100 22 88" stroke="#3E2618" stroke-width=".6" fill="none"/>' +
    '<g class="x-crown">' + crown + '</g>' +
    // poles and wires, birds sitting on the wire
    '<path d="M100 128 V30 M98 34 h4 M260 128 V34 M258 38 h4" stroke="#6B5A48" stroke-width="1.4"/><path d="M-4 40 Q50 50 100 34 Q180 52 260 38 Q300 46 324 42 M-4 44 Q50 54 100 37 Q180 56 260 41 Q300 50 324 46" stroke="#2A2A2A" stroke-width=".35" fill="none"/>' +
    '<g class="x-wire">' + [[140, 43.6], [146, 44.6], [210, 44.2]].map(([x, y]) => '<g transform="translate(' + x + ' ' + y + ')"><ellipse cy="-1.4" rx="1.4" ry="1.2" fill="#3A3A4A"/><circle cx="1" cy="-2.6" r=".8" fill="#3A3A4A"/><path d="M1.7 -2.6 l.8 .2 l-.8 .3 Z" fill="#E8B23A"/><path d="M-1.2 -1.2 l-1.4 .8" stroke="#3A3A4A" stroke-width=".6"/></g>').join('') + '</g>' +
    // the street: the sandy side and the tarred road below, kept calm
    '<path d="M-4 127 H324 V200 H-4 Z" fill="url(#ws4-side)"/><path d="M-4 152 Q160 148 324 152 V200 H-4 Z" fill="url(#ws4-road)"/><path d="M-4 152 Q160 148 324 152" stroke="#B8AE9C" stroke-width="1.2" fill="none"/>' +
    '<g fill="#6E665A" opacity=".35"><ellipse cx="60" cy="186" rx="30" ry="3"/><ellipse cx="230" cy="164" rx="24" ry="2"/><ellipse cx="290" cy="192" rx="20" ry="2"/></g><g fill="#C9BFAE">' + [8, 30, 52, 74, 96, 118, 140, 162, 184, 206, 228, 250, 272, 294, 316].map((x, i) => '<rect x="' + x + '" y="' + (149.4 + Math.abs(160 - x) / 160 * 1.6).toFixed(1) + '" width="20" height="2.4" rx=".6" opacity="' + (i % 2 ? .9 : .7) + '"/>').join('') + '</g>' +
    '<g fill="#F2EADB" opacity=".5">' + [20, 70, 120, 170, 220, 270].map((x) => '<rect x="' + x + '" y="175" width="20" height="1.4" rx=".7"/>').join('') + '</g>' +
    '<g fill="#B98A50" opacity=".3"><ellipse cx="90" cy="140" rx="20" ry="1.2"/><ellipse cx="190" cy="146" rx="16" ry="1"/></g>' +
    // things against the post office wall and in front of it
    bicycle(90, 129, .95) + moto(196, 132, .95) + postbox(118, 136, 1.05) +
    // the water seller on the left, under the awning's shade
    at(66, 140, .72, ruwaCart()) +
    // the letter writer under his umbrella, the queue waiting
    '<path d="M282 60 V112" stroke="#5A3A1E" stroke-width="1"/>' + umb +
    at(282, 134, .72, writer) +
    '<g><path d="M262 112 H302 V115 H262 Z" fill="#8B5A2B"/><path d="M262 112 H302" stroke="#A8743E" stroke-width=".6"/><path d="M265 115 L264 138 M299 115 L300 138" stroke="#5E3A1C" stroke-width="1.6"/><path d="M266 120 H298" stroke="#5E3A1C" stroke-width=".8"/>' +
    '<g class="x-type"><rect x="273" y="105" width="18" height="7.4" rx="1.4" fill="#37474F"/><rect x="275" y="102.6" width="14" height="3" rx="1" fill="#263238"/><path d="M276 99.6 L288 99.6 L288 103 L276 103 Z" fill="#FFFFFF"/><path d="M277 100.6 h9 M277 101.8 h7" stroke="#8A8A8A" stroke-width=".3"/>' +
    '<g fill="#CFD8DC">' + [0, 1, 2, 3, 4, 5].map((i) => '<circle cx="' + (276 + i * 2.4) + '" cy="108" r=".6"/><circle cx="' + (277.2 + i * 2.4) + '" cy="110" r=".6"/>').join('') + '</g></g>' +
    '<path d="M293 108 l4 -1 l1 3 l-4 1 Z" fill="#FFFFFF" stroke="#C9B48A" stroke-width=".3"/><path d="M268 110 h3.6 v2 h-3.6 Z" fill="#1565C0"/></g>' +
    queue + kids +
    '</svg>';
}
