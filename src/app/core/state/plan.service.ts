import { Injectable, inject, signal } from '@angular/core';
import { SessionService } from './session.service';
import { CourseService } from './course.service';
import { CourseStep } from './course.data';
import { ProgressService } from './progress.service';
import { ALL } from '../../shared/lesson/letters';

/** What the chooser puts on its card: one step, already chosen, with the route that opens it. */
export interface PlanCard {
  key: string; eyebrow: string; title: string; sub: string; ico: string; colour: string;
  route: string; category?: string; query?: Record<string, string>;
}
/** The placement game's verdict: what it saw, and where it decided the child begins. */
export interface Placement { hits: number; wrong: number; asked: number; start: string; at: number; startL?: string; }

const CARDS: Record<string, PlanCard> = {
  // The first step is the question, not the game: the gate asks whether they know the letters and sends
  // them to the game or to the lesson accordingly (Sani 2026-10-07).
  mugani: { key: 'mugani', eyebrow: 'NA FARKO · FIRST', title: 'Ka san haruffa?', sub: 'do you know the letters? let us see', ico: '🎈', colour: 'var(--red)', route: 'haruffa/gwada' },
  haruffa_ah: { key: 'haruffa_ah', eyebrow: 'NA GABA · NEXT', title: 'Haruffa A–H', sub: 'the first eight letters', ico: '🔤', colour: 'var(--red)', route: 'haruffa/koyo' },
  haruffa_ip: { key: 'haruffa_ip', eyebrow: 'NA GABA · NEXT', title: 'Haruffa I–P', sub: 'the next eight letters', ico: '🔤', colour: 'var(--red)', route: 'haruffa/koyo', query: { from: '2' } },
  haruffa_qz: { key: 'haruffa_qz', eyebrow: 'NA GABA · NEXT', title: 'Haruffa Q–Z', sub: 'the last ten letters', ico: '🔤', colour: 'var(--red)', route: 'haruffa/koyo', query: { from: '4' } },
  dabbobi: { key: 'dabbobi', eyebrow: 'NA GABA · NEXT', title: 'Dabbobi', sub: 'animals · their names in English', ico: '🐐', colour: 'var(--blue)', route: 'abubuwa/koyo', category: 'animals' },
};

/**
 * The learning plan, so far as it is built: the chooser no longer waits for a child to pick something. A child who has
 * never played gets the placement game; after it, the card is whatever that game decided — the alphabet from the
 * beginning, the alphabet from I, or straight to the animals (Sani 2026-09-24).
 *
 * Only the first sitting is planned here. The rest of the curriculum is designed but not built, and the card falls
 * back to the alphabet rather than inventing an order this service cannot honour.
 */
@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly session = inject(SessionService);
  private readonly course = inject(CourseService);
  private readonly progress = inject(ProgressService);
  /** Bumped whenever the stored placement changes, so the chooser's card is recomputed. */
  private readonly rev = signal(0);

  private key(): string { const id = this.session.personId(); return 'kratu_plan_' + (id || 'guest'); }
  /** A sample session from the settings must never write over a real child's placement. */
  private writable(): boolean { return !this.session.simulated() && !this.session.demo(); }

  placement(): Placement | null {
    this.rev();
    try { const raw = localStorage.getItem(this.key()); return raw ? (JSON.parse(raw) as Placement) : null; } catch { return null; }
  }
  /**
   * The game's verdict. `reached` is how far into the alphabet the child got on their own, popping B after A and so on
   * to Z — 25 letters, since Laila pops A as the example. Where they stopped is where the teaching starts, and the
   * count of wrong pops is what separates knowing from hunting: a child who reached Z by bursting half the sky did not
   * read it, so they only skip as far as their clean stretch (Sani 2026-09-25).
   */
  static decide(reached: number, wrong: number): string {
    if (reached >= 25 && wrong <= 3) return 'dabbobi';      // A–Z, cleanly: the alphabet is behind them
    if (reached >= 15) return 'haruffa_qz';                 // they knew it through P
    if (reached >= 7) return 'haruffa_ip';                  // they knew it through H
    return 'haruffa_ah';
  }
  save(p: Placement): void {
    if (!this.writable()) { this.rev.update((n) => n + 1); return; }
    try { localStorage.setItem(this.key(), JSON.stringify(p)); } catch { /* private mode: the session still carries on */ }
    this.rev.update((n) => n + 1);
  }
  clear(): void { try { localStorage.removeItem(this.key()); } catch { /* ignore */ } this.rev.update((n) => n + 1); }

  /**
   * The letters a placement showed the child knows: everything before the letter where the balloons stopped (all of
   * them after a clean A–Z), plus whatever Haruffa has already marked done.
   */
  known(p: Placement | null = this.placement()): string[] {
    const k = new Set<string>();
    if (p) {
      const upto = p.start === 'dabbobi' ? 26 : p.startL ? ALL.indexOf(p.startL) : p.start === 'haruffa_qz' ? 16 : p.start === 'haruffa_ip' ? 8 : 0;
      ALL.slice(0, Math.max(0, upto)).forEach((L) => k.add(L));
    }
    if (this.progress.has('haruffa', 'final')) ALL.forEach((L) => k.add(L));
    for (let g = 0; g < 7; g++) if (this.progress.has('haruffa', 'g' + g)) ALL.slice(g * 4, g * 4 + 4).forEach((L) => k.add(L));
    return [...k];
  }
  /** What the chooser shows, and what Laila opens when nothing else is picked. */
  next(): PlanCard {
    // the course simulator in the settings: the book opens the step picked there (Sani 2026-11-02)
    if (this.course.on()) { const st = this.course.step(this.course.at()); if (st) return { ...this.card(st), key: 'sim' + st.n, eyebrow: 'GWAJI · STEP ' + st.n, ico: '🧪', colour: 'var(--teal)' }; }
    // never placed: the opening question, the course's step 0 (Sani 2026-10-07)
    const p = this.placement(); if (!p) return CARDS['mugani'];
    // the book walks the course (Sani 2026-11-04); a child placed before the course existed starts where the placement put them
    if (!this.course.hasPlace()) this.course.placed(this.known(p));
    const st = this.course.step(); if (st) return this.card(st);
    const c = CARDS[p.start || ''] || CARDS['haruffa_ah'];
    return p.startL && c.route === 'haruffa/koyo' ? { ...c, query: { fromL: p.startL } } : c;
  }
  /** A course step on the book's card: its title, what it practises, and the screen it opens. */
  private card(st: CourseStep): PlanCard {
    const look: Record<string, [string, string]> = { letters: ['🔤', 'var(--red)'], words: ['🐐', 'var(--blue)'], read: ['📖', 'var(--purple)'], spell: ['✏️', 'var(--yellow)'], numbers: ['🔢', 'var(--green)'], find: ['🔍', 'var(--green)'] };
    const [ico, colour] = st.t === 'game' ? ['🎮', 'var(--orange)'] : look[st.kind] || ['📘', 'var(--teal)'];
    const r = this.course.route(st), [ha, en] = st.title.split(' · ');
    return { key: 'step' + st.n, eyebrow: 'NA GABA · NEXT', title: ha, sub: en || '', ico, colour, route: r.path, query: r.query };
  }
}
