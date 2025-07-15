// --- gestion-asuntos.component.ts ---
import { Component } from '@angular/core';

interface Documento {
  name: string;
  url: string;
  size: string;
  type: string;
}

type Asignacion = {
  id: number;
  usuario: string;
  rol: string;
  fecha: string;
  estado: string;
  statusAsignacion: string;
};

type Asunto = {
  id: number;
  titulo: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  responsable: string;
  departamento: string;
  categoria: string;
  cliente: string;
  telefono: string;
  email: string;
  direccion: string;
  observaciones: string;
  documentos: Documento[];
  asignaciones: Asignacion[];
};
@Component({
  selector: 'app-consultar-asuntos',
  standalone: false,
  templateUrl: './consultar-asuntos.component.html',
  styleUrl: './consultar-asuntos.component.scss'
})
export class ConsultarAsuntosComponent {
    tabActiva = 'detalles';
    filtroTexto = '';
    filtroEstado = '';
    filtroPrioridad = '';
    filtroTema = '';
    filtroFechaInicio: Date | null = null;
    filtroFechaFin: Date | null = null;

asuntos = [
    {
      idAsunto: 1,
      idTipoDocumento: 101,
      tipoDocumento: 'Oficio',
      noOficio: 'SEP-2024-001',
      esVolante: true,
      numeroVolante: 'VOL-9876',
      esGuia: false,
      numeroGuia: '',
      fechaDocumento: new Date('2024-06-01'),
      fechaRecepcion: new Date('2024-06-03'),
      remitenteNombre: 'Juan Pérez',
      remitenteCargo: 'Director General',
      remitenteDependencia: 'Secretaría de Finanzas',
      dirigidoA: 'María López',
      dirigidoACargo: 'Jefa de Unidad',
      dirigidoADependencia: 'Unidad de Administración y Finanzas',
      descripcionAsunto: 'Solicitud de validación presupuestal para el ejercicio fiscal 2024.',
      idTema: 1,
      Tema: 'Presupuesto',
      fechaCumplimiento: new Date('2024-06-10'),
      idMedio: 1,
      medio: 'Correo Electrónico',
      idPrioridad: 1,
      prioridad: 'alta',
      idStatusAsunto: 1,
      statusAsunto: 'pendiente',
      idUsuarioRegistra: 1,
      usuarioRegistra: 'Carlos Gómez',
      idUnidadAdministrativa: 1,
      unidadAdministrativa: 'UAF',
      fechaRegistro: new Date('2024-06-03'),
      documento: { name: 'oficio_validacion.pdf', url: '#', size: '1.2MB', type: 'PDF' },
      anexos: [
        { name: 'anexo1.pdf', url: '#', size: '800KB', type: 'PDF' },
        { name: 'anexo2.docx', url: '#', size: '1MB', type: 'Word' },
      ],
      asignaciones: [],
      observaciones: "lorem ipsum dolor sit amet, cons... "
    },
    {
      idAsunto: 2,
      idTipoDocumento: 102,
      tipoDocumento: 'Circular',
      noOficio: 'CIRC-2024-015',
      esVolante: false,
      numeroVolante: '',
      esGuia: true,
      numeroGuia: 'GUI-1234',
      fechaDocumento: new Date('2024-06-05'),
      fechaRecepcion: new Date('2024-06-06'),
      remitenteNombre: 'Lucía Ramírez',
      remitenteCargo: 'Subdirectora',
      remitenteDependencia: 'Recursos Humanos',
      dirigidoA: 'Dirección General',
      dirigidoACargo: 'Director',
      dirigidoADependencia: 'Oficina Central',
      descripcionAsunto: 'Notificación de cambios en política interna.',
      idTema: 2,
      Tema: 'Políticas Internas',
      fechaCumplimiento: new Date('2024-06-15'),
      idMedio: 2,
      medio: 'Físico',
      idPrioridad: 2,
      prioridad: 'media',
      idStatusAsunto: 2,
      statusAsunto: 'en_progreso',
      idUsuarioRegistra: 2,
      usuarioRegistra: 'Laura Méndez',
      idUnidadAdministrativa: 2,
      unidadAdministrativa: 'RH',
      fechaRegistro: new Date('2024-06-06'),
      documento: { name: 'circular_cambios.pdf', url: '#', size: '950KB', type: 'PDF' },
      anexos: [
        { name: 'anexo1.pdf', url: '#', size: '800KB', type: 'PDF' },
        { name: 'anexo2.docx', url: '#', size: '1MB', type: 'Word' },
      ],
      asignaciones: [],
      observaciones: "lorem ipsum dolor sit amet, cons... "
    },
    {
      idAsunto: 3,
      idTipoDocumento: 103,
      tipoDocumento: 'Memorándum',
      noOficio: 'MEM-2024-789',
      esVolante: false,
      numeroVolante: '',
      esGuia: false,
      numeroGuia: '',
      fechaDocumento: new Date('2024-05-20'),
      fechaRecepcion: new Date('2024-05-21'),
      remitenteNombre: 'Andrés Herrera',
      remitenteCargo: 'Analista',
      remitenteDependencia: 'Planeación',
      dirigidoA: 'Coordinador General',
      dirigidoACargo: 'Coordinador',
      dirigidoADependencia: 'Dirección de Planeación',
      descripcionAsunto: 'Seguimiento a metas institucionales.',
      idTema: 3,
      Tema: 'Planeación Estratégica',
      fechaCumplimiento: new Date('2024-06-01'),
      idMedio: 3,
      medio: 'Mensajería',
      idPrioridad: 3,
      prioridad: 'baja',
      idStatusAsunto: 3,
      statusAsunto: 'completado',
      idUsuarioRegistra: 3,
      usuarioRegistra: 'Marco Salas',
      idUnidadAdministrativa: 3,
      unidadAdministrativa: 'Planeación',
      fechaRegistro: new Date('2024-05-21'),
      documento: { name: 'memorandum_metas.pdf', url: '#', size: '600KB', type: 'PDF' },
      anexos: [
        { name: 'anexo1.pdf', url: '#', size: '800KB', type: 'PDF' },
        { name: 'anexo2.docx', url: '#', size: '1MB', type: 'Word' },
      ],
      asignaciones: [],
      observaciones: "lorem ipsum dolor sit amet, cons... "
    }
  ];

