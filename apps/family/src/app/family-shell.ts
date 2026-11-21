import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, computed, effect, inject, signal, untracked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioBus } from '@kratu/app/core/audio/audio-bus.service';
import { WordsService } from '@kratu/app/core/clips/words.service';
import { ANIMALS, FamilyService, Profile, animal } from '@kratu/app/core/family/family.service';
import { snapName } from '@kratu/app/core/identity/name-clip';
import { Gender, SessionService } from '@kratu/app/core/state/session.service';
import { Laila } from '@kratu/app/shared/laila/laila';
import { DOOR_SVG, EAR_SVG } from '@kratu/app/shared/svg';

/**
 * The family build's own screens. The flow (Sani 2026-11-21, from his notes on the steps page): Kratu opening from a
 * link ("learn English with Laila"), the microphone, the parent signing in (email, phone and a 6-digit code they set, typed twice; later the code will be sent), the
 * parent enrolling a child (name and boy or girl, the card above a preview), a thank-you, then the children's profiles.
 * A child's first tap on their card: they choose their own animal, Laila welcomes them by name, then her first-day
 * welcome. Every tap after: straight to the welcome back. Manage profiles asks for the parent's code.
 * Unlike the lessons they follow the phone: upright and sideways each have their own layout. Written words lead with
 * English for the parent; Laila's spoken lines stay Hausa. Lines Sani has still to write (f_start, f_mic) are not
 * guessed: Laila is silent there until he does.
 */
@Component({
  selector: 'app-family-shell',
  imports: [Laila, DatePipe],
  host: { '[class.on]': '!!fam.screen()', '[attr.data-s]': 'fam.screen()' },
  templateUrl: './family-shell.html',
  styleUrl: './family-shell.css',
})
export class FamilyShell implements OnDestroy {
  readonly fam = inject(FamilyService);
  private readonly bus = inject(AudioBus);
  private readonly words = inject(WordsService);
  private readonly session = inject(SessionService);
  private readonly san = inject(DomSanitizer);
  readonly door = this.san.bypassSecurityTrustHtml(DOOR_SVG);
  readonly ear = this.san.bypassSecurityTrustHtml(EAR_SVG);
  readonly ANIMALS = ANIMALS;
  readonly animal = animal;

  // sizes follow the phone, whichever way round it is
  readonly vw = signal(innerWidth);
  readonly vh = signal(innerHeight);
  readonly upright = computed(() => this.vh() > this.vw());
  readonly lailaBig = computed(() => Math.round(Math.min(this.vw(), this.vh()) * (this.upright() ? 0.5 : 0.36)));
  readonly lailaSmall = computed(() => Math.round(Math.min(this.vw(), this.vh()) * (this.upright() ? 0.2 : 0.17)));
  @HostListener('window:resize') resized(): void { this.vw.set(innerWidth); this.vh.set(innerHeight); }

  // ---- enrol a child (the parent): boy or girl, then the name. Nothing is saved until Save.
  readonly g = signal<Gender | null>(null);
  readonly name = signal('');
  readonly part = computed(() => (!this.g() ? 1 : 2));
  // ---- the child's first visit: their animal
  readonly pick = signal<string | null>(null);
  readonly taken = computed(() => this.fam.taken().filter((k) => k !== this.fam.current()?.animal));

