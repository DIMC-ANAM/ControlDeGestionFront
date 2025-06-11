
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar-service.service';
import { inject, computed } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public sidebarService = inject(SidebarService);

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  collapseSidebar(): void {
    this.sidebarService.collapseSidebar();
  }

  expandSidebar(): void {
    this.sidebarService.expandSidebar();
  }

  @Input() username: string = 'Usuario';
   @Output() onLogout = new EventEmitter<void>();

  usuario: any ={
    nombreCompleto: 'JOSE ANDRES REYES CERDA',
    unidadAdministrativa: 'DIRECCIÓN DE RECURSOS HUMANOS',
  };

  constructor(
    private router: Router
  ) {
    const session = localStorage.getItem('session');
    if (session) {
      const sessionData = JSON.parse(session);
      this.usuario = sessionData.user || '';
    }
  }

   isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.isDropdownOpen = false;
    this.onLogout.emit();
    this.router.navigate(['/login']);
  }

  // Cerrar dropdown al hacer click fuera
  onDocumentClick(event: Event) {
    if (!event.target) return;
    
    const target = event.target as Element;
    if (!target.closest('.user-menu')) {
      this.isDropdownOpen = false;
    }
  }

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  goHome(){
    this.router.navigate(['/dashboard']);
  }
}
