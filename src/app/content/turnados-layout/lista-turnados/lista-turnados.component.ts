import { Component, EventEmitter, Output } from '@angular/core';
import { TurnadoService } from '../../../../api/turnado/turnado.service';
import { UtilsService } from '../../../services/utils.service';
import { ColorsEnum } from '../../../entidades/colors.enum';
import { TipoToast } from '../../../../api/entidades/enumeraciones';
import { CatalogoService } from '../../../../api/catalogo/catalogo.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-lista-turnados',
  standalone: false,
  templateUrl: './lista-turnados.component.html',
  styleUrl: './lista-turnados.component.scss',
})
export class ListaTurnadosComponent {
  @Output() turnadoSeleccionado = new EventEmitter<any>();
  filtroTexto = '';
  filtroEstado = '';
  filtroPrioridad = '';
  filtroTema = '';
  filtroFechaInicio: Date | null = null;
  filtroFechaFin: Date | null = null;
  cantidades:any =[];

  turnados: any[] = [];
  turnadoSeleccionadoItem: any = null;
  temaDS: any[] = [];
  cambio = false;
  usuario: any = true;
  Math = Math;

  constructor(
    private turnadoApi: TurnadoService,
    private utils: UtilsService,
    public colors: ColorsEnum,
    private catalogoApi: CatalogoService,
	private sessionS: SessionService
  ) {}

  ngOnInit(): void {
    this.usuario = this.sessionS.getUsuario();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.consultarTurnados();
    this.consultarTema();
	this.consultarCantidadesStatus();
  }
  seleccionarTurnado(asuntoTurnado: any): void {
    this.turnadoSeleccionado.emit({
      idAsunto: asuntoTurnado.idAsunto,
      idTurnado: asuntoTurnado.idTurnado,
    });
    this.turnadoSeleccionadoItem =
      this.turnados.find((a) => a.idTurnado === asuntoTurnado.idTurnado) ||
      null;
  }

  get asuntosFiltrados() {
    return this.turnados.filter((a) => {
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
        filtroEstadoNum !== null ? a.idStatusTurnado === filtroEstadoNum : true;

      const coincidePrioridad =
        filtroPrioridadNum !== null
          ? a.idPrioridad === filtroPrioridadNum
          : true;

      const coincideTema = this.filtroTema
        ? a.Tema === this.filtroTema
        : true;

      const fechaTurnado = new Date(a.fechaTurnado);
      const fechaInicio = this.filtroFechaInicio
        ? new Date(this.filtroFechaInicio)
        : null;
      const fechaFin = this.filtroFechaFin
        ? new Date(this.filtroFechaFin)
        : null;

      const registroDateOnly = this.toDateOnly(fechaTurnado);
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
  consultarTurnados(mensaje = '') {
    this.turnadoApi
      .consultarTurnados({
        idUnidadAdministrativa:
          this.usuario
            .idDeterminante /* this.usuario.idDependencia */ /* hay que cambiarlo  */,
      })
      .subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.turnados = data.model;
          } else {
            this.utils.MuestrasToast(TipoToast.Error, data.message);
            this.turnados = [];
          }
          if (mensaje != 'Not') {
            this.cambio = true;
            setTimeout(() => (this.cambio = false), 500);
          }
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
          this.turnados = [];
        }
      );
  }

  onSuccessconsultarTurnados(data: any) {}

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

  verTurnado() {
    if (this.turnadoSeleccionadoItem.idStatusTurnado != 1) return;
    this.turnadoApi
      .verTurnado({
        idTurnado: this.turnadoSeleccionadoItem.idTurnado,
        idUsuarioModifica: this.usuario.idUsuario,
      })
      .subscribe(
        (data) => {
          this.onSuccessverTurnado(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
  }
  onSuccessverTurnado(data: any) {
    if (data.status == 200) {
      /* this.utils.MuestrasToast(TipoToast.Warning, data.message); */

      this.refrescar('Not');
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  /* event emmiter */
  refrescar(mensaje: string) {
    this.consultarTurnados(mensaje);
  }

  consultarCantidadesStatus() {
    this.catalogoApi
      .consultarCantidadesStatus({
        opcion: 2,
        idUnidadResponsable: this.usuario.idDeterminante,
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
      return [1, 2, 3];
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
