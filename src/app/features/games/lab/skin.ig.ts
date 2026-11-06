/* The Igbo build's games (see skin.ts): its own scenes and hats; pieces are added as they are drawn. */
import { GameSkin } from './skin-type';
import { makeScenes } from './scenes';
import { capIg } from './south';

export const SKIN: GameSkin | null = { code: 'ig', scene: makeScenes('ig'), cap: capIg, art: {} };
