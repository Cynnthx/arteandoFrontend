import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Opcion {
  texto: string;
  correcta: boolean;
}

interface Pregunta {
  texto: string;
  imagen: string;
  opciones: Opcion[];
  seleccionada?: Opcion | null;
}

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PreguntasComponent {
  modalActivo: string | null = null;
  puntaje: number | null = null;
  modalAviso: boolean = false; // Para mostrar el modal de aviso

//no finalizado test
  irATests() {
    if (this.puntaje === null) {
      // Si no ha finalizado el test
      this.modalAviso = true;
    } else {
      this.router.navigate(['/tests']);
    }
  }

// Cerrar modal
  cerrarAviso() {
    this.modalAviso = false;
  }


  preguntas: Pregunta[] = [
    {
      texto: '¿En qué ciudad se encuentra la Alhambra?',
      imagen: '/alhambra.jpg',
      opciones: [
        { texto: 'Granada', correcta: true },
        { texto: 'Sevilla', correcta: false },
        { texto: 'Barcelona', correcta: false },
        { texto: 'Madrid', correcta: false },
      ],
    },
    {
      texto: '¿Qué estilo arquitectónico predomina en la Sagrada Familia?',
      imagen: '/sagrada.jpg',
      opciones: [
        { texto: 'Gótico', correcta: false },
        { texto: 'Modernista', correcta: true },
        { texto: 'Renacentista', correcta: false },
        { texto: 'Barroco', correcta: false },
      ],
    },
    {
      texto: '¿Dónde se encuentra el Coliseo?',
      imagen: '/coliseo.jpg',
      opciones: [
        { texto: 'Roma', correcta: true },
        { texto: 'Atenas', correcta: false },
        { texto: 'Florencia', correcta: false },
        { texto: 'París', correcta: false },
      ],
    },
    {
      texto: '¿Qué ciudad es famosa por sus canales y arquitectura renacentista?',
      imagen: '/venecia.jpg',
      opciones: [
        { texto: 'Venecia', correcta: true },
        { texto: 'Ámsterdam', correcta: false },
        { texto: 'Lisboa', correcta: false },
        { texto: 'Brujas', correcta: false },
      ],
    },
    {
      texto: '¿Qué estilo arquitectónico se ve en el Partenón?',
      imagen: '/partenon-atenas.jpg',
      opciones: [
        { texto: 'Dórico', correcta: true },
        { texto: 'Corintio', correcta: false },
        { texto: 'Gótico', correcta: false },
        { texto: 'Románico', correcta: false },
      ],
    },
    {
      texto: '¿Cuál es la función principal del Taj Mahal?',
      imagen: '/mahal.jpg',
      opciones: [
        { texto: 'Palacio', correcta: false },
        { texto: 'Mausoleo', correcta: true },
        { texto: 'Templo', correcta: false },
        { texto: 'Fuerte', correcta: false },
      ],
    },
  ];

  constructor(public router: Router) {}

  abrirModal(tipo: string) {
    this.modalActivo = tipo;
  }

  cerrarModal() {
    this.modalActivo = null;
  }

  seleccionarOpcion(index: number, opcion: Opcion) {
    this.preguntas[index].seleccionada = opcion;
  }

  finalizarTest() {
    let total = 0;
    for (const pregunta of this.preguntas) {
      if (pregunta.seleccionada?.correcta) {
        total += 1;
      }
    }
    this.puntaje = total;
  }
}
