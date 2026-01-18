import {Component, Injectable, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {TestAdminServicio} from '../servicios/test-admin-servicio';
import {CategoriaServicio} from '../servicios/categoria-servicio';


interface Categoria {
  id: number;
  nombre: string;
}

interface TestAdmin {
  id: number;
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

  formTest: TestAdmin = {
    id: 0,
    titulo: '',
    descripcion: '',
    dificultad: '',
    categoriaId: 0
  };

  constructor(
    private testAdminServicio: TestAdminServicio,
    private categoriaServicio: CategoriaServicio
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
      error: () => {
        alert('Error cargando los tests');
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaServicio.listar().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: () => {
        alert('Error cargando las categorías');
      }
    });
  }

  // ======================
  // MODAL
  // ======================

  abrirCrear(): void {
    this.editando = false;
    this.formTest = {
      id: 0,
      titulo: '',
      descripcion: '',
      dificultad: '',
      categoriaId: 0
    };
    this.modalAbierto = true;
  }

  editar(test: TestAdmin): void {
    this.editando = true;
    this.formTest = { ...test };
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  // ======================
  // CRUD
  // ======================

  guardar(): void {
    const payload = {
      titulo: this.formTest.titulo,
      descripcion: this.formTest.descripcion,
      dificultad: this.formTest.dificultad,
      categoriaId: this.formTest.categoriaId
    };

    if (this.editando) {
      this.testAdminServicio.actualizar(this.formTest.id, payload).subscribe({
        next: () => {
          this.cargarTests();
          this.cerrarModal();
        },
        error: () => {
          alert('Error actualizando el test');
        }
      });
    } else {
      this.testAdminServicio.crear(payload).subscribe({
        next: () => {
          this.cargarTests();
          this.cerrarModal();
        },
        error: () => {
          alert('Error creando el test');
        }
      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar este test?')) return;

    this.testAdminServicio.eliminar(id).subscribe({
      next: () => {
        this.cargarTests();
      },
      error: () => {
        alert('Error eliminando el test');
      }
    });
  }

  getNombreCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nombre ?? '';
  }
}
