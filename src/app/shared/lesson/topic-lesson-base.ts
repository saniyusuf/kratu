import { Directive, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { afterPaint } from '../paint';
import { Clip, LessonBase } from './lesson-base';
import { wait } from './helpers';
import { Topic, TopicMenu } from './topic-menu';

/**
 * A lesson that opens on its own tiles (Nemo hoto, Rubutu, Karatu): Laila explains the lesson over the tiles, a tap picks one
 * and she describes it, the Fara press goes to that sub-topic's sample the first time and then into the lesson. The door
 * from a lesson or a pick comes back to the tiles; from the tiles it leaves to the chooser.
 */
@Directive()
export abstract class TopicLessonBase extends LessonBase implements OnInit {
  protected readonly route = inject(ActivatedRoute);
  protected readonly menuRef = viewChild(TopicMenu);
  abstract readonly cats: Topic[];
  /** The route name ('nemo', 'rubutu', 'karatu'), the eyebrow of the tiles and the clip prefixes. */
  protected abstract readonly lesson: string; protected abstract readonly title: string;
  protected abstract readonly introKey: string; protected abstract readonly descPrefix: string;
  readonly cat = signal<string | null>(null); readonly cue = signal(false); readonly nohand = signal(false); readonly inLesson = signal(false);
  protected running = false;

  ngOnInit(): void {
    const pick = this.route.snapshot.queryParamMap.get('pick'), resume = this.route.snapshot.queryParamMap.get('resume');
    afterPaint().then(() => { if (pick && resume && this.cats.some((c) => c.key === pick)) { this.cat.set(pick); this.begin(pick); } else this.landing(); });
  }
  protected def(): Topic { return this.cats.find((c) => c.key === this.cat()) || this.cats[0]; }
  /** Laila over the tiles: what this lesson is, "your turn: pick one", the door hint once per session. */
  protected async landing(): Promise<void> {
    if (this.running) return; this.running = true; this.eye.set(this.title + ' · zaɓi darasi');
    await this.run(async () => {
      if (!(await this.play(this.bus.gk(this.introKey)))) return; if (!(await this.play(this.bus.gk('s_r_turn')))) return;
      this.spotter.spot(this.menuRef()?.menu() || null, 'above'); await wait(1200); this.spotter.unspot(); if (!this.running) return;
    });
    this.spotter.unspot(); this.running = false;
  }
  /** A tile: it can always be picked while Laila is still explaining; the tap cuts her off. */
  async choose(key: string): Promise<void> {
    if (this.inLesson()) return; this.running = false; this.bus.stopAll(); this.spotter.unspot(); this.cat.set(key); this.nohand.set(true); this.cue.set(true);
    await this.playSpot(this.bus.gk(this.descPrefix + key), this.menuRef()?.goHead() || null, 'above'); this.nohand.set(false); this.cue.set(true);
  }
  go(): void {
    const key = this.cat(); if (!key || this.running) return; this.bus.stopAll(); this.spotter.unspot(); this.nohand.set(false); this.cue.set(false);
    if (this.flow.sub(this.lesson, key, '/' + this.lesson + '?pick=' + key + '&resume=1')) return; this.begin(key);
  }
  private begin(key: string): void { this.inLesson.set(true); this.running = true; this.run(() => this.start(key)).then(() => { if (!this.stopped && this.inLesson()) this.toMenu(); }); }
  /** The lesson itself, from its first clip to app_stage_done. */
  protected abstract start(key: string): Promise<void>;
  /** Everything a lesson leaves behind (slots, picture, marks). */
  protected abstract clear(): void;
  toMenu(): void { this.stopped = true; this.bus.stopAll(); this.spotter.unspot(); this.running = false; this.clear(); this.inLesson.set(false); this.cat.set(null); this.cue.set(false); this.nohand.set(false); this.eye.set(this.title + ' · zaɓi darasi'); this.stopped = false; }
  door(): void { if (this.inLesson() || this.cat()) { this.toMenu(); return; } this.bus.stopAll(); this.router.navigate(['/home']); }
  ear(): void {
    this.bus.stopAll(); this.spotter.unspot();
    if (this.inLesson()) { this.earInLesson(); return; }
    if (this.cat()) { this.play(this.bus.gk(this.descPrefix + this.cat())); return; }
    this.running = false; this.landing();
  }
  protected abstract earInLesson(): void;
  /** The recap every lesson ends its block with: the right ones first, then the missed ones. */
  protected async nameEach(list: { k: string }[], saying: (k: string) => void, say: (it: any) => Promise<unknown>, gap = 350): Promise<void> { for (const it of list) { this.check(); saying(it.k); await say(it); await wait(gap); } saying(''); }
}
