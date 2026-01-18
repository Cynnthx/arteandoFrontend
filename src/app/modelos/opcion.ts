export interface Opcion {
  id: number;
  texto: string;
  esCorrecta: boolean;
  preguntaId: number;
  preguntaTexto?: string;
}
