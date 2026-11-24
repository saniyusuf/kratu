import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { LoaderService } from './core/loader/loader.service';
import { FasheScreen } from './features/games/fashe';
import { GateScreen } from './features/games/gate';
import { PermScreen } from './features/onboarding/perm';
import { GenderScreen } from './features/onboarding/gender';
import { MeetLailaScreen } from './features/onboarding/meet-laila';
import { HomeScreen } from './features/home/home';
import { BlankScreen } from './shared/blank';
import { FaceScreen } from './features/onboarding/face';
import { WelcomeScreen } from './features/onboarding/welcome';
import { MisaliScreen } from './features/lessons/misali';
import { HaruffaLearnScreen } from './features/lessons/haruffa-learn';
import { CatsScreen } from './features/lessons/cats';
import { ObjLessonScreen } from './features/lessons/obj';
import { NemoScreen } from './features/lessons/nemo';
import { RubutuScreen } from './features/lessons/rubutu';
import { KaratuScreen } from './features/lessons/karatu';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'blank' },   // nothing renders (or speaks) under the loader; app.ts picks the first screen once everything is ready
  { path: 'perm', component: PermScreen, canDeactivate: [stayOnBack] },
  { path: 'gender', component: GenderScreen, canDeactivate: [stayOnBack] },
  { path: 'laila', component: MeetLailaScreen },
  { path: 'face', component: FaceScreen },
  { path: 'welcome', component: WelcomeScreen },
  { path: 'home', component: HomeScreen, canDeactivate: [backOnHome] },
  { path: 'misali/:kind', component: MisaliScreen },
  { path: 'haruffa/koyo', component: HaruffaLearnScreen },
  { path: 'abubuwa', component: CatsScreen },
  { path: 'abubuwa/koyo', component: ObjLessonScreen, data: { mode: 'words' } },
  { path: 'rubutu', component: RubutuScreen },
  { path: 'lambobi', component: ObjLessonScreen, data: { mode: 'numbers' } },
  { path: 'nemo', component: NemoScreen },
  { path: 'karatu', component: KaratuScreen },
  { path: 'haruffa/gwada', component: GateScreen },   // the gate: do you know them all?
  { path: 'fashe', component: FasheScreen },
  // the games load only when one opens: their scenes are most of the app's script (Sani 2026-11-04, cheap tablets)
  { path: 'wasanni', loadComponent: () => import('./features/games/board/board').then((m) => m.GamesBoard) },   // the games board: the games this child has won (Sani 2026-11-05)
  { path: 'wasanni/:id', loadComponent: () => import('./features/games/lab/gamelab').then((m) => m.GameLabScreen) },   // the judging games, reached from the settings for now
  { path: 'blank', component: BlankScreen, canActivate: [neverBackToBlank] },
  { path: '**', redirectTo: 'gender' },
];

/**
 * The system Back on home (Sani 2026-11-24: "it should never refresh and delete the app"): instead of leaving home, the
 * leave box opens ("I'm finished" or cancel). The router puts the address back (canceledNavigationResolution
 * 'computed', app.config.ts). Back with the box already open closes it, like a tap outside.
 */
export function backOnHome(home: HomeScreen): boolean {
  if (inject(Router).getCurrentNavigation()?.trigger !== 'popstate') return true;
  if (home.leaveOpen()) { home.closeLeave(); return false; }
  home.leave(); return false;
}
/** The empty start-up page is never a place to go back to once the app is open: Back lands on the boy/girl screen. */
export function neverBackToBlank(): boolean | ReturnType<Router['parseUrl']> {
  const ROUTER = inject(Router);
  if (ROUTER.getCurrentNavigation()?.trigger === 'popstate' && inject(LoaderService).finished()) return ROUTER.parseUrl('/gender');
  return true;
}
/** The boy/girl and permission screens are where the app starts: Back does nothing there (Sani 2026-11-24). */
export function stayOnBack(): boolean { return inject(Router).getCurrentNavigation()?.trigger !== 'popstate'; }
