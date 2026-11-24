import { FileSpec, BG_CACHE, held, keyOf } from './pieces';

/**
 * The phone takes over the download (Sani 2026-11-24, the downloads design, point 1): on Android Chrome the big files
 * are handed to Background Fetch, so closing the tab, locking the screen or switching apps no longer stops them. The
 * phone shows its own progress ("Getting Laila ready"); kratu-sw.js keeps each finished file in `kratu-bgf-1`, says
 * "Laila is ready" and opens Kratu on a tap. `getFile()` (pieces.ts) picks the files up from there.
 * Where it is missing (iPhone, desktop browsers, no service worker yet) nothing happens here and the pieces do the job.
 */
/** A background download that has not moved for this long while online is stopped, and the pieces take over. */
const STILL_MS = 20000;

type BgReg = EventTarget & { id: string; result: '' | 'success' | 'failure'; failureReason: string; downloaded: number; downloadTotal: number; abort(): Promise<boolean> };
type BgMgr = { fetch(id: string, reqs: string[], o: Record<string, unknown>): Promise<BgReg>; get(id: string): Promise<BgReg | undefined> };

async function manager(): Promise<BgMgr | null> {
  try {
    if (typeof window === 'undefined' || !('BackgroundFetchManager' in window) || !navigator.serviceWorker?.controller) return null;
    const REG = await navigator.serviceWorker.ready;
    return ((REG as unknown as { backgroundFetch?: BgMgr }).backgroundFetch) || null;
  } catch { return null; }
}

/**
 * Hand the files this phone does not hold yet to the phone. One job per `id` at a time; a job already running (the tab
 * was closed and opened again) is joined, not started twice. Returns the running job, or null where it is not available.
 */
export async function handOver(id: string, files: FileSpec[], title: string): Promise<BgReg | null> {
  const M = await manager(); if (!M) return null;
  try {
    const RUNNING = await M.get(id); if (RUNNING && RUNNING.result === '') return RUNNING;
    const C = await caches.open(BG_CACHE);
    const NEED: FileSpec[] = [];
    for (const F of files) if (!(await held(F)) && !(await C.match(keyOf(F)))) NEED.push(F);
    if (!NEED.length) return null;
    return await M.fetch(id, NEED.map((F) => keyOf(F)), {
      title, downloadTotal: NEED.reduce((A, F) => A + F.bytes, 0),
      icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    });
  } catch (e) { console.warn('[kratu] background download not started', String(e)); return null; }
}

/**
 * While the phone's job runs, the page waits for it instead of fetching the same bytes again. Resolves when the job
 * has finished (its files are then in `kratu-bgf-1`, or, if it failed, the pieces take over). `onp` gets the job's
 * downloaded bytes.
 */
export function follow(job: BgReg, onp: (downloaded: number) => void): Promise<void> {
  return new Promise((RES) => {
    let DONE = false, LAST = job.downloaded, MOVED = Date.now();
    const END = () => { if (DONE) return; DONE = true; job.removeEventListener('progress', TICK); clearInterval(POLL); setTimeout(RES, 400); };
    const TICK = () => {
      if (job.downloaded !== LAST) { LAST = job.downloaded; MOVED = Date.now(); }
      onp(job.downloaded); if (job.result !== '') { END(); return; }
      // the phone is online but its download does not move (some browsers queue it, or never start it): stop it and
      // let the pieces do the job, so the screen never waits on it for ever
      if (navigator.onLine && Date.now() - MOVED > STILL_MS) { console.warn('[kratu] background download not moving, using pieces'); job.abort().catch(() => undefined); END(); }
    };
    job.addEventListener('progress', TICK);
    // the service worker files the results after 'success': give it a moment, and look now and then in case an event is missed
    const POLL = setInterval(TICK, 1500);
    TICK();
  });
}
