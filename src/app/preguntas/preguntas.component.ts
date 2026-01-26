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
    // 1. Validar que todas las preguntas tengan respuesta (Opcional pero recomendado)
    const todasRespondidas = this.preguntas.every(p => p.seleccionada !== null);
    if (!todasRespondidas && this.puntaje === null) {
      Swal.fire('Atención', 'Por favor, responde todas las preguntas antes de finalizar.', 'warning');
      return;
    }

    // 2. Calcular aciertos
    let totalAciertos = 0;
    this.preguntas.forEach(pregunta => {
      // Importante: Verifica si en tu BD el campo es 'correcta' o 'esCorrecta'
      if (pregunta.seleccionada?.correcta === true || pregunta.seleccionada?.esCorrecta === true) {
        totalAciertos += 1;
      }
    });

    this.puntaje = totalAciertos;

    // 3. Guardar en Base de Datos
    const uId = this.authServicio.getCurrentUserId();
    const tId = this.testId;

    if (uId && tId) {
      this.authServicio.sumarPuntosAlCliente(uId, tId, totalAciertos).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Test Guardado!',
            text: `Has conseguido ${totalAciertos} aciertos.`,
            icon: 'success',
            confirmButtonColor: '#81B29A'
          });
        },
        error: (err) => {
          console.error("Error al guardar puntaje:", err);
          Swal.fire('Error', 'Se calculó tu nota pero no se pudo conectar con el perfil.', 'error');
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
