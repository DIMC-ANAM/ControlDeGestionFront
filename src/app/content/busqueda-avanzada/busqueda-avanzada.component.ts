import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, IDateFilterParams, ITextFilterParams } from 'ag-grid-community';
import { CatalogoService } from '../../../api/catalogo/catalogo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-busqueda-avanzada',
  standalone: false,
  templateUrl: './busqueda-avanzada.component.html',
  styleUrl: './busqueda-avanzada.component.scss'
})
export class BusquedaAvanzadaComponent implements OnInit, OnDestroy {
  // Configuración de AG-Grid
  private gridApi!: GridApi;
  
  // Datos
  rowData: any[] = [];
  resumenGeneral: any = null;
  distribucionPorStatus: any[] = [];
  distribucionPorUnidad: any[] = [];
  paginacion: any = null;
  catalogoTemas: any[] = [];
  catalogoUnidades: any[] = [];
  catalogoInstrucciones: any[] = [];
  
  // Filtros
  startDate: string = '';
  endDate: string = '';
  idUnidadResponsable: string = '';
  statusTurnado: string = '';
  folio: string = '';
  idTema: number | null = null;
  statusAsunto: string = '';
  textSearch: string = '';
  
  // Paginación
  currentPage: number = 1;
  pageSize: number = 50;
  totalRecords: number = 0;
  
  // Loading state
  isLoading: boolean = false;
  
  // Control del modal de columnas
  showColumnModal: boolean = false;
  
