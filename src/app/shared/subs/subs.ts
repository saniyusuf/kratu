import { Component, computed, effect, inject, signal } from '@angular/core';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService } from '../../core/state/session.service';

/**
 * English subtitles: a teleprompter strip, bottom right, that lights up word by word as Laila speaks. It only ever
 * shows what is being said right now: a clip cut short takes the strip with it; a clip that ends lingers 1.2 s.
 */
@Component({
  selector: 'app-subs',
  host: { id: 'subs', '[class.show]': 'show()' },
  template: `<div class="ha">{{ ha() }}</div><div class="en">@for (w of words(); track $index) {<span [class.lit]="$index < lit()">{{ $index ? ' ' + w : w }}</span>}</div>`,
})
export class Subs {
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  readonly ha = signal(''); readonly words = signal<string[]>([]); readonly show = signal(false);
  private full = signal(false); private hideT: ReturnType<typeof setTimeout> | null = null;
  readonly lit = computed(() => this.full() ? this.words().length : Math.ceil(this.bus.progress() * this.words().length));

  constructor() {
    effect(() => {
      const c = this.bus.caption(), on = this.session.captions();
      if (this.hideT) { clearTimeout(this.hideT); this.hideT = null; }
      if (c && on) { this.ha.set(c.ha); this.words.set(c.en.split(/\s+/).filter(Boolean)); this.full.set(false); this.show.set(!!c.en || !!c.ha); return; }
      if (!on || this.bus.captionEnd() !== 'ended') { this.show.set(false); return; }
      this.full.set(true); this.hideT = setTimeout(() => this.show.set(false), 1200);   // ended naturally: every word lit, then gone
    });
  }
}
