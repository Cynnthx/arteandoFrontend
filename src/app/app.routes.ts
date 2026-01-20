import { Routes } from '@angular/router';
import {InicioComponent} from './inicio/inicio.component';
import {LoginComponent} from './login/login.component';
import {RegistroComponent} from './registro/registro.component';
import {PerfilComponent} from './perfil/perfil.component';
import {TestsComponent} from './tests/tests.component';
import {PreguntasComponent} from './preguntas/preguntas.component';
import {TestAdminComponent} from './test-admin/test-admin.component';
import {adminGuard} from './seguridad/admin.guard';
import {PreguntaAdminComponent} from './pregunta-admin/pregunta-admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'tests', component: TestsComponent },
  { path: 'preguntas/:id', component: PreguntasComponent },

// Rutas de administración protegidas
  { path: 'test-admin', component: TestAdminComponent, canActivate: [adminGuard] },
  { path: 'test-admin/preguntas/:testId', component: PreguntaAdminComponent, canActivate: [adminGuard] },



  { path: '**', redirectTo: '/inicio' },







  // Opcional: ruta de "no encontrado"
  { path: '**', redirectTo: '/inicio' }
];

