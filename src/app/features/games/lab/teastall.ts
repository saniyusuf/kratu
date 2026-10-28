// @ts-nocheck
import { arewaCap } from './capsArewa';
import { liveAC } from './audioctx';
/*
 * Mai shayi by the roadside in the evening (Sani 2026-10-23, reworked 2026-10-25: a stand by the road, not a shop).
 * The tea seller stands behind his table under a bulb on a pole. Most of the time he pulls tea, pouring it in a long
 * stream from a high cup to a low one so it foams; then he hands a fresh cup to the man standing at the end of the table,
 * cracks an egg into the pan, flips it, breaks a loaf, puts the egg in and sets it on a plate. On the bench people drink
 * their frothy tea and a cup is passed along from hand to hand. Behind them, on the road, people walk by and
 * motorbikes pass.
 * Everything moves by transform and opacity only. The seller and the man at his table share one 18 s cycle and the
 * bench one 12 s cycle (teastall.css): each pose is drawn whole and shown in its own window of the cycle, so no limb is
 * ever bent in code. Classes: .p-pull/.p-give/.p-crack/.p-fry/.p-bread (the seller), .c-rest/.c-sip/.c-reach (the man at
 * the table), .pegg/.pflip (the egg in the pan), .plate (the sandwich), a-/b-/cc- (the bench), .fw (passers-by).
 */
const SK = ['#6E4426', '#8B5A2B', '#5E3A1C', '#9C6636'];

/* an arm from the shoulder (sx,sy) bending through (qx,qy) to the hand at (hx,hy) */
const arm = (sx, sy, qx, qy, hx, hy, sleeve, skin) =>
  `<path d="M${sx} ${sy} Q${qx} ${qy} ${hx} ${hy}" stroke="${sleeve}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="4.6" fill="${skin}"/>`;
/* an enamel cup of tea with its head of froth, centred on (x,y): one <use> of the cup drawn once in the stand's <defs>
   (#ts-cup, Sani 2026-10-28: fewer nodes, a real white enamel cup with its blue rim and handle) */
const frothy = (x, y, tilt = 0) => `<use href="#ts-cup" x="${x}" y="${y}"${tilt ? ` transform="rotate(${tilt} ${x} ${y})"` : ''}/>`;
/* a face lit from the stand's bulb at the upper left (Sani 2026-10-27, realism): ears, the shaded right cheek, eyes with
   their whites, brows and a nose; the mouth smiles, or frowns when the stage is sad */
/* an ellipse as path data, so several can share one element */
const ell = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
const face = (x, y, r, sk) => `<path d="${ell(x - r * .97, y + r * .08, r * .17, r * .27)}${ell(x + r * .97, y + r * .08, r * .17, r * .27)}" fill="${sk}"/><ellipse cx="${x + r * .97}" cy="${y + r * .08}" rx="${r * .17}" ry="${r * .27}" fill="#000" opacity=".22"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${r * .94}" ry="${r}" fill="${sk}"/><path d="M${x + r * .2} ${y - r * .98} A${r * .94} ${r} 0 0 1 ${x + r * .2} ${y + r * .98} A${r * .42} ${r * .98} 0 0 0 ${x + r * .2} ${y - r * .98} Z" fill="#000" opacity=".2"/><ellipse cx="${x - r * .42}" cy="${y - r * .3}" rx="${r * .28}" ry="${r * .36}" fill="#fff" opacity=".09"/>` +
  `<path d="${ell(x - r * .36, y - r * .06, r * .17, r * .1)}${ell(x + r * .36, y - r * .06, r * .17, r * .1)}" fill="#EAE2D6"/>` +
  `<path d="${ell(x - r * .33, y - r * .06, r * .085, r * .085)}${ell(x + r * .39, y - r * .06, r * .085, r * .085)}" fill="#1A0E06"/>` +
  `<path d="M${x - r * .58} ${y - r * .3} Q${x - r * .36} ${y - r * .42} ${x - r * .14} ${y - r * .3} M${x + r * .14} ${y - r * .3} Q${x + r * .36} ${y - r * .42} ${x + r * .58} ${y - r * .3}" stroke="#1A0E06" stroke-width="${r * .08}" fill="none" stroke-linecap="round"/>` +
  `<path d="M${x + r * .02} ${y - r * .02} Q${x - r * .04} ${y + r * .26} ${x - r * .14} ${y + r * .3} Q${x} ${y + r * .38} ${x + r * .14} ${y + r * .3}" stroke="#000" stroke-opacity=".35" stroke-width="${r * .06}" fill="none" stroke-linecap="round"/>` +
  `<path class="sm-happy" d="M${x - 5} ${y + 6} Q${x} ${y + 10} ${x + 5} ${y + 6}" stroke="#3A1A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
  `<path class="sm-sad" d="M${x - 5} ${y + 9} Q${x} ${y + 5} ${x + 5} ${y + 9}" stroke="#3A1A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
/* caps (capsArewa.ts): the embroidered cream hula, the folded maroon zanna, the tall Borno cap */
const hula = (x, y, r) => arewaCap('hula', x, y - r * .42, r * .82, '#F4EBD0', '#7A1F2B');
const zanna = (x, y, r) => arewaCap('zanna', x, y - r * .4, r * .86, '#7A1F2B', '#E9C46A');
const borno = (x, y, r) => arewaCap('borno', x, y - r * .42, r * .84, '#1F2E5A', '#E9C46A', '#B23A2A');

