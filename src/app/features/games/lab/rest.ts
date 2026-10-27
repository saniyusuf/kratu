// @ts-nocheck
/*
 * Shared bits for the games reworked on 2026-10-25 (Sani: "increase realism with new background details, fix Laila and
 * the voice"): Hanzarin kasuwa, Dalar gyaɗa, Kasuwar dabbobi, Mai suya, Kwale-kwale, Allo, Jirgin ruwa, Tukwane,
 * Ginin bulo and Marubucin wasiƙa. Each has its own drawn scene (sc-*.ts / sc-*.css) whose people react to the answers.
 */
import { kogiScene } from './sc-kogi';
import { jirgiScene } from './sc-jirgi';
import { alloScene } from './sc-allo';
import { wasikaScene } from './sc-wasika';
import { tukwaneScene } from './sc-tukwane';
import { buloScene } from './sc-bulo';
import { kasuwaScene } from './sc-kasuwa';
import { suyaScene } from './sc-suya';
import { gyadaScene } from './sc-gyada';
import { shanuScene } from './sc-shanu';
import { garkeScene } from './sc-garke';
import { dillaliScene } from './sc-dillali';

/** the drawn background of each reworked game, by game id (sc-*.ts, wired in as each is drawn) */
const SCENE: Record<string, () => string> = {
  'j-karatu': kogiScene, 'j-jirgi': jirgiScene, 'j-allo': alloScene, 'j-marubuci': wasikaScene, 'j-rubutu': tukwaneScene, 'j-rubutu-say': buloScene,
  'j-nemo': kasuwaScene, 'j-suya': suyaScene, 'j-gyada': gyadaScene, 'j-shanu': shanuScene, 'j-garke': garkeScene,
  'j-dillali': dillaliScene,
};
export function restScene(gid: string): string | null { const f = SCENE[gid]; return f ? f() : null; }

/** the scene's people react: .cheer after a right answer, .sad after a wrong one (the classes sit on .gbg) */
export function react(scr: HTMLElement, kind: 'cheer' | 'sad'): void {
  const g = scr && scr.closest && scr.closest('.glab') && scr.closest('.glab').querySelector('.gbg'); if (!g) return;
  g.classList.remove('cheer', 'sad'); void g.offsetWidth; g.classList.add(kind);
  clearTimeout(g._rt); g._rt = setTimeout(() => g.classList.remove(kind), kind === 'cheer' ? 2600 : 2000);
}

/** Hanzarin kasuwa's calabash with the goods' photo standing in it, the photo filling its card edge to edge (Sani
 *  2026-10-25: "full container, no white border"). r5 realism: the card stands INSIDE the calabash: the back of the rim
 *  and the dark hollow are behind it, the front lip and the gourd's belly in front of its foot; the gourd is lit from
 *  the upper left with a pokerwork band, and its contact shadow sits right under it on the mat. */
let bowlN = 0;
export function bowl2(img: string): string {
  const id = 'rb-clip' + (++bowlN);
  return '<svg viewBox="0 -34 100 104" class="art"><clipPath id="' + id + '"><rect x="9" y="-33" width="82" height="73" rx="10"/></clipPath>' +
    '<ellipse cx="50" cy="62.6" rx="40" ry="4.2" fill="rgba(40,20,6,.4)"/>' +
    '<ellipse cx="50" cy="30" rx="44" ry="11" fill="#9A6424"/><ellipse cx="50" cy="30" rx="39.4" ry="8" fill="#3E2408"/>' +
    '<image href="' + img + '" x="9" y="-33" width="82" height="73" preserveAspectRatio="xMidYMid slice" clip-path="url(#' + id + ')"/>' +
    '<rect x="9" y="-33" width="82" height="73" rx="10" fill="none" stroke="#6B4422" stroke-width="2.2"/>' +
    '<path d="M6 30 Q10 64 50 64 Q90 64 94 30 A44 11 0 0 1 6 30 Z" fill="url(#kc-gourd)"/>' +
    '<path d="M6 30 A44 11 0 0 0 94 30 L89.4 30 A39.4 8 0 0 1 10.6 30 Z" fill="#C48A44"/><path d="M11 31.4 Q50 41.6 89 31.4" stroke="#F6D58E" stroke-width="1.1" fill="none" opacity=".75"/>' +
    '<path d="M13 47 Q50 57 87 47 M17 52.4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l3 -2.4" fill="none" stroke="#6A3E10" stroke-width="1.1" opacity=".55"/>' +
    '<path d="M12 42 Q15 54 26 59 Q17 51 16.4 42.6 Z" fill="#FFF4D6" opacity=".3"/></svg>';
}
