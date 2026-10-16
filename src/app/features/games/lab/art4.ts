// @ts-nocheck
/*
 * Drawn people, animals and places for the Arewa games (Sani 2026-10-16: "real SVG, animated, not just photos").
 * Every piece is a small shaded SVG: gradients only, no filters, so a cheap tablet draws them fast. Moving parts carry
 * a class (legs, wheel, steam, smoke, arm, sword…) that gamelab.css animates with transform and opacity only.
 * The words a child must name stay the lessons' own photos; they are framed inside these drawings.
 */
const SKIN = ['#7A4A26', '#8B5A2B', '#5E3A1C', '#9C6636'];
let defsDone = false;
function defs(): void {
  if (defsDone) return; defsDone = true;
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="k4-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C6A3C"/><stop offset="1" stop-color="#5E3A1C"/></linearGradient>' +
    '<linearGradient id="k4-allo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6B4422"/><stop offset=".5" stop-color="#4A2E14"/><stop offset="1" stop-color="#3A220E"/></linearGradient>' +
    '<linearGradient id="k4-sack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9D3A0"/><stop offset="1" stop-color="#B8925A"/></linearGradient>' +
    '<linearGradient id="k4-green" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FAE5A"/><stop offset="1" stop-color="#1F7A3A"/></linearGradient>' +
    '<linearGradient id="k4-horse" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8B5A2B"/><stop offset="1" stop-color="#4E2E14"/></linearGradient>' +
    '<linearGradient id="k4-cow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B5562A"/><stop offset="1" stop-color="#7A3416"/></linearGradient>' +
    '<linearGradient id="k4-ram" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9D2C2"/></linearGradient>' +
    '<linearGradient id="k4-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9AA3AD"/><stop offset=".5" stop-color="#E8EDF2"/><stop offset="1" stop-color="#7C858F"/></linearGradient>' +
    '<radialGradient id="k4-coal" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#FFD54A"/><stop offset=".5" stop-color="#F57C00"/><stop offset="1" stop-color="#7A1F00"/></radialGradient>' +
    '<radialGradient id="k4-shade" cx=".38" cy=".3" r=".8"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>' +
    '</defs></svg>');
}

