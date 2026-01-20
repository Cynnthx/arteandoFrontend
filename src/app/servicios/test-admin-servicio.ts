import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestCrear } from '../modelos/test-crear';
import { TestAdmin } from '../modelos/test-admin';
import { AuthServicio } from './auth.servicio';

@Injectable({
  providedIn: 'root'
})
export class TestAdminServicio {
  private apiUrl = 'http://localhost:8080/api/tests';

  constructor(
    private http: HttpClient,
    private authService: AuthServicio
  ) {}

  /**
   * Lista todos los tests.
   * Generalmente este endpoint es público o requiere rol admin.
   */
  listar(): Observable<TestAdmin[]> {
    return this.http.get<TestAdmin[]>(`${this.apiUrl}/listar`);
  }

  /**
   * Crea un nuevo test.
   * Usa los headers centralizados del AuthServicio.
   */
  crear(test: TestCrear): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, test, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Actualiza un test existente.
   * La URL sigue el patrón: /api/tests/{id}
   */
  actualizar(id: number, test: TestCrear): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, test, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Elimina un test por ID.
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
