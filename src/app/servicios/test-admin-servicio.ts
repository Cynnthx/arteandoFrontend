import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TestAdmin} from '../modelos/test-admin';

@Injectable({
  providedIn: 'root'
})
export class TestAdminServicio {

  private apiUrl = 'http://localhost:8080/tests';

  constructor(private http: HttpClient) {}


  listar(): Observable<TestAdmin[]> {
    return this.http.get<TestAdmin[]>(`${this.apiUrl}/listar`);
  }


  crear(test: Omit<TestAdmin, 'id'>): Observable<TestAdmin> {
    return this.http.post<TestAdmin>(`${this.apiUrl}/crear`, test);
  }


  actualizar(id: number, test: Omit<TestAdmin, 'id'>): Observable<TestAdmin> {
    return this.http.put<TestAdmin>(`${this.apiUrl}/${id}`, test);
  }


  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerPorId(id: number): Observable<TestAdmin> {
    return this.http.get<TestAdmin>(`${this.apiUrl}/${id}`);
  }
}