/* ---- people ---- */
interface P { skin?: number; robe?: string; robe2?: string; hat?: 'cap' | 'hijab' | 'turban' | 'malafa' | 'emir' | 'none'; hatc?: string; arm?: 'down' | 'up' | 'clap' | 'staff' | 'sword' | 'pole'; mouth?: 'smile' | 'open'; }
export function person(o: P = {}): string {
  const skin = SKIN[o.skin ?? 1], robe = o.robe || '#2F6B9A', robe2 = o.robe2 || '#24557C', hat = o.hat || 'cap', hc = o.hatc || '#F4EBD0';
  let back = '', front = '';
  if (hat === 'hijab') back = `<path d="M13 34 Q12 10 30 9 Q48 10 47 34 L52 60 Q30 68 8 60 Z" fill="${hc}"/>`;
  if (hat === 'cap') front = `<path d="M17 22 Q18 9 30 9 Q42 9 43 22 Z" fill="${hc}"/><path d="M19 18 h22 M18 21 h24" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>`;
  if (hat === 'turban') front = `<ellipse cx="30" cy="17" rx="15" ry="10" fill="${hc}"/><path d="M16 18 Q30 10 44 18 M17 22 Q30 15 43 22" stroke="rgba(0,0,0,.15)" stroke-width="1.4" fill="none"/>`;
  if (hat === 'emir') front = `<ellipse cx="30" cy="17" rx="16" ry="10" fill="${hc}"/><path d="M18 14 Q20 -2 26 10 M42 14 Q40 -2 34 10" stroke="${hc}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M15 26 Q30 40 45 26 L45 34 Q30 46 15 34 Z" fill="${hc}"/>`;
  if (hat === 'malafa') front = `<ellipse cx="30" cy="17" rx="27" ry="6" fill="#D9B46A"/><path d="M19 16 L30 -2 L41 16 Z" fill="#C99A4E"/><path d="M26 6 L30 -2 L34 6 Z" fill="#7A4A22"/><ellipse cx="30" cy="16" rx="27" ry="6" fill="none" stroke="#8B6A2E" stroke-width="1.2"/>`;
  const arm = o.arm || 'down';
  const armL = `<path d="M15 50 Q8 72 12 90" stroke="${robe2}" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="12" cy="91" r="4.5" fill="${skin}"/>`;
  let armR = `<path d="M45 50 Q52 72 48 90" stroke="${robe2}" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="48" cy="91" r="4.5" fill="${skin}"/>`;
  if (arm === 'up') armR = `<g class="arm"><path d="M45 50 Q56 34 54 14" stroke="${robe2}" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="54" cy="12" r="4.5" fill="${skin}"/></g>`;
  if (arm === 'clap') armR = `<g class="clap"><path d="M45 50 Q48 62 34 66" stroke="${robe2}" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="32" cy="66" r="4.5" fill="${skin}"/></g>`;
  if (arm === 'staff') armR = `<path d="M-4 40 L64 52" stroke="#6B4422" stroke-width="3.4" stroke-linecap="round"/><path d="M45 50 Q56 46 58 52" stroke="${robe2}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
  if (arm === 'pole') armR = `<path d="M50 4 L40 140" stroke="#5E3A1C" stroke-width="3.4" stroke-linecap="round"/><path d="M45 50 Q50 46 47 60" stroke="${robe2}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
  if (arm === 'sword') armR = `<g class="sword"><path d="M45 50 Q56 40 58 28" stroke="${robe2}" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="58" cy="27" r="4" fill="${skin}"/><path d="M58 25 L66 -2" stroke="url(#k4-steel)" stroke-width="3" stroke-linecap="round"/><path d="M54 27 h8" stroke="#C9A227" stroke-width="2.6"/></g>`;
  const mouth = o.mouth === 'open' ? '<ellipse class="mouth" cx="30" cy="34" rx="3.2" ry="2.6" fill="#3A1A0A"/>' : '<path d="M25 33 Q30 37 35 33" stroke="#3A1A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  return `<svg class="pp" viewBox="-6 -4 72 128" aria-hidden="true">${back}` +
    `<path d="M14 46 Q30 40 46 46 L54 118 Q30 124 6 118 Z" fill="${robe}"/><path d="M30 46 L30 118" stroke="${robe2}" stroke-width="1.4" opacity=".6"/>` +
    `<path d="M22 46 Q30 54 38 46" fill="none" stroke="#F4EBD0" stroke-width="1.6" opacity=".8"/>${armL}${armR}` +
    `<rect x="26" y="38" width="8" height="8" fill="${skin}"/><circle cx="30" cy="27" r="12" fill="${skin}"/><circle cx="30" cy="27" r="12" fill="url(#k4-shade)"/>` +
    `<circle cx="25.5" cy="26" r="1.7" fill="#1A0E06"/><circle cx="34.5" cy="26" r="1.7" fill="#1A0E06"/>${mouth}${front}</svg>`;
}
const CROWD: P[] = [{ hat: 'cap', robe: '#2F6B9A', robe2: '#24557C', hatc: '#E9D9A6', arm: 'clap' }, { hat: 'hijab', hatc: '#C2185B', robe: '#AD1457', robe2: '#880E4F', skin: 2, arm: 'clap' },
  { hat: 'turban', robe: '#F4EBD0', robe2: '#D9CBA6', skin: 0, arm: 'clap' }, { hat: 'hijab', hatc: '#2E7D32', robe: '#388E3C', robe2: '#1B5E20', skin: 3, arm: 'clap' }, { hat: 'cap', hatc: '#B71C1C', robe: '#6A4C93', robe2: '#4A3470', skin: 1, arm: 'clap' }];
export function crowd(n = 5): string { return CROWD.slice(0, n).map((p, i) => `<span class="pp-w" style="--d:${i * .13}s">${person(p)}</span>`).join(''); }

