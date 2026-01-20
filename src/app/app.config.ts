import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http'; //Importación necesaria
import { routes } from './app.routes';
import {jwtInterceptor} from './servicios/interceptores';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Configuración de Zone.js
    provideRouter(routes), // Configuración de rutas
    provideHttpClient(withInterceptors([jwtInterceptor])),   // Habilita HttpClient para toda la aplicación
  ]
};
