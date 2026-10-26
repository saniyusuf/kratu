// @ts-nocheck
/*
 * Kamun kifi at Argungu (Sani 2026-10-25): the river on festival day. The far bank is crowded under bunting and
 * canopies, fishermen stand waist-deep with their hand nets and calabash floats, and one fisherman stands close by in
 * the shallows with his homa (the hooped hand net). When the child catches the right fish he scoops it up and flicks it
 * into the woven basket floating beside him; the basket fills, one fish at a time. Drawn, not photographed; every
 * moving part moves by transform and opacity, a few slow loops only, for cheap tablets.
 */
const SK = '#5E3A1C';

/* The far side of the river, 160×100 sliced like the other scenes; the water layer covers it from y≈31. Back to front:
   sky and egrets; farms at both ends (millet rows, a man and a woman hoeing), Fulani cattle grazing with their herder;
   the festival in the middle (canopies, bunting, the crowd); two men spreading a net to dry; at the water's edge
   fishermen waist-deep with hand nets and calabash floats, and a canoe whose man throws a cast net. */
export function argunguScene(): string {
  const lg = (id, ...c) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
  const cloud = (x, y, s) => '<g class="drift4" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fff" opacity=".85"><ellipse rx="12" ry="3"/><ellipse cx="7" cy="-1.6" rx="7" ry="3.4"/><ellipse cx="-5" cy="-1" rx="5" ry="2.6"/></g>';
  const dum = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-.8 0 L-.5 -16 L.5 -16 L.8 0 Z" fill="#6B4A2A"/><path d="M0 -16 L-6 -19 M0 -16 L6 -19 M0 -16 L-4 -22 M0 -16 L4 -22 M0 -16 L0 -23" stroke="#4F7A3A" stroke-width="1.6" stroke-linecap="round"/></g>';
  const neem = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-1.4 0 Q-2 -10 -1 -18 L1 -18 Q2 -10 1.4 0 Z" fill="#5A3A1E"/>' +
    '<ellipse cx="0" cy="-22" rx="13" ry="8" fill="#3E6B2E"/><ellipse cx="-6" cy="-19" rx="7" ry="5" fill="#3E6B2E"/><ellipse cx="-3" cy="-25" rx="7" ry="4.4" fill="#5A8A3C"/><ellipse cx="5" cy="-23" rx="6" ry="4" fill="#5A8A3C"/></g>';
  const rumfa = (x, w, c) => '<g><path d="M' + x + ' 27 V20 M' + (x + w) + ' 27 V20" stroke="#5A3A1E" stroke-width=".5"/>' +
    '<path d="M' + (x - 1) + ' 20.4 L' + (x + w / 2) + ' 16.6 L' + (x + w + 1) + ' 20.4 Z" fill="' + c + '"/><path d="M' + (x - 1) + ' 20.4 H' + (x + w + 1) + '" stroke="#fff" stroke-width=".5" stroke-dasharray="1 1"/></g>';
  /* a field: rows of young millet on red-brown earth */
  const field = (x0, x1, y) => { let s = '<path d="M' + x0 + ' ' + y + ' H' + x1 + ' V' + (y + 4.4) + ' H' + x0 + ' Z" fill="#B98A52"/><g stroke="#4F8A34" stroke-width=".7" stroke-linecap="round">';
    for (let r = 0; r < 4; r++) for (let x = x0 + 1 + (r % 2); x < x1 - .5; x += 2.2) s += '<path d="M' + x.toFixed(1) + ' ' + (y + 1 + r * 1.1).toFixed(1) + ' l-.3 -1.1 M' + x.toFixed(1) + ' ' + (y + 1 + r * 1.1).toFixed(1) + ' l.4 -1"/>';
    return s + '</g>'; };
  /* a farmer bent over a hoe (fartanya); the arms and hoe rise and fall */
  const farmer = (x, y, robe, head, k) => '<g transform="translate(' + x + ' ' + y + ')"><path d="M-.9 0 L-.6 -2.4 M.9 0 L.6 -2.4" stroke="' + SK + '" stroke-width=".55"/>' +
    '<path d="M-1.4 -2 L-1 -4.6 Q.6 -6 2 -4.4 L1.6 -2 Z" fill="' + robe + '"/><circle cx="2.4" cy="-5" r=".85" fill="' + SK + '"/>' + head +
    '<g class="hoe h' + k + '"><path d="M1.6 -4.2 L3.4 -2.6" stroke="' + SK + '" stroke-width=".55" stroke-linecap="round"/><path d="M2 -5.2 L4 -.4" stroke="#7A5530" stroke-width=".35"/><path d="M3.4 -.6 L4.8 -.2" stroke="#9AA0A6" stroke-width=".6"/></g></g>';
  /* a white Fulani cow grazing, its head dips now and then */
  const cow = (x, y, s, k) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-3 0 V-2.4 M-1.6 0 V-2.4 M2 0 V-2.4 M3.2 0 V-2.4" stroke="#8E8676" stroke-width=".5"/>' +
    '<ellipse cx="0" cy="-3.4" rx="4" ry="1.7" fill="#F2EDE2"/><path d="M-1 -4.8 Q0 -6 1 -4.8" fill="#E6DECD"/>' +
    '<g class="graze g' + k + '"><path d="M-3.6 -4 L-5.4 -2.4 L-6.2 -1.6 L-5.2 -1.2 L-4 -2.2 Z" fill="#E9E2D2"/><path d="M-4.4 -3.8 Q-5.6 -6.4 -4 -6.6 M-4.6 -3.4 Q-3.6 -6 -2.4 -5.8" stroke="#C9B48A" stroke-width=".45" fill="none"/></g>' +
    '<path d="M4 -3.6 Q5 -2.6 4.6 -1.2" stroke="#8E8676" stroke-width=".35" fill="none"/></g>';
  const person = (x, y, robe, s = 1, extra = '') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-1.3 0 L-.9 -3.6 L.9 -3.6 L1.3 0 Z" fill="' + robe + '"/><circle cy="-4.5" r=".9" fill="' + SK + '"/>' + extra + '</g>';
  const cols = ['#2F6B9A', '#AD1457', '#F4EBD0', '#2E7D32', '#6A4C93', '#EF6C00', '#C62828', '#1565C0', '#FFB300'];
  let crowd = '<g class="crowd4">';
  for (let i = 0; i < 24; i++) {
    const x = 30 + i * 3.9 + (i % 3) * .7, y = 26.8 + (i % 2) * .7;
    crowd += person(x.toFixed(1), y.toFixed(1), cols[(i * 5) % cols.length], .78, i % 4 === 1 ? '<path d="M.9 -3.2 L2.2 -6" stroke="#6B4422" stroke-width=".45" stroke-linecap="round"/>' : '');
  }
  crowd += '</g>';
  /* two men spread a long net to dry between them; it lifts in the breeze */
  const spread = '<g transform="translate(130 27.6)">' + person(0, 0, '#E9D9A6', .8) + person(16, 0, '#1E5A8A', .8) +
    '<g class="drynet"><path d="M.8 -2.6 Q8 -1 15.2 -2.6 L15.2 -.6 Q8 1 .8 -.6 Z" fill="#D9CBA6" opacity=".55"/><path d="M.8 -2.6 Q8 -1 15.2 -2.6 M2.6 -2.2 V-.4 M5 -1.8 V0 M7.6 -1.6 V.2 M10.2 -1.6 V.2 M12.8 -2 V-.2" stroke="#7A5530" stroke-width=".22" fill="none"/></g></g>';
  /* far fishermen waist-deep with raised nets and calabash floats, bobbing slowly */
  const far = (x, k) => '<g class="farfish f' + k + '"><g transform="translate(' + x + ' 31.2)"><path d="M-1.4 0 L-1.1 -3.4 L1.1 -3.4 L1.4 0 Z" fill="' + ['#1E5A8A', '#E9D9A6', '#7A3E1E', '#2E7D32'][k % 4] + '"/>' +
    '<circle cy="-4.4" r=".9" fill="' + SK + '"/><path d="M1 -3 L3.4 -7.4" stroke="#6B4A2A" stroke-width=".4"/><ellipse cx="3.9" cy="-8.2" rx="1.8" ry="1.2" fill="none" stroke="#6B4A2A" stroke-width=".35"/>' +
    '<path d="M2.4 -8 Q3.9 -5.4 5.4 -8" fill="#D9CBA6" opacity=".6"/></g>' +
    '<ellipse cx="' + (x - 3.4) + '" cy="31.4" rx="1.6" ry="1.3" fill="#E2B04A"/><ellipse cx="' + (x - 3.8) + '" cy="30.8" rx=".6" ry=".35" fill="#F6D98A"/></g>';
  /* a dugout canoe drifting; its man throws a cast net that opens over the water and is drawn in again */
  const canoe = '<g class="canoe4"><g transform="translate(78 30.6)"><path d="M-6 0 Q0 1.6 6 0 L5.4 -1 H-5.4 Z" fill="#6B4422"/>' + person(-1.4, -1, '#C62828', .8) +
    '<path d="M-.8 -3.6 L1.6 -4.8" stroke="' + SK + '" stroke-width=".5" stroke-linecap="round"/>' +
    '<g class="castnet"><ellipse cx="5.6" cy="-4" rx="3.6" ry="1.6" fill="#E9E0C8" opacity=".5" stroke="#7A5530" stroke-width=".2" stroke-dasharray=".5 .4"/><path d="M1.6 -4.8 L5.6 -4" stroke="#7A5530" stroke-width=".15"/></g></g></g>';
  /* egrets: two crossing the sky, one standing at the water's edge */
  const egret = '<g class="egrets"><g transform="translate(0 7)"><path d="M0 0 Q-1.6 -1.4 -3 -.4 M0 0 Q1.6 -1.4 3 -.4" stroke="#fff" stroke-width=".55" fill="none" stroke-linecap="round"/><ellipse cx="0" cy=".2" rx="1.1" ry=".45" fill="#fff"/></g>' +
    '<g transform="translate(-9 10.4) scale(.8)"><path d="M0 0 Q-1.6 -1.4 -3 -.4 M0 0 Q1.6 -1.4 3 -.4" stroke="#fff" stroke-width=".55" fill="none" stroke-linecap="round"/><ellipse cx="0" cy=".2" rx="1.1" ry=".45" fill="#fff"/></g></g>';
  const stander = '<g transform="translate(112 30.6)"><path d="M0 0 V-1.8 M.5 0 V-1.8" stroke="#3A3A3A" stroke-width=".2"/><ellipse cx=".4" cy="-2.4" rx="1.2" ry=".7" fill="#fff"/><path d="M-.6 -2.6 Q-1 -4 -.4 -4.4 L-1.4 -4.2" stroke="#fff" stroke-width=".4" fill="none"/></g>';
  return '<svg class="scene" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice"><defs>' + lg('ag-sky', '#86CBEE', '#D6EDF4', '#F5E6C4') + lg('ag-bank', '#8DAA5C', '#7E9A4E', '#B89A62') + '</defs>' +
    '<rect width="160" height="100" fill="url(#ag-sky)"/><circle cx="142" cy="9" r="4.4" fill="#FFE58A"/>' + cloud(30, 8, .8) + cloud(104, 6, .6) + egret +
    '<path d="M0 19 Q30 16.6 60 18 T120 17.4 T160 18 V22 H0 Z" fill="#9DB46E" opacity=".7"/>' +
    dum(6, 22, .7) + neem(24, 22, .6) + dum(64, 21, .6) + neem(90, 22, .7) + dum(122, 21, .8) + neem(152, 22, .6) +
    '<path d="M0 21 Q40 19.6 80 21 T160 20.4 V32 H0 Z" fill="url(#ag-bank)"/>' +
    field(2, 26, 21.6) + farmer(9, 25.6, '#2E7D32', '<path d="M1.6 -5.6 Q2.4 -6.6 3.2 -5.6 Z" fill="#E9D9A6"/>', 0) + farmer(19, 25.4, '#AD1457', '<path d="M1.5 -5.2 Q2.4 -6.8 3.3 -5.2" fill="#6A1B9A"/>', 1) +
    field(136, 158, 21.4) + farmer(146, 25.4, '#1565C0', '<path d="M1.6 -5.6 Q2.4 -6.6 3.2 -5.6 Z" fill="#C62828"/>', 2) +
    cow(104, 24.6, .8, 0) + cow(114, 24.2, .7, 1) + person(121, 24.6, '#7A3E1E', .7, '<path d="M1 -3 L1.6 1" stroke="#6B4A2A" stroke-width=".4"/><path d="M-1.4 -4.8 Q0 -6.4 1.4 -4.8 Z" fill="#D9B46A"/>') +
    rumfa(34, 12, '#C62828') + rumfa(62, 14, '#2E7D32') + rumfa(92, 12, '#1565C0') +
    '<g class="bunting"><path d="M30 13 Q65 19 100 13" fill="none" stroke="#5A3A1E" stroke-width=".4"/>' +
    [33, 40, 47, 54, 61, 68, 75, 82, 89, 96].map((x, i) => '<path d="M' + x + ' ' + (13 + Math.sin((x - 30) / 70 * Math.PI) * 5.6).toFixed(1) + ' l1.6 3 l1.6 -3 Z" fill="' + ['#C62828', '#2E7D32', '#FFD54A', '#1565C0'][i % 4] + '"/>').join('') + '</g>' +
    crowd + spread + stander + far(22, 0) + far(46, 1) + canoe + far(98, 2) + far(126, 3) + '</svg>';
}