/* ---- the Durbar ---- */
export function rider(L: string): string {
  return `<svg class="rider" viewBox="0 0 220 190" aria-hidden="true">` +
    `<ellipse cx="110" cy="182" rx="80" ry="7" fill="rgba(40,24,10,.28)"/>` +
    `<g class="flag"><path d="M150 6 L150 104" stroke="#5E3A1C" stroke-width="3"/><path class="cloth" d="M152 8 L206 14 Q198 30 206 46 L152 50 Z" fill="#C62828"/><path d="M152 8 L206 14 L206 18 L152 12 Z" fill="#FFD54A"/>` +
    `<text x="178" y="40" text-anchor="middle" class="flagL">${L}</text></g>` +
    `<g class="legs"><path class="lg a" d="M58 124 L52 176" stroke="#4E2E14" stroke-width="9" stroke-linecap="round"/><path class="lg b" d="M74 126 L80 176" stroke="#5E3A1C" stroke-width="9" stroke-linecap="round"/>` +
    `<path class="lg c" d="M138 124 L132 176" stroke="#4E2E14" stroke-width="9" stroke-linecap="round"/><path class="lg d" d="M152 122 L160 176" stroke="#5E3A1C" stroke-width="9" stroke-linecap="round"/></g>` +
    `<path class="tail" d="M46 100 Q24 110 28 150 Q40 128 50 112 Z" fill="#2B1608"/>` +
    `<ellipse cx="104" cy="106" rx="62" ry="28" fill="url(#k4-horse)"/>` +
    `<path d="M150 98 Q166 62 170 44 L186 50 Q178 82 164 112 Z" fill="url(#k4-horse)"/><path d="M168 42 Q190 38 200 56 Q198 66 186 64 Q178 56 170 56 Z" fill="#6B4422"/>` +
    `<circle cx="184" cy="50" r="2.2" fill="#1A0E06"/><path d="M160 58 Q156 80 148 96" stroke="#2B1608" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    `<path d="M70 86 L136 86 L142 120 L64 120 Z" fill="#B71C1C"/><path d="M70 92 L136 92 M68 102 L139 102 M66 112 L141 112" stroke="#FFD54A" stroke-width="2.4"/><path d="M76 96 h8 M96 96 h8 M116 96 h8" stroke="#2E7D32" stroke-width="4"/>` +
    `<path d="M170 46 L196 56 M176 44 L188 64" stroke="#C9A227" stroke-width="1.6"/>` +
    `<g transform="translate(74 -6) scale(.95)">${personInner({ hat: 'turban', robe: '#F4EBD0', robe2: '#D9CBA6', hatc: '#FFFFFF', arm: 'sword', skin: 1 })}</g>` +
    `</svg>`;
}
/* the inside of a person (for nesting in a bigger drawing) */
function personInner(o: P): string { return person(o).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''); }
export function emir(): string {
  return `<svg class="emir" viewBox="0 0 160 200" aria-hidden="true">` +
    `<ellipse cx="80" cy="192" rx="60" ry="6" fill="rgba(40,24,10,.28)"/>` +
    `<path d="M80 40 L80 120" stroke="#5E3A1C" stroke-width="4"/>` +
    `<g class="umbrella"><path d="M10 52 Q80 -6 150 52 Z" fill="#2E7D32"/><path d="M10 52 Q80 18 150 52" fill="none" stroke="#FFD54A" stroke-width="3"/>` +
    `<path d="M10 52 Q22 62 34 52 Q46 62 58 52 Q70 62 82 52 Q94 62 106 52 Q118 62 130 52 Q142 62 150 52" fill="#C62828"/><circle cx="80" cy="12" r="5" fill="#FFD54A"/></g>` +
    `<rect x="40" y="150" width="80" height="40" rx="6" fill="url(#k4-wood)"/><rect x="34" y="144" width="92" height="10" rx="4" fill="#8B5A2B"/>` +
    `<g transform="translate(46 70) scale(1.1)">${personInner({ hat: 'emir', robe: '#FFFFFF', robe2: '#E2DCCB', hatc: '#FFFFFF', arm: 'down', skin: 2 })}</g></svg>`;
}

/* ---- the dillali's board: the photo goes into the frame (an <img> laid over the drawing by the game) ---- */
export function dillali(): string {
  return `<svg class="dill" viewBox="0 0 120 200" aria-hidden="true"><ellipse cx="60" cy="194" rx="40" ry="5" fill="rgba(40,24,10,.28)"/>` +
    `<g transform="translate(18 70) scale(1.15)">${personInner({ hat: 'cap', hatc: '#E9D9A6', robe: '#5D4037', robe2: '#3E2723', arm: 'up', mouth: 'open', skin: 1 })}</g></svg>`;
}

/* ---- the mai shayi's stall ---- */
export function shayi(): string {
  return `<svg class="shayi" viewBox="0 0 280 200" aria-hidden="true"><ellipse cx="140" cy="194" rx="128" ry="6" fill="rgba(0,0,0,.35)"/>` +
    `<g transform="translate(112 18) scale(1.05)">${personInner({ hat: 'cap', hatc: '#E9D9A6', robe: '#1565C0', robe2: '#0D47A1', skin: 2, mouth: 'smile' })}</g>` +
    `<path d="M20 120 L260 120 L250 136 L30 136 Z" fill="#8B5A2B"/><rect x="20" y="112" width="240" height="10" rx="3" fill="#A87444"/>` +
    `<path d="M40 136 L40 190 M240 136 L240 190" stroke="#5E3A1C" stroke-width="6"/>` +
    `<g transform="translate(26 70)"><path d="M6 42 L46 42 L42 30 L10 30 Z" fill="#3A3A3A"/><ellipse cx="26" cy="30" rx="18" ry="5" fill="url(#k4-coal)"/>` +
    `<path d="M10 28 Q8 4 26 2 Q44 4 42 28 Z" fill="url(#k4-steel)"/><path d="M42 12 Q56 6 58 -4" stroke="#9AA3AD" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M14 6 Q26 -4 38 6" stroke="#5E5E5E" stroke-width="3" fill="none"/>` +
    `<g class="steam"><circle cx="60" cy="-10" r="5" fill="#fff" opacity=".7"/><circle cx="66" cy="-22" r="7" fill="#fff" opacity=".5"/><circle cx="60" cy="-36" r="9" fill="#fff" opacity=".35"/></g></g>` +
    `<g transform="translate(206 84)"><rect x="0" y="0" width="34" height="28" rx="4" fill="#FFD54A"/><text x="17" y="19" text-anchor="middle" class="kktx" style="font-size:9px">MILO</text></g>` +
    `<g class="lamp" transform="translate(-74 0)"><path d="M140 0 L140 10" stroke="#555" stroke-width="2"/><path d="M130 10 L150 10 L146 26 L134 26 Z" fill="#FFD54A" opacity=".95"/><circle cx="140" cy="30" r="22" fill="#FFD54A" opacity=".18"/></g></svg>`;
}

