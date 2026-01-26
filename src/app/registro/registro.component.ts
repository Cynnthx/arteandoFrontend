import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServicio } from '../servicios/auth.servicio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class RegistroComponent {
  // Usamos ! para indicar que se inicializará en el constructor
  registerForm!: FormGroup;
  errorMessage = '';
  modalActivo: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServicio,
    public router: Router
  ) {
    this.initForm();
  }

  private initForm() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]], // Campo Nickname
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]$/)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      foto: [''],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60)]],
      confirmarContrasena: ['', Validators.required]
    }, {
      // Importante: usar this para referenciar el metodo
      validators: this.passwordMatchValidator
    });
  }

  // Validador de contraseñas iguales
  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('contrasena')?.value;
    const confirm = form.get('confirmarContrasena')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      const rawData = this.registerForm.value;

      const registroDto = {
        nombre: rawData.nombre,
        apellidos: rawData.apellidos,
        nombreUsuario: rawData.nombreUsuario,
        dni: rawData.dni.toUpperCase(),
        direccion: rawData.direccion,
        email: rawData.email,
        contrasena: rawData.contrasena,
        rol: 'cliente',
        // SI la foto está vacía, enviamos una cadena vacía o una URL por defecto
        // Esto evita el error de "valor nulo" en la base de datos
        foto: rawData.foto || 'ojo.jpg'
      };

      this.authService.registro(registroDto).subscribe({
        next: () => {
          Swal.fire('¡Éxito!', 'Cuenta creada correctamente.', 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Ahora el error 403 o 500 se mostrará mejor aquí
          console.error("Detalles del error:", err);
          this.errorMessage = 'Hubo un problema con el servidor. Inténtalo de nuevo.';
        }
      });
    }
  }

  abrirModal(tipo: string) {
    this.modalActivo = tipo;
  }
  cerrarModal() {
    this.modalActivo = null;
  }
}
