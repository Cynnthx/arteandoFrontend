import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pregunta } from '../modelos/pregunta';

@Injectable({
  providedIn: 'root'
})
export class PreguntasServicio {
  private apiUrl = 'http://localhost:8080/api/preguntas';

  constructor(private http: HttpClient) {}

  listarPorTest(testId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.apiUrl}/test/${testId}`);
  }

  // Para admin: crear, actualizar, eliminar
  crear(dto: { texto: string; imagen?: string; testId: number }) {
    return this.http.post<Pregunta>(`${this.apiUrl}/crear`, dto);
  }

  actualizar(id: number, dto: { texto: string; imagen?: string; testId: number }) {
    return this.http.put<Pregunta>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
