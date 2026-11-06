/* The games board's cards (Sani 2026-11-05, board page FXutYbSx3L9GDtdpHiRk7U, option 4): each card is shaped like its
   own game — a woven tray, an allo with its handle, a clay pot, a brick wall, a price board on posts, an envelope with
   its stamp — and holds a still of the game's own scene (assets/games/<id>.webp, taken with no answer buttons in it).
   Kept apart from the engine so the board never pulls the games into the start-up script. */

/** The five rows, top to bottom: what the games in them practise. */
export type Kind = 'l' | 'w' | 'r' | 's' | 'n';
export const KINDS: Kind[] = ['l', 'w', 'r', 's', 'n'];
export const KIND_COLOUR: Record<Kind, string> = { l: '#E63946', w: '#2F6DB5', r: '#E9A23B', s: '#8E5BB5', n: '#2E9C57' };

/** Each game: its row and the shape of its card. */
export const BOARD_GAMES: Record<string, { kind: Kind; frame: string; colour?: string }> = {
  'fashe': { kind: 'l', frame: 'balloon' }, 'j-durbar': { kind: 'l', frame: 'arch' },
  'j-abubuwa': { kind: 'w', frame: 'net' }, 'j-magana': { kind: 'w', frame: 'drum' }, 'j-dillali': { kind: 'w', frame: 'sign', colour: '#5B3A1E' },
  'j-nemo': { kind: 'w', frame: 'tray' }, 'j-shayi': { kind: 'w', frame: 'kettle' },
  'j-karatu': { kind: 'r', frame: 'boat' }, 'j-allo': { kind: 'r', frame: 'allo' }, 'j-jirgi': { kind: 'r', frame: 'boat' }, 'j-ruwa': { kind: 'r', frame: 'cloud' },
  'j-rubutu': { kind: 's', frame: 'pot' }, 'j-rubutu-say': { kind: 's', frame: 'brick' }, 'j-marubuci': { kind: 's', frame: 'env' }, 'j-rini': { kind: 's', frame: 'cloth' },
  // not drawn on the design page: the nearest shapes from it
  'j-gyada': { kind: 'n', frame: 'tray' }, 'j-shanu': { kind: 'n', frame: 'sign' }, 'j-garke': { kind: 'n', frame: 'sign', colour: '#3E5B2A' }, 'j-suya': { kind: 'n', frame: 'drum' },
};

