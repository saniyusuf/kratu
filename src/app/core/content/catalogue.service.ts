import { Injectable } from '@angular/core';

/** One entry of the catalogue: a permanent named key (word_goat, number_7, line_pop_intro …) and what it points to. */
export interface CatalogueItem {
  type: 'word' | 'number' | 'letter' | 'line' | 'game' | 'lesson' | 'unit' | 'group' | 'name';
  src?: string | string[]; retired?: boolean;
  /** the item in each language (a line's value may hold a boy's and a girl's text) */
  values?: Record<string, unknown>;
  /** file keys: pic_word_goat, pic_word_aunt_yo, audio_word_goat_ha, audio_line_pop_intro_m_ha … */
  files?: string[];
}

/**
 * The catalogue of permanent content keys (Sani 2026-11-16), generated from content/catalogue.json by
 * `npm run catalogue`. Stored data refers to content only by these keys, never by a word or a file name; this service
 * turns today's internal keys (goat, s_pop_intro, j-shanu, haruffa/g0) into the permanent ones and finds a file for a
 * key. The server keeps the same keys with its own map to the real files.
 */
@Injectable({ providedIn: 'root' })
export class CatalogueService {
  private items: Record<string, CatalogueItem> = {};
  private files: Record<string, string> = {};
  private bySrc = new Map<string, string>();
  private loading: Promise<void> | null = null;

  load(): Promise<void> {
    if (!this.loading) this.loading = fetch('assets/catalogue.json').then((r) => r.ok ? r.json() : { items: {}, files: {} }).then((c) => {
      this.items = c.items || {}; this.files = c.files || {};
      for (const [k, v] of Object.entries(this.items)) for (const s of ([] as string[]).concat((v.src as string | string[]) ?? [])) this.bySrc.set(v.type + ':' + s, k);
    }).catch(() => { this.loading = null; });
    return this.loading;
  }
  /** the permanent key for today's internal key, e.g. ('word', 'goat') → 'word_goat', ('number', 'p7') → 'number_7' */
  keyFor(type: CatalogueItem['type'], src: string): string | null { return this.bySrc.get(type + ':' + src) ?? null; }
  item(key: string): CatalogueItem | null { return this.items[key] ?? null; }
  /** the file for a file key, e.g. 'audio_word_goat_ha' → 'assets/audio/ha/word_goat.ogg' */
  file(fileKey: string): string | null { return this.files[fileKey] ?? null; }
}