/* the stand: the bulb on its pole, the man at the end of the table, the seller, his table, stove, kettle and goods */
export function teaStall(): string {
  const S = SK[0], SL = '#256B2A';     // the seller's skin and sleeve
  const C = SK[2], CL = '#2F6FB5';     // the man at the table
  const restL = arm(188, 114, 176, 150, 184, 180, SL, S);     // the seller's free hand on the table
  /* pulling tea (Sani 2026-10-28: "it has to be 2 hands to make the foam"): a steel mug in each hand, one high and one
     low, a long tapered stream from the high one into the low one where the froth rises; then the hands change places and
     he pours it back. Side 1 pours down the right of his body, side 2 (its mirror) down the left, so no arm crosses his
     face. m = 1 or -1 mirrors about his middle (x 210). */
  const pull = (m: number, cls: string) => {
    const X = (x: number) => 210 + m * (x - 210), hx = X(246), lx = X(259), lip = X(259.6);
    const hi = m > 0 ? arm(232, 114, X(252), 90, X(236), 52, SL, S) : arm(188, 114, X(252), 90, X(236), 52, SL, S);
    const lo = m > 0 ? arm(188, 114, X(214), 150, X(249), 138, SL, S) : arm(232, 114, X(214), 150, X(249), 138, SL, S);
    return `<g class="${cls}">${lo}<use href="#ts-mug" x="${lx}" y="137"/>` +
      `<g class="fm"><ellipse cx="${lx}" cy="126.4" rx="8.4" ry="2.4" fill="#C99A62"/><path d="M${lx - 7.6} 126.6 a2.6 2.2 0 0 1 4.6 -1.6 a3 2.6 0 0 1 5.6 -.6 a2.4 2 0 0 1 4.4 1.6 Q${lx} 128.4 ${lx - 7.6} 126.6 Z" fill="#F6E6CA"/></g>` +
      `<path class="strm" d="M${lip - 3} 41 Q${lip - .8} 70 ${lip - 1.3} 127 L${lip + 1.4} 127 Q${lip + 2.2} 70 ${lip + 3} 41 Z" fill="url(#ts-tea)"/>` +
      hi + `<use href="#ts-mug" x="${hx}" y="44" transform="rotate(${m * 38} ${hx} 44)${m < 0 ? ` translate(${2 * hx} 0) scale(-1 1)` : ''}"/></g>`;
  };
  // an agege loaf in its printed wrapper, its end twisted shut: drawn once, used twice
  const loafDef = `<g id="ts-loaf"><path d="M0 22 V8 Q0 0 9 0 H38 Q46 0 46 8 V22 Z" fill="#E7B46E"/><path d="M0 9 Q0 0 9 0 H38 Q46 0 46 9 Q23 13 0 9 Z" fill="#9C5524"/>` +
    `<path d="M7 3 V22 M13 2 V22 M19 2 V22 M25 2 V22 M31 2 V22 M37 3 V22" stroke="#B9783A" stroke-width=".7" opacity=".6"/>` +
    `<path d="M-1 22 V7 Q-1 -1.5 9 -1.5 H38 Q47 -1.5 47 7 V22 Z" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/>` +
    `<path d="M-1 13 H47 V18 H-1 Z" fill="#C62828" opacity=".85"/><path d="M-1 15.5 H47" stroke="#FFD54A" stroke-width="1.2"/><path d="M47 6 L52 3 L51 10 L52 17 L47 14 Z" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/></g>`;
  return `<svg class="tstall" viewBox="0 0 380 270" aria-hidden="true">` +
    `<defs><linearGradient id="ts-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A87444"/><stop offset="1" stop-color="#6E4524"/></linearGradient>` +
    `<linearGradient id="ts-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E979F"/><stop offset=".45" stop-color="#EEF2F5"/><stop offset="1" stop-color="#737C85"/></linearGradient>` +
    // a tin's roundness: light on the left, dark on the right, laid over its colours
    `<linearGradient id="ts-cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".3" stop-color="#fff" stop-opacity=".45"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>` +
    `<linearGradient id="ts-tea" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A4520"/><stop offset=".45" stop-color="#E2A468"/><stop offset="1" stop-color="#8A5126"/></linearGradient>` +
    `<radialGradient id="ts-coal" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#FFE07A"/><stop offset=".5" stop-color="#F57C00"/><stop offset="1" stop-color="#6A1A00"/></radialGradient>` +
    // boiled noodles: wavy yellow strands, as a pattern so a whole potful is one shape
    `<pattern id="ts-ndl" width="9" height="4.4" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><rect width="9" height="4.4" fill="#D9A23E"/><path d="M0 1.2 q1.1 -1.4 2.25 0 t2.25 0 t2.25 0 t2.25 0 M0 3.4 q1.1 -1.4 2.25 0 t2.25 0 t2.25 0 t2.25 0" stroke="#F7D57E" stroke-width="1.15" fill="none"/></pattern>` +
    `<pattern id="ts-zinc" width="12" height="60" patternUnits="userSpaceOnUse" patternTransform="skewY(-3.4)"><rect width="12" height="60" fill="#A9B2BA"/><rect width="5" height="60" fill="#C9D1D8"/><rect x="10" width="2" height="60" fill="#7E8790"/></pattern><radialGradient id="ts-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient>` +
    // the white enamel cup with its blue rim (the bench uses it too) and the steel pulling mug
    `<g id="ts-cup"><path d="M6.4 -3 Q12.4 -3.4 11.4 2 Q10.6 6.6 5.8 5.8" stroke="#E4E4DE" stroke-width="2" fill="none"/><path d="M-7 -6 L7 -6 L6 8 L-6 8 Z" fill="#F4F4F0"/><path d="M2 -6 L7 -6 L6 8 L1.6 8 Z" fill="#000" opacity=".13"/>` +
    `<path d="M-6.2 7 H6.1 M-7 -5.5 H7" stroke="#1E5AA8" stroke-width="1.2"/><ellipse cy="-6" rx="7.2" ry="2.4" fill="#C99A62"/><path d="M-6 -6.2 a2.4 2 0 0 1 4.6 -.8 a2.6 2.2 0 0 1 5 0 a1.8 1.6 0 0 1 3 .9 Q0 -4.4 -6 -6.2 Z" fill="#F6E6CA"/></g>` +
    `<g id="ts-mug"><path d="M-9 -11 L9 -11 L7.6 11 L-7.6 11 Z" fill="url(#ts-steel)"/><ellipse cy="-11" rx="9" ry="2.4" fill="#5A3A22" stroke="#C9D1D8" stroke-width="1.2"/><path d="M-8.3 -2 H8.4 M-7.7 9 H7.7" stroke="#6E7780" stroke-width=".9"/></g>` +
    // a brown egg, and a tin of evaporated milk (no names on anything)
    `<g id="ts-egg"><ellipse rx="4.4" ry="5.4" fill="#BF8452"/><path d="M1 -5.2 A4.4 5.4 0 0 1 1 5.2 A3.6 5.2 0 0 0 1 -5.2 Z" fill="#6A3A1A" opacity=".3"/><ellipse cx="-1.5" cy="-2" rx="1.3" ry="1.9" fill="#fff" opacity=".35"/></g>` +
    `<g id="ts-tin"><rect width="13" height="15" rx="1.5" fill="#F3F5F8"/><rect y="4" width="13" height="7" fill="#1E5AA8"/><path d="M0 7.5 H13" stroke="#E53935" stroke-width="1"/><rect width="13" height="15" rx="1.5" fill="url(#ts-cyl)"/><ellipse cx="6.5" cy=".4" rx="6.5" ry="1.6" fill="#C9D1D8"/></g>` +
    loafDef + `<g id="ts-pk"><path d="M0 0 Q12 -2 24 0 L24 9 Q12 11 0 9 Z" fill="#F2B21E"/><path d="M8 0.4 H17 V9.6 H8 Z" fill="#C62828"/><path d="M0 0 Q12 -2 24 0 L24 2 Q12 0 0 2 Z" fill="#fff" opacity=".35"/></g>` + `</defs>` +
    `<ellipse cx="200" cy="262" rx="182" ry="7" fill="rgba(0,0,0,.35)"/>` +
    // the shelter (Sani 2026-10-26): a zinc roof on four wooden poles keeps off the sun and the rain; a painted board
    // is nailed to the front of the table and the bulb hangs from under the roof
    `<path d="M92 262 V40 M356 262 V30" stroke="#4E2E14" stroke-width="5"/><path d="M112 186 V44 M338 186 V34" stroke="#3E2410" stroke-width="4" opacity=".7"/>` +
    `<path d="M44 26 L378 6 L378 32 L44 52 Z" fill="url(#ts-zinc)"/><path d="M44 52 L378 32" stroke="#5E646B" stroke-width="2"/>` +
    `<g fill="#9C5A2A" opacity=".55"><ellipse cx="96" cy="44" rx="10" ry="3"/><ellipse cx="300" cy="24" rx="14" ry="3.4"/><ellipse cx="210" cy="34" rx="6" ry="2"/></g>` +
    `<path d="M228 35 V48" stroke="#333" stroke-width="2"/><circle class="bulb" cx="228" cy="58" r="64" fill="url(#ts-glow)"/><ellipse cx="228" cy="56" rx="6" ry="8" fill="#FFF3C0"/>` +
    // the man standing at the end of the table, in a kaftan and a zanna cap
    `<g class="cust">` +
    `<path d="M38 230 V254 M58 230 V254" stroke="#E8DDB8" stroke-width="9"/><path d="M30 254 h14 v5 h-16 Z M52 254 h14 v5 h-12 Z" fill="#3A2A1E"/>` +
    `<path d="M30 112 Q48 104 66 112 L74 232 L22 232 Z" fill="${CL}"/><path d="M52 108 Q62 108 66 112 L74 232 L52 232 Q58 170 52 108 Z" fill="#000" opacity=".17"/><path d="M36 130 Q32 180 30 232 M46 126 Q45 180 44 232 M60 140 Q64 190 66 232" stroke="#000" stroke-opacity=".13" stroke-width="1.6" fill="none"/><path d="M42 108 Q48 118 54 108" stroke="#E8DDB8" stroke-width="1.6" fill="none"/>` +
    arm(32, 116, 20, 150, 28, 178, '#255A99', C) +
    `<rect x="43" y="96" width="10" height="12" fill="${C}"/>` + face(48, 86, 15, C) + zanna(48, 86, 15) +
    `<g class="c-rest">${arm(64, 116, 80, 140, 70, 162, '#255A99', C)}${frothy(76, 156)}</g>` +
    `<g class="c-sip">${arm(64, 116, 84, 128, 62, 104, '#255A99', C)}${frothy(58, 98, -28)}</g>` +
    `<g class="c-reach">${arm(64, 116, 92, 134, 112, 149, '#255A99', C)}</g>` +
    `</g>` +
    // the seller, behind the table
    `<g class="seller">` +
    `<path d="M184 112 Q210 100 236 112 L244 200 L176 200 Z" fill="#2E7D32"/><path d="M216 104 Q230 106 236 112 L244 200 L218 200 Q224 150 216 104 Z" fill="#000" opacity=".18"/><path d="M190 126 Q186 166 184 200 M226 128 Q232 166 236 200" stroke="#000" stroke-opacity=".13" stroke-width="1.6" fill="none"/><path d="M210 106 V200" stroke="#1B5E20" stroke-width="1.6"/><path d="M198 106 Q210 120 222 106" stroke="#E8DDB8" stroke-width="2" fill="none"/>` +
    `<rect x="204" y="92" width="12" height="12" fill="${S}"/>` + face(210, 80, 17, S) + hula(210, 80, 17) +
    `<g class="p-pull">${pull(1, 'pa')}${pull(-1, 'pb')}</g>` +
    // handing a fresh cup to the man at the end of the table
    `<g class="p-give">${arm(188, 114, 150, 128, 130, 150, SL, S)}${arm(232, 114, 246, 150, 238, 180, SL, S)}${frothy(121, 146)}</g>` +
    // cracking a brown egg over the pan
    `<g class="p-crack">${restL}${arm(232, 114, 290, 100, 318, 122, SL, S)}` +
    `<g class="shell"><path class="sh1" d="M314 128 Q314 120 320 120 L320 132 Q314 132 314 128 Z" fill="#C88C58"/><path class="sh2" d="M326 128 Q326 120 320 120 L320 132 Q326 132 326 128 Z" fill="#A86E40"/></g>` +
    `<ellipse class="drip" cx="320" cy="140" rx="3" ry="4" fill="#F5B21C"/></g>` +
    // frying: the spatula in the pan
    `<g class="p-fry">${restL}${arm(232, 114, 268, 140, 296, 146, SL, S)}<path d="M296 146 L318 152" stroke="#8E979F" stroke-width="3" stroke-linecap="round"/><path d="M316 149 l12 3 l-1 5 l-12 -3 Z" fill="#B7C0C8"/></g>` +
    // breaking the loaf: the halves part, the egg goes in, they close again
    `<g class="p-bread">${arm(188, 114, 188, 140, 196, 152, SL, S)}${arm(232, 114, 232, 140, 226, 152, SL, S)}` +
    `<g class="bsl"><ellipse cx="211" cy="146" rx="11" ry="3.4" fill="#FBF6EA"/><circle cx="211" cy="145" r="2.6" fill="#F5B21C"/></g>` +
    `<path class="bl" d="M198 154 L198 146 Q198 140 204 140 L211 140 L211 154 Z" fill="#E7B46E" stroke="#9C5524" stroke-width="1.2"/>` +
    `<path class="br" d="M211 154 L211 140 L218 140 Q224 140 224 146 L224 154 Z" fill="#E7B46E" stroke="#9C5524" stroke-width="1.2"/></g>` +
    `</g>` +
    // the table
    `<rect x="78" y="186" width="284" height="12" rx="3" fill="#B98250"/><path d="M84 198 H356 L352 250 H88 Z" fill="url(#ts-wood)"/>` +
    `<path d="M88 214 H352 M88 232 H352" stroke="#5E3A1C" stroke-width="1.4" opacity=".6"/><path d="M92 250 V262 M348 250 V262" stroke="#4E2E14" stroke-width="6"/>` +
    `<path d="M84 186 H356" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/>` +
    `<g class="tsign" transform="translate(22 148)"><rect x="108" y="56" width="98" height="30" rx="3" fill="#1E6B3A" stroke="#F4EBD0" stroke-width="2.4"/>` +
    `<text x="146" y="78" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="19" fill="#FFD54A">SHAYI</text>` +
    `<use href="#ts-cup" x="190" y="70"/></g>` +
    // on the table: tins of milk, a box of cube sugar, a green tin of cocoa drink, the tray of brown eggs, the bread, the kettle
    `<use href="#ts-tin" x="82" y="171"/><use href="#ts-tin" x="96" y="171"/>` +
    `<path d="M112 172 H132 V186 H112 Z" fill="#F7F7F2"/><path d="M112 172 H132 V177 H112 Z" fill="#2F6DB5"/><path d="M127 172 H132 V186 H127 Z" fill="#000" opacity=".12"/><path d="M116 167 h5 v5 h-5 Z M121.6 168.4 h4.4 v3.6 h-4.4 Z" fill="#fff" stroke="#D6D6D0" stroke-width=".6"/>` +
    `<rect x="134" y="162" width="15" height="24" rx="2" fill="#2E7D32"/><path d="M134 169 H149 V178 H134 Z" fill="#F4F1E6"/><path d="M134 173.5 H149" stroke="#C62828" stroke-width="1.6"/><rect x="134" y="162" width="15" height="24" rx="2" fill="url(#ts-cyl)"/><ellipse cx="141.5" cy="162.4" rx="7.5" ry="1.7" fill="#C9D1D8"/>` +
    // the egg tray: grey pulp card, a back row of eggs, its front lip, a front row
    `<path d="M151 176 Q153 168 158 170 Q163 166 168 170 Q173 166 178 170 Q183 166 188 170 Q194 168 196 176 L197 186 H150 Z" fill="#B9B0A2"/>` +
    [156, 166, 176, 186].map((x) => `<use href="#ts-egg" x="${x}" y="167"/>`).join('') +
    `<path d="M150 177 Q155 173 160 177 Q165 173 170 177 Q175 173 180 177 Q185 173 190 177 Q195 173 198 177 L197 186 H150 Z" fill="#A79D8E"/>` +
    [161, 171, 181, 191].map((x) => `<use href="#ts-egg" x="${x}" y="176"/>`).join('') +
    `<use href="#ts-loaf" x="203" y="151"/><use href="#ts-loaf" x="197" y="164"/>` +
    `<g transform="translate(244 141) scale(.92)"><path d="M6 46 Q0 18 22 14 Q44 18 38 46 Z" fill="url(#ts-steel)"/><path d="M38 30 Q48 28 52 18" stroke="#9AA3AD" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M10 18 Q22 0 34 18" stroke="#5E5E5E" stroke-width="3" fill="none"/><ellipse cx="22" cy="14" rx="7" ry="2.4" fill="#5E5E5E"/></g>` +
    // the sandwich, set on a plate for the man at the end of the table
    `<g class="plate"><ellipse cx="104" cy="186" rx="18" ry="4" fill="#E8EEF2"/><path d="M92 184 Q92 176 100 176 L110 176 Q116 176 116 184 Z" fill="#E7B46E"/><path d="M92 181 Q92 176 100 176 L110 176 Q116 176 116 181 Z" fill="#9C5524"/><path d="M94 182.6 H114" stroke="#F5B21C" stroke-width="1.6"/></g>` +
    // the charcoal stove and the pan
    `<path d="M292 186 L348 186 L342 162 L298 162 Z" fill="#3A3A3A"/><ellipse cx="320" cy="162" rx="22" ry="6" fill="url(#ts-coal)"/>` +
    `<ellipse cx="320" cy="156" rx="28" ry="7" fill="#2A2A2A"/><path d="M347 155 L372 148" stroke="#222" stroke-width="4" stroke-linecap="round"/>` +
    `<g class="pegg"><g class="pflip"><ellipse cx="318" cy="154" rx="15" ry="4.4" fill="#FBF6EA"/><circle class="ys" cx="320" cy="153.4" r="4" fill="#F5B21C"/><ellipse class="yb" cx="319" cy="153.6" rx="9" ry="2.6" fill="#E3B15C"/></g></g>` +
    `<path class="sizzle" d="M306 150 m-1.4 0 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0 M330 149 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0 M314 146 m-1 0 a1 1 0 1 0 2 0 a1 1 0 1 0 -2 0" fill="#fff"/>` +
    // Indomie on the ground (Sani 2026-10-28): a kerosene stove, a pot of noodles boiling on it with an egg broken in, the
    // helper stirring it while he waits; packets of noodles beside it (no names on them)
    `<ellipse cx="316" cy="261" rx="26" ry="3.4" fill="#000" opacity=".35"/>` +
    `<path d="M298 246 H334 L332 260 H300 Z" fill="#2D6E8E"/><path d="M322 246 H334 L332 260 H320 Z" fill="#000" opacity=".22"/><ellipse cx="316" cy="246" rx="18" ry="3.4" fill="#4C93B4"/>` +
    `<path d="M306 245 q1 -5 2.4 -1 q1.4 -6 2.6 0 q1.2 -5 2.6 0 q1.4 -6 2.6 0 q1.2 -5 2.4 1 Z" fill="#F57C00"/><path d="M298 244 L304 238 M334 244 L328 238" stroke="#222" stroke-width="2"/>` +
    `<path d="M292 222 Q292 240 296 240 H336 Q340 240 340 222 Z" fill="url(#ts-steel)"/><path d="M291 225 h-5 M341 225 h5" stroke="#8E979F" stroke-width="2.6" stroke-linecap="round"/>` +
    `<ellipse cx="316" cy="222" rx="24" ry="6" fill="#DCE2E7"/><ellipse cx="316" cy="222.6" rx="21.4" ry="4.8" fill="url(#ts-ndl)"/>` +
    `<path d="M295 222 Q316 216 337 222 Q316 219.6 295 222 Z" fill="#000" opacity=".22"/>` +
    `<path d="M318 221 q3 -3 7 -1.6 q5 .2 3.4 2.6 q-2 2 -7 1.4 q-5 -.4 -3.4 -2.4 Z" fill="#FBF6EA"/><circle cx="323" cy="221.2" r="2" fill="#F5A81C"/><path d="M302 223 h2.4 M309 224.6 h2 M306 220.4 h1.6" stroke="#2E7D32" stroke-width="1.2"/><path d="M312 225 h1.8 M299 221 h1.6" stroke="#D32F2F" stroke-width="1.2"/>` +
    `<g class="psteam" fill="#fff"><path d="M306 214 q-6 -8 0 -16 q6 -7 1 -15 q8 7 2 15 q-5 8 3 16 Z" opacity=".26"/><path d="M322 214 q-4 -7 1 -13 q4 -6 0 -12 q7 6 2 12 q-4 6 1 13 Z" opacity=".2"/></g>` +
    `<use href="#ts-pk" x="266" y="251"/><use href="#ts-pk" x="268" y="242"/>` +
    `</svg>`;
}

