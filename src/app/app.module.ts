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
import { BusquedaAvanzadaComponent } from './content/busqueda-avanzada/busqueda-avanzada.component';
import { ReportesComponent } from './content/reportes/reportes.component';
import { ConsultarTurnadosComponent } from './content/consultar-turnados/consultar-turnados.component';
import { UnitTestComponent } from './content/unit-test/unit-test.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {  FechaMexicoPipe } from './pipes/date-mx-format';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { ConsultarAsuntosComponent } from './content/consultar-asuntos/consultar-asuntos.component';
registerLocaleData(localeEsMx, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,    
    DashboardComponent,
    UxDesignComponent,
    RegistroAsuntoComponent,
    ConsultarTurnadosComponent,
    BusquedaAvanzadaComponent,
    ReportesComponent,
    ConsultarTurnadosComponent,
    UnitTestComponent,
    FechaMexicoPipe,
    ConsultarAsuntosComponent
    
  ],
  imports: [
    LayoutsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,    
    CuentaModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
