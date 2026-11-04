import { Injectable, inject } from '@angular/core';
import { SessionService } from './session.service';

/** The six lessons, in the order the curriculum opens them (Sani 2026-10-11): the chooser lays its tiles out this way. */
export type LessonId = 'haruffa' | 'abubuwa' | 'nemo' | 'lambobi' | 'karatu' | 'rubutu';
export const ORDER: LessonId[] = ['haruffa', 'abubuwa', 'nemo', 'lambobi', 'karatu', 'rubutu'];

/** What finishes a lesson: every unit in its list. A unit is written when its own "app_stage_done" has played. */
const UNITS: Record<LessonId, string[]> = {
  haruffa: ['g0', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'final'],
  abubuwa: ['animals', 'food', 'home', 'body', 'nature', 'vehicles', 'people', 'actions', 'clothing', 'school'],
  nemo: ['q4', 'qnum'],
  lambobi: ['s0', 's1', 's2', 's3', 's4', 'test'],
  karatu: ['k3', 'k45', 'klong', 'knum'],
  rubutu: ['r3', 'r4', 'r5', 'rlong', 'rnum'],
};
/**
 * When a lesson opens, read from the curriculum's step table: words after the first letters (step 2), Nemo hoto once
 * there are animals to find (3), numbers after the foods (7), reading only once the alphabet is proved (11), spelling
 * after the first reading (12). Until the plan itself is built these stand in for it.
 */
const OPENS: Record<LessonId, (p: (l: LessonId) => number) => boolean> = {
  haruffa: () => true,
  abubuwa: (p) => p('haruffa') > 0,
  nemo: (p) => p('abubuwa') > 0,
  lambobi: (p) => p('abubuwa') >= 2 / UNITS.abubuwa.length,
  karatu: (p) => p('haruffa') >= 1,
  rubutu: (p) => p('karatu') > 0,
};

/** Read once at start: the router drops the address's query when it moves to the first screen. */
const QUERY = typeof location === 'undefined' ? '' : location.search;

/**
 * How far each child has come, kept on the tablet against their own record. A session with nobody signed in (a settings
 * sample, or a device with no identity engine) keeps it for that session only, so a demo never marks a real child.
 * `?debug&progress=45,20,5,0,-,-` shows the chooser at given shares (percent, "-" = locked) for checking the screen.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly session = inject(SessionService);
  private key(): string { const id = this.personId(); return id ? 'kratu_prog_' + id : 'kratu_prog'; }
  private personId(): string | null { return this.session.simulated() ? null : this.session.personId(); }
  private store(): Storage { return this.personId() ? localStorage : sessionStorage; }
  private read(): Partial<Record<LessonId, string[]>> { try { return JSON.parse(this.store().getItem(this.key()) || '{}'); } catch { return {}; } }

  /** A unit of a lesson is finished. */
  mark(lesson: LessonId, unit: string): void {
    if (!UNITS[lesson].includes(unit)) return;
    const d = this.read(), list = d[lesson] || []; if (list.includes(unit)) return;
    d[lesson] = [...list, unit]; try { this.store().setItem(this.key(), JSON.stringify(d)); } catch { /* private mode */ }
  }
  /** Has this unit been finished? */
  has(lesson: LessonId, unit: string): boolean { return (this.read()[lesson] || []).includes(unit); }
  /** The balloons (Sani 2026-10-22): every letter group wholly before `n` letters is known; all 26 finishes Haruffa. */
  passLetters(n: number): void {
    for (let g = 0; g < 7; g++) if ((g + 1) * 4 <= n || (g === 6 && n >= 26)) this.mark('haruffa', 'g' + g);
    if (n >= 26) this.mark('haruffa', 'final');
  }
  /**
   * The games a child has met (Sani 2026-10-22): once introduced in the lessons, a game stays on the home page to play
   * any time. unlockGame() says whether this was the first meeting, so Laila tells them only once.
   */
  games(): string[] { try { return JSON.parse(this.store().getItem(this.key() + '_games') || '[]'); } catch { return []; } }
  unlockGame(id: string): boolean {
    const g = this.games(); if (g.includes(id)) return false;
    try { this.store().setItem(this.key() + '_games', JSON.stringify([...g, id])); this.store().setItem(this.key() + '_gamesnew', '1'); } catch { /* private mode */ }
    return true;
  }
  /** Zinari, the child's gold (Sani 2026-11-03): only ever added to. */
  zinari(): number { try { return +(this.store().getItem(this.key() + '_zin') || 0) || 0; } catch { return 0; } }
  addZinari(n: number): { before: number; after: number } {
    const before = this.zinari(), after = before + Math.max(0, Math.round(n));
    try { this.store().setItem(this.key() + '_zin', String(after)); } catch { /* private mode */ }
    return { before, after };
  }
  /** The course simulator only: put the total where an adult wants it (just under a bag, to see its title unlock). */
  setZinari(n: number): void { try { this.store().setItem(this.key() + '_zin', String(Math.max(0, Math.round(n)))); } catch { /* private mode */ } }
  /** Course steps passed before: passing one again pays less. */
  passed(tag: string): boolean { try { return (JSON.parse(this.store().getItem(this.key() + '_passed') || '[]') as string[]).includes(tag); } catch { return false; } }
  markPassed(tag: string): void { if (this.passed(tag)) return; try { const l = JSON.parse(this.store().getItem(this.key() + '_passed') || '[]'); l.push(tag); this.store().setItem(this.key() + '_passed', JSON.stringify(l)); } catch { /* private mode */ } }
  /** A game was added since the home page last showed the shelf. */
  gamesNew(): boolean { try { return this.store().getItem(this.key() + '_gamesnew') === '1'; } catch { return false; } }
  gamesSeen(): void { try { this.store().removeItem(this.key() + '_gamesnew'); } catch { /* ignore */ } }
  /** Share done, 0 to 1. */
  share(lesson: LessonId): number {
    const o = this.override(); if (o) return o[ORDER.indexOf(lesson)] ?? 0;
    const done = this.read()[lesson] || []; return done.filter((u) => UNITS[lesson].includes(u)).length / UNITS[lesson].length;
  }
  open(lesson: LessonId): boolean {
    const o = this.override(); if (o) return o[ORDER.indexOf(lesson)] !== null;
    return this.share(lesson) > 0 || OPENS[lesson]((l) => this.share(l));
  }
  /** Anything done at all: a returning learner is told to continue, a new one to start. */
  started(): boolean { return ORDER.some((l) => this.share(l) > 0); }
  /** Where the book leads: the first open lesson in the curriculum's order that is not finished yet. */
  next(): LessonId { return ORDER.find((l) => this.open(l) && this.share(l) < 1) || 'haruffa'; }

  private override(): (number | null)[] | null {
    if (!this.session.debug) return null;
    const v = new URLSearchParams(QUERY).get('progress'); if (!v) return null;
    return v.split(',').map((x) => (x.trim() === '-' ? null : Math.max(0, Math.min(100, +x || 0)) / 100));
  }
}
