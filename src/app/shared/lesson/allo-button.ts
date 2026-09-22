import { Component, ElementRef, inject, input, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ALLO_SVG } from '../allo';

/** The black slate: "Ban sani ba". Pressing it makes Laila tell the answer; the parent decides when it counts. */
@Component({
  selector: 'app-allo-btn',
  host: { class: 'yn no board', role: 'button', 'aria-label': 'Ban sani ba', '(click)': 'pressed.emit()', style: 'padding:1px 6px' },
  template: `<span [innerHTML]="svg"></span><small>{{ label() }}</small>`,
})
export class AlloButton {
  readonly svg = inject(DomSanitizer).bypassSecurityTrustHtml(ALLO_SVG);
  readonly label = input('Ban sani ba');
  readonly pressed = output<void>();
  readonly el = inject(ElementRef<HTMLElement>);
  slate(): Element | null { return this.el.nativeElement.querySelector('.allo') || this.el.nativeElement; }
}
