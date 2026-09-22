import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

export type SampleKind = 'haruffa' | 'abubuwa' | 'lambobi' | 'rubutu' | 'karatu' | 'nemo' | 'nemonum';
/** Screens whose sample plays on entry, and the sub-topics whose sample plays when their Laila is pressed the first time. */
export const SAMPLE_ON_ENTER: Record<string, SampleKind> = { haruffa: 'haruffa', 'abubuwa/koyo': 'abubuwa', lambobi: 'lambobi' };
export const SAMPLE_OF_SUB: Record<string, Record<string, SampleKind>> = {
  nemo: { q4: 'nemo', qnum: 'nemonum' },
  rubutu: { r3: 'rubutu', r4: 'rubutu', r5: 'rubutu', rlong: 'rubutu', rnum: 'rubutu' },
  karatu: { k3: 'karatu', k45: 'karatu', klong: 'karatu', knum: 'karatu' },
};

/** Where a lesson goes next: the sample first when it has not been seen this session, then the lesson itself. */
@Injectable({ providedIn: 'root' })
export class LessonFlow {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  /** Which word the Rubutu/Karatu sample uses: CAT, or ONE for the number sub-topics. */
  sampleWord: Record<string, string> = { rubutu: 'CAT', karatu: 'CAT' };

  /** Open a lesson from the chooser: its sample plays first, once. */
  open(lesson: string): void {
    const kind = SAMPLE_ON_ENTER[lesson];
    if (kind && !this.session.sampleSeen(kind)) { this.sample(kind, '/' + lesson); return; }
    this.router.navigate(['/' + lesson]);
  }
  /** A sub-topic's Laila pressed: its sample first the first time, then back to the lesson with the pick kept. */
  sub(lesson: string, key: string, resumeUrl: string): boolean {
    const kind = SAMPLE_OF_SUB[lesson]?.[key];
    if (!kind || this.session.sampleSeen(kind)) return false;
    this.sampleWord[kind === 'nemonum' ? 'nemo' : kind] = /num/.test(key) ? 'ONE' : 'CAT';
    this.sample(kind, resumeUrl); return true;
  }
  sample(kind: SampleKind, next: string): void { this.session.markSample(kind); this.router.navigate(['/misali', kind], { queryParams: { next } }); }
}