/* ---- groundnut sacks and the lorry ---- */
export function sacks(n: number, cap = 20): string {
  // a pyramid: bottom row widest; rows of 4,3,2,1 (and more rows for bigger numbers)
  const rows: number[] = []; let left = n, w = Math.max(1, Math.ceil((Math.sqrt(8 * n + 1) - 1) / 2));
  while (left > 0) { const r = Math.min(w, left); rows.push(r); left -= r; w = Math.max(1, w - 1); }
  const SW = 26, SH = 20; let out = '', y = 150; const maxw = rows[0] * SW;
  rows.forEach((r) => { const x0 = (maxw - r * SW) / 2; for (let i = 0; i < r; i++) { const x = x0 + i * SW;
    out += `<g transform="translate(${x} ${y - SH})"><path d="M2 4 Q2 0 7 0 L19 0 Q24 0 24 4 L25 17 Q13 22 1 17 Z" fill="url(#k4-sack)" stroke="#8B6A2E" stroke-width=".8"/>` +
      `<path d="M5 6 h16 M4 11 h18" stroke="#8B6A2E" stroke-width=".7" opacity=".6"/><path d="M10 0 Q13 -4 16 0" stroke="#8B6A2E" stroke-width="1.2" fill="none"/></g>`; }
    y -= SH - 4; });
  // every stack on the same scale, standing on the same floor, so a bigger number is a bigger pile (never a zoomed small one)
  const wc = Math.ceil((Math.sqrt(8 * cap + 1) - 1) / 2), W = wc * SW + 8, H = wc * (SH - 4) + 14;
  return `<svg class="sacks" viewBox="${(maxw - W) / 2} ${156 - H} ${W} ${H}" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${out}</svg>`;
}
export function lorry(): string {
  return `<svg class="lorry" viewBox="0 0 260 140" aria-hidden="true"><ellipse cx="130" cy="132" rx="118" ry="6" fill="rgba(40,24,10,.3)"/>` +
    `<rect x="10" y="40" width="160" height="66" rx="4" fill="#2E7D32"/><path d="M10 52 h160 M10 66 h160 M10 80 h160 M10 94 h160" stroke="#1B5E20" stroke-width="2"/>` +
    `<path d="M172 54 L222 54 Q240 58 244 80 L246 110 L172 110 Z" fill="#C62828"/><path d="M182 60 L218 60 Q230 62 234 80 L182 80 Z" fill="#BDE3F2"/>` +
    `<rect x="6" y="104" width="244" height="10" rx="3" fill="#3A3A3A"/><text x="90" y="80" text-anchor="middle" class="kktx" style="font-size:14px">GYAƊA · KANO</text>` +
    `<g class="load"></g>` +
    `<g class="wheel" style="transform-origin:50px 118px"><circle cx="50" cy="118" r="16" fill="#222"/><circle cx="50" cy="118" r="7" fill="#9AA3AD"/></g>` +
    `<g class="wheel" style="transform-origin:130px 118px"><circle cx="130" cy="118" r="16" fill="#222"/><circle cx="130" cy="118" r="7" fill="#9AA3AD"/></g>` +
    `<g class="wheel" style="transform-origin:212px 118px"><circle cx="212" cy="118" r="16" fill="#222"/><circle cx="212" cy="118" r="7" fill="#9AA3AD"/></g></svg>`;
}

/* ---- animals: a red Bororo zebu with lyre horns, a white Sallah ram, a Sokoto red goat ---- */
export function cow(cls = ''): string {
  return `<svg class="beast cowsvg ${cls}" viewBox="0 0 200 150" aria-hidden="true"><ellipse cx="100" cy="144" rx="78" ry="6" fill="rgba(40,24,10,.28)"/>` +
    `<g class="legs"><path class="lg a" d="M52 100 L48 142" stroke="#5E2410" stroke-width="9" stroke-linecap="round"/><path class="lg b" d="M68 102 L72 142" stroke="#6B2C14" stroke-width="9" stroke-linecap="round"/>` +
    `<path class="lg c" d="M126 100 L122 142" stroke="#5E2410" stroke-width="9" stroke-linecap="round"/><path class="lg d" d="M140 100 L146 142" stroke="#6B2C14" stroke-width="9" stroke-linecap="round"/></g>` +
    `<path class="tail" d="M36 74 Q22 90 28 118" stroke="#5E2410" stroke-width="4" fill="none"/><path d="M24 114 Q28 124 32 116 Z" fill="#2B1608"/>` +
    `<ellipse cx="96" cy="80" rx="62" ry="30" fill="url(#k4-cow)"/><path d="M118 52 Q130 38 144 52 Z" fill="#8E3E1A"/>` +
    `<path d="M146 60 Q166 54 176 70 Q182 92 172 100 Q160 102 152 92 Z" fill="#9C4420"/><path d="M146 86 Q150 104 140 112" stroke="#7A3416" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    `<path d="M156 62 Q136 30 148 6 M170 62 Q190 30 178 6" stroke="#F1E2C0" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M148 6 Q146 2 150 0 M178 6 Q180 2 176 0" stroke="#3A2410" stroke-width="5" stroke-linecap="round"/>` +
    `<circle cx="166" cy="76" r="2.4" fill="#1A0E06"/><ellipse cx="174" cy="94" rx="6" ry="5" fill="#6B2C14"/></svg>`;
}
export function ram(cls = ''): string {
  return `<svg class="beast ramsvg ${cls}" viewBox="0 0 180 150" aria-hidden="true"><ellipse cx="90" cy="144" rx="66" ry="6" fill="rgba(40,24,10,.28)"/>` +
    `<g class="legs"><path class="lg a" d="M48 104 L46 142" stroke="#5A5048" stroke-width="7" stroke-linecap="round"/><path class="lg b" d="M62 104 L64 142" stroke="#6E645A" stroke-width="7" stroke-linecap="round"/>` +
    `<path class="lg c" d="M112 104 L110 142" stroke="#5A5048" stroke-width="7" stroke-linecap="round"/><path class="lg d" d="M126 104 L130 142" stroke="#6E645A" stroke-width="7" stroke-linecap="round"/></g>` +
    `<path d="M30 84 Q20 50 54 48 Q64 30 88 40 Q108 28 124 44 Q150 46 146 76 Q156 100 128 108 Q100 118 76 110 Q38 116 30 84 Z" fill="url(#k4-ram)" stroke="#CFC6B4" stroke-width="1.4"/>` +
    `<path d="M140 58 Q164 52 170 72 Q172 92 160 96 Q148 94 140 80 Z" fill="#EDE6D6"/><circle cx="160" cy="70" r="2.2" fill="#1A0E06"/>` +
    `<path d="M144 58 Q128 36 146 30 Q166 30 160 50 Q156 60 148 56" stroke="#8B6A3E" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
}
export function goat(cls = ''): string {
  return `<svg class="beast goatsvg ${cls}" viewBox="0 0 170 150" aria-hidden="true"><ellipse cx="86" cy="144" rx="60" ry="6" fill="rgba(40,24,10,.28)"/>` +
    `<g class="legs"><path class="lg a" d="M50 98 L48 142" stroke="#5E2410" stroke-width="6" stroke-linecap="round"/><path class="lg b" d="M62 98 L64 142" stroke="#6B2C14" stroke-width="6" stroke-linecap="round"/>` +
    `<path class="lg c" d="M108 98 L106 142" stroke="#5E2410" stroke-width="6" stroke-linecap="round"/><path class="lg d" d="M120 98 L124 142" stroke="#6B2C14" stroke-width="6" stroke-linecap="round"/></g>` +
    `<path d="M36 70 Q30 60 38 58" stroke="#8E3E1A" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="84" cy="80" rx="50" ry="24" fill="#A8461C"/><path d="M124 64 Q146 48 154 64 Q158 80 150 86 Q138 86 128 80 Z" fill="#B5522A"/>` +
    `<path d="M136 56 Q130 34 120 28 M144 54 Q144 32 136 24" stroke="#3A2410" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M152 84 Q150 96 146 98" stroke="#6B2C14" stroke-width="3" fill="none"/>` +
    `<circle cx="144" cy="66" r="2" fill="#1A0E06"/></svg>`;
}

