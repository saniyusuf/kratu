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
 *  2026-10-25: "full container, no white border"); a thin wooden rim sits on top of the picture */
let bowlN = 0;
export function bowl2(img: string): string {
  const id = 'rb-clip' + (++bowlN);
  return '<svg viewBox="0 -34 100 104" class="art"><defs><clipPath id="' + id + '"><rect x="9" y="-33" width="82" height="66" rx="10"/></clipPath></defs>' +
    '<ellipse cx="50" cy="64" rx="44" ry="5" fill="rgba(40,20,6,.35)"/>' +
    '<path d="M6 30 Q10 64 50 64 Q90 64 94 30 Z" fill="url(#kc-gourd)"/><path d="M14 44 Q50 54 86 44" fill="none" stroke="#7A4A12" stroke-width="1.4" opacity=".6"/>' +
    '<path d="M18 50 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4" fill="none" stroke="#5E3A0E" stroke-width="1" opacity=".5"/>' +
    '<ellipse cx="50" cy="30" rx="44" ry="11" fill="#8A5A1E"/><ellipse cx="50" cy="30" rx="40" ry="9" fill="#3E2408"/>' +
    '<rect x="9" y="-33" width="82" height="66" rx="10" fill="#3E2408"/>' +
    '<image href="' + img + '" x="9" y="-33" width="82" height="66" preserveAspectRatio="xMidYMid slice" clip-path="url(#' + id + ')"/>' +
    '<rect x="9" y="-33" width="82" height="66" rx="10" fill="none" stroke="#6B4422" stroke-width="2.2"/></svg>';
}
