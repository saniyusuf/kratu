// @ts-nocheck
/*
 * A painted place for every Arewa game (Sani 2026-10-16: "the game's own background, not the current one"). Same
 * hand as the other scenes: 160×100, sliced to fill any screen, flat shapes with soft gradients, a few slow moving
 * things (bunting, smoke, a lamp's glow, the river) by transform and opacity. Ground sits at y≈70–76 so the drawn
 * people and animals stand on it.
 */
const head = '<svg class="scene" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">';
const lg = (id, ...c) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const rg = (id, a, b) => '<radialGradient id="' + id + '" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '" stop-opacity="0"/></radialGradient>';
const cloud = (x, y, s) => '<g class="drift4" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fff" opacity=".85"><ellipse rx="12" ry="3"/><ellipse cx="7" cy="-1.6" rx="7" ry="3.4"/><ellipse cx="-5" cy="-1" rx="5" ry="2.6"/></g>';
const stars = (n, h) => { let s = '<g class="twinkle">'; for (let i = 0; i < n; i++) s += '<circle cx="' + ((i * 37.7) % 160).toFixed(1) + '" cy="' + ((i * 13.3) % h).toFixed(1) + '" r="' + (i % 3 ? .35 : .6) + '" fill="#fff"/>'; return s + '</g>'; };
const neem = (x, y, s, c = '#3E6B2E', c2 = '#5A8A3C') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-1.4 0 Q-2 -10 -1 -18 L1 -18 Q2 -10 1.4 0 Z" fill="#5A3A1E"/><path d="M0 -14 L-6 -20 M0 -12 L6 -19" stroke="#5A3A1E" stroke-width="1.2"/>' +
  '<ellipse cx="0" cy="-24" rx="14" ry="9" fill="' + c + '"/><ellipse cx="-7" cy="-20" rx="8" ry="6" fill="' + c + '"/><ellipse cx="7" cy="-21" rx="8" ry="6" fill="' + c + '"/><ellipse cx="-3" cy="-27" rx="8" ry="5" fill="' + c2 + '"/><ellipse cx="5" cy="-25" rx="6" ry="4" fill="' + c2 + '"/></g>';
const dum = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-.8 0 L-.5 -16 L.5 -16 L.8 0 Z" fill="#6B4A2A"/><path d="M0 -16 L-6 -19 M0 -16 L6 -19 M0 -16 L-4 -22 M0 -16 L4 -22 M0 -16 L0 -23" stroke="#4F7A3A" stroke-width="1.6" stroke-linecap="round"/></g>';
/* Hausa building: red-earth wall with zanko horns on the parapet and white relief */
const zanko = (x0, x1, y) => { let s = ''; for (let x = x0; x <= x1; x += 8) s += '<path d="M' + x + ' ' + y + ' l1.4 -4 l1.4 4 Z"/>'; return s; };
const relief = (x, y) => '<g fill="none" stroke="#FFF1D6" stroke-width=".6" opacity=".8"><path d="M' + (x - 5) + ' ' + y + ' q5 -5 10 0 q-5 5 -10 0 Z"/><circle cx="' + x + '" cy="' + y + '" r="1.2"/><path d="M' + (x - 7) + ' ' + (y + 5) + ' l3.5 -2 l3.5 2 l3.5 -2 l3.5 2"/></g>';
const people = (y, n, dark) => { let s = '<g class="far" opacity="' + (dark ? .55 : .8) + '">'; const c = dark ? ['#2A2240', '#33294A', '#241D38'] : ['#2F6B9A', '#AD1457', '#E9D9A6', '#2E7D32', '#6A4C93', '#EF6C00'];
  for (let i = 0; i < n; i++) { const x = 4 + i * (152 / n) + (i % 2) * 2; s += '<g transform="translate(' + x.toFixed(1) + ' ' + y + ')"><path d="M-2.4 0 L-1.6 -6 L1.6 -6 L2.4 0 Z" fill="' + c[i % c.length] + '"/><circle cy="-7.4" r="1.5" fill="' + (dark ? '#1A1428' : '#6B4422') + '"/></g>'; } return s + '</g>'; };

