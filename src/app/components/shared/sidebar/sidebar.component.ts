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
  // Inyectar el servicio usando la nueva función inject()
  public sidebarService = inject(SidebarService);

  constructor(private router: Router) {}

  menuItems = [
    {
      id: 'registro',
      label: 'Registro de asuntos',
      icon: 'fas fa-file-alt',
      link: '/registro-asunto'
    },
    {
      id: 'consultarAsuntos',
      label: 'Consultar asuntos',
      icon: 'fas fa-file-search',
      link: '/consultar-asuntos'
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
    }
  ];

  /**
   * Maneja el click del botón toggle
   */
  onToggleClick(): void {
    this.sidebarService.toggleSidebar();
  }

  /**
   * Maneja el click en el overlay (mobile)
   */
  onOverlayClick(): void {
    this.sidebarService.collapseSidebar();
  }

  /**
   * Maneja la selección de items del menú
   */
  selectItem(itemId: string, event: Event): void {
    event.preventDefault();
    console.log('Item seleccionado:', itemId);
    /* navegar al link que trae cada elemento */
    const item = this.menuItems.find(item => item.id === itemId);
    this.router.navigate([item?.link]);
    
    // Auto-cerrar en mobile después de seleccionar
    this.sidebarService.autoCloseOnMobile();
  }
}