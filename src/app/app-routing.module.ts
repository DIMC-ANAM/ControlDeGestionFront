import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './layouts/general/general.component';
import { DashboardComponent } from './content/dashboard/dashboard.component';
import { UxDesignComponent } from './content/ux-design/ux-design.component';
import { RegistroAsuntoComponent } from './content/registro-asunto/registro-asunto.component';
import { ConsultarTurnadosComponent } from './content/consultar-turnados/consultar-turnados.component';
import { BusquedaAvanzadaComponent } from './content/busqueda-avanzada/busqueda-avanzada.component';
import { ReportesComponent } from './content/reportes/reportes.component';
import { UnitTestComponent } from './content/unit-test/unit-test.component';
import { ConsultarAsuntosComponent } from './content/consultar-asuntos/consultar-asuntos.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./content/cuenta/cuenta.module').then(m => m.CuentaModule)
  },
   {
    path: '',
    component: GeneralComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'registro-asunto',
        component: RegistroAsuntoComponent
      },
      {
        path: 'consultar-asuntos',
         loadChildren: () => import('./content/asuntos-layout/asuntos-layout.module').then(m => m.AsuntosLayoutModule)
      },
      {
        path: 'consultar-turnados',
        component: ConsultarTurnadosComponent
      },
      {
        path: 'busqueda-avanzada',
        component: BusquedaAvanzadaComponent
      },
      {
        path: 'reportes',
        component: ReportesComponent
      },
      {
        path: 'test',
        component: UnitTestComponent
      },
      
    ]
  },
  {
    path: 'ux-design',
    component: UxDesignComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