export const SCENES4: Record<string, string> = {
  /* Hawan Sallah: the emir's palace gate on Sallah day, bunting across the square */
  palace: head + '<defs>' + lg('p4-sky', '#7EC8EC', '#CDE9F2', '#F6E7C4') + lg('p4-wall', '#C8693A', '#A9522B') + lg('p4-ground', '#E3C48C', '#C99E62') + '</defs>' +
    '<rect width="160" height="100" fill="url(#p4-sky)"/>' + cloud(26, 12, .8) + cloud(128, 9, .7) +
    '<path d="M18 70 V30 H142 V70 Z" fill="url(#p4-wall)"/><g fill="#A9522B">' + zanko(18, 140, 30) + '</g>' +
    '<path d="M6 70 V24 H30 V70 Z M130 70 V24 H154 V70 Z" fill="#B85C30"/><g fill="#B85C30">' + zanko(6, 28, 24) + zanko(130, 152, 24) + '</g>' +
    '<path d="M62 70 V46 Q80 26 98 46 V70 Z" fill="#3A1E0C"/><path d="M58 70 V45 Q80 21 102 45 V70" fill="none" stroke="#FFF1D6" stroke-width="1.6"/>' +
    '<path d="M54 70 V44 Q80 16 106 44 V70" fill="none" stroke="#2E7D32" stroke-width="1.2"/>' + relief(40, 44) + relief(120, 44) + relief(18, 38) + relief(142, 38) +
    '<g class="bunting"><path d="M0 18 Q80 32 160 18" fill="none" stroke="#5A3A1E" stroke-width=".5"/>' +
    [8, 20, 32, 44, 56, 68, 80, 92, 104, 116, 128, 140, 152].map((x, i) => '<path d="M' + x + ' ' + (18 + Math.sin(x / 160 * Math.PI) * 13.5).toFixed(1) + ' l2.6 5 l2.6 -5 Z" fill="' + ['#C62828', '#2E7D32', '#FFD54A'][i % 3] + '"/>').join('') + '</g>' +
    '<path d="M0 70 H160 V100 H0 Z" fill="url(#p4-ground)"/>' + people(74, 20, false) +
    '<g fill="#B98A50" opacity=".45"><ellipse cx="40" cy="90" rx="18" ry="1.6"/><ellipse cx="124" cy="86" rx="14" ry="1.2"/></g></svg>',

  /* Dillalin kasuwa: Kasuwar Kurmi, zinc roofs, hanging cloth, the old arch behind */
  kurmi: head + '<defs>' + lg('k4-sky', '#A7D8EE', '#F2E6CC') + lg('k4-zinc', '#B8C0C8', '#7E8893') + lg('k4-g', '#D9B57E', '#B4844A') + '</defs>' +
    '<rect width="160" height="100" fill="url(#k4-sky)"/>' + cloud(110, 10, .7) +
    '<path d="M50 52 V24 H110 V52 Z" fill="#C98E52"/><g fill="#C98E52">' + zanko(50, 108, 24) + '</g><path d="M70 52 V38 Q80 28 90 38 V52 Z" fill="#5A3416"/>' + relief(60, 32) + relief(100, 32) +
    [[2, 42], [42, 46], [82, 44], [122, 42]].map(([x, y]) => '<path d="M' + x + ' ' + y + ' L' + (x + 38) + ' ' + (y - 4) + ' L' + (x + 38) + ' ' + (y + 1) + ' L' + x + ' ' + (y + 5) + ' Z" fill="url(#k4-zinc)"/>' +
      '<path d="M' + (x + 3) + ' ' + (y + 4) + ' V72 M' + (x + 35) + ' ' + y + ' V72" stroke="#5E3A1C" stroke-width="1.2"/>' +
      '<g class="cloths"><rect x="' + (x + 6) + '" y="' + (y + 4) + '" width="5" height="14" fill="#1565C0"/><rect x="' + (x + 12) + '" y="' + (y + 4) + '" width="5" height="11" fill="#C2185B"/><rect x="' + (x + 18) + '" y="' + (y + 4) + '" width="5" height="16" fill="#FFB300"/><rect x="' + (x + 24) + '" y="' + (y + 4) + '" width="5" height="12" fill="#2E7D32"/></g>' +
      '<rect x="' + (x + 2) + '" y="62" width="34" height="4" fill="#8B5A2B"/><ellipse cx="' + (x + 10) + '" cy="61" rx="5" ry="2.2" fill="#E9A23B"/><ellipse cx="' + (x + 22) + '" cy="61" rx="5" ry="2.2" fill="#F1E2B8"/><ellipse cx="' + (x + 32) + '" cy="61" rx="3" ry="2" fill="#B94A2A"/>').join('') +
    '<path d="M0 72 H160 V100 H0 Z" fill="url(#k4-g)"/>' + people(76, 14, false) + '</svg>',

  /* Mai shayi: a roadside corner at night under a street lamp, a painted wall behind */
  teanight: head + '<defs>' + lg('tn-sky', '#0E1230', '#2A2350') + rg('tn-glow', '#FFE08A', '#FFE08A') + lg('tn-g', '#3A2E4A', '#1E1828') + '</defs>' +
    '<rect width="160" height="100" fill="url(#tn-sky)"/>' + stars(40, 34) + '<circle cx="136" cy="14" r="5" fill="#FFF3C4"/><circle cx="138" cy="12.6" r="4.4" fill="#2A2350"/>' +
    '<path d="M0 72 V40 H96 V72 Z" fill="#4A3A5E"/><g fill="#4A3A5E">' + zanko(0, 94, 40) + '</g><rect x="10" y="46" width="44" height="12" rx="1" fill="#2E7D32"/><text x="32" y="54.4" text-anchor="middle" font-size="5" font-weight="800" fill="#FFD54A" font-family="Baloo 2,sans-serif">MAI SHAYI</text>' +
    '<rect x="66" y="52" width="10" height="20" fill="#241A30"/><rect x="104" y="48" width="40" height="24" fill="#3A2E4A"/><rect x="114" y="54" width="8" height="8" fill="#FFC94A" opacity=".8"/>' +
    '<g class="lamp4"><rect x="150" y="22" width="1.4" height="52" fill="#555"/><path d="M151 22 Q142 20 140 24" stroke="#555" stroke-width="1.2" fill="none"/><path d="M137 24 h6 l-1 2 h-4 Z" fill="#FFE08A"/><ellipse cx="140" cy="60" rx="34" ry="34" fill="url(#tn-glow)" opacity=".35"/></g>' +
    '<path d="M0 72 H160 V100 H0 Z" fill="url(#tn-g)"/><ellipse cx="140" cy="80" rx="30" ry="4" fill="#FFE08A" opacity=".15"/></svg>',

  /* Dalar gyaɗa: Kano's groundnut pyramids in the harmattan haze, lorries waiting */
  pyramids: head + '<defs>' + lg('py-sky', '#E9D6AE', '#F3E6C8') + lg('py-g', '#D8B57C', '#BC9157') + '<pattern id="py-sack" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#D9BC86"/><path d="M0 2.9 H4 M2 0 V3" stroke="#B08E58" stroke-width=".35"/></pattern></defs>' +
    '<rect width="160" height="100" fill="url(#py-sky)"/><circle cx="120" cy="18" r="8" fill="#FFF3D6" opacity=".9"/>' +
    [[20, 62, 22, .7], [58, 62, 30, 1], [106, 62, 26, .85], [140, 62, 18, .6]].map(([x, y, w, o]) => '<path d="M' + (x - w) + ' ' + y + ' L' + x + ' ' + (y - w * 1.05) + ' L' + (x + w) + ' ' + y + ' Z" fill="url(#py-sack)" opacity="' + o + '"/><path d="M' + x + ' ' + (y - w * 1.05) + ' L' + (x + w) + ' ' + y + ' L' + (x + w * .45) + ' ' + y + ' Z" fill="#8B6A3A" opacity=".25"/>').join('') +
    '<g opacity=".7"><rect x="4" y="56" width="14" height="6" fill="#2E7D32"/><rect x="18" y="57" width="5" height="5" fill="#C62828"/><circle cx="8" cy="63" r="1.5" fill="#222"/><circle cx="20" cy="63" r="1.5" fill="#222"/></g>' +
    '<path d="M0 62 H160 V100 H0 Z" fill="url(#py-g)"/><g fill="#C9A06A" opacity=".6"><ellipse cx="30" cy="80" rx="20" ry="1.6"/><ellipse cx="120" cy="88" rx="24" ry="2"/></g>' +
    /* the porters build the pyramid (Sani 2026-10-23): each carries a jute sack across the back of his neck, bent
       forward, both hands up holding its ears; he walks to the pyramid on the right (the lorry hides the big one), climbs its face, sets the sack down near the
       top, turns and comes back down for the next. The sack he sets down (.psk) stays on the pyramid until his next one. */
    [[0, 44, '#2F6B9A', '#F4EBD0', 99, 42.3], [-11, 44, '#B23A2A', '#E9D9A6', 95.5, 46], [-22, 44, '#2E7D32', '#F4EBD0', 97.5, 43.9], [-33, 44, '#6A4C93', '#FFFFFF', 93.5, 48.1]].map(([d, dur, c, cap, px, py], i) =>
      '<g class="psk" style="animation-duration:' + dur + 's;animation-delay:' + d + 's"><g transform="translate(' + (px + 1.2) + ' ' + (py - 1.6) + ') rotate(-46)">' +
      '<rect x="-2.6" y="-1" width="5.2" height="2" rx="1" fill="#D2B072"/><path d="M-2 0 H2" stroke="#9A7A42" stroke-width=".25"/></g></g>' +
      '<g class="porter climb" style="--dur:' + dur + 's;--d:' + d + 's;--px:' + px + 'px;--py:' + py + 'px"><g class="pbob">' +
      '<path class="pl1" d="M0 0 l-1.4 6" stroke="#3A2410" stroke-width="1.3" stroke-linecap="round"/><path class="pl2" d="M.8 0 l1.4 6" stroke="#3A2410" stroke-width="1.3" stroke-linecap="round"/>' +
      '<path d="M-2.4 .4 L-1 -8 L2.6 -8.4 L3 .4 Z" fill="' + c + '"/><path d="M-1.6 -3 h4.4" stroke="rgba(0,0,0,.15)" stroke-width=".5"/>' +
      // the sack across the back of the neck, its two ears held up by the hands
      '<g class="psack"><path d="M-6 -10.4 Q-6.4 -13 -4 -13.2 L5.6 -12.6 Q7.6 -12.2 7 -9.8 Q6.6 -8.6 4.8 -8.8 L-4.2 -9.2 Q-5.8 -9.2 -6 -10.4 Z" fill="#D2B072"/>' +
      '<path d="M-5.4 -11.4 L6.6 -10.8" stroke="#9A7A42" stroke-width=".35" stroke-dasharray=".8 .6"/><path d="M-6 -12 l-1 -1.4 M7 -11.6 l1.2 -1.2" stroke="#B89656" stroke-width=".8" stroke-linecap="round"/></g>' +
      '<path class="parm" d="M-.6 -7.6 L-4.6 -11.4 M2.2 -7.8 L5.8 -11" stroke="' + c + '" stroke-width="1.1" stroke-linecap="round"/>' +
      '<circle cx="3.6" cy="-8.6" r="1.5" fill="#5E3A1C"/><path d="M2.4 -9.4 q1.2 -1.6 2.6 -.2 Z" fill="' + cap + '"/></g></g>').join('') +
    '<rect width="160" height="100" fill="#F3E6C8" opacity=".12"/></svg>',

  /* Kasuwar shanu (Sani 2026-10-23): a cattle market in the morning haze. Lorries parked under a big baobab, mat
     shelters with traders, herds coming in on the far side, a rail fence, hay and a water trough, egrets about the
     cattle's feet and dust drifting over the yard. */
  cattle: head + '<defs>' + lg('ca-sky', '#A9D6EC', '#E8E2CC', '#F3D9A8') + lg('ca-g', '#D9B57C', '#C49A5E', '#AE8248') + rg('ca-sun', '#FFF3C4', '#FFF3C4') + rg('ca-dust', '#F1DDB2', '#F1DDB2') + '</defs>' +
    '<rect width="160" height="100" fill="url(#ca-sky)"/><circle cx="124" cy="20" r="7" fill="#FFF6D6"/><circle cx="124" cy="20" r="22" fill="url(#ca-sun)" opacity=".6"/>' + cloud(34, 13, .8) + cloud(86, 9, .55) +
    // far hills and the herds coming in along them
    '<path d="M0 54 Q24 46 52 51 T104 48 T160 50 V62 H0 Z" fill="#B8A57E" opacity=".55"/>' +
    '<g class="farherd" opacity=".6">' + [0, 5, 9, 14, 18, 23, 27].map((x, i) => '<g transform="translate(' + (6 + x) + ' 57)"><ellipse cx="0" cy="-1.6" rx="2.4" ry="1.3" fill="' + ['#8E3E1A', '#EDE6D8', '#6B2C14', '#EDE6D8', '#9C4420', '#EDE6D8', '#7A3416'][i] + '"/><path d="M-1.6 -.6 v2 M1.6 -.6 v2" stroke="#4E2E14" stroke-width=".45"/></g>').join('') + '</g>' +
    // the baobab, and lorries parked in its shade
    '<g transform="translate(140 62)"><path d="M-5 0 Q-6 -14 -4 -22 L4 -22 Q6 -14 5 0 Z" fill="#8A6A4A"/><path d="M-3 -21 Q-10 -26 -14 -32 M3 -21 Q10 -27 15 -31 M0 -22 Q0 -30 2 -35" stroke="#8A6A4A" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="-12" cy="-34" rx="8" ry="4" fill="#6E8A44"/><ellipse cx="14" cy="-33" rx="9" ry="4" fill="#6E8A44"/><ellipse cx="2" cy="-37" rx="8" ry="4" fill="#7E9A50"/></g>' +
    [[96, '#2E6DA4'], [114, '#C62828']].map(([x, c]) => '<g transform="translate(' + x + ' 62)"><rect x="-1" y="-9" width="6" height="7" rx="1" fill="' + c + '"/><rect x="5" y="-8" width="11" height="6" fill="#8B5A2B"/><path d="M5 -8 h11" stroke="#5E3A1C" stroke-width=".6"/><rect x=".2" y="-8" width="3.4" height="2.6" fill="#BFE3F2"/>' +
      '<circle cx="2" cy="-1.6" r="1.6" fill="#222"/><circle cx="12" cy="-1.6" r="1.6" fill="#222"/></g>').join('') +
    // mat shelters with traders under them
    [[28, 1], [58, .9]].map(([x, sc]) => '<g transform="translate(' + x + ' 64) scale(' + sc + ')"><path d="M-12 -12 L12 -12 L14 -9 L-14 -9 Z" fill="#C9A15E"/><path d="M-12 -12 L12 -12" stroke="#8B6A2E" stroke-width=".6"/><path d="M-11 -9 V0 M11 -9 V0" stroke="#6B4A2A" stroke-width="1"/>' +
      '<g transform="translate(-5 0)"><path d="M-2 0 L-1.4 -5 L1.4 -5 L2 0 Z" fill="#2F6B9A"/><circle cy="-6.4" r="1.3" fill="#6E4426"/><path d="M-1.3 -7 q1.3 -1.6 2.6 0 Z" fill="#F4EBD0"/></g>' +
      '<g transform="translate(4 0)"><path d="M-2 0 L-1.4 -5 L1.4 -5 L2 0 Z" fill="#EDE6D8"/><circle cy="-6.4" r="1.3" fill="#5E3A1C"/><path d="M-2.6 -6.8 L0 -9.4 L2.6 -6.8 Z" fill="#D9B464"/></g></g>').join('') +
    // the yard: rail fence, hay, a water trough
    '<path d="M0 64 H160 V100 H0 Z" fill="url(#ca-g)"/>' +
    '<g stroke="#7A4A22" stroke-width="1.2" stroke-linecap="round"><path d="M0 67.5 H160 M0 71 H160"/>' + [4, 22, 40, 58, 76, 94, 112, 130, 148].map((x) => '<path d="M' + x + ' 65 V73"/>').join('') + '</g>' +
    '<g fill="#D9BE6A"><path d="M10 76 Q16 70 24 76 Z"/><path d="M134 78 Q141 71 150 78 Z"/></g><g stroke="#B89A44" stroke-width=".4"><path d="M13 75 l3 -3 M18 75 l2 -3.4 M137 77 l3 -3 M143 77 l2 -3.6"/></g>' +
    '<g transform="translate(70 78)"><path d="M-8 0 L8 0 L7 3 L-7 3 Z" fill="#7C858F"/><ellipse cx="0" cy="0" rx="8" ry="1.2" fill="#8FC3D6"/></g>' +
    // hoof-scuffed ground and drifting dust
    '<g fill="#B88E54" opacity=".35"><ellipse cx="30" cy="88" rx="10" ry="1"/><ellipse cx="96" cy="92" rx="14" ry="1.2"/><ellipse cx="140" cy="86" rx="8" ry=".9"/><ellipse cx="60" cy="96" rx="12" ry="1"/></g>' +
    '<g class="dust4"><ellipse cx="40" cy="78" rx="26" ry="5" fill="url(#ca-dust)" opacity=".7"/><ellipse cx="118" cy="82" rx="30" ry="6" fill="url(#ca-dust)" opacity=".6"/></g></svg>',

  /* Ƙirgen shanu: a Fulani camp at dusk, grass huts and calabashes on their stand */
  camp: head + '<defs>' + lg('cp-sky', '#5B3A7A', '#E0714A', '#F6C177') + lg('cp-g', '#B98A50', '#8E6234') + rg('cp-sun', '#FFD27A', '#FFD27A') + '</defs>' +
    '<rect width="160" height="100" fill="url(#cp-sky)"/><circle cx="80" cy="58" r="12" fill="#FFC46A"/><circle cx="80" cy="58" r="30" fill="url(#cp-sun)" opacity=".5"/>' +
    '<path d="M0 60 Q50 54 100 58 T160 56 V66 H0 Z" fill="#6B4A3A" opacity=".55"/>' +
    [[14, 1.3], [36, 1], [138, 1.2]].map(([x, s]) => '<g transform="translate(' + x + ' 66) scale(' + s + ')"><path d="M-9 0 Q-9 -12 0 -13 Q9 -12 9 0 Z" fill="#C9A15E"/><path d="M-9 0 Q-9 -12 0 -13 Q9 -12 9 0" fill="none" stroke="#8B6A2E" stroke-width=".6"/>' +
      '<path d="M-6 -3 Q0 -6 6 -3 M-7 -7 Q0 -10 7 -7" stroke="#8B6A2E" stroke-width=".5" fill="none"/><path d="M-2 0 V-5 a2 2 0 0 1 4 0 V0 Z" fill="#3A2412"/></g>').join('') +
    '<g transform="translate(118 66)"><path d="M-6 0 V-10 M6 0 V-10 M-7 -10 H7" stroke="#5E3A1C" stroke-width="1"/><circle cx="-3" cy="-12" r="2.6" fill="#E9A23B"/><circle cx="2.4" cy="-12.4" r="2.2" fill="#C98E52"/><circle cx="-.4" cy="-15.6" r="1.8" fill="#F1C27D"/></g>' +
    '<path d="M0 66 H160 V100 H0 Z" fill="url(#cp-g)"/><g class="smoke4"><circle cx="40" cy="58" r="2" fill="#bbb" opacity=".4"/><circle cx="42" cy="52" r="3" fill="#bbb" opacity=".3"/></g></svg>',

  /* Mai suya: the suya spot at night, a string of bulbs, the smoke rising past the wall */
  suyanight: head + '<defs>' + lg('sn-sky', '#120E2A', '#3A2240') + lg('sn-g', '#2E2230', '#18121C') + rg('sn-b', '#FFE08A', '#FFE08A') + '</defs>' +
    '<rect width="160" height="100" fill="url(#sn-sky)"/>' + stars(36, 30) +
    '<path d="M0 72 V38 H160 V72 Z" fill="#3E2A3E"/><g fill="#3E2A3E">' + zanko(0, 158, 38) + '</g>' +
    '<rect x="104" y="44" width="46" height="12" rx="1" fill="#B71C1C"/><text x="127" y="52.4" text-anchor="middle" font-size="5" font-weight="800" fill="#FFD54A" font-family="Baloo 2,sans-serif">SUYA SPOT</text>' +
    '<rect x="12" y="50" width="12" height="22" fill="#1E141E"/><rect x="34" y="50" width="10" height="8" fill="#FFC94A" opacity=".7"/>' +
    '<g class="bulbs"><path d="M0 26 Q40 34 80 28 T160 30" fill="none" stroke="#222" stroke-width=".4"/>' + [10, 26, 42, 58, 74, 90, 106, 122, 138, 154].map((x, i) => '<circle cx="' + x + '" cy="' + (29 + Math.sin(i) * 2.2).toFixed(1) + '" r="1.2" fill="#FFE08A"/><circle cx="' + x + '" cy="' + (29 + Math.sin(i) * 2.2).toFixed(1) + '" r="4" fill="url(#sn-b)" opacity=".5"/>').join('') + '</g>' +
    '<path d="M0 72 H160 V100 H0 Z" fill="url(#sn-g)"/><ellipse cx="80" cy="80" rx="50" ry="5" fill="#FF8A3D" opacity=".12"/></svg>',

  /* Allo: the Islamiyya under a big neem tree, the mosque's minaret beyond, mats and boards */
  islamiyya: head + '<defs>' + lg('is-sky', '#9ED3EC', '#F3E8CE') + lg('is-g', '#E1C18A', '#C69C62') + lg('is-m', '#E8C08A', '#C98E52') + '</defs>' +
    '<rect width="160" height="100" fill="url(#is-sky)"/>' + cloud(96, 12, .7) +
    '<path d="M100 66 V40 H140 V66 Z" fill="url(#is-m)"/><g fill="#C98E52">' + zanko(100, 138, 40) + '</g><path d="M112 40 V24 H122 V40 Z" fill="url(#is-m)"/><path d="M110 24 L117 14 L124 24 Z" fill="#C98E52"/><circle cx="117" cy="12" r="1.4" fill="#2E7D32"/>' +
    '<path d="M114 66 V54 a6 6 0 0 1 12 0 V66 Z" fill="#4A2A12"/>' + relief(106, 48) + relief(134, 48) +
    neem(30, 70, 2.4, '#3A6B2A', '#56883A') +
    '<path d="M0 66 H160 V100 H0 Z" fill="url(#is-g)"/><ellipse cx="34" cy="74" rx="40" ry="6" fill="#3A2412" opacity=".18"/>' +
    '<g><path d="M8 80 L62 80 L58 90 L4 90 Z" fill="#B23A2A"/><path d="M8 80 L62 80 L58 90 L4 90 Z" fill="none" stroke="#FFD54A" stroke-width=".6" stroke-dasharray="2 1.4"/></g>' +
    '<g opacity=".9">' + [[72, -10], [82, 6]].map(([x, r]) => '<g transform="translate(' + x + ' 78) rotate(' + r + ')"><rect x="-4" y="-12" width="8" height="11" rx="2" fill="#4A2E14"/><rect x="-1" y="-1" width="2" height="3" fill="#3A220E"/><path d="M-2.4 -9 h4.8 M-2.4 -6.6 h4.8 M-2.4 -4.2 h3.4" stroke="#F5EEDC" stroke-width=".4"/></g>').join('') + '</g></svg>',

  /* Jirgin ruwa: the river crossing, a wooden landing on this side, the far bank with its own canoes */
  crossing: head + '<defs>' + lg('cr-sky', '#8CCDEB', '#EAF2E4') + lg('cr-w', '#4FA9D6', '#2A7FB3', '#1F6A9A') + lg('cr-s', '#E6CD95', '#CBA766') + '</defs>' +
    '<rect width="160" height="100" fill="url(#cr-sky)"/>' + cloud(40, 12, .8) + cloud(126, 10, .6) +
    '<path d="M0 46 Q40 40 80 44 T160 42 V52 H0 Z" fill="#7FA05A"/>' + dum(18, 46, 1) + dum(26, 47, .8) + neem(120, 46, .9, '#4F6B35', '#6A8A44') +
    '<g opacity=".8"><path d="M60 50 h18 l-2 2 h-14 Z" fill="#6B4422"/><path d="M96 51 h14 l-2 2 h-10 Z" fill="#6B4422"/></g>' +
    '<path d="M0 50 H160 V100 H0 Z" fill="url(#cr-w)"/><g class="ripples4" stroke="#BDE3F2" stroke-width=".5" fill="none" opacity=".7"><path d="M10 60 q4 -1.4 8 0 M40 66 q4 -1.4 8 0 M90 58 q4 -1.4 8 0 M130 70 q4 -1.4 8 0 M64 76 q4 -1.4 8 0 M112 84 q4 -1.4 8 0"/></g>' +
    '<path d="M0 82 Q20 76 44 80 L52 100 H0 Z" fill="url(#cr-s)"/><path d="M118 100 Q130 84 160 82 V100 Z" fill="url(#cr-s)"/>' +
    '<g stroke="#4F7A3A" stroke-width=".8"><path d="M4 84 l-1 -8 M7 84 l1 -9 M150 86 l-1 -8 M154 86 l1 -9"/></g></svg>',

  /* Marubucin wasiƙa: the front of the post office, its sign, a red pillar box, a neem tree */
  /* Marubucin wasiƙa (Sani 2026-10-23): a northern street outside the post office in the morning. Red-earth Hausa
     houses with zanko horns and white relief either side, a minaret beyond, the green post office with its sign, a red
     post box, a neem tree, electricity poles with birds on the wire, a mai ruwa's cart of yellow jerrycans, parked
     motorbikes, a goat. People walk by (a woman with a calabash on her head, a man in a kaftan, a boy rolling a tyre). */
  postoffice: head + '<defs>' + lg('po-sky', '#8ECDEB', '#D9EEF2', '#F3E6C6') + lg('po-w', '#F3E6C6', '#DCC79C') + lg('po-g', '#DDBA82', '#C69C62', '#B08550') +
    lg('po-red', '#C8693A', '#A9522B') + lg('po-red2', '#B85C30', '#96461F') + '</defs>' +
    '<rect width="160" height="100" fill="url(#po-sky)"/>' + cloud(28, 10, .7) + cloud(132, 13, .85) +
    // the minaret and domes far off
    '<g fill="#E8DCC0" opacity=".8"><path d="M118 52 V20 l2 -4 l2 4 V52 Z"/><ellipse cx="120" cy="20" rx="2.6" ry="1.4"/><path d="M104 52 Q110 40 116 52 Z M124 52 Q131 38 138 52 Z"/></g>' +
    // Hausa houses on either side, red earth, zanko horns, white relief
    '<path d="M0 70 V34 H22 V70 Z" fill="url(#po-red)"/><g fill="url(#po-red)">' + zanko(0, 20, 34) + '</g>' + relief(11, 46) +
    '<path d="M4 70 V58 a4 4 0 0 1 8 0 V70 Z" fill="#3A1E0C"/>' +
    '<path d="M138 70 V36 H160 V70 Z" fill="url(#po-red2)"/><g fill="url(#po-red2)">' + zanko(138, 158, 36) + '</g>' + relief(149, 48) +
    '<rect x="144" y="56" width="7" height="6" fill="#2A1A10"/><path d="M144 56 h7 M147.5 56 v6" stroke="#E8D3A8" stroke-width=".5"/>' +
    // the post office
    '<path d="M24 70 V30 H136 V70 Z" fill="url(#po-w)"/><rect x="22" y="26" width="116" height="6" fill="#2E7D32"/><path d="M22 32 h116" stroke="#1B5E20" stroke-width=".8"/>' +
    '<rect x="38" y="34" width="84" height="10" rx="1" fill="#2E7D32"/><text x="80" y="41.4" text-anchor="middle" font-size="5" font-weight="800" fill="#fff" font-family="Baloo 2,sans-serif">GIDAN WAYA · POST OFFICE</text>' +
    [32, 54, 96, 118].map((x) => '<rect x="' + x + '" y="48" width="11" height="10" fill="#7FB8D9"/><rect x="' + x + '" y="48" width="11" height="3" fill="#fff" opacity=".35"/><path d="M' + (x + 5.5) + ' 48 v10 M' + x + ' 53 h11" stroke="#DCC79C" stroke-width=".6"/><path d="M' + (x - 1) + ' 58.4 h13" stroke="#CDB98E" stroke-width="1"/>').join('') +
    '<path d="M72 70 V50 H88 V70 Z" fill="#5A3416"/><path d="M80 50 V70" stroke="#3E2410" stroke-width=".5"/><path d="M68 70 h24 v2 h-24 Z M66 72 h28 v2 h-28 Z" fill="#C9B48A"/>' +
    '<path d="M60 30 V22 M60 22 h6 v4 h-6" stroke="#555" stroke-width=".5" fill="#2E7D32"/>' +
    // electricity poles and the wire, birds sitting on it
    '<path d="M18 70 V16 M142 70 V18" stroke="#6B5A48" stroke-width="1.2"/><path d="M15 18 h6 M139 20 h6" stroke="#6B5A48" stroke-width="1"/>' +
    '<path d="M21 18 Q80 30 139 20" stroke="#3A3A3A" stroke-width=".35" fill="none"/>' +
    '<g fill="#2A2A2A">' + [[52, 23.2], [57, 23.9], [96, 23.7]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="1.1" ry=".8"/><circle cx="' + (x + .9) + '" cy="' + (y - .7) + '" r=".45"/>').join('') + '</g>' +
    // the red post box and the neem tree
    '<g transform="translate(132 76)"><rect x="-3.4" y="-14" width="6.8" height="14" rx="1.4" fill="#C62828"/><ellipse cy="-14" rx="3.8" ry="1.6" fill="#B71C1C"/><rect x="-2" y="-11" width="4" height=".8" fill="#222"/><rect x="-1.6" y="-7" width="3.2" height="2" fill="#FFD54A"/></g>' +
    neem(8, 74, 1.3) +
    // the street
    '<path d="M0 70 H160 V100 H0 Z" fill="url(#po-g)"/><path d="M0 70 H160 V72 H0 Z" fill="#B99560" opacity=".5"/>' +
    '<g fill="#B98A50" opacity=".4"><ellipse cx="40" cy="88" rx="20" ry="1.4"/><ellipse cx="124" cy="93" rx="16" ry="1.2"/><ellipse cx="86" cy="80" rx="10" ry=".8"/></g>' +
    // parked motorbikes by the wall
    [[100, '#1565C0'], [111, '#C62828']].map(([x, c]) => '<g transform="translate(' + x + ' 74)"><circle cx="0" cy="0" r="2.4" fill="#222"/><circle cx="8" cy="0" r="2.4" fill="#222"/><path d="M0 0 L3 -3 L7 -3 L8 0" stroke="' + c + '" stroke-width="1.4" fill="none"/><rect x="2.4" y="-4.6" width="4" height="1.4" rx=".6" fill="#222"/><path d="M7 -3 L8 -6 h1.6" stroke="#444" stroke-width=".7" fill="none"/></g>').join('') +
    // the mai ruwa's cart of jerrycans
    '<g transform="translate(36 76)"><path d="M-8 0 H8 L7 -2 H-7 Z" fill="#6B4A2A"/><circle cx="-4" cy="1" r="2" fill="#333"/><circle cx="4" cy="1" r="2" fill="#333"/><path d="M8 -1 L14 -4" stroke="#6B4A2A" stroke-width=".8"/>' +
    [-6, -2, 2, 6].map((x, i) => '<rect x="' + (x - 1.8) + '" y="-7.4" width="3.6" height="5" rx=".6" fill="' + (i % 2 ? '#F2C230' : '#FFD54A') + '"/>').join('') + '<rect x="-3.8" y="-12" width="3.6" height="5" rx=".6" fill="#F2C230"/><rect x=".2" y="-12" width="3.6" height="5" rx=".6" fill="#FFD54A"/></g>' +
    // a goat nosing about
    '<g class="goat4" transform="translate(146 82)"><ellipse cx="0" cy="-3" rx="3.4" ry="1.8" fill="#EDE6D8"/><path d="M-2.4 -1.6 v3 M2 -1.6 v3" stroke="#8E8678" stroke-width=".6"/><path d="M3 -3.6 l2 -1 l1 1.6 l-1.6 1 Z" fill="#EDE6D8"/><path d="M4.6 -4.6 l.6 -1.4" stroke="#8E8678" stroke-width=".4"/><path d="M-3.2 -3.6 l-1 -1" stroke="#EDE6D8" stroke-width=".6"/></g>' +
    // people walking by: they cross the street slowly (.walker)
    '<g class="walker w1"><g transform="translate(0 78)"><path d="M-2 0 L-1.6 -6 L1.6 -6 L2 0 Z" fill="#AD1457"/><path d="M-2.2 -6 Q0 -9.4 2.2 -6 Z" fill="#880E4F"/><circle cy="-7.6" r="1.3" fill="#6E4426"/><ellipse cy="-9.6" rx="2.4" ry=".9" fill="#E0A44A"/><path d="M-2.2 -9.8 Q0 -11.6 2.2 -9.8" fill="#C98E52"/></g></g>' +
    '<g class="walker w2"><g transform="translate(0 84)"><path d="M-2.2 0 L-1.8 -7 L1.8 -7 L2.2 0 Z" fill="#F4EBD0"/><path d="M0 -7 V0" stroke="#D9CBA6" stroke-width=".4"/><circle cy="-8.4" r="1.4" fill="#5E3A1C"/><path d="M-1.4 -9 q1.4 -1.8 2.8 0 Z" fill="#6A1B9A"/></g></g>' +
    '<g class="walker w3"><g transform="translate(0 90)"><path d="M-1.4 0 L-1.2 -4.6 L1.2 -4.6 L1.4 0 Z" fill="#1E88E5"/><circle cy="-5.6" r="1" fill="#6E4426"/><g class="tyre"><circle cx="3.6" cy="-1.6" r="1.6" fill="none" stroke="#222" stroke-width=".6"/></g><path d="M1 -3 L3.4 -2" stroke="#6B4A2A" stroke-width=".3"/></g></g>' +
    '</svg>',
};
