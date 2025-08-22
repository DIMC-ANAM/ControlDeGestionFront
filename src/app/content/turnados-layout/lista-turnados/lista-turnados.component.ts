import { Component, EventEmitter, Output } from '@angular/core';
import { TurnadoService } from '../../../../api/turnado/turnado.service';
import { UtilsService } from '../../../services/utils.service';
import { ColorsEnum } from '../../../entidades/colors.enum';
import { TipoToast } from '../../../../api/entidades/enumeraciones';
import { CatalogoService } from '../../../../api/catalogo/catalogo.service';

@Component({
  selector: 'app-lista-turnados',
  standalone: false,
  templateUrl: './lista-turnados.component.html',
  styleUrl: './lista-turnados.component.scss'
})
export class ListaTurnadosComponent {
    @Output() turnadoSeleccionado = new EventEmitter<any>();
  filtroTexto = '';
  filtroEstado = '';
  filtroPrioridad = '';
  filtroTema = '';
  filtroFechaInicio: Date | null = null;
  filtroFechaFin: Date | null = null;

  turnados : any [] =[];
  turnadoSeleccionadoItem: any = null;
  temaDS: any[] = [];
  cambio = true;

    constructor(
      private turnadoApi: TurnadoService,
      private utils: UtilsService,
      public colors: ColorsEnum,
      private catalogoApi: CatalogoService
    ){}
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.consultarTurnados();
    this.consultarTema();
  }
  seleccionarTurnado(asuntoTurnado:any): void {
      this.turnadoSeleccionado.emit({idAsunto: asuntoTurnado.idAsunto, idTurnado: asuntoTurnado.idTurnado });
      this.turnadoSeleccionadoItem = this.turnados.find(a => a.idTurnado === asuntoTurnado.idTurnado) || null;
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
      const filtroPrioridadNum = this.filtroPrioridad ? +this.filtroPrioridad : null;

      const coincideEstado = filtroEstadoNum !== null
        ? a.idStatusAsunto === filtroEstadoNum
        : true;

      const coincidePrioridad = filtroPrioridadNum !== null
        ? a.idPrioridad === filtroPrioridadNum
        : true;

      const coincideTema = this.filtroTema
        ? a.idTema === this.filtroTema
        : true;

      const fechaTurnado = new Date(a.fechaTurnado);
      const fechaInicio = this.filtroFechaInicio ? new Date(this.filtroFechaInicio) : null;
      const fechaFin = this.filtroFechaFin ? new Date(this.filtroFechaFin) : null;

      const registroDateOnly = this.toDateOnly(fechaTurnado);
    const inicioDateOnly = fechaInicio ? this.toDateOnly(fechaInicio) : null;
    const finDateOnly = fechaFin ? this.toDateOnly(fechaFin) : null;


      const coincideFecha = (!inicioDateOnly || registroDateOnly >= inicioDateOnly) && (!finDateOnly || registroDateOnly <= finDateOnly);

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
   consultarTurnados(){
      this.turnadoApi.consultarTurnados({idUnidadAdministrativa:   2   /* hay que cambiarlo  */
  
      }).subscribe(
          (data) => {
            this.onSuccessconsultarTurnados(data);
          },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        } 
    );
    }
  
    onSuccessconsultarTurnados(data:any){
  
      if(data.status == 200){
        this.turnados = data.model;
      }else{
        this.utils.MuestrasToast(TipoToast.Error,data.message);
      }
    }

        consultarTema() {
      this.catalogoApi
        .consultarTema()
        .subscribe(
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

/* event emmiter */
refrescar(mensaje: string) {
     this.consultarTurnados();
  }
}
