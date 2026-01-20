import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import {Tests} from '../modelos/tests';
import {TestsServicio} from '../servicios/tests-servicio';



@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tests.component.html'
})
export class TestsComponent implements OnInit {

  busqueda: string = '';
  modalActivo: string | null = null;

  tests: Tests[] = [];
  testsFiltrados: Tests[] = [];

  constructor(
    private testsServicio: TestsServicio,
    public router: Router
  ) {}

  ngOnInit() {
    this.cargarTests();
  }

  cargarTests() {
    this.testsServicio.listarTests().subscribe({
      next: (data) => {
        this.tests = data;
        this.testsFiltrados = data;
      },
      error: () => {
        alert('Error cargando los tests');
      }
    });
  }

  filtrarTests() {
    const term = this.busqueda.toLowerCase();
    this.testsFiltrados = this.tests.filter(test =>
      test.titulo.toLowerCase().includes(term)
    );
  }

// Al hacer clic en un test de la lista:
  irAlTest(testId: number) {
    // Redirige a la ruta que tengo definida en Routes: 'preguntas/:id'
    this.router.navigate(['/preguntas', testId]);
  }

  abrirModal(tipo: string) {
    this.modalActivo = tipo;
  }

  cerrarModal() {
    this.modalActivo = null;
  }
}
