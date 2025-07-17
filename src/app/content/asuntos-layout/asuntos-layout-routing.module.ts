import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsuntosLayoutComponent } from './asuntos-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AsuntosLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsuntosLayoutRoutingModule { }
