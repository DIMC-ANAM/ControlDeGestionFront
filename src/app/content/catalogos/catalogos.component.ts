import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogoService } from '../../../api/catalogo/catalogo.service';
import { ModalManagerService } from '../../components/shared/modal-manager.service';
import { UtilsService } from '../../services/utils.service';
import { TipoToast } from '../../../api/entidades/enumeraciones';

type ViewMode = 'grid' | 'table';
type CatalogClave = 'determinantes' | 'tema' | 'tipoDocumento';

interface CatalogCard {
  clave: CatalogClave;
  titulo: string;
  descripcion: string;
  icon: string;
  iconSize?: string;
}

@Component({
  selector: 'app-catalogos',
  standalone: false,
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.scss']
})
export class CatalogosComponent implements OnInit {
  mode: ViewMode = 'grid';
  selectedCatalog: 'determinantes' | 'tema' | 'tipoDocumento' | null = null;

  // Tarjetas del grid
  cards: CatalogCard[] = [
    { clave: 'determinantes', titulo: 'Determinantes', descripcion: 'Catálogo de determinantes', icon: 'fas fa-building-columns', iconSize: '5rem' },
    { clave: 'tema',          titulo: 'Tema',          descripcion: 'Catálogo de temas',         icon: 'fas fa-table-list ', iconSize: '2rem'},
    { clave: 'tipoDocumento',     titulo: 'Tipo Documento',     descripcion: 'Catálogo de tipos de documento',   icon: 'fas fa-file-alt'     },
  ];

  Math = Math;
  personal: any[] = [];
  filteredPersonal: any[] = [];
  paginaPersonal: any[] = [];
  searchTerm = '';
  pageSize = 10;
  currentPage = 0;         
  totalPages = 0;
  visiblePages: number[] = [];

  // Templates de modal
  @ViewChild('modalForm', { static: true }) modalForm!: TemplateRef<any>;
  @ViewChild('activarDesactivarModal', { static: true }) activarDesactivarModal!: TemplateRef<any>;

  form!: FormGroup;
  formMode: 'crear' | 'editar' = 'crear';
  editingRow: any = null;
  toggleTarget: any = null;
  registroSeleccionado: any = null;

  updateSuccess: boolean = false;
  updateMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private api: CatalogoService,
    private modalManager: ModalManagerService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {}

  //  Navegación
  openCatalog(card: { clave: CatalogClave }): void {
    this.selectedCatalog = card.clave;
    this.mode = 'table';
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadTable();
  }

  backToGrid(): void {
    this.mode = 'grid';
    this.selectedCatalog = null;
    this.personal = [];
    this.filteredPersonal = [];
    this.paginaPersonal = [];
  }

  //  Formularios con validaciones
  private buildForm(): void {
    if (this.selectedCatalog === 'determinantes') {
      // Solo area y determinante obligatorios
      this.form = this.fb.group({
        id: [null],
        nivel: [''],
        unidadDeNegocio: [''],
        unidadAdministrativa: [''],
        area: ['', Validators.required],
        determinante: ['', Validators.required],
        dependencia: [''],
      });
    } else {
      this.form = this.fb.group({
        nombre: ['', Validators.required],
      });
    }
  }

