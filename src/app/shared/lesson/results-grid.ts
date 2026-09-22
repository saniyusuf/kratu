import { Component, ElementRef, effect, inject, input } from '@angular/core';
import { Item } from './lesson-base';

/** The results slider inside the picture box: every word of the block as a card, the missed ones marked, the one being named lit. */
@Component({
  selector: 'app-results',
  host: { class: 'objresults oslider', '[hidden]': '!on()' },
  template: `<div class="oslider"><div class="ogrid">@for (it of items(); track it.k) {<div class="oc" [class.miss]="miss().includes(it.k)" [class.say]="saying() === it.k" [attr.data-item]="it.k"><img alt="" [src]="it.w.img"></div>}</div></div>`,
})
export class ResultsGrid {
  readonly el = inject(ElementRef<HTMLElement>);
  readonly on = input(false);
  readonly items = input<Item[]>([]);
  readonly miss = input<string[]>([]);
  readonly saying = input('');
  grid(): HTMLElement { return this.el.nativeElement.querySelector('.ogrid') as HTMLElement; }

  constructor() {
    /* the belt: whichever card Laila is naming slides to the middle of the box (Sani 2026-09-20) */
    effect(() => {
      const k = this.saying(); this.items();            // re-run when either changes
      const g = this.grid(); if (!g) return;
      requestAnimationFrame(() => {
        const card = k ? ([...g.children] as HTMLElement[]).find((c) => c.dataset['item'] === k) || null : null;
        if (!card) { g.style.transform = 'translate(-50%,-50%)'; return; }
        const dx = card.offsetLeft + card.offsetWidth / 2 - g.offsetWidth / 2;
        g.style.transform = 'translate(calc(-50% - ' + Math.round(dx) + 'px),-50%)';
      });
    });
  }
}
