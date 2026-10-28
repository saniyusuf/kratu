/** The games' WebAudio contexts (drums, horns, hooves, clinks). Each game file keeps its own, made on its first sound;
 *  every one made here is closed when the game screen stops, so none keeps the audio device running silent after the
 *  child has left (a running context renders silence on its own thread for as long as it lives). A closed one is
 *  simply made afresh by the next sound. */
const open = new Set<AudioContext>();
export function liveAC(a: AudioContext | null | undefined): AudioContext {
  if (a && a.state !== 'closed') return a;
  const c: AudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
  open.add(c); return c;
}
export function closeAC(): void { open.forEach((c) => { try { c.close(); } catch { /* closed */ } }); open.clear(); }
