import { Injectable, signal } from '@angular/core';

export type SoundEnd = 'ended' | 'cut' | 'blocked';
export interface SoundHooks { onStart?: () => void; onProgress?: (p: number) => void; }

/**
 * The one place sound comes out of. Two sounds can never play at the same time:
 *  - the engine owns a single <audio> element; every clip is played through it, so a new clip physically replaces the old;
 *  - a screen that must play a film with sound claims it here (claim()), which stops the clip and any other film first;
 *  - a guard on the document watches every media element that starts (even one the engine never saw) and pauses
 *    everything else that is playing. The latest sound always wins; nothing waits in a queue.
 */
@Injectable({ providedIn: 'root' })
export class SoundEngine {
  private readonly el: HTMLAudioElement = new Audio();
  private token = 0;
  private settle: ((how: SoundEnd) => void) | null = null;
  private claimed: HTMLMediaElement | null = null;
  private settleClaim: ((how: SoundEnd) => void) | null = null;
  private guarding = false;
  /** Something is audible right now (a clip or a claimed film). */
  readonly playing = signal(false);
  /** Progress of the clip playing now, 0..1. */
  readonly progress = signal(0);
  /** The moment the last sound stopped, for the microphone guard. */
  lastSound = 0;

  constructor() {
    this.el.preload = 'auto'; this.el.setAttribute('aria-hidden', 'true'); this.el.style.display = 'none';
    if (typeof document !== 'undefined') document.body.appendChild(this.el);   // in the document, so its play events reach the guard like everyone else's
    this.el.addEventListener('ended', () => this.finish('ended'));
    this.el.addEventListener('error', () => this.finish('blocked'));
    this.el.addEventListener('timeupdate', () => { this.lastSound = Date.now(); this.progress.set(this.el.duration ? Math.min(1, this.el.currentTime / this.el.duration) : 0); });
    this.guard();
  }

  /** Play one file. Resolves 'ended' when it reached its end, 'cut' when something newer took over, 'blocked' when the browser refused. */
  play(src: string, hooks: SoundHooks = {}): Promise<SoundEnd> {
    this.stop();
    const my = ++this.token;
    return new Promise<SoundEnd>((res) => {
      const onPlay = () => { if (my === this.token) { this.playing.set(true); this.hushOthers(this.el); hooks.onStart?.(); } };
      const onTime = () => { if (my === this.token) hooks.onProgress?.(this.progress()); };
      this.el.addEventListener('play', onPlay); this.el.addEventListener('timeupdate', onTime);
      this.settle = (how) => { this.settle = null; this.el.removeEventListener('timeupdate', onTime); this.el.removeEventListener('play', onPlay); this.playing.set(false); this.lastSound = Date.now(); res(how); };
      this.progress.set(0); this.el.src = src;
      this.el.play().catch(() => this.finish('blocked'));
    });
  }
  private finish(how: SoundEnd): void { const s = this.settle; if (s) s(how); }

  /** Silence now: the clip and any claimed film. */
  stop(): void {
    const s = this.settle; this.settle = null; this.token++;
    if (!this.el.paused) { try { this.el.pause(); } catch { /* ignore */ } }
    try { this.el.currentTime = 0; } catch { /* not loaded yet */ }
    this.playing.set(false); this.lastSound = Date.now();
    s?.('cut');
    this.release();
  }

  /** A film with sound (the example child) is played through the engine: everything else stops first, and any later clip stops it. */
  claim(media: HTMLMediaElement): Promise<SoundEnd> {
    this.stop();
    this.claimed = media; this.playing.set(true);
    return new Promise<SoundEnd>((res) => {
      const fin = (how: SoundEnd) => { if (this.claimed !== media) return; this.claimed = null; this.settleClaim = null; media.removeEventListener('ended', onEnd); media.removeEventListener('error', onErr); this.playing.set(false); this.lastSound = Date.now(); res(how); };
      const onEnd = () => fin('ended'), onErr = () => fin('blocked');
      media.addEventListener('ended', onEnd); media.addEventListener('error', onErr);
      this.settleClaim = fin;
      try { media.currentTime = 0; } catch { /* ignore */ }
      media.play().catch(() => fin('blocked'));
    });
  }
  private release(): void { const m = this.claimed, fin = this.settleClaim; if (!m) return; try { m.pause(); } catch { /* ignore */ } fin?.('cut'); }

  /** The hard rule: whenever any media element with sound starts, every other one is paused. */
  private guard(): void {
    if (this.guarding || typeof document === 'undefined') return; this.guarding = true;
    document.addEventListener('play', (ev) => {
      const t = ev.target as HTMLMediaElement | null; if (!t || !(t instanceof HTMLMediaElement) || t.muted || t.volume === 0) return;
      if (t !== this.el && !this.el.paused) { const s = this.settle; this.settle = null; this.token++; try { this.el.pause(); } catch { /* ignore */ } this.playing.set(false); s?.('cut'); }
      if (this.claimed && t !== this.claimed) this.release();
      this.hushOthers(t);
    }, true);
  }
  /** Pause every media element in the document except this one. */
  private hushOthers(keep: HTMLMediaElement): void { document.querySelectorAll<HTMLMediaElement>('audio, video').forEach((m) => { if (m !== keep && !m.paused && !m.muted) { try { m.pause(); } catch { /* ignore */ } } }); }
}
