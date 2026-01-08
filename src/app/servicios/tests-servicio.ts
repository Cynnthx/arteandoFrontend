import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Tests} from '../modelos/tests';

@Injectable({
  providedIn: 'root'
})
export class TestsServicio {

  private apiUrl = 'http://localhost:8080/tests';

  constructor(private http: HttpClient) {}

  // Obtener todos los tests
  listarTests(): Observable<Tests[]> {
    return this.http.get<Tests[]>(`${this.apiUrl}/listar`);
  }

  // Obtener test por id
  obtenerTest(id: number): Observable<Tests> {
    return this.http.get<Tests>(`${this.apiUrl}/${id}`);
  }

  // Crear test
  crearTest(test: {
    titulo: string;
    descripcion: string;
    dificultad: string;
    categoriaId: number;
  }): Observable<Tests> {
    return this.http.post<Tests>(`${this.apiUrl}/crear`, test);
  }

  // Actualizar test
  actualizarTest(id: number, test: {
    titulo: string;
    descripcion: string;
    dificultad: string;
    categoriaId: number;
  }): Observable<Tests> {
    return this.http.put<Tests>(`${this.apiUrl}/${id}`, test);
  }

  // Eliminar test
  eliminarTest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