/* Under the surface, lowered to 31%: light rays, sand, reeds, a catfish nosing along the bottom, a crab sidling on the
   sand, a far shoal of small fish, and bubbles rising. Everything moves by transform and opacity only. */
export function argunguWater(): string {
  const s = 19.4;
  const shoal = [0, 1, 2, 3, 4].map(i => '<path transform="translate(' + (i * 2.6) + ' ' + ((i % 2) * 1.4 + (i % 3) * .6).toFixed(1) + ')" d="M0 0 Q1 -.6 2 0 L2.6 -.4 L2.5 0 L2.6 .4 L2 0 Q1 .6 0 0 Z"/>').join('');
  const bub = (x, k) => '<g transform="translate(' + x + ' 56)"><g class="bub4 b' + k + '"><circle r=".5"/><circle cx=".4" cy="-2.4" r=".35"/><circle cx="-.2" cy="-4.6" r=".3"/></g></g>';
  return '<svg class="uw" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect y="' + s + '" width="100" height="' + (62.5 - s) + '" fill="url(#kb-under)"/>' +
    '<g class="rays"><path d="M10 ' + s + ' L4 62.5 H16 Z M34 ' + s + ' L30 62.5 H42 Z M58 ' + s + ' L56 62.5 H66 Z" fill="url(#kb-ray)"/></g>' +
    '<path d="M0 ' + s + ' Q12 ' + (s - 1.2) + ' 25 ' + s + ' T50 ' + s + ' T75 ' + s + ' T100 ' + s + '" stroke="#E9FBFF" stroke-opacity=".75" stroke-width=".6" fill="none"/>' +
    '<g class="shoal4" fill="#0E3E52" opacity=".35"><g transform="translate(0 33)">' + shoal + '</g><g transform="translate(30 41) scale(.8)">' + shoal + '</g></g>' +
    '<path d="M0 62.5 V57 Q20 54 40 57 T80 56 T100 57 V62.5 Z" fill="#C8B07A"/><g fill="#8E7B55">' + [[8, 59], [22, 60.5], [47, 59.5], [70, 60], [91, 59]].map(p => '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1.6" ry=".9"/>').join('') + '</g>' +
    '<g class="weeds" stroke="#3E7E2C" stroke-width=".7" fill="none"><path d="M4 62 Q2 52 5 44 M7 62 Q9 50 6 42 M60 62 Q58 54 61 48 M84 61 Q86 54 83 49 M86 61 Q84 52 87 47"/></g>' +
    '<g class="catfish4"><g transform="translate(70 54.4)"><path d="M0 0 Q4 -1.6 9 -.6 L12 -1.8 L11.4 0 L12 1.6 L9 .6 Q4 1.4 0 0 Z" fill="#3B3A36"/><path d="M3 -.9 Q6 -1.6 9 -.6" fill="#55534C"/>' +
      '<path d="M.4 0 Q-1.6 1 -2.6 2.6 M.4 .2 Q-1.4 -.4 -2.8 0 M.6 .4 Q-.6 1.6 -1 3" stroke="#3B3A36" stroke-width=".18" fill="none"/><circle cx="1.4" cy="-.3" r=".25" fill="#E9E2D2"/></g></g>' +
    '<g class="crab4"><g transform="translate(26 57.6)"><ellipse rx="1.8" ry="1" fill="#C8552E"/><path d="M-1.4 .4 L-2.6 1.4 M-1 .7 L-2 1.8 M1.4 .4 L2.6 1.4 M1 .7 L2 1.8" stroke="#A8441F" stroke-width=".3"/>' +
      '<path d="M-1.6 -.4 L-2.6 -1.6 M1.6 -.4 L2.6 -1.6" stroke="#A8441F" stroke-width=".4"/><circle cx="-2.7" cy="-1.8" r=".5" fill="#C8552E"/><circle cx="2.7" cy="-1.8" r=".5" fill="#C8552E"/></g></g>' +
    '<g fill="none" stroke="#E9FBFF" stroke-width=".18" opacity=".8">' + bub(20, 0) + bub(47, 1) + bub(78, 2) + bub(92, 3) + '</g></svg>';
}