/* one man sitting on the bench, seen from the front, without his arms (the bench draws them pose by pose) */
function sitter(x: number, o: { cap: 'hula' | 'zanna' | 'borno'; robe: string; skin: number; beard?: boolean }): string {
  const sk = SK[o.skin];
  return `<path d="M${x - 13} 190 L${x - 12} 236 M${x + 12} 190 L${x + 12} 236" stroke="${o.robe}" stroke-width="11" stroke-linecap="round"/>` +
    `<path d="M${x - 9} 192 L${x - 9} 236 M${x + 15} 192 L${x + 15} 236" stroke="#000" stroke-opacity=".18" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M${x - 20} 236 h12 v6 h-14 Z M${x + 6} 236 h14 v6 h-12 Z" fill="#3A2A1E"/>` +
    `<path d="M${x - 18} 118 Q${x} 110 ${x + 18} 118 L${x + 22} 184 Q${x + 23} 195 ${x + 12} 194 Q${x + 2} 194 ${x} 189 Q${x - 2} 194 ${x - 12} 194 Q${x - 23} 195 ${x - 22} 184 Z" fill="${o.robe}"/>` +
    `<path d="M${x + 3} 112 Q${x + 14} 113 ${x + 18} 118 L${x + 22} 184 L${x + 5} 184 Q${x + 8} 150 ${x + 3} 112 Z" fill="#000" opacity=".17"/>` +
    `<path d="M${x - 9} 128 Q${x - 12} 156 ${x - 14} 184 M${x - 1} 132 Q${x - 1} 160 ${x - 2} 184 M${x + 9} 130 Q${x + 12} 158 ${x + 14} 184" stroke="#000" stroke-opacity=".14" stroke-width="1.4" fill="none"/>` +
    `<path d="M${x - 22} 184 Q${x} 180 ${x + 22} 184 Q${x + 23} 195 ${x + 12} 194 Q${x + 4} 194 ${x} 189 Q${x - 4} 194 ${x - 12} 194 Q${x - 23} 195 ${x - 22} 184 Z" fill="#000" opacity=".14"/>` +
    `<rect x="${x - 5}" y="104" width="10" height="10" fill="${sk}"/>` + face(x, 96, 13, sk) +
    (o.beard ? `<path d="M${x - 9} 101 Q${x} 116 ${x + 9} 101 Q${x} 108 ${x - 9} 101 Z" fill="#E8E2D6"/>` : '') +
    (o.cap === 'zanna' ? zanna(x, 96, 13) : o.cap === 'borno' ? borno(x, 96, 13) : hula(x, 96, 13));
}

