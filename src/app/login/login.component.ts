import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../servicios/auth.servicio';
import {AuthenticationDTO, Rol, Usuario} from '../modelos/usuario';

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

  abrirModal(tipo: string) {
    this.modalActivo = tipo;
  }

  cerrarModal() {
    this.modalActivo = null;
  }

  imgTop = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get contrasena() {
    return this.loginForm.get('contrasena');
  }
  onLogin() {
    // Si el formulario NO es válido → mostrar error, NO navegar
    if (!this.loginForm.valid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      return;
    }

    // Si es válido → navegar a perfil
    this.router.navigate(['/perfil']);


    const usuario: Usuario = {
      email: this.loginForm.value.email,
      contrasena: this.loginForm.value.contrasena,
      nombreUsuario: '', // obligatorio en tu interfaz, puedes dejar vacío
      rol: Rol.CLIENTE
    };

    this.authService.login(usuario).subscribe({
      next: (response: AuthenticationDTO) => {
        console.log("Respuesta backend:", response);

        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.router.navigate(['/events']); // redirigir al login exitoso
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
