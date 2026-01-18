import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario, TestUsuario } from '../modelos/usuario';
import { PerfilServicio } from '../servicios/perfil-servicio';
import {AuthServicio} from '../servicios/auth.servicio';




@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    public router: Router,

  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.perfilServicio.getMiPerfil().subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        this.profileImage = usuario.foto || '/logo4-Photoroom.png';
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
      this.cargarPerfil();
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Funciones para manejar imagen
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
        localStorage.setItem('profileImage', this.profileImage);
      };
      reader.readAsDataURL(file);
    }
  }

  abrirModal(tipo: string) { this.modalActivo = tipo; }
  cerrarModal() { this.modalActivo = null; }

  // Tests y barra de progreso
  get tests(): TestUsuario[] {
    return this.usuario?.tests || [];
  }

  get totalPuntos(): number {
    return this.tests.reduce((sum, t) => sum + t.puntaje, 0);
  }

  get barraProgreso(): number {
    const maxPuntos = 20; // Ajustable
    return Math.min((this.totalPuntos / maxPuntos) * 100, 100);
  }


  private esDniNieValido(dniNie: string): boolean {
    if (!dniNie) return false;

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    dniNie = dniNie.toUpperCase().trim();

    // NIE
    if (/^[XYZ]\d{7}[A-Z]$/.test(dniNie)) {
      const letraInicial = dniNie.charAt(0);
      const numeroBase = {
        'X': '0',
        'Y': '1',
        'Z': '2'
      }[letraInicial] + dniNie.substring(1, 8);

      const resto = parseInt(numeroBase) % 23;
      return dniNie.charAt(8) === letras.charAt(resto);
    }

    // DNI
    if (/^\d{8}[A-Z]$/.test(dniNie)) {
      const numero = parseInt(dniNie.substring(0, 8));
      const resto = numero % 23;
      return dniNie.charAt(8) === letras.charAt(resto);
    }

    return false;
  }


  guardarCambios(): void {
    const userId = this.authServicio.getCurrentUserId();
    if (!userId || !this.usuario) {
      this.error = 'No se pudo identificar tu usuario. Por favor, vuelve a iniciar sesión.';
      return;
    }

    const dni = this.usuario.dni || '';
    if (!this.esDniNieValido(dni)) {
      this.error = 'DNI o NIE incorrecto.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.actualizarDatosUsuario();
  }


  private actualizarDatosUsuario(): void {
    const userId = this.authServicio.getCurrentUserId();
    if (!userId || !this.usuario) {
      this.handleError(null, 'Sesión inválida. Vuelve a iniciar sesión.');
      return;
    }

    this.usuario.id = userId;

    this.perfilServicio.editarPerfil(this.usuario).subscribe({
      next: () => {
        this.loading = false;
        this.error = null;
      },
      error: (err) => this.handleError(err, 'Error al actualizar los datos')
    });
  }


  private handleError(error: any, defaultMessage: string): void {
    this.loading = false;
    this.error = error?.message || defaultMessage;
    // console.error('Error:', error);
  }




  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('productosComprar');
    this.router.navigate(['/login']);
  }

}