/* the bench: three men with their tea; a cup is passed along from the first to the last, who drinks it */
export function umbrellaBench(): string {
  const A = 72, B = 150, Cx = 228, ka = SK[1], kb = SK[3], kc = SK[2], ra = '#0D47A1', rb = '#4E342E', rc = '#33691E';
  return `<svg class="ubench" viewBox="0 0 300 260" aria-hidden="true"><ellipse cx="150" cy="252" rx="138" ry="6" fill="rgba(0,0,0,.35)"/>` +
    // a tarpaulin stretched on two poles shades the bench too
    `<path d="M14 250 V30 M286 250 V30" stroke="#5E3A1C" stroke-width="5"/>` +
    `<path class="tarp" d="M4 26 L296 26 L296 40 Q222 56 150 44 Q78 56 4 40 Z" fill="#1E5AA8"/><path d="M4 26 L296 26 L296 31 L4 31 Z" fill="#2F78D0"/><path d="M40 27 V48 M110 27 V50 M190 27 V50 M260 27 V48" stroke="#174A8C" stroke-width="2"/>` +
    `<rect x="24" y="176" width="252" height="10" rx="2" fill="#9C6A3C"/><path d="M34 186 V244 M266 186 V244" stroke="#5E3A1C" stroke-width="6"/>` +
    // the first man (Sani 2026-10-28): a plate of Indomie with a fried egg on his knees; he lifts a forkful to his mouth now
    // and then. His other hand holds the plate, or the passed cup
    `<g class="sitter">` + sitter(A, { cap: 'hula', robe: '#1E88E5', skin: 1 }) +
    `<ellipse cx="${A + 1}" cy="186.4" rx="20" ry="5.6" fill="#000" opacity=".2"/><ellipse cx="${A}" cy="184" rx="19" ry="5.6" fill="#F4F4F0" stroke="#1E5AA8" stroke-width="1.3"/>` +
    `<path d="M${A - 15} 184 Q${A - 14} 176.4 ${A} 176 Q${A + 14} 176.4 ${A + 15} 184 Q${A} 187.6 ${A - 15} 184 Z" fill="url(#ts-ndl)"/>` +
    `<path d="M${A + 1} 180 q3 -3 7 -1.6 q4 .6 2.6 2.8 q-2 1.6 -6.4 1 q-4.4 -.4 -3.2 -2.2 Z" fill="#FBF6EA"/><circle cx="${A + 5.6}" cy="179.8" r="1.9" fill="#F5A81C"/><path d="M${A - 8} 182 h2 M${A - 3} 179.6 h1.6" stroke="#2E7D32" stroke-width="1.1"/>` +
    `<g class="a-eat">${arm(A - 16, 124, A - 28, 158, A - 9, 178, ra, ka)}<path d="M${A - 9} 178 L${A - 2} 182.6" stroke="#B7C0C8" stroke-width="1.6" stroke-linecap="round"/></g>` +
    `<g class="a-bite">${arm(A - 16, 124, A - 32, 128, A - 9, 112, ra, ka)}<path d="M${A - 9} 112 L${A - 3} 103.6" stroke="#B7C0C8" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="M${A - 4.4} 104.4 q-1.6 2.6 0 5 t0 5 M${A - 2.6} 104 q1.4 2.4 0 4.6 t0 4.4 M${A - 3.4} 104.2 q-.6 3 .6 6" stroke="#E7B44A" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>` +
    `<g class="a-cup">${arm(A + 16, 124, A + 24, 150, A + 10, 162, ra, ka)}${frothy(A + 12, 154)}</g>` +
    `<g class="a-reach">${arm(A + 16, 124, A + 28, 136, 106, 149, ra, ka)}</g>` +
    `<g class="a-rest">${arm(A + 16, 124, A + 26, 156, A + 14, 182, ra, ka)}</g></g>` +
    // the second man, the elder in the zanna: takes the cup from the left and passes it on to the right
    `<g class="sitter">` + sitter(B, { cap: 'borno', robe: '#8D6E63', skin: 3, beard: true }) +
    `<g class="b-lreach">${arm(B - 16, 124, B - 28, 136, 116, 149, rb, kb)}</g>` +
    `<g class="b-lhold">${arm(B - 16, 124, B - 22, 150, B - 4, 156, rb, kb)}${frothy(B - 2, 148)}</g>` +
    `<g class="b-lrest">${arm(B - 16, 124, B - 24, 150, B - 10, 164, rb, kb)}</g>` +
    `<g class="b-rreach">${arm(B + 16, 124, B + 28, 136, 184, 149, rb, kb)}</g>` +
    `<g class="b-rrest">${arm(B + 16, 124, B + 24, 150, B + 10, 164, rb, kb)}</g></g>` +
    // the third man: takes the cup and drinks
    `<g class="sitter">` + sitter(Cx, { cap: 'hula', robe: '#7CB342', skin: 2 }) +
    `<g class="cc-rest">${arm(Cx - 16, 124, Cx - 24, 150, Cx - 10, 164, rc, kc)}</g>` +
    `<g class="cc-reach">${arm(Cx - 16, 124, Cx - 28, 136, 194, 149, rc, kc)}</g>` +
    `<g class="cc-cup">${arm(Cx - 16, 124, Cx - 22, 150, Cx - 4, 158, rc, kc)}${frothy(Cx - 2, 150)}</g>` +
    `<g class="cc-sip">${arm(Cx - 16, 124, Cx - 30, 128, Cx - 8, 108, rc, kc)}${frothy(Cx - 4, 100, 28)}</g>` +
    arm(Cx + 16, 124, Cx + 24, 150, Cx + 10, 164, rc, kc) + `</g>` +
    // the cup between two hands as it is passed
    `<g class="pass1">${frothy(111, 146)}</g><g class="pass2">${frothy(189, 146)}</g>` +
    // a stool in front with a kettle on it
    `<g transform="translate(130 222)"><path d="M0 0 H40 L36 28 H4 Z" fill="#1E88E5"/><ellipse cx="20" cy="0" rx="20" ry="4" fill="#42A5F5"/>` +
    `<path d="M8 -2 Q4 -20 20 -22 Q36 -20 32 -2 Z" fill="#C62828"/><path d="M32 -12 Q40 -14 42 -22" stroke="#C62828" stroke-width="3" fill="none"/><ellipse cx="20" cy="-22" rx="5" ry="1.8" fill="#8E1B1B"/></g></svg>`;
}

