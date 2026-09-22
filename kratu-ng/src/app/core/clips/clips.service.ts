import { Injectable, signal } from '@angular/core';

export interface ClipMeta { file: string; ha: string; en: string; }

/** Every voice line the app can play: key → file under assets/, with its Hausa text and English caption. Loaded once by the loader. */
@Injectable({ providedIn: 'root' })
export class ClipsService {
  private readonly map = signal<Record<string, ClipMeta>>({});
  readonly ready = signal(false);

  async load(): Promise<void> {
    if (this.ready()) return;
    const r = await fetch('assets/clips.json');
    if (!r.ok) throw new Error('clips.json ' + r.status);
    this.map.set(await r.json());
    this.ready.set(true);
  }
  has(key: string): boolean { return !!this.map()[key]; }
  url(key: string): string | null { const m = this.map()[key]; return m ? 'assets/' + m.file : null; }
  text(key: string): { ha: string; en: string } { const m = this.map()[key]; return { ha: m?.ha ?? '', en: m?.en ?? '' }; }
  keys(): string[] { return Object.keys(this.map()); }
}