/* ---- the herd's pen: a ring of thorn branches with a gate, and a Fulani herder ---- */
export function zariba(): string {
  let thorns = ''; for (let i = 0; i <= 26; i++) { const a = Math.PI * (1.05 + i * 0.9 / 26), x = 150 + Math.cos(a) * 140, y = 110 + Math.sin(a) * 60;
    thorns += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.random() * 10 - 5).toFixed(1)} -${(10 + Math.random() * 10).toFixed(1)} m0 6 l6 -4 m-10 2 l-6 -5" stroke="#6B4422" stroke-width="2.4" stroke-linecap="round" fill="none"/>`; }
  return `<svg class="zariba" viewBox="0 0 300 130" aria-hidden="true"><ellipse cx="150" cy="112" rx="142" ry="16" fill="rgba(122,74,34,.3)"/>${thorns}` +
    `<path d="M10 108 Q150 40 290 108" stroke="#5E3A1C" stroke-width="5" fill="none" stroke-dasharray="2 5" stroke-linecap="round"/></svg>`;
}
export function herder(): string { return person({ hat: 'malafa', robe: '#6D4C41', robe2: '#4E342E', arm: 'staff', skin: 0 }); }

/* ---- the mai suya at his grill, and naira notes ---- */
export function suya(): string {
  let sticks = ''; for (let i = 0; i < 7; i++) { const x = 46 + i * 28;
    sticks += `<g class="stick" style="--d:${i * .2}s"><path d="M${x} 100 L${x + 4} 146" stroke="#D9B46A" stroke-width="2"/>` +
      [0, 1, 2, 3].map((k) => `<rect x="${x - 6 + k * 1}" y="${104 + k * 9}" width="14" height="8" rx="3" fill="${k % 2 ? '#7A3416' : '#8E3E1A'}"/><circle cx="${x + k}" cy="${107 + k * 9}" r="1.3" fill="#D84315"/>`).join('') + `</g>`; }
  return `<svg class="suya" viewBox="0 0 280 210" aria-hidden="true"><ellipse cx="140" cy="204" rx="130" ry="6" fill="rgba(0,0,0,.35)"/>` +
    `<g transform="translate(108 0) scale(1.05)">${personInner({ hat: 'cap', hatc: '#B71C1C', robe: '#F4EBD0', robe2: '#D9CBA6', skin: 0 })}</g>` +
    `<rect x="24" y="92" width="232" height="70" rx="8" fill="url(#k4-wood)"/><rect x="34" y="100" width="212" height="54" rx="4" fill="#2B1608"/>` +
    `<rect x="40" y="140" width="200" height="12" rx="3" fill="url(#k4-coal)" class="coals"/>${sticks}` +
    `<path d="M24 162 L256 162 L246 200 L34 200 Z" fill="#5E3A1C"/><rect x="90" y="168" width="100" height="24" rx="4" fill="#FFD54A"/><text x="140" y="186" text-anchor="middle" class="kktx">SUYA</text>` +
    `<g class="smoke"><circle cx="80" cy="84" r="8" fill="#9E9E9E" opacity=".35"/><circle cx="150" cy="78" r="10" fill="#9E9E9E" opacity=".3"/><circle cx="210" cy="86" r="7" fill="#9E9E9E" opacity=".35"/></g></svg>`;
}
const NOTE: Record<number, [string, string]> = { 5: ['#7E57C2', '#5E35B1'], 10: ['#E57373', '#C62828'], 20: ['#FFB74D', '#E65100'], 50: ['#4FC3F7', '#0277BD'], 100: ['#90CAF9', '#1565C0'], 200: ['#AED581', '#558B2F'], 500: ['#80CBC4', '#00695C'], 1000: ['#BCAAA4', '#4E342E'] };
export function note(n: number): string {
  const [a, b] = NOTE[n] || ['#C5E1A5', '#33691E'];
  return `<svg class="note" viewBox="0 0 220 110" aria-hidden="true"><rect x="2" y="2" width="216" height="106" rx="8" fill="${a}" stroke="${b}" stroke-width="3"/>` +
    `<rect x="12" y="12" width="196" height="86" rx="5" fill="none" stroke="${b}" stroke-width="1.4" stroke-dasharray="3 3"/>` +
    `<ellipse cx="160" cy="55" rx="28" ry="34" fill="${b}" opacity=".25"/><circle cx="160" cy="46" r="12" fill="${b}" opacity=".45"/><path d="M140 82 Q160 62 180 82" fill="${b}" opacity=".45"/>` +
    `<text x="24" y="40" class="ntop" fill="${b}">NAIRA</text><text x="24" y="86" class="namt" fill="${b}">₦${n.toLocaleString('en-GB')}</text></svg>`;
}