  //  Carga de datos 
  private loadTable(): void {
    if (!this.selectedCatalog) { return; }

    switch (this.selectedCatalog) {
      case 'determinantes':
        this.api.consultarDeterminantes({ id: 0 }).subscribe(
          (data: any) => {
            if (data.status === 200) {
              const arr = Array.isArray(data.model) ? data.model : [];
              this.personal = arr.map((r: any) => ({
                id: r.id ?? 0,
                nivel: r.nivel ?? '',
                unidadDeNegocio: r.unidadDeNegocio ?? '',
                unidadAdministrativa: r.unidadAdministrativa ?? '',
                area: r.area ?? '',
                determinante: r.determinante ?? '',
                dependencia: r.dependencia ?? '',
                fechaRegistro: r.fechaRegistro ?? null,
                fechaModificacion: r.fechaModificacion ?? null,
                idUsuarioModifica: r.idUsuarioModifica ?? null,
                idUsuarioCreacion: r.idUsuarioRegistra ?? null,
                activo: (r.activo ?? 1) === 1
              }));
              this.resetPaging();
            } else {
              this.utils.MuestrasToast(TipoToast.Warning, data.message);
              this.personal = [];
              this.resetPaging();
            }
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
            this.personal = [];
            this.resetPaging();
          }
        );
        break;

      case 'tema':
        this.api.consultarTema().subscribe(
          (data: any) => {
            if (data.status === 200) {
              this.personal = (data.model || []).map((r: any) => ({
                idTema: r.idTema ?? r.id ?? 0,
                tema: r.tema ?? '',
                fechaRegistro: r.fechaRegistro ?? null,
                fechaModificacion: r.fechaModificacion ?? null,
                activo: (r.activo ?? 1) === 1
              }));
              this.resetPaging();
            } else {
              this.utils.MuestrasToast(TipoToast.Warning, data.message);
              this.personal = [];
              this.resetPaging();
            }
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
            this.personal = [];
            this.resetPaging();
          }
        );
        break;

      case 'tipoDocumento':
        this.api.consultarTipoDocumento().subscribe(
          (data: any) => {
            if (data.status === 200) {
              this.personal = (data.model || []).map((r: any) => ({
                idTipoDocumento: r.idTipoDocumento ?? r.id ?? 0,
                tipoDocumento: r.tipoDocumento ?? '',
                fechaRegistro: r.fechaRegistro ?? null,
                fechaModificacion: r.fechaModificacion ?? null,
                activo: (r.activo ?? 1) === 1
              }));
              this.resetPaging();
            } else {
              this.utils.MuestrasToast(TipoToast.Warning, data.message);
              this.personal = [];
              this.resetPaging();
            }
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
            this.personal = [];
            this.resetPaging();
          }
        );
        break;
    }
  }

  //  Filtro + paginación 
  applyFilter(): void {
    const term = (this.searchTerm || '').toLowerCase();

    this.filteredPersonal = (this.personal || []).filter((row: any) => {
      if (this.selectedCatalog === 'determinantes') {
        return (
          (row.nivel && row.nivel.toLowerCase().includes(term)) ||
          (row.unidadDeNegocio && row.unidadDeNegocio.toLowerCase().includes(term)) ||
          (row.unidadAdministrativa && row.unidadAdministrativa.toLowerCase().includes(term)) ||
          (row.area && row.area.toLowerCase().includes(term)) ||
          (row.determinante && row.determinante.toString().toLowerCase().includes(term)) ||
          (row.dependencia && row.dependencia.toLowerCase().includes(term)) ||
          (row.fechaRegistro && row.fechaRegistro.toString().toLowerCase().includes(term))
        );
      }
      if (this.selectedCatalog === 'tema') {
        return (
          (row.tema && row.tema.toLowerCase().includes(term)) ||
          (row.fechaRegistro && row.fechaRegistro.toString().toLowerCase().includes(term)) ||
          (row.fechaModificacion && row.fechaModificacion.toString().toLowerCase().includes(term)) ||
          ((row.activo ? 'activo' : 'inactivo').includes(term))
        );
      }
      // tipoDocumento
      return (
        (row.tipoDocumento && row.tipoDocumento.toLowerCase().includes(term)) ||
        (row.fechaRegistro && row.fechaRegistro.toString().toLowerCase().includes(term)) ||
        (row.fechaModificacion && row.fechaModificacion.toString().toLowerCase().includes(term)) ||
        ((row.activo ? 'activo' : 'inactivo').includes(term))
      );
    });

    this.totalPages = Math.max(1, Math.ceil(this.filteredPersonal.length / this.pageSize));
    this.currentPage = 0;
    this.updatePaginaPersonal();
    this.updateVisiblePages();
  }

