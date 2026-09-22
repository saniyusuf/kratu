import { Injectable, signal } from '@angular/core';

export type Gender = 'm' | 'f';
export interface DemoLink { g: Gender; name: string; captions: boolean; }

/** Who is using the tablet right now, and the small per-session facts every screen reads. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly gender = signal<Gender | null>(null);
  readonly name = signal<string | null>(null);
  readonly personId = signal<string | null>(null);
  readonly perms = signal<{ camera: boolean; mic: boolean; at: number } | null>(null);
  readonly captions = signal(false);
  readonly category = signal<string | null>(null);
  readonly demo = signal<DemoLink | null>(null);
  /** An adult's sample session from the settings: runs as this child, records nothing. */
  readonly simulated = signal<{ name: string; g: Gender; personId?: string | null } | null>(null);
  /** After a real login: true = a child already enrolled, false = enrolled today. */
  readonly known = signal<boolean | null>(null);
  /** A greeting the chooser owes on arrival ("Sannu, Musa! Barka da zuwa!"), set by the settings' sample sessions. */
  readonly greet = signal<{ name: string; src: string | null } | null>(null);
  readonly debug = /[?&]debug/.test(location.search);
  private readonly samplesSeen = new Set<string>();

  constructor() {
    const d = this.parseDemo();
    let subs = false; try { subs = localStorage.getItem('kratu_subs') === '1'; } catch { /* ignore */ }
    this.captions.set(subs);
    if (d) { this.demo.set(d); this.captions.set(d.captions); }
  }
  /** The English subtitles switch, remembered on this device. */
  setCaptions(v: boolean): void { this.captions.set(v); try { localStorage.setItem('kratu_subs', v ? '1' : '0'); } catch { /* ignore */ } }

  /** Gender first, always: every Hausa line after this point is picked by it. */
  setGender(g: Gender): void { this.gender.set(g); document.documentElement.dataset['g'] = g; }
  g(): Gender { return this.gender() ?? 'm'; }

  /**
   * The ear and the door are explained once in a child's life, on the chooser, not once a session: the flag is kept
   * against their own record so a second child on the same tablet still hears it, and they never hear it twice
   * (Sani 2026-09-20). A session with nobody signed in (a settings sample, or a device with no identity engine)
   * falls back to once for that session, so a demo cannot mark a real child as told.
   */
  private hintsKey(): string { const id = this.personId(); return id ? 'kratu_hints_' + id : ''; }
  hintsSaid(): boolean {
    const k = this.hintsKey();
    try { if (k) return localStorage.getItem(k) === '1'; return sessionStorage.getItem('kratu_hints') === '1'; } catch { return false; }
  }
  hintsMark(): void {
    const k = this.hintsKey();
    try { if (k) localStorage.setItem(k, '1'); else sessionStorage.setItem('kratu_hints', '1'); } catch { /* private mode */ }
  }
  /** A thing shown once per session (the three ways to spell, the first "press Laila"): true the first time only. */
  once(name: string): boolean { try { if (sessionStorage.getItem('kratu_once_' + name) === '1') return false; sessionStorage.setItem('kratu_once_' + name, '1'); return true; } catch { return true; } }
  /** Only the sample-session flag: a demo, or a child leaving, must never un-tell a real child (Sani 2026-09-20). */
  hintsReset(): void { try { sessionStorage.removeItem('kratu_hints'); } catch { /* ignore */ } }

  /**
   * What each example already got right, by lesson: the lesson that follows counts it as done instead of asking it
   * again, so a ten-question round has nine left (Sani 2026-09-20). Read once, then forgotten.
   */
  private readonly examples = new Map<string, string>();
  markExample(kind: string, key: string): void { this.examples.set(kind, key); if (kind === 'rubutu') this.spellWays = true; }
  /** The spelling example showed both ways of writing a letter, so the lesson never demonstrates them again. */
  private spellWays = false;
  spellWaysShown(): boolean { return this.spellWays; }
  takeExample(kind: string): string | null { const v = this.examples.get(kind) ?? null; this.examples.delete(kind); return v; }

  sampleSeen(kind: string): boolean { return this.samplesSeen.has(kind); }
  markSample(kind: string): void { this.samplesSeen.add(kind); }
  resetSamples(): void { this.samplesSeen.clear(); }

  /** Already granted on this device → no permission screen, straight on. */
  async permsGranted(): Promise<boolean> {
    let stored = false;
    try { stored = localStorage.getItem('kratu_perms') === '1'; } catch { /* ignore */ }
    if (this.debug && stored) return true;   // ?debug: the stored flag alone is enough (headless checks, screenshots)
    try {
      if (navigator.permissions?.query) {
        const [c, m] = await Promise.all([
          navigator.permissions.query({ name: 'camera' as PermissionName }),
          navigator.permissions.query({ name: 'microphone' as PermissionName }),
        ]);
        return c.state === 'granted' && m.state === 'granted';
      }
    } catch { /* browsers without the query fall back to what the permission screen stored */ }
    return stored;
  }
  savePerms(camera: boolean): void {
    this.perms.set({ camera, mic: true, at: Date.now() });
    try { localStorage.setItem('kratu_perms', '1'); } catch { /* ignore */ }
  }

  /** #aisha / #musa (captions on) and #aisha-nocc / #musa-nocc; ?demo=musa also works. */
  private parseDemo(): DemoLink | null {
    const h = (location.hash || '').slice(1).toLowerCase();
    const q = new URLSearchParams(location.search).get('demo')?.toLowerCase();
    const m = (h || q || '').match(/^(aisha|musa)(-nocc)?$/);
    if (!m) return null;
    return { g: m[1] === 'aisha' ? 'f' : 'm', name: m[1] === 'aisha' ? 'Aisha' : 'Musa', captions: !m[2] };
  }

  /** Home door: the session ends. */
  end(): void { this.name.set(null); this.personId.set(null); this.category.set(null); this.simulated.set(null); this.demo.set(null); this.known.set(null); this.greet.set(null); this.resetSamples(); this.hintsReset(); }
}
