import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Recuperamos el token del localStorage (asegúrate de que al hacer login lo guardas ahí)
  const token = localStorage.getItem('token');

  // Si el token existe, clonamos la petición y le añadimos el header Authorization
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, la petición sigue su curso normal
  return next(req);
};
