import { Component } from '@angular/core';

@Component({
  selector: 'app-turnados-layout',
  standalone: false,
  templateUrl: './turnados-layout.component.html',
  styleUrl: './turnados-layout.component.scss'
})
export class TurnadosLayoutComponent {
  idTurnadoSelecccionado: number | null = null;

  recibirAsunto(id: number) {
    this.idTurnadoSelecccionado = id;
  }
}
