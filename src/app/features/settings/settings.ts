import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { IdentityService, Person } from '../../core/identity/identity.service';
import { LoaderService } from '../../core/loader/loader.service';
import { SessionService } from '../../core/state/session.service';
import { SpeechService } from '../../core/speech/speech.service';
import { GAME_LIST } from '../games/lab/game-list';
import { CourseService } from '../../core/state/course.service';
import { ProgressService } from '../../core/state/progress.service';
import { LEVEL_AT, TITLES, levelOf } from '../../core/state/zinari';
import { t } from '../../core/lang/t';

type Stage = 'who' | 'confirm' | 'code' | 'students' | 'games' | 'course';
const CODE = '064662118';
const ICO = {
  person: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  play: '<svg class="ico" viewBox="0 0 24 24"><path d="M7 5v14l11-7z"/></svg>',
  bin: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
};

/**
 * The teal gear, bottom-left on every screen, and its panel: who is signed in, the English subtitles switch, the two
 * sample sessions (Aisha, Musa) for adults, a hard restart, and behind the code the students enrolled on this tablet
 * (simulate one, delete one), and Wasanni: every judging game, to try (Sani 2026-10-14). The microphone test, the device picker, the engine reset and the status line are
 * diagnostics: only with ?debug in the address (Sani 2026-09-13).
 */
