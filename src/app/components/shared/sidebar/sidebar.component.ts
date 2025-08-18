import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar-service.service';
import { Router } from '@angular/router';
import { TipoToast } from '../../../../api/entidades/enumeraciones';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
 // Inyección moderna (limpia y sin constructor)

  constructor(
    private router: Router,
    public sidebarService: SidebarService,
    private utils: UtilsService
  ){}

  ngOnInit(): void {
    /* const session = localStorage.getItem('session');
    if (!session) {
    this.router.navigate(['/']);
    this.utils.MuestrasToast(TipoToast.Info, "¡La sesión ha caducado!"); // corregido MuestraToast
  } */
  }

  menuItems = [
    {
      id: 'registro',
      label: 'Registro de asuntos',
      icon: 'fas fa-plus',
      link: '/registro-asunto',
      rol: [2],
    },
    {
      id: 'consultarAsuntos',
      label: 'Asuntos registrados',
      icon: 'fas fa-file-import',
      link: '/consultar-asuntos',
      rol: [2],
    },
    {
      id: 'consultarTurnados',
      label: 'Asuntos turnados',
      icon: 'fas fa-sync',
      link: '/consultar-turnados',
      rol: [2,3],
    },
    {
      id: 'busquedaAvanzada',
      label: 'Búsqueda avanzada',      
      icon: 'fas fa-search',
      link: '/busqueda-avanzada',
      rol: [2,3],
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: 'fas fa-chart-pie',
      link: '/reportes',
      rol: [2,3],
    },
    {
      id: 'catalogos',
      label: 'Catálogos',
      icon: 'fas fa-cogs',
      link: '/catalogos',
      rol: [2],
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