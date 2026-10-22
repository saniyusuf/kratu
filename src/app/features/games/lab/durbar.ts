// @ts-nocheck
/*
 * Hawan Daushe, drawn again (Sani 2026-10-22): a Durbar horseman as close to the real thing as a drawing can be, and the
 * emir on his throne under the royal umbrella. The horse wears its regalia: a quilted caparison in red and green with a
 * yellow fringe, brass discs on the breast band and bridle, a plume on its head, tassels down its neck. The rider wears
 * the babban riga and a white turban, carries the pennant with the letter and raises his sword.
 *
 * Moving parts carry classes that gamelab.css animates by transform and opacity only:
 *   rider:  .hrs (the whole horse, rears and kneels) · .lg a–d (legs, gallop) · .fleg (front legs, fold to kneel) ·
 *           .hhead (head, droops when sad) · .sword (salute) · .r-smile / .r-frown · .r-eyes-happy / .r-eyes-sad
 *   emir:   .e-head (turns away) · .e-smile / .e-frown · .e-brow · .e-rest / .e-fold (hands on knees, arms folded)
 */
const SKIN = '#7A4A26', SKIN2 = '#5E3A1C';

export function durbarRider(L: string): string {
  const disc = (x, y, r = 2.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#E8B730" stroke="#8A6410" stroke-width=".6"/>`;
  let fringe = ''; for (let x = 84; x < 172; x += 6) fringe += `<path d="M${x} 150 l3 7 l3 -7 Z" fill="${(x / 6) % 2 ? '#FFD54A' : '#F57C00'}"/>`;
  let tassels = ''; [[188, 74, '#C62828'], [194, 64, '#2E7D32'], [199, 56, '#FFD54A'], [184, 86, '#1565C0']].forEach(([x, y, c]) => { tassels += `<path d="M${x} ${y} l-2 14" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${x - 2}" cy="${y + 15}" r="2.2" fill="${c}"/>`; });
  return `<svg class="rider dur" viewBox="34 -18 224 244" aria-hidden="true">` +
    `<ellipse cx="140" cy="220" rx="96" ry="6" fill="rgba(40,24,10,.28)"/>` +
    `<g class="hrs">` +
    /* the pennant with the letter, on the rider's lance, behind him */
    `<g class="flag"><path d="M114 -12 L120 112" stroke="#5E3A1C" stroke-width="3"/><path d="M113 -10 l2 -6 l2 6 Z" fill="#C9A227"/>` +
    `<path class="cloth" d="M114 -6 L62 0 Q72 14 62 28 L116 32 Z" fill="#C62828"/><path d="M114 -6 L62 0 L62 4 L114 -2 Z" fill="#FFD54A"/><path d="M116 28 L62 24 L62 28 L116 32 Z" fill="#2E7D32"/>` +
    `<text x="88" y="24" text-anchor="middle" class="flagL">${L}</text></g>` +
    /* tail and hind legs */
    `<path class="tail" d="M74 104 Q44 116 50 172 Q58 144 78 118 Z" fill="#2B1608"/>` +
    `<path class="lg a" d="M92 132 Q86 160 94 178 L90 212" stroke="#4E2E14" stroke-width="11" fill="none" stroke-linecap="round"/>` +
    `<path class="lg b" d="M106 134 Q100 162 108 180 L106 212" stroke="#6B4422" stroke-width="11" fill="none" stroke-linecap="round"/>` +
    /* body */
    `<path d="M72 118 Q68 90 98 86 L170 84 Q198 86 202 112 Q202 138 178 142 L98 144 Q72 142 72 118 Z" fill="url(#k4-horse)"/>` +
    /* the caparison: a quilted cloth in red with a green border, brass studs and a yellow-orange fringe */
    `<path d="M82 90 L172 88 Q182 116 174 150 L86 151 Q76 120 82 90 Z" fill="#B71C1C"/><path d="M82 90 L172 88 Q182 116 174 150 L86 151 Q76 120 82 90 Z" fill="none" stroke="#2E7D32" stroke-width="4"/>` +
    `<path d="M90 104 L166 102 M90 118 L168 116 M90 132 L168 131" stroke="#FFD54A" stroke-width="1.2" stroke-dasharray="4 3" opacity=".9"/>` +
    disc(100, 111) + disc(124, 110) + disc(148, 109) + disc(112, 125) + disc(136, 124) + disc(160, 123) + fringe +
    /* front legs */
    `<g class="fleg"><path class="lg c" d="M172 136 L178 178 L176 212" stroke="#4E2E14" stroke-width="11" fill="none" stroke-linecap="round"/>` +
    `<path class="lg d" d="M186 134 L192 176 L192 212" stroke="#6B4422" stroke-width="11" fill="none" stroke-linecap="round"/>` +
    `<path d="M170 212 h13 v6 h-13 Z M186 212 h13 v6 h-13 Z" fill="#1A0E06"/></g>` +
    `<path d="M84 212 h14 v6 h-14 Z M100 212 h12 v6 h-12 Z" fill="#1A0E06"/>` +
    /* neck, mane, tassels and the head with its bridle and plume */
    `<g class="hhead"><path d="M176 98 Q186 66 206 48 L224 58 Q212 86 202 118 Z" fill="url(#k4-horse)"/>` +
    `<path d="M206 46 Q196 56 192 66 Q186 76 182 90 Q178 100 176 108" stroke="#1A0E06" stroke-width="6" fill="none" stroke-linecap="round"/>` + tassels +
    `<path d="M204 44 Q220 30 242 48 Q250 60 244 66 Q232 66 218 62 Q206 58 204 44 Z" fill="#6B4422"/><path d="M211 40 L214 26 L219 39 Z" fill="#4E2E14"/>` +
    `<circle cx="224" cy="48" r="2.4" fill="#1A0E06"/><circle cx="241" cy="59" r="1.4" fill="#1A0E06"/>` +
    `<path d="M210 44 L242 56 M222 40 L226 64" stroke="#C9A227" stroke-width="2"/>` + disc(226, 52, 2.2) + disc(236, 55, 1.8) +
    `<path class="plume" d="M214 28 Q206 6 214 -6 Q222 8 218 28 Z" fill="#C62828"/><path d="M215 26 Q211 12 214 2" stroke="#FFD54A" stroke-width="1.6" fill="none"/></g>` +
    /* the breast band with its brass discs, and the reins */
    `<path d="M178 100 Q192 112 200 128" stroke="#2E7D32" stroke-width="6" fill="none"/>` + disc(184, 106) + disc(191, 115) + disc(197, 124) +
    `<path d="M228 60 Q200 74 168 74" stroke="#3A2410" stroke-width="1.6" fill="none"/>` +
    /* saddle */
    `<path d="M120 86 Q120 72 128 74 L150 74 Q158 72 158 86 Z" fill="#5E3A1C"/><path d="M118 78 q2 -8 6 -6 M160 78 q-2 -8 -6 -6" stroke="#C9A227" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    /* the rider: babban riga, turban, the boot in its stirrup, the sword */
    `<g class="rider2">` +
    `<path d="M130 92 L124 128 L132 130" stroke="#3A2410" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M122 130 h14 v4 h-14 Z" fill="#C9A227"/>` +
    `<path d="M114 86 Q106 46 128 32 L150 32 Q170 46 164 82 L176 96 Q168 104 150 102 L124 102 Q110 98 114 86 Z" fill="#FFFFFF" stroke="#D9CBA6" stroke-width="1"/>` +
    `<path d="M130 34 L134 70 L142 70 L146 34" fill="none" stroke="#2E7D32" stroke-width="1.6"/><path d="M128 44 q10 6 20 0 M128 52 q10 6 20 0 M130 60 q8 5 16 0" stroke="#C9A227" stroke-width="1.2" fill="none"/>` +
    `<path d="M146 50 Q160 64 170 72" stroke="#F4EBD0" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="170" cy="73" r="4" fill="${SKIN}"/>` +
    `<g class="sword"><path d="M132 44 Q118 30 112 16" stroke="#F4EBD0" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="111" cy="14" r="4" fill="${SKIN}"/>` +
    `<path d="M110 12 L96 -16" stroke="url(#k4-steel)" stroke-width="3.4" stroke-linecap="round"/><path d="M105 13 h10" stroke="#C9A227" stroke-width="3"/></g>` +
    `<rect x="133" y="22" width="9" height="10" fill="${SKIN}"/><circle cx="138" cy="14" r="11" fill="${SKIN}"/><circle cx="138" cy="14" r="11" fill="url(#k4-shade)"/>` +
    `<g class="r-eyes-happy" fill="none" stroke="#1A0E06" stroke-width="1.6" stroke-linecap="round"><path d="M132 13 q2 -2 4 0 M140 13 q2 -2 4 0"/></g>` +
    `<g class="r-eyes-sad" fill="#1A0E06"><circle cx="134" cy="13" r="1.5"/><circle cx="142" cy="13" r="1.5"/><path d="M131 9 l5 2 M145 9 l-5 2" stroke="#1A0E06" stroke-width="1.2"/></g>` +
    `<path class="r-smile" d="M133 19 Q138 24 143 19" stroke="#3A1A0A" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    `<path class="r-frown" d="M133 22 Q138 18 143 22" stroke="#3A1A0A" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    `<path d="M124 10 Q124 -10 138 -10 Q154 -10 153 10 Q146 4 138 5 Q130 4 124 10 Z" fill="#FFFFFF"/><path d="M125 4 Q138 -4 152 4 M126 -1 Q138 -8 151 -1" stroke="#D9CBA6" stroke-width="1.2" fill="none"/>` +
    `<path d="M126 8 Q120 24 126 34" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round"/></g>` +
    `</g></svg>`;
}

export function emirThrone(): string {
  let fringe = ''; for (let x = 12; x <= 188; x += 11) fringe += `<path d="M${x} 72 l-3 10 h6 Z" fill="#FFD54A"/>`;
  return `<svg class="emir dur" viewBox="0 0 200 250" aria-hidden="true">` +
    `<ellipse cx="100" cy="244" rx="80" ry="6" fill="rgba(40,24,10,.28)"/>` +
    /* the royal umbrella */
    `<path d="M100 60 L100 160" stroke="#5E3A1C" stroke-width="4"/>` +
    `<path d="M8 72 Q100 -14 192 72 Z" fill="#C62828"/><path d="M8 72 Q100 -14 192 72" fill="none" stroke="#FFD54A" stroke-width="3"/>` +
    `<path d="M40 44 Q100 6 160 44" fill="none" stroke="#2E7D32" stroke-width="5"/><path d="M60 30 Q100 8 140 30" fill="none" stroke="#FFD54A" stroke-width="2" stroke-dasharray="3 3"/>` +
    fringe + `<circle cx="100" cy="4" r="6" fill="#FFD54A"/>` +
    /* the throne */
    `<path d="M52 100 Q52 80 70 80 L130 80 Q148 80 148 100 L148 200 L52 200 Z" fill="#2E7D32" stroke="#C9A227" stroke-width="4"/>` +
    `<path d="M62 92 L138 92 M62 104 L138 104" stroke="#FFD54A" stroke-width="1.4" stroke-dasharray="4 3"/>` +
    `<rect x="40" y="180" width="120" height="16" rx="4" fill="#C9A227"/><path d="M48 196 L48 236 M152 196 L152 236" stroke="#8A6410" stroke-width="7"/><rect x="36" y="232" width="128" height="8" rx="3" fill="#8A6410"/>` +
    /* the emir: a great white robe with gold embroidery */
    `<path d="M66 196 Q56 150 74 120 L126 120 Q144 150 134 196 Q100 206 66 196 Z" fill="#FFFFFF" stroke="#D9CBA6" stroke-width="1"/>` +
    `<path d="M92 122 L96 170 L104 170 L108 122" fill="none" stroke="#C9A227" stroke-width="2"/><path d="M88 134 q12 7 24 0 M88 146 q12 7 24 0 M90 158 q10 6 20 0" stroke="#C9A227" stroke-width="1.6" fill="none"/>` +
    `<path d="M74 196 h52 v6 h-52 Z" fill="#E2DCCB"/><path d="M78 202 q-4 10 6 10 h10 v-10 Z M122 202 q4 10 -6 10 h-10 v-10 Z" fill="#8A6410"/>` +
    /* hands resting on his knees, or arms folded across his chest */
    `<g class="e-rest"><path d="M74 128 Q62 156 70 176" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M126 128 Q138 156 130 176" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/>` +
    `<circle cx="72" cy="180" r="6" fill="${SKIN2}"/><circle cx="128" cy="180" r="6" fill="${SKIN2}"/></g>` +
    `<g class="e-fold"><path d="M74 128 Q74 150 122 150" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M126 128 Q126 158 78 156" stroke="#F4EEDD" stroke-width="14" fill="none" stroke-linecap="round"/>` +
    `<circle cx="122" cy="150" r="6" fill="${SKIN2}"/><circle cx="78" cy="156" r="6" fill="${SKIN2}"/></g>` +
    /* the head: a ceremonial turban with its two peaks, the face showing how he feels */
    `<g class="e-head"><rect x="93" y="104" width="14" height="16" fill="${SKIN2}"/>` +
    `<circle cx="100" cy="94" r="17" fill="${SKIN2}"/><circle cx="100" cy="94" r="17" fill="url(#k4-shade)"/>` +
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
