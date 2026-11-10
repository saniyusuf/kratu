/* The Naija Pidgin build's games (see skin.ts): 8 games of its own (pidgin-games.ts); the other slots keep the Hausa games. */
import { GameSkin } from './skin-type';
import { southGames } from './south-games';

export const SKIN: GameSkin | null = { code: 'pcm', scene: {}, art: {}, games: (g) => southGames(g, 'pcm') };
