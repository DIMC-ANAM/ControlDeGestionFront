import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-usuarios',
  standalone: false,
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.scss',
})
export class AdminUsuariosComponent {
  personal: any = [];
  paginaPersonal: any[] = []; // Lista que se muestra por página

  pageSize: number = 10; // Elementos por página
  currentPage: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor() {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.personal = [{idStatus: 1, status: 'Activo'}, {}, {},{idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
      {idStatus: 1, status: 'Activo'}, {}, {},
    ];

    this.totalPages = Math.ceil(this.personal.length / this.pageSize);
  this.updateVisiblePages();
  this.updatePaginaPersonal();

  }

  updatePaginaPersonal() {
  const start = this.currentPage * this.pageSize;
  const end = start + this.pageSize;
  this.paginaPersonal = this.personal.slice(start, end);
}
prevPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.updatePaginaPersonal();
    this.updateVisiblePages();
  }
}

nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.updatePaginaPersonal();
    this.updateVisiblePages();
  }
}

goToPage(page: number) {
  this.currentPage = page;
  this.updatePaginaPersonal();
  this.updateVisiblePages();
}
updateVisiblePages() {
  const total = this.totalPages;
  const current = this.currentPage;
  const visibleCount = 5;

  let start = Math.max(current - Math.floor(visibleCount / 2), 0);
  let end = start + visibleCount;

  if (end > total) {
    end = total;
    start = Math.max(end - visibleCount, 0);
  }

  this.visiblePages = [];
  for (let i = start; i < end; i++) {
    this.visiblePages.push(i);
  }
}

}
