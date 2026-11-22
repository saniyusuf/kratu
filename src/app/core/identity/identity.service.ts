import { Injectable, signal } from '@angular/core';

/** A child's record in the identity store: vectors, never a photo. */
export interface Person {
  id: string; name: string; key?: string; gender?: 'm' | 'f';
  /** the two sets together, worked out in memory, never stored */
  faceVecs: Float32Array[];
  /** from enrolment, never replaced */
  enrollFaceVecs?: Float32Array[];
  /** the latest few sittings, refreshed on a confident recognition */
  recentFaceVecs?: Float32Array[];
  faceAt?: number;
  voiceVec: Float32Array | null; clip?: string; at?: number; modelVer?: string;
}
export interface MatchResult { person: Person | null; decision: 'accept' | 'maybe' | 'reject'; face: number; second: number; margin: number; voice: number | null; name: boolean; fused: number; reasons: string[]; }
export interface FrameResult { ok: boolean; faces: number; emb?: Float32Array; score?: number; box?: { x: number; y: number; width: number; height: number }; boxVideo?: { x: number; y: number; width: number; height: number }; quality?: { ok: boolean; reasons: string[] }; ms?: number; error?: string; }

interface KratuIDApi {
  isReady: boolean; ep: string | null; version?: string; recName?: string;
  init(o?: { blobs?: Record<string, ArrayBuffer | ArrayBuffer[]>; kinds?: Record<string, unknown>; cfg?: Record<string, unknown> }): Promise<{ ep: string; version: string; rec?: string }>;
  watch(video: HTMLVideoElement, cb: (r: FrameResult) => void): void; unwatch(): void;
  voiceEmbed(pcm: Float32Array): Promise<Float32Array | null>; pcmFromBlob(blob: Blob): Promise<Float32Array>;
  match(q: { faceVecs?: Float32Array[]; voiceVec?: Float32Array | null; nameKey?: string | null }): MatchResult;
  store: { load(): Promise<Person[]>; all(): Person[]; upsert(rec: Partial<Person> & { name: string }): Promise<Person>; refresh(id: string, vecs: Float32Array[], match: MatchResult): Promise<boolean>; remove(id: string): Promise<void>; clear(): Promise<void>; };
}
declare global { interface Window { KratuID?: KratuIDApi; } }

/**
 * The identity engine (kratu-id.js + its worker): face detector, face recogniser, speaker model, encrypted store.
 * Loaded from index.html as it always was; this service is the typed door to it.
 */
@Injectable({ providedIn: 'root' })
export class IdentityService {
  readonly ready = signal(false);
  readonly ep = signal<string | null>(null);
  readonly model = signal<string | null>(null);

  get api(): KratuIDApi | undefined { return window.KratuID; }
  present(): boolean { return !!window.KratuID; }

  /** `kinds` and `cfg` come from models/manifest.json: the family build names its own models (YuNet + SFace) and their
   *  thresholds there; the school manifest has neither, so the school engine runs exactly as before. */
  async init(blobs?: Record<string, ArrayBuffer | ArrayBuffer[]>, kinds?: Record<string, unknown>, cfg?: Record<string, unknown>): Promise<void> {
    const k = window.KratuID;
    if (!k) throw new Error('no identity engine on this page');
    const r = await k.init({ ...(blobs ? { blobs } : {}), ...(kinds ? { kinds } : {}), ...(cfg ? { cfg } : {}) });
    await k.store.load();
    this.ready.set(true); this.ep.set(r.ep); this.model.set(k.recName ?? r.rec ?? (r.version || '').split('+')[1] ?? null);
  }
  people(): Person[] { return this.api?.store.all() ?? []; }
}
