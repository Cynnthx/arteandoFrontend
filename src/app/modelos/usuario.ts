// roles del backend
export enum Rol {
  CLIENTE = 'cliente',
  ADMIN = 'admin',
}

export interface AuthenticationDTO {
  token: string;  // JWT
  mensaje?: string
}


export interface TestUsuario {
  id: number;
  titulo: string;
  puntaje: number;
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  nombreUsuario: string;
  email: string;
  rol: Rol;
  foto?: string;
  dni?: string;
  direccion?: string;
  tests?: TestUsuario[];



}
