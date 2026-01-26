import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  puntajeTotal: number = 0;// Se carga desde el backend
  historialPuntajes: any [] = [];
  camposPerfil: Array<{label: string, key: keyof Usuario}> = [
    {label: 'Nombre', key: 'nombre'},
    {label: 'Apellidos', key: 'apellidos'},
    {label: 'DNI', key: 'dni'},
    {label: 'Dirección', key: 'direccion'}
  ];

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private perfilServicio: PerfilServicio,
    private authServicio: AuthServicio,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarPuntajeTotal();
    this.cargarHistorial();
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

  cargarPuntajeTotal(): void {
    const uId = this.authServicio.getCurrentUserId();
    if (uId) {
      this.authServicio.getPuntajeTotal(uId).subscribe({
        next: (total) => {
          this.puntajeTotal = total;
        },
        error: (err) => console.error("Error al cargar puntos", err)
      });
    }
  }

  cargarHistorial() {
    const uId = this.authServicio.getCurrentUserId();
    if (uId) {
      this.authServicio.getHistorialPuntajes(uId).subscribe({
        next: (data) => {
          // Guardamos los últimos 5 por ejemplo, o todos
          this.historialPuntajes = data;
        },
        error: (err) => console.error("Error al cargar historial", err)
      });
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.cargarPerfil();
    }
  }

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
    if (!this.usuario) return;
    this.loading = true;
    this.perfilServicio.editarPerfil(this.usuario).subscribe({
      next: (usuarioActualizado) => {
        this.loading = false;
        this.editMode = false;
        this.usuario = usuarioActualizado;
        Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
      }
    });
  }

  // Getters actualizados
  get tests(): TestUsuario[] { return this.usuario?.tests || []; }

  // Ahora la barra de progreso usa el puntajeTotal del backend
  get barraProgreso(): number {
    return Math.min((this.puntajeTotal / 500) * 100, 100);
  }

  abrirModal(tipo: string) { this.modalActivo = tipo; }
  cerrarModal() { this.modalActivo = null; }

  cerrarSesion() {
    this.authServicio.logout();
  }
}
