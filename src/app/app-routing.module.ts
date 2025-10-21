import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './layouts/general/general.component';
import { DashboardComponent } from './content/dashboard/dashboard.component';
import { UxDesignComponent } from './content/ux-design/ux-design.component';
import { RegistroAsuntoComponent } from './content/registro-asunto/registro-asunto.component';
import { BusquedaAvanzadaComponent } from './content/busqueda-avanzada/busqueda-avanzada.component';
import { ReportesComponent } from './content/reportes/reportes.component';
import { UnitTestComponent } from './content/unit-test/unit-test.component';
import { AuthGuard } from './services/auth-guard';
import { AdminUsuariosComponent } from './content/admin-usuarios/admin-usuarios.component';
import { CatalogosComponent } from './content/catalogos/catalogos.component';
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./content/cuenta/cuenta.module').then(m => m.CuentaModule)
  },
  {
    path: '',
    component: GeneralComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // 👈 aquí el redirect
      { path: 'dashboard', component: DashboardComponent },
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
         loadChildren: () => import('./content/turnados-layout/turnados-layout.module').then(m => m.TurnadosLayoutModule)
      },
      /* {
        path: 'consultar-turnados',
        component: ConsultarTurnadosComponent
        }, */
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
      {
        path: 'admin-usuarios',
        component: AdminUsuariosComponent
      },
      {
        path: 'catalogos',
        component: CatalogosComponent
      }
      
    ]
  },
    { path: '**', redirectTo: 'auth/login' },

  {
    path: 'ux-design',
    component: UxDesignComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], /*, { enableTracing: true }  */
  exports: [RouterModule]
})
export class AppRoutingModule { }
