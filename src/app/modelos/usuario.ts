// roles del backend
export enum Rol {
  CLIENTE = 'cliente',
  ADMIN = 'admin',
}

export interface AuthenticationDTO {
  token: string;  // JWT
  // Puedes agregar otros campos que devuelva el backend
}


export interface Usuario {
  id?: number;
  nombreUsuario: string;
  email: string;
  rol: Rol;
  contrasena?: string;
  token?: string;

}
