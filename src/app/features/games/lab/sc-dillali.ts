// @ts-nocheck
/*
 * Dillalin kasuwa's market square, drawn (Sani 2026-10-25: "more realism in the bg for market, people with wheelbarrows,
 * people coming to inspect and leave", then "some more background effects"). 320×200, sliced to fill the screen, in
 * Hanzarin kasuwa's hand and with its people (sc-kasuwa.ts KW), so faces cheer and frown with the answers there too.
 * Far back: the town, a baobab and the mosque. Behind the square: the livestock corner (rams and goats in a thorn
 * fence, a camel resting), sheds with cloth and umbrellas, bunting. Crossing the square, each on its own loop: a mai baro
 * with his wheelbarrow, a woman with a basin of oranges on her head, a man leading a ram, a keke napep on the road, a
 * buyer who stops at a shed to look and walks on. The middle above the ground stays quiet: the photo stands there.
 *
 * The view is the middle of the 320×200 drawing, zoomed 1.5×, so the square's people are big enough to read.
 *
 * Moving parts (sc-dillali.css, transform and opacity only); the kw4 classes (x-p, x-h, x-a, x-cl, x-pk, x-gr, x-tail,
 * x-smoke, x-cloud, x-walk) keep their sc-kasuwa.css behaviour because the svg carries both class names.
 */
import { KW } from './sc-kasuwa';

const { person, goat, chicken, keke, barrow, kwarya, kwano, tomatoes, peppers, onions, headLoad, crowd, shed, heaps, cloth, umbrella, house, neem, dum, SKIN, U, lg } = KW;
const PF = 'kw4';

/* a baobab: the fat grey trunk and the thin crown */
const baobab = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-7 0 Q-9 -14 -5 -24 L-8 -32 M-5 -24 L-2 -34 M5 -24 L9 -33 M5 -24 L2 -35" stroke="#7E7064" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
  '<path d="M-8 0 Q-10 -14 -5 -25 H5 Q10 -14 8 0 Z" fill="#8E8072"/><path d="M1 -25 H5 Q10 -14 8 0 H3 Q5 -12 1 -25 Z" fill="#000" opacity=".12"/>' +
  '<g fill="#6F8F4A" opacity=".9"><ellipse cx="-8" cy="-34" rx="6" ry="3"/><ellipse cx="2" cy="-37" rx="7" ry="3.2"/><ellipse cx="10" cy="-34" rx="5" ry="2.6"/></g></g>';
/* a thorn fence (zariba) round the livestock corner */
const zariba = (x0, x1, y) => { let s = '<g stroke="#7A5A34" stroke-width=".7" fill="none" stroke-linecap="round">'; for (let x = x0; x < x1; x += 3) s += '<path d="M' + x + ' ' + y + ' l1.5 -5 l1.5 5 M' + (x + .5) + ' ' + (y - 2.6) + ' l2 -.6"/>'; return s + '</g>'; };
/* a camel resting on its knees, chewing */
const camelDown = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy=".4" rx="14" ry="1.6" fill="#3A2410" opacity=".22"/>' +
  '<path d="M-13 0 Q-14 -8 -8 -10 Q-3 -18 3 -11 Q8 -10 10 -5 L11 0 Z" fill="#C49A60"/><path d="M-2 -11 Q2 -15 4 -10 Z" fill="#B71C1C"/><path d="M-3 -11.6 h7" stroke="#FFD54A" stroke-width=".6"/>' +
  '<path d="M9 -5 Q15 -8 15 -16 L18 -17 Q20 -16 19.6 -14.4 Q18 -14 17.6 -13 Q17.6 -6 12 -1 Z" fill="#C49A60"/><circle cx="18" cy="-15.6" r=".4" fill="#1A0E06"/>' +
  '<g class="x-chew"><path d="M18.4 -13.4 q1 .4 1.4 -.2" stroke="#7A5A34" stroke-width=".4" fill="none"/></g><path d="M-12 0 h8 M2 0 h8" stroke="#A57A45" stroke-width="1.6" stroke-linecap="round"/></g>';
