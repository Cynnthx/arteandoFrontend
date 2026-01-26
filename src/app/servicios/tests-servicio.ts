import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tests } from '../modelos/tests';

@Injectable({
  providedIn: 'root'
})
export class TestsServicio {

  private apiUrl = 'http://localhost:8080/api/tests';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Solo dejamos lo que el cliente realmente usa en la interfaz
  listarTests(): Observable<Tests[]> {
    return this.http.get<Tests[]>(`${this.apiUrl}/listar`, { headers: this.getHeaders() });
  }

  obtenerTest(id: number): Observable<Tests> {
    return this.http.get<Tests>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  obtenerTestCompleto(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/${id}/completo`, { headers });
  }
}
