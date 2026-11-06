/** What a language build may swap in the games (skin.ts). */
export interface GameSkin {
  /** the build's language code */
  code: string;
  /** the drawn background of a game, by game id, in place of the Hausa one */
  scene: Record<string, () => string>;
  /** headwear in place of the Hausa caps (capsArewa.arewaCap): same arguments, the build's own hats */
  cap?: (kind: string, x: number, y: number, w: number, c?: string, c2?: string, c3?: string, side?: number) => string;
  /** a game's own pieces in place of the Hausa ones (the king, his guards, the counted things …), by the Hausa export's name */
  art: Record<string, (...a: any[]) => any>;
}
