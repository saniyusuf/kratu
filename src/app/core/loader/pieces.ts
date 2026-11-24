/**
 * The big downloads, piece by piece (Sani 2026-11-24, the downloads design, points 2 to 4 and 7).
 *
 * - Every model file comes in 1 MB pieces and each piece is saved the moment it arrives, so a closed tab, a dead battery
 *   or a lost signal costs at most one piece: the next open carries on from the last one. The pieces are part files cut
 *   at build (scripts/models.mjs: <file>.parts/000.bin …), each fetched whole. Not HTTP Range: a server that compresses
 *   on the fly (Firebase with brotli, the dev server with gzip) answers a range with a slice of its compressed stream,
 *   which the browser cannot decode (ERR_CONTENT_DECODING_FAILED, Sani's phone, 24 Nov).
 * - No internet: the download waits and carries on by itself when the phone is back online (it never fails on the
 *   network). `wake()` (Try again) ends a wait at once.
 * - Every file is kept under its fingerprint (the sha256 in its manifest, written by scripts/models.mjs at every build):
 *   an update fetches only the files whose fingerprint changed, the old copy stays until the new one is fully in, and
 *   is then removed. Offline with an old copy at hand, the old copy is used and the new one comes next time.
 * - A file the phone fetched in the background (Background Fetch, see kratu-sw.js) is picked up from its cache.
 * - Progress counts the bytes as they travel (the packed size of a .gz file), against totals in the same unit, so the
 *   percent is exact.
 */

/** Finished files, inflated, under their fingerprint. */
export const MODELS_CACHE = 'kratu-models-1';
/** Pieces of files still coming. */
export const PIECES_CACHE = 'kratu-pieces-1';
/** Files the phone fetched in the background (kratu-sw.js puts them here). */
export const BG_CACHE = 'kratu-bgf-1';
const PIECE = 1 << 20;
const STALL_MS = 30000;
const GZ_MAGIC = (B: Uint8Array) => B.length > 2 && B[0] === 0x1f && B[1] === 0x8b;

/** One file to fetch. `bytes` is what travels (the .gz size for a packed file), `raw` what it is once inflated. */
export interface FileSpec { url: string; bytes: number; raw: number; gz: boolean; sha?: string; parts?: number; }

/** What a download tells the screen. */
export interface NetHooks {
  /** true: no internet, waiting for it; false: moving again. */
  waiting?(on: boolean): void;
  /** A half-done download was picked up where it stopped. */
  resumed?(): void;
}

const ABS = (URL_: string) => new URL(URL_, document.baseURI).href;
/** The cache key of a file: its address and fingerprint (a file with no fingerprint keeps its bare address). */
export const keyOf = (F: FileSpec) => ABS(F.url) + (F.sha ? '?v=' + F.sha.slice(0, 16) : '');
const pieceKey = (F: FileSpec, I: number) => keyOf(F) + (F.sha ? '&' : '?') + 'piece=' + I;
const openCache = async (NAME: string): Promise<Cache | null> => { try { return typeof caches === 'undefined' ? null : await caches.open(NAME); } catch { return null; } };
/** The same file, any version: the address without its fingerprint, and without .gz (the school's models were unpacked until 24 Nov). */
const samePath = (A: string, B: string) => A.split('?')[0].replace(/\.gz$/, '') === B.split('?')[0].replace(/\.gz$/, '');

// ---- waiting for the internet: every waiter wakes on 'online', on Try again, or after a while to look again
let wakers: (() => void)[] = [];
/** Try again: every download waiting for the internet looks again now. */
export function wake(): void { const W = wakers; wakers = []; W.forEach((F) => F()); }
if (typeof window !== 'undefined') window.addEventListener('online', () => wake());
function waitForNet(MS: number): Promise<void> {
  return new Promise((RES) => { let DONE = false; const GO = () => { if (DONE) return; DONE = true; RES(); }; wakers.push(GO); setTimeout(GO, MS); });
}

/** A failure the network caused (no connection, a stalled stream), as opposed to a missing or broken file. */
class NetError extends Error {}

