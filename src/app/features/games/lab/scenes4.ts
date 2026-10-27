// @ts-nocheck
import { arewaCap, capFor } from './capsArewa';
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

/* the children along the palace square (Sani 2026-10-23: "the kids should also wave"): the same small figures, each
   with a raised arm; every third waves all the time, and when a horseman is greeted (.cheer on the scene) they all
   wave and hop. The arm and the hop sit on inner groups so CSS never overrides the placing transform. */
/* (r3, Sani 2026-10-27 "more real"): each child is a little person now, about five heads tall: bare legs and feet, a
   kaftan or a wrapper with its fold, the far arm at the side, a hula cap or a headscarf, the face lit from the upper
   left, and a soft shadow on the sand under the feet. Behind them a row of grown-ups, a head taller and a little paler. */
const KSK = ['#6B4422', '#5A381C', '#7A4E2A', '#4E3018'];
const kids = (y, n) => { let s = '<g class="far kids">'; const c = ['#2F6B9A', '#AD1457', '#E9D9A6', '#2E7D32', '#6A4C93', '#EF6C00', '#F4EBD0', '#00838F'];
  for (let i = 0; i < n; i++) { const x = 4 + i * (152 / n) + (i % 2) * 2, col = c[i % c.length], sk = KSK[i % 4], girl = i % 2 === 1, yy = y + (i % 3) * .5;
    s += '<g transform="translate(' + x.toFixed(1) + ' ' + yy + ')"><ellipse cx=".6" cy=".1" rx="2.6" ry=".5" fill="#5A3A1A" opacity=".28"/><g class="kid' + (i % 3 === 0 ? ' wave4' : '') + '" style="--d:' + ((i % 5) * .09).toFixed(2) + 's">' +
      '<path d="M-.9 0 V-2.6 M.9 0 V-2.6" stroke="' + sk + '" stroke-width=".7"/><path d="M-1.5 .1 h1.1 M.5 .1 h1.1" stroke="#2A1A0C" stroke-width=".45"/>' +
      '<path d="M-1.9 ' + (girl ? -1 : -2.2) + ' L-1.4 -6.4 Q0 -7 1.4 -6.4 L1.9 ' + (girl ? -1 : -2.2) + ' Z" fill="' + col + '"/>' +
      '<path d="M-1.9 ' + (girl ? -1 : -2.2) + ' L-1.4 -6.4 L-.4 -6.6 L-.6 ' + (girl ? -1 : -2.2) + ' Z" fill="#fff" opacity=".18"/><path d="M.6 -6 L1 ' + (girl ? -1.2 : -2.4) + '" stroke="#000" stroke-width=".25" opacity=".22"/>' +
      '<path d="M-1.4 -6 L-1.9 -3.4" stroke="' + col + '" stroke-width=".8" stroke-linecap="round"/><circle cx="-1.95" cy="-3.1" r=".4" fill="' + sk + '"/>' +
      '<g class="arm4"><path d="M1.3 -5.8 L2.8 -8.8" stroke="' + col + '" stroke-width=".8" stroke-linecap="round"/><circle cx="2.95" cy="-9.1" r=".45" fill="' + sk + '"/></g>' +
      '<rect x="-.35" y="-7.4" width=".7" height=".9" fill="' + sk + '"/><circle cy="-8.3" r="1.25" fill="' + sk + '"/><circle cx="-.35" cy="-8.6" r=".55" fill="#fff" opacity=".14"/>' +
      '<circle cx="-.35" cy="-8.3" r=".14" fill="#1A0E06"/><circle cx=".45" cy="-8.3" r=".14" fill="#1A0E06"/>' +
      (girl ? '<path d="M-1.5 -8.1 Q-1.6 -10.2 0 -10.1 Q1.6 -10.2 1.5 -8.1 Q.9 -9.3 0 -9.3 Q-.9 -9.3 -1.5 -8.1 Z" fill="' + c[(i + 3) % c.length] + '"/><path d="M1.3 -9.4 l1 -.6 l-.3 1 Z" fill="' + c[(i + 3) % c.length] + '"/>'
        : i % 8 === 2 ? arewaCap('zanna', 0, -8.9, 1.25, '#7A1F2B', '#E9C46A') : i % 8 === 6 ? arewaCap('borno', 0, -8.9, 1.2, '#F2E8CF', '#A3242C', '#1E5B3A')
          : arewaCap('hula', 0, -8.9, 1.25, i % 8 === 0 ? '#FFFFFF' : '#F4EBD0', i % 8 === 0 ? '#2E5E3A' : '#7A1F2B')) +
      '</g></g>'; }
  return s + '</g>'; };
