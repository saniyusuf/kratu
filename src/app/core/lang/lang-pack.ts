/**
 * The language Laila speaks in this build. Hausa is the app; Swahili and Yoruba are demo builds of the same
 * curriculum, chosen at build time (angular.json configurations sw / yo swap lang.ts for lang.<code>.ts, which
 * build-content writes from content/langs/<code>/lang.json). Everything the child answers stays English.
 */
export interface LangPack {
  /** ha, sw, yo — the folder under assets/audio/ that holds this language's clips. */
  code: string;
  /** The language's own name for itself, for adults (settings, debug). */
  name: string;
  /** The bird's name in this language's build. The picture is the same bird. */
  bird: string;
  /** The browser recogniser's locale for the child's "my name is …" on the face screen. */
  sr: string;
  /** What a child says in front of their name ("sunana", "jina langu ni"), as patterns over the folded transcript. */
  carrier: string[];
  /** Words that may follow the carrier and are not the name (Hausa: "ne", "ni", "ce"). */
  carrierStop: string[];
  /** A word that ends the name when it follows it (Hausa: "ne"). */
  carrierEnd: string[];
  /** Fold accents and dotted letters (ọ ẹ ṣ ị ụ ṅ) to plain a–z before reading the transcript. Hausa reads it as it always did. */
  fold: boolean;
  /** The names bank is Hausa TTS: only the Hausa build says a child's name in Laila's voice. */
  namesBank: boolean;
  /** The example films have a child saying "Sunana …" in Hausa: other builds show them silent. */
  muteFilms: boolean;
  /** Text on screen: Hausa text → this language. Missing entries show as they are, with "Laila" changed to the bird's name. */
  ui: Record<string, string>;
}
