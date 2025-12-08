import { Routes } from '@angular/router';
import {InicioComponent} from './inicio/inicio.component';
import {LoginComponent} from './login/login.component';
import {RegistroComponent} from './registro/registro.component';
import {PerfilComponent} from './perfil/perfil.component';
import {TestsComponent} from './tests/tests.component';
import {PreguntasComponent} from './preguntas/preguntas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },

  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'tests', component: TestsComponent },
  { path: 'preguntas', component: PreguntasComponent },




  // Opcional: ruta de "no encontrado"
  { path: '**', redirectTo: '/inicio' }
];

