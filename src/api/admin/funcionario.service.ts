import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  urlBase: String = environment.baseurl + "admin/funcionario/";
  constructor(private http: HttpClient) { }

  obtenerFuncionarioxUAdmin(data) {
    return this.http.post(this.urlBase + "obtenerFuncionarioxUAdmin", data);
  }

  generarZipCartasxUAdmin(postData) {
    return this.http.post(this.urlBase + "generarZipCartasxUAdmin", postData, {
      responseType: 'blob' //magic
    }).pipe(map((res: any) => {
      this.downloadFile(res)
    }),
      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      })
    );
  }

  eliminarFuncionario(data){
    return this.http.post(this.urlBase + "eliminarFuncionario",data);
  }

  consultarInformacionGeneral(){
    return this.http.post(this.urlBase + "consultarInformacionGeneral",{});
  }

  /*Funciones privadas */
  private downloadFile(data) {
    let blob = new Blob([data], { type: 'application/zip' });
    console.log(blob)
    let url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