/* The fisherman, a grown Arewa man, turned to face us, waist-deep: embroidered hula cap, short beard, a riga, his homa
   held in both hands and his calabash float tied at the waist (Sani 2026-10-25: "make him a real Arewa fisherman"). The water line is y=74 of 130; below it he is seen through the water. .homa turns at the shoulder:
   .scoop dips the hoop into the water, .throw flicks it up and over towards the basket. */
export function fisherman(): string {
  return '<svg class="fisher2" viewBox="0 0 120 130" aria-hidden="true">' +
    '<g class="legs" opacity=".55"><path d="M56 74 L54 124 L61 124 L63 88 L65 124 L72 124 L70 74 Z" fill="' + SK + '"/><path d="M53 66 L73 66 L74 92 L64 92 L63 84 L62 92 L52 92 Z" fill="#2B3F73"/></g>' +
    '<g class="body2">' +
      /* a short-sleeved riga in faded indigo with white embroidery at the neck, a calabash float tied at the waist */
      '<path d="M50 36 Q62 31 74 36 L78 45 L73.6 47 L74 70 L50 70 L50.4 47 L46 45 Z" fill="#5E8FB4"/>' +
      '<path d="M57 33.4 Q62 41 67 33.4" stroke="#F4EFE4" stroke-width="1.2" fill="none"/><path d="M62 39 V58" stroke="#F4EFE4" stroke-width=".9" stroke-dasharray="1.4 1"/>' +
      '<path d="M59 42 l3 2 l3 -2 M59 47 l3 2 l3 -2" stroke="#F4EFE4" stroke-width=".6" fill="none"/><path d="M50 70 H74" stroke="#3F6E92" stroke-width="1.4"/>' +
      '<path d="M74 66 Q82 67 85 71" stroke="#8A6A3A" stroke-width=".8" fill="none"/>' +
      /* his face, turned to us: two eyes, brows, a short beard and moustache, a smile; an embroidered hula cap */
      '<g class="head2"><rect x="58.8" y="25" width="6.4" height="8" fill="' + SK + '"/>' +
        '<ellipse cx="54.4" cy="19.6" rx="1.4" ry="2.2" fill="' + SK + '"/><ellipse cx="69.6" cy="19.6" rx="1.4" ry="2.2" fill="' + SK + '"/>' +
        '<ellipse cx="62" cy="19.4" rx="7.6" ry="9" fill="' + SK + '"/>' +
        '<path d="M54.8 20.6 Q55.2 29.4 62 29.6 Q68.8 29.4 69.2 20.6 Q68 26.2 62 26.6 Q56 26.2 54.8 20.6 Z" fill="#24160B"/>' +
        '<path d="M58.8 23.4 Q62 22 65.2 23.4 Q62 24.2 58.8 23.4 Z" fill="#24160B"/><path d="M59.8 24.8 Q62 26.4 64.2 24.8" stroke="#F4EFE4" stroke-width=".7" fill="none"/>' +
        '<ellipse cx="58.9" cy="18.4" rx="1.7" ry="1.15" fill="#F6F1E4"/><ellipse cx="65.1" cy="18.4" rx="1.7" ry="1.15" fill="#F6F1E4"/>' +
        '<circle cx="59.1" cy="18.5" r=".85" fill="#120A04"/><circle cx="64.9" cy="18.5" r=".85" fill="#120A04"/><circle cx="59.4" cy="18.2" r=".25" fill="#fff"/><circle cx="65.2" cy="18.2" r=".25" fill="#fff"/>' +
        '<path d="M57 16.2 Q58.9 15.2 60.6 16 M63.4 16 Q65.1 15.2 67 16.2" stroke="#120A04" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
        '<path d="M62 19 Q61 21.6 61.2 22 Q62 22.4 62.9 22" stroke="#3E2410" stroke-width=".5" fill="none"/>' +
        '<path d="M54.2 13.6 Q54.2 4.4 62 4.2 Q69.8 4.4 69.8 13.6 Z" fill="#F4EFE4"/><path d="M54.2 13.4 H69.8" stroke="#D9CFB8" stroke-width="1.2"/>' +
        '<path d="M55 11 H69 M55.8 8.2 H68.2" stroke="#2E7D32" stroke-width=".7" stroke-dasharray="1.2 .8"/><path d="M57.4 6 H66.6" stroke="#C62828" stroke-width=".6" stroke-dasharray="1 .8"/></g>' +
    '</g>' +
    '<g class="homa">' +
      '<path d="M54 38 Q46 46 42 52 M70 38 Q60 50 48 56" stroke="' + SK + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 62 L14 24" stroke="#7A5530" stroke-width="2.2" stroke-linecap="round"/>' +
      '<g class="hoop"><path d="M14 22 Q-8 26 -5 46 Q10 60 26 40 Z" fill="#FFFDF4" opacity=".45"/>' +
        '<path d="M4 28 L18 50 M-3 38 L10 56 M10 24 L24 42 M-4 48 L14 26 M4 56 L22 34" stroke="#5A3A1E" stroke-width=".7" opacity=".6"/>' +
        '<path d="M14 22 Q-8 26 -5 46 Q10 60 26 40" fill="none" stroke="#5E3A1C" stroke-width="2.6" stroke-linecap="round"/></g>' +
      '<circle cx="42" cy="52" r="2.8" fill="' + SK + '"/><circle cx="48" cy="56" r="2.8" fill="' + SK + '"/>' +
    '</g>' +
    '<g class="gourd"><ellipse cx="88" cy="72.6" rx="6.4" ry="5" fill="#E2B04A"/><ellipse cx="86.4" cy="70.4" rx="2.6" ry="1.4" fill="#F6D98A" opacity=".8"/><rect x="81" y="74" width="14" height="4" fill="#1D7EA6" opacity=".35"/></g>' +
    '<path class="ripple" d="M38 74 Q63 70 96 74" stroke="#E9FBFF" stroke-width="1.2" fill="none" opacity=".8"/></svg>';
}

