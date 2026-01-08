import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ErrorHandlerService} from './error-handler-service';
import {AuthServicio} from './auth.servicio';


@Injectable({
  providedIn: 'root'
})
export class PerfilServicio {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(
    private http: HttpClient,
    private authService: AuthServicio,
    private errorHandler: ErrorHandlerService
  ) {}

  // Obtener perfil del cliente
  getMiPerfil(): Observable<any> {

    const clienteId = localStorage.getItem('usuarioId');


    return this.http.get<any>(`${this.apiUrl}/usuario/${clienteId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }


// Editar perfil
  editarPerfil(cliente: any) {
    return this.http.put(`${this.apiUrl}/usuario/${cliente.id}`, cliente, {
      headers: this.authService.getAuthHeaders()
    });
  }





}
