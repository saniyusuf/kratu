import { Injectable, inject, signal } from '@angular/core';
import { ClipsService } from '../clips/clips.service';
import { SessionService } from '../state/session.service';
import { SoundEngine } from './sound-engine.service';

/**
 * What Laila says, on top of the sound engine. The engine guarantees one sound at a time; the bus adds the clip keys,
 * the gendered keys, captions and the microphone rule.
 *
 *  - play(key)      stops whatever plays, plays this clip, resolves true only if it reached its end
 *  - say([k1, k2])  a sequence: each clip waits for the previous one; any newer play() anywhere aborts the rest
 *  - stopAll()      silence now
 *  - micReady()     resolves when it is safe to open the microphone (a short guard after the last sound)
 *  - setMic(open)   a recogniser or recorder holds the mic: Laila is never audible while it is open
 *
 * Gendered keys: gk('s_back') → 's_back_f' for a girl, 's_back_m' for a boy, or the unisex key when only that exists.
 */
@Injectable({ providedIn: 'root' })
export class AudioBus {
  private readonly clips = inject(ClipsService);
  private readonly session = inject(SessionService);
  readonly engine = inject(SoundEngine);
  private readonly GUARD = 450;
  private seq = 0;

  /** Laila is audible right now. */
  readonly speaking = this.engine.playing;
  /** A recogniser or recorder holds the microphone. */
  readonly micOpen = signal(false);
  /** The key playing now, for captions and for screens that highlight while she talks. */
  readonly nowKey = signal<string | null>(null);
  readonly caption = signal<{ ha: string; en: string } | null>(null);
  /** How far the clip playing now has got, 0..1, for the subtitles' word-by-word lighting. */
  readonly progress = this.engine.progress;
  /** How the last clip stopped: reached its end, or cut short by a newer sound, a press or a screen change. */
  readonly captionEnd = signal<'ended' | 'cut'>('cut');
  /** The browser refused sound before the first tap; the first tap replays the screen's line. */
  readonly blocked = signal(false);
  /** What the browser refused, so the first touch can say it (autoplay is off before any user gesture on a fresh load). */
  private lastBlocked: { key: string; opts: { src?: string; caption?: { ha: string; en: string } } } | null = null;
  /** Every clip played, newest last, for the debug view. */
  readonly log: string[] = [];

  gk(base: string): string {
    const g = this.session.g();
    if (this.clips.has(base + '_' + g)) return base + '_' + g;
    if (this.clips.has(base)) return base;
    if (this.clips.has(base + '_m')) return base + '_m';
    return base;
  }
  has(key: string): boolean { return this.clips.has(key); }

  /** onProgress carries the line's own 0..1 position, so a screen can act on a word rather than on a stopwatch. */
  async play(key: string, opts: { src?: string; onStart?: () => void; onProgress?: (p: number) => void; caption?: { ha: string; en: string } } = {}): Promise<boolean> {
    this.stopAll();
    if (this.micOpen()) return false;
    const src = opts.src ?? this.clips.url(key);
    if (!src) return false;
    this.nowKey.set(key || null);
    const t = opts.caption ?? (key ? this.clips.text(key) : { ha: '', en: '' });
    const letter = key.match(/^app_en_([A-Z])$/); if (letter && !t.en) t.en = 'the letter ' + letter[1];
    this.caption.set(t.ha || t.en ? { ...t } : null);
    this.log.push(key || '(raw)'); if (this.log.length > 60) this.log.shift();
    const my = ++this.seq;
    const how = await this.engine.play(src, {
      onStart: () => { if (my === this.seq) { this.blocked.set(false); opts.onStart?.(); } },
      onProgress: (p) => { if (my === this.seq) opts.onProgress?.(p); },
    });
    if (how === 'blocked') { this.blocked.set(true); this.lastBlocked = { key, opts: { src: opts.src, caption: opts.caption } }; }
    if (my === this.seq) { this.captionEnd.set(how === 'ended' ? 'ended' : 'cut'); this.nowKey.set(null); this.caption.set(null); }   // only the newest play owns the caption
    return how === 'ended';
  }

  /** A data: or blob: URL, such as the child's own "sunana" clip. */
  playRaw(src: string, caption?: { ha: string; en: string }): Promise<boolean> { return this.play('', { src, caption }); }

  async say(keys: string[]): Promise<boolean> {
    for (const k of keys) {
      const ok = await this.play(k);
      if (!ok) return false;
    }
    return true;
  }

  /** The first touch on the page: say the line the browser refused a moment ago (the screen's opening line), once. */
  replayBlocked(): void { const b = this.lastBlocked; if (!b || !this.blocked()) return; this.lastBlocked = null; this.blocked.set(false); this.play(b.key, b.opts).catch(() => undefined); }
  stopAll(): void {
    this.engine.stop();
    this.captionEnd.set('cut'); this.nowKey.set(null); this.caption.set(null);
  }

  micReady(): Promise<void> {
    let wait = Math.max(0, this.GUARD - (Date.now() - this.engine.lastSound));
    if (this.speaking()) wait = Math.max(wait, this.GUARD);
    return new Promise((r) => setTimeout(r, wait));
  }
  setMic(open: boolean): void {
    if (open) this.stopAll();
    this.micOpen.set(open);
  }
}
