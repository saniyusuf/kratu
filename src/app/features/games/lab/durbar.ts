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
  return `<svg class="rider dur" viewBox="-54 -116 316 342" aria-hidden="true"><defs>` +
    `<linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${v.coat[0]}"/><stop offset="1" stop-color="${v.coat[1]}"/></linearGradient></defs>` +
    `<ellipse cx="140" cy="213" rx="104" ry="9" fill="url(#k4-shadow)"/>` +
    `<g class="dust"><circle cx="96" cy="206" r="7"/><circle cx="114" cy="207" r="6"/><circle cx="180" cy="206" r="7"/><circle cx="194" cy="207" r="6"/></g>` +
    `<g class="hrs">` +
    /* the letter's banner (Sani 2026-10-23: "the flag with the letter must be huge"): a tall lance planted by the saddle,
       a big cream cloth edged in the rider's colours streaming back behind him, and the letter as large as the cloth allows */
    `<g class="flag"><path d="M116 -100 L120 112" stroke="#5E3A1C" stroke-width="4" stroke-linecap="round"/><path d="M114 -100 l2.5 -12 l2.5 12 Z" fill="#C9A227"/><circle cx="116.5" cy="-99" r="3" fill="#C9A227"/>` +
    `<g class="cloth"><path d="M115 -94 Q60 -104 -40 -92 Q-26 -40 -40 14 Q60 4 116 14 Z" fill="${v.flag[0]}"/>` +
    `<path d="M108 -84 Q58 -92 -26 -82 Q-14 -40 -26 4 Q58 -4 108 4 Z" fill="#FFF8E7"/>` +
    `<path d="M-40 -92 l-10 8 l10 6 M-40 14 l-10 -8 l10 -6" fill="${v.flag[1]}"/>` +
    `<path d="M115 -94 Q60 -104 -40 -92 M-40 14 Q60 4 116 14" stroke="${v.flag[1]}" stroke-width="4" fill="none"/>` +
    `<text x="41" y="-1" text-anchor="middle" class="flagL">${L}</text></g></g>` +
    `<g class="tail">${tail}</g>` +
    leg('b', 'M106 130 C104 150 112 160 110 176 L108 204 L118 204 L120 176 C124 160 122 146 124 132 Z', v.coat[1]) + hoof(108) +
    `<g class="fleg">` + leg('d', 'M186 132 L190 174 L188 204 L198 204 L200 174 L200 134 Z', v.coat[1]) + hoof(188) + `</g>` +
    `<path d="M80 112 C78 92 94 84 114 84 C142 82 162 80 178 86 C194 92 204 104 202 122 C200 138 188 144 174 142 L106 144 C90 144 80 132 80 112 Z" fill="url(#${id}c)"/>` +
    `<ellipse cx="98" cy="108" rx="24" ry="26" fill="url(#${id}c)"/>` +
    `<path d="M80 112 C78 92 94 84 114 84 C142 82 162 80 178 86 C194 92 204 104 202 122 C200 138 188 144 174 142 L106 144 C90 144 80 132 80 112 Z" fill="url(#k4-sheen)"/>` +
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
    `<path d="M114 86 Q106 46 128 32 L150 32 Q170 46 164 82 L176 96 Q168 104 150 102 L124 102 Q110 98 114 86 Z" fill="url(#k4-cloth)"/><path d="M122 58 Q118 80 124 100 M158 56 Q164 78 160 100 M150 84 Q160 92 170 94" stroke="rgba(0,0,0,.13)" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
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
    `<ellipse cx="100" cy="243" rx="92" ry="9" fill="url(#k4-shadow)"/>` +
    `<path d="M100 60 L100 160" stroke="#5E3A1C" stroke-width="4"/>` +
    `<path d="M8 72 Q100 -14 192 72 Z" fill="#C62828"/><path d="M8 72 Q100 -14 192 72 Z" fill="url(#k4-cloth)"/><path d="M8 72 Q100 -14 192 72" fill="none" stroke="#FFD54A" stroke-width="3"/>` +
    `<path d="M40 44 Q100 6 160 44" fill="none" stroke="#2E7D32" stroke-width="5"/><path d="M60 30 Q100 8 140 30" fill="none" stroke="#FFD54A" stroke-width="2" stroke-dasharray="3 3"/>` +
    fringe + `<circle cx="100" cy="4" r="6" fill="#FFD54A"/>` +
    `<path d="M52 100 Q52 80 70 80 L130 80 Q148 80 148 100 L148 200 L52 200 Z" fill="#2E7D32" stroke="#C9A227" stroke-width="4"/>` +
    `<path d="M52 100 Q52 80 70 80 L130 80 Q148 80 148 100 L148 200 L52 200 Z" fill="url(#k4-sheen)"/>` +
    `<path d="M62 92 L138 92 M62 104 L138 104" stroke="#FFD54A" stroke-width="1.4" stroke-dasharray="4 3"/>` +
    `<rect x="40" y="180" width="120" height="16" rx="4" fill="#C9A227"/><path d="M48 196 L48 236 M152 196 L152 236" stroke="#8A6410" stroke-width="7"/><rect x="36" y="232" width="128" height="8" rx="3" fill="#8A6410"/>` +
    `<path d="M66 196 Q56 150 74 120 L126 120 Q144 150 134 196 Q100 206 66 196 Z" fill="#FFFFFF" stroke="#D9CBA6" stroke-width="1"/>` +
    `<path d="M66 196 Q56 150 74 120 L126 120 Q144 150 134 196 Q100 206 66 196 Z" fill="url(#k4-cloth)"/><path d="M78 140 Q72 170 76 196 M122 140 Q130 168 126 196 M86 176 Q90 190 88 200 M114 176 Q110 190 112 200" stroke="rgba(0,0,0,.13)" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    `<path d="M92 122 L96 170 L104 170 L108 122" fill="none" stroke="#C9A227" stroke-width="2"/><path d="M88 134 q12 7 24 0 M88 146 q12 7 24 0 M90 158 q10 6 20 0" stroke="#C9A227" stroke-width="1.6" fill="none"/>` +
    `<path d="M74 196 h52 v6 h-52 Z" fill="#E2DCCB"/><path d="M78 202 q-4 10 6 10 h10 v-10 Z M122 202 q4 10 -6 10 h-10 v-10 Z" fill="#8A6410"/>` +
    `<g class="e-rest"><g class="e-armL"><path d="M74 128 Q62 156 70 176" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="72" cy="180" r="6" fill="${S2}"/></g>` +
    `<path d="M126 128 Q138 156 130 176" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="128" cy="180" r="6" fill="${S2}"/></g>` +
    /* pleased (Sani 2026-10-23: "the king should wave hand in approval"): the arm toward the horseman rises in its wide
       white sleeve and the open palm waves from the elbow, then it rests on his knee again */
    `<g class="e-wave"><path d="M76 126 Q62 124 56 106" stroke="#FFFFFF" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M76 126 Q62 124 56 106" stroke="#E2DCCB" stroke-width="1.2" fill="none"/>` +
    `<g class="e-fore"><path d="M56 106 L50 84" stroke="#FFFFFF" stroke-width="11" fill="none" stroke-linecap="round"/><ellipse cx="49" cy="75" rx="5.6" ry="7" fill="${S2}"/>` +
    `<path d="M45 71 L43.5 62 M48 69 L47.6 59.5 M51.2 69 L52 60 M54 71.5 L56.2 64 M44 78 L39.6 73.6" stroke="${S2}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g></g>` +
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

