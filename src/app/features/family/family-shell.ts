import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { WordsService } from '../../core/clips/words.service';
import { ANIMALS, FamilyService, Profile, animal } from '../../core/family/family.service';
import { Gender, SessionService } from '../../core/state/session.service';
import { Laila } from '../../shared/laila/laila';
import { DOOR_SVG, EAR_SVG } from '../../shared/svg';

/**
 * The family build's own screens (Sani 2026-11-18), from the design page: Kratu opening from a link, the microphone
 * the friendly way, the parent's PIN, the add-a-child wizard whose profile card fills in as it is answered, the
 * finished profile, the children's profiles Netflix style (with Guest), welcome back and the parent area.
 * Unlike the lessons they follow the phone: upright and sideways each have their own layout. Written words lead with
 * English for the parent; Laila's spoken lines stay Hausa. Lines the design page still waits on (f_pick, f_yours,
 * f_who, f_mic) are not guessed: Laila is silent there until Sani writes them.
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

  // ---- the add-a-child wizard: nothing is saved until "Ci gaba" on the finished profile
  readonly g = signal<Gender | null>(null);
  readonly name = signal('');
  readonly pick = signal<string | null>(null);
  readonly part = computed(() => (!this.g() ? 1 : !this.name().trim() ? 2 : 3));
  readonly taken = computed(() => this.fam.taken());

  // ---- PIN boxes (setup and the parent area)
  readonly pin = signal('');
  readonly pinMsg = signal('');
  readonly KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  readonly micBusy = signal(false);
  readonly micMsg = signal('');
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // each screen's opening: what Laila says there (only lines that exist), and a clean slate for the forms
    effect(() => {
      const s = this.fam.screen();
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      this.pin.set(''); this.pinMsg.set(''); this.micMsg.set('');
      if (s === 'add') { this.g.set(null); this.name.set(''); this.pick.set(null); }
      if (s === 'back') this.sayBack();
    });
  }
  ngOnDestroy(): void { if (this.timer) clearTimeout(this.timer); }

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

  // ---- PIN
  key(k: string): void {
    if (!k) return;
    if (k === '⌫') { this.pin.update((p) => p.slice(0, -1)); return; }
    if (this.pin().length >= 4) return;
    this.pin.update((p) => p + k); this.pinMsg.set('');
    if (this.pin().length === 4 && this.fam.screen() === 'pin') this.checkPin();
  }
  async savePin(): Promise<void> {
    if (this.pin().length !== 4) { this.pinMsg.set('Four numbers, please.'); return; }
    await this.fam.setPin(this.pin()); this.fam.afterSetup();
  }
  private async checkPin(): Promise<void> {
    if (await this.fam.checkPin(this.pin())) { this.fam.show(this.fam.pinNext); return; }
    this.pinMsg.set('That PIN is not right. Try again.'); this.pin.set('');
  }

  // ---- the wizard
  setG(g: Gender): void { this.g.set(g); }
  setName(v: string): void { this.name.set(v.replace(/\s+/g, ' ').slice(0, 24)); }
  choose(k: string): void {
    if (this.taken().includes(k) || !this.g() || !this.name().trim()) return;
    this.pick.set(k);
    const w = this.words.find(k); if (w?.ha_clip) this.bus.playRaw(w.ha_clip);   // Laila says the animal's name, the clip the animals lesson uses
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fam.current.set({ id: '', name: this.name().trim(), g: this.g()!, animal: k, at: 0 });
      this.fam.show('yours');
    }, 1100);
  }
  /** "Ci gaba" on the finished profile: only now is the child saved (an abandoned wizard leaves nothing). */
  saveProfile(): void {
    const d = this.fam.current(); if (!d) return;
    const p = this.fam.add(d.name, d.g, d.animal); this.fam.current.set(p); this.fam.firstGo();
  }
  backToWizard(): void {
    const d = this.fam.current(); this.fam.show('add');
    if (d) { this.g.set(d.g); this.name.set(d.name); this.pick.set(null); }
  }

  // ---- welcome back: "Barka da dawowa!" (s_back), then home
  private async sayBack(): Promise<void> {
    const p = this.fam.current();
    const ok = await this.bus.play(this.bus.gk('s_back'));
    if (this.fam.screen() !== 'back' || this.fam.current() !== p) return;
    this.timer = setTimeout(() => { if (this.fam.screen() === 'back') this.fam.backGo(); }, ok ? 400 : 1600);
  }
  hearAgain(): void {
    const s = this.fam.screen();
    if (s === 'back') { this.bus.play(this.bus.gk('s_back')); return; }
    const k = this.pick() || this.fam.current()?.animal; if (!k) return;
    const w = this.words.find(k); if (w?.ha_clip) this.bus.playRaw(w.ha_clip);
  }

  // ---- parent area
  removeKid(p: Profile): void { if (confirm('Remove ' + p.name + ' and their progress from this phone?')) this.fam.remove(p.id); }
}