/* ---- the allo: a wooden writing board with its handle, the word in ink ---- */
export function allo(word: string): string {
  return `<svg class="allosvg" viewBox="0 0 260 250" aria-hidden="true"><ellipse cx="130" cy="244" rx="70" ry="5" fill="rgba(40,24,10,.3)"/>` +
    `<rect x="110" y="196" width="40" height="48" rx="10" fill="#3A220E"/><circle cx="130" cy="228" r="6" fill="#1A0E06"/>` +
    `<rect x="10" y="10" width="240" height="196" rx="40" fill="url(#k4-allo)"/><rect x="22" y="22" width="216" height="172" rx="32" fill="#4A2E14"/>` +
    `<ellipse cx="80" cy="60" rx="50" ry="24" fill="#fff" opacity=".05"/>` +
    `<g class="ink"><text x="130" y="122" text-anchor="middle" class="allow">${word}</text><path d="M50 150 q20 -8 40 0 t40 0 t40 0 t40 0" stroke="#F5EEDC" stroke-width="2" fill="none" opacity=".35"/></g>` +
    `<g class="wash"><rect x="22" y="22" width="216" height="172" rx="32" fill="#7FB8D9" opacity=".0"/><g class="drops"><circle cx="70" cy="40" r="4" fill="#BDE3F2"/><circle cx="130" cy="30" r="5" fill="#BDE3F2"/><circle cx="190" cy="44" r="4" fill="#BDE3F2"/></g></g></svg>`;
}

