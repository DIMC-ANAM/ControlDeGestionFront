import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlBase: String = environment.baseurl + "usuario/";

  constructor(private http: HttpClient) { }

  logIn(data) {
    return this.http.post(this.urlBase + "logIn", data);
  }

}
