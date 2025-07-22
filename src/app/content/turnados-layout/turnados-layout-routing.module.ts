import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnadosLayoutComponent } from './turnados-layout.component';

const routes: Routes = [
    {
    path: '',
    component: TurnadosLayoutComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnadosLayoutRoutingModule { }
