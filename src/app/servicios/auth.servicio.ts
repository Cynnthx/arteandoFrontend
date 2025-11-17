import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {AuthenticationDTO, Usuario} from '../modelos/usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  // Registro de usuario
  registrar(usuario: Usuario): Observable<AuthenticationDTO> {
    return this.http.post<AuthenticationDTO>(`${this.apiUrl}/registro`, usuario).pipe(
      tap(resp => {
        if (resp.token) localStorage.setItem(this.tokenKey, resp.token);
      })
    );
  }

  // Login
  login(usuario: Usuario): Observable<AuthenticationDTO> {
    return this.http.post<AuthenticationDTO>(`${this.apiUrl}/login`, usuario).pipe(
      tap(resp => {
        if (resp.token) localStorage.setItem(this.tokenKey, resp.token);
      })
    );
  }

  // Obtener perfil del usuario autenticado
  obtenerPerfil(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem(this.tokenKey) || ''}`
    });
    return this.http.get(`${this.apiUrl}/perfil`, { headers });
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Saber si el usuario está logueado
  estaAutenticado(): boolean {
    return !!this.getToken();
  }
}
