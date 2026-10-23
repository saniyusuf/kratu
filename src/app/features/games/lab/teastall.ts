// @ts-nocheck
/*
 * Mai shayi by the roadside at night (Sani 2026-10-23). The tea seller stands behind his table under a bare bulb,
 * pulling tea: one cup held high, one low, the tea poured in a long stream from one to the other so it foams. An egg
 * fries in the pan on the charcoal stove, the kettle steams, and there are bread loaves, a tray of eggs, sugar, tins of
 * milk and cocoa, and Indomie cartons stacked at the end. Across the way, under a big striped umbrella, people sit on
 * a bench eating: noodles from a bowl, tea from a cup, bread and egg. Now and then a motorbike goes by on the road.
 * Moving parts (transform and opacity only): .pour (the high cup rises and falls) with .stream (stretches with it) and
 * .foam, .sizzle, .steam, .feed / .sip / .bite (the customers' hands), .canopy (sways), .bulb (glows).
 */
const SK = ['#6E4426', '#8B5A2B', '#5E3A1C', '#9C6636'];

/* the seller's table, the seller, the stove and everything on the table */
export function teaStall(): string {
  const loaf = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 10 Q0 0 14 0 L26 0 Q40 0 40 10 L40 14 L0 14 Z" fill="#D9A55A"/><path d="M0 10 Q0 0 14 0 L26 0 Q40 0 40 10" fill="none" stroke="#A86E2C" stroke-width="1.4"/><path d="M8 2 L12 10 M18 1 L22 10 M28 2 L32 10" stroke="#B57A36" stroke-width="1.6"/></g>`;
  const egg = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="6" fill="#F2DEC0"/><ellipse cx="${x - 1.4}" cy="${y - 2}" rx="1.6" ry="2" fill="#fff" opacity=".6"/>`;
  const carton = (x, y) => `<g transform="translate(${x} ${y})"><rect width="56" height="30" rx="2" fill="#F6C21C"/><rect y="0" width="56" height="6" fill="#E3A812"/><path d="M0 24 H56" stroke="#D3242A" stroke-width="4"/>` +
    `<text x="28" y="19" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="11" fill="#D3242A">Indomie</text></g>`;
  return `<svg class="tstall" viewBox="0 0 380 270" aria-hidden="true">` +
    `<defs><linearGradient id="ts-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A87444"/><stop offset="1" stop-color="#6E4524"/></linearGradient>` +
    `<linearGradient id="ts-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E979F"/><stop offset=".45" stop-color="#EEF2F5"/><stop offset="1" stop-color="#737C85"/></linearGradient>` +
    `<radialGradient id="ts-coal" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#FFE07A"/><stop offset=".5" stop-color="#F57C00"/><stop offset="1" stop-color="#6A1A00"/></radialGradient>` +
    `<radialGradient id="ts-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient></defs>` +
    `<ellipse cx="190" cy="262" rx="180" ry="7" fill="rgba(0,0,0,.35)"/>` +
    // the bulb on its pole
    `<path d="M14 262 V18 H170" stroke="#4A4A4A" stroke-width="4" fill="none"/><path d="M170 18 V30" stroke="#333" stroke-width="2"/>` +
    `<circle class="bulb" cx="170" cy="40" r="60" fill="url(#ts-glow)"/><ellipse cx="170" cy="38" rx="6" ry="8" fill="#FFF3C0"/>` +
    // the seller, behind the table
    `<g class="seller">` +
    `<path d="M124 112 Q150 100 176 112 L184 200 L116 200 Z" fill="#2E7D32"/><path d="M150 106 V200" stroke="#1B5E20" stroke-width="1.6"/><path d="M138 106 Q150 120 162 106" stroke="#E8DDB8" stroke-width="2" fill="none"/>` +
    `<rect x="144" y="92" width="12" height="12" fill="${SK[0]}"/><circle cx="150" cy="80" r="17" fill="${SK[0]}"/>` +
    `<circle cx="144" cy="78" r="1.8" fill="#1A0E06"/><circle cx="156" cy="78" r="1.8" fill="#1A0E06"/>` +
    `<path class="sm-happy" d="M144 87 Q150 92 156 87" stroke="#3A1A0A" stroke-width="1.8" fill="none" stroke-linecap="round"/><path class="sm-sad" d="M144 90 Q150 85 156 90" stroke="#3A1A0A" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    `<path d="M133 72 Q134 56 150 56 Q166 56 167 72 Z" fill="#F4EBD0"/><path d="M135 66 h30 M134 70 h32" stroke="#C9A15E" stroke-width="1.2"/>` +
    // the low cup, steady on his left hand; the foam rising in it
    `<path d="M174 114 Q194 128 192 150" stroke="#256B2A" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="192" cy="152" r="5.5" fill="${SK[0]}"/>` +
    `<path d="M182 142 L202 142 L199 164 L185 164 Z" fill="url(#ts-steel)"/><ellipse class="foam" cx="192" cy="142" rx="10" ry="3" fill="#F3E2C4"/>` +
    // the high cup and his raised arm, pouring; the stream stretches as the cup rises
    `<rect class="stream" x="189.6" y="72" width="3.4" height="70" rx="1.7" fill="#B0703A"/>` +
    `<g class="pour"><path d="M128 114 Q130 84 170 70" stroke="#256B2A" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="172" cy="69" r="5.5" fill="${SK[0]}"/>` +
    `<g transform="rotate(28 184 66)"><path d="M174 52 L194 52 L191 74 L177 74 Z" fill="url(#ts-steel)"/></g></g>` +
    `</g>` +
    // the table
    `<rect x="20" y="186" width="290" height="12" rx="3" fill="#B98250"/><path d="M26 198 H304 L300 250 H30 Z" fill="url(#ts-wood)"/>` +
    `<path d="M30 214 H300 M30 232 H300" stroke="#5E3A1C" stroke-width="1.4" opacity=".6"/><path d="M32 250 V262 M298 250 V262" stroke="#4E2E14" stroke-width="6"/>` +
    // the charcoal stove and the pan, an egg frying
    `<path d="M30 186 L82 186 L76 162 L36 162 Z" fill="#3A3A3A"/><ellipse cx="56" cy="162" rx="22" ry="6" fill="url(#ts-coal)"/>` +
    `<ellipse cx="56" cy="156" rx="28" ry="7" fill="#2A2A2A"/><path d="M84 156 L110 150" stroke="#222" stroke-width="4" stroke-linecap="round"/>` +
    `<ellipse cx="54" cy="154" rx="15" ry="4.4" fill="#FBF6EA"/><circle cx="56" cy="153.4" r="4" fill="#F5B21C"/>` +
    `<g class="sizzle"><circle cx="42" cy="150" r="1.4" fill="#fff"/><circle cx="66" cy="149" r="1.2" fill="#fff"/><circle cx="50" cy="146" r="1" fill="#fff"/></g>` +
    `<g class="steam s1"><circle cx="52" cy="140" r="5" fill="#fff" opacity=".35"/><circle cx="58" cy="126" r="7" fill="#fff" opacity=".22"/></g>` +
    // the big kettle
    `<g transform="translate(90 140)"><path d="M6 46 Q0 18 22 14 Q44 18 38 46 Z" fill="url(#ts-steel)"/><path d="M38 30 Q52 26 56 12" stroke="#9AA3AD" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M10 18 Q22 0 34 18" stroke="#5E5E5E" stroke-width="3" fill="none"/><ellipse cx="22" cy="14" rx="7" ry="2.4" fill="#5E5E5E"/>` +
    `<g class="steam"><circle cx="58" cy="6" r="4" fill="#fff" opacity=".6"/><circle cx="62" cy="-6" r="6" fill="#fff" opacity=".4"/><circle cx="58" cy="-20" r="8" fill="#fff" opacity=".25"/></g></g>` +
    // bread, eggs, sugar and the tins
    loaf(206, 172) + loaf(222, 162) +
    `<rect x="252" y="176" width="44" height="10" rx="1" fill="#D8C7A0"/>` + [0, 1, 2, 3].map((i) => egg(258 + i * 10, 174)).join('') + [0, 1, 2].map((i) => egg(263 + i * 10, 166)).join('') +
    `<rect x="160" y="168" width="22" height="18" rx="1" fill="#FFFFFF"/><rect x="160" y="168" width="22" height="5" fill="#1565C0"/><text x="171" y="182" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="6" fill="#1565C0">SUGAR</text>` +
    `<rect x="186" y="164" width="16" height="22" rx="2" fill="#2E7D32"/><rect x="186" y="170" width="16" height="8" fill="#FFD54A"/>` +
    `<rect x="140" y="170" width="16" height="16" rx="2" fill="#E8EEF7"/><rect x="140" y="174" width="16" height="6" fill="#1E5AA8"/>` +
    // the Indomie cartons stacked at the end of the table
    carton(316, 232) + carton(318, 202) + carton(314, 172) + carton(322, 142) +
    `</svg>`;
}