/* a motorbike, its rider in a cap and sometimes a passenger behind */
export function okada(body = '#1565C0', shirt = '#E65100', passenger = ''): string {
  return `<svg class="okada" viewBox="0 -14 120 94" aria-hidden="true"><ellipse cx="60" cy="76" rx="50" ry="3" fill="rgba(0,0,0,.3)"/>` +
    `<g class="wheel" style="transform-origin:24px 62px"><circle cx="24" cy="62" r="13" fill="#1E1E1E"/><circle cx="24" cy="62" r="5" fill="#9AA3AD"/><path d="M24 50 V74 M12 62 H36" stroke="#9AA3AD" stroke-width="1.4"/></g>` +
    `<g class="wheel" style="transform-origin:96px 62px"><circle cx="96" cy="62" r="13" fill="#1E1E1E"/><circle cx="96" cy="62" r="5" fill="#9AA3AD"/><path d="M96 50 V74 M84 62 H108" stroke="#9AA3AD" stroke-width="1.4"/></g>` +
    (passenger ? `<path d="M30 34 L36 14 Q44 10 50 16 L52 34 Z" fill="${passenger}"/><circle cx="43" cy="6" r="6.4" fill="${SK[1]}"/><path d="M36 4 Q43 -6 50 4 L50 10 Q43 6 36 10 Z" fill="#AD1457"/><path d="M38 34 L34 56" stroke="${passenger}" stroke-width="5" stroke-linecap="round"/>` : '') +
    `<path d="M24 62 L48 42 L84 42 L96 62" stroke="${body}" stroke-width="7" fill="none" stroke-linejoin="round"/><rect x="34" y="34" width="44" height="8" rx="4" fill="#212121"/>` +
    `<path d="M88 42 L96 22 L106 22" stroke="#424242" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="104" cy="34" r="3" fill="#FFF3C0"/>` +
    `<path d="M54 34 L60 12 Q70 8 76 14 L80 34 Z" fill="${shirt}"/><path d="M74 18 L96 24" stroke="${shirt}" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="68" cy="4" r="7" fill="${SK[2]}"/><path d="M61 2 Q62 -6 68 -6 Q74 -6 75 2 Z" fill="#F4EBD0"/><path d="M62 34 L58 56" stroke="#3E2723" stroke-width="5" stroke-linecap="round"/></svg>`;
}

