/**
 * Which Kratu this build is. The school build (tablets, face and name sign-in) is the app as it has always been.
 * The family build (Sani 2026-11-18: parents' own phones, no face engine, animal profiles) swaps this file for
 * apps/family/src/edition.ts (the family app, its own Nx project).
 */
import type { EnLabels } from './lang/labels';

export const FAMILY = false;

/** Written labels: the school app shows the Hausa on every screen. The family app shows English (content/labels.json). */
export const EN_LABELS: EnLabels | null = null;