  onPageSizeChange(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredPersonal.length / this.pageSize));
    this.currentPage = 0;
    this.updatePaginaPersonal();
    this.updateVisiblePages();
  }

  private resetPaging(): void {
    this.filteredPersonal = [...this.personal];
    this.totalPages = Math.max(1, Math.ceil(this.filteredPersonal.length / this.pageSize));
    this.currentPage = 0;
    this.updatePaginaPersonal();
    this.updateVisiblePages();
  }

  updatePaginaPersonal(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginaPersonal = this.filteredPersonal.slice(start, end);
  }

  updateVisiblePages(): void {
    const total = this.totalPages;
    const current = this.currentPage + 1; 
    const pages: number[] = [];
    if (current > 1) pages.push(current - 1);
    pages.push(current);
    if (current < total) pages.push(current + 1);
    this.visiblePages = pages;
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginaPersonal();
      this.updateVisiblePages();
    }
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginaPersonal();
      this.updateVisiblePages();
    }
  }
  goToPage(p1based: number): void {
    this.currentPage = p1based - 1;
    this.updatePaginaPersonal();
    this.updateVisiblePages();
  }

  // -------- Modales
  openCrear(): void {
    if (!this.selectedCatalog) return;
    this.formMode = 'crear';
    this.editingRow = null;
    this.buildForm();

    const title =
      this.selectedCatalog === 'determinantes'
        ? '<i class="fas fa-plus-circle me-2"></i> Crear determinante'
        : this.selectedCatalog === 'tema'
        ? '<i class="fas fa-plus-circle me-2"></i> Crear tema'
        : '<i class="fas fa-plus-circle me-2"></i> Crear tipo de documento'; // niguno de los dos, entonces es tipoDocumento

    this.modalManager.openModal({
      title,
      template: this.modalForm,
      showFooter: true,
      onAccept: () => this.onAccept(),
      onCancel: () => {},
      width: this.selectedCatalog === 'determinantes' ? '900px' : '500px'
    });
  }

  openEditar(row: any): void {
    if (!this.selectedCatalog) return;
    this.formMode = 'editar';
    this.editingRow = row;
    this.buildForm();

    if (this.selectedCatalog === 'determinantes') {
      this.form.patchValue({
        id: row.id,
        nivel: row.nivel,
        unidadDeNegocio: row.unidadDeNegocio,
        unidadAdministrativa: row.unidadAdministrativa,
        area: row.area,
        determinante: row.determinante,
        dependencia: row.dependencia
      });
    } else if (this.selectedCatalog === 'tema') {
      this.form.patchValue({ nombre: row.tema });
    } else {
      this.form.patchValue({ nombre: row.tipoDocumento });
    }

    const title =
      this.selectedCatalog === 'determinantes'
        ? '<i class="fas fa-user-edit me-2"></i> Editar determinante'
        : this.selectedCatalog === 'tema'
        ? '<i class="fas fa-user-edit me-2"></i> Editar tema'
        : '<i class="fas fa-user-edit me-2"></i> Editar tipo de documento';

    this.modalManager.openModal({
      title,
      template: this.modalForm,
      showFooter: true,
      onAccept: () => this.onAccept(),
      onCancel: () => {},
      width: this.selectedCatalog === 'determinantes' ? '900px' : '500px'
    });
  }

  openToggle(row: any): void {
    this.toggleTarget = row;
    this.registroSeleccionado = row; 
    const action = row.activo ? 'desactivar' : 'activar';
    const title = `<i class="fas fa-user-cog me-2"></i>¿Desea ${action} este registro?`;

    this.modalManager.openModal({
      title,
      template: this.activarDesactivarModal,
      showFooter: true,
      onAccept: () => this.confirmarToggle(),
      onCancel: () => {},
      width: '520px'
    });
  }

  // canpos obligarotios  
  private onAccept(): void {
    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      this.utils.MuestrasToast(TipoToast.Warning, 'Faltan campos obligatorios.');
      return;
    }
    this.submitForm();
  }

  // web services
  private submitForm(): void {
    if (!this.selectedCatalog) return;

    if (this.selectedCatalog === 'determinantes') {
      const v = this.form.value;
      const payload = {
        id: v.id || 0,
        nivel: v.nivel || null,
        unidadDeNegocio: v.unidadDeNegocio || null,
        unidadAdministrativa: v.unidadAdministrativa || null,
        area: v.area,
        determinante: v.determinante,
        dependencia: v.dependencia || null
      };

      const req$ = this.formMode === 'crear'
        ? this.api.insertarDeterminantes(payload)
        : this.api.actualizarDeterminantes(payload);

      req$.subscribe(
        (data: any) => {
          if (data.status === 200) {
            this.utils.MuestrasToast(TipoToast.Success, `Operación exitosa.`);
          } else {
            this.utils.MuestrasToast(TipoToast.Warning, data.message || 'Operación no realizada.');
          }
          this.loadTable();
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );

      return;
    }

    // Tema / Tipo Documento
    const nombre = this.form.value.nombre;
    if (this.selectedCatalog === 'tema') {
      const req$ = this.formMode === 'crear'
        ? this.api.registrarTema({ tema: nombre })
        : this.api.actualizarTema({ idTema: this.editingRow.idTema, tema: nombre });

      req$.subscribe(
        (data: any) => {
          if (data.status === 200) {
            const action = this.formMode === 'crear' ? 'registrado' : 'actualizado';
            this.utils.MuestrasToast(TipoToast.Success, `Tema ${action} con éxito.`);
          } else {
            this.utils.MuestrasToast(TipoToast.Warning, data.message || 'Operación no realizada.');
          }
          this.loadTable();
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
    } else {
      const req$ = this.formMode === 'crear'
        ? this.api.registrarTipoDocumento({ tipoDocumento: nombre })
        : this.api.actualizarTipoDocumento({ idTipoDocumento: this.editingRow.idTipoDocumento, tipoDocumento: nombre });

      req$.subscribe(
        (data: any) => {
          if (data.status === 200) {
            this.utils.MuestrasToast(TipoToast.Success, `Operación exitosa.`);
          } else {
            this.utils.MuestrasToast(TipoToast.Warning, data.message || 'Operación no realizada.');
          }
          this.loadTable();
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
    }
  }

  // -------- Activar / Desactivar 
  confirmarToggle(): void {
    if (!this.selectedCatalog || !this.toggleTarget) return;

    let req$;
    if (this.selectedCatalog === 'determinantes') {
      req$ = this.api.desactivarDeterminantes({ id: this.toggleTarget.id });
    } else if (this.selectedCatalog === 'tema') {
      req$ = this.api.desactivarTema({ idTema: this.toggleTarget.idTema });
    } else {
      req$ = this.api.desactivarTipoDocumento({ idTipoDocumento: this.toggleTarget.idTipoDocumento });
    }

    req$.subscribe(
      (data: any) => {
        if (data.status === 200) {
          this.utils.MuestrasToast(TipoToast.Success, data.message || 'Operación exitosa.');
        } else {
          this.utils.MuestrasToast(TipoToast.Warning, data.message || 'Operación no realizada.');
        }
        this.loadTable();
      },
      (ex) => this.utils.MuestraErrorInterno(ex)
    );
  }

  isInvalid(ctrl: string): boolean {
    const c = this.form?.get(ctrl);
    return !!c && c.invalid && c.touched;
  }
  isValid(ctrl: string): boolean {
    const c = this.form?.get(ctrl);
    return !!c && c.valid && c.touched;
  }
}
