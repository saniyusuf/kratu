import { Component, ElementRef, inject, input, output } from '@angular/core';

export type KeyMark = 'good' | 'bad' | 'hot';
/** The A–Z keyboard of Rubutu: a tap sends the letter up; the parent lights keys good, bad or hot (the slate's hint). */
@Component({
  selector: 'app-abc-keyboard',
  host: { class: 'abcgrid', '[class.locked]': 'locked()' },
  template: `@for (L of letters; track L) {<button type="button" class="abckey" [attr.data-l]="L" [class.good]="marks()[L] === 'good'" [class.bad]="marks()[L] === 'bad'" [class.hot]="marks()[L] === 'hot'" (click)="key.emit(L)">{{ L }}</button>}`,
})
export class AbcKeyboard {
  readonly letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  readonly locked = input(false);
  readonly marks = input<Record<string, KeyMark>>({});
  readonly key = output<string>();
  readonly el = inject(ElementRef<HTMLElement>);
  keyEl(L: string): HTMLElement | null { return this.el.nativeElement.querySelector('.abckey[data-l="' + L + '"]'); }
}
