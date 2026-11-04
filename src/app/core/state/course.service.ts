import { Injectable, signal } from '@angular/core';
import { COURSE, CourseStep } from './course.data';

/** Where a course step opens: a route and its query. */
export interface StepRoute { path: string; query: Record<string, string>; }

/**
 * The course simulator (Sani 2026-11-02: "use the settings to go forwards and simulate"). From the settings an adult picks
 * any step of the 233-step ladder; the course book then opens that step, and finishing it moves the book on to the next.
 * Before a game the adult can mark which of its words count as failed, to walk the pass / try again / review loop
 * without playing. Real children are not affected: with no step picked, the plan service walks the first sitting as before.
 */
@Injectable({ providedIn: 'root' })
export class CourseService {
  readonly steps: CourseStep[] = COURSE;
  /** The step the book opens, or null when the simulator is off. */
  readonly at = signal<number | null>(read('kratu_sim_step'));
  /** Per game route: the words the adult marked as failed before playing (empty = play it for real). */
  private fails: Record<string, string[]> = {};

  on(): boolean { return this.at() != null; }
  step(n = this.at()): CourseStep | null { return n == null ? null : this.steps.find((s) => s.n === n) || null; }
  go(n: number | null): void { this.at.set(n); try { if (n == null) localStorage.removeItem('kratu_sim_step'); else localStorage.setItem('kratu_sim_step', String(n)); } catch { /* private mode */ } }
  /** The step was finished (a lesson played out, a game passed): the book moves on to the next one. */
  done(n: number): void { if (this.at() === n && n + 1 < this.steps.length) this.go(n + 1); }

  setFails(gameKey: string, words: string[]): void { this.fails[gameKey] = words.slice(); }
  getFails(gameKey: string): string[] | null { const f = this.fails[gameKey]; return f && f.length ? f : null; }

  /** The screen a step opens. Lessons that do not take a word list yet open their own menu. */
  route(s: CourseStep): StepRoute {
    const n = String(s.n), ws = s.items.join(',');
    if (s.t === 'start') return { path: 'haruffa/gwada', query: {} };
    if (s.t === 'game') {
      if (s.game === 'fashe') return { path: 'fashe', query: {} };
      if (s.game === 'nemo') return { path: 'nemo', query: ws ? { words: ws, step: n } : { step: n } };
      const q: Record<string, string> = { next: '/home', step: n };
      if (s.kind === 'letters') q['letters'] = s.items.join(''); else if (ws) q['words'] = ws;
      return { path: 'wasanni/' + s.game, query: q };
    }
    if (s.kind === 'letters') return { path: 'haruffa/koyo', query: s.items[0] ? { fromL: s.items[0] } : {} };
    if (s.kind === 'words') return { path: 'abubuwa/koyo', query: { words: ws, done: n } };
    if (s.kind === 'read') return { path: 'karatu', query: {} };
    if (s.kind === 'spell') return { path: 'rubutu', query: {} };
    if (s.kind === 'numbers') return { path: 'lambobi', query: {} };
    return { path: 'nemo', query: ws ? { words: ws } : {} };
  }
}

function read(k: string): number | null { try { const v = localStorage.getItem(k); return v == null || v === '' ? null : +v; } catch { return null; } }
