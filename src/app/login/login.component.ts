import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthServicio, LoginResponse} from '../servicios/auth.servicio';
import { AuthenticationDTO } from '../modelos/usuario';

// DTO para login
export interface LoginDTO {
  email: string;
  contrasena: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';
  modalActivo: string | null = null;
  imgTop = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServicio,
    public router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get contrasena() { return this.loginForm.get('contrasena'); }

  abrirModal(tipo: string) { this.modalActivo = tipo; }
  cerrarModal() { this.modalActivo = null; }

  onLogin() {

    if (!this.loginForm.valid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      return;
    }

    const loginData: LoginDTO = {
      email: this.loginForm.value.email,
      contrasena: this.loginForm.value.contrasena
    };


    // Llamar al servicio de autenticación
    this.authService.login(loginData).subscribe({
      next: (response: LoginResponse) => {
        if (response.token) {
          // Usamos los nombres de llave que espera tu AuthServicio
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('usuarioId', response.usuarioId.toString());
          localStorage.setItem('rol', response.rol.toLowerCase());
          localStorage.setItem('email', response.email);

          // Si el backend te da el nombre completo, guárdalo para el perfil
          if(response.nombreCompleto) localStorage.setItem('nombreCompleto', response.nombreCompleto);

          // Redirección profesional
          if (response.rol.toLowerCase() === 'admin') {
            this.router.navigate(['/test-admin']);
          } else {
            this.router.navigate(['/perfil']);
          }
        }
      },
      error: (err) => { this.errorMessage = 'Credenciales incorrectas'; }
    });
  }
}
