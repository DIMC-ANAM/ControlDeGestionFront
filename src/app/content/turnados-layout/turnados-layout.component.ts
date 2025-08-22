import { Component, ViewChild } from '@angular/core';
import { ListaTurnadosComponent } from './lista-turnados/lista-turnados.component';

@Component({
  selector: 'app-turnados-layout',
  standalone: false,
  templateUrl: './turnados-layout.component.html',
  styleUrl: './turnados-layout.component.scss'
})
export class TurnadosLayoutComponent {
  @ViewChild(ListaTurnadosComponent) listaComp!: ListaTurnadosComponent;
  turnadoSeleccionado: any | null = null;
  
  recibirAsunto(turnado: any) {
    this.turnadoSeleccionado = turnado;
  }


  onCambio(event: string) {
    this.listaComp.refrescar(event); // aquí invocamos directamente
  }
}
