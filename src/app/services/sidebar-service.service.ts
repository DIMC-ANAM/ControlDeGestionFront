// 1. sidebar.service.ts - Servicio para manejar el estado del sidebar
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Signal privado para el estado del sidebar
  private _isCollapsed = signal(false);
  
  // Signal público de solo lectura
  public readonly isCollapsed = this._isCollapsed.asReadonly();
  
  // Computed para obtener el ancho actual del sidebar
  public readonly sidebarWidth = computed(() => 
    this._isCollapsed() ? '50px' : '250px'
  );
  
  // Computed para saber si está expandido
  public readonly isExpanded = computed(() => !this._isCollapsed());

  /**
   * Alterna el estado del sidebar (colapsar/expandir)
   */
  toggleSidebar(): void {
    this._isCollapsed.update(collapsed => !collapsed);
    console.log('Sidebar toggled:', this._isCollapsed() ? 'collapsed' : 'expanded');
  }

  /**
   * Colapsa el sidebar
   */
  collapseSidebar(): void {
    this._isCollapsed.set(true);
    console.log('Sidebar collapsed');
  }

  /**
   * Expande el sidebar
   */
  expandSidebar(): void {
    this._isCollapsed.set(false);
    console.log('Sidebar expanded');
  }

  /**
   * Establece el estado del sidebar directamente
   */
  setSidebarState(collapsed: boolean): void {
    this._isCollapsed.set(collapsed);
    console.log('Sidebar state set to:', collapsed ? 'collapsed' : 'expanded');
  }

  /**
   * Obtiene el estado actual como boolean
   */
  getCurrentState(): boolean {
    return this._isCollapsed();
  }

  /**
   * Detecta si es dispositivo móvil
   */
  isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  /**
   * Cierra automáticamente en móvil si está abierto
   */
  autoCloseOnMobile(): void {
    if (this.isMobile() && !this._isCollapsed()) {
      this.collapseSidebar();
    }
  }
}