const elders = (y, xs) => { const c = ['#E8DFC6', '#5A7FA8', '#F2EEE4', '#8A6C5E', '#B05A80', '#5E8A5E', '#DCCFA8', '#5C6496'];
  return '<g class="far">' + xs.map((x, i) => { const col = c[i % c.length], sk = KSK[(i + 1) % 4], w = i % 3 === 1;
    return '<g transform="translate(' + x + ' ' + (y + (i % 2) * .4) + ')"><path d="M-2.4 0 L-2 -8.6 Q0 -9.6 2 -8.6 L2.4 0 Z" fill="' + col + '"/><path d="M-2.4 0 L-2 -8.6 L-1 -9 L-1.2 0 Z" fill="#fff" opacity=".15"/><path d="M1 -8 L1.6 0" stroke="#000" stroke-width=".3" opacity=".18"/>' +
      '<rect x="-.4" y="-10" width=".8" height="1.2" fill="' + sk + '"/><circle cy="-11" r="1.35" fill="' + sk + '"/>' +
      (w ? '<path d="M-1.8 -10.4 Q-1.8 -13 0 -13 Q1.8 -13 1.8 -10.4 L2.6 -7 L-2.6 -7 Z" fill="' + c[(i + 4) % c.length] + '"/><circle cy="-11" r="1.2" fill="' + sk + '"/>'
        : ((k) => arewaCap(k.cap, 0, -11.5, 1.4, k.capc, k.capc2, k.capc3))(capFor(i))) + '</g>'; }).join('') + '</g>'; };
/* the old city beyond the palace wall, pale and blue with distance: flat-roofed houses with their zanko, the domes and
   minaret of the central mosque, neem crowns */
const farCity = () => '<g opacity=".55"><g fill="#C9B8A8">' +
  '<path d="M30 30 V26.6 H40 V30 Z M42 30 V25.4 H50 V30 Z M108 30 V26 H118 V30 Z M118 30 V27 H128 V30 Z M52 30 V27.2 H60 V30 Z"/>' + zanko(30, 48, 25.4) + zanko(108, 126, 26) +
  '<path d="M84 30 V22 Q88 17 92 22 V30 Z M66 30 V24 Q70 19.6 74 24 V30 Z"/><rect x="96" y="12" width="2.6" height="18"/><path d="M95.6 12 h3.4 l-1.7 -3 Z"/><rect x="95.4" y="18" width="3.8" height=".8"/></g>' +
  '<g fill="#AFC0B0"><ellipse cx="62" cy="27.6" rx="5" ry="3"/><ellipse cx="102" cy="27" rx="5.6" ry="3.4"/><ellipse cx="80" cy="28" rx="4" ry="2.4"/></g></g>';
