import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpcionDTO } from '../modelos/opcion';
import { AuthServicio } from './auth.servicio';

@Injectable({
  providedIn: 'root'
})
export class OpcionServicio {
  private apiUrl = 'http://localhost:8080/api/opciones';

  constructor(
    private http: HttpClient,
    private authService: AuthServicio
  ) {}

  listarPorPregunta(preguntaId: number): Observable<OpcionDTO[]> {
    return this.http.get<OpcionDTO[]>(`${this.apiUrl}/pregunta/${preguntaId}`);
  }

  crear(dto: { texto: string; esCorrecta: boolean; preguntaId: number }): Observable<OpcionDTO> {
    return this.http.post<OpcionDTO>(`${this.apiUrl}/crear`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  actualizar(id: number, dto: { texto: string; esCorrecta: boolean; preguntaId: number }): Observable<OpcionDTO> {
    return this.http.put<OpcionDTO>(`${this.apiUrl}/${id}`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
