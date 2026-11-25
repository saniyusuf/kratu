import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@kratu/app/app.config';
import { ZoomService } from '@kratu/app/core/zoom/zoom.service';
import { FamilyRoot } from './app/family-root';

// Chrome offers to install Kratu once, early, maybe before the app is up: keep the offer for the install sheet (Sani 25 Nov)
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); window.__kratuInstall = e as never; dispatchEvent(new Event('kratu-installable')); });
// the lessons and games are the main app's, still drawn turned a quarter when the phone is held upright
ZoomService.turnMeasurements();
bootstrapApplication(FamilyRoot, appConfig)
  .catch((err) => console.error(err));