/* one person sitting on the bench, seen from the front; what their hands do */
function sitter(x: number, o: { hat: string; robe: string; arm: string; skin: number; act: 'feed' | 'sip' | 'bite' }): string {
  const sk = SK[o.skin], r1 = o.robe, r2 = o.arm;
  const head = `<rect x="${x - 5}" y="104" width="10" height="10" fill="${sk}"/><circle cx="${x}" cy="96" r="13" fill="${sk}"/>` +
    `<circle cx="${x - 4.5}" cy="95" r="1.5" fill="#1A0E06"/><circle cx="${x + 4.5}" cy="95" r="1.5" fill="#1A0E06"/>` +
    `<path class="sm-happy" d="M${x - 4} 102 Q${x} 105 ${x + 4} 102" stroke="#3A1A0A" stroke-width="1.4" fill="none"/><path class="sm-sad" d="M${x - 4} 104 Q${x} 101 ${x + 4} 104" stroke="#3A1A0A" stroke-width="1.4" fill="none"/>`;
  const hat = o.hat === 'hijab' ? `<path d="M${x - 15} 100 Q${x - 16} 80 ${x} 79 Q${x + 16} 80 ${x + 15} 100 L${x + 18} 124 Q${x} 130 ${x - 18} 124 Z" fill="${o.hat === 'hijab' ? '#C2185B' : ''}"/>`
    : `<path d="M${x - 12} 90 Q${x - 11} 79 ${x} 79 Q${x + 11} 79 ${x + 12} 90 Z" fill="#F4EBD0"/>`;
  const body = `<path d="M${x - 18} 118 Q${x} 110 ${x + 18} 118 L${x + 22} 184 L${x - 22} 184 Z" fill="${r1}"/>` +
    `<path d="M${x - 14} 184 L${x - 12} 236 M${x + 12} 184 L${x + 12} 236" stroke="${r1}" stroke-width="11" stroke-linecap="round"/>` +
    `<path d="M${x - 20} 236 h12 v6 h-14 Z M${x + 6} 236 h14 v6 h-12 Z" fill="#3A2A1E"/>`;
  let hands = '';
  if (o.act === 'feed') hands =    // a bowl of noodles in the lap, the fork going to the mouth
    `<path d="M${x - 16} 124 Q${x - 22} 150 ${x - 8} 162" stroke="${r2}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
    `<path d="M${x - 16} 160 Q${x} 176 ${x + 16} 160 Z" fill="#E8EEF2"/><path d="M${x - 12} 160 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0" stroke="#F2C14E" stroke-width="2.4" fill="none"/>` +
    `<g class="feed" style="transform-origin:${x + 16}px 124px"><path d="M${x + 16} 124 Q${x + 22} 150 ${x + 6} 156" stroke="${r2}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${x + 5}" cy="156" r="4" fill="${sk}"/><path d="M${x + 4} 156 L${x - 2} 146" stroke="#BFC7CE" stroke-width="2"/></g>`;
  if (o.act === 'sip') hands =     // a cup of tea, lifted to the mouth and down again
    `<path d="M${x - 16} 124 Q${x - 22} 150 ${x - 8} 166" stroke="${r2}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${x - 7}" cy="166" r="4" fill="${sk}"/>` +
    `<g class="sip" style="transform-origin:${x + 16}px 124px"><path d="M${x + 16} 124 Q${x + 24} 150 ${x + 8} 160" stroke="${r2}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${x + 7}" cy="160" r="4" fill="${sk}"/>` +
    `<path d="M${x} 150 L${x + 12} 150 L${x + 10} 162 L${x + 2} 162 Z" fill="#F4F4F4"/><rect x="${x + 1}" y="150" width="10" height="2.4" fill="#B0703A"/></g>`;
  if (o.act === 'bite') hands =    // bread and egg in the hand, a bite now and then
    `<path d="M${x - 16} 124 Q${x - 24} 150 ${x - 6} 168" stroke="${r2}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="${x - 2}" cy="170" rx="14" ry="3.6" fill="#E8EEF2"/><ellipse cx="${x - 4}" cy="167" rx="6" ry="2" fill="#FBF6EA"/><circle cx="${x - 3}" cy="166.6" r="1.8" fill="#F5B21C"/>` +
    `<g class="bite" style="transform-origin:${x + 16}px 124px"><path d="M${x + 16} 124 Q${x + 24} 148 ${x + 8} 158" stroke="${r2}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${x + 7}" cy="158" r="4" fill="${sk}"/>` +
    `<path d="M${x - 2} 150 Q${x - 2} 144 ${x + 6} 144 L${x + 14} 144 Q${x + 20} 144 ${x + 20} 150 L${x + 20} 154 L${x - 2} 154 Z" fill="#D9A55A"/></g>`;
  return `<g class="sitter">${o.hat === 'hijab' ? hat : ''}${body}${hands}${head}${o.hat === 'hijab' ? '' : hat}</g>`;
}

