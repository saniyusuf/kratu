import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideServiceWorker('kratu-sw.js', { enabled: !isDevMode(), registrationStrategy: 'registerImmediately' }),   // Angular's worker (the app shell, the engines' scripts, every clip and picture) plus the phone's background downloads of the big models (public/kratu-sw.js, Sani 24 Nov); the models live in the loader's own cache
  ],
};
