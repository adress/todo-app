import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';


import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideMomentDateAdapter(), // Provide the MomentDateAdapter
    provideHttpClient(withInterceptors([authInterceptor])), // Add the authInterceptor to the HTTP client
    provideHttpClient(withInterceptors([tokenInterceptor])), // Add the authInterceptor to the HTTP client
    { provide: LOCALE_ID, useValue: 'es' }, // Set the locale to Spanish
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }
  ]
};
