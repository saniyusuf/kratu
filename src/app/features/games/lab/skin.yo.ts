/* The Yoruba build's games (see skin.ts): its own scenes and hats; pieces are added as they are drawn. */
import { GameSkin } from './skin-type';
import { makeScenes } from './scenes';
import { makeArt } from './south-art';
import { capYo } from './south';
import { southGames } from './south-games';

export const SKIN: GameSkin | null = { code: 'yo', scene: makeScenes('yo'), cap: capYo, art: makeArt('yo'), games: (g) => southGames(g, 'yo') };