  // Definición de columnas de AG-Grid
  columnDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'idTurnado',
      width: 80,
      filter: 'agNumberColumnFilter',
      sortable: true,
      pinned: 'left',
      hide: false, // Visible por defecto
      lockPosition: true
    },
    {
      headerName: 'Folio Asunto',
      field: 'asuntoFolio',
      width: 170,
      filter: 'agTextColumnFilter',
      sortable: true,
      hide: false, // Visible por defecto
      cellRenderer: (params: any) => {
        return `<span class="badge bg-primary">${params.value || 'N/A'}</span>`;
      }
    },
    {
      headerName: 'No. Oficio',
      field: 'asuntoNoOficio',
      width: 150,
      filter: 'agTextColumnFilter',
      sortable: true,
      hide: true // Oculto por defecto
    },
    {
      headerName: 'Status',
      field: 'statusTurnado',
      width: 140,
      filter: 'agSetColumnFilter',
      sortable: true,
      hide: false, // Visible por defecto
      cellRenderer: (params: any) => {
        const statusMap: any = {
          'Recibido': '<span class="badge bg-info">Recibido</span>',
          'En trámite': '<span class="badge bg-warning">En trámite</span>',
          'Atendido': '<span class="badge bg-success">Atendido</span>',
          'Rechazado': '<span class="badge bg-danger">Rechazado</span>'
        };
        return statusMap[params.value] || params.value;
      }
    },
    {
      headerName: 'Unidad Responsable',
      field: 'unidadArea',
      width: 260,
      filter: 'agTextColumnFilter',
      sortable: true,
      hide: false // Visible por defecto
    },
    {
      headerName: 'Instrucción',
      field: 'nombreInstruccion',
      width: 150,
      filter: 'agTextColumnFilter',
      sortable: true,
      hide: true // Oculto por defecto
    },
    {
      headerName: 'Tema',
      field: 'asuntoTema',
      width: 180,
      filter: 'agTextColumnFilter',
      sortable: true,
      hide: false // Visible por defecto
    },
    {
      headerName: 'Remitente',
      field: 'asuntoRemitente',
      width: 200,
      filter: 'agTextColumnFilter',
      sortable: true,
      hide: false // Visible por defecto
    },
    {
      headerName: 'Descripción',
      field: 'asuntoDescripcion',
      width: 250,
      filter: 'agTextColumnFilter',
      sortable: true,
      hide: false, // Visible por defecto
      cellRenderer: (params: any) => {
        const text = params.value || '';
        const maxLength = 100;
        if (text.length > maxLength) {
          const truncated = text.substring(0, maxLength) + '...';
          return `<span title="${text.replace(/"/g, '&quot;')}" style="cursor: help;">${truncated}</span>`;
        }
        return text;
      }
    },
    {
      headerName: 'Fecha Registro',
      field: 'fechaRegistro',
      width: 140,
      filter: 'agDateColumnFilter',
      sortable: true,
      hide: false, // Visible por defecto
      valueFormatter: (params: any) => {
        if (!params.value) return 'N/A';
        return new Date(params.value).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
    },
    {
      headerName: 'Fecha Modificación',
      field: 'fechaModificacion',
      width: 140,
      filter: 'agDateColumnFilter',
      sortable: true,
      hide: true, // Oculto por defecto
      valueFormatter: (params: any) => {
        if (!params.value) return 'N/A';
        return new Date(params.value).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
    },
    {
      headerName: 'Tiempo Atención',
      field: 'tiempoAtencionFormateado',
      width: 140,
      sortable: true,
      hide: true // Oculto por defecto
    },
    {
      headerName: 'Tiene Respuesta',
      field: 'respuesta',
      width: 120,
      filter: 'agSetColumnFilter',
      sortable: true,
      hide: true, // Oculto por defecto
      cellRenderer: (params: any) => {
        return params.value ? 
          '<i class="fas fa-check-circle text-success"></i> Sí' : 
          '<i class="fas fa-times-circle text-danger"></i> No';
      }
    },
    {
      headerName: 'Status Asunto',
      field: 'asuntoStatus',
      width: 140,
      filter: 'agSetColumnFilter',
      sortable: true,
      hide: true // Oculto por defecto
    },
    {
      headerName: 'Acciones',
      field: 'actions',
      width: 120,
      pinned: 'right',
      sortable: false,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      cellRenderer: (params: any) => {
        return `
          <div class="d-flex gap-3 justify-content-center align-items-center" style="height: 100%;">
            <i class="fas fa-eye text-primary" 
               data-action="view" 
               data-id="${params.data.idTurnado}" 
               style="cursor: pointer; font-size: 16px;"
               title="Ver detalle"></i>
            <i class="fas fa-folder-open text-info" 
               data-action="folder" 
               data-id="${params.data.idAsunto}" 
               style="cursor: pointer; font-size: 16px;"
               title="Ver expediente"></i>
            <i class="fas fa-download text-success" 
               data-action="download" 
               data-id="${params.data.idAsunto}" 
               style="cursor: pointer; font-size: 16px;"
               title="Descargar"></i>
          </div>
        `;
      }
    }
  ];
  
  // Opciones por defecto de AG-Grid
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    minWidth: 100,
    suppressMenu: false
  };
  
  // Configuración de paginación
  paginationPageSize = 50;
  paginationPageSizeSelector = [10, 25, 50, 100, 200];



  constructor(
    private catalogoService: CatalogoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  loadInitialData(): void {
    this.buscarTurnados();
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.buscarTurnados();
  }

  clearFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.idUnidadResponsable = '';
    this.statusTurnado = '';
    this.folio = '';
    this.idTema = null;
    this.statusAsunto = '';
    this.textSearch = '';
    this.currentPage = 1;
    this.buscarTurnados();
  }

  buscarTurnados(): void {
    this.isLoading = true;
    
    const postData = {
      fechaInicio: this.startDate || null,
      fechaFin: this.endDate || null,
      idUnidadResponsable: this.idUnidadResponsable || null,
      statusTurnado: this.statusTurnado || null,
      folio: this.folio || null,
      idTema: this.idTema || null,
      statusAsunto: this.statusAsunto || null,
      ordenamiento: 'fecha',
      direccion: 'DESC',
      limite: 10000, // Cargar todos los registros
      offset: 0
    };

    this.catalogoService.busquedaAvanzadaTurnados(postData).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.model) {
          // Asignar datos principales
          this.rowData = response.model.detalleTurnados || [];
          this.resumenGeneral = response.model.resumenGeneral || null;
          this.distribucionPorStatus = response.model.distribucionPorStatus || [];
          this.distribucionPorUnidad = response.model.distribucionPorUnidad || [];
          this.paginacion = response.model.paginacion || null;
          
          // Catálogos para filtros
          this.catalogoTemas = response.model.catalogoTemas || [];
          this.catalogoUnidades = response.model.catalogoUnidades || [];
          this.catalogoInstrucciones = response.model.catalogoInstrucciones || [];
          
          // Actualizar información de paginación
          if (this.paginacion) {
            this.totalRecords = this.paginacion.totalRegistros || 0;
          }
          
          this.toastr.success('Búsqueda realizada exitosamente', 'Éxito');
        } else {
          this.toastr.error(response.message || 'Error al realizar la búsqueda', 'Error');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error en búsqueda avanzada:', error);
        this.toastr.error('Error al realizar la búsqueda', 'Error');
        this.isLoading = false;
      }
    });
  }

  onCellClicked(event: any): void {
    const target = event.event.target;
    if (target.tagName === 'I' || target.tagName === 'BUTTON') {
      const element = target.tagName === 'I' ? target : target;
      const action = element.getAttribute('data-action');
      const id = element.getAttribute('data-id');
      
      if (action && id) {
        this.handleAction(action, id, event.data);
      }
    }
  }

  onCellDoubleClicked(event: any): void {
    // Expandir celda en doble click para ver texto completo
    if (event.value && typeof event.value === 'string' && event.value.length > 100) {
      this.toastr.info(event.value, event.colDef.headerName, {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        enableHtml: true
      });
    }
  }

  handleAction(action: string, id: string, rowData: any): void {
    switch (action) {
      case 'view':
        this.verDetalleTurnado(id);
        break;
      case 'folder':
        this.verExpediente(id);
        break;
      case 'download':
        this.descargarExpediente(id);
        break;
    }
  }

  verDetalleTurnado(idTurnado: string): void {
    console.log('Ver detalle turnado:', idTurnado);
    this.toastr.info(`Abriendo detalle del turnado ${idTurnado}`, 'Información');
    // Aquí puedes implementar la navegación o abrir un modal
  }

  verExpediente(idAsunto: string): void {
    console.log('Ver expediente:', idAsunto);
    this.toastr.info(`Abriendo expediente del asunto ${idAsunto}`, 'Información');
    // Aquí puedes implementar la navegación o abrir un modal
  }

  descargarExpediente(idAsunto: string): void {
    console.log('Descargar expediente:', idAsunto);
    this.toastr.info(`Descargando expediente del asunto ${idAsunto}`, 'Información');
    // Aquí puedes implementar la descarga del ZIP
  }

  onPageSizeChanged(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.buscarTurnados();
  }

  exportToExcel(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsExcel({
        fileName: `busqueda_turnados_${new Date().getTime()}.xlsx`
      });
      this.toastr.success('Exportando a Excel', 'Éxito');
    }
  }

  exportToCsv(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: `busqueda_turnados_${new Date().getTime()}.csv`
      });
      this.toastr.success('Exportando a CSV', 'Éxito');
    }
  }

  openColumnPanel(): void {
    this.showColumnModal = true;
  }

  closeColumnModal(): void {
    this.showColumnModal = false;
  }

  toggleColumn(field: string): void {
    if (this.gridApi) {
      const columnState = this.gridApi.getColumnState();
      const column = columnState.find(col => col.colId === field);
      if (column) {
        this.gridApi.setColumnVisible(field, column.hide || false);
      }
    }
  }

  isColumnVisible(field: string): boolean {
    if (!this.gridApi) return true;
    try {
      const columnState = this.gridApi.getColumnState();
      if (!columnState || !Array.isArray(columnState)) return true;
      const column = columnState.find(col => col.colId === field);
      return column ? !column.hide : true;
    } catch (error) {
      return true;
    }
  }
}
