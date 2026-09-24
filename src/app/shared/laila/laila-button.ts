import { Component, ElementRef, inject, input, output } from '@angular/core';
import { Laila } from './laila';

/**
 * The Laila press button every lesson uses: glow, hear-rings, her head, the beak the letters fly from, the listening
 * bubble, the pointing hand and a one-word label. State comes in as inputs; the parent keeps the lesson's logic.
 */
@Component({
  selector: 'app-laila-btn',
  imports: [Laila],
  host: {
    class: 'yn yes abc-start x-laila', role: 'button', '[attr.aria-label]': 'label()', style: 'padding:1px 6px',   // a real <button> in the design: the browser's own padding is part of its width
    '[class.cue]': 'cue()', '[class.armed]': 'armed()', '[class.rec]': 'rec()', '[class.speak]': 'speak()', '[class.prep]': 'prep()', '[class.yay]': 'yay()',
    '[style.--amp]': 'amp()', '(click)': 'pressed.emit()',
  },
  template: `<span class="lglow"></span><span class="hearrings"></span><app-laila [size]="size()" /><span class="beak"></span><span class="hearbubble" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="lhand">👆🏾</span><small>{{ label() }}</small>`,
})
export class LailaButton {
  readonly label = input('Faɗa');
  readonly size = input(112);
  readonly cue = input(false); readonly armed = input(false); readonly rec = input(false); readonly speak = input(false); readonly prep = input(false);
  /** A short hop and a glow when the child gets it right. */
  readonly yay = input(false);
  readonly amp = input(0);
  readonly pressed = output<void>();
  readonly el = inject(ElementRef<HTMLElement>);
  /** Laila's head, the origin of everything that flies. */
  head(): Element { return this.el.nativeElement.querySelector('.lm') || this.el.nativeElement; }
}