/* a ram, white with curled horns (the goat drawing with a fleece) */
const ram = (x, y, s, flip, cls = '') => goat(x, y, s, '#F4EFE6', '#8A7A66', flip, cls);
/* a string of bunting between two posts; each flag sways a little */
const bunting = (x0, x1, y, sag) => { const cs = ['#D7261E', '#F2C230', '#2E7D32', '#1F5FA8', '#EF6C00']; let s = '<path d="M' + x0 + ' ' + y + ' Q' + ((x0 + x1) / 2) + ' ' + (y + sag) + ' ' + x1 + ' ' + y + '" stroke="#5E4A3A" stroke-width=".35" fill="none"/>';
  const n = Math.floor((x1 - x0) / 6); for (let i = 1; i < n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, yy = y + sag * 4 * t * (1 - t) * .5 * 2 * .5 + sag * (4 * t * (1 - t)) * .5;
    s += '<g class="x-flag" style="animation-delay:-' + (i * .37).toFixed(2) + 's"><path d="M' + x.toFixed(1) + ' ' + yy.toFixed(1) + ' l1.6 3.4 l1.6 -3.4 Z" fill="' + cs[i % cs.length] + '"/></g>'; }
  return s; };

export function dillaliScene(): string {
  const sky = '<rect width="320" height="200" fill="' + U('dsky') + '"/><circle cx="78" cy="40" r="26" fill="' + U('dsun') + '"/><circle cx="78" cy="40" r="5.5" fill="#FFF8DC"/>' +
    '<g class="x-cloud"><g fill="#fff" opacity=".85" transform="translate(96 40)"><ellipse rx="15" ry="3.4"/><ellipse cx="7" cy="-2" rx="8" ry="4"/><ellipse cx="-6" cy="-1.3" rx="6" ry="3"/></g></g>' +
    '<g class="x-cloud x-c2"><g fill="#fff" opacity=".7" transform="translate(200 36)"><ellipse rx="12" ry="2.8"/><ellipse cx="6" cy="-1.6" rx="6" ry="3.2"/></g></g>' +
    // birds drifting over the town
    '<g class="x-birds"><path d="M100 30 q2 -1.6 4 0 q2 -1.6 4 0 M114 24 q1.6 -1.3 3.2 0 q1.6 -1.3 3.2 0 M92 22 q1.4 -1.1 2.8 0 q1.4 -1.1 2.8 0" stroke="#3A3A3A" stroke-width=".5" fill="none"/></g>';
  const town = '<g opacity=".8">' + house(70, 60, 22, 12, '#D49A68', '#B9784A') + house(96, 60, 18, 9, '#CF9160', '#B9784A') + house(196, 60, 24, 13, '#D49A68', '#B9784A') +
    house(224, 60, 18, 10, '#CF9160', '#B9784A') + house(262, 60, 26, 12, '#D49A68', '#B9784A') + '</g>' +
    // the mosque behind the square: a dome and a minaret
    '<g transform="translate(150 60)" opacity=".9"><path d="M-14 0 V-10 H16 V0 Z" fill="#EADBC0"/><path d="M-6 -10 Q1 -22 8 -10 Z" fill="#3E8E6A"/><path d="M1 -20 v-3" stroke="#C9A227" stroke-width=".6"/>' +
    '<path d="M10 -10 L11 -36 H15 L16 -10 Z" fill="#F1E6D0"/><path d="M9.6 -36 H16.4 V-38 H9.6 Z" fill="#D9C8A8"/><path d="M10.6 -38 Q13 -44 15.4 -38 Z" fill="#3E8E6A"/></g>' +
    baobab(70, 64, 1.3) + neem(258, 64, 1) + dum(214, 60, .8);
  // the livestock corner at the back left: a thorn fence, rams and goats, a camel resting beside it
  const pen = '<g transform="translate(54 0) scale(.82 1)"><path d="M2 90 Q60 86 108 90" stroke="#B48A56" stroke-width="5" stroke-linecap="round" opacity=".35"/>' +
    ram(16, 88, .55, false, 'x-gr') + ram(34, 87, .5, true) + goat(50, 88, .5, '#4A3A30', '#2A1E16', false, 'x-gr') + ram(66, 87, .52, true) + goat(82, 88, .48, '#C79A6A', '#5A3A22', false) +
    zariba(4, 100, 91) + '</g>' + camelDown(226, 112, .8);
  // the sheds and umbrellas at the back right, bunting strung across
  const stalls = shed(186, 84, 26, heaps(189, 77, ['#C9301F', '#E8A21E', '#8E3A6A', '#C9301F', '#D7261E']), cloth(189, 64, ['#AD1457', '#FFB300', '#2F6B9A', '#2E7D32', '#6A4C93', '#EF6C00', '#00897B', '#C62828'])) +
    umbrella(222, 84, 9, ['#D7261E', '#F2C230', '#D7261E', '#F2C230', '#D7261E']) +
    shed(234, 84, 28, heaps(237, 77, ['#2E7D32', '#5E9A3A', '#C9301F', '#E8A21E', '#2E7D32']), cloth(237, 64, ['#2F6B9A', '#FFFFFF', '#AD1457', '#FFB300', '#2E7D32', '#6A4C93', '#C62828'])) +
    '<path d="M182 62 V84 M266 60 V84" stroke="#6B4A2E" stroke-width=".8"/>' + bunting(182, 266, 62, 5);
  const ground = '<path d="M0 84 H320 V200 H0 Z" fill="' + U('dgr') + '"/><path d="M0 88 Q160 84 320 88 V92 Q160 88 0 92 Z" fill="#B98A50" opacity=".25"/>' +
    // the dirt road at the back, where the keke runs
    '<path d="M0 96 Q160 92 320 96 V102 Q160 98 0 102 Z" fill="#CBA06A" opacity=".45"/>' +
    '<rect x="0" y="104" width="320" height="96" fill="url(#' + PF + '-rip)" opacity=".55"/><rect x="0" y="84" width="320" height="116" fill="' + U('dnear') + '"/>' +
    '<g fill="#A57A44" opacity=".35"><ellipse cx="40" cy="130" rx="14" ry="1"/><ellipse cx="280" cy="136" rx="16" ry="1"/><ellipse cx="236" cy="150" rx="7" ry=".6"/><ellipse cx="210" cy="176" rx="14" ry="1"/><circle cx="96" cy="140" r=".8"/><circle cx="230" cy="122" r=".7"/><circle cx="150" cy="190" r=".9"/></g>';
  const far = crowd(184, 264, 92, 10, 3);
  // a kosai seller's smoke at the back corner, and the hens
  const smoke = '<g class="x-smoke"><circle cx="122" cy="84" r="2.6" fill="#E8E2D8" opacity=".55"/><circle cx="124" cy="78" r="3.4" fill="#E8E2D8" opacity=".4"/><circle cx="121" cy="72" r="4.4" fill="#E8E2D8" opacity=".25"/></g>' +
    '<path d="M116 92 Q116 88 122 88 Q128 88 128 92 Z" fill="#2A2A2A"/>' +
    person({ x: 112, y: 96, s: .5, kind: 'woman', seat: true, sk: SKIN[1], top: '#6A4C93', wrap: '#6A4C93', wrap2: '#F2C230', trim: '#F2C230', cap: 'kallabi', capc: '#F2C230', capc2: '#6A4C93', al: 'lap', ar: 'out', cls: 'x-cl' });
  // two buyers at the cloth shed, leaning in to look at the goods, and the seller nodding
  const lookers = '<g class="x-look">' + person({ x: 196, y: 98, s: .6, kind: 'man', sk: SKIN[3], robe: '#F4F1EA', robe2: '#E0D8C4', trim: '#8EA8C8', cap: 'turban', capc: '#F4F1EA', beard: '#E8E4DC', al: 'front', ar: 'down', flip: true }) + '</g>' +
    '<g class="x-look x-look2">' + person({ x: 246, y: 99, s: .58, kind: 'woman', sk: SKIN[2], top: '#00897B', wrap: '#00897B', wrap2: '#FFD54A', trim: '#FFD54A', cap: 'mayafi', capc: '#FFD54A', al: 'front', ar: 'down', flip: true }) + '</g>' +
    person({ x: 258, y: 97, s: .56, kind: 'man', sk: SKIN[5], robe: '#3E5C8A', robe2: '#E9E2CF', trim: '#E8D9A8', cap: 'borno', capc: '#1F2E5A', capc2: '#E9C46A', capc3: '#B23A2A', al: 'down', ar: 'hip', cls: 'x-nod x-cl', flip: true });
  // crossing the square, each on its own loop (the outer <g> moves, the inner one places)
  const baro = '<g class="x-tr x-tr1"><g transform="translate(0 112)"><g class="x-baro">' +
    person({ x: 0, y: 0, s: .7, kind: 'jal', sk: SKIN[2], robe: '#E9E2CF', trim: '#9C8458', cap: 'zanna', capc: '#7A1F2B', capc2: '#E9C46A', acl: 'x-ab', acr: 'x-ab' }) +
    '<g transform="translate(9.8 0) scale(.8)">' + barrow('<path d="M5 -15.4 Q4 -21 9 -21.4 Q12 -22 12.6 -16 Z" fill="#D8C49A"/><path d="M12 -15.6 Q12 -21.4 17 -21 Q21 -20 20.4 -16 Z" fill="#CDB888"/>' + onions(12, -21.4, 5, 4)) + '</g></g></g></g>';
  const basin = '<g class="x-tr x-tr2"><g transform="translate(0 108)">' +
    person({ x: 0, y: 0, s: .64, kind: 'woman', sk: SKIN[5], top: '#AD1457', wrap: '#AD1457', wrap2: '#FFD54A', trim: '#FFD54A', cap: 'kallabi', capc: '#FFD54A', capc2: '#AD1457', al: 'head', ar: 'down', acl: 'x-ah', load: headLoad('basin', '#F4F1EA', '#C62828'), cls: 'x-walk', flip: true }) + '</g></g>';
  const ramMan = '<g class="x-tr x-tr3"><g transform="translate(0 116)">' + ram(-16, 0, .62, false, 'x-walk') +
    '<path d="M-8.6 -9.6 Q-5 -6 -3.4 -12" stroke="#6B4422" stroke-width=".5" fill="none"/>' +
    person({ x: 0, y: 0, s: .7, kind: 'man', sk: SKIN[0], robe: '#5D4037', robe2: '#3E2723', trim: '#E8D9A8', cap: 'zanna', capc: '#F4EBD0', capc2: '#7A1F2B', capside: -1, al: 'out', ar: 'down', cls: 'x-walk', flip: true }) + '</g></g>';
  const road = '<g class="x-tr x-tr4"><g transform="translate(0 101)">' + keke(0, 0, .55) + '</g></g>';
  const stopper = '<g class="x-tr x-tr5"><g transform="translate(0 106)"><g class="x-stoop">' +
    person({ x: 0, y: 0, s: .6, kind: 'man', sk: SKIN[4], robe: '#1F5FA8', robe2: '#E9E2CF', trim: '#fff', cap: 'hula', capc: '#fff', capc2: '#1F5FA8', al: 'down', ar: 'front' }) + '</g></g></g>';
  const animals = chicken(92, 126, .7, '#B5652E', false, 'x-pk') + chicken(102, 129, .6, '#F2EDE4', true, 'x-pk x-pk2') + chicken(214, 128, .6, '#2A2A2A', true, 'x-pk') +
    '<g opacity=".95">' + kwarya(196, 106, 4.6, tomatoes(196, 103, 4)) + kwano(208, 106, 4.2, '#F4F1EA', '#1F5FA8', peppers(208, 103.4, 3.8)) + '</g>';
  return '<svg class="scene ' + PF + ' dl4" viewBox="53 30 214 134" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('dsky', '#86C8EA', '#BFE3F1', '#F6EBCF') + lg('dgr', '#E4C795', '#D7B27A', '#C99E64') + lg('dhaze', 'rgba(232,240,246,0)', 'rgba(232,240,246,.38)', 'rgba(232,240,246,0)') + lg('dnear', 'rgba(120,80,40,0)', 'rgba(120,80,40,0)', 'rgba(110,70,32,.22)') +
    '<pattern id="' + PF + '-rip" width="14" height="5" patternUnits="userSpaceOnUse"><path d="M0 3 Q3.5 1.6 7 3 T14 3" stroke="#B48A52" stroke-width=".35" fill="none" opacity=".6"/><path d="M2 4.6 Q5 3.6 8 4.6" stroke="#F2DDB4" stroke-width=".3" fill="none" opacity=".7"/><circle cx="11" cy="1" r=".22" fill="#9A7444"/></pattern>' +
    '<pattern id="' + PF + '-zinc" width="2.2" height="6" patternUnits="userSpaceOnUse" patternTransform="skewX(-15)"><rect width="2.2" height="6" fill="#AEB7BC"/><rect width=".4" height="6" fill="#7E888E"/><rect x=".5" width=".5" height="6" fill="#C8D0D4"/></pattern>' +
    KW.defs() + '<radialGradient id="' + PF + '-dsun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8DC"/><stop offset=".4" stop-color="#FFF1B8" stop-opacity=".6"/><stop offset="1" stop-color="#FFF1B8" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + PF + '-sh" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient></defs>' +
    sky + town + ground + pen + stalls + '<rect x="0" y="40" width="320" height="64" fill="' + U('dhaze') + '"/>' + far + smoke + lookers + animals + road + stopper + basin + ramMan + baro + '</svg>';
}
