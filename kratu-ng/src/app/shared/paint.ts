/** Resolve after the next paint, or after 60 ms when no frame comes (hidden tab, background pane). Never a hard dependency on frames. */
export function afterPaint(): Promise<void> {
  return new Promise((res) => { let done = false; const fin = () => { if (!done) { done = true; res(); } }; try { requestAnimationFrame(() => requestAnimationFrame(fin)); } catch { /* ignore */ } setTimeout(fin, 60); });
}
