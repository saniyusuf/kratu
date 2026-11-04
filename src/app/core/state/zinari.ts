/**
 * Zinari, the gold, and the palace titles it adds up to (Sani 2026-10-12, page XbWgPeDrC3QCNi7NByZrLo; built 2026-11-03).
 * Five titles since the unlock page (Sani approved 2026-11-04; Ɗan Fada / 'Yar Fada removed): one bag of gold per title,
 * and the bag is full when the title is reached. No title at the start. Gold is only ever added: no deductions, no
 * streaks. Boys' and girls' titles mirror each other.
 */
/** Where each bag is full and its title reached. One place to change them (Sani is choosing between these and 1000/2000/4000/6000/10000). */
export const LEVEL_AT = [2000, 4000, 8000, 12000, 16000];
export interface Title { key: string; at: number; m: string; f: string; colour: string; now: string; }
export const TITLES: Title[] = [
  { key: 'jarumi', m: 'Jarumi', f: 'Jaruma', colour: '#E63946', now: 's_z_now_jarumi' },
  { key: 'malami', m: 'Malami', f: 'Malama', colour: '#1FA1D8', now: 's_z_now_malami' },
  { key: 'dansarki', m: 'Ɗan Sarki', f: "'Yar Sarki", colour: '#8A5FBF', now: 's_z_now_dansarki' },
  { key: 'magaji', m: 'Magaji', f: 'Magajiya', colour: '#EE7043', now: 's_z_now_magaji' },
  { key: 'sarki', m: 'Sarki', f: 'Sarauniya', colour: '#E8A317', now: 's_z_now_sarki' },
].map((t, i) => ({ ...t, at: LEVEL_AT[i] }));
/** How many titles a total has reached (0 to 5). */
export function levelOf(total: number): number { return LEVEL_AT.filter((a) => total >= a).length; }
/** The title a total has reached, or null before the first. */
export function titleAt(total: number): Title | null { return TITLES[levelOf(total) - 1] || null; }
/** The next title to reach, or null at the top. */
export function nextTitle(total: number): Title | null { return TITLES[levelOf(total)] || null; }
/** The five bags for a total: 1 for a full bag, the share of the one filling, 0 for the rest. */
export function bags(total: number): number[] {
  return LEVEL_AT.map((hi, i) => { const lo = i ? LEVEL_AT[i - 1] : 0; return Math.max(0, Math.min(1, (total - lo) / (hi - lo))); });
}
/** The amount line for each bag's total; every amount Sani may choose is recorded, so changing LEVEL_AT needs no new clip. */
const GOLD_LINE: Record<number, string> = { 1000: 's_z_gold_1000', 2000: 's_z_gold_2000', 4000: 's_z_gold_4000', 6000: 's_z_gold_6000',
  8000: 's_z_gold_8000', 10000: 's_z_gold_10000', 12000: 's_z_gold_12000', 16000: 's_z_gold_16000' };
const BAG_LINE = ['s_z_bag1', 's_z_bag2', 's_z_bag3', 's_z_bag4', 's_z_bag5'];
/**
 * Laila's lines when title i (0 to 4) is unlocked, in the page's order: the effort, the title, the bag full, the amount,
 * then the first title's, a middle one's or the top one's ending, and "press Laila to continue".
 */
export function unlockLines(i: number): string[] {
  const end = i === 0 ? ['s_z_first', 's_z_keep_first'] : i === TITLES.length - 1 ? ['s_z_top', 's_z_top_keep'] : ['s_z_keep'];
  return ['s_z_effort', TITLES[i].now, BAG_LINE[i], GOLD_LINE[LEVEL_AT[i]], ...end, 's_g_go'].filter(Boolean);
}
/**
 * A passed game (Sani's test rule, applied to games): 100 for passing, +50 on the first try, +50 for every answer right.
 * Passing the same step again pays 50. Every amount is a round number with its own recorded line.
 */
export function gameGold(firstPass: boolean, firstTry: boolean, allRight: boolean): number {
  return firstPass ? 100 + (firstTry ? 50 : 0) + (allRight ? 50 : 0) : 50;
}
