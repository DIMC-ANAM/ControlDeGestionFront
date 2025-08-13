import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

/* to exclude loader: 

this.http.get('...', {
  headers: new HttpHeaders({ 'X-Skip-Loader': 'true' })
});

*/

@Injectable({
  providedIn: 'root',
})
export class AsuntoService {
  urlBase: String = environment.baseurl + 'asunto/';

  constructor(private http: HttpClient) {}

  registrarAsunto(data:any) {
    return this.http.post(this.urlBase + 'registrarAsunto', data);
  }
  consultarAsuntosUR(data:any) {
    return this.http.post(this.urlBase + 'consultarAsuntosUR', data);
  }

  /* pendientes  */
  
  consultarDetallesAsunto(data:any) {
    return this.http.post(this.urlBase + 'consultarDetalleAsunto', data);
  }
  
  consultarExpedienteAsunto(data:any) {
    return this.http.post(this.urlBase + 'consultarExpedienteAsunto', data);
  }
  
  consultarTurnados(data:any) {
    return this.http.post(this.urlBase + 'consultarTurnados', data);
  }
  
  consultarHistorialAsunto(data:any) {
    return this.http.post(this.urlBase + 'consultarHistorialAsunto', data);
  }
  turnarAsunto(data:any) {
    return this.http.post(this.urlBase + 'turnarAsunto', data);
  }
  reemplazarDocumento(data:any) {
    return this.http.post(this.urlBase + 'reemplazarDocumento', data);
  }
  cargarAnexos(data:any) {
    return this.http.post(this.urlBase + 'agregarAnexos', data);
  }
  eliminarDocumento(data:any) {
    return this.http.post(this.urlBase + 'eliminarDocumento', data);
  }
  concluirAsunto(data:any) {
    return this.http.post(this.urlBase + 'concluirAsunto', data);
  }
}