@Component({
  selector: 'app-settings',
  host: { style: 'display:contents' },
  styles: [`
#admin .course-open{border-color:#2FAE9E;color:#1F7D71}
#admin .course-open:active{background:#2FAE9E;color:#fff}
#admin .cnow{display:grid;gap:2px;margin:6px 0;padding:8px 12px;border-radius:12px;background:#EAF7F4;color:#1F5F56;text-align:left}
#admin .cnow b{font:800 15px var(--disp,sans-serif)}#admin .cnow small{font-size:12px;font-weight:700}
#admin .row3{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
#admin .row3 button{flex:1 1 auto;font:800 13px var(--disp,sans-serif);border:2px solid #DCCBA3;background:#fff;color:#3B2E1E;border-radius:12px;padding:7px 10px;cursor:pointer}
#admin .row3 button.cgo{border-color:#2FAE9E;background:#2FAE9E;color:#fff}
#admin .row3 button:disabled{opacity:.4;cursor:default}
#admin .zset{display:grid;gap:2px;margin:6px 0;padding:8px 12px;border-radius:12px;background:#FFF6DC;color:#7A5200;text-align:left}
#admin .zset b{font:800 15px var(--disp,sans-serif)}#admin .zset small{font-size:12px;font-weight:700}
#admin .clist{display:grid;gap:4px;margin:6px 0 10px;max-height:42vh;overflow:auto}
#admin .crow{display:grid;grid-template-columns:44px 1fr;column-gap:8px;text-align:left;border:2px solid #E6D6AE;background:#fff;color:#3B2E1E;border-radius:10px;padding:6px 10px;cursor:pointer;font-family:var(--body,sans-serif)}
#admin .crow i{grid-row:span 2;font:800 14px var(--disp,sans-serif);font-style:normal;color:#7a6a4c;align-self:center}
#admin .crow b{font:800 14px var(--disp,sans-serif)}#admin .crow small{font-size:11px;color:#7a6a4c;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#admin .crow.game{background:#FFF6DC;border-color:#F0C95A}
#admin .crow.at{border-color:#2FAE9E;box-shadow:0 0 0 2px #2FAE9E inset}
`],
  template: `
<button id="admingear" class="show" [attr.aria-label]="t('Saituna')" (click)="open()"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg></button>
<div id="admin" [class.open]="isOpen()" (click)="backdrop($event)"><div class="box">
  <h3>{{ t('Saituna') }} · settings</h3>
  @if (session.debug) {
    <div class="ldstat" [innerHTML]="status()"></div>
    <div class="mictest"><button class="mtgo" [class.rec]="micRec()" (click)="micTest()">🎤 {{ t('Gwada makirufo') }} · Test the mic</button><select class="mtdev" [title]="t('Makirufo') + ' · microphone'" (change)="pickMic($event)">@for (d of devices(); track d.id) {<option [value]="d.id" [selected]="d.id === micId()">{{ d.label }}</option>}</select><span class="mtout">{{ micOut() }}</span><button class="mtreset" title="Wipe every stored engine copy and reload" (click)="resetEngines()">↻ {{ t('Sabunta injin') }} · Reset engines</button></div>
  }
  <div class="whocard" [class.demo]="who().demo"><img class="wpic" alt="" [hidden]="!who().pic" [src]="who().pic || ''"><span class="wico" [class.girl]="who().g === 'f'" [class.boy]="who().g === 'm'" [hidden]="!!who().pic" [innerHTML]="ico.person"></span><div class="wtxt"><b class="wname">{{ who().name }}</b><small class="wmode">{{ who().mode }}</small></div></div>
  <div class="switch" id="subswitch" [class.on]="session.captions()" (click)="session.setCaptions(!session.captions())"><div><b><svg class="ico" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M16.5 10.2a2.2 2.2 0 1 0 0 3.6"/></svg>English subtitles</b><small>{{ t('a teleprompter strip, bottom right, that lights up as Laila speaks') }}</small></div><div class="knob"></div></div>
  <div class="permnote" [hidden]="permsOK()"><b>{{ t('Izini') }} · permission first</b><small>The demo sessions and the students need the microphone. Grant the camera and microphone on the first screen before using them.</small><button class="toperm" (click)="toPerm()">Go to the permission screen</button></div>
  <div class="flag"><svg class="ico" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-6 11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1L14 9V3"/></svg>{{ t('GWAJI') }} · sample sessions, not recorded</div>
  <div class="sub">{{ t('Start a sample session as Aisha (girl) or Musa (boy) to test every screen in the female or male voice.') }}</div>
  <div class="stage who-stage" [hidden]="stage() !== 'who'"><div class="who">
      <button class="pcard girl" [class.locked]="!permsOK()" (click)="ask('f', t('Aisha'))"><img class="gph" [alt]="t('Aisha')" src="assets/gender-girl.webp"><div class="nm">{{ t('Aisha') }}</div><small>{{ t('yarinya') }} · girl</small></button>
      <button class="pcard boy" [class.locked]="!permsOK()" (click)="ask('m', t('Musa'))"><img class="gph" [alt]="t('Musa')" src="assets/gender-boy.webp"><div class="nm">{{ t('Musa') }}</div><small>{{ t('yaro') }} · boy</small></button></div>
    <button class="games-open" (click)="stage.set('games')"><svg class="ico" viewBox="0 0 24 24"><rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r="1"/><circle cx="17.5" cy="13.8" r="1"/></svg>Wasanni · games (all {{ games.length }}, to try)</button>
    <button class="games-open course-open" (click)="openCourse()"><svg class="ico" viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/></svg>Kos · course, simulate ({{ course.on() ? 'step ' + course.at() : 'off' }})</button>
    <button class="restart" (click)="hardRestart()"><svg class="ico" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>{{ t('Sake farawa gaba ɗaya') }} · hard restart (clears everything)</button>
    <button class="students-open" [class.locked]="!permsOK()" (click)="openCode()"><span [innerHTML]="ico.person"></span>{{ t('Yara') }} · students <span class="lock"><svg class="ico" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>code</span></button></div>
  <div class="stage code-stage" [hidden]="stage() !== 'code'"><div class="sub">Adults only · enter the code to see the students</div><div class="code" id="admincode" [class.bad]="codeBad()">{{ dots() }}</div><div class="pad">@for (d of pad; track d) {<button (click)="key(d)">{{ d === 'del' ? '⌫' : d === 'ok' ? '✓' : d }}</button>}</div><button class="close cback" (click)="stage.set('who')"><svg class="ico" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>{{ t('Koma') }} · back</button></div>
  <div class="stage students-stage" [hidden]="stage() !== 'students'"><h4 class="stitle">{{ t('Yara') }} · students</h4><div class="slist">
      @if (!students().length) {<div class="sempty">{{ t('Babu yara tukuna') }} · no students enrolled on this tablet yet.</div>}
      @for (p of students(); track p.id) {<div class="srow"><span class="wico" [class.girl]="p.gender === 'f'" [class.boy]="p.gender !== 'f'" [innerHTML]="ico.person"></span><div class="sname"><b>{{ p.name || '?' }}</b><small>{{ p.gender === 'f' ? 'yarinya · girl' : 'yaro · boy' }}{{ enrolled(p) }}{{ p.faceVecs?.length ? ' · face known' : '' }}</small></div><button class="ssim" (click)="simulate(p)"><span [innerHTML]="ico.play"></span>simulate</button><button class="sdel" [class.sure]="sure() === p.id" (click)="del(p)"><span [innerHTML]="ico.bin"></span>{{ sure() === p.id ? 'delete ' + p.name + '?' : 'delete' }}</button></div>}
    </div><button class="close cback" (click)="stage.set('who')"><svg class="ico" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>{{ t('Koma') }} · back</button></div>
  <div class="stage games-stage" [hidden]="stage() !== 'games'"><h4 class="stitle">Wasanni · games</h4><div class="sub">The judging games, to try. Each one opens as {{ session.g() === 'f' ? 'a girl' : 'a boy' }} would see it; the door brings you back.</div><div class="glist">
      @for (g of games; track $index) {<button class="grow" (click)="playGame(g.id, g.q)"><b>{{ g.name }}</b><small>{{ g.section }} · {{ g.en }}</small><span class="gico" [innerHTML]="ico.play"></span></button>}
    </div><button class="close cback" (click)="stage.set('who')"><svg class="ico" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>{{ t('Koma') }} · back</button></div>
  <div class="stage course-stage" [hidden]="stage() !== 'course'"><h4 class="stitle">Kos · course simulator</h4>
    <div class="sub">Pick any of the {{ course.steps.length }} steps, then press the book on the home screen: it opens that step. A lesson played out or a game passed moves the book on. Before a game you can tap pictures to count them as failed, then press Laila to play, or skip straight to the results.</div>
    <div class="cnow">@if (course.step(course.at()); as st) {<b>Now: step {{ st.n }} · {{ st.title }}</b><small>{{ st.t }} · {{ st.kind }}{{ st.items.length ? ' · ' + st.items.join(', ') : '' }}</small>} @else {<b>Off: the book follows the child's real plan</b>}</div>
    <div class="row3"><button (click)="stepBy(-1)">‹ Back a step</button><button (click)="stepBy(1)">Forward a step ›</button><button class="cgo" [disabled]="!course.on()" (click)="openBook()">Go to the book</button><button [disabled]="!course.on()" (click)="course.go(null)">Turn off</button></div>
    <div class="zset"><b>Zinari: {{ zin() }}{{ zinLevel() }}</b><small>Set the gold just under a bag (50 short): the next game passed fills it and unlocks its title.</small>
      <div class="row3">@for (t of titles; track t.key; let i = $index) {<button (click)="setZin(t.at - 50)">{{ t.m }} · {{ t.at - 50 }}</button>}<button (click)="setZin(0)">0</button></div></div>
    <div class="clist" id="clist">
      @for (st of course.steps; track st.n) {<button class="crow" [class.game]="st.t === 'game'" [class.at]="course.at() === st.n" (click)="pickStep(st.n)"><i>{{ st.n }}</i><b>{{ st.title }}</b><small>{{ st.t === 'game' ? 'game' : st.kind }}{{ st.items.length ? ' · ' + st.items.join(', ') : '' }}</small></button>}
    </div><button class="close cback" (click)="stage.set('who')"><svg class="ico" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>{{ t('Koma') }} · back</button></div>
  <div class="stage confirm-stage" [hidden]="stage() !== 'confirm'"><div class="cwho">@if (pending(); as w) {<button class="pcard" [class.girl]="w.g === 'f'" [class.boy]="w.g === 'm'"><img class="gph" [alt]="w.name" [src]="w.g === 'f' ? 'assets/gender-girl.webp' : 'assets/gender-boy.webp'"><div class="nm">{{ w.name }}</div><small>{{ w.g === 'f' ? 'yarinya · girl' : 'yaro · boy' }}</small></button>}</div>
    <h4 class="ctitle">{{ t('Fara zaman gwaji a matsayin') }} {{ pending()?.name }}? · Start a sample session as {{ pending()?.name }}?</h4>
    <p class="ctext">A test session for adults. The app runs exactly as it does for a {{ pending()?.g === 'f' ? 'girl' : 'boy' }} named {{ pending()?.name }}: the {{ pending()?.g === 'f' ? 'girl' : 'boy' }} voice lines, the greeting, every lesson and test. Nothing is recorded or saved, no face or voice is enrolled, and the examples and hints play again from the start.</p>
    <div class="row2"><button class="close cno" (click)="pending.set(null); stage.set('who')"><svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>{{ t("A'a") }} · cancel</button><button class="cyes" (click)="confirm()"><svg class="ico" viewBox="0 0 24 24"><path d="M7 5v14l11-7z"/></svg>{{ t('Fara') }} · start</button></div></div>
  <div class="row2"><button class="close" (click)="close()"><svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>{{ t('Rufe') }} · close</button></div>
</div></div>`,
})
export class Settings {
  readonly t = t;
  readonly session = inject(SessionService);
  private readonly bus = inject(AudioBus);
  private readonly identity = inject(IdentityService);
  private readonly speech = inject(SpeechService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  readonly ico = ICO;
  readonly games = GAME_LIST;
  readonly course = inject(CourseService);
  private readonly progress = inject(ProgressService);
  readonly titles = TITLES;
  readonly zin = signal(0);
  zinLevel(): string { const n = levelOf(this.zin()); return n ? ' · ' + TITLES[n - 1].m + ' (' + n + ' of ' + LEVEL_AT.length + ' bags)' : ' · no title yet'; }
  setZin(n: number): void { this.progress.setZinari(n); this.zin.set(this.progress.zinari()); }
  readonly pad: (number | 'del' | 'ok')[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'];
  readonly isOpen = signal(false); readonly stage = signal<Stage>('who');
  readonly pending = signal<{ g: 'm' | 'f'; name: string; person?: Person } | null>(null);
  readonly typed = signal(''); readonly codeBad = signal(false); readonly dots = computed(() => this.typed().replace(/./g, '•'));
  readonly students = signal<Person[]>([]); readonly sure = signal<string | null>(null);
  readonly status = signal(''); readonly micRec = signal(false); readonly micOut = signal('say “goat” after pressing'); readonly devices = signal<{ id: string; label: string }[]>([]); readonly micId = signal('');
  private sureT: ReturnType<typeof setTimeout> | null = null;

  /** The card at the top: who the tablet is running for right now. */
  readonly who = computed(() => {
    const sim = this.session.simulated(), name = this.session.name(), g = this.session.g(), girl = g === 'f';
    if (sim && sim.personId) return { name: sim.name + ' · ' + t(girl ? 'yarinya' : 'yaro'), mode: t('Zaman gwaji') + ' · simulated as this student, not recorded', g, pic: null, demo: false };
    if (sim || (this.session.demo() && name)) return { name: (sim?.name || name) + ' · ' + t(girl ? 'yarinya' : 'yaro'), mode: t('Zaman gwaji') + ' · demo session, not recorded', g, pic: girl ? 'assets/gender-girl.webp' : 'assets/gender-boy.webp', demo: true };
    if (name) return { name: name + ' · ' + t(girl ? 'yarinya' : 'yaro'), mode: this.session.known() === false ? t('Sabon yaro') + ' · new child, enrolled today · this session is recorded' : t('Yaro na gaske') + ' · real child · this session is recorded', g, pic: null, demo: false };
    return { name: 'Babu kowa tukuna · no one yet', mode: 'Sign in on the first screens, or start a demo below', g: null, pic: null, demo: false };
  });
  permsOK(): boolean { return !!this.session.perms()?.mic; }

  open(): void { this.bus.stopAll(); this.stage.set('who'); this.pending.set(null); this.isOpen.set(true); if (this.session.debug) { this.refreshStatus(); this.fillDevices(); } }
  close(): void { this.isOpen.set(false); }
  backdrop(e: Event): void { if ((e.target as HTMLElement).id === 'admin') this.close(); }
  toPerm(): void { this.close(); this.router.navigate(['/perm']); }

  // ---- the sample sessions ----
  ask(g: 'm' | 'f', name: string): void { if (!this.permsOK()) return; this.pending.set({ g, name }); this.stage.set('confirm'); }
  confirm(): void { const w = this.pending(); if (!w) return; this.pending.set(null); this.stage.set('who'); this.startSample(w.g, w.name, w.person); }
  private async startSample(g: 'm' | 'f', name: string, person?: Person): Promise<void> {
    this.bus.stopAll(); this.session.setGender(g); this.session.name.set(name); this.session.personId.set(person?.id ?? null);
    this.session.simulated.set({ name, g, personId: person?.id ?? null }); this.session.known.set(null); this.session.resetSamples(); this.session.hintsReset();
    const bank = (window as any).KRATU_BANK as Record<string, string> | null; const src = bank?.[name.toLowerCase()] || person?.clip || null;
    this.session.greet.set({ name, src }); this.close();
    if (this.router.url.startsWith('/home')) await this.router.navigateByUrl('/blank', { skipLocationChange: true });   // the chooser is re-entered so the greeting plays
    this.router.navigate(['/home']);
  }
  /** Wasanni: the balloons are their own screen; the others share the games screen. Picked from inside a game, the games
      screen is left first: the router would otherwise keep it and the old game (the Durbar mixed up) goes on (Sani 2026-10-24). */
  async playGame(id: string, q?: Record<string, string>): Promise<void> {
    this.bus.stopAll(); this.close();
    if (/^\/(wasanni|fashe)/.test(this.router.url)) await this.router.navigateByUrl('/blank', { skipLocationChange: true });
    this.router.navigate(id === 'fashe' ? ['/fashe'] : ['/wasanni', id], { queryParams: q || {} });
  }
  // ---- the course simulator (Sani 2026-11-02) ----
  openCourse(): void { this.zin.set(this.progress.zinari()); this.stage.set('course'); setTimeout(() => document.querySelector('#clist .crow.at')?.scrollIntoView({ block: 'center' }), 0); }
  stepBy(d: number): void { const n = this.course.at(); this.course.go(Math.max(0, Math.min(this.course.steps.length - 1, (n ?? -1) + d))); }
  pickStep(n: number): void { this.course.go(n); this.openBook(); }
  /** Back to the chooser, re-entered so the book shows the picked step. */
  async openBook(): Promise<void> {
    this.bus.stopAll(); this.close();
    await this.router.navigateByUrl('/blank', { skipLocationChange: true });
    this.router.navigate(['/home']);
  }
  hardRestart(): void {
    this.bus.stopAll(); try { localStorage.clear(); sessionStorage.clear(); } catch { /* ignore */ }
    try { indexedDB.databases?.().then((dbs) => dbs.forEach((d) => { try { if (d.name) indexedDB.deleteDatabase(d.name); } catch { /* ignore */ } })); } catch { /* ignore */ }
    try { this.identity.api?.store.clear(); } catch { /* ignore */ }
    setTimeout(() => { location.replace(location.pathname); location.reload(); }, 50);
  }

  // ---- the students, behind the code ----
  openCode(): void { if (!this.permsOK()) return; this.typed.set(''); this.codeBad.set(false); this.stage.set('code'); }
  key(d: number | 'del' | 'ok'): void {
    if (d === 'del') { this.typed.update((t) => t.slice(0, -1)); return; }
    if (d === 'ok') { if (this.typed() === CODE) { this.stage.set('students'); this.loadStudents(); } else { this.codeBad.set(true); setTimeout(() => { this.codeBad.set(false); this.typed.set(''); }, 600); } return; }
    if (this.typed().length < 12) this.typed.update((t) => t + d);
  }
  private async loadStudents(): Promise<void> { try { await this.identity.api?.store.load(); } catch { /* engine not ready */ } this.students.set(this.identity.people().slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''))); }
  enrolled(p: Person): string { const at = (p as any).at; return at ? ' · enrolled ' + new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''; }
  simulate(p: Person): void { this.stage.set('who'); this.startSample(p.gender === 'f' ? 'f' : 'm', p.name, p); }
  async del(p: Person): Promise<void> {
    if (this.sure() !== p.id) { this.sure.set(p.id); if (this.sureT) clearTimeout(this.sureT); this.sureT = setTimeout(() => this.sure.set(null), 4000); return; }   // a second tap within 4 s deletes
    this.sure.set(null); try { await this.identity.api?.store.remove(p.id); } catch { /* ignore */ }
    if (this.session.personId() === p.id) this.session.personId.set(null); this.loadStudents();
  }

