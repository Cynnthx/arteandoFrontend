import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {ActualizarHeaderService} from './actualizar-header.servicio';
import {ErrorHandlerService} from './error-handler-service';
import { jwtDecode } from 'jwt-decode';
import {LoginDTO} from '../login/login.component';



export interface LoginResponse {
  token: string;
  mensaje: string;
  email: string;
  usuarioId: number;
  rol: string;
  nombreUsuario: string;
  nombreCompleto: string;
  clienteId?: number; // (con el ? por si es admin)
}

interface CustomJwtPayload {
  userId: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServicio {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private readonly userKey = 'auth_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private actualizarHeader: ActualizarHeaderService
  ) {}


  login(data: LoginDTO): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  registro(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro/cliente`, userData)
      .pipe(catchError(this.errorHandler.handleError));
  }


  getRole(): string | null {
    const token = this.getToken(); // <--- metodo centralizado que busca 'auth_token'
    if (token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        return decodedToken.rol;
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
    return null;
  }

  getCurrentUserId(): number | null {
    return localStorage.getItem('usuarioId')
      ? parseInt(localStorage.getItem('usuarioId')!, 10)
      : null;
  }


  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }


  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }


  logout(): void {
    // aqui borramos lo relacionado con la sesion iniciada
    localStorage.removeItem('auth_token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('email');

    this.router.navigate(['/login']);

    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has salido de tu cuenta correctamente',
      icon: 'success',
      confirmButtonText: 'OK',
      background: '#F9F4E3',
      color: '#7A6448'
    });
    this.actualizarHeader.triggerRefreshHeader();
  }


  sumarPuntosAlCliente(usuarioId: number, testId: number, puntos: number): Observable<any> {
    const url = `http://localhost:8080/api/puntajes-usuario/crear`;
    const body = {
      usuarioId: usuarioId,
      testId: testId,
      puntaje: puntos
    };
    return this.http.post(url, body, { headers: this.getAuthHeaders() });
  }

  getPuntajeTotal(usuarioId: number): Observable<number> {
    return this.http.get<number>(
      `http://localhost:8080/api/puntajes-usuario/usuario/${usuarioId}/total`,
      { headers: this.getAuthHeaders() }
    );
  }


  getHistorialPuntajes(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8080/api/puntajes-usuario/usuario/${usuarioId}`,
      { headers: this.getAuthHeaders() }
    );
  }

// Asegúrate de guardar el clienteId en el login
  getClienteId(): number | null {
    const id = localStorage.getItem('clienteId');
    return id ? parseInt(id, 10) : null;
  }

}
