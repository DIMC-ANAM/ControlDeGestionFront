import { Component, OnInit } from '@angular/core';
import { ModalManagerService } from '../../components/shared/modal-manager.service';
import { TemplateRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogoService } from '../../../api/catalogo/catalogo.service';
import { response } from 'express';

export type Fecha = Date | string;

export interface Determinante {
  id: number;
  nivel: string;
  unidadDeNegocio: string;
  unidadAdministrativa: string;
  area: string;
  determinante: string;
  dependencia: string;
  fechaRegistro: Fecha;
  fechaModificacion: Fecha;
  idUsuarioModifica: number;
  idUsuarioCreacion: number;
  activo: boolean;
}

@Component({
  selector: 'app-catalogos',
  standalone: false,
  templateUrl: './catalogos.component.html',
  styleUrl: './catalogos.component.scss'
})
export class CatalogosComponent implements OnInit{

  ngOnInit(): void {
      this.cargarDeterminantes();
  }
  // cargar datos desde la API
  cargarDeterminantes(): void {
    const data = { id: 0}; //obtenemos todos los registros 

    this.catalogoService.consultarDeterminantes(data).subscribe({
      next: (response: any) => {
        console.log('Repuesta de la API', response);
        if (response.status == 200){
          this.rows = response.model || [];
          console.log('determinantes cargados');
        }else{
          console.log('error al cargar determinantes', response.message);
          this.rows = []; //array vacio en cas de error
        }
      },
      error: (error) => {
        console.error('error en API', error);
        this.rows = []; //array vacio en cas de error
      }
    });
  }

    


  rows: Determinante[] = [
    { id: 1,  nivel: 'Nivel1',  unidadDeNegocio: 'Negocio1',  unidadAdministrativa: 'Admin1',  area: 'Area1',  determinante: 'Determinante1',  dependencia: 'Dependencia1',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 1,  idUsuarioCreacion: 1,  activo: true },
    { id: 2,  nivel: 'Nivel2',  unidadDeNegocio: 'Negocio2',  unidadAdministrativa: 'Admin2',  area: 'Area2',  determinante: 'Determinante2',  dependencia: 'Dependencia2',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 2,  idUsuarioCreacion: 2,  activo: true },
    { id: 3,  nivel: 'Nivel3',  unidadDeNegocio: 'Negocio3',  unidadAdministrativa: 'Admin3',  area: 'Area3',  determinante: 'Determinante3',  dependencia: 'Dependencia3',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 3,  idUsuarioCreacion: 3,  activo: true },
    { id: 4,  nivel: 'Nivel4',  unidadDeNegocio: 'Negocio4',  unidadAdministrativa: 'Admin4',  area: 'Area4',  determinante: 'Determinante4',  dependencia: 'Dependencia4',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 4,  idUsuarioCreacion: 4,  activo: true },
    { id: 5,  nivel: 'Nivel5',  unidadDeNegocio: 'Negocio5',  unidadAdministrativa: 'Admin5',  area: 'Area5',  determinante: 'Determinante5',  dependencia: 'Dependencia5',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 5,  idUsuarioCreacion: 5,  activo: true },
    { id: 6,  nivel: 'Nivel6',  unidadDeNegocio: 'Negocio6',  unidadAdministrativa: 'Admin6',  area: 'Area6',  determinante: 'Determinante6',  dependencia: 'Dependencia6',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 6,  idUsuarioCreacion: 6,  activo: true },
    { id: 7,  nivel: 'Nivel7',  unidadDeNegocio: 'Negocio7',  unidadAdministrativa: 'Admin7',  area: 'Area7',  determinante: 'Determinante7',  dependencia: 'Dependencia7',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 7,  idUsuarioCreacion: 7,  activo: true },
    { id: 8,  nivel: 'Nivel8',  unidadDeNegocio: 'Negocio8',  unidadAdministrativa: 'Admin8',  area: 'Area8',  determinante: 'Determinante8',  dependencia: 'Dependencia8',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 8,  idUsuarioCreacion: 8,  activo: true },
    { id: 9,  nivel: 'Nivel9',  unidadDeNegocio: 'Negocio9',  unidadAdministrativa: 'Admin9',  area: 'Area9',  determinante: 'Determinante9',  dependencia: 'Dependencia9',  fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 9,  idUsuarioCreacion: 9,  activo: true },
    { id: 10, nivel: 'Nivel10', unidadDeNegocio: 'Negocio10', unidadAdministrativa: 'Admin10', area: 'Area10', determinante: 'Determinante10', dependencia: 'Dependencia10', fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 10, idUsuarioCreacion: 10, activo: true },
    { id: 11, nivel: 'Nivel11', unidadDeNegocio: 'Negocio11', unidadAdministrativa: 'Admin11', area: 'Area11', determinante: 'Determinante11', dependencia: 'Dependencia11', fechaRegistro: '2025-09-15T12:41:49', fechaModificacion: '2025-09-15T12:41:49', idUsuarioModifica: 11, idUsuarioCreacion: 11, activo: true },
  ];

