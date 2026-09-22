import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService } from '../../core/state/session.service';
import { ZoomService } from '../../core/zoom/zoom.service';

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const shuffle = <T,>(a: T[]): T[] => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** Does what the recogniser heard count as this word? The word inside the text, a plural, or one letter off for words of four or more. */
export function matchWord(raw: string, target: string): string | null {
  const txt = (raw || '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim(); target = target.toLowerCase();
  if (txt.includes(target)) return target;
  if (target.includes(' ')) target = target.split(' ').pop()!;   // "paw paw": the last word is enough
  const ed = (a: string, b: string) => { const m = a.length, n = b.length, d: number[][] = []; for (let x = 0; x <= m; x++) d[x] = [x]; for (let y = 0; y <= n; y++) d[0][y] = y; for (let x = 1; x <= m; x++) for (let y = 1; y <= n; y++) d[x][y] = Math.min(d[x - 1][y] + 1, d[x][y - 1] + 1, d[x - 1][y - 1] + (a[x - 1] === b[y - 1] ? 0 : 1)); return d[m][n]; };
  for (const tok of txt.split(' ')) { const t = tok.replace(/s$/, ''); if (t === target || (target.length >= 4 && ed(t, target) <= 1)) return target; }
  return null;
}

/**
 * The pointing hand and the yellow spot every lesson uses to show where to press. Positions are in the screen's own
 * layout pixels (the frame is zoomed), so rectangles go through ZoomService.rect().
 */
export class Spotter {
  private el: HTMLElement | null = null; private hand: HTMLElement | null = null;
  constructor(private readonly s: HTMLElement, private readonly zoom: ZoomService) {}
  unspot(): void { if (this.el) { this.el.classList.remove('spot2'); this.el = null; } if (this.hand) { this.hand.remove(); this.hand = null; } }
  spot(t: Element | null, where: 'above' | 'below' | 'left' | 'right'): void {
    this.unspot(); if (!t) return; this.el = t as HTMLElement; t.classList.add('spot2');
    const sR = this.zoom.rect(this.s), r = this.zoom.rect(t); const h = document.createElement('span'); h.className = 'spothand';
    let x = r.left + r.width / 2 - sR.left - 22, y: number;
    if (where === 'above') { h.textContent = '👇🏾'; y = r.top - sR.top - 34; }
    else if (where === 'below') { h.textContent = '👆🏾'; y = r.bottom - sR.top - 30; }
    else if (where === 'right') { h.textContent = '👈🏾'; x = r.right - sR.left + 6; y = r.top + r.height / 2 - sR.top - 22; }
    else { h.textContent = '👉🏾'; x = r.left - sR.left - 52; y = r.top + r.height / 2 - sR.top - 22; }
    h.style.left = x + 'px'; h.style.top = y + 'px'; this.s.appendChild(h); this.hand = h;
  }
}

/** The word the mic heard flies from Laila to where it belongs, one letter after another. */
export function flyText(zoom: ZoomService, s: HTMLElement, fromEl: Element, toEl: Element | null, text: string): Promise<void> {
  return new Promise((res) => {
    try {
      const sR = zoom.rect(s), a = zoom.rect(fromEl), b = zoom.rect(toEl || fromEl);
      const chars = String(text || '').toUpperCase().split(''); const n = chars.length; if (!n) { res(); return; }
      const tiny = n > 4, w = tiny ? 40 : 58, gap = 6; let done = 0, fired = false; const fin = () => { if (!fired) { fired = true; res(); } };
      const ax = a.left + a.width / 2 - sR.left, ay = a.top + a.height * 0.4 - sR.top, bx = b.left + b.width / 2 - sR.left, by = b.top + b.height / 2 - sR.top;
      chars.forEach((ch, i) => {
        const f = document.createElement('span'); f.className = 'flyletter' + (tiny ? ' tiny' : ''); f.textContent = ch; f.style.setProperty('--c', 'var(--green)');
        f.style.left = (ax - w / 2) + 'px'; f.style.top = (ay - 33) + 'px'; s.appendChild(f);
        const tx = (bx - ax) + (i - (n - 1) / 2) * (w + gap), ty = by - ay;
        setTimeout(() => { const an = f.animate([{ transform: 'translate(0,0) scale(.5)', opacity: .6 }, { transform: `translate(${tx * .5}px,${ty * .5 - 80}px) scale(1.15)`, opacity: 1, offset: .55 }, { transform: `translate(${tx}px,${ty}px) scale(1)`, opacity: 1 }, { transform: `translate(${tx}px,${ty}px) scale(1)`, opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.3,.8,.3,1)', fill: 'forwards' }); an.onfinish = () => { f.remove(); if (++done >= n) fin(); }; }, i * 110);
      });
      setTimeout(() => { s.querySelectorAll('.flyletter').forEach((x) => x.remove()); fin(); }, 900 + n * 110 + 400);
    } catch { res(); }
  });
}

/** One letter flies from Laila's beak (or a key) into its slot; the caller fills the slot when this resolves. */
export function flyLetter(zoom: ZoomService, s: HTMLElement, fromEl: Element, slot: HTMLElement, L: string, color = 'var(--green)', small = true): Promise<void> {
  return new Promise((res) => {
    const sR = zoom.rect(s), a = zoom.rect(fromEl), b = zoom.rect(slot);
    const f = document.createElement('span'); f.className = 'flyletter' + (small ? ' small' : ''); f.textContent = L; f.style.setProperty('--c', color);
    f.style.left = (a.left + a.width / 2 - sR.left - 29) + 'px'; f.style.top = (a.top + a.height / 2 - sR.top - 35) + 'px'; s.appendChild(f);
    let fired = false; const land = () => { if (fired) return; fired = true; f.remove(); res(); };   // the slot itself is the caller's (a signal): writing its text here would detach Angular's text node
    const an = f.animate([{ transform: 'translate(0,0) scale(.7)', opacity: .9 }, { transform: `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px,${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(1)`, opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.3,.8,.3,1)', fill: 'forwards' });
    an.onfinish = land; setTimeout(land, 1000);
  });
}

/** The letters landing's flourish: the letter pops out of Laila's beak, up, then into its slot. */
export function flyFromBeak(zoom: ZoomService, s: HTMLElement, laila: Element, slot: HTMLElement, L: string, color: string): Promise<void> {
  return new Promise((res) => {
    const sR = zoom.rect(s), lR = zoom.rect(laila), tR = zoom.rect(slot);
    const fl = document.createElement('span'); fl.className = 'flyletter'; fl.textContent = L; fl.style.setProperty('--c', color);
    const mx = lR.left + lR.width * 0.5 - sR.left, my = lR.top + lR.height * 0.40 - sR.top, tx = tR.left + tR.width / 2 - sR.left, ty = tR.top + tR.height / 2 - sR.top;
    fl.style.left = (mx - 29) + 'px'; fl.style.top = (my - 33) + 'px'; s.appendChild(fl);
    let fired = false; const land = () => { if (fired) return; fired = true; fl.remove(); res(); };
    const an = fl.animate([{ transform: 'translate(0,0) scale(.25)', opacity: 0 }, { transform: 'translate(0,-46px) scale(1)', opacity: 1, offset: .3 }, { transform: `translate(${tx - mx}px,${ty - my}px) scale(.9)`, opacity: 1 }], { duration: 1100, easing: 'cubic-bezier(.3,.8,.3,1)', fill: 'forwards' });
    an.onfinish = land; setTimeout(land, 1500);
  });
}

/**
 * First time in a lesson: "press Laila to speak" where the lesson does not explain her itself, then the ear
 * ("hear it again") and the door ("go back"), each explained once per session, never again in another lesson.
 */
export async function firstHints(bus: AudioBus, session: SessionService, spotter: Spotter, s: HTMLElement, laila: Element | null): Promise<void> {
  const steps: [string, Element | null, 'above' | 'left' | 'right'][] = [];
  if (laila && bus.has('app_z_speak')) steps.push(['app_z_speak', laila, 'above']);
  for (const [k, el, where] of steps) { const ok = await bus.play(k, { onStart: () => spotter.spot(el, where) }); spotter.unspot(); if (!ok) return; }
}

/** The results cards all fit inside the picture box: up to five in a row, two rows for ten. */
