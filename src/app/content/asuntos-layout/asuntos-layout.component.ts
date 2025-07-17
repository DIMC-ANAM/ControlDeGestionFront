import { Component } from '@angular/core';

@Component({
  selector: 'app-asuntos-layout',
  standalone: false,
  templateUrl: './asuntos-layout.component.html',
  styleUrl: './asuntos-layout.component.scss'
})
export class AsuntosLayoutComponent {
  idAsuntoSeleccionado: number | null = null;

  recibirAsunto(id: number) {
    this.idAsuntoSeleccionado = id;
  }
}
