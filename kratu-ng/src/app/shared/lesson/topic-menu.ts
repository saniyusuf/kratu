import { Component, ElementRef, inject, input, output } from '@angular/core';
import { KIcon } from '../kicon';
import { Laila } from '../laila/laila';

export interface Topic { key: string; ha: string; ico: string; c: string; min?: number; max?: number; set?: string; n?: number; }

/**
 * The tiles every lesson opens with (Abubuwa's categories, Nemo hoto's two, Rubutu's five, Karatu's four) and the
 * Laila "Fara" press that appears once a tile is picked. The parent decides what is said and where it goes.
 */
@Component({
  selector: 'app-topic-menu',
  imports: [Laila, KIcon],
  host: { style: 'display:contents' },   // the tiles and the Fara press are direct children of .splanding, exactly as in the design
  template: `
<div class="catmenu" [class.few]="few()" [class.haspick]="!!picked()">@for (c of cats(); track c.key) {<button class="catcard" [class.picked]="picked() === c.key" [attr.data-key]="c.key" [style.--c]="c.c" (click)="choose.emit(c.key)"><span class="em kico" [kicon]="c.ico"></span><span class="nm">{{ c.ha }}</span></button>}</div>
<div class="yesno ynpair catpick" [hidden]="!picked()" [class.nohand]="nohand()"><button [class]="'yn yes ' + goClass()" [class.cue]="cue()" aria-label="Fara" (click)="go.emit()"><span class="lglow"></span><app-laila [size]="112" /><span class="lhand">👆🏾</span><small>Fara</small></button></div>`,
})
export class TopicMenu {
  readonly el = inject(ElementRef<HTMLElement>);
  readonly cats = input.required<Topic[]>();
  readonly picked = input<string | null>(null);
  readonly cue = input(false); readonly nohand = input(false); readonly few = input(false);
  readonly goClass = input('sp-go');
  readonly choose = output<string>(); readonly go = output<void>();
  /** The tiles, for the landing's spot. */
  menu(): Element | null { return this.el.nativeElement.querySelector('.catmenu'); }
  /** Laila's head on the Fara press, for the spot while she explains the pick. */
  goHead(): Element | null { return this.el.nativeElement.querySelector('.catpick .lm'); }
}
