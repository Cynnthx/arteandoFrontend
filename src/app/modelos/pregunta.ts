import { OpcionDTO } from './opcion';

export interface Pregunta {
  id: number;
  texto: string;
  imagen?: string;
  testId: number;
  opciones: OpcionDTO[]; // vienen del backend
}
