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
  
  consultarTurnadosAsunto(data:any) {
    return this.http.post(this.urlBase + 'consultarTurnadosAsunto', data);
  }
  
  consultarHistorialAsunto(data:any) {
    return this.http.post(this.urlBase + 'consultarHistorialAsunto', data);
  }
}
