import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServicio} from '../servicios/auth.servicio';
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

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log("Respuesta backend:", response);

        if (response.token) {
          // Guardamos token y datos importantes
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('email', response.email);
          localStorage.setItem('usuarioId', response.usuarioId.toString());
          localStorage.setItem('rol', response.rol);

          // Redirigir a perfil
          this.router.navigate(['/perfil']);
        } else if (response.mensaje) {
          this.errorMessage = response.mensaje;
        } else {
          this.errorMessage = 'No se pudo iniciar sesión.';
        }
      },
      error: (err) => {
        console.error("Error login:", err);
        this.errorMessage = 'Email o contraseña incorrectos. Por favor, inténtelo de nuevo.';
      }
    });

  }
}
