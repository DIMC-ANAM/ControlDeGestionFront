import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartaCompromisoService {

  urlBase: String = environment.baseurl + "cartaCompromiso/";
  constructor(private http: HttpClient) { }

  generarCartaCompromiso(data) {
    return this.http.post(this.urlBase + "generarCartaCompromiso",data,{
      responseType: 'blob' //magic
    }).pipe(map(res => this.downloadFile(res)));
    //return this.http.post(this.urlBase + "generarCartaCompromiso",data)
  }
  

  obtenerCartaCompromiso(data) {
    return this.http.post(this.urlBase + "obtenerCartaCompromiso",data);
  }

  generarAcuse(data){
    return this.http.post(this.urlBase + "generarAcuse",data,{
      responseType: 'blob' //magic
    }).pipe(map(res => this.downloadFile(res)));
  }



  /*Funciones privadas */
  private downloadFile(data) {
    let blob = new Blob([data], { type: 'application/pdf' });
    console.log(blob)
    let url = window.URL.createObjectURL(blob);
    window.open(url);
  }

}