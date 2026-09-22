import { Directive, ElementRef, effect, inject, input } from '@angular/core';
import { ICONS } from './icons';

/** Draws one of the tile pictures (our own SVG, from the design) inside the element: `<span class="em kico" kicon="goat">`. */
@Directive({ selector: '[kicon]' })
export class KIcon {
  readonly kicon = input.required<string>();
  private readonly el = inject(ElementRef<HTMLElement>);
  constructor() { effect(() => { this.el.nativeElement.innerHTML = ICONS[this.kicon()] || ''; }); }
}
