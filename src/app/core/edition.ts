/**
 * Which Kratu this build is. The school build (tablets, face and name sign-in) is the app as it has always been.
 * The family build (Sani 2026-11-18: parents' own phones, no face engine, animal profiles) swaps this file for
 * apps/family/src/edition.ts (the family app, its own Nx project).
 */
import type { EnLabels } from './lang/labels';
import { LABELS_EN } from './lang/labels.en';

export const FAMILY = false;

/**
 * Written labels in English in every version (Sani 2026-11-18, review page approved): menus, headings and adult screens in
 * English; a child's main buttons English with the child's language small underneath; game names stay in the child's
 * language; Laila still speaks it. null puts every label back in the build's own language.
 */
export const EN_LABELS: EnLabels | null = { map: LABELS_EN, inGame: true };
