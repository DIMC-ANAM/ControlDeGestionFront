import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import DataTables from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-busqueda-avanzada',
  standalone: false,
  templateUrl: './busqueda-avanzada.component.html',
  styleUrl: './busqueda-avanzada.component.scss'
})
export class BusquedaAvanzadaComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  startDate: string = '';
  endDate: string = '';
  asuntos: any = [{},{},{}];
  dtOptions:any = {};
  dtTrigger: Subject<any> = new Subject<any>();

    applyFilter(): void {
    // Lógica para aplicar el filtro
    console.log('Aplicar filtro:', this.startDate, this.endDate);
  }

  clearFilter(): void {
    this.startDate = '';
    this.endDate = '';
    console.log('Filtro limpiado');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.dtOptions = {
  pagingType: 'full_numbers',
  pageLength: 10,
  responsive: true,
  scrollX: true,
dom: "<'row mb-3'<'col-md-9 d-flex justify-content-start align-items-center dt-buttons-container'B><'col-md-3 d-flex justify-content-end align-items-center'f>>" +
     "<'row'<'col-12'tr>>" +
     "<'row mt-3'<'col-sm-5'i><'col-sm-7'p>>",

  language: {
    url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
    paginate: {
      first: '<i class="fas fa-angle-double-left"></i>',
      previous: '<i class="fas fa-angle-left"></i>',
      next: '<i class="fas fa-angle-right"></i>',
      last: '<i class="fas fa-angle-double-right"></i>'
    },
    search: "Buscar:"
  },
  buttons: [
    {
      extend: 'copyHtml5',
      text: '<i class="fas fa-copy"></i> ',
      titleAttr: 'Copiar al portapapeles'
    },
    {
      extend: 'excelHtml5',
      text: '<i class="fas fa-file-excel"></i> ',
      titleAttr: 'Exportar a Excel'
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="fas fa-file-pdf"></i> ',
      titleAttr: 'Exportar a PDF'
    },
    {
      extend: 'print',
      text: '<i class="fas fa-print"></i>',
      titleAttr: 'Imprimir tabla'
    }
  ],
  destroy: true
};

    
     setTimeout(() => {
      this.asuntos = [
        {
          nombre: 'Oficio 001',
          rfc: 'RFC123',
          nivel: 'Nivel 1',
          puesto: 'Puesto A',
          fechaInicio: '2023-01-01',
          status: 'Activo',
          idStatus: 1
        },
        {
          nombre: 'Oficio 002',
          rfc: 'RFC456',
          nivel: 'Nivel 2',
          puesto: 'Puesto B',
          fechaInicio: '2023-02-15',
          status: 'Pendiente',
          idStatus: 2
        },
        {
          nombre: 'Oficio 003',
          rfc: 'RFC789',
          nivel: 'Nivel 3',
          puesto: 'Puesto C',
          fechaInicio: '2023-03-10',
          status: 'Completado',
          idStatus: 3
        }
      ];
      
      this.dtTrigger.next(null); // Aquí disparas el renderizado de la tabla con datos
    });
    
  }
   rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
     this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
