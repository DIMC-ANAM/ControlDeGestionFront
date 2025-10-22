import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, from, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private key: CryptoKey | null = null;

  constructor(
	private sessionS: SessionService,
  private router: Router) {}

  private async decrypt(base64: string): Promise<any> {
    const data = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const iv = data.slice(0, 16);
    const authTag = data.slice(16, 32);
    const ciphertext = data.slice(32);

    if (!this.key) {
      const enc = new TextEncoder();
      const material = await crypto.subtle.importKey(
        'raw',
        enc.encode('my-secret-key'),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      this.key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: enc.encode('salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
    }

    const combined = new Uint8Array([...ciphertext, ...authTag]);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      this.key,
      combined
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    // Obtener token del localStorage
    const session = this.sessionS.getUsuario();
    if (session) {
      const token = session.tokenWs;
      if (token) {
        req = req.clone({ setHeaders: { authorization: `Bearer ${token}` } });
      }
    }

    return next.handle(req).pipe(
      switchMap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body?.encrypted) {
          return from(this.decrypt(event.body.data)).pipe(
            map(body => event.clone({ body }))
          );
        }
        return of(event);
      }),
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