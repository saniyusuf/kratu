import { Injectable, inject, signal } from '@angular/core';
import { COURSE, CourseStep } from './course.data';
import { SessionService } from './session.service';

/** Where a course step opens: a route and its query. */
export interface StepRoute { path: string; query: Record<string, string>; }
/** A child's place in the course: the step the book opens next, and the letters the balloons showed they know. */
interface Place { at: number; known: string[]; }

/**
 * The course: the 233-step ladder, walked by the book (Sani 2026-11-04: "map the book to move through the course").
 * Each child has their own place, kept per child; the balloons' placement sets it, and finishing a step (a lesson played
 * out, a game passed) moves it on. Letter steps whose letters the child already showed they know are skipped.
 * The simulator in the settings (Sani 2026-11-02) overrides the child's place while it is on: an adult picks any step,
 * the book opens it, and finishing it moves the simulator on instead. A sample session never writes a child's place.
 */
@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly session = inject(SessionService);
  readonly steps: CourseStep[] = COURSE;
  /** The simulator's step, or null when it is off. */
  readonly at = signal<number | null>(read('kratu_sim_step'));
  /** Bumped when a child's place changes, so the book's card is recomputed. */
  readonly rev = signal(0);
  /** Per game route: the words the adult marked as failed before playing (empty = play it for real). */
  private fails: Record<string, string[]> = {};
  /** A sample session's place, held in memory only. */
  private loose: Place | null = null;

  on(): boolean { return this.at() != null; }
  /** The step the book opens now: the simulator's, or the child's own (null before the placement). */
  now(): number | null { this.rev(); return this.at() ?? this.place()?.at ?? null; }
  step(n = this.now()): CourseStep | null { return n == null ? null : this.steps.find((s) => s.n === n) || null; }
  go(n: number | null): void { this.at.set(n); try { if (n == null) localStorage.removeItem('kratu_sim_step'); else localStorage.setItem('kratu_sim_step', String(n)); } catch { /* private mode */ } }
  /** The step was finished: the course moves on, and the step it moved to is returned (null when n was not the step
   *  being walked, or the course is over). */
  finish(n: number): CourseStep | null {
    if (this.on()) { if (this.at() !== n || n + 1 >= this.steps.length) return null; this.go(n + 1); return this.step(n + 1); }
    const p = this.place(); if (!p || p.at !== n) return null;
    const nx = this.skip(n + 1, p.known); this.save({ ...p, at: nx }); return this.step(nx);
  }
  /**
   * Where a child starts, after the opening question and the balloons: the first step after it, skipping the letter
   * lessons and letter games whose letters they already know. In the simulator, the simulator moves there.
   */
  placed(known: string[]): CourseStep | null {
    const k = [...new Set(known.map((L) => L.toUpperCase()))], at = this.skip(1, k);
    if (this.on()) this.go(at); else this.save({ at, known: k });
    return this.step(at);
  }
  /** Whether this child has a place yet (the placement has been done since the course was switched on). */
  hasPlace(): boolean { this.rev(); return !!this.place(); }

  private skip(i: number, known: string[]): number {
    while (i < this.steps.length) { const s = this.steps[i]; if (s.t === 'start' || s.kind !== 'letters' || !s.items.length || !s.items.every((L) => known.includes(L))) break; i++; }
    return Math.min(i, this.steps.length - 1);
  }
  private key(): string { return 'kratu_course_' + (this.session.personId() || 'guest'); }
  private writable(): boolean { return !this.session.simulated() && !this.session.demo(); }
  private place(): Place | null {
    if (!this.writable()) return this.loose;
    try { const raw = localStorage.getItem(this.key()); return raw ? (JSON.parse(raw) as Place) : null; } catch { return null; }
  }
  private save(p: Place): void {
    if (!this.writable()) this.loose = p; else try { localStorage.setItem(this.key(), JSON.stringify(p)); } catch { this.loose = p; }
    this.rev.update((n) => n + 1);
  }

  setFails(gameKey: string, words: string[]): void { this.fails[gameKey] = words.slice(); }
  getFails(gameKey: string): string[] | null { const f = this.fails[gameKey]; return f && f.length ? f : null; }

  /** The screen a step opens. Lessons that do not take a word list yet open their own menu. */
  route(s: CourseStep): StepRoute {
    const n = String(s.n), ws = s.items.join(',');
    if (s.t === 'start') return { path: 'haruffa/gwada', query: {} };
    if (s.t === 'game') {
      if (s.game === 'fashe') return { path: 'fashe', query: { step: n } };
      if (s.game === 'nemo') return { path: 'nemo', query: { pick: 'q4', words: ws, step: n } };
      const q: Record<string, string> = { next: '/home', step: n };
      if (s.kind === 'letters') q['letters'] = s.items.join(''); else if (ws) q['words'] = ws;
      return { path: 'wasanni/' + s.game, query: q };
    }
    if (s.kind === 'letters') return { path: 'haruffa/koyo', query: { letters: s.items.join(''), done: n } };
    if (s.kind === 'words') return { path: 'abubuwa/koyo', query: { words: ws, done: n } };
    if (s.kind === 'read') return { path: 'karatu', query: { words: ws, done: n } };
    if (s.kind === 'spell') return { path: 'rubutu', query: { words: ws, done: n } };
    // Lambobi 1–5 are its five stages: fingers, writing 1–10, 11–20, tens, hundreds (the last one ends with the big test)
    if (s.kind === 'numbers') return { path: 'lambobi', query: { stage: String(Math.max(0, +(s.title.match(/Lambobi (\d)/)?.[1] || 1) - 1)), done: n } };
    return { path: 'nemo', query: { pick: 'qnum', done: n } };   // Nemo lamba: Nemo hoto's number signs
  }
}

function read(k: string): number | null { try { const v = localStorage.getItem(k); return v == null || v === '' ? null : +v; } catch { return null; } }