/*
 * The emir's court at the palace gate (Sani 2026-10-23: "where is his entourage, the person fanning him, his guards"):
 * two dogarai in the palace guard's red and green, spear in hand and sword at the hip, and his attendant waving a big
 * leather fan over him. Each is its own drawing so the court can be laid out around the throne in the page.
 * Moving parts: .fan (the fan sweeps), .tassel (the spear's tassel sways), .dg-salute (the spear lifts when he is pleased).
 */
export function dogari(v = 0): string {
  const sk = SKIN[(v + 2) % SKIN.length], id = 'dg' + (gid++);
  let strips = ''; for (let k = 0; k < 6; k++) strips += `<rect x="${14 + k * 11}" y="92" width="11" height="160" fill="${k % 2 ? '#2E7D32' : '#C62828'}"/>`;
  const robe = 'M30 96 Q45 88 60 96 L76 248 Q45 256 14 248 Z';
  return `<svg class="dogari dur" viewBox="0 0 90 262" aria-hidden="true"><ellipse cx="45" cy="252" rx="42" ry="8" fill="url(#k4-shadow)"/>` +
    // the spear first, held upright in the right hand, with its red tassel
    `<g class="dg-spear"><path d="M74 248 L74 14" stroke="#6B4422" stroke-width="3"/><path d="M71 16 L74 -4 L77 16 Z" fill="url(#k4-steel)"/><path d="M70 18 h8" stroke="#C9A227" stroke-width="3"/>` +
    `<g class="tassel"><path d="M74 20 q-6 8 -4 18 M74 20 q0 9 2 18 M74 20 q6 8 6 16" stroke="#C62828" stroke-width="2.6" fill="none" stroke-linecap="round"/></g></g>` +
    // the long robe in vertical red and green panels, gold edging, a wide sash
    `<clipPath id="${id}r"><path d="${robe}"/></clipPath><path d="${robe}" fill="#C62828"/><g clip-path="url(#${id}r)">${strips}<path d="M0 236 H90 V262 H0 Z" fill="#1B5E20"/></g>` +
    `<path d="${robe}" fill="url(#k4-cloth)"/><path d="M30 120 Q26 180 30 244 M60 120 Q66 180 62 244" stroke="rgba(0,0,0,.13)" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    `<path d="${robe}" fill="none" stroke="#FFD54A" stroke-width="1.6"/><path d="M45 100 L45 246" stroke="#FFD54A" stroke-width="1.4" stroke-dasharray="4 3"/>` +
    `<path d="M22 150 Q45 158 68 150 L69 162 Q45 170 21 162 Z" fill="#FFD54A"/><path d="M40 160 l-3 22 h8 Z" fill="#E8B730"/>` +
    // the sword in its leather scabbard at the left hip
    `<path d="M24 158 Q12 196 16 226" stroke="#5E3A1C" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M26 154 l-6 -6" stroke="#C9A227" stroke-width="3"/>` +
    // arms: the left hangs by the sword, the right holds the spear
    `<path d="M32 100 Q20 128 24 150" stroke="#C62828" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="24" cy="152" r="5.5" fill="${sk}"/>` +
    `<path d="M58 100 Q72 112 72 132" stroke="#2E7D32" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="73" cy="134" r="5.5" fill="${sk}"/>` +
    // the head: a stern face under the tall red-and-green turban, its end wrapped round the chin
    `<rect x="39" y="78" width="12" height="14" fill="${sk}"/><circle cx="45" cy="68" r="14" fill="${sk}"/><circle cx="45" cy="68" r="14" fill="url(#k4-shade)"/>` +
    `<circle cx="40" cy="67" r="1.7" fill="#1A0E06"/><circle cx="50" cy="67" r="1.7" fill="#1A0E06"/><path d="M36 62 l7 2 M54 62 l-7 2" stroke="#1A0E06" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="M41 75 h8" stroke="#3A1A0A" stroke-width="1.8" stroke-linecap="round"/>` +
    `<path d="M31 70 Q31 88 45 90 Q59 88 59 70 L59 80 Q45 98 31 80 Z" fill="#C62828"/>` +
    `<path d="M29 62 Q26 30 45 26 Q64 30 61 62 Q53 54 45 55 Q37 54 29 62 Z" fill="#C62828"/>` +
    `<path d="M30 52 Q45 42 60 52 M31 42 Q45 33 59 42" stroke="#2E7D32" stroke-width="4" fill="none"/><path d="M33 47 Q45 39 57 47" stroke="#FFD54A" stroke-width="1.4" fill="none"/>` +
    `<circle cx="45" cy="28" r="4" fill="#FFD54A"/></svg>`;
}

