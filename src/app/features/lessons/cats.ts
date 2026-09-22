import { Component, OnInit, signal, viewChild } from '@angular/core';
import { afterPaint } from '../../shared/paint';
import { Door, Ear } from '../../shared/chrome/chrome';
import { LessonBase } from '../../shared/lesson/lesson-base';
import { Topic, TopicMenu } from '../../shared/lesson/topic-menu';

export const CATS: Topic[] = [
  { key: 'animals', ha: 'Dabbobi', ico: 'goat', c: 'var(--red)' }, { key: 'food', ha: 'Abinci', ico: 'apple', c: 'var(--blue)' }, { key: 'home', ha: 'Kayan gida', ico: 'house', c: 'var(--yellow)' },
  { key: 'body', ha: 'Jiki', ico: 'hand', c: 'var(--teal)' }, { key: 'nature', ha: 'Yanayi', ico: 'tree', c: 'var(--purple)' }, { key: 'vehicles', ha: 'Motoci', ico: 'car', c: 'var(--orange)' },
  { key: 'people', ha: 'Mutane', ico: 'person', c: 'var(--green)' }, { key: 'actions', ha: 'Ayyuka', ico: 'runner', c: 'var(--pink)' }, { key: 'clothing', ha: 'Tufafi', ico: 'shirt', c: 'var(--red)' }, { key: 'school', ha: 'Makaranta', ico: 'pencil', c: 'var(--blue)' },
];
export const CAT_NAME: Record<string, string> = Object.fromEntries(CATS.map((c) => [c.key, c.ha]));

/** Screen 10 · Abubuwa, the categories. Tap one, Laila describes it, press her to start; the door un-picks. */
@Component({
  selector: 'app-cats',
  imports: [Door, Ear, TopicMenu],
  host: { class: 's lesson cats', '[class.haspick]': '!!cur()' },
  template: `
<app-door (pressed)="door()" /><app-ear (pressed)="ear()" /><div class="eyebrow">Zaɓi darasi</div>
<app-topic-menu [cats]="cats" goClass="cat-go" [picked]="cur()" [cue]="cue()" [nohand]="nohand()" (choose)="choose($event)" (go)="go()" />`,
})
export class CatsScreen extends LessonBase implements OnInit {
  private readonly menu = viewChild.required(TopicMenu);
  readonly cats = CATS;
  readonly cur = signal<string | null>(null); readonly cue = signal(false); readonly nohand = signal(false);

  ngOnInit(): void { afterPaint().then(() => this.bus.play('app_w_menu_intro')); }
  private clip(prefix: string, key: string): string | null { return this.bus.has('app_' + prefix + key) ? 'app_' + prefix + key : this.bus.has('s_' + prefix + key) ? 's_' + prefix + key : null; }
  async choose(key: string): Promise<void> {
    this.bus.stopAll(); this.spotter.unspot(); this.cur.set(key); this.nohand.set(true); this.cue.set(true);
    const desc = this.clip('cat_desc_', key); if (desc && !(await this.bus.play(desc))) return;
    this.spotter.spot(this.menu().goHead(), 'above');
    if (!(await this.bus.play('app_w_tap_white'))) return;
    this.spotter.unspot(); this.nohand.set(false); this.cue.set(true);
  }
  /* A press on Laila leaves at once: "Yanzu za mu ga hotunan dabbobi" belongs to the lesson she is opening, and the
     lesson says it on arrival. Nothing holds a child on a screen they have already left (Sani 2026-09-21). */
  go(): void {
    const key = this.cur(); if (!key) return; this.bus.stopAll(); this.spotter.unspot(); this.nohand.set(false); this.cue.set(false);
    this.session.category.set(key); this.flow.open('abubuwa/koyo');
  }
  door(): void { this.bus.stopAll(); this.spotter.unspot(); if (this.cur()) { this.cur.set(null); this.cue.set(false); this.bus.play('app_w_menu_intro'); } else this.router.navigate(['/home']); }
  ear(): void { this.bus.stopAll(); const k = this.cur(); if (k) this.choose(k); else this.bus.play('app_w_menu_intro'); }
}
