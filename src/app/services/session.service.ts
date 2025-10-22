import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sessionKey = 'session';
  private readonly userKey = 'user';
  private readonly secretKey = '4n4m@r00t-s3cr3t!';

  constructor() {}

  /**
   * Guarda la sesión encriptada y añade tiempo de expiración
   * @param data objeto de sesión devuelto por backend
   * @param minutos tiempo de expiración en minutos (por defecto 60)
   */
  setSession(data: any, minutos: number = 1800): void {
    const expiraEn = Date.now() + minutos * 1800 * 1000;
    const session = { ...data, expiraEn };

    const jsonString = JSON.stringify(session);
    const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
    localStorage.setItem(this.sessionKey, encrypted);
  }

  /**
   * Obtiene y desencripta la sesión; valida si ya expiró.
   * Si caducó, la destruye y devuelve null.
   */
  getUsuario(): any | null {
    const encrypted = localStorage.getItem(this.sessionKey);
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      const session = JSON.parse(decrypted);

      // Validar expiración
      if (session.expiraEn && Date.now() > session.expiraEn) {
        /* console.warn('Sesión expirada automáticamente'); */
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error al desencriptar la sesión:', error);
      this.logout();
      return null;
    }
  }

  /** Devuelve true si hay sesión válida y no caducada */
  isLoggedIn(): boolean {
    return !!this.getUsuario();
  }

  /** Borra la sesión */
  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }

  /** Verifica sin eliminar si la sesión está expirada */
  isSessionExpired(): boolean {
    const encrypted = localStorage.getItem(this.sessionKey);
    if (!encrypted) return true;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      const session = JSON.parse(decrypted);
      return session.expiraEn && Date.now() > session.expiraEn;
    } catch {
      return true;
    }
  }

  /** -------------------------
   *  🟡 MÉTODOS DE USUARIO RECORDADO
   *  ------------------------- */

  /**
   * Guarda credenciales recordadas (encriptadas)
   */
  setUserRecordado(data: { usuario: string; password: string }): void {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
    localStorage.setItem(this.userKey, encrypted);
  }

  /**
   * Obtiene y desencripta el usuario recordado
   */
  getUserRecordado(): { usuario: string; password: string } | null {
    const encrypted = localStorage.getItem(this.userKey);
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error al desencriptar usuario recordado:', error);
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  /** Elimina el usuario recordado */
  clearUserRecordado(): void {
    localStorage.removeItem(this.userKey);
  }
}
