import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@kratu/app/app.config';
import { ZoomService } from '@kratu/app/core/zoom/zoom.service';
import { FamilyRoot } from './app/family-root';

// the lessons and games are the main app's, still drawn turned a quarter when the phone is held upright
ZoomService.turnMeasurements();
bootstrapApplication(FamilyRoot, appConfig)
  .catch((err) => console.error(err));
