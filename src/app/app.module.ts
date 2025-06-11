import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './content/dashboard/dashboard.component';
import { UxDesignComponent } from './content/ux-design/ux-design.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './components/shared/shared.module';
import { CuentaModule } from './content/cuenta/cuenta.module';
import { LayoutsModule } from './layouts/layouts.module';
import { RegistroAsuntoComponent } from './content/registro-asunto/registro-asunto.component';
import { ConsultarAsuntosComponent } from './content/consultar-asuntos/consultar-asuntos.component';
import { BusquedaAvanzadaComponent } from './content/busqueda-avanzada/busqueda-avanzada.component';
import { ReportesComponent } from './content/reportes/reportes.component';

@NgModule({
  declarations: [
    AppComponent,    
    DashboardComponent,
    UxDesignComponent,
    RegistroAsuntoComponent,
    ConsultarAsuntosComponent,
    BusquedaAvanzadaComponent,
    ReportesComponent,
    
  ],
  imports: [
    LayoutsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,    
    CuentaModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
