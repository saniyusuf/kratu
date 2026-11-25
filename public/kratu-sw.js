/*
 * Kratu's service worker (Sani 2026-11-24, the downloads design, point 1): Angular's own worker (the app, its scripts
 * and every clip and picture, with updates that fetch only what changed) plus the phone's background downloads of the
 * big model files. The app registers this file instead of ngsw-worker.js (src/app/app.config.ts).
 * Finished files go to Cache Storage 'kratu-bgf-1', where the loader picks them up (src/app/core/loader/pieces.ts).
 */
/*
 * Media asked for in byte ranges (Sani 2026-11-25, an iPhone recording: every Laila line was cut short after about a
 * second). Safari on an iPhone fetches a clip in pieces, first `Range: bytes=0-1`, then the rest, and needs each answer
 * to be exactly that piece (206, Content-Range). Angular's worker answers a range request with the whole cached file
 * (200), which the iPhone's player takes for a broken stream and stops early. Here a range request for a clip is
 * answered with the piece it asked for, cut from the same cached copy (so it works offline), or from the whole file
 * fetched without a range when it is not cached yet (Firebase cannot answer a range of its compressed stream). This
 * listener comes before Angular's, and keeps such requests to itself; everything else goes on to Angular's worker.
 */
const MEDIA = /\.(ogg|opus|mp3|m4a|aac|wav|webm|mp4)$/i;
self.addEventListener('fetch', (e) => {
  const RANGE = e.request.headers.get('range');
  if (!RANGE || e.request.method !== 'GET') return;
  const TARGET = new URL(e.request.url);
  if (TARGET.origin !== self.location.origin || !MEDIA.test(TARGET.pathname)) return;
  e.stopImmediatePropagation();
  e.respondWith(piece(e.request.url, RANGE));
});
async function piece(url, range) {
  let WHOLE = await caches.match(url);
  if (!WHOLE) WHOLE = await fetch(url, { credentials: 'same-origin' });
  if (!WHOLE.ok) return WHOLE;
  const BUF = await WHOLE.arrayBuffer(), N = BUF.byteLength, M = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  let a = 0, b = N - 1;
  if (M && M[1]) { a = +M[1]; if (M[2]) b = Math.min(+M[2], N - 1); }
  else if (M && M[2]) { a = Math.max(0, N - +M[2]); }   // the last n bytes
  if (!M || a >= N || a > b) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + N } });
  return new Response(BUF.slice(a, b + 1), { status: 206, statusText: 'Partial Content', headers: {
    'Content-Type': WHOLE.headers.get('Content-Type') || 'audio/ogg', 'Content-Range': 'bytes ' + a + '-' + b + '/' + N,
    'Content-Length': String(b - a + 1), 'Accept-Ranges': 'bytes' } });
}

importScripts('./ngsw-worker.js');

const BG_CACHE = 'kratu-bgf-1';

async function fileAway(reg) {
  const C = await caches.open(BG_CACHE);
  const RECS = await reg.matchAll();
  await Promise.all(RECS.map(async (R) => {
    try { const RES = await R.responseReady; if (RES && RES.ok) await C.put(R.request.url, RES); } catch (e) { /* that one comes in pieces instead */ }
  }));
}
async function tell(what, id) {
  const ALL = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  ALL.forEach((W) => W.postMessage({ kratuBgf: what, id }));
}

self.addEventListener('backgroundfetchsuccess', (e) => {
  e.waitUntil((async () => {
    await fileAway(e.registration);
    try { await e.updateUI({ title: 'Laila is ready' }); } catch (x) { /* the phone keeps its own wording */ }
    await tell('done', e.registration.id);
  })());
});
// failed or stopped: keep what did arrive; the loader fetches the rest in pieces the next time Kratu is open
self.addEventListener('backgroundfetchfail', (e) => { e.waitUntil(fileAway(e.registration).then(() => tell('fail', e.registration.id))); });
self.addEventListener('backgroundfetchabort', (e) => { e.waitUntil(tell('abort', e.registration.id)); });
self.addEventListener('backgroundfetchclick', (e) => {
  e.waitUntil((async () => {
    const WINS = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (WINS.length) return WINS[0].focus();
    return self.clients.openWindow('./');
  })());
});
