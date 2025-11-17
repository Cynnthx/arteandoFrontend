export interface TokenAcceso {
  id?: number;
  token: string;
  expiracion: Date;
  esValido: boolean;
  usuarioId: number;
}

export class TokenAccesoModel implements TokenAcceso {
  id?: number;
  token: string;
  expiracion: Date;
  esValido: boolean;
  usuarioId: number;

  constructor(data: Partial<TokenAcceso> = {}) {
    this.id = data.id;
    this.token = data.token || '';
    this.expiracion = data.expiracion || new Date();
    this.esValido = data.esValido ?? true;
    this.usuarioId = data.usuarioId || 0;
  }

  // Verifica si el token ha expirado
  estaExpirado(): boolean {
    return new Date() > this.expiracion;
  }


  // Verifica si el token es válido y no expirado
  esActivo(): boolean {
    return this.esValido && !this.estaExpirado();
  }

  // Método similar al toString de Java
  toString(): string {
    return `TokenAcceso {
      id: ${this.id},
      token: '${this.token.substring(0, 10)}...',
      expiracion: ${this.expiracion},
      esValido: ${this.esValido},
      usuarioId: ${this.usuarioId}
    }`;
  }
}
