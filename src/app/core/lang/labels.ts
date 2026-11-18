/** One written label in the dictionary (content/labels.json). The Hausa text is the key a screen asks for. */
export interface Label { en: string; kind: 'button' | 'screen' | 'play' | 'game' }

/**
 * Which written labels a build shows. null = Hausa everywhere (the school app). The family app passes the English
 * dictionary; inGame is the switch for the written instructions inside games (kind "play").
 */
export interface EnLabels { map: Record<string, Label>; inGame: boolean }