/* toron giginya: the palm-wood beams that stand out of every Hausa wall, each throwing a short shadow down and right */
const toron = (pts) => '<g>' + pts.map(([x, y]) => '<path d="M' + (x + .5) + ' ' + (y + .6) + ' l2 .3 l-.4 1.6 l-1.6 -.3 Z" fill="#6E3418" opacity=".35"/><rect x="' + (x - .6) + '" y="' + (y - .5) + '" width="2.2" height="1.1" rx=".3" fill="#5A3416"/><rect x="' + (x - .6) + '" y="' + (y - .5) + '" width="2.2" height=".35" fill="#8A5A30"/>').join('') + '</g>';
/* the dagi knot in raised white plaster: a darker copy under it, down and right, makes it stand out of the wall */
const dagi = (x, y, r = 5) => { const k = r * .55, d = 'M' + x + ' ' + (y - r) + ' Q' + (x + k) + ' ' + (y - k) + ' ' + (x + r) + ' ' + y + ' Q' + (x + k) + ' ' + (y + k) + ' ' + x + ' ' + (y + r) + ' Q' + (x - k) + ' ' + (y + k) + ' ' + (x - r) + ' ' + y + ' Q' + (x - k) + ' ' + (y - k) + ' ' + x + ' ' + (y - r) + ' Z' +
    'M' + (x - r * .7) + ' ' + (y - r * .7) + ' Q' + x + ' ' + (y - r * .15) + ' ' + (x + r * .7) + ' ' + (y - r * .7) + ' Q' + (x + r * .15) + ' ' + y + ' ' + (x + r * .7) + ' ' + (y + r * .7) + ' Q' + x + ' ' + (y + r * .15) + ' ' + (x - r * .7) + ' ' + (y + r * .7) + ' Q' + (x - r * .15) + ' ' + y + ' ' + (x - r * .7) + ' ' + (y - r * .7) + ' Z';
  return '<g fill="none" stroke-linejoin="round"><path d="' + d + '" stroke="#6E3418" stroke-width=".9" opacity=".35" transform="translate(.35 .4)"/><path d="' + d + '" stroke="#FFF1D6" stroke-width=".7" opacity=".85"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .22) + '" stroke="#FFF1D6" stroke-width=".6" opacity=".85"/></g>'; };
/* the square: hoof marks and ripples in the sand, pebbles, the wall's own shade at its foot */
const sand = () => { let s = '<g fill="none" stroke="#B88A50" stroke-width=".3" opacity=".45">';
  for (let i = 0; i < 26; i++) { const x = (i * 41.3) % 156 + 2, y = 78 + (i * 17.9) % 21, w = 4 + (i % 4) * 2; s += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' q' + (w / 2) + ' -.8 ' + w + ' 0"/>'; }
  s += '</g><g fill="#9C7240" opacity=".4">';
  for (let i = 0; i < 18; i++) { const x = (i * 29.7 + 11) % 150 + 4, y = 80 + (i * 13.1) % 18; s += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' a.9 .5 0 1 1 1.8 0 Z"/>'; }
  s += '</g><g fill="#8E6A3E" opacity=".5">';
  for (let i = 0; i < 30; i++) { const x = (i * 23.9 + 5) % 156 + 2, y = 76 + (i * 11.3) % 23; s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (.25 + (i % 3) * .15).toFixed(2) + '" ry=".18"/>'; }
  return s + '</g>'; };
/* the palace gate (Sani 2026-10-23: "guards open gate"): two studded wooden leaves filling the arch, hinged at its
   sides; they swing open (.open on the scene) for a greeted horseman to ride in. The guards who haul them are the
   game's own (games2.ts), drawn in front of the band so they can be seen. */
const gateLeaf = (cls, d, x0, x1) => { let pl = ''; for (let x = x0 + 3; x < x1; x += 3) pl += '<path d="M' + x + ' 70 V36" stroke="#4E2A10" stroke-width=".3"/>';
  let st = ''; [44, 54, 64].forEach((y) => { for (let x = x0 + 2; x < x1; x += 4) st += '<circle cx="' + x + '" cy="' + y + '" r=".45"/>'; });
  return '<g class="' + cls + '"><clipPath id="' + cls + 'c"><path d="' + d + '"/></clipPath><path d="' + d + '" fill="#7A4A22"/><g clip-path="url(#' + cls + 'c)">' + pl + '<g fill="#D9B44A">' + st + '</g></g>' +
    '<path d="' + d + '" fill="none" stroke="#3A1E0C" stroke-width=".6"/></g>'; };
const gate = () => gateLeaf('gl', 'M62 70 V46 Q71 36 80 36 V70 Z', 62, 80) + gateLeaf('gr', 'M80 70 V36 Q89 36 98 46 V70 Z', 80, 98) +
  '<circle class="gring" cx="78" cy="56" r="1.2" fill="none" stroke="#D9B44A" stroke-width=".5"/><circle class="gring" cx="82" cy="56" r="1.2" fill="none" stroke="#D9B44A" stroke-width=".5"/>';

/* the palace's mud plaster (Sani 2026-10-23: "a bit more realism"): blotches of darker and paler earth, rain streaks
   down from the parapet, a few hairline cracks, the towers rounded by light, and the foot of the wall darkened where
   the rain splashes; all flat shapes at low opacity, no filters */
const mud = () => { let s = '<g opacity=".9">';
  for (let i = 0; i < 70; i++) { const x = 8 + (i * 37.3) % 144, y = 32 + (i * 23.7) % 36; s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (1 + (i % 4) * .7).toFixed(1) + '" ry="' + (.5 + (i % 3) * .3).toFixed(1) + '" fill="' + (i % 2 ? '#8E4423' : '#DE9464') + '" opacity=".22"/>'; }
  for (let i = 0; i < 18; i++) { const x = 10 + (i * 53.1) % 140; s += '<path d="M' + x.toFixed(1) + ' ' + (i % 3 ? 31 : 25) + ' v' + (6 + (i % 4) * 3) + '" stroke="#7A3A1C" stroke-width="' + (.6 + (i % 2) * .5) + '" opacity=".14"/>'; }
  s += '<path d="M36 52 l2 3 l-1 3 l2 4 M124 56 l-2 3 l1 4 M146 44 l1.5 3 l-1 3" stroke="#6B3418" stroke-width=".35" fill="none" opacity=".5"/>';
  s += '<path d="M6 70 V24 H30 V70 Z M130 70 V24 H154 V70 Z" fill="url(#p4-tow)"/><path d="M6 70 V61 H154 V70 Z" fill="url(#p4-base)"/>';
  return s + '</g>'; };

/* spectators on a wall top: head and shoulders in bright veils and caps, one or two waving */
const onWall = (xs, y) => { const c = ['#C2185B', '#FFB300', '#1565C0', '#2E7D32', '#AD1457', '#6A1B9A', '#EF6C00', '#00838F'];
  return '<g class="onwall">' + xs.map((x, i) => '<g transform="translate(' + x + ' ' + y + ')"' + (i % 4 === 1 ? ' class="wave4"' : '') + '><path d="M-2 0 Q-2 -3.4 0 -3.6 Q2 -3.4 2 0 Z" fill="' + c[i % c.length] + '"/>' +
    '<circle cy="-4.6" r="1.2" fill="#6B4422"/><path d="M-1.5 -4.4 Q0 -7.2 1.5 -4.4" fill="' + (i % 3 ? c[(i + 3) % c.length] : '#FFFFFF') + '"/>' + (i % 4 === 1 ? '<path class="arm4" d="M1.4 -2.8 L3 -6.4" stroke="' + c[i % c.length] + '" stroke-width=".9" stroke-linecap="round"/>' : '') + '</g>').join('') + '</g>'; };
/* a long pennant on a pole, streaming in the wind */
const pennant = (x, y, c) => '<path d="M' + x + ' ' + y + ' V' + (y - 16) + '" stroke="#5A3A1E" stroke-width=".6"/><path class="pen4" d="M' + x + ' ' + (y - 16) + ' Q' + (x + 6) + ' ' + (y - 15) + ' ' + (x + 11) + ' ' + (y - 13) + ' Q' + (x + 6) + ' ' + (y - 12.4) + ' ' + x + ' ' + (y - 11) + ' Z" fill="' + c + '"/>';

/* a groundnut pyramid built of real sacks (Sani 2026-10-23): rows of jute pillows, each row one sack shorter and set
   half a sack in, so a porter can step up it; the shaded side darker, the tints varied so no two sacks match */
const sackPyr = (cx, rows, o, sw = 3.6, sh = 2) => { let s = '<g opacity="' + o + '">';
  for (let k = 0; k < rows; k++) { const n = rows - k, y = 62 - (k + 1) * sh, x0 = cx - n * sw / 2;
    for (let i = 0; i < n; i++) { const x = x0 + i * sw, t = (i * 7 + k * 3) % 4, shade = x + sw / 2 > cx + (n * sw / 2) * .2;
      const f = shade ? ['#B38E57', '#A98450', '#B89458', '#A27E4A'][t] : ['#DDBF86', '#D4B47A', '#E2C690', '#CFAE74'][t];
      s += '<path d="M' + (x + .5).toFixed(1) + ' ' + (y + .35).toFixed(2) + 'Q' + (x + sw / 2).toFixed(1) + ' ' + (y - .3).toFixed(2) + ' ' + (x + sw - .5).toFixed(1) + ' ' + (y + .35).toFixed(2) +
        'Q' + (x + sw + .25).toFixed(1) + ' ' + (y + sh / 2).toFixed(2) + ' ' + (x + sw - .5).toFixed(1) + ' ' + (y + sh - .2).toFixed(2) + 'Q' + (x + sw / 2).toFixed(1) + ' ' + (y + sh + .25).toFixed(2) + ' ' + (x + .5).toFixed(1) + ' ' + (y + sh - .2).toFixed(2) +
        'Q' + (x - .25).toFixed(1) + ' ' + (y + sh / 2).toFixed(2) + ' ' + (x + .5).toFixed(1) + ' ' + (y + .35).toFixed(2) + 'Z" fill="' + f + '" stroke="#8B6A3A" stroke-width=".18"/>';
      if ((i + k) % 3 === 0) s += '<path d="M' + (x + 1).toFixed(1) + ' ' + (y + sh / 2).toFixed(2) + 'h' + (sw - 2).toFixed(1) + '" stroke="#9A7A42" stroke-width=".15" stroke-dasharray=".4 .3"/>'; } }
  return s + '</g>'; };

export const SCENES4: Record<string, string> = {
  /* Hawan Sallah: the emir's palace gate on Sallah day, bunting across the square */
  palace: head + '<defs>' + lg('p4-sky', '#7EC8EC', '#CDE9F2', '#F6E7C4') + lg('p4-wall', '#C8693A', '#A9522B') + lg('p4-ground', '#E3C48C', '#C99E62') + lg('p4-haze', 'rgba(255,243,220,0)', 'rgba(255,243,220,.55)') + lg('p4-base', 'rgba(90,40,16,0)', 'rgba(90,40,16,.5)') +
    '<linearGradient id="p4-tow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>' +
    '<rect width="160" height="100" fill="url(#p4-sky)"/><defs>' + rg('p4-sun', '#FFF8E0', '#FFF8E0') + '</defs><circle cx="8" cy="2" r="34" fill="url(#p4-sun)" opacity=".7"/>' + cloud(26, 12, .8) + cloud(128, 9, .7) + farCity() +
    '<rect width="160" height="72" fill="url(#p4-haze)"/>' +
    '<path d="M18 70 V30 H142 V70 Z" fill="url(#p4-wall)"/><g fill="#A9522B">' + zanko(18, 140, 30) + '</g>' +
    '<path d="M6 70 V24 H30 V70 Z M130 70 V24 H154 V70 Z" fill="#B85C30"/><g fill="#B85C30">' + zanko(6, 28, 24) + zanko(130, 152, 24) + '</g>' +
    mud() + '<path d="M30 24 h3.6 L33.6 70 H30 Z" fill="#5A2A10" opacity=".16"/><path d="M18 30 H142 v1.4 H18 Z" fill="#5A2A10" opacity=".14"/>' +
    toron([[10, 34], [20, 34], [10, 50], [20, 50], [134, 34], [144, 34], [134, 50], [144, 50], [36, 36], [48, 36], [112, 36], [124, 36]]) +
    '<path d="M62 70 V46 Q80 26 98 46 V70 Z" fill="#3A1E0C"/><path d="M58 70 V45 Q80 21 102 45 V70" fill="none" stroke="#FFF1D6" stroke-width="1.6"/>' +
    '<path d="M54 70 V44 Q80 16 106 44 V70" fill="none" stroke="#2E7D32" stroke-width="1.2"/>' + gate() + dagi(41, 46, 5) + dagi(119, 46, 5) + dagi(18, 41, 4) + dagi(142, 41, 4) +
    '<g class="bunting"><path d="M0 18 Q80 32 160 18" fill="none" stroke="#5A3A1E" stroke-width=".5"/>' +
    [8, 20, 32, 44, 56, 68, 80, 92, 104, 116, 128, 140, 152].map((x, i) => '<path d="M' + x + ' ' + (18 + Math.sin(x / 160 * Math.PI) * 13.5).toFixed(1) + ' l2.6 5 l2.6 -5 Z" fill="' + ['#C62828', '#2E7D32', '#FFD54A'][i % 3] + '"/>').join('') + '</g>' +
    // Sallah day on the palace wall (Sani 2026-10-23: more of the Hawan Sallah behind): women in bright veils watching
    // from the parapet, the emir's pennants on the towers, a second line of spectators under shades at the back
    onWall([22, 26, 31, 36, 41, 46, 112, 117, 122, 127, 132, 137], 30) +
    pennant(14, 24, '#2E7D32') + pennant(150, 24, '#C62828') + pennant(28, 24, '#C62828') + pennant(136, 24, '#2E7D32') +
    '<path d="M0 70 H160 V100 H0 Z" fill="url(#p4-ground)"/><path d="M0 70 H160 V73.5 Q80 72.4 0 73.5 Z" fill="#6E4A22" opacity=".22"/>' + sand() +
    elders(72.6, [9, 17, 25, 33, 45, 53, 107, 115, 123, 135, 143, 151]) + kids(74, 20) +
    '<g fill="#B98A50" opacity=".45"><ellipse cx="40" cy="90" rx="18" ry="1.6"/><ellipse cx="124" cy="86" rx="14" ry="1.2"/></g>' +
    '<g class="dustdrift" fill="#E9D3A6" opacity=".35"><ellipse cx="20" cy="80" rx="10" ry="2"/><ellipse cx="70" cy="84" rx="8" ry="1.6"/><ellipse cx="146" cy="82" rx="9" ry="1.8"/></g></svg>',

  /* Dillalin kasuwa: Kasuwar Kurmi, zinc roofs, hanging cloth, the old arch behind */
  kurmi: head + '<defs>' + lg('k4-sky', '#A7D8EE', '#F2E6CC') + lg('k4-zinc', '#B8C0C8', '#7E8893') + lg('k4-g', '#D9B57E', '#B4844A') + '</defs>' +
    '<rect width="160" height="100" fill="url(#k4-sky)"/>' + cloud(110, 10, .7) +
    '<path d="M50 52 V24 H110 V52 Z" fill="#C98E52"/><g fill="#C98E52">' + zanko(50, 108, 24) + '</g><path d="M70 52 V38 Q80 28 90 38 V52 Z" fill="#5A3416"/>' + relief(60, 32) + relief(100, 32) +
    [[2, 42], [42, 46], [82, 44], [122, 42]].map(([x, y]) => '<path d="M' + x + ' ' + y + ' L' + (x + 38) + ' ' + (y - 4) + ' L' + (x + 38) + ' ' + (y + 1) + ' L' + x + ' ' + (y + 5) + ' Z" fill="url(#k4-zinc)"/>' +
      '<path d="M' + (x + 3) + ' ' + (y + 4) + ' V72 M' + (x + 35) + ' ' + y + ' V72" stroke="#5E3A1C" stroke-width="1.2"/>' +
      '<g class="cloths"><rect x="' + (x + 6) + '" y="' + (y + 4) + '" width="5" height="14" fill="#1565C0"/><rect x="' + (x + 12) + '" y="' + (y + 4) + '" width="5" height="11" fill="#C2185B"/><rect x="' + (x + 18) + '" y="' + (y + 4) + '" width="5" height="16" fill="#FFB300"/><rect x="' + (x + 24) + '" y="' + (y + 4) + '" width="5" height="12" fill="#2E7D32"/></g>' +
      '<rect x="' + (x + 2) + '" y="62" width="34" height="4" fill="#8B5A2B"/><ellipse cx="' + (x + 10) + '" cy="61" rx="5" ry="2.2" fill="#E9A23B"/><ellipse cx="' + (x + 22) + '" cy="61" rx="5" ry="2.2" fill="#F1E2B8"/><ellipse cx="' + (x + 32) + '" cy="61" rx="3" ry="2" fill="#B94A2A"/>').join('') +
    '<path d="M0 72 H160 V100 H0 Z" fill="url(#k4-g)"/>' + people(76, 14, false) + '</svg>',

  /* Mai shayi (Sani 2026-10-25): the open roadside at dusk, no walls. The evening sky goes from deep blue to the last
     orange over the horizon; far off, neem trees, a palm, a minaret and the electricity poles; the ground is red earth.
     The road with its passers-by is drawn by the game itself (teastall.ts), just below the horizon at y≈47. */
  teanight: head + '<defs>' + lg('tn-sky', '#1C2156', '#4A3A78', '#B8607A', '#F0A060') + lg('tn-g', '#A86A42', '#7A4A30') + rg('tn-sun', '#FFC27A', '#FFC27A') + '</defs>' +
    '<rect width="160" height="100" fill="url(#tn-sky)"/>' + stars(22, 20) + '<circle cx="128" cy="11" r="4.4" fill="#FFF3C4"/><circle cx="129.8" cy="9.8" r="3.9" fill="#2A2A66"/>' +
    '<ellipse cx="96" cy="48" rx="60" ry="12" fill="url(#tn-sun)" opacity=".45"/>' +
    '<g fill="#3B2A4E" opacity=".9"><rect x="104" y="30" width="2.4" height="17"/><path d="M103.2 30 h4 l-.6 -2 h-2.8 Z"/><ellipse cx="105.2" cy="27.4" rx="1.6" ry="2"/><path d="M105.2 25 v-1.6"/>' +
    '<path d="M60 47 V41 h14 v6 Z M78 47 V43 h10 v4 Z M120 47 V42 h12 v5 Z"/></g>' +
    neem(18, 47, .55, '#2E2A48', '#3A3458') + neem(46, 47, .4, '#2E2A48', '#3A3458') + neem(146, 47, .5, '#2E2A48', '#3A3458') + dum(92, 47, .55) +
    '<g stroke="#2A2238" stroke-width=".6" fill="none"><path d="M8 47 V31 M30 47 V31 M52 47 V31"/><path d="M6 32 h4 M28 32 h4 M50 32 h4"/><path d="M8 32.4 Q19 35 30 32.4 Q41 35 52 32.4 Q60 34 68 33"/></g>' +
    '<path d="M0 47 H160 V100 H0 Z" fill="url(#tn-g)"/><g fill="#6E4028" opacity=".6"><ellipse cx="30" cy="86" rx="16" ry="1.4"/><ellipse cx="124" cy="92" rx="20" ry="1.6"/><ellipse cx="80" cy="96" rx="14" ry="1.2"/></g></svg>',

  /* Dalar gyaɗa: Kano's groundnut pyramids in the harmattan haze, lorries waiting */
  pyramids: head + '<defs>' + lg('py-sky', '#E9D6AE', '#F3E6C8') + lg('py-g', '#D8B57C', '#BC9157') + '</defs>' +
    '<rect width="160" height="100" fill="url(#py-sky)"/><circle cx="120" cy="18" r="8" fill="#FFF3D6" opacity=".9"/>' +
    sackPyr(20, 8, .72) + sackPyr(142, 7, .66) + sackPyr(58, 12, 1) + sackPyr(106, 11, 1) +
    '<g opacity=".7"><rect x="4" y="56" width="14" height="6" fill="#2E7D32"/><rect x="18" y="57" width="5" height="5" fill="#C62828"/><circle cx="8" cy="63" r="1.5" fill="#222"/><circle cx="20" cy="63" r="1.5" fill="#222"/></g>' +
    '<path d="M0 62 H160 V100 H0 Z" fill="url(#py-g)"/><g fill="#C9A06A" opacity=".6"><ellipse cx="30" cy="80" rx="20" ry="1.6"/><ellipse cx="120" cy="88" rx="24" ry="2"/></g>' +
    /* the porters build the pyramid (Sani 2026-10-23): each carries a jute sack across the back of his neck, bent
       forward, both hands up holding its ears; he walks to the pyramid on the right (the lorry hides the big one), climbs its face, sets the sack down near the
       top, turns and comes back down for the next. The sack he sets down (.psk) stays on the pyramid until his next one. */
    [[0, 44, '#2F6B9A', '#F4EBD0', 101.6, 44], [-11, 44, '#B23A2A', '#E9D9A6', 98, 48], [-22, 44, '#2E7D32', '#F4EBD0', 103.4, 42], [-33, 44, '#6A4C93', '#FFFFFF', 99.8, 46]].map(([d, dur, c, cap, px, py], i) =>
      '<g class="psk" style="animation-duration:' + dur + 's;animation-delay:' + d + 's"><g transform="translate(' + (px + 2.2) + ' ' + (py - 1) + ')">' +
      '<rect x="-1.8" y="-1" width="3.6" height="2" rx="1" fill="#D8BA80" stroke="#8B6A3A" stroke-width=".18"/></g></g>' +
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