/* the woven basket (kwando) on its calabash float: six fish can lie in it, shown one by one as they land */
export function basket(): string {
  let weave = '';
  for (let i = 0; i < 9; i++) weave += '<path d="M' + (14 + i * 9) + ' 30 Q' + (12 + i * 9) + ' 46 ' + (20 + i * 7) + ' 62" stroke="#8A5A26" stroke-width="1.4" fill="none" opacity=".7"/>';
  for (let j = 0; j < 4; j++) weave += '<path d="M' + (12 + j * 2) + ' ' + (36 + j * 7) + ' Q50 ' + (40 + j * 7) + ' ' + (88 - j * 2) + ' ' + (36 + j * 7) + '" stroke="#F0D29A" stroke-width="1.2" fill="none" opacity=".55"/>';
  const fish = [[28, 20, -30], [48, 15, -8], [68, 19, 18], [36, 24, -50], [58, 23, 40], [74, 24, 60]].map((p, i) =>
    '<g class="bf b' + (i + 1) + '" transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')"><g transform="scale(1.6)"><path d="M-7 0 Q-2 -4 5 -1 L10 -4 L9 0 L10 4 L5 1 Q-2 4 -7 0 Z" fill="#E4EEDD" stroke="#2E4229" stroke-width=".7"/><path d="M-3 -2 Q0 -3 3 -1.6" stroke="#fff" stroke-width=".5" fill="none" opacity=".7"/><circle cx="-4.4" cy="-.6" r=".9" fill="#121212"/></g></g>').join('');
  return '<svg class="kwando" viewBox="0 0 100 80" aria-hidden="true">' +
    '<ellipse cx="50" cy="66" rx="44" ry="7" fill="#E2B04A"/><ellipse cx="50" cy="63" rx="40" ry="4.4" fill="#F6D98A" opacity=".6"/>' +
    fish +
    '<path d="M8 30 Q10 64 50 66 Q90 64 92 30 Z" fill="#C88A44"/>' + weave +
    '<ellipse cx="50" cy="30" rx="42" ry="5.6" fill="none" stroke="#9A6430" stroke-width="3"/>' +
    '<rect x="0" y="67" width="100" height="13" fill="#1D7EA6" opacity=".45"/>' +
    '<g class="rip"><ellipse cx="50" cy="68" rx="48" ry="3" fill="none" stroke="#E9FBFF" stroke-width="1" opacity=".8"/></g></svg>';
}