async function sha256Hex(BUF: ArrayBuffer): Promise<string | null> {
  try { if (!crypto?.subtle) return null; const H = await crypto.subtle.digest('SHA-256', BUF); return [...new Uint8Array(H)].map((B) => B.toString(16).padStart(2, '0')).join(''); }
  catch { return null; }
}
async function inflate(BUF: ArrayBuffer): Promise<ArrayBuffer> {
  if (!GZ_MAGIC(new Uint8Array(BUF, 0, Math.min(4, BUF.byteLength))) || typeof DecompressionStream === 'undefined') return BUF;
  return new Response(new Blob([BUF]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
}

/** One file fetched whole (a part file, or a whole model), with a stall guard; reports the bytes as they arrive. */
async function fetchWhole(URL_: string, onp: (got: number) => void): Promise<Uint8Array> {
  const AC = new AbortController(); let last = Date.now();
  const STALL = setInterval(() => { if (Date.now() - last > STALL_MS) { clearInterval(STALL); AC.abort(); } }, 1000);
  try {
    let R: Response;
    try { R = await fetch(URL_, { cache: 'no-store', signal: AC.signal }); }
    catch (e: any) { throw new NetError(e?.name === 'AbortError' ? 'stalled' : 'no connection'); }
    // a cut line comes back from Angular's service worker as a 504 (it never rejects), and a busy server as a 5xx: both
    // are the network, waited out like no connection; a 404 is a missing file
    if (R.status >= 500 || R.status === 0) throw new NetError('server ' + R.status);
    if (!R.ok) throw new Error(URL_.split('?')[0] + ' ' + R.status);
    const RD = R.body?.getReader(); const CHUNKS: Uint8Array[] = []; let GOT = 0;
    try {
      if (!RD) { const B = new Uint8Array(await R.arrayBuffer()); CHUNKS.push(B); GOT = B.length; }
      else for (;;) { const X = await RD.read(); if (X.done) break; last = Date.now(); CHUNKS.push(X.value); GOT += X.value.length; onp(GOT); }
    } catch (e: any) { throw new NetError(e?.name === 'AbortError' ? 'stalled' : 'connection dropped'); }
    const OUT = new Uint8Array(GOT); let AT = 0; for (const C of CHUNKS) { OUT.set(C, AT); AT += C.length; }
    return OUT;
  } finally { clearInterval(STALL); }
}

/** The finished file, if this phone already holds this version of it. */
export async function held(F: FileSpec): Promise<ArrayBuffer | null> {
  const C = await openCache(MODELS_CACHE); if (!C) return null;
  try { const HIT = await C.match(keyOf(F)); if (!HIT) return null; const B = await HIT.arrayBuffer(); if (B.byteLength === F.raw) return B; await C.delete(keyOf(F)); } catch { /* ignore */ }
  return null;
}
/**
 * A copy kept before fingerprints (24 Nov): under its bare address, and for the school's models under the unpacked name
 * (.onnx, before .onnx.gz). The old loader kept them on the same size check; a copy of the right size is moved under its
 * fingerprint instead of being downloaded again, so the tablets in the field do not fetch everything after this update.
 */
async function adoptLegacy(F: FileSpec): Promise<ArrayBuffer | null> {
  if (!F.sha) return null;
  const C = await openCache(MODELS_CACHE); if (!C) return null;
  for (const OLD of [ABS(F.url), ABS(F.url.replace(/\.gz$/, ''))]) {
    try {
      const HIT = await C.match(OLD); if (!HIT) continue;
      const B = await HIT.arrayBuffer();
      if (B.byteLength !== F.raw) continue;
      await C.put(keyOf(F), new Response(B.slice(0), { headers: { 'content-type': 'application/octet-stream' } }));
      await C.delete(OLD);
      return B;
    } catch { /* ignore */ }
  }
  return null;
}
/** Another version of the same file (an earlier fingerprint, or from before fingerprints): used only when offline. */
async function oldCopy(F: FileSpec): Promise<ArrayBuffer | null> {
  const C = await openCache(MODELS_CACHE); if (!C) return null;
  try { for (const R of await C.keys()) if (samePath(R.url, ABS(F.url)) && R.url !== keyOf(F)) { const HIT = await C.match(R); if (HIT) return HIT.arrayBuffer(); } } catch { /* ignore */ }
  return null;
}
async function dropOld(F: FileSpec): Promise<void> {
  const C = await openCache(MODELS_CACHE); if (!C) return;
  try { for (const R of await C.keys()) if (samePath(R.url, ABS(F.url)) && R.url !== keyOf(F)) await C.delete(R); } catch { /* ignore */ }
}
async function dropPieces(F: FileSpec): Promise<void> {
  const C = await openCache(PIECES_CACHE); if (!C) return;
  try { for (const R of await C.keys()) if (samePath(R.url, ABS(F.url))) await C.delete(R); } catch { /* ignore */ }
}

/** The file as the phone fetched it in the background, if it did. */
async function fromBackground(F: FileSpec): Promise<ArrayBuffer | null> {
  const C = await openCache(BG_CACHE); if (!C) return null;
  try { const HIT = await C.match(keyOf(F)); if (!HIT) return null; const B = await HIT.arrayBuffer(); await C.delete(keyOf(F)); return B.byteLength === F.bytes || (F.gz && B.byteLength === F.raw) ? B : null; } catch { return null; }
}

/** Has this phone already got part of this file? (for "Carrying on where we stopped") */
export async function partly(F: FileSpec): Promise<boolean> {
  const C = await openCache(PIECES_CACHE); if (!C) return false;
  try { return !!(await C.match(pieceKey(F, 0))); } catch { return false; }
}

/**
 * The file's bytes as travelled, part by part. Parts already saved are not fetched again. Waits through a lost
 * connection. `onp(got)` counts travelled bytes of this file. A list with no parts (an older build) fetches the file
 * whole; a server that unpacked the .gz on the way (Content-Encoding: gzip) hands back the inflated file: `inflated`.
 */
async function travel(F: FileSpec, onp: (got: number) => void, hooks: NetHooks, OLD: () => Promise<ArrayBuffer | null>): Promise<{ buf: ArrayBuffer; inflated: boolean } | 'old'> {
  const C = await openCache(PIECES_CACHE), V = F.sha ? '?v=' + F.sha.slice(0, 16) : '';
  const N = F.parts && F.parts > 0 ? F.parts : 0;
  const SIZE = (I: number) => Math.min(PIECE, F.bytes - I * PIECE);
  let fails = 0, waitingNow = false;
  const SET_WAIT = (ON: boolean) => { if (ON !== waitingNow) { waitingNow = ON; hooks.waiting?.(ON); } };
  /** One fetch, retried through a lost connection; 'old' when offline with an earlier version at hand. */
  const GET = async (URL_: string, onp1: (g: number) => void): Promise<Uint8Array | 'old'> => {
    for (;;) {
      try { const B = await fetchWhole(URL_, onp1); fails = 0; SET_WAIT(false); return B; }
      catch (e) {
        if (!(e instanceof NetError)) throw e;
        fails++;
        // offline with an earlier version of the file at hand: use it now, fetch the new one next time
        if (fails >= 2 || !navigator.onLine) { const O = await OLD(); if (O) { SET_WAIT(false); return 'old'; } }
        if (fails >= 2 || !navigator.onLine) SET_WAIT(true);
        await waitForNet(navigator.onLine ? Math.min(30000, 2000 * fails) : 60000);
      }
    }
  };
  if (!N) {
    const B = await GET(ABS(F.url) + V, onp); if (B === 'old') return 'old';
    if (B.length === F.bytes) return { buf: B.buffer as ArrayBuffer, inflated: false };
    if (F.gz && B.length === F.raw && !GZ_MAGIC(B)) return { buf: B.buffer as ArrayBuffer, inflated: true };
    throw new Error(F.url + ' short: ' + B.length + ' of ' + F.bytes + ' bytes');
  }
  const PIECES: (Uint8Array | null)[] = new Array(N).fill(null);
  let have = 0;
  if (C) for (let I = 0; I < N; I++) { try { const HIT = await C.match(pieceKey(F, I)); if (HIT) { const B = new Uint8Array(await HIT.arrayBuffer()); if (B.length === SIZE(I)) { PIECES[I] = B; have += B.length; } } } catch { /* ignore */ } }
  if (have > 0 && have < F.bytes) hooks.resumed?.();
  onp(have);
  for (let I = 0; I < N; I++) {
    if (PIECES[I]) continue;
    const B = await GET(ABS(F.url) + '.parts/' + String(I).padStart(3, '0') + '.bin' + V, (G) => onp(have + G));
    if (B === 'old') return 'old';
    if (B.length !== SIZE(I)) throw new Error(F.url + ' part ' + I + ': ' + B.length + ' of ' + SIZE(I) + ' bytes');
    PIECES[I] = B; have += B.length; onp(have);
    if (C) await C.put(pieceKey(F, I), new Response(B.slice())).catch(() => undefined);
  }
  const OUT = new Uint8Array(F.bytes); let AT = 0; for (const P of PIECES) { OUT.set(P!, AT); AT += P!.length; }
  return { buf: OUT.buffer, inflated: false };
}

/**
 * One model file, ready to use (inflated). Order: this version already held → fetched in the background → pieces.
 * A file that fails its fingerprint is fetched again once from scratch.
 */
export async function getFile(F: FileSpec, onp: (got: number) => void, hooks: NetHooks = {}): Promise<ArrayBuffer> {
  const HELD = (await held(F)) || (await adoptLegacy(F)); if (HELD) { onp(F.bytes); return HELD; }
  let OLD_BUF: ArrayBuffer | null | undefined;
  const OLD = async () => (OLD_BUF === undefined ? (OLD_BUF = await oldCopy(F)) : OLD_BUF);
  for (let TRY = 0; ; TRY++) {
    let SERVED = await fromBackground(F), INFLATED = false;
    if (SERVED) { onp(F.bytes); if (F.gz && SERVED.byteLength === F.raw && !GZ_MAGIC(new Uint8Array(SERVED, 0, 4))) INFLATED = true; }
    else {
      const T = await travel(F, onp, hooks, OLD);
      if (T === 'old') return (await OLD())!;
      SERVED = T.buf; INFLATED = T.inflated;
    }
    if (F.sha && !INFLATED) {
      const H = await sha256Hex(SERVED);
      if (H && H !== F.sha) { await dropPieces(F); if (TRY >= 1) throw new Error(F.url + ': fingerprint does not match'); onp(0); continue; }
    }
    const BUF = F.gz && !INFLATED ? await inflate(SERVED) : SERVED;
    if (F.raw && BUF.byteLength !== F.raw) { await dropPieces(F); if (TRY >= 1) throw new Error(F.url + ' short: ' + BUF.byteLength + ' of ' + F.raw + ' bytes'); onp(0); continue; }
    const C = await openCache(MODELS_CACHE);
    if (C) { try { await C.put(keyOf(F), new Response(BUF.slice(0), { headers: { 'content-type': 'application/octet-stream' } })); } catch { /* quota */ } }
    await dropOld(F); await dropPieces(F);
    return BUF;
  }
}
