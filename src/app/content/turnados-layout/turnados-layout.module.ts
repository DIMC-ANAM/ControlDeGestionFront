import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnadosLayoutRoutingModule } from './turnados-layout-routing.module';
import { SharedModule } from '../../components/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetalleTurnadosComponent } from './detalle-turnados/detalle-turnados.component';
import { TurnadosLayoutComponent } from './turnados-layout.component';
import { ListaTurnadosComponent } from './lista-turnados/lista-turnados.component';


@NgModule({
  declarations: [
    DetalleTurnadosComponent,
    TurnadosLayoutComponent,
    ListaTurnadosComponent
  ],
  imports: [
    CommonModule,
    TurnadosLayoutRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TurnadosLayoutModule { }