  // ---- the parent's sign-in (email, phone, a code typed twice) and the code before Manage profiles
  readonly email = signal('');
  readonly phone = signal('');
  readonly code = signal('');
  readonly code2 = signal('');
  readonly busy = signal(false);
  readonly codeMsg = signal('');
  readonly emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()));
  readonly phoneOk = computed(() => this.phone().replace(/\D/g, '').length >= 10);
  readonly formOk = computed(() => this.emailOk() && this.phoneOk() && this.code().length === 6 && this.code2().length === 6);
  digits(v: string): string { return v.replace(/\D/g, '').slice(0, 6); }

  readonly micBusy = signal(false);
  readonly micMsg = signal('');
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // each screen's opening: what Laila says there (only lines that exist), and a clean slate for the forms
    effect(() => {
      const s = this.fam.screen();
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      this.micMsg.set(''); this.code.set(''); this.code2.set(''); this.codeMsg.set(''); this.busy.set(false);
      if (s === 'signin') { this.email.set(''); this.phone.set(''); }
      if (s === 'add') { this.g.set(null); this.name.set(''); }
      if (s === 'pick') this.pick.set(null);
      untracked(() => this.opening(s));
    });
  }
  ngOnDestroy(): void { if (this.timer) clearTimeout(this.timer); }

  /** Lines Sani has still to write (f_start, f_mic) simply stay silent: AudioBus plays nothing for a key with no clip. */
  private opening(s: string | null): void {
    if (s === 'welcome') this.bus.play('f_start');
    else if (s === 'mic') this.bus.play('f_mic');
    else if (s === 'yours') this.timer = setTimeout(() => this.greet(), 450);
  }

  /** "Sannu, Musa! Barka da zuwa!" (Sani 2026-11-21): the name in Laila's voice only when the names bank has it exactly
   *  (snapName: one name must never be heard and another said); otherwise "Sannu! Barka da zuwa!" with no name. */
  async greet(): Promise<void> {
    const c = this.fam.current(); if (!c) return;
    const bank = (window as any).KRATU_BANK as Record<string, string> | null;
    const key = c.name && c.name.indexOf(' ') < 0 ? snapName(c.name, bank) : null;
    if (!(await this.bus.play('s_sannu'))) return;
    if (key && bank && !(await this.bus.playRaw(bank[key], { ha: c.name, en: c.name }))) return;
    await this.bus.play('s_welcome');
  }

  // ---- welcome and microphone
  async askMic(): Promise<void> {
    if (this.micBusy()) return;
    const md = navigator.mediaDevices;
    if (!md?.getUserMedia) { this.fam.afterMic(); return; }
    this.micBusy.set(true); this.micMsg.set('');
    try {
      const s = await md.getUserMedia({ audio: true }); s.getTracks().forEach((t) => t.stop());
      this.session.savePerms(false);
      this.micBusy.set(false); this.fam.afterMic();
    } catch (e: any) {
      this.micBusy.set(false);
      this.micMsg.set('The microphone was not allowed. Kratu still works: speaking tasks become tap-the-picture tasks. You can allow it later from Manage profiles.');
    }
  }

  // ---- the parent's code
  async signUp(): Promise<void> {
    if (!this.formOk() || this.busy()) return;
    if (this.code() !== this.code2()) { this.code.set(''); this.code2.set(''); this.codeMsg.set('The two codes were not the same. Please make your code again.'); return; }
    this.busy.set(true); await this.fam.setAccount(this.email(), this.phone(), this.code()); this.busy.set(false);
    this.fam.afterSetup();
  }
  async openParent(): Promise<void> {
    if (this.code().length !== 6 || this.busy()) return;
    this.busy.set(true); const ok = await this.fam.checkCode(this.code()).catch(() => false); this.busy.set(false);
    if (ok) { this.fam.show('parent'); return; }
    this.code.set(''); this.codeMsg.set('That code is not right. Try again.');
  }

  // ---- enrol
  setG(g: Gender): void { this.g.set(g); }
  setName(v: string): void { this.name.set(v.replace(/\s+/g, ' ').slice(0, 24)); }
  enrol(): void {
    if (!this.g() || !this.name().trim()) return;
    this.fam.added(this.fam.add(this.name().trim(), this.g()!));
  }

  // ---- the child's animal
  choose(k: string): void {
    const c = this.fam.current();
    if (!c || this.taken().includes(k)) return;
    this.pick.set(k);
    const w = this.words.find(k); if (w?.ha_clip) this.bus.playRaw(w.ha_clip);   // Laila says the animal's name, the clip the animals lesson uses
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.fam.current.set({ ...c, animal: k }); this.fam.show('yours'); }, 1100);
  }
  /** "Ci gaba": only now is the animal kept, then Laila's first-day welcome. */
  saveAnimal(): void {
    const c = this.fam.current(); if (!c) return;
    const p = this.fam.setAnimal(c.id, c.animal) ?? c; this.fam.current.set(p); this.fam.firstGo();
  }
  backToPick(): void { const c = this.fam.current(); if (c) this.fam.current.set({ ...c, animal: '' }); this.fam.show('pick'); }

  hearAgain(): void {
    const k = this.pick(); if (!k) return;
    const w = this.words.find(k); if (w?.ha_clip) this.bus.playRaw(w.ha_clip);
  }

  // ---- parent area
  removeKid(p: Profile): void { if (confirm('Remove ' + p.name + ' and their progress from this phone?')) this.fam.remove(p.id); }
}
