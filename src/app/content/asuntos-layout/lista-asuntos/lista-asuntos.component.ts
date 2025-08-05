import { Component, EventEmitter, Output } from '@angular/core';
import { AsuntoService } from '../../../../api/asunto/asunto.service';
import { UtilsService } from '../../../services/utils.service';
import { TipoToast } from '../../../../api/entidades/enumeraciones';
import { ColorsEnum } from '../../../entidades/colors.enum';

@Component({
  selector: 'app-lista-asuntos',
  standalone: false,
  templateUrl: './lista-asuntos.component.html',
  styleUrl: './lista-asuntos.component.scss'
})
export class ListaAsuntosComponent {
    @Output() asuntoSeleccionado = new EventEmitter<number>();
  
  filtroTexto = '';
  filtroEstado = '';
  filtroPrioridad = '';
  filtroTema = '';
  filtroFechaInicio: Date | null = null;
  filtroFechaFin: Date | null = null;

  asuntos:any[] = [];
  asuntoSeleccionadoItem: any = null;


  constructor(
    private asuntoApi: AsuntoService,
    private utils: UtilsService,
    public colors: ColorsEnum
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.consultarAsuntosUR();
  }

  seleccionarAsunto(id: number): void {
    this.asuntoSeleccionado.emit(id);
    this.asuntoSeleccionadoItem = this.asuntos.find(a => a.idAsunto === id) || null;
  }
  
  get asuntosFiltrados() {
    return this.asuntos.filter((a) => {
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

  /* web services */

  consultarAsuntosUR(){
    this.asuntoApi.consultarAsuntosUR({idUnidadAdministrativa: 1   /* hay que cambiarlo  */

    }).subscribe(
        (data) => {
          this.onSuccessconsultarAsuntosUR(data);
        },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      } 
  );
  }

  onSuccessconsultarAsuntosUR(data:any){

    if(data.status == 200){
      this.asuntos = data.model;
    }else{
      this.utils.MuestrasToast(TipoToast.Error,data.message);
    }
  }
}