export function maiFanka(): string {
  const sk = SKIN[1];
  let rings = ''; ['#C62828', '#FFD54A', '#2E7D32', '#FFD54A', '#8B4A22'].forEach((c, k) => { rings += `<circle cx="0" cy="0" r="${34 - k * 6.5}" fill="${c}"/>`; });
  let tri = ''; for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, x = Math.cos(a) * 30, y = Math.sin(a) * 30; tri += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#FFF8E7"/>`; }
  let fringe = ''; for (let k = 0; k < 28; k++) { const a = k * Math.PI / 14, x = Math.cos(a) * 36, y = Math.sin(a) * 36, x2 = Math.cos(a) * 42, y2 = Math.sin(a) * 42; fringe += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${k % 2 ? '#C62828' : '#1A0E06'}" stroke-width="2.4" stroke-linecap="round"/>`; }
  return `<svg class="fanka dur" viewBox="0 0 150 270" aria-hidden="true"><ellipse cx="92" cy="261" rx="40" ry="8" fill="url(#k4-shadow)"/>` +
    // the attendant: a plain white robe and a red cap, standing behind and to the side of the throne
    `<path d="M78 110 Q92 102 106 110 L120 258 Q92 266 64 258 Z" fill="#F4F1EA" stroke="#D9D2C2" stroke-width="1"/><path d="M92 112 L92 200" stroke="#D9D2C2" stroke-width="1.4"/><path d="M78 110 Q92 102 106 110 L120 258 Q92 266 64 258 Z" fill="url(#k4-cloth)"/><path d="M80 150 Q74 200 76 256 M104 150 Q112 200 110 256" stroke="rgba(0,0,0,.13)" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    `<path d="M86 116 q6 5 12 0 M86 124 q6 5 12 0" stroke="#2E7D32" stroke-width="1.4" fill="none"/>` +
    `<rect x="86" y="92" width="12" height="14" fill="${sk}"/><circle cx="92" cy="84" r="13" fill="${sk}"/><circle cx="92" cy="84" r="13" fill="url(#k4-shade)"/>` +
    `<path d="M85 83 q2 -2 4 0 M95 83 q2 -2 4 0" stroke="#1A0E06" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M87 90 q5 4 10 0" stroke="#3A1A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path d="M79 78 Q80 62 92 62 Q104 62 105 78 Q92 72 79 78 Z" fill="#B71C1C"/><path d="M80 76 Q92 70 104 76" stroke="#FFD54A" stroke-width="1.6" fill="none"/>` +
    // both hands up on the long handle; the fan sweeps from the hands
    `<g class="fan"><path d="M78 128 L34 54" stroke="#6B4422" stroke-width="4" stroke-linecap="round"/>` +
    `<g transform="translate(30 46)">${fringe}${rings}${tri}<circle r="5" fill="#C9A227"/><path d="M-20 -6 h40 M-20 6 h40" stroke="#1A0E06" stroke-width="1" opacity=".35"/></g></g>` +
    `<path d="M82 116 Q74 124 78 130" stroke="#F4F1EA" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M102 116 Q94 108 86 120" stroke="#F4F1EA" stroke-width="11" fill="none" stroke-linecap="round"/>` +
    `<circle cx="78" cy="130" r="5" fill="${sk}"/><circle cx="84" cy="122" r="5" fill="${sk}"/></svg>`;
}

/*
 * The Durbar's own sounds (Sani 2026-10-23: "don't forget sound effects"), made in Web Audio so nothing new is
 * downloaded: hooves when a horseman rides in and out, the kakaki's fanfare and the women's ululation (guda) for a
 * letter said right, a long falling kakaki and a crowd's groan for a miss. All are short and end before the
 * microphone can open; none plays over Laila's voice (the game schedules them after her).
 */
let dac: AudioContext | null = null;
function audio(): AudioContext | null { try { dac = dac || new (window.AudioContext || (window as any).webkitAudioContext)(); if (dac.state === 'suspended') dac.resume(); return dac; } catch { return null; } }
function noise(a: AudioContext, secs: number): AudioBuffer { const n = Math.floor(a.sampleRate * secs), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; }
function clop(a: AudioContext, t: number, vol: number): void {
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = noise(a, .08); f.type = 'bandpass'; f.frequency.value = 1700; f.Q.value = 2.5;
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .07); s.connect(f).connect(g).connect(a.destination); s.start(t); s.stop(t + .08);
  const o = a.createOscillator(), og = a.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(60, t + .08);
  og.gain.setValueAtTime(.0001, t); og.gain.exponentialRampToValueAtTime(vol * 1.4, t + .005); og.gain.exponentialRampToValueAtTime(.0001, t + .1); o.connect(og).connect(a.destination); o.start(t); o.stop(t + .12);
}
/** a gallop: hooves in threes, louder as the horse comes near (in) or fading as it goes (out) */
export function hooves(secs = 1.1, out = false): void {
  const a = audio(); if (!a) return; const t0 = a.currentTime + .02;
  for (let t = 0; t < secs; t += .34) [0, .07, .14].forEach((d) => { const k = (t + d) / secs, v = .05 + .2 * (out ? 1 - k : Math.min(1, k * 1.4)); clop(a, t0 + t + d, v); });
}
function horn(a: AudioContext, t: number, f0: number, dur: number, f1 = f0, vol = .16): void {
  const o = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter(), lfo = a.createOscillator(), lg = a.createGain();
  o.type = 'sawtooth'; o2.type = 'square'; o.frequency.setValueAtTime(f0, t); o2.frequency.setValueAtTime(f0 * 1.005, t);
  if (f1 !== f0) { o.frequency.setValueAtTime(f0, t + dur * .5); o.frequency.exponentialRampToValueAtTime(f1, t + dur); o2.frequency.setValueAtTime(f0 * 1.005, t + dur * .5); o2.frequency.exponentialRampToValueAtTime(f1, t + dur); }
  f.type = 'lowpass'; f.frequency.setValueAtTime(700, t); f.frequency.linearRampToValueAtTime(1800, t + .08); lfo.frequency.value = 5.5; lg.gain.value = 4; lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
  const g2 = a.createGain(); g2.gain.value = .35; o2.connect(g2).connect(f); o.connect(f); f.connect(g);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .05); g.gain.setValueAtTime(vol, t + dur - .12); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  g.connect(a.destination); [o, o2, lfo].forEach((x) => { x.start(t); x.stop(t + dur + .05); });
}
/** the kakaki salute and the women's guda: a letter said right */
export function fanfare(): void {
  const a = audio(); if (!a) return; const t = a.currentTime + .03;
  horn(a, t, 233, .22); horn(a, t + .28, 233, .22); horn(a, t + .56, 311, .9, 311, .18);
  // guda: a high voice trilling fast, rising and falling as the women in the crowd join in
  [0, .18].forEach((d, k) => { const o = a.createOscillator(), l = a.createOscillator(), lg = a.createGain(), g = a.createGain(); o.type = 'triangle';
    o.frequency.value = 1050 + k * 140; l.frequency.value = 7.5 + k; lg.gain.value = 170; l.connect(lg).connect(o.frequency);
    const s = t + .5 + d; g.gain.setValueAtTime(.0001, s); g.gain.exponentialRampToValueAtTime(.05, s + .15); g.gain.setValueAtTime(.05, s + .9); g.gain.exponentialRampToValueAtTime(.0001, s + 1.2);
    o.connect(g).connect(a.destination); o.start(s); l.start(s); o.stop(s + 1.25); l.stop(s + 1.25); });
}
/** a miss: one long kakaki note sagging down, and the crowd's low "aah" */
export function groan(): void {
  const a = audio(); if (!a) return; const t = a.currentTime + .03;
  horn(a, t, 233, 1, 160, .13);
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = noise(a, 1.2); f.type = 'bandpass'; f.Q.value = 3; f.frequency.setValueAtTime(520, t); f.frequency.exponentialRampToValueAtTime(260, t + 1.1);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .2); g.gain.exponentialRampToValueAtTime(.0001, t + 1.15); s.connect(f).connect(g).connect(a.destination); s.start(t); s.stop(t + 1.2);
}
