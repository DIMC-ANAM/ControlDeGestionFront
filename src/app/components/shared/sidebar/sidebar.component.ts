import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
 // Inyección moderna (limpia y sin constructor)
  private router = inject(Router);
  public sidebarService = inject(SidebarService);

  menuItems = [
    {
      id: 'registro',
      label: 'Registro de asuntos',
      icon: 'fas fa-plus',
      link: '/registro-asunto'
    },
    {
      id: 'consultarAsuntos',
      label: 'Asuntos registrados',
      icon: 'fas fa-file-alt',
      link: '/consultar-asuntos'
    },
    {
      id: 'consultarTurnados',
      label: 'Asuntos turnados',
      icon: 'fas fa-sync',
      link: '/consultar-turnados'
    },
    {
      id: 'busquedaAvanzada',
      label: 'Búsqueda avanzada',      
      icon: 'fas fa-search',
      link: '/busqueda-avanzada'
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: 'fas fa-chart-pie',
      link: '/reportes'
    },
    {
      id: 'catalogos',
      label: 'Catálogos',
      icon: 'fas fa-cogs',
      link: '/catalogos'
    },
  ];

   /**
   * Navega al enlace del ítem y colapsa si está en móvil
   */
selectItem(item: any, event: Event): void {
  event.preventDefault();
  this.router.navigate([item.link]);
  this.sidebarService.autoCloseOnMobile();
}

  /**
   * Cierra el sidebar cuando se hace click en el overlay
   */
  public onOverlayClick(): void {
    this.sidebarService.collapseSidebar();
  }
}