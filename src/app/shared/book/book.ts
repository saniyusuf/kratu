import { AfterViewInit, Component, ElementRef, OnDestroy, inject, input, output, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from '../icons';
import { BOOK_COVER_SVG, BOOK_HAND_SVG } from './book-svg';

/** One page's content: a written letter or number, or one of the app's own pictures. */
interface PageItem { t?: string; col?: string; i?: string; }
interface Spread { L: PageItem | null; R: PageItem; bl: string; br: string; edge: string; }

/** One spread per kind of lesson, in the curriculum's order: Haruffa, Abubuwa, Nemo hoto, Lambobi, Karatu, Rubutu. */
const SPREADS: Spread[] = [
  { L: { t: 'A', col: '#E63946' }, R: { i: 'apple' }, bl: '#FDE3E4', br: '#FFFFFF', edge: '#E63946' },
  { L: { i: 'goat' }, R: { i: 'tree' }, bl: '#DDF0FB', br: '#FFFFFF', edge: '#1E9BD7' },
  { L: { i: 'q4' }, R: { i: 'house' }, bl: '#FDE7DB', br: '#FFFFFF', edge: '#F0743E' },
  { L: { t: '7', col: '#FFFFFF' }, R: { i: 'rnum' }, bl: '#4CAF50', br: '#FFFFFF', edge: '#3E9B43' },
  { L: { i: 'k3' }, R: { i: 'person' }, bl: '#FFFFFF', br: '#DDF3F0', edge: '#2EAD9E' },
  { L: { i: 'r3' }, R: { i: 'pencil' }, bl: '#2E2823', br: '#EEE4F7', edge: '#8E5CC2' },
];
const FIRST: Spread = { L: null, R: { i: 'car' }, bl: '#FBF3DE', br: '#FFFFFF', edge: '#C9AE74' };
const DARK = new Set(['#2E2823', '#4CAF50']);
const spread = (i: number): Spread => (i === 0 ? FIRST : SPREADS[(i - 1) % SPREADS.length]);

/** The icons as standalone images for the canvas: an <img> needs the namespace and no repeated attributes. */
function asImage(svg: string): HTMLImageElement {
  const clean = svg.replace(/<([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g, (_m, tag: string, attrs: string, end: string) => {
    const seen = new Set<string>(); let out = '';
    for (const a of attrs.matchAll(/([\w:-]+)="([^"]*)"/g)) { if (seen.has(a[1])) continue; seen.add(a[1]); out += ` ${a[1]}="${a[2]}"`; }
    return '<' + tag + out + end + '>';
  }).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" ');
  const im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(clean); return im;
}
const ease = (t: number) => { t = Math.max(0, Math.min(1, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const out3 = (t: number) => { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 3); };
type P = { x: number; y: number };
/** The part of a polygon on one side of a line (through M, normal n): sg 1 keeps the n side, -1 the other. */
function clipPoly(poly: P[], M: P, nx: number, ny: number, sg: number): P[] {
  const o: P[] = [];
  for (let i = 0; i < poly.length; i++) {
    const A = poly[i], B = poly[(i + 1) % poly.length], a = ((A.x - M.x) * nx + (A.y - M.y) * ny) * sg, b = ((B.x - M.x) * nx + (B.y - M.y) * ny) * sg;
    if (a >= 0) o.push(A);
    if ((a >= 0) !== (b >= 0)) { const t = a / (a - b); o.push({ x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t }); }
  }
  return o;
}
const T = { enter: 2.0, open: 2.6, rest: 1.4, turn: 4.7, wait: 3.8 };
/** Everything the book does runs this many times slower than the timings above (Sani 2026-10-12: slow it all down). */
const SLOW = 1.5;

/**
 * The course book at the top of the chooser (Sani 2026-10-11): red Kano leather with the Arewa knot. A hand opens the
 * hard cover once and the book stays open and centred; every few seconds the hand peels the right-hand page from its
 * bottom corner (the fold is the reflection of the page about the line halfway between corner and finger) onto a
 * spread of another kind of lesson, and the pictures move where they are. Pressing it opens the next lesson.
 * The pages are one canvas (drawn at no more than 1.25× the screen's pixels, the book being big); the hand and cover move
 * by transform only; nothing draws while the screen is hidden. Home design 2 (Sani 2026-11-05): three times the old size, red
 * leather with gold corners and stitching, thick page edges and a blue ribbon, a warm light behind and a soft shadow under;
 * it breathes all the time and pulses (.talk on the host) while Laila talks about it.
 */
@Component({
  selector: 'app-course-book',
  host: { class: 'cbookwrap' },
  template: `
<span class="cbpool" aria-hidden="true"></span><span class="cbshadow" aria-hidden="true"></span>
<button #book class="cbook breath" aria-label="Littafi" (click)="press()">
  <span #back class="cbback"><span class="cbleaves"></span><span class="cbribbon"></span></span>
  <canvas #cv class="cbpages" aria-hidden="true"></canvas>
  <span #cover class="cbcover"><span class="cbfront" [innerHTML]="coverSvg"></span><span class="cbinside"></span></span>
  <span #hand class="cbhand" [innerHTML]="handSvg"></span>
</button>`,
})
export class CourseBook implements AfterViewInit, OnDestroy {
  /** The book was pressed: open the next lesson. */
  readonly pressed = output<void>();
  /** The cover is open and the book has slid to its resting place, so anything pointing at it can find it. */
  readonly settled = output<void>();
  /** Stay shut and still, with no hand of its own, until begin(): the chooser shows the closed book while Laila talks about it. */
  readonly hold = input(false);
  private readonly san = inject(DomSanitizer);
  readonly coverSvg = this.san.bypassSecurityTrustHtml(BOOK_COVER_SVG);
  readonly handSvg = this.san.bypassSecurityTrustHtml(BOOK_HAND_SVG);
  private readonly bookRef = viewChild.required<ElementRef<HTMLButtonElement>>('book');
  private readonly cvRef = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private readonly coverRef = viewChild.required<ElementRef<HTMLElement>>('cover');
  private readonly backRef = viewChild.required<ElementRef<HTMLElement>>('back');
  private readonly handRef = viewChild.required<ElementRef<HTMLElement>>('hand');

  private el!: HTMLButtonElement; private cv!: HTMLCanvasElement; private cx!: CanvasRenderingContext2D;
  private cover!: HTMLElement; private back!: HTMLElement; private hand!: HTMLElement;
  private readonly img: Record<string, HTMLImageElement> = {};
  private readonly reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  private W = 0; private H = 0; private S = 0; private w = 0; private h = 0; private ox = 0; private oy = 0; private dpr = 1; private hw = 0; private ax = 0; private ay = 0;
  private phase = ''; private t0 = 0; private idx = 0; private leftOn = false; private visible = true; private raf = 0;
  private goUntil = 0; private turned = false; private pausedAt = 0; private wob = 0; private boostAt = -1e9; private dead = false;
  private ro?: ResizeObserver; private io?: IntersectionObserver; private goTimer = 0;

  ngAfterViewInit(): void {
    this.el = this.bookRef().nativeElement; this.cv = this.cvRef().nativeElement; this.cx = this.cv.getContext('2d')!;
    this.cover = this.coverRef().nativeElement; this.back = this.backRef().nativeElement; this.hand = this.handRef().nativeElement;
    for (const s of [FIRST, ...SPREADS]) for (const it of [s.L, s.R]) if (it?.i && !this.img[it.i] && ICONS[it.i]) { const im = asImage(ICONS[it.i]); im.onload = () => this.idle(); this.img[it.i] = im; }
    this.size();
    if (typeof ResizeObserver !== 'undefined') { this.ro = new ResizeObserver(() => { this.size(); if (this.phase) this.draw(null); }); this.ro.observe(this.el); }
    if (typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver((es) => {
        this.visible = es[0].isIntersecting;
        if (!this.visible) this.pausedAt = performance.now(); else { if (this.pausedAt) { this.t0 += performance.now() - this.pausedAt; this.pausedAt = 0; } this.schedule(); }
      });
      this.io.observe(this.el);
    }
    this.reset();
  }
  ngOnDestroy(): void { this.dead = true; cancelAnimationFrame(this.raf); this.ro?.disconnect(); this.io?.disconnect(); clearTimeout(this.goTimer); }

  /** Pressed at any moment: the book stops where it is and the next lesson opens straight away. Nothing is redrawn —
   *  a cheap tablet should spend the moment loading the next screen, not animating this one (Sani 2026-10-12). */
  press(): void {
    if (this.goUntil) return;
    this.goUntil = 1; this.dead = true; cancelAnimationFrame(this.raf); this.raf = 0;
    this.el.classList.remove('breath'); this.el.classList.add('down'); this.pressed.emit();
  }

  private size(): void {
    this.W = this.el.offsetWidth; this.H = this.el.offsetHeight; if (!this.W) return;
    this.dpr = Math.min(1.25, window.devicePixelRatio || 1); this.S = this.W / 2; this.w = this.W / 2; this.h = this.H; this.ox = this.W * .1; this.oy = this.H * .5;
    this.cv.width = Math.round(this.W * 1.2 * this.dpr); this.cv.height = Math.round(this.H * 2 * this.dpr);
    this.hw = this.W * .30; this.ax = this.hw * 32 / 140; this.ay = this.hw * 12 / 140; this.hand.style.width = this.hw + 'px'; this.hand.style.transformOrigin = this.ax + 'px ' + this.ay + 'px';
  }
  private setHand(x: number, y: number, rot: number, sc: number, op: number): void {
    this.hand.style.transform = `translate(${(x - this.ax).toFixed(1)}px,${(y - this.ay).toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
    this.hand.style.opacity = op.toFixed(2);
  }
  private setCover(deg: number): void { this.cover.style.transform = `rotateY(${(-deg).toFixed(1)}deg)`; }
  private base(): void { this.cx.setTransform(this.dpr, 0, 0, this.dpr, this.ox * this.dpr, this.oy * this.dpr); }

  private pagePath(side: 'L' | 'R'): void {
    const { cx, S, w, h } = this; cx.beginPath();
    if (side === 'R') { cx.moveTo(S, 0); cx.lineTo(S + w - 8, 0); cx.quadraticCurveTo(S + w, 0, S + w, 8); cx.lineTo(S + w, h - 8); cx.quadraticCurveTo(S + w, h, S + w - 8, h); cx.lineTo(S, h); }
    else { cx.moveTo(S, 0); cx.lineTo(8, 0); cx.quadraticCurveTo(0, 0, 0, 8); cx.lineTo(0, h - 8); cx.quadraticCurveTo(0, h, 8, h); cx.lineTo(S, h); }
    cx.closePath();
  }
  private page(side: 'L' | 'R', sp: Spread): void {
    const { cx, S, w, h } = this; const cnt = side === 'R' ? sp.R : sp.L, bg = side === 'R' ? sp.br : sp.bl, dark = DARK.has(bg);
    this.pagePath(side); cx.fillStyle = bg; cx.fill();
    if (side === 'L' && !cnt) { cx.strokeStyle = 'rgba(201,174,116,.35)'; cx.lineWidth = 1; cx.beginPath(); for (let y = 14; y < h; y += 14) { cx.moveTo(4, y + .5); cx.lineTo(S - 4, y + .5); } cx.stroke(); }
    const g = cx.createLinearGradient(S, 0, side === 'R' ? S + w * .16 : S - w * .16, 0); g.addColorStop(0, dark ? 'rgba(0,0,0,.35)' : 'rgba(59,46,30,.24)'); g.addColorStop(1, 'rgba(59,46,30,0)');
    cx.fillStyle = g; cx.fillRect(side === 'R' ? S : S - w * .16, 0, w * .16, h);
    this.pagePath(side); cx.strokeStyle = sp.edge; cx.lineWidth = 3; cx.stroke();
    if (!cnt) return;
    // the pictures move where they are: the left one hops, the right one sways; a press makes both jump
    const x = side === 'R' ? S + w / 2 : w / 2, L = side === 'L', k = this.wob - this.boostAt;
    let jump = k >= 0 && k < .9 ? Math.sin(k / .9 * Math.PI) : 0;
    let dy = L ? -Math.abs(Math.sin(this.wob * 1.9)) * h * .07 : Math.sin(this.wob * 2.6) * h * .018, rot = L ? Math.sin(this.wob * 3.8) * .025 : Math.sin(this.wob * 1.3) * .09;
    let sc = (L ? 1 + .04 * Math.abs(Math.cos(this.wob * 1.9)) : 1) + .3 * jump;
    if (this.reduce) { dy = 0; rot = 0; sc = 1; jump = 0; }
    cx.save(); cx.translate(x, h / 2 + dy - jump * h * .08); cx.rotate(rot); cx.scale(sc, sc);
    if (cnt.t) { cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = cnt.col || '#3B2E1E'; cx.font = '800 ' + Math.round(h * .5) + 'px "Baloo 2",system-ui,sans-serif'; cx.fillText(cnt.t, 0, h * .05); }
    else { const im = cnt.i ? this.img[cnt.i] : undefined, z = Math.min(w, h) * .74; if (im && im.complete && im.naturalWidth) cx.drawImage(im, -z / 2, -z / 2, z, z); }
    cx.restore();
  }
  private stack(): void { const { cx, S, w, h } = this; cx.strokeStyle = '#E6D6AE'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(S, h + 2.5); cx.lineTo(S + w - 6, h + 2.5); cx.moveTo(S + w + 2.5, 6); cx.lineTo(S + w + 2.5, h - 6); cx.stroke(); }
  private poly(p: P[]): void { const cx = this.cx; cx.beginPath(); cx.moveTo(p[0].x, p[0].y); for (let i = 1; i < p.length; i++) cx.lineTo(p[i].x, p[i].y); cx.closePath(); }
  /** The page is held at the spine: the corner can never be pulled further than the page reaches. */
  private cons(F: P): P {
    const { S, w, h } = this; let dx = F.x - S, dy = F.y - h, l = Math.hypot(dx, dy);
    if (l > w) F = { x: S + dx * w / l, y: h + dy * w / l };
    const D = Math.hypot(w, h); dx = F.x - S; dy = F.y; l = Math.hypot(dx, dy); if (l > D) F = { x: S + dx * D / l, y: dy * D / l };
    return F;
  }
  /** Both pages; with F, the right page's bottom corner is lifted to F and folded over. Returns where the corner is. */
  private draw(F: P | null): P | null {
    const { cx, S, w, h, W, H, dpr } = this; cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, this.cv.width, this.cv.height); this.base();
    const cur = spread(this.idx), nxt = spread(this.idx + 1);
    if (this.leftOn) this.page('L', cur);
    this.stack();
    if (!F) { this.page('R', cur); return null; }
    const C = { x: S + w, y: h }, vx = F.x - C.x, vy = F.y - C.y, len = Math.hypot(vx, vy);
    if (len < 1) { this.page('R', cur); return F; }
    const nx = vx / len, ny = vy / len, M = { x: (C.x + F.x) / 2, y: (C.y + F.y) / 2 };
    const R = [{ x: S, y: 0 }, { x: S + w, y: 0 }, { x: S + w, y: h }, { x: S, y: h }], keep = clipPoly(R, M, nx, ny, 1), gone = clipPoly(R, M, nx, ny, -1);
    if (gone.length > 2) {   // the page underneath, with the shadow the lifted paper throws on it
      cx.save(); this.poly(gone); cx.clip(); this.page('R', nxt);
      const sh = Math.min(w * .3, len * .5), g = cx.createLinearGradient(M.x, M.y, M.x - nx * sh, M.y - ny * sh); g.addColorStop(0, 'rgba(59,46,30,.38)'); g.addColorStop(1, 'rgba(59,46,30,0)');
      cx.fillStyle = g; cx.fillRect(-W, -H, W * 3, H * 3); cx.restore();
    }
    if (keep.length > 2) { cx.save(); this.poly(keep); cx.clip(); this.page('R', cur); cx.restore(); }
    if (gone.length < 3) return F;
    // the flap: the folded part's back, reflected about the fold line (and mirrored about the spine, so it reads right)
    const dx = -ny, dy = nx, a = dx * dx - dy * dy, b = 2 * dx * dy, d = -a, e = M.x - (a * M.x + b * M.y), f = M.y - (b * M.x + d * M.y);
    const flap = gone.map((p) => ({ x: a * p.x + b * p.y + e, y: b * p.x + d * p.y + f }));
    cx.save(); cx.shadowColor = 'rgba(59,46,30,.30)'; cx.shadowBlur = 12 * dpr; cx.shadowOffsetX = 2 * dpr; cx.shadowOffsetY = 3 * dpr; this.poly(flap); cx.fillStyle = nxt.bl; cx.fill(); cx.restore();
    cx.save(); this.poly(flap); cx.clip(); cx.transform(a, b, b, d, e, f); cx.transform(-1, 0, 0, 1, 2 * S, 0); this.page('L', nxt); this.base();
    const fl = len / 2, g2 = cx.createLinearGradient(M.x, M.y, M.x + nx * fl, M.y + ny * fl);
    g2.addColorStop(0, 'rgba(59,46,30,.30)'); g2.addColorStop(.18, 'rgba(255,255,255,.45)'); g2.addColorStop(.55, 'rgba(255,255,255,0)'); g2.addColorStop(1, 'rgba(59,46,30,.14)');
    cx.fillStyle = g2; cx.fillRect(-W, -H, W * 3, H * 3); cx.restore();
    return F;
  }

  private opened(): void {
    this.setCover(178); this.cover.style.visibility = 'hidden'; this.el.style.setProperty('--c', '0'); this.back.style.opacity = '1'; this.leftOn = true;
    this.settled.emit();
  }
  private go(name: string): void { this.phase = name; this.t0 = performance.now(); this.turned = false; }
  private reset(): void {
    this.idx = 0; this.leftOn = false; this.back.style.opacity = '0'; this.cover.style.visibility = ''; this.setCover(0); this.el.style.setProperty('--c', '1');
    this.el.classList.add('breath'); this.setHand(0, 0, 0, 1, 0); this.goUntil = 0;
    if (this.reduce) { this.idx = 1; this.opened(); this.el.style.setProperty('--glow', spread(1).edge); this.draw(null); return; }
    if (this.hold()) { this.go('hold'); this.draw(null); return; }
    this.go('enter'); this.schedule();
  }
  /** The instructions are over: the hand comes and opens the cover. Does nothing once it has begun or been pressed. */
  begin(): void { if (this.phase === 'hold' && !this.dead) { this.go('enter'); this.schedule(); } }
  /** A picture arrived while nothing was moving: draw it in. */
  private idle(): void { if (this.phase && this.phase !== 'turn') this.draw(null); }
  private schedule(): void { if (!this.raf && this.visible && !this.reduce && !this.dead) this.raf = requestAnimationFrame((n) => this.frame(n)); }

  private frame(now: number): void {
    this.raf = 0; if (!this.visible || this.dead) return; this.wob = now / 1000 / SLOW;
    const t = (now - this.t0) / 1000 / SLOW, { W, H, S, w, h } = this;
    if (now < this.goUntil) { this.draw(null); this.schedule(); return; }
    if (this.phase === 'hold') return;   // shut and still: nothing to draw until begin()
    if (this.phase === 'enter') {   // closed, breathing; the hand comes to the cover's edge
      const k = out3((t - .7) / 1.2); this.setHand(W * 1.05 - W * .05 * k + W * .15 * (1 - k), h * .64 + H * .5 * (1 - k), -16, 1, k); this.draw(null);
      if (t >= T.enter) this.go('open');
    } else if (this.phase === 'open') {   // a press, then the hard cover lifts over; the book slides to the centre
      const pr = t < .3 ? 1 - .07 * Math.sin(Math.PI * t / .3) : 1, q = ease((t - .3) / 2.0), deg = 178 * q, rad = deg * Math.PI / 180;
      this.setCover(deg); this.el.style.setProperty('--c', (1 - q).toFixed(3));
      if (deg > 90 && !this.leftOn) { this.leftOn = true; this.back.style.opacity = '1'; }
      const hx = S + w * .97 * Math.cos(rad), hy = h * .64 - Math.sin(rad) * h * .1, fade = 1 - out3((q - .8) / .2);
      this.setHand(hx - (q > .8 ? (q - .8) * W * .6 : 0), hy + (q > .8 ? (q - .8) * H * .8 : 0), -16 - 34 * q, pr, fade); this.draw(null);
      if (t >= T.open) { this.opened(); this.el.style.setProperty('--glow', spread(0).edge); this.setHand(0, 0, 0, 1, 0); this.go('rest'); }
    } else if (this.phase === 'rest') { this.draw(null); if (t >= T.rest) this.go('turn'); }
    else if (this.phase === 'turn') {   // reach the corner, pinch it up, peel it over, let go
      const C = { x: S + w, y: h }, rot = -20;
      if (t < .9) { const k = out3(t / .9); this.draw(null); this.setHand(C.x + W * .18 * (1 - k), C.y + H * .45 * (1 - k) - 2, rot, 1, k); }
      else if (t < 1.4) { const k = ease((t - .9) / .5); const F = this.draw(this.cons({ x: C.x - w * .07 * k, y: C.y - h * .07 * k }))!; this.setHand(F.x, F.y, rot, 1 - .05 * Math.sin(Math.PI * k), 1); }
      else if (t < 4.0) {
        const u = ease((t - 1.4) / 2.6), Sx = C.x - w * .07, Sy = C.y - h * .07, Ex = S - w, Ey = h;
        const F = this.draw(this.cons({ x: Sx + (Ex - Sx) * u, y: Sy + (Ey - Sy) * u - Math.sin(Math.PI * u) * h * .42 }))!; this.setHand(F.x, F.y, rot - 26 * u, 1, 1);
      } else {
        if (!this.turned) { this.turned = true; this.idx++; this.el.style.setProperty('--glow', spread(this.idx).edge); }
        this.draw(null); const r = out3((t - 4.0) / .6); this.setHand(S - w + W * .05 * r, h + H * .35 * r, -46 + 10 * r, 1, 1 - r);
      }
      if (t >= T.turn) { this.setHand(0, 0, 0, 1, 0); this.go('wait'); }
    } else if (this.phase === 'wait') { this.draw(null); if (t >= T.wait) this.go('turn'); }
    this.schedule();
  }
}
