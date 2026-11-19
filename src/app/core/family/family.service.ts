import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AudioBus } from '../audio/audio-bus.service';
import { SessionService, Gender } from '../state/session.service';

/** A child's profile on this phone (Sani 2026-11-18): an animal and a typed first name, never a face or a voice. */
export interface Profile { id: string; name: string; g: Gender; animal: string; at: number; }

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
export type FamScreen = 'welcome' | 'mic' | 'setup' | 'add' | 'yours' | 'profiles' | 'pin' | 'parent' | null;

const K_PROFILES = 'kratu_fam_profiles', K_PIN = 'kratu_fam_pin', K_STARTED = 'kratu_fam_started';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  private readonly router = inject(Router);
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);

  readonly screen = signal<FamScreen>(null);
  readonly profiles = signal<Profile[]>(this.read());
  /** The profile being shown on "this is your animal". */
  readonly current = signal<Profile | null>(null);
  /** Where the PIN box leads once the right PIN is in. */
  pinNext: FamScreen = 'parent';
  /** Set by the shell when the loader has finished: screens after the microphone wait for it. */
  private loaded!: Promise<void>;
  private wasAdding = false;

  // ---- storage: this phone only for now; the parent account and its sync come with the server (design page, box 6)
  private read(): Profile[] { try { return JSON.parse(localStorage.getItem(K_PROFILES) || '[]'); } catch { return []; } }
  private write(list: Profile[]): void { this.profiles.set(list); try { localStorage.setItem(K_PROFILES, JSON.stringify(list)); } catch { /* private mode */ } }
  hasPin(): boolean { try { return !!localStorage.getItem(K_PIN); } catch { return false; } }
  async setPin(pin: string): Promise<void> { try { localStorage.setItem(K_PIN, await this.hash(pin)); } catch { /* private mode */ } }
  async checkPin(pin: string): Promise<boolean> { try { return localStorage.getItem(K_PIN) === await this.hash(pin); } catch { return false; } }
  private async hash(pin: string): Promise<string> {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kratu-family:' + pin));
    return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  taken(): string[] { return this.profiles().map((p) => p.animal); }
  add(name: string, g: Gender, a: string): Profile {
    const p: Profile = { id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: name.trim(), g, animal: a, at: Date.now() };
    this.write([...this.profiles(), p]); return p;
  }
  remove(id: string): void {
    this.write(this.profiles().filter((p) => p.id !== id));
    // the child's own rows on this phone go with them
    try { for (const k of Object.keys(localStorage)) if (k.endsWith('_' + id) || k.includes('_' + id + '_')) localStorage.removeItem(k); } catch { /* ignore */ }
  }

  /** Mic only: the family build never opens the camera. */
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
    let started = false; try { started = localStorage.getItem(K_STARTED) === '1'; } catch { /* ignore */ }
    if (!started && !this.profiles().length) { this.show('welcome'); return; }
    await this.loaded;
    if (!(await this.micGranted())) { this.show('mic'); return; }
    this.afterSetup();
  }
  /** Welcome page: Start. */
  start(): void { try { localStorage.setItem(K_STARTED, '1'); } catch { /* ignore */ } this.micThen(); }
  private async micThen(): Promise<void> { if (await this.micGranted()) this.afterMic(); else this.show('mic'); }
  /** The microphone screen is done (allowed or not: refused means the touch versions of speaking). */
  async afterMic(): Promise<void> {
    this.show(null);   // the loader shows through while it is still working
    await this.loaded;
    if (!this.hasPin()) { this.show('setup'); return; }
    this.afterSetup();
  }
  afterSetup(): void { if (!this.profiles().length) this.startAdd(); else this.toProfiles(); }
  startAdd(): void { this.wasAdding = true; this.show('add'); }
  /** The wizard's last press: the profile is saved and shown big. */
  added(p: Profile): void { this.current.set(p); this.show('yours'); }
  toProfiles(): void { this.bus.stopAll(); this.session.end(); this.session.guest.set(false); this.show('profiles'); this.router.navigateByUrl('/blank', { skipLocationChange: true }); }
  askPin(next: FamScreen): void { this.pinNext = next; this.show('pin'); }

  /** A child picked their card: straight to Laila's welcome back (Sani 2026-11-18: no name card in between), then home. */
  choose(p: Profile): void { this.signIn(p); this.current.set(p); this.backGo(); }
  /** After "this is your animal": Meet Laila, then the first-day welcome, then home. */
  firstGo(): void {
    const p = this.current(); if (!p) return;
    this.signIn(p); this.session.known.set(false); this.show(null); this.router.navigate(['/laila']);
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
