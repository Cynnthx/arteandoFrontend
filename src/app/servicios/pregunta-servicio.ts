import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pregunta } from '../modelos/pregunta';
import { AuthServicio } from './auth.servicio';

@Injectable({
  providedIn: 'root'
})
export class PreguntaServicio {
  private apiUrl = 'http://localhost:8080/api/preguntas';

  constructor(
    private http: HttpClient,
    private authService: AuthServicio
  ) {}

  /**
   * Obtener preguntas con opciones.
   */
  listarPorTest(testId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.apiUrl}/test/${testId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Crear una pregunta (Solo Admin)
   */
  crear(dto: { texto: string; imagen?: string; testId: number }): Observable<Pregunta> {
    return this.http.post<Pregunta>(`${this.apiUrl}/crear`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Actualizar una pregunta (Solo Admin)
   */
  actualizar(id: number, dto: { texto: string; imagen?: string; testId: number }): Observable<Pregunta> {
    return this.http.put<Pregunta>(`${this.apiUrl}/${id}`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Eliminar una pregunta (Solo Admin)
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
