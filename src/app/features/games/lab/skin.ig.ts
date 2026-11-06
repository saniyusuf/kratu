/* The Igbo build's games (see skin.ts): its own scenes and hats; pieces are added as they are drawn. */
import { GameSkin } from './skin-type';
import { makeScenes } from './scenes';
import { makeArt } from './south-art';
import { capIg } from './south';
import { southGames } from './south-games';

export const SKIN: GameSkin | null = { code: 'ig', scene: makeScenes('ig'), cap: capIg, art: makeArt('ig'), games: (g) => southGames(g, 'ig') };