  // ---- diagnostics (?debug only) ----
  private refreshStatus(): void {
    const heard = this.speech.heard.slice(-5).map((h) => h.target + ' → ' + (h.heard ? '“' + h.heard + '”' : 'nothing') + (h.ok ? ' ✓' : ' ✗') + ' · mic ' + Math.round(h.peak * 100) + '%');
    const K = this.identity.api;
    this.status.set('<b>Loader</b> ' + this.loader.stage() + ' ' + this.loader.pct() + '% · <b>speech</b> ' + this.speech.state() + (this.speech.isSaved() ? ' (saved)' : '') + (this.speech.feedErrors() ? ' · feed errors ' + this.speech.feedErrors() : '') + ' · <b>face</b> ' + (K?.isReady ? 'engine · ' + (K.ep || '?') + ' · ' + (K.recName || '?') + ((navigator as any).gpu ? '' : ' · no webgpu') : 'fallback') + '<br>heard: ' + (heard.length ? heard.join(' | ') : 'nothing yet'));
  }
  private fillDevices(): void {
    try { this.micId.set(localStorage.getItem('kratu_mic') || ''); } catch { /* ignore */ }
    navigator.mediaDevices?.enumerateDevices?.().then((ds) => this.devices.set([{ id: '', label: 'Makirufo na tsari · default microphone' }].concat(ds.filter((d) => d.kind === 'audioinput').map((d, i) => ({ id: d.deviceId, label: d.label || 'microphone ' + (i + 1) }))))).catch(() => undefined);
  }
  pickMic(e: Event): void { const v = (e.target as HTMLSelectElement).value; this.micId.set(v); try { if (v) localStorage.setItem('kratu_mic', v); else localStorage.removeItem('kratu_mic'); } catch { /* ignore */ } this.speech.resetAudio(); this.micOut.set('microphone changed · press the test'); }
  async micTest(): Promise<void> {
    if (this.micRec()) return; this.micRec.set(true); this.micOut.set(t('Ina saurara…') + ' say “goat”'); const t0 = Date.now();
    const r = await this.speech.hear({ target: 'goat', match: (raw) => raw || null }).done; this.micRec.set(false); const h = this.speech.heard.slice(-1)[0];
    this.micOut.set((r.raw ? 'heard “' + r.raw + '”' : 'heard nothing') + ' · ' + Math.round((Date.now() - t0) / 1000) + ' s · mic ' + Math.round((h?.peak || 0) * 100) + '%' + (h?.rate ? ' · ' + h.rate + ' Hz' : '') + ' · audio ' + (this.speech.audioInfo.ctx || '?') + (this.speech.audioInfo.muted ? ' · track MUTED' : '') + ' · device: ' + (this.speech.audioInfo.device || '?')); this.refreshStatus();
  }
  async resetEngines(): Promise<void> { try { await this.speech.reset(); } catch { /* ignore */ } location.reload(); }
}
