import { Component, input, inject, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOOR_SVG, EAR_SVG } from '../svg';

/**
 * The door (upper-left, back) and the ear (upper-right, hear again) on every screen. The component IS the design's
 * element: the host carries the class, so `.s > .backdoor` and `.s > .helpdome` match exactly as in the old build
 * (that is what pins them to the true corners of the frame).
 */
@Component({
  selector: 'app-door',
  host: { class: 'backdoor', role: 'button', tabindex: '0', 'aria-label': 'Koma baya', '(click)': 'pressed.emit()', '(keydown.enter)': 'pressed.emit()' },
  template: `<span style="display:contents" [innerHTML]="svg"></span>`,
})
export class Door {
  readonly pressed = output<void>();
  readonly svg = inject(DomSanitizer).bypassSecurityTrustHtml(DOOR_SVG);
}

@Component({
  selector: 'app-ear',
  host: { class: 'helpdome', role: 'button', tabindex: '0', 'aria-label': 'Ji kuma', '(click)': 'pressed.emit()', '(keydown.enter)': 'pressed.emit()', '[class.spot]': 'spot()' },
  template: `<span style="display:contents" [innerHTML]="svg"></span>`,
})
export class Ear {
  /** The design's focus(dome): the ear pulses so the child knows where to press to hear it again. */
  readonly spot = input(false);
  readonly pressed = output<void>();
  readonly svg = inject(DomSanitizer).bypassSecurityTrustHtml(EAR_SVG);
}
