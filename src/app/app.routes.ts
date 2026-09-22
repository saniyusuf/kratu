import { Routes } from '@angular/router';
import { PermScreen } from './features/onboarding/perm';
import { GenderScreen } from './features/onboarding/gender';
import { MeetLailaScreen } from './features/onboarding/meet-laila';
import { HomeScreen } from './features/home/home';
import { BlankScreen } from './shared/blank';
import { FaceScreen } from './features/onboarding/face';
import { WelcomeScreen } from './features/onboarding/welcome';
import { MisaliScreen } from './features/lessons/misali';
import { HaruffaScreen } from './features/lessons/haruffa';
import { HaruffaLearnScreen } from './features/lessons/haruffa-learn';
import { CatsScreen } from './features/lessons/cats';
import { ObjLessonScreen } from './features/lessons/obj';
import { NemoScreen } from './features/lessons/nemo';
import { RubutuScreen } from './features/lessons/rubutu';
import { KaratuScreen } from './features/lessons/karatu';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'blank' },   // nothing renders (or speaks) under the loader; app.ts picks the first screen once everything is ready
  { path: 'perm', component: PermScreen },
  { path: 'gender', component: GenderScreen },
  { path: 'laila', component: MeetLailaScreen },
  { path: 'face', component: FaceScreen },
  { path: 'welcome', component: WelcomeScreen },
  { path: 'home', component: HomeScreen },
  { path: 'misali/:kind', component: MisaliScreen },
  { path: 'haruffa', component: HaruffaScreen },
  { path: 'haruffa/koyo', component: HaruffaLearnScreen },
  { path: 'abubuwa', component: CatsScreen },
  { path: 'abubuwa/koyo', component: ObjLessonScreen, data: { mode: 'words' } },
  { path: 'rubutu', component: RubutuScreen },
  { path: 'lambobi', component: ObjLessonScreen, data: { mode: 'numbers' } },
  { path: 'nemo', component: NemoScreen },
  { path: 'karatu', component: KaratuScreen },
  { path: 'blank', component: BlankScreen },
  { path: '**', redirectTo: 'gender' },
];
