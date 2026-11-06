/* The Yoruba build's games (see skin.ts): its own scenes and hats; pieces are added as they are drawn. */
import { GameSkin } from './skin-type';
import { makeScenes } from './scenes';
import { capYo } from './south';

export const SKIN: GameSkin | null = { code: 'yo', scene: makeScenes('yo'), cap: capYo, art: {} };
