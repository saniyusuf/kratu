/*
 * Kratu's service worker (Sani 2026-11-24, the downloads design, point 1): Angular's own worker (the app, its scripts
 * and every clip and picture, with updates that fetch only what changed) plus the phone's background downloads of the
 * big model files. The app registers this file instead of ngsw-worker.js (src/app/app.config.ts).
 * Finished files go to Cache Storage 'kratu-bgf-1', where the loader picks them up (src/app/core/loader/pieces.ts).
 */
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
