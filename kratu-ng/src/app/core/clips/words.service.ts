import { Injectable, signal } from '@angular/core';

export interface Word { k: string; en: string; ha: string; img?: string; ha_clip?: string; en_clip?: string; }

/** Every example word by category: picture and the two clips as files under assets/. */
@Injectable({ providedIn: 'root' })
export class WordsService {
  readonly cats = signal<Record<string, Word[]>>({});
  readonly ready = signal(false);

  async load(): Promise<void> {
    if (this.ready()) return;
    const r = await fetch('assets/words.json');
    if (!r.ok) throw new Error('words.json ' + r.status);
    const raw = await r.json() as Record<string, any[]>;
    const out: Record<string, Word[]> = {};
    for (const c of Object.keys(raw)) {
      out[c] = raw[c].map((w: any) => ({ k: w.k, en: w.en, ha: w.ha, img: w.img ? 'assets/' + w.img : undefined, ha_clip: w.haClip ? 'assets/' + w.haClip : undefined, en_clip: w.enClip ? 'assets/' + w.enClip : undefined }));
    }
    this.cats.set(out);
    this.ready.set(true);
  }
  list(cat: string): Word[] { return this.cats()[cat] ?? []; }
  find(k: string): Word | undefined { for (const c of Object.values(this.cats())) { const w = c.find((x) => x.k === k); if (w) return w; } return undefined; }
  /** Every English token the recogniser should know, for the word grammar. */
  vocab(): string[] {
    const out = new Set<string>();
    for (const c of Object.values(this.cats())) for (const w of c) for (const t of String(w.en).toLowerCase().split(/\s+/)) { const x = t.replace(/[^a-z]/g, ''); if (x) out.add(x); }
    return Array.from(out);
  }
}
