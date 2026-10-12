import { LANG } from './lang';

/**
 * Text on screen in this build's language. The key IS today's Hausa text, so the Hausa build shows exactly what it always
 * did; another language looks it up in its pack, and anything it lacks keeps the text with "Laila" turned into its bird.
 */
export function t(s: string): string {
  const u = LANG.ui[s];
  if (u !== undefined) return u;
  let out = LANG.bird === 'Laila' ? s : s.replace(/Laila/g, LANG.bird);
  if (LANG.kids) out = out.replace(/\bMusa\b/g, LANG.kids.m).replace(/\bAisha\b/g, LANG.kids.f);
  return out;
}

/**
 * A line the screens build out of parts ("Dabbobi · koyo · saiti 1 / 12", "Madalla! 3 / 25"), turned at display time:
 * the whole line if the pack has it, else each " · " part, with a trailing count kept as it is. Hausa is returned untouched.
 */
export function tx(s: string): string {
  if (!s || LANG.code === 'ha') return s;
  const u = LANG.ui[s]; if (u !== undefined) return u;
  if (s.includes(' · ')) return s.split(' · ').map(tx).join(' · ');
  if (s.includes(' — ')) return s.split(' — ').map(tx).join(' — ');
  const m = /^(.*?\S)(\s+[\d][\d\s/–-]*)$/.exec(s);
  if (m && LANG.ui[m[1]] !== undefined) return LANG.ui[m[1]] + m[2];
  const n = /^([\d][\d\s/–-]*\s+)(.+)$/.exec(s);
  if (n && LANG.ui[n[2]] !== undefined) return n[1] + LANG.ui[n[2]];
  return t(s);
}
