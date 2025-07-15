import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ModalComponent } from './modal/modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    NgbModalModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    ModalComponent,
  ],
})
export class SharedModule { }
