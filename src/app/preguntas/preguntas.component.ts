import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TestsServicio } from '../servicios/tests-servicio';
import { AuthServicio } from '../servicios/auth.servicio'; // Importación necesaria
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PreguntasComponent implements OnInit {
  testId!: number;
  preguntas: any[] = [];
  tituloTest: string = '';
  puntaje: number | null = null;
  modalAviso: boolean = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private testsServicio: TestsServicio,
    private authServicio: AuthServicio // CORRECCIÓN: Inyectado correctamente
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.testId = Number(idParam);
      this.cargarPreguntasReal();
    }
  }

  cargarPreguntasReal() {
    this.testsServicio.obtenerTestCompleto(this.testId).subscribe({
      next: (data) => {
        this.tituloTest = data.titulo;
        // Mapeamos las preguntas asegurándonos de que tengan un campo para la selección
        this.preguntas = data.preguntas.map((p: any) => ({ ...p, seleccionada: null }));
      },
      error: (err) => console.error("Error cargando el test:", err)
    });
  }

  seleccionarOpcion(preguntaIndex: number, opcion: any) {
    this.preguntas[preguntaIndex].seleccionada = opcion;
  }

  finalizarTest() {
    // esto es para validar que todas estén respondidas (MANTENER SIEMPRE)
    const todasRespondidas = this.preguntas.every(p => p.seleccionada !== null);

    if (!todasRespondidas) {
      Swal.fire('Atención', 'Por favor, responde todas las preguntas antes de finalizar.', 'warning');
      return;
    }

    // aqui calculamos aciertos
    let totalAciertos = 0;
    this.preguntas.forEach(pregunta => {
      // IMPORTANTE: Accedemos a 'esCorrecta' tal cual viene en el OpcionDTO
      if (pregunta.seleccionada && pregunta.seleccionada.esCorrecta === true) {
        totalAciertos += 1;
      }
    });

    this.puntaje = totalAciertos;

    // guardamos en Base de Datos usando el ID del cliente logueado
    const uId = this.authServicio.getCurrentUserId();
    const tId = this.testId;

    if (uId && tId) {
      // Este método debe impactar en la tabla 'puntaje_usuario' de tu SQL
      this.authServicio.sumarPuntosAlCliente(uId, tId, totalAciertos).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Test Finalizado!',
            text: `Has conseguido ${totalAciertos} aciertos. Tu perfil ha sido actualizado.`,
            icon: 'success',
            confirmButtonColor: '#81B29A'
          });
          // Opcional: Recargar el historial aquí si fuera necesario
        },
        error: (err) => {
          console.error("Error al guardar:", err);
          Swal.fire('Error', 'No se pudo guardar tu puntuación en el perfil.', 'error');
        }
      });
    }
  }

  irATests() {
    if (this.puntaje === null) {
      this.modalAviso = true;
    } else {
      this.router.navigate(['/tests']);
    }
  }

  cerrarAviso() { this.modalAviso = false; }
}
