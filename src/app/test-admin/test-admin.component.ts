import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestAdminServicio } from '../servicios/test-admin-servicio';
import { CategoriaServicio } from '../servicios/categoria-servicio';
import { Categoria } from '../modelos/categoria';
import {Router} from '@angular/router';

// Lo que devuelve el backend al listar
export interface TestAdmin {
  id: number;
  titulo: string;
  descripcion: string;
  dificultad: string;
  categoriaNombre: string;
}

// Lo que el backend espera al crear
export interface TestCrear {
  titulo: string;
  descripcion: string;
  dificultad: string;
  categoriaId: number;

}

@Component({
  selector: 'app-test-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-admin.component.html'
})
export class TestAdminComponent implements OnInit {

  modalAbierto = false;
  editando = false;

  categorias: Categoria[] = [];
  tests: TestAdmin[] = [];

  // Formulario simple para crear/editar
  formTest = {
    id: 0,
    titulo: '',
    descripcion: '',
    dificultad: '',
    categoriaId: 0
  };

  constructor(
    private testAdminServicio: TestAdminServicio,
    private categoriaServicio: CategoriaServicio,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTests();
    this.cargarCategorias();
  }

  // ======================
  // CARGAS DESDE BACKEND
  // ======================

  cargarTests(): void {
    this.testAdminServicio.listar().subscribe({
      next: (data) => {
        this.tests = data;
      },
      error: () => alert('Error cargando los tests')
    });
  }

  cargarCategorias(): void {
    this.categoriaServicio.listar().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        alert('Error cargando las categorías');
      }
    });
  }

  gestionarPreguntas(testId: number) {
    this.router.navigate(['/test-admin/preguntas', testId]);
  }

  // ======================
  // MODAL
  // ======================

  abrirCrear(): void {
    this.editando = false;
    this.formTest = { id: 0, titulo: '', descripcion: '', dificultad: '', categoriaId: 0 };
    this.modalAbierto = true;
  }

  editar(test: TestAdmin): void {
    this.editando = true;
    this.formTest = {
      id: test.id,
      titulo: test.titulo,
      descripcion: test.descripcion,
      dificultad: test.dificultad,
      // AQUI ES DONDE DEBEMOS CONVERTIR categoriaNombre → categoriaId
      categoriaId: this.categorias.find(c => c.nombre === test.categoriaNombre)?.id || 0
    };
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  // CRUD para guardar
  guardar(): void {
    if (!this.formTest.titulo || !this.formTest.descripcion || !this.formTest.dificultad || this.formTest.categoriaId === 0) {
      alert('Completa todos los campos');
      return;
    }

    const testDTO: TestCrear = {
      titulo: this.formTest.titulo.trim(),
      descripcion: this.formTest.descripcion.trim(),
      dificultad: this.formTest.dificultad,
      categoriaId: Number(this.formTest.categoriaId)
    };

    if (this.editando) {
      // Lógica para EDITAR
      this.testAdminServicio.actualizar(this.formTest.id, testDTO).subscribe({
        next: () => {
          this.cargarTests();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error editando:', err);
          alert('Error al actualizar el test');
        }
      });
    } else {
      // Lógica para CREAR
      this.testAdminServicio.crear(testDTO).subscribe({
        next: () => {
          this.cargarTests();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error creando:', err);
          alert('Error al crear el test');
        }
      });
    }
  }



  eliminar(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar este test?')) return;

    this.testAdminServicio.eliminar(id).subscribe({
      next: () => this.cargarTests(),
      error: () => alert('Error eliminando el test')
    });
  }

  // ======================
  // UTILS
  // ======================

  getNombreCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nombre || '';
  }


}
