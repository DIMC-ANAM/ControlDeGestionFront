import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si la URL es pública como login o verificar correo, no agregar token
    if (req.url.includes('/user/logIn') || req.url.includes('/user/verificarCorreo')) {
      return next.handle(req);
    }

    // Obtener token del localStorage
    const session = localStorage.getItem('session');
    if (session) {
      const sessionData = JSON.parse(session);
      const token = sessionData.tokenWs;

      if (token) {
        req = req.clone({
          setHeaders: {
            'authorization-ug': `Bearer-UG ${token}`
          }
        });
      }
    }

    return next.handle(req);
  }
}
