// @ts-nocheck
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
/* an enamel cup of tea with its head of froth, centred on (x,y) */
const frothy = (x, y, tilt = 0) =>
  `<g${tilt ? ` transform="rotate(${tilt} ${x} ${y})"` : ''}><path d="M${x - 7} ${y - 6} L${x + 7} ${y - 6} L${x + 6} ${y + 8} L${x - 6} ${y + 8} Z" fill="#F4F4F4"/>` +
  `<path d="M${x - 6.6} ${y + 5} L${x + 6.4} ${y + 5}" stroke="#1E5AA8" stroke-width="1.6"/><ellipse cx="${x}" cy="${y - 6}" rx="7.4" ry="2.6" fill="#E9CFA6"/>` +
  `<circle cx="${x - 3}" cy="${y - 7.4}" r="2.6" fill="#FBF1DD"/><circle cx="${x + 2}" cy="${y - 8}" r="2.8" fill="#FBF1DD"/><circle cx="${x + 5}" cy="${y - 6.6}" r="1.8" fill="#FBF1DD"/></g>`;
const face = (x, y, r, sk) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${sk}"/><circle cx="${x - r * .35}" cy="${y - 1}" r="1.7" fill="#1A0E06"/><circle cx="${x + r * .35}" cy="${y - 1}" r="1.7" fill="#1A0E06"/>` +
  `<path class="sm-happy" d="M${x - 5} ${y + 6} Q${x} ${y + 10} ${x + 5} ${y + 6}" stroke="#3A1A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
  `<path class="sm-sad" d="M${x - 5} ${y + 9} Q${x} ${y + 5} ${x + 5} ${y + 9}" stroke="#3A1A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
/* caps: the white hula, the embroidered red zanna */
const hula = (x, y, r) => `<path d="M${x - r * .8} ${y - r * .45} Q${x - r * .75} ${y - r * 1.4} ${x} ${y - r * 1.4} Q${x + r * .75} ${y - r * 1.4} ${x + r * .8} ${y - r * .45} Z" fill="#F4EBD0"/><path d="M${x - r * .7} ${y - r * .8} h${r * 1.4}" stroke="#C9A15E" stroke-width="1.1"/>`;
const zanna = (x, y, r) => `<path d="M${x - r * .85} ${y - r * .4} Q${x - r * .8} ${y - r * 1.45} ${x} ${y - r * 1.45} Q${x + r * .8} ${y - r * 1.45} ${x + r * .85} ${y - r * .4} Z" fill="#9E1C1C"/>` +
  `<path d="M${x - r * .8} ${y - r * .75} l${r * .2} -${r * .3} l${r * .2} ${r * .3} l${r * .2} -${r * .3} l${r * .2} ${r * .3} l${r * .2} -${r * .3} l${r * .2} ${r * .3} l${r * .2} -${r * .3} l${r * .2} ${r * .3}" stroke="#1A1A1A" stroke-width="1.2" fill="none"/>`;