    // barra de busqueda
  term = '';

  private normalize(s: unknown): string {
    return String(s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // sin acentos
  }

  private matches(row: Determinante, t: string): boolean {
    const needle = this.normalize(t);
    if (!needle) return true;
    const haystack = this.normalize([
      row.id, row.nivel, row.unidadDeNegocio, row.unidadAdministrativa,
      row.area, row.determinante, row.dependencia,
      row.idUsuarioModifica, row.idUsuarioCreacion,
      row.activo ? 'si' : 'no',
      row.fechaRegistro, row.fechaModificacion
    ].join(' '));
    return haystack.includes(needle);
  }

  get filtered(): Determinante[] {
    return this.rows.filter(r => this.matches(r, this.term));
  }

  onFilter(value: string) {
    this.term = value;
    this.currentPage = 1;
  }

  clearFilter() {
    this.term = '';
    this.currentPage = 1;
  }

  // paginación
  pageSizeOptions = [5, 10, 25];
  pageSize = 5;
  currentPage = 1;

  get totalItems()  { return this.filtered.length; }
  get totalPages()  { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get startIndex()  { return (this.currentPage - 1) * this.pageSize; }
  get endIndex()    { return Math.min(this.startIndex + this.pageSize, this.totalItems); }
  get pageItems()   { return this.filtered.slice(this.startIndex, this.endIndex); }
  get pages()       { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  goToFirst(){ this.currentPage = 1; }
  goToPrev() { if (this.currentPage > 1) this.currentPage--; }
  goToNext() { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToLast() { this.currentPage = this.totalPages; }
  goToPage(p: number){ if (p>=1 && p<=this.totalPages) this.currentPage = p; }

  onPageSizeChange(e: Event){
    this.pageSize = Number((e.target as HTMLSelectElement).value);
    this.currentPage = 1;
  }

  //  Acciones 
  onCreate()               { console.log('Registrar nuevo'); }
  onEdit(r: Determinante)  { console.log('Editar', r.id); }
  onDelete(r: Determinante){ console.log('Eliminar', r.id); }


  // Modal para registrar
  determinanteForm!: FormGroup;
@ViewChild('modalRegistrar') modalRegistrar!: TemplateRef<any>;

constructor(
  private fb: FormBuilder,
  private modalManager: ModalManagerService,
  private catalogoService : CatalogoService
) {
  this.initForm();
}

private initForm(): void {
  this.determinanteForm = this.fb.group({
    nivel: ['', [Validators.required, Validators.maxLength(50)]],
    unidadDeNegocio: ['', [Validators.required, Validators.maxLength(100)]],
    unidadAdministrativa: ['', [Validators.required, Validators.maxLength(100)]],
    area: ['', [Validators.required, Validators.maxLength(100)]],
    determinante: ['', [Validators.required, Validators.maxLength(200)]],
    dependencia: ['', [Validators.required, Validators.maxLength(100)]]
  });
}

openRegistrarModal(): void {
  this.determinanteForm.reset(); 
  this.modalManager.openModal({
    title: '<i class="fas fa-plus me-2"></i>Registrar Determinante',
    template: this.modalRegistrar,
    showFooter: true,
    onAccept: () => this.guardarDeterminante(),
    onCancel: () => console.log('Modal cancelado')
  });
}

// funcion para guardar y cargar los datos en la api 
guardarDeterminante(): void {
  if (this.determinanteForm.valid) {
    console.log('Datos del formulario:', this.determinanteForm.value);
    // Aquí irá la lógica para guardar en la API
  }
}
}
