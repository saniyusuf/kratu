import { Injectable, inject, signal } from '@angular/core';
import { SessionService } from './session.service';

/** What the chooser puts on its card: one step, already chosen, with the route that opens it. */
export interface PlanCard {
  key: string; eyebrow: string; title: string; sub: string; ico: string; colour: string;
  route: string; category?: string; query?: Record<string, string>;
}
/** The placement game's verdict: what it saw, and where it decided the child begins. */
export interface Placement { hits: number; wrong: number; asked: number; start: string; at: number; }

const CARDS: Record<string, PlanCard> = {
  mugani: { key: 'mugani', eyebrow: 'NA FARKO · FIRST', title: 'Fashe haruffa', sub: 'pop the letter Laila says', ico: '🎈', colour: 'var(--red)', route: 'fashe' },
  haruffa_ah: { key: 'haruffa_ah', eyebrow: 'NA GABA · NEXT', title: 'Haruffa A–H', sub: 'the first eight letters', ico: '🔤', colour: 'var(--red)', route: 'haruffa/koyo' },
  haruffa_ip: { key: 'haruffa_ip', eyebrow: 'NA GABA · NEXT', title: 'Haruffa I–P', sub: 'the next eight letters', ico: '🔤', colour: 'var(--red)', route: 'haruffa/koyo', query: { from: '2' } },
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
  /** Bumped whenever the stored placement changes, so the chooser's card is recomputed. */
  private readonly rev = signal(0);

  private key(): string { const id = this.session.personId(); return 'kratu_plan_' + (id || 'guest'); }
  /** A sample session from the settings must never write over a real child's placement. */
  private writable(): boolean { return !this.session.simulated() && !this.session.demo(); }

  placement(): Placement | null {
    this.rev();
    try { const raw = localStorage.getItem(this.key()); return raw ? (JSON.parse(raw) as Placement) : null; } catch { return null; }
  }
  /** The game's verdict. Two numbers decide it, not one: hits alone can be guessed, hits with few wrong taps cannot. */
  static decide(hits: number, wrong: number): string {
    if (hits >= 10 && wrong <= 3) return 'dabbobi';
    if (hits >= 6 && hits <= 9 && wrong <= 10) return 'haruffa_ip';
    return 'haruffa_ah';
  }
  save(p: Placement): void {
    if (!this.writable()) { this.rev.update((n) => n + 1); return; }
    try { localStorage.setItem(this.key(), JSON.stringify(p)); } catch { /* private mode: the session still carries on */ }
    this.rev.update((n) => n + 1);
  }
  clear(): void { try { localStorage.removeItem(this.key()); } catch { /* ignore */ } this.rev.update((n) => n + 1); }

  /** What the chooser shows, and what Laila opens when nothing else is picked. */
  next(): PlanCard { const p = this.placement(); return CARDS[p?.start || ''] || CARDS[p ? 'haruffa_ah' : 'mugani']; }
}
