import { Component, ViewChild } from '@angular/core';
import { ListaAsuntosComponent } from './lista-asuntos/lista-asuntos.component';

@Component({
  selector: 'app-asuntos-layout',
  standalone: false,
  templateUrl: './asuntos-layout.component.html',
  styleUrl: './asuntos-layout.component.scss'
})
export class AsuntosLayoutComponent {
  @ViewChild(ListaAsuntosComponent) listaComp!: ListaAsuntosComponent;

  idAsuntoSeleccionado: number | null = null;

  recibirAsunto(id: number) {
    this.idAsuntoSeleccionado = id;
  }
    onCambio(event: string) {
    this.listaComp.refrescar(event); // aquí invocamos directamente
  }
}