/* the big striped umbrella over the bench, three people eating, a stool with a tea cup on it */
export function umbrellaBench(): string {
  const cols = ['#D32F2F', '#FFFFFF', '#FFC107', '#FFFFFF', '#2E7D32', '#FFFFFF', '#D32F2F', '#FFFFFF'];
  const panels = cols.map((c, i) => { const a0 = Math.PI * (1 - i / cols.length), a1 = Math.PI * (1 - (i + 1) / cols.length);
    const p = (a) => `${(150 + 140 * Math.cos(a)).toFixed(1)} ${(66 - 46 * Math.sin(a)).toFixed(1)}`;
    return `<path d="M150 20 L${p(a0)} Q${(150 + 140 * Math.cos((a0 + a1) / 2)).toFixed(1)} ${(78 - 46 * Math.sin((a0 + a1) / 2)).toFixed(1)} ${p(a1)} Z" fill="${c}"/>`; }).join('');
  return `<svg class="ubench" viewBox="0 0 300 260" aria-hidden="true"><ellipse cx="150" cy="252" rx="138" ry="6" fill="rgba(0,0,0,.35)"/>` +
    `<path d="M150 30 V250" stroke="#8E8E8E" stroke-width="4"/><path d="M138 250 h24" stroke="#555" stroke-width="5"/>` +
    // the bench behind the people, then the people, then the stool in front
    `<rect x="24" y="176" width="252" height="10" rx="2" fill="#9C6A3C"/><path d="M34 186 V244 M266 186 V244" stroke="#5E3A1C" stroke-width="6"/>` +
    sitter(72, { hat: 'cap', robe: '#1E88E5', arm: '#0D47A1', skin: 1, act: 'feed' }) + sitter(150, { hat: 'hijab', robe: '#C2185B', arm: '#880E4F', skin: 3, act: 'bite' }) + sitter(228, { hat: 'cap', robe: '#8D6E63', arm: '#4E342E', skin: 2, act: 'sip' }) +
    `<g transform="translate(190 220)"><path d="M0 0 H36 L32 30 H4 Z" fill="#1E88E5"/><ellipse cx="18" cy="0" rx="18" ry="4" fill="#42A5F5"/><path d="M12 -12 L24 -12 L22 0 L14 0 Z" fill="#F4F4F4"/></g>` +
    `<g class="canopy">${panels}<path d="M10 66 Q150 86 290 66" stroke="rgba(0,0,0,.18)" stroke-width="2" fill="none"/><circle cx="150" cy="18" r="4" fill="#8E8E8E"/></g></svg>`;
}