/* A smaller tilapia carrying a bigger tag (Sani 2026-10-25: "the fish can be smaller, the images bigger"): the photo
   fills the tag edge to edge, the body is the old tilapia at .6 size, and two bubbles rise from its mouth. Same classes
   as fish3 (tagg, ftail, pfin) so the tail beat and the tag sway carry over. viewBox -124..138 × 0..110; the body is
   x 14..136, y 26..86. */
export function fish4(photo: string, bodyOnly = false): string {
  let bars = ''; for (let i = 0; i < 6; i++) bars += '<rect x="' + (78 + i * 18) + '" y="0" width="8" height="110" fill="#22341E" opacity=".13"/>';
  const body = '<g transform="translate(14 56) scale(.6) translate(-14 -56)">' +
    '<g class="ftail"><path d="M60 55 L14 22 Q24 55 14 88 Z" fill="url(#kb-tail)"/><path d="M58 55 L20 28 M58 55 L18 42 M58 55 L17 55 M58 55 L18 68 M58 55 L20 82" stroke="#4F6646" stroke-width=".8" opacity=".6"/></g>' +
    '<path d="M92 24 C110 6 150 4 176 26 L160 30 C140 22 112 22 96 30 Z" fill="url(#kb-fin)"/>' +
    '<path d="M98 26 L104 10 M110 24 L116 7 M122 22 L128 6 M134 22 L140 7 M146 23 L152 9 M158 25 L164 14" stroke="#3F5A3A" stroke-width="1" opacity=".55"/>' +
    '<path d="M110 84 C122 102 146 102 158 86 Z" fill="url(#kb-fin)"/>' +
    '<path d="M58 55 C72 18 150 10 198 44 C210 52 210 60 198 67 C150 100 72 92 58 55 Z" fill="url(#kb-fish)"/>' +
    '<g clip-path="url(#kb-body)">' + bars + '<rect x="50" y="0" width="160" height="110" fill="url(#kb-scales)"/>' +
      '<path d="M64 62 C100 70 160 70 204 58" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/><ellipse cx="128" cy="34" rx="46" ry="8" fill="#fff" opacity=".22"/></g>' +
    '<path d="M170 32 C160 48 160 66 172 80" fill="none" stroke="#2E4229" stroke-width="2" opacity=".55"/>' +
    '<g class="pfin"><path d="M160 64 C150 70 140 80 136 90 C150 86 160 78 166 70 Z" fill="url(#kb-fin)" opacity=".9"/></g>' +
    '<path d="M200 60 Q206 62 202 64" stroke="#2E2A1E" stroke-width="1.6" fill="none"/>' +
    '<circle cx="186" cy="47" r="7.5" fill="#F6F4E8"/><circle cx="186" cy="47" r="5.6" fill="url(#kb-eye)"/><circle cx="187" cy="47" r="2.8" fill="#121212"/><circle cx="184.5" cy="44.6" r="1.4" fill="#fff"/></g>';
  if (bodyOnly) return '<svg viewBox="12 26 126 60" class="art">' + body + '</svg>';
  return '<svg viewBox="-124 0 262 110" class="art fish3svg">' +
    '<g class="tagg"><path d="M14 56 C2 60 -10 50 -24 52" fill="none" stroke="#F4EBD0" stroke-width="1.6"/>' +
      '<g transform="rotate(-5 -73 55)"><rect x="-122" y="4" width="98" height="102" rx="10" fill="url(#kb-tag)"/>' +
      '<image href="' + photo + '" x="-122" y="4" width="98" height="102" preserveAspectRatio="xMidYMid slice" clip-path="inset(0 round 10px)"/>' +
      '<rect x="-122" y="4" width="98" height="102" rx="10" fill="none" stroke="#C9B88F" stroke-width="1.4"/>' +
      '<circle cx="-30" cy="52" r="3" fill="#fff" stroke="#C9B88F"/></g></g>' +
    body + '<g class="fbub"><circle cx="134" cy="52" r="2.4"/><circle cx="137" cy="48" r="1.5"/></g></svg>';
}
