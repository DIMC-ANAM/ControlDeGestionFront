import { Component, EventEmitter, Output } from '@angular/core';
import { TurnadoService } from '../../../../api/turnado/turnado.service';
import { UtilsService } from '../../../services/utils.service';
import { ColorsEnum } from '../../../entidades/colors.enum';
import { TipoToast } from '../../../../api/entidades/enumeraciones';

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

    constructor(
      private turnadoApi: TurnadoService,
      private utils: UtilsService,
      public colors: ColorsEnum
    ){}
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.consultarTurnados();
  }
  seleccionarTurnado(asuntoTurnado:any): void {
      this.turnadoSeleccionado.emit({idAsunto: asuntoTurnado.idAsunto, idTurnado: asuntoTurnado.idTurnado });
      this.turnadoSeleccionadoItem = this.turnados.find(a => a.idTurnado === asuntoTurnado.idTurnado) || null;
  }

    get asuntosFiltrados() {
    return this.turnados.filter((a) => {
      const texto = this.filtroTexto.toLowerCase();
      const coincideTexto = Object.values(a).some((valor) => {
        if (typeof valor === 'string') {
          return valor.toLowerCase().includes(texto);
        }
        return false;
      });

      const coincideEstado = this.filtroEstado
        ? a.statusAsunto === this.filtroEstado
        : true;
      const coincidePrioridad = this.filtroPrioridad
        ? a.prioridad === this.filtroPrioridad
        : true;
      const coincideTema = this.filtroTema ? a.Tema === this.filtroTema : true;
      const coincideFecha =
        (!this.filtroFechaInicio ||
          new Date(a.fechaRegistro) >= this.filtroFechaInicio) &&
        (!this.filtroFechaFin ||
          new Date(a.fechaRegistro) <= this.filtroFechaFin);

      return (
        coincideTexto &&
        coincideEstado &&
        coincidePrioridad &&
        coincideTema &&
        coincideFecha
      );
    });
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

}
