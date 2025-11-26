import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class InicioComponent implements OnInit {

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Código de inicialización
  }

  modalActivo: string | null = null;

  abrirModal(tipo: string) {
    this.modalActivo = tipo;
  }

  cerrarModal() {
    this.modalActivo = null;
  }

}
