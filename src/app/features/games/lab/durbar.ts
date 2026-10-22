// @ts-nocheck
/*
 * Hawan Sallah (Sani 2026-10-22): every horseman different, as at a real Sallah durbar. Six riders and horses: coat
 * (bay, chestnut, grey, black, dun, roan), the caparison's colours and pattern (quilted diamonds, stripes, checks,
 * stars), the headdress and plume, the rider's robe, turban and veil, sword or spear. The emir sits on his throne
 * under the royal umbrella and shows how he feels.
 *
 * Moving parts carry classes that gamelab.css animates by transform and opacity only:
 *   rider:  .hrs (the whole horse, rears and kneels) · .lg a–d (legs, gallop) · .fleg (front legs, fold to kneel) ·
 *           .hhead (head, droops when sad) · .sword (salute) · .r-smile / .r-frown · .r-eyes-happy / .r-eyes-sad
 *   emir:   .e-head (turns away) · .e-smile / .e-frown · .e-brow · .e-rest / .e-fold (hands on knees, arms folded)
 */
const SKIN = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022'];
interface V { coat: [string, string]; mane: string; cap: [string, string, string]; pat: 'diamond' | 'stripe' | 'check' | 'star'; plume: string; robe: string; trim: string; turban: string; veil: boolean; spear: boolean; skin: number; flag: [string, string]; }
const RIDERS: V[] = [
  { coat: ['#8B5A2B', '#4E2E14'], mane: '#1A0E06', cap: ['#B71C1C', '#2E7D32', '#FFD54A'], pat: 'diamond', plume: '#C62828', robe: '#FFFFFF', trim: '#2E7D32', turban: '#FFFFFF', veil: false, spear: false, skin: 0, flag: ['#C62828', '#FFD54A'] },
  { coat: ['#B5562A', '#7A3416'], mane: '#4E1E08', cap: ['#1A237E', '#FFD54A', '#FFFFFF'], pat: 'stripe', plume: '#FFD54A', robe: '#283593', trim: '#FFD54A', turban: '#FFFFFF', veil: true, spear: true, skin: 1, flag: ['#1565C0', '#FFFFFF'] },
  { coat: ['#E8E4DC', '#A9A49A'], mane: '#8C877C', cap: ['#2E7D32', '#C62828', '#FFD54A'], pat: 'check', plume: '#2E7D32', robe: '#F4EBD0', trim: '#C62828', turban: '#C62828', veil: false, spear: false, skin: 2, flag: ['#2E7D32', '#FFD54A'] },
  { coat: ['#3A2A20', '#120A06'], mane: '#000000', cap: ['#FFB300', '#6A1B9A', '#FFFFFF'], pat: 'star', plume: '#FFFFFF', robe: '#6A1B9A', trim: '#FFB300', turban: '#FFFFFF', veil: true, spear: false, skin: 3, flag: ['#6A1B9A', '#FFB300'] },
  { coat: ['#C9A262', '#8B6A34'], mane: '#3A2410', cap: ['#C62828', '#FFFFFF', '#1565C0'], pat: 'diamond', plume: '#1565C0', robe: '#FFFFFF', trim: '#1565C0', turban: '#1A237E', veil: false, spear: true, skin: 0, flag: ['#C62828', '#FFFFFF'] },
  { coat: ['#9A8478', '#5E4A40'], mane: '#2B1E18', cap: ['#00695C', '#FFD54A', '#C62828'], pat: 'stripe', plume: '#FFD54A', robe: '#B71C1C', trim: '#FFD54A', turban: '#FFFFFF', veil: true, spear: false, skin: 1, flag: ['#00695C', '#FFD54A'] },
];
export const RIDER_COUNT = RIDERS.length;
let gid = 0;

