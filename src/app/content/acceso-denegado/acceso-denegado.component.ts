import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  standalone: false,
  templateUrl: './acceso-denegado.component.html',
  styleUrl: './acceso-denegado.component.scss'
})
export class AccesoDenegadoComponent {

	constructor(
		public router: Router
	){

	}
}
