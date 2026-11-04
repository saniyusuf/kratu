import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from './course.service';
import { ProgressService } from './progress.service';
import { SessionService } from './session.service';
import { LEVEL_AT, TITLES, gameGold, levelOf, unlockLines } from './zinari';

/** What a passed course game pays: the gold, the totals, Laila's line for it, and the title it grants, if a bag filled. */
export interface Award {
  gold: number; before: number; after: number; at: number[]; lines: string[];
  unlock: { i: number; name: string; colour: string; lines: string[] } | null;
}

/**
 * The course's game gate shared by every game (Sani 2026-11-02, 11-04): the game frame's games, and the two screens of
 * their own (Nemo hoto, the balloons). 75% passes and pays Zinari; a first miss is the same game again with a new mix;
 * a second miss is a lesson of what was missed, which comes back to the game. A pass that fills a bag grants its title
 * there and then, and only after that does the course go on.
 */
@Injectable({ providedIn: 'root' })
export class CourseGate {
  private readonly course = inject(CourseService);
  private readonly progress = inject(ProgressService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  static readonly PASS = 0.75;
  /** Four stars for a score: the pass line sits after the third. */
  static stars(score: number): number { return Math.max(0, Math.min(4, Math.floor(score * 4 + 1e-9))); }

  /** A passed game's Zinari (Sani 2026-11-03), paid once. `step` is the course step, or null for a game met outside it. */
  award(id: string, step: string | null, stars: number, tries: number): Award {
    const tag = step ? 's' + step : 'g' + id, first = !this.progress.passed(tag);
    const gold = gameGold(first, tries <= 1, stars >= 4); this.progress.markPassed(tag);
    const { before, after } = this.progress.addZinari(gold), f = this.session.g() === 'f';
    const was = levelOf(before), now = levelOf(after), t = now > was ? TITLES[now - 1] : null;   // two bags at once (only the simulator can) grants the higher
    return { gold, before, after, at: LEVEL_AT, lines: ['s_z_got_' + stars + '_' + gold],
      unlock: t ? { i: now - 1, name: f ? t.f : t.m, colour: t.colour, lines: unlockLines(now - 1) } : null };
  }

  /** Where the course goes after step n is done: its next step, or home when the simulator has moved elsewhere. */
  nextUrl(n: number): string {
    const nx = this.course.finish(n); if (!nx) return '/home';
    const rt = this.course.route(nx); return this.router.serializeUrl(this.router.createUrlTree(['/' + rt.path], { queryParams: rt.query }));
  }
  /** Open a url as a fresh screen, even when it is the screen already showing (a retry). */
  reopen(url: string): void { this.router.navigateByUrl('/blank', { skipLocationChange: true }).then(() => this.router.navigateByUrl(url)); }
  /** A pass on a screen of its own: the title's unlock first when a bag filled (in the game frame), then the next step. */
  passed(n: number, a: Award): void {
    const next = this.nextUrl(n);
    if (a.unlock) this.reopen(this.router.serializeUrl(this.router.createUrlTree(['/wasanni/unlock'], { queryParams: { i: a.unlock.i, next } })));
    else this.reopen(next);
  }
}
