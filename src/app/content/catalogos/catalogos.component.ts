import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManagerService } from '../../components/shared/modal-manager.service';
import { CatalogoService } from '../../../api/catalogo/catalogo.service';
import { UtilsService } from '../../services/utils.service';
import { TipoToast } from '../../../api/entidades/enumeraciones';

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
export class CatalogosComponent implements OnInit {

  rows: Determinante[] = [];
  
  term = '';
  pageSizeOptions = [5, 10, 25];
  pageSize = 5;
  currentPage = 1;
  
  determinanteForm!: FormGroup;
  editarDeterminanteForm!: FormGroup;
   // referencias a los modales
  @ViewChild('modalRegistrar') modalRegistrar!: TemplateRef<any>;
  @ViewChild('modalEditar') modalEditar!: TemplateRef<any>;
  @ViewChild('modalEliminar') modalEliminar!: TemplateRef<any>;
    //loaders para modales
  isLoadingRegistrar = false;
  isLoadingEditar = false;
  isLoadingEliminar = false;
  determinanteAEliminar: Determinante | null = null;

  constructor(
    private fb: FormBuilder,
    private modalManager: ModalManagerService,
    private catalogoService: CatalogoService,
    private utils: UtilsService
  ) {
    this.initFormularios();
  }

  ngOnInit(): void {
    this.cargarDeterminantes();
  }

// carga los datos a la tabla 
  cargarDeterminantes(): void {
    const data = { id: 0 }; 

    this.catalogoService.consultarDeterminantes(data).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.rows = response.model;
        } else {
          this.utils.MuestrasToast(TipoToast.Warning, response.message);
        }
      },
      error: (error) => {
        this.utils.MuestraErrorInterno(error);
      }
    });
  }

  //  metodos de busqueda y filtrado para paginacion y filtro 

  private normalize(s: unknown): string {
    return String(s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // quitar los acentos 
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

  onPageSizeChange(e: Event): void {
    this.pageSize = Number((e.target as HTMLSelectElement).value);
    this.currentPage = 1;
  }

  //metodos para iconos de editar y delete
  onEdit(r: Determinante): void { 
    this.openEditModal(r); 
  }
  onDelete(r: Determinante): void { 
    this.openDeleteModal(r); 
  }

  //   * * * * * * * * * * * * * * * * * * * * * * * * * * INICIALIZACIÓN DE FORMULARIOS  * * * * * * * * * * * * * * * * * * * * * * * * * * 


  initFormularios(): void {
    // inicializaciond e registro con todos los campos obligatorios
    this.determinanteForm = this.fb.group({
      nivel: ['', [Validators.required, Validators.maxLength(50)]],
      unidadDeNegocio: ['', [Validators.required, Validators.maxLength(100)]],
      unidadAdministrativa: ['', [Validators.required, Validators.maxLength(100)]],
      area: ['', [Validators.required, Validators.maxLength(100)]],
      determinante: ['', [Validators.required, Validators.maxLength(200)]],
      dependencia: ['', [Validators.required, Validators.maxLength(100)]]
    });

    // inicializaciond de update solo con area y determinante obligatorios
    this.editarDeterminanteForm = this.fb.group({
      id: ['', Validators.required],
      nivel: [''],
      unidadDeNegocio: [''],
      unidadAdministrativa: [''],
      area: ['', Validators.required],
      determinante: ['', Validators.required],
      dependencia: ['']
    });
  }

  //   * * * * * * * * * * * * * * * * * * * * * * * * * * MODAL DE REGISTRO  * * * * * * * * * * * * * * * * * * * * * * * * * * 

  openRegistrarModal(): void {
    this.determinanteForm.reset(); 
    this.modalManager.openModal({
      title: '<i class="fas fa-plus me-2"></i>Registrar Determinante',
      template: this.modalRegistrar,
      showFooter: true,
      onAccept: () => this.intentarRegistrar()
    });
  }

  private isValidForRegister(): boolean {
    const area = this.determinanteForm.get('area')?.value?.trim();
    const determinante = this.determinanteForm.get('determinante')?.value?.trim();
    const unidadDeNegocio = this.determinanteForm.get('unidadDeNegocio')?.value?.trim();
    const unidadAdministrativa = this.determinanteForm.get('unidadAdministrativa')?.value?.trim();
    //validaciones de campos en front - no necesarias porque ya están duplicadas en el SP pero es una doble validacion por si el front es comprometido
    if (!area) {
      this.utils.MuestrasToast(TipoToast.Warning, 'El campo área es requerido');
      this.determinanteForm.get('area')?.markAsTouched();
      return false;
    }
    if (!determinante) {
      this.utils.MuestrasToast(TipoToast.Warning, 'El campo determinante es requerido');
      this.determinanteForm.get('determinante')?.markAsTouched();
      return false;
    }
    if (!unidadDeNegocio){
      this.utils.MuestrasToast(TipoToast.Warning, 'El campo unidad de negocio es requerido');
      this.determinanteForm.get('unidadDeNegocio')?.markAsTouched();
      return false;
    }
    if (!unidadAdministrativa){
      this.utils.MuestrasToast(TipoToast.Warning, 'El campo unidad adminsitrativa es requerida');
      this.determinanteForm.get('unidadAdministrativa')?.markAsPending();

    }

    return true;
  }


  intentarRegistrar(): void {
    if (this.isValidForRegister()) {
      this.guardarDeterminante();
    }
  }

  private guardarDeterminante(): void {
    this.isLoadingRegistrar = true;
    
    this.catalogoService.insertarDeterminantes(this.determinanteForm.value).subscribe(
      (data) => {
        this.onSuccessGuardarDeterminante(data);
      },
      (ex) => {
        this.isLoadingRegistrar = false;
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }

  onSuccessGuardarDeterminante(data: any) {
    this.isLoadingRegistrar = false;
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, 'Determinante registrado correctamente');
      this.cargarDeterminantes();
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  //   * * * * * * * * * * * * * * * * * * * * * * * * * * MODAL DE EDICIÓN  * * * * * * * * * * * * * * * * * * * * * * * * * * 


  openEditModal(determinante: Determinante): void {
    this.editarDeterminanteForm.patchValue({ //por si algun campo falta
      id: determinante.id,
      nivel: determinante.nivel || '',
      unidadDeNegocio: determinante.unidadDeNegocio || '',
      unidadAdministrativa: determinante.unidadAdministrativa || '',
      area: determinante.area || '',
      determinante: determinante.determinante || '',
      dependencia: determinante.dependencia || ''
    });

    this.modalManager.openModal({
      title: '<i class="fas fa-edit me-2"></i>Editar Determinante',
      template: this.modalEditar,
      showFooter: true,
      onAccept: () => this.intentarActualizar()
    });
  }

  //validaciones de campos 
  private isValidForUpdate(): boolean {

    if (this.editarDeterminanteForm.invalid ) {
      this.utils.MuestrasToast(TipoToast.Warning, 'Se requiere llenar los campos correctamente.');
      this.editarDeterminanteForm.markAllAsTouched();
      return false;
    }
    return true;
    /* const area = this.editarDeterminanteForm.get('area')?.value?.trim();
    const determinante = this.editarDeterminanteForm.get('determinante')?.value?.trim();
      //solo dos validaciones porque es actualizar, no registrar
    if (!area) {
      this.utils.MuestrasToast(TipoToast.Warning, 'El campo área es requerido');
      this.editarDeterminanteForm.get('area')?.markAsTouched();
      return false;
    }
    if (!determinante) {
      this.utils.MuestrasToast(TipoToast.Warning, 'El campo determinante es requerido');
      this.editarDeterminanteForm.get('determinante')?.markAsTouched();
      return false;
    }
    return true; */
  }

  intentarActualizar(): void {
    if (this.isValidForUpdate()) {
      this.actualizarDeterminante();
    }
  }

  private actualizarDeterminante(): void {
    this.isLoadingEditar = true;
    
    this.catalogoService.actualizarDeterminantes(this.editarDeterminanteForm.value).subscribe(
      (data) => {
        this.onSuccessActualizarDeterminante(data);
      },
      (ex) => {
        this.isLoadingEditar = false;
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }

  onSuccessActualizarDeterminante(data: any) {
    this.isLoadingEditar = false;
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, 'Determinante actualizado correctamente');
      this.cargarDeterminantes();
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  //   * * * * * * * * * * * * * * * * * * * * * * * * * * MODAL DE ELIMINACIÓN  * * * * * * * * * * * * * * * * * * * * * * * * * * 
  openDeleteModal(determinante: Determinante): void {
    this.determinanteAEliminar = determinante;
    this.modalManager.openModal({

      title: ' <i class="fas fa-exclamation-triangle text-warning me-2"></i> Confirmar Eliminación',
      template: this.modalEliminar,
      showFooter: true,
      onAccept: () => this.intentarEliminar()
    });
  }

  intentarEliminar(): void {
    if (this.determinanteAEliminar) {
      this.eliminarDeterminante();
    }
  }

  private eliminarDeterminante(): void {
    if (!this.determinanteAEliminar) return; // regresa si no hay id detectado para eliminar
    this.isLoadingEliminar = true;
    const datosEliminar = { id: this.determinanteAEliminar.id };
    
    this.catalogoService.desactivarDeterminantes(datosEliminar).subscribe(
      (data) => {
        this.onSuccessEliminarDeterminante(data);
      },
      (ex) => {
        this.isLoadingEliminar = false;
        this.utils.MuestraErrorInterno(ex);
        this.determinanteAEliminar = null;
      }
    );
  }
  onSuccessEliminarDeterminante(data: any) {
    this.isLoadingEliminar = false;
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, 'Determinante eliminado correctamente');
      this.cargarDeterminantes();
      this.determinanteAEliminar = null;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message || 'Error al eliminar el determinante');
    }
  }

  //  * * * * * * * * * * * * * * * * * * * * * * * * * *  utilidades 

        // muestra el estado de validacion de los campos en el formulario de editar
  getValidationStatusEditar(fieldName: string): string {
    const field = this.editarDeterminanteForm.get(fieldName);
    if (field?.valid && field?.touched) {
      return 'valid';
    } else if (field?.invalid && field?.touched) {
      return 'invalid';
    }
    return '';
  }

  //solo numeros en formularios
  onlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode; //codigo ascci de la tecla presionada
    
    // solo numeros 0al 9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
