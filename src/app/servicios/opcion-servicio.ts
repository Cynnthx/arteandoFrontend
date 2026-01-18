import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Opcion } from '../modelos/opcion';

@Injectable({
  providedIn: 'root'
})
export class OpcionServicio {
  private apiUrl = 'http://localhost:8080/api/opciones';

  constructor(private http: HttpClient) {}

  listarPorPregunta(preguntaId: number): Observable<Opcion[]> {
    return this.http.get<Opcion[]>(`${this.apiUrl}/pregunta/${preguntaId}`);
  }

  crear(dto: { texto: string; esCorrecta: boolean; preguntaId: number }) {
    return this.http.post<Opcion>(`${this.apiUrl}/crear`, dto);
  }

  actualizar(id: number, dto: { texto: string; esCorrecta: boolean; preguntaId: number }) {
    return this.http.put<Opcion>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
