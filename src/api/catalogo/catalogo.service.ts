import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  urlBase: String = environment.baseurl + "catalogo/";

  constructor(private http: HttpClient) { }

  consultarTipoDocumento() {
    return this.http.get(this.urlBase + 'consultarTipoDocumento');
  }
  consultarTema() {
    return this.http.get(this.urlBase + 'consultarTema');
  }
  consultarPrioridad() {
    return this.http.get(this.urlBase + 'consultarPrioridad');
  }
  consultarMedioRecepcion() {
    return this.http.get(this.urlBase + 'consultarMedioRecepcion');
  }
}

