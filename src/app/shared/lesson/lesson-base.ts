import { Directive, ElementRef, OnDestroy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { Word, WordsService } from '../../core/clips/words.service';
import { LessonFlow } from '../../core/state/flow.service';
import { SessionService } from '../../core/state/session.service';
import { SpeechService } from '../../core/speech/speech.service';
import { ImageWarm } from '../../core/clips/warm.service';
import { ZoomService } from '../../core/zoom/zoom.service';
import { Spotter } from './helpers';

/** A word as the lessons carry it: the key, the English (cased as the lesson wants it), the Hausa and the record itself. */
export interface Item { k: string; en: string; ha: string; w: Word; cat?: string; }
/** A clip to play: a key of the bank, or a file of its own (the words' clips). */
export type Clip = string | { src: string; ha?: string; en?: string } | null;
/** Thrown by check() once the screen is left: every running lesson unwinds quietly. */
export class Stopped extends Error {}

/**
 * What every lesson screen shares: the services, the spotter, the feedback line and playing clips that stop the moment
 * the screen is left. A screen extends this and keeps only its own rules.
 */
@Directive()
export abstract class LessonBase implements OnDestroy {
  readonly speech = inject(SpeechService);
  protected readonly bus = inject(AudioBus);
  protected readonly words = inject(WordsService);
  protected readonly warm = inject(ImageWarm);
  protected readonly session = inject(SessionService);
  protected readonly flow = inject(LessonFlow);
  protected readonly zoom = inject(ZoomService);
  protected readonly router = inject(Router);
  protected readonly hostEl = inject(ElementRef) as ElementRef<HTMLElement>;
  protected readonly spotter = new Spotter(this.hostEl.nativeElement, this.zoom);
  protected stopped = false;
  readonly eye = signal('');
  readonly fbCls = signal(''); readonly fbText = signal('');

  ngOnDestroy(): void { this.stopped = true; this.bus.stopAll(); this.spotter.unspot(); this.onLeave(); }
  /** A screen's own clean-up (close the mic, drop timers). */
  protected onLeave(): void { /* nothing by default */ }

  get s(): HTMLElement { return this.hostEl.nativeElement; }
  protected q<T extends Element = HTMLElement>(sel: string): T | null { return this.s.querySelector<T>(sel); }
  protected KA(): string { return this.session.g() === 'f' ? 'ki' : 'ka'; }
  protected fb(cls: string, t: string): void { this.fbCls.set(cls); this.fbText.set(t); }
  protected check(): void { if (this.stopped) throw new Stopped(); }
  /** Play one clip; false when it was cut short (a newer sound, a press, the screen left). */
  protected async play(k: Clip, opts: { onStart?: () => void } = {}): Promise<boolean> { this.check(); if (!k) return true; return typeof k === 'string' ? this.bus.play(k, opts) : this.bus.play('', { src: k.src, caption: k.ha || k.en ? { ha: k.ha || '', en: k.en || '' } : undefined, ...opts }); }
  /** Play clips one after another; stops at the first one cut short. */
  protected async seq(ks: Clip[]): Promise<boolean> { for (const k of ks) if (!(await this.play(k))) return false; return true; }
  /** Play a clip while a spot shows where to press; the spot goes when the clip ends. */
  protected async playSpot(k: Clip, el: Element | null, where: 'above' | 'below' | 'left' | 'right'): Promise<boolean> { const ok = await this.play(k, { onStart: () => this.spotter.spot(el, where) }); this.spotter.unspot(); return ok; }
  /** Run a lesson: a Stopped is the normal end when the screen is left, anything else is a real error. */
  protected async run(f: () => Promise<void>): Promise<void> { try { await f(); } catch (e) { if (!(e instanceof Stopped)) throw e; } }
  protected en(it: Item): Clip { return it.w.en_clip ? { src: it.w.en_clip, ha: it.ha, en: String(it.w.en) } : null; }
  protected ha(it: Item): Clip { return it.w.ha_clip ? { src: it.w.ha_clip, ha: it.ha, en: String(it.w.en) } : null; }
  protected item(w: Word, cat?: string, upper = false): Item { return { k: w.k, en: upper ? String(w.en).toUpperCase() : String(w.en), ha: w.ha, w, cat }; }
  /** Rubutu and Karatu pool every category's words by LENGTH (spelling and reading difficulty), no duplicates; or one set. */
  protected poolByLength(def: { min?: number; max?: number; set?: string }): Item[] {
    if (def.set) return this.words.list(def.set).map((w) => this.item(w, def.set, true));
    const seen = new Set<string>(), out: Item[] = [];
    for (const c of Object.keys(this.words.cats())) { if (c === 'numbers') continue; for (const w of this.words.list(c)) { const en = String(w.en); if (!/^[A-Za-z]+$/.test(en) || en.length < (def.min ?? 0) || en.length > (def.max ?? 99)) continue; const k = en.toLowerCase(); if (seen.has(k)) continue; seen.add(k); out.push(this.item(w, c, true)); } }
    return out.sort((a, b) => a.en.length - b.en.length);
  }
}
