import { Component } from '@angular/core';

@Component({
  selector: 'app-turnados-layout',
  standalone: false,
  templateUrl: './turnados-layout.component.html',
  styleUrl: './turnados-layout.component.scss'
})
export class TurnadosLayoutComponent {
  turnadoSeleccionado: any | null = null;

  recibirAsunto(turnado: any) {
    this.turnadoSeleccionado = turnado;
  }
}
