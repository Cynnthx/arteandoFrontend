import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Categoria} from '../modelos/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServicio {

  private apiUrl = 'http://localhost:8080/categorias';

  constructor(private http: HttpClient) {}

  // =========================
  // LISTAR CATEGORÍAS
  // =========================
  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/listar`);
  }

  // =========================
  // OBTENER POR ID
  // =========================
  obtenerPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // CREAR CATEGORÍA
  // =========================
  crear(nombre: string): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, { nombre });
  }

  // =========================
  // EDITAR CATEGORÍA
  // =========================
  actualizar(id: number, nombre: string): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, { nombre });
  }

  // =========================
  // ELIMINAR CATEGORÍA
  // =========================
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
