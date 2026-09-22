import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LAILA_SVG } from '../svg';

/** Laila herself: the same SVG the design draws, at whatever size the screen asks for. */
@Component({
  selector: 'app-laila',
  template: `<span [class]="'lm ' + cls()" [style.width.px]="size()" [style.height.px]="size()" [innerHTML]="svg"></span>`,
  styles: [`:host{display:inline-block;line-height:0}`],
})
export class Laila {
  readonly size = input(120);
  /** The design's extra class on this span (meet-lm, start-lm): it carries the breathing and the glow. */
  readonly cls = input('');
  private readonly san = inject(DomSanitizer);
  readonly svg = this.san.bypassSecurityTrustHtml(LAILA_SVG);
}
