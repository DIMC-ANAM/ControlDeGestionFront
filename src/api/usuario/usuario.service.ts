import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  /* urlBase: string = "http://safirho.site/api/login/"; */
  urlBase: string = environment.baseurl + "/usuario";

  constructor(private http: HttpClient) { }

  logIn(data:any) {
    return this.http.post(this.urlBase + "/login", data);
  }
  crearUsuario(data:any) {
    return this.http.post(this.urlBase + "/crearUsuario", data);
  }
  updateUsuario(data:any) {
    return this.http.post(this.urlBase + "/updateUsuario", data);
  }
  activacionUsuario(data:any) {
    return this.http.post(this.urlBase + "/activacionUsuario", data);
  }

  

}

