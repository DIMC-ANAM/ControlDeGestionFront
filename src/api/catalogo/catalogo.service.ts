import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  urlBase: String = environment.baseurl + "catalogo/";

  constructor(private http: HttpClient) { }

  consultarTiposContrato() {
    return this.http.get(this.urlBase + "consultarTiposContrato");
  }

  consultarUnidadesAdministrativas() {
    return this.http.get(this.urlBase + "consultarUnidadesAdministrativas");
  }

  consultarNivelDePuesto() {
    return this.http.get(this.urlBase + "consultarNivelDePuesto");
  }

  /*
  function ejemplo(){

    var ejempl= 2;
    var b = 4;
    var c;

    $.ajax({
      url: "",
      data:"",
      method: "",
      datype: "json",
      async: "false"
      success: function(data){
          c= data; 
      },
      error: function(data){

      }

    });

    alert(jemplo);
    alert(b);
    alert(c);

}

  */
}

