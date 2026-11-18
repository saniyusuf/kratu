/** The family build: parents' own phones, Netflix-style animal profiles, no face or voice sign-in (Sani 2026-11-18). */
import type { EnLabels } from '@kratu/app/core/lang/labels';
import { LABELS_EN } from '@kratu/app/core/lang/labels.en';

export const FAMILY = true;

/**
 * Written labels in English (Sani 2026-11-18): menus, headings and buttons, with the Hausa small under the child's main
 * buttons; game names stay Hausa; Laila still speaks Hausa. inGame: false puts the written in-game instructions back to Hausa.
 */
export const EN_LABELS: EnLabels | null = { map: LABELS_EN, inGame: true };
