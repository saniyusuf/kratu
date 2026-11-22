import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AudioBus } from '../audio/audio-bus.service';
import { SessionService, Gender } from '../state/session.service';
import { IdentityService } from '../identity/identity.service';
import { LoaderService } from '../loader/loader.service';

/** A child's profile on this phone (Sani 2026-11-18): an animal and a typed first name. Since 22 Nov the child can also
 *  sign in by face: `face` says their face prints are in the identity store under this same id (never a photo). */
export interface Profile { id: string; name: string; g: Gender; animal: string; at: number; face?: boolean; }

/**
 * How a child signs in (Sani 2026-11-22). 'A': the phone opens the camera and recognises the child; the cards are only
 * the fallback (unsure, camera refused, a child with no face prints). 'B': the cards first, and the face only confirms
 * the card the child tapped. One switch.
 */
export const FACE_FLOW: 'A' | 'B' = 'A';

/** The parent's account (Sani 2026-11-21, "for now"): an email, a phone number and a 6-digit code the parent sets
 *  (typed twice). Manage profiles asks for that code; adding a child needs nothing. Later the code will be sent to the
 *  email or phone instead. Only the code's hash is kept. */
/** The parent's account, on this phone only. `name` came on 22 Nov (Sani: full name first), so older saved accounts have none. */
export interface Account { name?: string; email: string; phone: string; code: string; at: number;
  /** When the parent agreed to face sign-in (Sani 2026-11-22, Nigeria's data law: a parent's consent before a child's
   *  face print is made). Unset: never asked or not yet agreed. */
  faceOk?: number; }

/**
 * The animals a child can choose (the design page of 17 Nov, with Sani's keeps): each is already a word in the lessons
 * with a Hausa clip, so Laila can say a child's animal with no new recording. No birds (they could be taken for Laila),
 * no owls, monkeys, donkeys, chameleons, dogs, pigs, hyenas or pests.
 */
export const ANIMALS: { k: string; e: string; c: string }[] = [
  { k: 'lion', e: '🦁', c: '#FFE3A3' }, { k: 'elephant', e: '🐘', c: '#DCE7F5' }, { k: 'giraffe', e: '🦒', c: '#FCE6C4' },
  { k: 'camel', e: '🐪', c: '#F5E0C8' }, { k: 'horse', e: '🐴', c: '#EAD9C8' }, { k: 'cow', e: '🐮', c: '#E6F2DF' },
  { k: 'ram', e: '🐏', c: '#EFEAE0' }, { k: 'goat', e: '🐐', c: '#E9EFD9' }, { k: 'rabbit', e: '🐰', c: '#F8DDE6' },
  { k: 'tortoise', e: '🐢', c: '#D9F0E2' }, { k: 'fish', e: '🐟', c: '#D6ECF7' }, { k: 'butterfly', e: '🦋', c: '#E5DDF5' },
  { k: 'frog', e: '🐸', c: '#DDF2D2' },
];
export const animal = (k: string) => ANIMALS.find((a) => a.k === k) ?? ANIMALS[0];

/** The family build's own screens, drawn over the app (both ways round, unlike the landscape lessons). */
export type FamScreen = 'welcome' | 'mic' | 'signin' | 'add' | 'consent' | 'face' | 'thanks' | 'profiles' | 'who' | 'check' | 'pick' | 'yours' | 'code' | 'parent' | null;