/* the stand: the bulb on its pole, the man at the end of the table, the seller, his table, stove, kettle and goods */
export function teaStall(): string {
  const S = SK[0], SL = '#256B2A';     // the seller's skin and sleeve
  const C = SK[2], CL = '#2F6FB5';     // the man at the table
  const loaf = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 10 Q0 0 14 0 L26 0 Q40 0 40 10 L40 14 L0 14 Z" fill="#D9A55A"/><path d="M0 10 Q0 0 14 0 L26 0 Q40 0 40 10" fill="none" stroke="#A86E2C" stroke-width="1.4"/><path d="M8 2 L12 10 M18 1 L22 10 M28 2 L32 10" stroke="#B57A36" stroke-width="1.6"/></g>`;
  const egg = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="6" fill="#F2DEC0"/><ellipse cx="${x - 1.4}" cy="${y - 2}" rx="1.6" ry="2" fill="#fff" opacity=".6"/>`;
  const carton = (x, y) => `<g transform="translate(${x} ${y})"><rect width="56" height="30" rx="2" fill="#F6C21C"/><rect y="0" width="56" height="6" fill="#E3A812"/><path d="M0 24 H56" stroke="#D3242A" stroke-width="4"/>` +
    `<text x="28" y="19" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="11" fill="#D3242A">Indomie</text></g>`;
  const restL = arm(188, 114, 176, 150, 184, 180, SL, S);     // the seller's free hand on the table
  return `<svg class="tstall" viewBox="0 0 380 270" aria-hidden="true">` +
    `<defs><linearGradient id="ts-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A87444"/><stop offset="1" stop-color="#6E4524"/></linearGradient>` +
    `<linearGradient id="ts-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E979F"/><stop offset=".45" stop-color="#EEF2F5"/><stop offset="1" stop-color="#737C85"/></linearGradient>` +
    `<radialGradient id="ts-coal" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#FFE07A"/><stop offset=".5" stop-color="#F57C00"/><stop offset="1" stop-color="#6A1A00"/></radialGradient>` +
    `<radialGradient id="ts-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient></defs>` +
    `<ellipse cx="200" cy="262" rx="182" ry="7" fill="rgba(0,0,0,.35)"/>` +
    // the bulb on a wooden pole
    `<path d="M14 262 V14 H214" stroke="#5E3A1C" stroke-width="5" fill="none"/><path d="M214 14 V30" stroke="#333" stroke-width="2"/>` +
    `<circle class="bulb" cx="214" cy="40" r="66" fill="url(#ts-glow)"/><ellipse cx="214" cy="38" rx="6" ry="8" fill="#FFF3C0"/>` +
    // the man standing at the end of the table, in a kaftan and a zanna cap
    `<g class="cust">` +
    `<path d="M38 230 V254 M58 230 V254" stroke="#E8DDB8" stroke-width="9"/><path d="M30 254 h14 v5 h-16 Z M52 254 h14 v5 h-12 Z" fill="#3A2A1E"/>` +
    `<path d="M30 112 Q48 104 66 112 L74 232 L22 232 Z" fill="${CL}"/><path d="M42 108 Q48 118 54 108" stroke="#E8DDB8" stroke-width="1.6" fill="none"/>` +
    arm(32, 116, 20, 150, 28, 178, '#255A99', C) +
    `<rect x="43" y="96" width="10" height="12" fill="${C}"/>` + face(48, 86, 15, C) + zanna(48, 86, 15) +
    `<g class="c-rest">${arm(64, 116, 80, 140, 70, 162, '#255A99', C)}${frothy(76, 156)}</g>` +
    `<g class="c-sip">${arm(64, 116, 84, 128, 62, 104, '#255A99', C)}${frothy(58, 98, -28)}</g>` +
    `<g class="c-reach">${arm(64, 116, 92, 134, 112, 149, '#255A99', C)}</g>` +
    `</g>` +
    // the seller, behind the table
    `<g class="seller">` +
    `<path d="M184 112 Q210 100 236 112 L244 200 L176 200 Z" fill="#2E7D32"/><path d="M210 106 V200" stroke="#1B5E20" stroke-width="1.6"/><path d="M198 106 Q210 120 222 106" stroke="#E8DDB8" stroke-width="2" fill="none"/>` +
    `<rect x="204" y="92" width="12" height="12" fill="${S}"/>` + face(210, 80, 17, S) + hula(210, 80, 17) +
    // pulling tea: the low cup steady in the left hand, foam rising in it; the high cup in the right hand rises and falls and the stream stretches with it
    `<g class="p-pull">` + arm(188, 114, 206, 156, 244, 154, SL, S) +
    `<path d="M242 142 L262 142 L259 164 L245 164 Z" fill="url(#ts-steel)"/><ellipse class="foam" cx="252" cy="142" rx="10" ry="3" fill="#F3E2C4"/>` +
    `<rect class="stream" x="249.6" y="72" width="3.4" height="70" rx="1.7" fill="#B0703A"/>` +
    `<g class="pour">${arm(232, 114, 258, 100, 236, 70, SL, S)}<g transform="rotate(28 244 66)"><path d="M234 52 L254 52 L251 74 L237 74 Z" fill="url(#ts-steel)"/></g></g></g>` +
    // handing a fresh cup to the man at the end of the table
    `<g class="p-give">${arm(188, 114, 150, 128, 130, 150, SL, S)}${arm(232, 114, 246, 150, 238, 180, SL, S)}${frothy(121, 146)}</g>` +
    // cracking an egg over the pan
    `<g class="p-crack">${restL}${arm(232, 114, 290, 100, 318, 122, SL, S)}` +
    `<g class="shell"><path class="sh1" d="M314 128 Q314 120 320 120 L320 132 Q314 132 314 128 Z" fill="#F2DEC0"/><path class="sh2" d="M326 128 Q326 120 320 120 L320 132 Q326 132 326 128 Z" fill="#E9D2AE"/></g>` +
    `<ellipse class="drip" cx="320" cy="140" rx="3" ry="4" fill="#F5B21C"/></g>` +
    // frying: the spatula in the pan
    `<g class="p-fry">${restL}${arm(232, 114, 268, 140, 296, 146, SL, S)}<path d="M296 146 L318 152" stroke="#8E979F" stroke-width="3" stroke-linecap="round"/><path d="M316 149 l12 3 l-1 5 l-12 -3 Z" fill="#B7C0C8"/></g>` +
    // breaking the loaf: the halves part, the egg goes in, they close again
    `<g class="p-bread">${arm(188, 114, 188, 140, 196, 152, SL, S)}${arm(232, 114, 232, 140, 226, 152, SL, S)}` +
    `<g class="bsl"><ellipse cx="211" cy="146" rx="11" ry="3.4" fill="#FBF6EA"/><circle cx="211" cy="145" r="2.6" fill="#F5B21C"/></g>` +
    `<path class="bl" d="M198 154 L198 146 Q198 140 204 140 L211 140 L211 154 Z" fill="#D9A55A" stroke="#A86E2C" stroke-width="1.2"/>` +
    `<path class="br" d="M211 154 L211 140 L218 140 Q224 140 224 146 L224 154 Z" fill="#D9A55A" stroke="#A86E2C" stroke-width="1.2"/></g>` +
    `</g>` +
    // the table
    `<rect x="78" y="186" width="284" height="12" rx="3" fill="#B98250"/><path d="M84 198 H356 L352 250 H88 Z" fill="url(#ts-wood)"/>` +
    `<path d="M88 214 H352 M88 232 H352" stroke="#5E3A1C" stroke-width="1.4" opacity=".6"/><path d="M92 250 V262 M348 250 V262" stroke="#4E2E14" stroke-width="6"/>` +
    // tins of milk and cocoa, the sugar, the kettle, the tray of eggs and the bread
    `<rect x="84" y="170" width="16" height="16" rx="2" fill="#E8EEF7"/><rect x="84" y="174" width="16" height="6" fill="#1E5AA8"/>` +
    `<rect x="104" y="168" width="22" height="18" rx="1" fill="#FFFFFF"/><rect x="104" y="168" width="22" height="5" fill="#1565C0"/><text x="115" y="182" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="6" fill="#1565C0">SUGAR</text>` +
    `<rect x="130" y="164" width="16" height="22" rx="2" fill="#2E7D32"/><rect x="130" y="170" width="16" height="8" fill="#FFD54A"/>` +
    `<g transform="translate(150 140)"><path d="M6 46 Q0 18 22 14 Q44 18 38 46 Z" fill="url(#ts-steel)"/><path d="M38 30 Q48 28 52 18" stroke="#9AA3AD" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M10 18 Q22 0 34 18" stroke="#5E5E5E" stroke-width="3" fill="none"/><ellipse cx="22" cy="14" rx="7" ry="2.4" fill="#5E5E5E"/></g>` +
    `<rect x="198" y="176" width="44" height="10" rx="1" fill="#D8C7A0"/>` + [0, 1, 2, 3].map((i) => egg(204 + i * 10, 174)).join('') + [0, 1, 2].map((i) => egg(209 + i * 10, 166)).join('') +
    loaf(244, 172) + loaf(250, 160) +
    // the sandwich, set on a plate for the man at the end of the table
    `<g class="plate"><ellipse cx="104" cy="186" rx="18" ry="4" fill="#E8EEF2"/><path d="M92 184 Q92 176 100 176 L110 176 Q116 176 116 184 Z" fill="#D9A55A"/><path d="M94 180 H114" stroke="#FBF6EA" stroke-width="2"/></g>` +
    // the charcoal stove and the pan
    `<path d="M292 186 L348 186 L342 162 L298 162 Z" fill="#3A3A3A"/><ellipse cx="320" cy="162" rx="22" ry="6" fill="url(#ts-coal)"/>` +
    `<ellipse cx="320" cy="156" rx="28" ry="7" fill="#2A2A2A"/><path d="M347 155 L372 148" stroke="#222" stroke-width="4" stroke-linecap="round"/>` +
    `<g class="pegg"><g class="pflip"><ellipse cx="318" cy="154" rx="15" ry="4.4" fill="#FBF6EA"/><circle class="ys" cx="320" cy="153.4" r="4" fill="#F5B21C"/><ellipse class="yb" cx="319" cy="153.6" rx="9" ry="2.6" fill="#E3B15C"/></g></g>` +
    `<g class="sizzle"><circle cx="306" cy="150" r="1.4" fill="#fff"/><circle cx="330" cy="149" r="1.2" fill="#fff"/><circle cx="314" cy="146" r="1" fill="#fff"/></g>` +
    `<g class="steam"><circle cx="316" cy="140" r="5" fill="#fff" opacity=".35"/><circle cx="322" cy="126" r="7" fill="#fff" opacity=".22"/></g>` +
    // Indomie cartons on the ground at the end of the stand
    carton(322, 232) + carton(326, 204) +
    `</svg>`;
}

