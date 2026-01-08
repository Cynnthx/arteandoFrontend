import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthServicio} from '../servicios/auth.servicio';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class RegistroComponent {
  registerForm: FormGroup;
  errorMessage = '';
  modalActivo: string | null = null;


  abrirModal(tipo: string) {
    this.modalActivo = tipo;
  }

  cerrarModal() {
    this.modalActivo = null;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthServicio,
    public router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]$/)]],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      foto: [''],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private esDniValido(dni: string): boolean {
    if (!dni) return false;
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    dni = dni.toUpperCase().trim();
    if (/^[0-9]{8}[A-Z]$/.test(dni)) {
      const numero = parseInt(dni.substring(0, 8));
      const resto = numero % 23;
      return dni.charAt(8) === letras.charAt(resto);
    }
    return false;
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('contrasena')?.value;
    const confirm = form.get('confirmarContrasena')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onRegister() {
    if (!this.esDniValido(this.registerForm.value.dni)) {
      this.errorMessage = 'Debes ingresar un DNI válido';
      return;
    }

    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value };
      delete formData.confirmarContrasena;
      formData.rol = 'cliente';

      this.authService.registro(formData).subscribe({
        next: () => this.router.navigate(['/login'], { queryParams: { registered: 'true' } }),
        error: (err) => this.errorMessage = err?.error?.mensaje || 'Error al registrar.'
      });
    } else {
      this.errorMessage = 'Completa todos los campos correctamente.';
    }
  }
}