const K_PROFILES = 'kratu_fam_profiles', K_ACCOUNT = 'kratu_fam_account', K_STARTED = 'kratu_fam_started';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  private readonly router = inject(Router);
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly identity = inject(IdentityService);
  private readonly loader = inject(LoaderService);

  readonly screen = signal<FamScreen>(null);
  readonly profiles = signal<Profile[]>(this.read());
  /** The profile being shown on "this is your animal". */
  readonly current = signal<Profile | null>(null);
  /** The parent's account on this phone, once signed in. */
  readonly account = signal<Account | null>(this.readAccount());
  /** Set by the shell when the loader has finished: screens after the microphone wait for it. */
  private loaded!: Promise<void>;
  private wasAdding = false;
  /** Where the face step goes back to: the thank-you after enrolling, or the parent area ("Add face"). */
  faceBack: 'thanks' | 'parent' = 'thanks';
  /** Set when the camera could not decide (or was refused): the cards show instead of the camera until the next open. */
  private cardsNow = false;
  readonly FACE_FLOW = FACE_FLOW;
  /**
   * Try one step (Sani 2026-11-21: every step of the family app, played and heard on its own). `?step=<id>` opens that
   * real screen with sample children; nothing is saved on the phone (no profile, no PIN), so a parent's real profiles
   * are left exactly as they were. The steps page lists the ids.
   */
  readonly trying = new URLSearchParams(location.search).get('step');
  static readonly SAMPLES: Profile[] = [
    { id: 'try_musa', name: 'Musa', g: 'm', animal: 'lion', at: 0 },
    { id: 'try_aisha', name: 'Aisha', g: 'f', animal: 'rabbit', at: 0 },
  ];

  // ---- storage: this phone only for now; the parent account and its sync come with the server (design page, box 6)
  private read(): Profile[] { try { return JSON.parse(localStorage.getItem(K_PROFILES) || '[]'); } catch { return []; } }
  private write(list: Profile[]): void { this.profiles.set(list); if (this.trying) return; try { localStorage.setItem(K_PROFILES, JSON.stringify(list)); } catch { /* private mode */ } }
  private readAccount(): Account | null { try { return JSON.parse(localStorage.getItem(K_ACCOUNT) || 'null'); } catch { return null; } }
  private saveAccount(a: Account): void { this.account.set(a); if (this.trying) return; try { localStorage.setItem(K_ACCOUNT, JSON.stringify(a)); } catch { /* private mode */ } }

  async setAccount(name: string, email: string, phone: string, code: string): Promise<void> {
    this.saveAccount({ name: name.trim().replace(/\s+/g, ' '), email: email.trim(), phone: phone.trim(), code: await this.hash(code), at: Date.now() });
  }
  async checkCode(code: string): Promise<boolean> {
    if (this.trying) return /^\d{6}$/.test(code);
    const a = this.account(); return !!a && a.code === await this.hash(code);
  }
  private async hash(code: string): Promise<string> {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kratu-family:' + code));
    return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  taken(): string[] { return this.profiles().map((p) => p.animal).filter(Boolean); }
  /** The parent enrols a child with a name and boy or girl; the child chooses the animal on their first visit. */
  add(name: string, g: Gender): Profile {
    const p: Profile = { id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: name.trim(), g, animal: '', at: Date.now() };
    this.write([...this.profiles(), p]); return p;
  }
  setAnimal(id: string, a: string): Profile | null {
    const list = this.profiles().map((p) => (p.id === id ? { ...p, animal: a } : p));
    this.write(list); return list.find((p) => p.id === id) ?? null;
  }
  remove(id: string): void {
    this.write(this.profiles().filter((p) => p.id !== id));
    this.identity.api?.store.remove(id).catch(() => undefined);   // their face prints and name clip go too
    // the child's own rows on this phone go with them
    try { for (const k of Object.keys(localStorage)) if (k.endsWith('_' + id) || k.includes('_' + id + '_')) localStorage.removeItem(k); } catch { /* ignore */ }
  }

  setFace(id: string): void { this.write(this.profiles().map((p) => (p.id === id ? { ...p, face: true } : p))); }
  /** The microphone up front; the camera is asked for only at the face step, after the parent's consent. */
  async micGranted(): Promise<boolean> {
    let ok = false;
    try { if (navigator.permissions?.query) ok = (await navigator.permissions.query({ name: 'microphone' as PermissionName })).state === 'granted'; } catch { /* fall through */ }
    if (!ok) try { ok = localStorage.getItem('kratu_perms') === '1'; } catch { /* ignore */ }
    if (ok) this.session.perms.set({ camera: false, mic: true, at: Date.now() });
    return ok;
  }

  /**
   * The opening (app.ts calls it with the loader's promise). The very first open: the welcome page, the microphone, the
   * loader, the parent's PIN, then the first child. Every open after that: the profiles, Netflix style.
   */
  async begin(loaded: Promise<void>): Promise<void> {
    this.loaded = loaded;
    if (this.trying) { this.tryStep(this.trying); return; }
    let started = false; try { started = localStorage.getItem(K_STARTED) === '1'; } catch { /* ignore */ }
    if (!started && !this.profiles().length) { this.show('welcome'); return; }
    if (!this.account()) { this.show('signin'); return; }   // Register comes straight after Start (Sani 2026-11-22)
    if (this.account()?.faceOk) this.loader.loadFace();   // from Cache Storage after the first time: ready by the time the camera opens
    await this.loaded;
    if (!(await this.micGranted())) { this.show('mic'); return; }
    this.afterSetup();
  }
  /** `?step=` (see `trying`): straight to one real screen, with the sample children and nothing saved. */
  private async tryStep(step: string): Promise<void> {
    this.profiles.set(FamilyService.SAMPLES);
    const kid = step.endsWith('_f') ? FamilyService.SAMPLES[1] : FamilyService.SAMPLES[0];
    this.account.set({ name: 'Parent Example', phone: '0803 000 0000', email: 'parent@example.com', code: '', at: 0 });
    const id = step.replace(/_[mf]$/, '');
    if (id === 'welcome') { this.show('welcome'); return; }
    if (id === 'mic') { this.show('mic'); return; }
    await this.loaded;
    switch (id) {
      case 'signin': this.account.set(null); this.show('signin'); return;
      case 'add': this.profiles.set([]); this.startAdd(); return;
      case 'thanks': this.current.set(kid); this.show('thanks'); return;
      case 'consent': this.current.set(kid); this.account.set({ ...this.account()!, faceOk: undefined }); this.show('consent'); return;
      case 'face': this.current.set(kid); this.show('face'); return;
      case 'who': this.show('who'); return;
      case 'pick': this.profiles.set(FamilyService.SAMPLES.map((p) => ({ ...p, animal: '' }))); this.choose({ ...kid, animal: '' }); return;
      case 'yours': this.current.set(kid); this.show('yours'); return;
      case 'profiles': this.toProfiles(); return;
      case 'parent': this.manage(); return;
      case 'guest': this.guest(); return;
      case 'back': this.choose(kid); return;
      case 'laila': case 'first': this.current.set(kid); this.firstGo(); return;
      case 'home': this.signIn(kid); this.session.known.set(true); this.show(null); this.router.navigate(['/home']); return;
      default: this.toProfiles();
    }
  }
  /** Welcome page: Start. */
  start(): void {
    try { localStorage.setItem(K_STARTED, '1'); } catch { /* ignore */ }
    if (!this.account()) { this.show('signin'); return; }   // Start -> Register, the parent's sign-up (Sani 2026-11-22)
    this.micThen();
  }
  /** The parent has registered: then the microphone, the loader and the first child. */
  registered(): void { this.loader.loadFace(); this.micThen(); }   // the face models start now, while the parent carries on
  private async micThen(): Promise<void> { if (await this.micGranted()) this.afterMic(); else this.show('mic'); }
  /** The microphone screen is done (allowed or not: refused means the touch versions of speaking). */
  async afterMic(): Promise<void> {
    this.show(null);   // the loader shows through while it is still working
    await this.loaded;
    if (!this.account()) { this.show('signin'); return; }
    this.afterSetup();
  }
  afterSetup(): void { if (!this.profiles().length) this.startAdd(); else this.toProfiles(); }
  startAdd(): void { this.wasAdding = true; this.show('add'); }
  /** The parent's last press on "enrol a child": saved, then the child's face (after the consent, the first time),
   *  then thanked (the child picks the animal later). */
  added(p: Profile): void { this.current.set(p); this.toFace('thanks'); }
  /** The face step for the current child: consent first if the parent has not agreed yet. */
  toFace(back: 'thanks' | 'parent'): void { this.faceBack = back; this.show(this.account()?.faceOk ? 'face' : 'consent'); }
  consent(yes: boolean): void {
    const A = this.account();
    if (!yes || !A) { this.afterFace(); return; }
    this.saveAccount({ ...A, faceOk: Date.now() }); this.loader.loadFace(); this.show('face');
  }
  /** The face step is over (saved, skipped, or no camera): on to where it was opened from. */
  afterFace(enrolled = false): void {
    const C = this.current();
    if (enrolled && C) { this.setFace(C.id); this.current.set({ ...C, face: true }); }
    if (this.faceBack === 'parent') this.show('parent'); else this.show('thanks');
  }
  /** Children who can sign in by face. */
  private faces(): boolean { return !!this.account()?.faceOk && this.profiles().some((p) => p.face); }
  toProfiles(): void {
    this.bus.stopAll(); this.session.end(); this.session.guest.set(false);
    this.show(FACE_FLOW === 'A' && this.faces() && !this.cardsNow && !this.trying ? 'who' : 'profiles');
    this.router.navigateByUrl('/blank', { skipLocationChange: true });
  }
  /** The cards, now (the camera could not decide, was refused, or the child asked for the list). */
  toCards(): void { this.cardsNow = true; this.show('profiles'); }
  /** Back to the camera from the cards. */
  toCamera(): void { this.cardsNow = false; this.show('who'); }
  /** Option A: the camera recognised this child. */
  recognised(id: string): void { const P = this.profiles().find((x) => x.id === id); if (P) this.go(P); else this.toCards(); }
  canFace(): boolean { return this.faces(); }
  /** Manage profiles: the parent's code first (Sani 2026-11-21). */
  manage(): void { this.show('code'); }

  /**
   * A child picked their card. The first time (no animal yet) they choose their own animal and Laila welcomes them by
   * name; every time after, straight to Laila's welcome back (Sani 2026-11-18: no name card in between), then home.
   */
  choose(p: Profile): void {
    if (FACE_FLOW === 'B' && p.face && this.account()?.faceOk) { this.current.set(p); this.show('check'); return; }   // option B: the face confirms the card
    this.go(p);
  }
  /** Signed in (by face, by the card, or by the card confirmed by the face). */
  go(p: Profile): void {
    this.cardsNow = false;
    this.signIn(p); this.current.set(p);
    if (!p.animal) { this.show('pick'); return; }
    this.backGo();
  }
  /** After the welcome by name: Laila's first-day welcome, one screen (Sani 2026-11-21: Meet Laila and the first
   *  welcome merged), then home. */
  firstGo(): void {
    const p = this.current(); if (!p) return;
    this.signIn(p); this.session.known.set(false); this.show(null); this.router.navigate(['/welcome']);
  }
  /** After "welcome back": the welcome-back beats of the app's own welcome screen, then home. */
  backGo(): void { this.session.known.set(true); this.show(null); this.router.navigate(['/welcome']); }
  /** Guest (Sani 2026-11-18): anyone, everything open, nothing saved, gone when the session ends. */
  guest(): void {
    this.bus.stopAll(); this.session.end(); this.session.guest.set(true); this.session.setGender('m');
    this.session.name.set(null); this.session.personId.set(null); this.session.known.set(true);
    this.show(null); this.router.navigate(['/home']);
  }
  private signIn(p: Profile): void {
    this.session.end(); this.session.guest.set(false); this.session.setGender(p.g);
    this.session.name.set(p.name); this.session.personId.set(p.id);
  }
  show(s: FamScreen): void {
    this.bus.stopAll(); this.screen.set(s);
    document.documentElement.classList.toggle('fam-on', !!s);
    if (s !== 'add') this.wasAdding = false;
  }
}
