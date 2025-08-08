import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlBase: string = "http://safirho.site/api/login/";

  constructor(private http: HttpClient) { }

  logIn(data:any) {
    return this.http.post(this.urlBase, data);
  }

}