export function durbarRider(L: string, vi = 0): string {
  const v = RIDERS[vi % RIDERS.length], id = 'dr' + (gid++), sk = SKIN[v.skin];
  const disc = (x, y, r = 2.3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#E8B730" stroke="#8A6410" stroke-width=".6"/>`;
  let pat = '';
  if (v.pat === 'diamond') for (let x = 90; x < 170; x += 12) for (let y = 98; y < 146; y += 12) pat += `<path d="M${x} ${y} l6 -6 l6 6 l-6 6 Z" fill="${v.cap[1]}" opacity=".85"/>`;
  if (v.pat === 'stripe') for (let x = 88; x < 176; x += 10) pat += `<path d="M${x} 92 L${x + 2} 150" stroke="${(x / 10) % 2 ? v.cap[1] : v.cap[2]}" stroke-width="4"/>`;
  if (v.pat === 'check') for (let x = 88; x < 172; x += 10) for (let y = 94; y < 148; y += 10) if (((x + y) / 10) % 2 < 1) pat += `<rect x="${x}" y="${y}" width="10" height="10" fill="${v.cap[1]}" opacity=".8"/>`;
  if (v.pat === 'star') for (let x = 96; x < 170; x += 18) for (let y = 102; y < 146; y += 16) pat += `<path d="M${x} ${y - 5} l1.6 3.6 l3.9 .4 l-3 2.6 l.9 3.8 l-3.4 -2 l-3.4 2 l.9 -3.8 l-3 -2.6 l3.9 -.4 Z" fill="${v.cap[1]}"/>`;
  let fringe = ''; for (let x = 86; x < 176; x += 5) fringe += `<path d="M${x} 150 l2.5 7 l2.5 -7 Z" fill="${(x / 5) % 2 ? v.cap[2] : v.cap[1]}"/>`;
  let tassels = ''; [[190, 72], [196, 62], [201, 54], [186, 84]].forEach(([x, y], k) => { const c = [v.cap[0], v.cap[1], v.cap[2], v.plume][k]; tassels += `<path d="M${x} ${y} l-2 13" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x - 2}" cy="${y + 14}" r="2" fill="${c}"/>`; });
  let mane = ''; for (let k = 0; k < 9; k++) { const t = k / 8, x = 206 - t * 30, y = 46 + t * 52; mane += `<path d="M${x} ${y} q-7 3 -9 10" stroke="${v.mane}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }
  let tail = ''; for (let k = 0; k < 6; k++) tail += `<path d="M80 106 Q${58 - k * 2} ${118 + k * 3} ${54 + k * 3} ${168 + k * 4}" stroke="${v.mane}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  const leg = (cls, d, c) => `<path class="lg ${cls}" d="${d}" fill="${c}"/>`;
  const hoof = (x) => `<path d="M${x - 1} 204 h11 l1 6 h-13 Z" fill="#1A0E06"/>`;
  return `<svg class="rider dur" viewBox="30 -22 232 248" aria-hidden="true"><defs>` +
    `<linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${v.coat[0]}"/><stop offset="1" stop-color="${v.coat[1]}"/></linearGradient></defs>` +
    `<ellipse cx="140" cy="214" rx="96" ry="6" fill="rgba(40,24,10,.28)"/>` +
    `<g class="hrs">` +
    `<g class="flag"><path d="M114 -16 L120 112" stroke="#5E3A1C" stroke-width="3"/><path d="M113 -14 l2 -7 l2 7 Z" fill="#C9A227"/>` +
    `<path class="cloth" d="M114 -10 L60 -4 Q70 10 60 24 L116 28 Z" fill="${v.flag[0]}"/><path d="M114 -10 L60 -4 L60 0 L114 -6 Z" fill="${v.flag[1]}"/>` +
    `<text x="87" y="20" text-anchor="middle" class="flagL">${L}</text></g>` +
    `<g class="tail">${tail}</g>` +
    leg('b', 'M106 130 C104 150 112 160 110 176 L108 204 L118 204 L120 176 C124 160 122 146 124 132 Z', v.coat[1]) + hoof(108) +
    `<g class="fleg">` + leg('d', 'M186 132 L190 174 L188 204 L198 204 L200 174 L200 134 Z', v.coat[1]) + hoof(188) + `</g>` +
    `<path d="M80 112 C78 92 94 84 114 84 C142 82 162 80 178 86 C194 92 204 104 202 122 C200 138 188 144 174 142 L106 144 C90 144 80 132 80 112 Z" fill="url(#${id}c)"/>` +
    `<ellipse cx="98" cy="108" rx="24" ry="26" fill="url(#${id}c)"/>` +
    leg('a', 'M90 128 C88 150 96 160 94 176 L92 204 L102 204 L104 176 C108 160 106 146 108 132 Z', v.coat[0]) + hoof(92) +
    `<g class="fleg">` + leg('c', 'M172 132 L176 174 L174 204 L184 204 L186 174 L186 134 Z', v.coat[0]) + hoof(174) + `</g>` +
    `<path d="M84 92 L174 90 Q184 116 176 150 L88 151 Q78 120 84 92 Z" fill="${v.cap[0]}"/><clipPath id="${id}k"><path d="M84 92 L174 90 Q184 116 176 150 L88 151 Q78 120 84 92 Z"/></clipPath>` +
    `<g clip-path="url(#${id}k)">${pat}</g><path d="M84 92 L174 90 Q184 116 176 150 L88 151 Q78 120 84 92 Z" fill="none" stroke="${v.cap[2]}" stroke-width="3"/>` + fringe +
    disc(92, 96) + disc(130, 92) + disc(168, 94) + disc(90, 146) + disc(132, 148) + disc(172, 146) +
    `<g class="hhead"><path d="M174 100 C180 78 194 60 208 48 L224 56 C218 72 212 92 200 120 Z" fill="url(#${id}c)"/>${mane}${tassels}` +
    `<path d="M206 46 C212 38 224 36 234 42 L248 58 C252 64 248 70 240 69 L226 66 C216 64 208 58 206 46 Z" fill="${v.coat[0]}"/>` +
    `<path d="M226 66 C232 70 240 70 246 66" stroke="${v.coat[1]}" stroke-width="2" fill="none"/><path d="M212 40 L214 26 L220 39 Z M218 38 L222 26 L226 40 Z" fill="${v.coat[1]}"/>` +
    `<circle cx="227" cy="48" r="2.4" fill="#1A0E06"/><path d="M223 45 q4 -3 8 0" stroke="${v.coat[1]}" stroke-width="1.2" fill="none"/><ellipse cx="244" cy="61" rx="2" ry="1.4" fill="#1A0E06"/>` +
    `<path d="M212 44 L246 58 M224 40 L228 66 M234 44 L240 64" stroke="${v.cap[0]}" stroke-width="2.2"/>` + disc(228, 52, 2) + disc(238, 56, 1.7) + disc(220, 46, 1.7) +
    `<path d="M216 38 Q222 30 230 36" stroke="${v.cap[1]}" stroke-width="3" fill="none"/>` +
    `<path class="plume" d="M216 30 Q206 6 216 -8 Q226 8 220 30 Z" fill="${v.plume}"/><path d="M217 28 Q213 12 216 0" stroke="${v.cap[2]}" stroke-width="1.6" fill="none"/></g>` +
    `<path d="M180 102 Q194 114 202 130" stroke="${v.cap[1]}" stroke-width="6" fill="none"/>` + disc(186, 108) + disc(193, 117) + disc(199, 126) +
    `<path d="M230 62 Q202 76 168 74" stroke="#3A2410" stroke-width="1.6" fill="none"/>` +
    `<path d="M120 86 Q120 72 128 74 L150 74 Q158 72 158 86 Z" fill="#5E3A1C"/><path d="M118 78 q2 -8 6 -6 M160 78 q-2 -8 -6 -6" stroke="#C9A227" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<g class="rider2">` +
    `<path d="M130 92 L124 128 L132 130" stroke="#3A2410" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M122 130 h14 v4 h-14 Z" fill="#C9A227"/>` +
    `<path d="M114 86 Q106 46 128 32 L150 32 Q170 46 164 82 L176 96 Q168 104 150 102 L124 102 Q110 98 114 86 Z" fill="${v.robe}" stroke="rgba(0,0,0,.15)" stroke-width="1"/>` +
    `<path d="M130 34 L134 70 L142 70 L146 34" fill="none" stroke="${v.trim}" stroke-width="1.8"/><path d="M128 44 q10 6 20 0 M128 52 q10 6 20 0 M130 60 q8 5 16 0" stroke="${v.trim}" stroke-width="1.3" fill="none"/>` +
    `<path d="M146 50 Q160 64 170 72" stroke="${v.robe}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="170" cy="73" r="4" fill="${sk}"/>` +
    (v.spear
      ? `<g class="sword"><path d="M132 44 Q118 30 112 16" stroke="${v.robe}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="111" cy="14" r="4" fill="${sk}"/><path d="M104 40 L118 -18" stroke="#6B4422" stroke-width="2.6"/><path d="M116 -18 l3 -10 l3 10 Z" fill="url(#k4-steel)"/></g>`
      : `<g class="sword"><path d="M132 44 Q118 30 112 16" stroke="${v.robe}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="111" cy="14" r="4" fill="${sk}"/><path d="M110 12 L96 -16" stroke="url(#k4-steel)" stroke-width="3.4" stroke-linecap="round"/><path d="M105 13 h10" stroke="#C9A227" stroke-width="3"/></g>`) +
    `<rect x="133" y="22" width="9" height="10" fill="${sk}"/><circle cx="138" cy="14" r="11" fill="${sk}"/><circle cx="138" cy="14" r="11" fill="url(#k4-shade)"/>` +
    `<g class="r-eyes-happy" fill="none" stroke="#1A0E06" stroke-width="1.6" stroke-linecap="round"><path d="M132 13 q2 -2 4 0 M140 13 q2 -2 4 0"/></g>` +
    `<g class="r-eyes-sad" fill="#1A0E06"><circle cx="134" cy="13" r="1.5"/><circle cx="142" cy="13" r="1.5"/><path d="M131 9 l5 2 M145 9 l-5 2" stroke="#1A0E06" stroke-width="1.2"/></g>` +
    `<path class="r-smile" d="M133 19 Q138 24 143 19" stroke="#3A1A0A" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    `<path class="r-frown" d="M133 22 Q138 18 143 22" stroke="#3A1A0A" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    (v.veil ? `<path d="M127 16 Q138 28 149 16 L149 24 Q138 32 127 24 Z" fill="${v.turban}"/>` : '') +
    `<path d="M124 10 Q124 -10 138 -10 Q154 -10 153 10 Q146 4 138 5 Q130 4 124 10 Z" fill="${v.turban}"/><path d="M125 4 Q138 -4 152 4 M126 -1 Q138 -8 151 -1" stroke="rgba(0,0,0,.15)" stroke-width="1.2" fill="none"/>` +
    `<path d="M126 8 Q120 24 126 34" stroke="${v.turban}" stroke-width="5" fill="none" stroke-linecap="round"/></g>` +
    `</g></svg>`;
}

export function emirThrone(): string {
  let fringe = ''; for (let x = 12; x <= 188; x += 11) fringe += `<path d="M${x} 72 l-3 10 h6 Z" fill="#FFD54A"/>`;
  const S2 = '#5E3A1C';
  return `<svg class="emir dur" viewBox="0 0 200 250" aria-hidden="true">` +
    `<ellipse cx="100" cy="244" rx="80" ry="6" fill="rgba(40,24,10,.28)"/>` +
    `<path d="M100 60 L100 160" stroke="#5E3A1C" stroke-width="4"/>` +
    `<path d="M8 72 Q100 -14 192 72 Z" fill="#C62828"/><path d="M8 72 Q100 -14 192 72" fill="none" stroke="#FFD54A" stroke-width="3"/>` +
    `<path d="M40 44 Q100 6 160 44" fill="none" stroke="#2E7D32" stroke-width="5"/><path d="M60 30 Q100 8 140 30" fill="none" stroke="#FFD54A" stroke-width="2" stroke-dasharray="3 3"/>` +
    fringe + `<circle cx="100" cy="4" r="6" fill="#FFD54A"/>` +
    `<path d="M52 100 Q52 80 70 80 L130 80 Q148 80 148 100 L148 200 L52 200 Z" fill="#2E7D32" stroke="#C9A227" stroke-width="4"/>` +
    `<path d="M62 92 L138 92 M62 104 L138 104" stroke="#FFD54A" stroke-width="1.4" stroke-dasharray="4 3"/>` +
    `<rect x="40" y="180" width="120" height="16" rx="4" fill="#C9A227"/><path d="M48 196 L48 236 M152 196 L152 236" stroke="#8A6410" stroke-width="7"/><rect x="36" y="232" width="128" height="8" rx="3" fill="#8A6410"/>` +
    `<path d="M66 196 Q56 150 74 120 L126 120 Q144 150 134 196 Q100 206 66 196 Z" fill="#FFFFFF" stroke="#D9CBA6" stroke-width="1"/>` +
    `<path d="M92 122 L96 170 L104 170 L108 122" fill="none" stroke="#C9A227" stroke-width="2"/><path d="M88 134 q12 7 24 0 M88 146 q12 7 24 0 M90 158 q10 6 20 0" stroke="#C9A227" stroke-width="1.6" fill="none"/>` +
    `<path d="M74 196 h52 v6 h-52 Z" fill="#E2DCCB"/><path d="M78 202 q-4 10 6 10 h10 v-10 Z M122 202 q4 10 -6 10 h-10 v-10 Z" fill="#8A6410"/>` +
    `<g class="e-rest"><path d="M74 128 Q62 156 70 176" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M126 128 Q138 156 130 176" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/>` +
    `<circle cx="72" cy="180" r="6" fill="${S2}"/><circle cx="128" cy="180" r="6" fill="${S2}"/></g>` +
    `<g class="e-fold"><path d="M74 128 Q74 150 122 150" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M126 128 Q126 158 78 156" stroke="#F4EEDD" stroke-width="14" fill="none" stroke-linecap="round"/>` +
    `<circle cx="122" cy="150" r="6" fill="${S2}"/><circle cx="78" cy="156" r="6" fill="${S2}"/></g>` +
    `<g class="e-head"><rect x="93" y="104" width="14" height="16" fill="${S2}"/>` +
    `<circle cx="100" cy="94" r="17" fill="${S2}"/><circle cx="100" cy="94" r="17" fill="url(#k4-shade)"/>` +
    `<g class="e-pupils"><circle cx="93" cy="92" r="2" fill="#1A0E06"/><circle cx="107" cy="92" r="2" fill="#1A0E06"/></g>` +
    `<path class="e-brow calm" d="M89 86 q4 -2 8 0 M103 86 q4 -2 8 0" stroke="#1A0E06" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path class="e-brow cross" d="M89 84 l8 3 M111 84 l-8 3" stroke="#1A0E06" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path class="e-smile" d="M92 101 Q100 108 108 101" stroke="#3A1A0A" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path class="e-frown" d="M92 104 Q100 98 108 104" stroke="#3A1A0A" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path d="M80 84 Q78 56 100 54 Q122 56 120 84 Q112 76 100 77 Q88 76 80 84 Z" fill="#FFFFFF"/>` +
    `<path d="M88 60 Q86 48 93 54 M112 60 Q114 48 107 54" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    `<path d="M82 74 Q100 64 118 74 M84 66 Q100 58 116 66" stroke="#E2DCCB" stroke-width="1.4" fill="none"/>` +
    `<path d="M82 88 Q80 108 88 116 M118 88 Q120 108 112 116" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round"/></g>` +
    `</svg>`;
}

/* the Sallah around them: kakaki players with their long trumpets, a drummer, the emir's guards (dogarai) */
export function sallahBand(): string {
  const man = (x, robe, hat, inner) => `<g transform="translate(${x} 0)"><path d="M-7 60 L-5 30 Q0 24 5 30 L7 60 Z" fill="${robe}"/><circle cx="0" cy="22" r="5" fill="#5E3A1C"/>` +
    `<path d="M-6 20 Q0 10 6 20 Z" fill="${hat}"/>${inner}</g>`;
  const kakaki = (x, robe) => man(x, robe, '#FFFFFF', `<g class="kakaki"><path d="M3 30 L34 -14" stroke="#D9B44A" stroke-width="2.4"/><path d="M32 -12 l8 -10 l4 6 Z" fill="#E8C35A"/><path d="M2 32 L-3 38 M4 30 Q8 34 10 26" stroke="${robe}" stroke-width="3" stroke-linecap="round"/></g>`);
  const drummer = (x) => man(x, '#B71C1C', '#FFD54A', `<g class="drumarm"><ellipse cx="9" cy="42" rx="5" ry="7" fill="#8B5A2B"/><ellipse cx="9" cy="36" rx="5" ry="1.6" fill="#F1E2C0"/><path d="M4 30 Q12 26 14 32" stroke="#B71C1C" stroke-width="3" fill="none"/></g>`);
  const dogari = (x) => man(x, '#C62828', '#2E7D32', `<path d="M-6 36 h12 M-6 44 h12" stroke="#2E7D32" stroke-width="3"/><path d="M9 0 L9 62" stroke="#6B4422" stroke-width="1.6"/><path d="M7 2 l2 -8 l2 8 Z" fill="#B0BEC5"/>`);
  return `<svg class="sallah" viewBox="0 -28 220 92" aria-hidden="true">${dogari(14)}${kakaki(44, '#C62828')}${kakaki(76, '#2E7D32')}${drummer(110)}${kakaki(140, '#1565C0')}${dogari(200)}</svg>`;
}