const F = "font-family:'Baloo 2',sans-serif;font-weight:800";
let uid = 0;
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function lab(x: number, y: number, t: string, fill = '#fff', size = 19, stroke?: string): string {
  return `<text x="${x}" y="${y}" text-anchor="middle" style="${F};font-size:${size}px" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="4" paint-order="stroke"` : ''}>${esc(t)}</text>`;
}
function im(src: string, x: number, y: number, w: number, h: number, rx = 10, clip?: string): string {
  const id = 'gbc' + uid++;
  return `<clipPath id="${id}">${clip || `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`}</clipPath><image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
}
const FR: Record<string, (k: string, n: string, c?: string) => string> = {
  tray: (k, n) => { const p = 'gbw' + uid++; return `<defs><pattern id="${p}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#D9A55A"/><rect width="7" height="14" fill="#C08A3E"/></pattern></defs><path d="M8 20Q8 6 22 6H238Q252 6 252 20V150Q252 196 130 196Q8 196 8 150Z" fill="url(#${p})" stroke="#8A5A2B" stroke-width="5"/>${im(k, 24, 20, 212, 118)}${lab(130, 174, n, '#fff', 19, '#7A4A1E')}`; },
  allo: (k, n) => `<rect x="104" y="0" width="52" height="30" rx="14" fill="#B98348" stroke="#6B4320" stroke-width="5"/><rect x="118" y="8" width="24" height="12" rx="6" fill="#F3E7CC"/><rect x="8" y="22" width="244" height="174" rx="34" fill="#C9965A" stroke="#6B4320" stroke-width="5"/>${im(k, 28, 40, 204, 110, 14)}${lab(130, 180, n, '#3B2412', 21)}`,
  pot: (k, n) => `<path d="M96 8H164V22Q164 34 184 44Q252 76 246 134Q240 196 130 196Q20 196 14 134Q8 76 76 44Q96 34 96 22Z" fill="#C8693F" stroke="#7A3A1E" stroke-width="5"/>${im(k, 24, 40, 212, 92, 0, '<path d="M40 64Q130 40 220 64Q236 96 232 128H28Q24 96 40 64Z"/>')}<rect x="92" y="4" width="76" height="12" rx="6" fill="#A04A28"/>${lab(130, 172, n, '#fff', 21, '#7A3A1E')}`,
  brick: (k, n) => { const p = 'gbb' + uid++; return `<defs><pattern id="${p}" width="40" height="20" patternUnits="userSpaceOnUse"><rect width="40" height="20" fill="#E3B98A"/><rect x="1" y="1" width="38" height="8" fill="#C9874E"/><rect x="-19" y="11" width="38" height="8" fill="#B9773E"/><rect x="21" y="11" width="38" height="8" fill="#C9874E"/></pattern></defs><rect x="6" y="6" width="248" height="188" rx="8" fill="url(#${p})" stroke="#8A4A22" stroke-width="5"/>${im(k, 24, 22, 212, 118, 4)}<rect x="18" y="148" width="224" height="34" rx="4" fill="#7A4522"/>${lab(130, 172, n, '#FFE58A', 20)}`; },
  sign: (k, n, c) => `<rect x="56" y="140" width="14" height="58" fill="#7A5230"/><rect x="190" y="140" width="14" height="58" fill="#7A5230"/><rect x="6" y="4" width="248" height="162" rx="8" fill="${c || '#2E2A26'}" stroke="#5B4636" stroke-width="5"/>${im(k, 20, 16, 220, 108, 4)}${lab(130, 152, n, '#fff', 19)}`,
  env: (k, n) => `<rect x="6" y="20" width="248" height="174" rx="10" fill="#F6F1E4" stroke="#B9A27A" stroke-width="4"/><path d="M6 30L130 104L254 30" fill="none" stroke="#CDBB93" stroke-width="4"/><rect x="196" y="30" width="44" height="52" fill="#E63946" stroke="#fff" stroke-width="4"/><circle cx="218" cy="56" r="11" fill="#2E9C57"/>${im(k, 22, 40, 160, 100, 6)}${lab(130, 172, n, '#3B2412', 19)}`,
  arch: (k, n) => `<path d="M8 196V86Q130 -24 252 86V196Z" fill="#C8693F" stroke="#8A3A1A" stroke-width="5"/><path d="M26 196V92Q130 4 234 92V196" fill="none" stroke="#2E9C57" stroke-width="6"/>${im(k, 34, 36, 192, 112, 0, '<path d="M36 148V96Q130 22 224 96V148Z"/>')}${lab(130, 180, n, '#fff', 20, '#8A3A1A')}`,
  drum: (k, n) => `<path d="M14 10H246L222 100L246 190H14L38 100Z" fill="#9A5B2E" stroke="#5B3018" stroke-width="5"/><path d="M14 10L38 100L14 190M246 10L222 100L246 190" stroke="#F3E7CC" stroke-width="2" fill="none"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${30 + i * 28} 12 L${44 + i * 28} 188" stroke="#E8D3A8" stroke-width="2" opacity=".55"/>`).join('')}${im(k, 42, 24, 176, 104, 8)}${lab(130, 164, n, '#fff', 21, '#5B3018')}`,
  cloud: (k, n) => `<path d="M30 196Q6 196 8 170V70Q8 46 34 46Q40 12 82 18Q104 -4 140 10Q176 -2 196 26Q240 22 246 60Q256 66 252 90V170Q254 196 230 196Z" fill="#9FB7C9" stroke="#5E7A90" stroke-width="5"/>${im(k, 26, 50, 208, 96, 12)}${lab(130, 178, n, '#fff', 20, '#41596C')}`,
  boat: (k, n) => `${im(k, 22, 6, 216, 124, 12)}<rect x="22" y="6" width="216" height="124" rx="12" fill="none" stroke="#FFFDF6" stroke-width="5"/><path d="M4 140Q130 166 256 140Q244 194 210 196H50Q16 194 4 140Z" fill="#7A4A26" stroke="#4A2A14" stroke-width="4"/>${lab(130, 180, n, '#FFE58A', 20)}`,
  cloth: (k, n) => `<rect x="6" y="6" width="248" height="188" rx="10" fill="#26408B" stroke="#14245A" stroke-width="5"/>${Array.from({ length: 16 }, (_, i) => { const x = 20 + (i % 8) * 31, y = i < 8 ? 16 : 184; return `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="#C9D6F2" stroke-width="2.5"/>`; }).join('')}${im(k, 22, 28, 216, 110, 6)}${lab(130, 168, n, '#fff', 20)}`,
  net: (k, n) => { const p = 'gbn' + uid++; return `<defs><pattern id="${p}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" fill="#2C8C8C"/><path d="M0 0H16M0 0V16" stroke="#BFE6E0" stroke-width="2"/></pattern></defs><rect x="6" y="6" width="248" height="188" rx="24" fill="url(#${p})" stroke="#1D6464" stroke-width="5"/>${im(k, 24, 22, 212, 114, 14)}${lab(130, 172, n, '#fff', 20, '#1D6464')}`; },
  balloon: (k, n) => `<path d="M130 160L124 174H136Z" fill="#C0392B"/><path d="M130 174Q120 186 132 198" stroke="#7A5230" stroke-width="2" fill="none"/><ellipse cx="130" cy="84" rx="112" ry="80" fill="#E63946" stroke="#9E2A2B" stroke-width="5"/>${im(k, 40, 24, 180, 108, 0, '<ellipse cx="130" cy="78" rx="90" ry="54"/>')}${lab(130, 150, n, '#fff', 19, '#9E2A2B')}`,
  kettle: (k, n) => `<path d="M232 70Q262 60 256 30" stroke="#2E7D4F" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="6" y="20" width="236" height="176" rx="40" fill="#2E9C57" stroke="#1E6B3A" stroke-width="5"/><rect x="96" y="4" width="56" height="22" rx="10" fill="#1E6B3A"/>${im(k, 24, 38, 200, 104, 16)}${lab(124, 176, n, '#fff', 20, '#1E6B3A')}`,
};

/** A won game's card: its own shape around a still of its scene. */
export function cardSvg(id: string, name: string): string {
  const g = BOARD_GAMES[id];
  return `<svg viewBox="-6 -6 272 212" aria-hidden="true">${FR[g.frame]('assets/games/' + id + '.webp', name, g.colour)}</svg>`;
}

/** The picture at the head of each row: what its games practise. */
export function headHtml(k: Kind): string {
  if (k === 'l') return `<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="6" y="26" width="32" height="36" rx="8" fill="#FBC02D"/><text x="22" y="52" style="${F};font-size:24px" text-anchor="middle" fill="#3B2E1E">A</text><rect x="44" y="18" width="32" height="36" rx="8" fill="#1FA1D8"/><text x="60" y="44" style="${F};font-size:24px" text-anchor="middle" fill="#fff">B</text><rect x="82" y="28" width="32" height="36" rx="8" fill="#4CAF50"/><text x="98" y="54" style="${F};font-size:24px" text-anchor="middle" fill="#fff">C</text></svg>`;
  if (k === 'w') return `<img src="assets/pictures/dog.webp" alt="">`;
  if (k === 'r') return `<svg viewBox="0 0 60 40" aria-hidden="true"><path d="M30 8Q18 2 4 4V36Q18 34 30 40Q42 34 56 36V4Q42 2 30 8Z" fill="#FFFDF6"/><path d="M30 8V40" stroke="#C9A26B" stroke-width="2"/><path d="M9 12h15M9 18h15M9 24h12M36 12h15M36 18h15M36 24h12" stroke="#C9A26B" stroke-width="2"/></svg>`;
  if (k === 's') return `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M12 48L44 16L50 22L18 54L10 56Z" fill="#F2B632" stroke="#7A5230" stroke-width="2"/><path d="M44 16L48 12Q51 9 54 12Q57 15 54 18L50 22Z" fill="#E63946"/><path d="M10 56L12 48L18 54Z" fill="#2B2418"/></svg>`;
  return `<b>123</b>`;
}