/* a motorbike going by on the road, its rider in a cap */
export function okada(): string {
  return `<svg class="okada" viewBox="0 0 120 80" aria-hidden="true"><ellipse cx="60" cy="76" rx="50" ry="3" fill="rgba(0,0,0,.3)"/>` +
    `<g class="wheel" style="transform-origin:24px 62px"><circle cx="24" cy="62" r="13" fill="#1E1E1E"/><circle cx="24" cy="62" r="5" fill="#9AA3AD"/></g>` +
    `<g class="wheel" style="transform-origin:96px 62px"><circle cx="96" cy="62" r="13" fill="#1E1E1E"/><circle cx="96" cy="62" r="5" fill="#9AA3AD"/></g>` +
    `<path d="M24 62 L48 42 L84 42 L96 62" stroke="#1565C0" stroke-width="7" fill="none" stroke-linejoin="round"/><rect x="44" y="34" width="34" height="8" rx="4" fill="#212121"/>` +
    `<path d="M88 42 L96 22 L106 22" stroke="#424242" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="104" cy="34" r="3" fill="#FFF3C0"/>` +
    `<path d="M54 34 L60 12 Q70 8 76 14 L80 34 Z" fill="#E65100"/><path d="M74 18 L96 24" stroke="#E65100" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="68" cy="4" r="7" fill="${SK[2]}"/><path d="M61 2 Q62 -6 68 -6 Q74 -6 75 2 Z" fill="#F4EBD0"/><path d="M62 34 L58 56" stroke="#3E2723" stroke-width="5" stroke-linecap="round"/></svg>`;
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
