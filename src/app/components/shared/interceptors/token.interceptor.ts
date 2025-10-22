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
import { SessionService } from '../../../services/session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
	private sessionS: SessionService,
  private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    // Obtener token del localStorage
    const session = this.sessionS.getUsuario();
    if (session) {
      const token = session.tokenWs;
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
              this.sessionS.logout();
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
