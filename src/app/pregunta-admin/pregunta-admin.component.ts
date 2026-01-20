import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pregunta } from '../modelos/pregunta';
import { PreguntaServicio } from '../servicios/pregunta-servicio';
import { OpcionServicio } from '../servicios/opcion-servicio';

@Component({
  selector: 'app-pregunta-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pregunta-admin.component.html'
})
export class PreguntaAdminComponent implements OnInit {
  testId!: number;
  preguntas: Pregunta[] = [];

  // Control de Modales
  modalTipo: 'pregunta' | 'opcion' | null = null;
  preguntaSeleccionada: Pregunta | null = null;

  // Objetos para los formularios
  nuevaPregunta = { texto: '', imagen: '' };
  nuevaOpcion = { texto: '', esCorrecta: false };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private preguntasServicio: PreguntaServicio,
    private opcionesServicio: OpcionServicio
  ) {}

  ngOnInit(): void {
    this.testId = Number(this.route.snapshot.paramMap.get('testId'));
    this.cargarPreguntas();
  }

  cargarPreguntas() {
    this.preguntasServicio.listarPorTest(this.testId).subscribe({
      next: (data) => this.preguntas = data,
      error: () => alert('Error cargando preguntas')
    });
  }

  // --- LÓGICA PREGUNTAS ---
  abrirModalPregunta() {
    this.modalTipo = 'pregunta';
    this.nuevaPregunta = { texto: '', imagen: '' };
  }

  guardarPregunta() {
    if (!this.nuevaPregunta.texto) return alert('El texto es obligatorio');

    const dto = { ...this.nuevaPregunta, testId: this.testId };
    this.preguntasServicio.crear(dto).subscribe({
      next: () => {
        this.cargarPreguntas();
        this.cerrarModal();
      },
      error: (err) => console.error(err)
    });
  }

  borrarPregunta(id: number) {
    if (confirm('¿Seguro? Se borrarán también todas sus opciones.')) {
      this.preguntasServicio.eliminar(id).subscribe(() => this.cargarPreguntas());
    }
  }

  // --- LÓGICA OPCIONES ---
  abrirModalOpciones(pregunta: Pregunta) {
    this.preguntaSeleccionada = pregunta;
    this.modalTipo = 'opcion';
    this.nuevaOpcion = { texto: '', esCorrecta: false };
  }

  guardarOpcion() {
    if (!this.preguntaSeleccionada || !this.nuevaOpcion.texto) return;

    const dto = {
      ...this.nuevaOpcion,
      preguntaId: this.preguntaSeleccionada.id
    };

    this.opcionesServicio.crear(dto).subscribe({
      next: () => {
        this.cargarPreguntas(); // Recargamos para ver la nueva opción en la lista
        this.nuevaOpcion = { texto: '', esCorrecta: false };
      },
      error: (err) => alert('Error al crear opción')
    });
  }

  borrarOpcion(id: number | undefined) {
    if (!id) return;
    this.opcionesServicio.eliminar(id).subscribe(() => this.cargarPreguntas());
  }

  cerrarModal() {
    this.modalTipo = null;
    this.preguntaSeleccionada = null;
  }

  volver() {
    this.router.navigate(['/test-admin']);
  }
}
