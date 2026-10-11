import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LANG } from './app/core/lang/lang';

// a demo build in another language says so to the browser (the page itself is written lang="ha")
if (LANG.code !== 'ha') document.documentElement.lang = LANG.code;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