/* ---- the letter writer at his table, and the dispatch rider ---- */
export function marubuci(): string {
  return `<svg class="marub" viewBox="0 0 200 210" aria-hidden="true"><ellipse cx="100" cy="204" rx="90" ry="6" fill="rgba(40,24,10,.3)"/>` +
    `<path d="M100 4 L100 70" stroke="#5E3A1C" stroke-width="3"/><path d="M10 40 Q100 -20 190 40 Z" fill="#E65100"/><path d="M10 40 Q30 50 50 40 Q70 50 90 40 Q110 50 130 40 Q150 50 170 40 Q180 46 190 40" fill="#FFB300"/>` +
    `<g transform="translate(66 50) scale(.95)">${personInner({ hat: 'cap', hatc: '#F4EBD0', robe: '#283593', robe2: '#1A237E', skin: 1, arm: 'down' })}</g>` +
    `<rect x="20" y="140" width="160" height="14" rx="3" fill="#8B5A2B"/><path d="M34 154 L34 200 M166 154 L166 200" stroke="#5E3A1C" stroke-width="6"/>` +
    `<rect x="60" y="120" width="50" height="22" rx="3" fill="#455A64"/><rect x="64" y="114" width="42" height="8" rx="2" fill="#ECEFF1"/><path d="M66 128 h38 M66 134 h38" stroke="#90A4AE" stroke-width="2" stroke-dasharray="3 2"/>` +
    `<path class="pen" d="M128 136 L150 112" stroke="#1F4E9C" stroke-width="4" stroke-linecap="round"/></svg>`;
}
export function achaba(): string {
  return `<svg class="achaba" viewBox="0 0 200 130" aria-hidden="true"><ellipse cx="100" cy="124" rx="86" ry="5" fill="rgba(40,24,10,.3)"/>` +
    `<path d="M40 100 L80 70 L140 70 L160 100" stroke="#C62828" stroke-width="10" fill="none" stroke-linejoin="round"/><rect x="74" y="58" width="56" height="12" rx="5" fill="#212121"/>` +
    `<path d="M150 70 L162 40 L176 40" stroke="#424242" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="30" y="62" width="34" height="26" rx="3" fill="#FFD54A"/><text x="47" y="80" text-anchor="middle" class="kktx" style="font-size:9px">POST</text>` +
    `<g transform="translate(78 2) scale(.62)">${personInner({ hat: 'cap', hatc: '#F4EBD0', robe: '#2E7D32', robe2: '#1B5E20', skin: 2 })}</g>` +
    `<g class="wheel" style="transform-origin:40px 104px"><circle cx="40" cy="104" r="18" fill="#222"/><circle cx="40" cy="104" r="7" fill="#9AA3AD"/></g>` +
    `<g class="wheel" style="transform-origin:160px 104px"><circle cx="160" cy="104" r="18" fill="#222"/><circle cx="160" cy="104" r="7" fill="#9AA3AD"/></g></svg>`;
}
/* a passenger for the ferry */
export function passenger(i: number): string {
  const P: P[] = [{ hat: 'hijab', hatc: '#6A1B9A', robe: '#8E24AA', robe2: '#6A1B9A', skin: 1 }, { hat: 'cap', hatc: '#E9D9A6', robe: '#00838F', robe2: '#006064', skin: 0 },
    { hat: 'hijab', hatc: '#EF6C00', robe: '#F57C00', robe2: '#E65100', skin: 2 }, { hat: 'turban', robe: '#F4EBD0', robe2: '#D9CBA6', skin: 3 }, { hat: 'cap', hatc: '#B71C1C', robe: '#455A64', robe2: '#263238', skin: 1 }];
  return person(P[i % P.length]);
}
import { SCENES4 } from './scenes4';
/** the drawings' shared gradients, and each Arewa game's own painted place added to the scenes */
export function bootArt4(KART?: any): void { defs(); if (KART) Object.assign(KART.scene, SCENES4); }