  asuntoSeleccionado = this.asuntos[0]
  filtros = {
    busqueda: '',
    estado: '',
    prioridad: '',
    departamento: ''
  };

  estadoColors: { [key: string]: string } = {
    pendiente: 'bg-warning text-dark',
    en_progreso: 'bg-info text-dark',
    completado: 'bg-success text-white',
  };

  prioridadColors: { [key: string]: string } = {
    alta: 'bg-danger text-white',
    media: 'bg-warning text-dark',
    baja: 'bg-secondary text-white',
  };


      get asuntosFiltrados() {
    return this.asuntos.filter((a) => {
      const texto = this.filtroTexto.toLowerCase();
      const coincideTexto = Object.values(a).some((valor) => {
        if (typeof valor === 'string') {
          return valor.toLowerCase().includes(texto);
        }
        return false;
      });

      const coincideEstado = this.filtroEstado ? a.statusAsunto === this.filtroEstado : true;
      const coincidePrioridad = this.filtroPrioridad ? a.prioridad === this.filtroPrioridad : true;
      const coincideTema = this.filtroTema ? a.Tema === this.filtroTema : true;
      const coincideFecha =
        (!this.filtroFechaInicio || a.fechaRegistro >= this.filtroFechaInicio) &&
        (!this.filtroFechaFin || a.fechaRegistro <= this.filtroFechaFin);

      return coincideTexto && coincideEstado && coincidePrioridad && coincideTema && coincideFecha;
    });
  }
  seleccionarAsunto(asunto:any ) {
    this.asuntoSeleccionado = asunto;
  }

  limpiarFiltros() {
    this.filtros = {
      busqueda: '',
      estado: '',
      prioridad: '',
      departamento: ''
    };
  }

  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'clock';
      case 'en_progreso': return 'alert-circle';
      case 'completado': return 'check-circle';
      default: return 'x-circle';
    }
  }

  getDocumentIcon(tipo: string): string {
    const t = tipo.toLowerCase();
    if (t === 'pdf') return 'file-pdf';
    if (t === 'doc' || t === 'docx') return 'file-word';
    if (t === 'xls' || t === 'xlsx') return 'file-excel';
    return 'file';
  }
}