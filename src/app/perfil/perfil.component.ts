import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para el ngModel del HTML
import { Usuario, TestUsuario } from '../modelos/usuario';
import { PerfilServicio } from '../servicios/perfil-servicio';
import { AuthServicio } from '../servicios/auth.servicio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  usuario: Usuario | null = null;
  modalActivo: string | null = null;
  imgTop = true;
  profileImage: string = 'logo4-Photoroom.png';
  loading: boolean = false;
  error: string | null = null;
  editMode = false;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private perfilServicio: PerfilServicio,
    private authServicio: AuthServicio,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.perfilServicio.getMiPerfil().subscribe({
      next: (data) => {
        this.usuario = data;
        this.profileImage = data.foto || 'logo4-Photoroom.png';
      },
      error: (err) => {
        console.error('Error al cargar perfil', err);
        this.router.navigate(['/login']);
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.cargarPerfil(); // Cancela y recarga datos originales
    }
  }

  // Manejo de imagen
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        if (this.usuario) this.usuario.foto = this.profileImage;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCambios(): void {
    const userId = this.authServicio.getCurrentUserId();
    if (!userId || !this.usuario) {
      this.error = 'Sesión inválida.';
      return;
    }

    this.loading = true;
    this.actualizarDatosUsuario();
  }

  private actualizarDatosUsuario(): void {
    this.perfilServicio.editarPerfil(this.usuario).subscribe({
      next: (usuarioActualizado) => {
        this.loading = false;
        this.editMode = false;
        this.usuario = usuarioActualizado;
        Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
      },
      error: (err) => {
        this.loading = false;
        this.error = 'No se pudieron guardar los cambios.';
      }
    });
  }

  // Getters para la vista
  get tests(): TestUsuario[] { return this.usuario?.tests || []; }
  get totalPuntos(): number { return this.tests.reduce((sum, t) => sum + t.puntaje, 0); }
  get barraProgreso(): number { return Math.min((this.totalPuntos / 20) * 100, 100); }

  abrirModal(tipo: string) { this.modalActivo = tipo; }
  cerrarModal() { this.modalActivo = null; }

  cerrarSesion() {
    this.authServicio.logout();
  }
}
