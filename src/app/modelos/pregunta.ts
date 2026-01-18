import { Opcion } from './opcion';

export interface Pregunta {
  id: number;
  texto: string;
  imagen?: string;
  testId: number;
  opciones?: Opcion[]; // se van a cargar del backend
  seleccionada?: Opcion | null; // para la lógica del test
}
