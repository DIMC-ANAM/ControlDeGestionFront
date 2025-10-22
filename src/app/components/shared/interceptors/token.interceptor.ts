import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    // Obtener token del localStorage
    const session = localStorage.getItem('session');
    if (session) {
      const sessionData = JSON.parse(session);
      const token = sessionData.tokenWs;

      if (token) {
        req = req.clone({
          setHeaders: {
            'authorization': `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(req).pipe(
      catchError((err: any) => {
        // si se recibe 401 o 403 respuesta expirada o no autorizada 
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            try {
              localStorage.removeItem('session');
            } catch (e) {
              
            }
            // Redirigir al login
            this.router.navigate(['/cuenta/login']);
          }
        }
        return throwError(() => err);
      })
    );
  }
}
