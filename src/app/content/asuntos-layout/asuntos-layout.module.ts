import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { AsuntosLayoutRoutingModule } from './asuntos-layout-routing.module';
import { ListaAsuntosComponent } from './lista-asuntos/lista-asuntos.component';
import { DetalleAsuntosComponent } from './detalle-asuntos/detalle-asuntos.component';
import { AsuntosLayoutComponent } from './asuntos-layout.component';
import { SharedModule } from '../../components/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ListaAsuntosComponent,
    DetalleAsuntosComponent,
    AsuntosLayoutComponent,

  ],
  imports: [
    CommonModule,
    AsuntosLayoutRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AsuntosLayoutModule { }