/* one man sitting on the bench, seen from the front, without his arms (the bench draws them pose by pose) */
function sitter(x: number, o: { cap: 'hula' | 'zanna'; robe: string; skin: number; beard?: boolean }): string {
  const sk = SK[o.skin];
  return `<path d="M${x - 14} 184 L${x - 12} 236 M${x + 12} 184 L${x + 12} 236" stroke="${o.robe}" stroke-width="11" stroke-linecap="round"/>` +
    `<path d="M${x - 20} 236 h12 v6 h-14 Z M${x + 6} 236 h14 v6 h-12 Z" fill="#3A2A1E"/>` +
    `<path d="M${x - 18} 118 Q${x} 110 ${x + 18} 118 L${x + 22} 184 L${x - 22} 184 Z" fill="${o.robe}"/>` +
    `<rect x="${x - 5}" y="104" width="10" height="10" fill="${sk}"/>` + face(x, 96, 13, sk) +
    (o.beard ? `<path d="M${x - 9} 101 Q${x} 116 ${x + 9} 101 Q${x} 108 ${x - 9} 101 Z" fill="#E8E2D6"/>` : '') +
    (o.cap === 'zanna' ? zanna(x, 96, 13) : hula(x, 96, 13));
}

/* the bench: three men with their tea; a cup is passed along from the first to the last, who drinks it */
export function umbrellaBench(): string {
  const A = 72, B = 150, Cx = 228, ka = SK[1], kb = SK[3], kc = SK[2], ra = '#0D47A1', rb = '#4E342E', rc = '#33691E';
  return `<svg class="ubench" viewBox="0 0 300 260" aria-hidden="true"><ellipse cx="150" cy="252" rx="138" ry="6" fill="rgba(0,0,0,.35)"/>` +
    `<rect x="24" y="176" width="252" height="10" rx="2" fill="#9C6A3C"/><path d="M34 186 V244 M266 186 V244" stroke="#5E3A1C" stroke-width="6"/>` +
    // the first man: bread and egg in one hand, the passed cup in the other
    `<g class="sitter">` + sitter(A, { cap: 'hula', robe: '#1E88E5', skin: 1 }) +
    `<g class="a-eat">${arm(A - 16, 124, A - 24, 150, A - 10, 164, ra, ka)}<path d="M${A - 18} 166 Q${A - 18} 158 ${A - 10} 158 L${A - 2} 158 Q${A + 2} 158 ${A + 2} 166 Z" fill="#D9A55A"/><path d="M${A - 16} 162 H${A}" stroke="#FBF6EA" stroke-width="2"/></g>` +
    `<g class="a-bite">${arm(A - 16, 124, A - 28, 120, A - 8, 108, ra, ka)}<path d="M${A - 14} 110 Q${A - 14} 102 ${A - 6} 102 L${A + 2} 102 Q${A + 6} 102 ${A + 6} 110 Z" fill="#D9A55A"/></g>` +
    `<g class="a-cup">${arm(A + 16, 124, A + 24, 150, A + 10, 162, ra, ka)}${frothy(A + 12, 154)}</g>` +
    `<g class="a-reach">${arm(A + 16, 124, A + 28, 136, 106, 149, ra, ka)}</g>` +
    `<g class="a-rest">${arm(A + 16, 124, A + 24, 150, A + 10, 164, ra, ka)}</g></g>` +
    // the second man, the elder in the zanna: takes the cup from the left and passes it on to the right
    `<g class="sitter">` + sitter(B, { cap: 'zanna', robe: '#8D6E63', skin: 3, beard: true }) +
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

/* the tea seller's pleasure: two quick taps of the spoon on the cup */
let tac = null;
export function cupTap(happy = true): void {
  try { tac = tac || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  const n = happy ? [[2600, 0], [3100, .14]] : [[900, 0]];
  n.forEach(([f, d]) => { const t = tac.currentTime + .03 + d, o = tac.createOscillator(), g = tac.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
    if (!happy) o.frequency.exponentialRampToValueAtTime(500, t + .4);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(happy ? .08 : .06, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + (happy ? .35 : .5)); o.connect(g).connect(tac.destination); o.start(t); o.stop(t + .6); });
}
