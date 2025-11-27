import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { CatalogoService } from '../../../api/catalogo/catalogo.service';
import { UtilsService } from '../../services/utils.service';
import { TipoToast } from '../../../api/entidades/enumeraciones';
import { FechaMexicoPipe } from '../../../app/pipes/date-mx-format'; 

@Component({
  selector: 'app-busqueda-avanzada',
  standalone: false,
  templateUrl: './busqueda-avanzada.component.html',
  styleUrl: './busqueda-avanzada.component.scss',
  providers: [FechaMexicoPipe] 
})
export class BusquedaAvanzadaComponent implements OnInit, OnDestroy {
  // Configuración de AG-Grid
  private gridApi!: GridApi;
  
  // Datos
  rowData: any[] = [];
  columnDefs: ColDef[] = []; 
  paginacion: any = null;
  resumenGeneral: any = null;
  
  // Filtros
  startDate: string = '';
  endDate: string = '';
  folio: string = '';
  
  // Paginación y Estado
  currentPage: number = 1;
  paginationPageSize: number = 50;
  totalRecords: number = 0;
  isLoading: boolean = false;
  
  showColumnPanel: boolean = false;
  
  // Configuración por defecto
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    minWidth: 100,
    suppressMenu: false,
    headerClass: 'text-center',
    cellStyle: { display: 'flex', alignItems: 'center' } 
  };
  
  paginationPageSizeSelector = [10, 25, 50, 100, 200];

  constructor(
    private catalogoService: CatalogoService,
    private fechaMexicoPipe: FechaMexicoPipe,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.initColumnDefs(); 
    this.loadInitialData();
  }

  ngOnDestroy(): void {}

  // formateador para celdas vacías
  emptyCellFormatter(params: ValueFormatterParams): string {
    if (params.value === null || params.value === undefined || params.value === '') {
      return '---'; 
    }
    return params.value;
  }
    getEmptyCellStyle(params: any) {
    if (params.value === null || params.value === undefined || params.value === '') {
      return { color: '#adb5bd', fontStyle: 'italic', fontSize: '0.85rem' }; 
    }
    return null; 
  }

  initColumnDefs(): void {
    const textCol = (props: ColDef): ColDef => ({
      ...props,
      valueFormatter: (p) => this.emptyCellFormatter(p),
      cellStyle: (p) => {
        const emptyStyle = this.getEmptyCellStyle(p);
        return emptyStyle ? { ...emptyStyle, display: 'flex', alignItems: 'center' } : { display: 'flex', alignItems: 'center' };
      }
    });

    this.columnDefs = [
      { 
        headerName: 'Acciones', 
        field: 'actions', 
        pinned: 'right', 
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        hide: false,
        sortable: false, 
        filter: false,
        cellRenderer: (params: any) => this.actionsRenderer(params)
      },
      { headerName: 'Folio Asunto', field: 'asuntoFolio', width: 150, hide: false, pinned: 'left', tooltipField: 'asuntoFolio', filter: false },
      { 
        headerName: 'Estatus', 
        field: 'statusTurnado', 
        width: 130, 
        hide: false,
        cellStyle: params => {
          const baseStyle = { display: 'flex', alignItems: 'center', fontWeight: 'bold' };
          if (params.value === 'Recibido') return { ...baseStyle, color: '#273c6bff' }; 
          if (params.value === 'Rechazado') return { ...baseStyle, color: '#6d2626ff' }; 
          if (params.value === 'En trámite') return { ...baseStyle, color: '#80518eff' }; 
          if (params.value === 'Atendido') return { ...baseStyle, color: '#1c5f3fff' }; 
          return baseStyle;
        }
      },
      { 
        headerName: 'Fecha Registro', 
        field: 'fechaRegistro', 
        width: 160, 
        hide: false,
        valueFormatter: (params) => this.dateFormatter(params, true) 
      },
      
      textCol({ headerName: 'Unidad Responsable', field: 'unidadArea', width: 220, hide: false, tooltipField: 'unidadResonsable' }),
      textCol({ headerName: 'Tema', field: 'asuntoTema', width: 180, hide: false, tooltipField: 'asuntoTema' }),

      // === COLUMNAS OCULTAS ===
      { headerName: 'Fecha Modificación', field: 'fechaModificacion', width: 180, hide: false, valueFormatter: (params) => this.dateFormatter(params, true) },
      { headerName: 'Fecha Recepción', field: 'asuntoFechaRecepcion', width: 160, hide: false, valueFormatter: (params) => this.dateFormatter(params, true) },
      { headerName: 'Fecha Documento', field: 'asuntoFechaDocumento', width: 140, hide: true, valueFormatter: (params) => this.dateFormatter(params, false) },
      { headerName: 'Fecha Cumplimiento', field: 'asuntoFechaCumplimiento', width: 160, hide: true, valueFormatter: (params) => this.dateFormatter(params, false) },
      
      textCol({ headerName: 'Tiempo de Atención', field: 'tiempoAtencionFormateado', width: 180, hide: true }),
      textCol({ headerName: 'Instrucción', field: 'nombreInstruccion', width: 200, hide: true }),
      textCol({ headerName: 'Respuesta', field: 'respuesta', width: 250, hide: true, tooltipField: 'respuesta' }),
      textCol({ headerName: 'Motivo Rechazo', field: 'motivoRechazo', width: 250, hide: true, tooltipField: 'motivoRechazo' }),
      
      textCol({ headerName: 'No. Oficio', field: 'asuntoNoOficio', width: 150, hide: true }),
      textCol({ headerName: 'Tipo Documento', field: 'asuntoTipoDocumento', width: 130, hide: true }),
      textCol({ headerName: 'Remitente', field: 'asuntoRemitente', width: 180, hide: true }),
      textCol({ headerName: 'Cargo Remitente', field: 'asuntoRemitenteCargo', width: 150, hide: true }),
      textCol({ headerName: 'Dependencia Rem.', field: 'asuntoRemitenteDependencia', width: 180, hide: true }),
      textCol({ headerName: 'Dirigido A', field: 'asuntoDirigidoA', width: 180, hide: true }),
      textCol({ headerName: 'Descripción', field: 'asuntoDescripcion', width: 300, hide: true, tooltipField: 'asuntoDescripcion' }),
      textCol({ headerName: 'Prioridad', field: 'asuntoPrioridad', width: 110, hide: true }),
      textCol({ headerName: 'Medio', field: 'asuntoMedio', width: 120, hide: true }),
      textCol({ headerName: 'Observaciones', field: 'asuntoObservaciones', width: 250, hide: true }),

      { headerName: 'Última Operación', field: 'ultimaOperacion', width: 160, hide: true }
    ];
  }

  dateFormatter(params: ValueFormatterParams, mostrarHora: boolean): string {
    if (!params.value) return '---'; 
    return this.fechaMexicoPipe.transform(params.value, mostrarHora, false);
  }

  toggleColumnPanel(): void {
    this.showColumnPanel = !this.showColumnPanel;
  }

  closeColumnPanel(): void {
    this.showColumnPanel = false;
  }

  toggleColumn(field: string): void {
    if (this.gridApi) {
      const colState = this.gridApi.getColumnState();
      const col = colState.find(c => c.colId === field);
      if (col) {
        this.gridApi.setColumnVisible(field, !col.hide ? false : true);
      }
    }
  }

  isColumnVisible(field: string): boolean {
    if (!this.columnDefs || this.columnDefs.length === 0) return false;
    if (!this.gridApi) {
      const col = this.columnDefs.find(c => c.field === field);
      return col ? !col.hide : false;
    }

    try {
      const colState = this.gridApi.getColumnState();
      if (!colState) { 
          const col = this.columnDefs.find(c => c.field === field);
          return col ? !col.hide : false;
      }
      const col = colState.find(c => c.colId === field);
      return col ? !col.hide : false;
    } catch (error) {
      console.warn('Error verificando columna:', error);
      return true; 
    }
  }

  actionsRenderer(params: any) {
    return `
      <div class="d-flex gap-3 justify-content-center align-items-center w-100 h-100">
        <i class="fas fa-eye text-secondary action-icon" data-action="view" data-id="${params.data.idTurnado}" title="Ver oficio"></i>
        <i class="fa solid fa-download text-secondary action-icon" data-action="download" data-id="${params.data.idAsunto}" title="Descargar oficio"></i>
      </div>`;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  loadInitialData(): void { this.buscarTurnados(); }
  applyFilter(): void { this.currentPage = 1; this.buscarTurnados(); }
  clearFilter(): void {
    this.startDate = ''; this.endDate = ''; this.folio = '';
    this.currentPage = 1; this.buscarTurnados();
  }
  
  buscarTurnados(): void {
    this.isLoading = true;
    const postData = {
      fechaInicio: this.startDate || null,
      fechaFin: this.endDate || null,
      folio: this.folio || null,
      ordenamiento: 'fecha', direccion: 'DESC', limite: 10000, offset: 0
    };

    this.catalogoService.busquedaAvanzadaTurnados(postData).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.model) {
          this.rowData = response.model.detalleTurnados || [];
          this.resumenGeneral = response.model.resumenGeneral;
          this.paginacion = response.model.paginacion;
        } else {
            this.utils.MuestrasToast(TipoToast.Warning, response.message || 'No se encontraron resultados.');
            this.rowData = [];
            this.resumenGeneral = null;
            this.paginacion = null;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.utils.MuestraErrorInterno(error);
        this.isLoading = false;
      }
    });
  }

  onCellClicked(event: any): void {
    const target = event.event.target;
    if (target.dataset.action) this.handleAction(target.dataset.action, target.dataset.id, event.data);
  }

  handleAction(action: string, id: string, rowData: any): void {
    if (action === 'view') this.utils.MuestrasToast(TipoToast.Info, `Mostrando oficio`);
    if (action === 'download') this.utils.MuestrasToast(TipoToast.Success, `Descargando oficio`);
  }
}