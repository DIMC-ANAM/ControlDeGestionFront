import { Component, EventEmitter, Output } from '@angular/core';
import { AsuntoService } from '../../../../api/asunto/asunto.service';
import { UtilsService } from '../../../services/utils.service';
import { TipoToast } from '../../../../api/entidades/enumeraciones';
import { ColorsEnum } from '../../../entidades/colors.enum';
import { CatalogoService } from '../../../../api/catalogo/catalogo.service';

@Component({
  selector: 'app-lista-asuntos',
  standalone: false,
  templateUrl: './lista-asuntos.component.html',
  styleUrl: './lista-asuntos.component.scss',
})
export class ListaAsuntosComponent {
  @Output() asuntoSeleccionado = new EventEmitter<number>();

  filtroTexto = '';
  filtroEstado = '';
  filtroPrioridad = '';
  filtroTema = '';
  filtroFechaInicio: Date | null = null;
  filtroFechaFin: Date | null = null;
  cambio = true;
  asuntos: any[] = [];
  cantidades: any[] = [];
  asuntoSeleccionadoItem: any = null;

  temaDS: any[] = [];
Math: Math;

  constructor(
    private asuntoApi: AsuntoService,
    private catalogoApi: CatalogoService,
    private utils: UtilsService,
    public colors: ColorsEnum
  ) {
	this.Math = Math;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.consultarAsuntosUR();
    this.consultarTema();
    this.consultarCantidadesStatus();
  }

  seleccionarAsunto(id: number): void {
    this.asuntoSeleccionado.emit(id);
    this.asuntoSeleccionadoItem =
      this.asuntos.find((a) => a.idAsunto === id) || null;
  }

  get asuntosFiltrados() {
    return this.asuntos.filter((a) => {
      const texto = this.filtroTexto?.toLowerCase() || '';
      const coincideTexto = texto
        ? Object.values(a).some((valor) => {
            if (typeof valor === 'string') {
              return valor.toLowerCase().includes(texto);
            }
            return false;
          })
        : true;

      const filtroEstadoNum = this.filtroEstado ? +this.filtroEstado : null;
      const filtroPrioridadNum = this.filtroPrioridad
        ? +this.filtroPrioridad
        : null;

      const coincideEstado =
        filtroEstadoNum !== null ? a.idStatusAsunto === filtroEstadoNum : true;

      const coincidePrioridad =
        filtroPrioridadNum !== null
          ? a.idPrioridad === filtroPrioridadNum
          : true;

      const coincideTema = this.filtroTema
        ? a.Tema === this.filtroTema
        : true;

      const fechaRegistro = new Date(a.fechaRegistro);
      const fechaInicio = this.filtroFechaInicio
        ? new Date(this.filtroFechaInicio)
        : null;
      const fechaFin = this.filtroFechaFin
        ? new Date(this.filtroFechaFin)
        : null;

      const registroDateOnly = this.toDateOnly(fechaRegistro);
      const inicioDateOnly = fechaInicio ? this.toDateOnly(fechaInicio) : null;
      const finDateOnly = fechaFin ? this.toDateOnly(fechaFin) : null;

      const coincideFecha =
        (!inicioDateOnly || registroDateOnly >= inicioDateOnly) &&
        (!finDateOnly || registroDateOnly <= finDateOnly);

      return (
        coincideTexto &&
        coincideEstado &&
        coincidePrioridad &&
        coincideTema &&
        coincideFecha
      );
    });
  }

  toDateOnly(date: Date): string {
    return date.toISOString().split('T')[0]; // '2025-08-14'
  }

  /* web services */

  consultarAsuntosUR() {
    this.asuntoApi
      .consultarAsuntosUR({
        idUnidadAdministrativa: 1 /* hay que cambiarlo  */,
      })
      .subscribe(
        (data) => {
          this.onSuccessconsultarAsuntosUR(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
          this.asuntos = [];
        }
      );
  }

  onSuccessconsultarAsuntosUR(data: any) {
    if (data.status == 200) {
      this.asuntos = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Error, data.message);
      this.asuntos = [];
    }
  }
  consultarTema() {
    this.catalogoApi.consultarTema().subscribe(
      (data) => {
        this.onSuccessconsultarTema(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccessconsultarTema(data: any) {
    if (data.status == 200) {
      this.temaDS = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }
  consultarCantidadesStatus() {
    this.catalogoApi
      .consultarCantidadesStatus({
        opcion: 1,
      })
      .subscribe(
        (data) => {
          this.onSuccessconsultarCantidadesStatus(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
  }
  onSuccessconsultarCantidadesStatus(data: any) {
    if (data.status == 200) {
      this.cantidades = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  /* event emmiter */
  refrescar(mensaje: string) {
    this.cambio = false;
	this.consultarCantidadesStatus();
    this.consultarAsuntosUR();

  }

  pageSize: number = 10; // cantidad de asuntos por página
  currentPage: number = 1; // página actual
  

  get totalPages(): number {
    return Math.ceil(this.asuntosFiltrados.length / this.pageSize);
  }

	get asuntosPaginados() {
	// Si la página actual queda fuera de rango al cambiar el pageSize o filtros, reajústala
	const totalPages = this.totalPages;
	if (this.currentPage > totalPages && totalPages > 0) {
		this.currentPage = totalPages;
	}

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return this.asuntosFiltrados.slice(startIndex, endIndex);
}

  cambiarPagina(page: number | string) {
	if (typeof page === 'string') return; // evita intentar navegar con '...'
	if (page >= 1 && page <= this.totalPages) {
		this.currentPage = page;
	}
  }

  get paginasMostradas(): (number | string)[] {
    const total = this.totalPages;
    const actual = this.currentPage;
    const maxVisible = 5;
    const pages: (number | string)[] = [];

/*     if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (actual <= 2) {
        // Primeros tres
        pages.push(1, 2, 3);
      } else if (actual >= total - 1) {
        // Últimos tres
        pages.push('...', total - 2, total - 1, total);
      } else {
        // Tres en medio
        pages.push('...', actual - 1, actual, actual + 1, '...');
      }
    } */
    if (actual <= 2) {
      return [1, 2];
    }
    if (actual >= total - 1) {
      return ['...', total - 2, total - 1, total];
    }
    return ['...', actual - 1, actual, actual + 1, '...'];
  }

onPageSizeChange(newSize: number) {
  this.pageSize = newSize || 10;
  this.currentPage = 1;
}
  
}
