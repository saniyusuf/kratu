import { Directive, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { afterPaint } from '../paint';
import { Clip, Item, LessonBase } from './lesson-base';
import { CourseService } from '../../core/state/course.service';
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
  protected readonly course = inject(CourseService);
  abstract readonly cats: Topic[];
  /** The route name ('nemo', 'rubutu', 'karatu'), the eyebrow of the tiles and the clip prefixes. */
  protected abstract readonly lesson: string; protected abstract readonly title: string;
  protected abstract readonly introKey: string; protected abstract readonly descPrefix: string;
  readonly cat = signal<string | null>(null); readonly cue = signal(false); readonly nohand = signal(false); readonly inLesson = signal(false);
  protected running = false;

  ngOnInit(): void {
    const pick = this.route.snapshot.queryParamMap.get('pick'), resume = this.route.snapshot.queryParamMap.get('resume');
    afterPaint().then(() => {
      if (pick && resume && this.cats.some((c) => c.key === pick)) { this.cat.set(pick); this.begin(pick); return; }
      // a course step (?words=…&done=n): no tiles, straight into exactly those words (the sample first, the first time)
      const g = this.given(); if (g) { this.cat.set(this.courseCat(g)); this.go(); return; }
      if ((this.inCourse() || this.route.snapshot.queryParamMap.get('step')) && pick && this.cats.some((c) => c.key === pick)) { this.cat.set(pick); this.go(); return; }   // a step that is one tile (Nemo lamba, Nemo hoto's game)
      this.landing();
    });
  }
  /**
   * A course step's own words (?words=…&done=n, Sani 2026-11-04): the lesson teaches exactly these, in the ladder's order,
   * and hands back to the course when they are all right. A two-word name keeps its space here; a screen that spells
   * drops it, as the games do ("Lunch box" is spelt LUNCHBOX).
   */
  protected given(): Item[] | null {
    const q = this.route.snapshot.queryParamMap; if (!q.get('done')) return null;
    const ks = (q.get('words') || '').split(',').map((k) => k.trim()).filter((k) => this.words.find(k)); if (!ks.length) return null;
    const catOf = (k: string) => Object.keys(this.words.cats()).find((c) => this.words.list(c).some((w) => w.k === k));
    return ks.map((k) => { const w = this.words.find(k)!; return { ...this.item(w, catOf(k), true), en: String(w.en).toUpperCase().replace(/[^A-Z ]/g, '').trim() }; });
  }
  /** Played as a course step: its words, or one tile (?pick=), with the step's number to hand back (?done=n). */
  protected inCourse(): boolean { const q = this.route.snapshot.queryParamMap; return !!q.get('done') && (!!this.given() || this.cats.some((c) => c.key === q.get('pick'))); }
  /** The tile a course step belongs to (its name on the eyebrow, its sample): the one whose lengths hold the longest word. */
  private courseCat(g: Item[]): string {
    const n = Math.max(...g.map((it) => it.en.replace(/ /g, '').length));
    return (this.cats.find((c) => !c.set && (c.min ?? 0) <= n && n <= (c.max ?? 99)) || this.cats[0]).key;
  }
  /** A course step played out: the course moves on and its next step opens, never the tiles (as Abubuwa does). */
  private toCourse(): boolean {
    const done = this.route.snapshot.queryParamMap.get('done'); if (!done || !this.inCourse()) return false;
    this.course.done(+done); const nx = this.course.step();
    if (nx && this.course.at() === +done + 1) { const rt = this.course.route(nx); this.router.navigateByUrl('/blank', { skipLocationChange: true }).then(() => this.router.navigate(['/' + rt.path], { queryParams: rt.query })); }
    else this.router.navigate(['/home']);
    return true;
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
    // a lesson's own words (?words=, the course's Nemo hoto) come back with it after the example
    const q = this.route.snapshot.queryParamMap, ws = q.get('words'), dn = q.get('done');
    const keep = (ws ? '&words=' + encodeURIComponent(ws) : '') + (dn ? '&done=' + dn : '') + (q.get('step') ? '&step=' + q.get('step') + '&try=' + (q.get('try') || 1) : '');
    if (this.flow.sub(this.lesson, key, '/' + this.lesson + '?pick=' + key + '&resume=1' + keep)) return; this.begin(key);
  }
  private begin(key: string): void { this.inLesson.set(true); this.running = true; this.run(() => this.start(key)).then(() => { if (!this.stopped && this.inLesson() && !this.toCourse()) this.toMenu(); }); }
  /** The lesson itself, from its first clip to app_stage_done. */
  protected abstract start(key: string): Promise<void>;
  /** The sub-topic just played out to its app_stage_done: one unit of this lesson is finished. */
  protected finished(): void { const k = this.cat(); if (k) this.progress.mark(this.lesson as 'nemo' | 'karatu' | 'rubutu', k); }
  /** Everything a lesson leaves behind (slots, picture, marks). */
  protected abstract clear(): void;
  toMenu(): void { this.stopped = true; this.bus.stopAll(); this.spotter.unspot(); this.running = false; this.clear(); this.inLesson.set(false); this.cat.set(null); this.cue.set(false); this.nohand.set(false); this.eye.set(this.title + ' · zaɓi darasi'); this.stopped = false; }
  door(): void { if (!this.inCourse() && !this.route.snapshot.queryParamMap.get('step') && (this.inLesson() || this.cat())) { this.toMenu(); return; } this.stopped = true; this.bus.stopAll(); this.router.navigate(['/home']); }
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