/* someone walking along the road: a man in a kaftan, a woman with a tray on her head, an elder with his stick */
function walker(kind: 'man' | 'woman' | 'elder'): string {
  const legs = (c) => `<path class="lg1" d="M17 62 L15 86" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path class="lg2" d="M23 62 L25 86" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
  if (kind === 'woman') return `<svg viewBox="0 -14 40 104" aria-hidden="true">${legs(SK[1])}` +
    `<path d="M10 30 Q20 24 30 30 L33 82 L7 82 Z" fill="#6A1B9A"/><path d="M9 52 H31" stroke="#FFB300" stroke-width="3"/><path d="M9 64 H32" stroke="#FFB300" stroke-width="2"/>` +
    `<path d="M10 20 Q10 6 20 6 Q30 6 30 20 L32 36 Q20 40 8 36 Z" fill="#00897B"/><circle cx="20" cy="15" r="6" fill="${SK[1]}"/>` +
    `<path d="M26 26 Q34 14 30 0" stroke="${SK[1]}" stroke-width="3.4" fill="none" stroke-linecap="round"/><ellipse cx="20" cy="2" rx="13" ry="3" fill="#B0BEC5"/><circle cx="15" cy="-1" r="3" fill="#FB8C00"/><circle cx="21" cy="-2" r="3" fill="#FB8C00"/><circle cx="26" cy="-1" r="3" fill="#F57C00"/></svg>`;
  const robe = kind === 'elder' ? '#ECEFF1' : '#5C6BC0';
  return `<svg viewBox="0 -14 40 104" aria-hidden="true">${legs(kind === 'elder' ? '#CFD8DC' : '#E8DDB8')}` +
    `<path d="M10 24 Q20 18 30 24 L34 66 L6 66 Z" fill="${robe}"/>` +
    `<circle cx="20" cy="12" r="7" fill="${kind === 'elder' ? SK[0] : SK[3]}"/>` +
    (kind === 'elder' ? `<path d="M13 8 Q13 0 20 0 Q27 0 27 8 Z" fill="#9E1C1C"/><path d="M15 15 Q20 22 25 15" fill="#E8E2D6"/><path d="M32 34 L36 88" stroke="#6D4C2E" stroke-width="2.4" stroke-linecap="round"/><path d="M30 28 L33 40" stroke="${robe}" stroke-width="5" stroke-linecap="round"/>`
      : `<path d="M13 9 Q13 1 20 1 Q27 1 27 9 Z" fill="#F4EBD0"/>`) + `</svg>`;
}

/* the road behind the stand and everyone going along it */
export function roadBehind(): string {
  return `<div class="froad"><i></i></div>` +
    `<div class="fw fwa">${walker('man')}</div><div class="fw fwb rev">${walker('woman')}</div><div class="fw fwc rev">${walker('elder')}</div>` +
    `<div class="fb fba">${okada('#1565C0', '#E65100', '#00897B')}</div><div class="fb fbb rev">${okada('#C62828', '#37474F')}</div>`;
}

/* who can be served, and where (Sani 2026-10-26): the man at the end of the table and the three on the bench. Each order
   goes to someone other than the last; x is the hand and head across the stage (cqw), hand/head the height from the
   bottom (cqw), worked out from where teaStall and umbrellaBench are placed in teastall.css. */
export const CUSTOMERS = [
  { x: 7.6, hand: 15, head: 26.4 },     // the man standing at the stand
  { x: 73.8, hand: 14.5, head: 25 },    // the bench: first man, the elder, the last man
  { x: 82, hand: 15.5, head: 25 },
  { x: 90.4, hand: 15.2, head: 25 },
];

/* what each order becomes when it is served, drawn (60×60): where it makes sense the thing is used, not handed over
   bare — the egg comes fried on a plate, the sugar drops into a cup of tea, the milk is poured into it, the spoon stirs
   it, the kettle fills the cup; water is a sachet of pure water */
export function served(w: string): string {
  const cup = (tea = '#B0703A') => `<path d="M17 26 L43 26 L41 52 L19 52 Z" fill="#F4F4F4"/><path d="M18 46 H42" stroke="#1E5AA8" stroke-width="2.4"/><ellipse cx="30" cy="26" rx="13" ry="3.6" fill="${tea}"/>`;
  const froth = `<ellipse cx="30" cy="25" rx="13" ry="4" fill="#E9CFA6"/><circle cx="25" cy="22.6" r="4" fill="#FBF1DD"/><circle cx="32" cy="21.6" r="4.4" fill="#FBF1DD"/><circle cx="38" cy="23.6" r="3" fill="#FBF1DD"/>`;
  const steam = `<g class="sv-steam"><path d="M26 16 q-3 -4 0 -8 q3 -4 0 -8" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/><path d="M34 16 q-3 -4 0 -8" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/></g>`;
  const D = {
    tea: cup() + froth + steam,
    bread: `<path d="M6 40 Q6 24 22 24 L38 24 Q54 24 54 40 L54 46 L6 46 Z" fill="#D9A55A"/><path d="M6 40 Q6 24 22 24 L38 24 Q54 24 54 40" fill="none" stroke="#A86E2C" stroke-width="2"/><path d="M16 27 L21 38 M28 25 L33 38 M40 27 L45 38" stroke="#B57A36" stroke-width="2.4"/>`,
    egg: `<ellipse cx="30" cy="40" rx="26" ry="9" fill="#E8EEF2"/><ellipse cx="30" cy="38" rx="20" ry="6.4" fill="#C9D3DA"/><path d="M14 37 Q12 30 22 31 Q28 26 36 30 Q46 29 45 36 Q46 42 34 42 Q20 44 14 37 Z" fill="#FBF6EA"/><ellipse cx="30" cy="35" rx="6" ry="4.4" fill="#F5B21C"/><ellipse cx="28.4" cy="33.6" rx="2" ry="1.2" fill="#FFE08A"/>`,
    sugar: cup() + `<g class="sv-drop"><rect x="25" y="4" width="8" height="8" rx="1" fill="#fff" stroke="#D8D8D8"/><rect x="31" y="12" width="7" height="7" rx="1" fill="#fff" stroke="#D8D8D8"/></g>`,
    milk: `<g transform="rotate(-35 44 12)"><rect x="36" y="2" width="16" height="20" rx="2" fill="#E8EEF7"/><rect x="36" y="8" width="16" height="7" fill="#1E5AA8"/></g><path class="sv-pour" d="M35 16 Q31 20 31 26" stroke="#FBF6EA" stroke-width="3" fill="none"/>` + cup('#C8915A') + `<path d="M22 26 q8 3 16 0" stroke="#FBF6EA" stroke-width="1.6" fill="none"/>`,
    cup: `<path d="M14 18 L44 18 L41 52 L17 52 Z" fill="#F4F4F4"/><path d="M15 46 H43" stroke="#1E5AA8" stroke-width="2.4"/><ellipse cx="29" cy="18" rx="15" ry="4" fill="#DCE3E8"/><path d="M43 26 Q54 28 51 38 Q48 44 42 42" stroke="#F4F4F4" stroke-width="4" fill="none"/>`,
    spoon: cup() + froth + `<g class="sv-stir"><path d="M30 26 L42 4" stroke="#B7C0C8" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="43" cy="3" rx="3" ry="4.4" transform="rotate(30 43 3)" fill="#CFD8DC"/></g>`,
    kettle: `<g transform="rotate(-28 18 20)"><path d="M4 32 Q0 14 16 12 Q32 14 28 32 Z" fill="#B7C0C8"/><path d="M28 22 Q36 20 38 14" stroke="#9AA3AD" stroke-width="3" fill="none" stroke-linecap="round"/></g><path class="sv-pour" d="M36 10 Q38 18 34 26" stroke="#C98A4A" stroke-width="2.6" fill="none"/>` + cup() + steam,
    water: `<path d="M14 14 Q30 8 46 14 L48 48 Q30 56 12 48 Z" fill="#E3F2FD" stroke="#90CAF9" stroke-width="1.4"/><path d="M14 14 Q30 8 46 14 L46 20 Q30 15 14 20 Z" fill="#BBDEFB"/>` +
      `<text x="30" y="34" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="8" fill="#1565C0">PURE</text><text x="30" y="43" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="8" fill="#1565C0">WATER</text>`,
  };
  return `<svg class="sv" viewBox="0 0 60 60" aria-hidden="true">${D[w] || D.tea}</svg>`;
}

/* the seller's helper (Sani 2026-10-26), a grown man in a yellow shirt and an apron, who carries the orders to the bench
   on a tray held up at his shoulder. 70×150; his legs (.wl1/.wl2) swing while he walks */
export function waiter(): string {
  const sk = SK[3];
  return `<svg class="twsvg" viewBox="0 0 70 150" aria-hidden="true"><ellipse cx="35" cy="147" rx="20" ry="3" fill="rgba(0,0,0,.3)"/>` +
    `<g class="wl1"><path d="M30 96 L28 142" stroke="#37474F" stroke-width="8" stroke-linecap="round"/><path d="M22 142 h10 v4 h-12 Z" fill="#212121"/></g>` +
    `<g class="wl2"><path d="M40 96 L42 142" stroke="#37474F" stroke-width="8" stroke-linecap="round"/><path d="M38 142 h12 v4 h-10 Z" fill="#212121"/></g>` +
    `<path d="M20 52 Q35 44 50 52 L52 100 L18 100 Z" fill="#F9A825"/><path d="M24 62 L46 62 L48 100 L22 100 Z" fill="#F4EBD0"/><path d="M24 62 Q35 56 46 62" stroke="#C9A15E" stroke-width="1.4" fill="none"/>` +
    `<g class="hang"><path d="M21 56 Q12 76 18 92" stroke="#F9A825" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="18" cy="93" r="3.6" fill="${sk}"/></g>` +
    // while he waits he stirs the pot of Indomie on the stove beside him (teaStall), a fork in his hand
    `<g class="stir"><path d="M21 56 Q4 68 6 86" stroke="#F9A825" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M8 84 L-8 97" stroke="#9AA3AD" stroke-width="1.8" stroke-linecap="round"/><circle cx="6" cy="87" r="3.6" fill="${sk}"/></g>` +
    `<path d="M49 56 Q60 54 59 40" stroke="#F9A825" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="59" cy="39" r="3.6" fill="${sk}"/>` +
    `<ellipse cx="59" cy="35.4" rx="15" ry="3" fill="#B0BEC5"/><ellipse cx="59" cy="34.6" rx="13" ry="2" fill="#CFD8DC"/>` +
    `<rect x="31" y="40" width="8" height="8" fill="${sk}"/><circle cx="35" cy="32" r="11" fill="${sk}"/><circle cx="31" cy="31" r="1.4" fill="#1A0E06"/><circle cx="39" cy="31" r="1.4" fill="#1A0E06"/>` +
    `<path d="M30 37.6 Q35 40.4 40 37.6" stroke="#3A1A0A" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M26 36 Q35 46 44 36 Q40 44 35 44 Q30 44 26 36 Z" fill="#2A1A10" opacity=".85"/>` +
    arewaCap('hula', 35, 27.6, 10.2, '#F4EBD0', '#2E5E3A') + `</svg>`;
}

/* the tea seller's pleasure: two quick taps of the spoon on the cup */
let tac = null;
export function cupTap(happy = true): void {
  try { tac = liveAC(tac); } catch (e) { return; }
  const n = happy ? [[2600, 0], [3100, .14]] : [[900, 0]];
  n.forEach(([f, d]) => { const t = tac.currentTime + .03 + d, o = tac.createOscillator(), g = tac.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
    if (!happy) o.frequency.exponentialRampToValueAtTime(500, t + .4);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(happy ? .08 : .06, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + (happy ? .35 : .5)); o.connect(g).connect(tac.destination); o.start(t); o.stop(t + .6); });
}
