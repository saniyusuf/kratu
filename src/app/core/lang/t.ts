import { LANG } from './lang';
import { EN_LABELS } from '../edition';

/** True when this build writes its labels in English (the family app): screens drop their small English second line. */
export const EN_ON = !!EN_LABELS;

/** The English for a label when this build shows English labels (the family app), else undefined. Game names stay Hausa. */
function english(s: string): string | undefined {
  const l = EN_LABELS?.map[s];
  if (!l || l.kind === 'game' || (l.kind === 'play' && !EN_LABELS!.inGame)) return undefined;
  return l.en;
}

/** A label in this build's language: the English dictionary first (family app), then the language pack. */
function look(s: string): string | undefined { return english(s) ?? LANG.ui[s]; }

/**
 * Text on screen in this build's language. The key IS today's Hausa text, so the Hausa build shows exactly what it always
 * did; another language looks it up in its pack, and anything it lacks keeps the text with "Laila" turned into its bird.
 * The family app shows the English from content/labels.json.
 */
export function t(s: string): string {
  const u = look(s);
  let out = u !== undefined ? u : s;
  if (u !== undefined && english(s) === undefined) return u;   // a language pack's own translation, as it always was
  if (LANG.bird !== 'Laila') out = out.replace(/Laila/g, LANG.bird);
  if (LANG.kids) out = out.replace(/\bMusa\b/g, LANG.kids.m).replace(/\bAisha\b/g, LANG.kids.f);
  return out;
}

/**
 * A line the screens build out of parts ("Dabbobi · koyo · saiti 1 / 12", "Madalla! 3 / 25"), turned at display time:
 * the whole line if the pack has it, else each " · " part, with a trailing count kept as it is. Hausa is returned untouched.
 */
export function tx(s: string): string {
  if (!s || (LANG.code === 'ha' && !EN_LABELS)) return s;
  const u = look(s); if (u !== undefined) return t(s);
  if (s.includes(' · ')) return s.split(' · ').map(tx).join(' · ');
  if (s.includes(' — ')) return s.split(' — ').map(tx).join(' — ');
  const m = /^(.*?\S)(\s+[\d][\d\s/–-]*)$/.exec(s);
  if (m && look(m[1]) !== undefined) return t(m[1]) + m[2];
  const n = /^([\d][\d\s/–-]*\s+)(.+)$/.exec(s);
  if (n && look(n[2]) !== undefined) return n[1] + t(n[2]);
  return t(s);
}

/** A label written for adults as "Hausa · English" (settings, loader): in the family app the English alone. */
export function bi(ha: string, en: string): string {
  return english(ha) !== undefined ? t(ha) : t(ha) + ' · ' + en;
}

/** The small line in the child's language under a main button, shown only when the button itself is in English (family app). */
export function sub(ha: string): string {
  if (EN_LABELS?.map[ha]?.kind !== 'button' || english(ha) === undefined) return '';
  return LANG.ui[ha] ?? ha;   // the child's own language: Hausa, or a demo build's translation
}
