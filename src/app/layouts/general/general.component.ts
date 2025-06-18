import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar-service.service'; // ajusta el path si es necesario

@Component({
  selector: 'app-general',
  standalone: false,
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {
  sidebarService = inject(SidebarService);
  toggleMenuMovil(){
    
  }
}
