/*
 * A language build's own games (Sani 2026-11-06: the Yoruba and Igbo apps get their own culture games, designed 28 Oct:
 * https://claude.ai/artifact/W5cJfx4ngNGtVhPPzkBgSa). Every game keeps how it plays, its lesson slot and its pass mark;
 * only its world changes: the drawn scene behind it, the people's dress and the things in their hands.
 *
 * The Hausa app has no skin: this file is null, and the games are exactly as they were. The yo and ig builds swap it for
 * skin.yo.ts / skin.ig.ts (angular.json fileReplacements), so the Hausa bundle never carries their drawings.
 */
import { GameSkin } from './skin-type';
export type { GameSkin };

export const SKIN: GameSkin | null = null;
