import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServicio } from './auth.servicio';

@Injectable({
  providedIn: 'root'
})
export class PerfilServicio {
  // se apunta a /api/usuarios que es donde tengo mi metodo obtenerPerfilUsuario()
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(
    private http: HttpClient,
    private authService: AuthServicio
  ) {}

  getMiPerfil(): Observable<any> {
    // Uso el endpoint '/perfil' que tengo en el UsuarioControlador de Java
    return this.http.get<any>(`${this.apiUrl}/perfil`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  editarPerfil(datosActualizados: any): Observable<any> {
    // Apunto al PUT de /api/usuarios/perfil
    return this.http.put<any>(`${this.apiUrl}/perfil`, datosActualizados, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
