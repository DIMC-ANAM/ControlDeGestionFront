import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-detalle-turnados',
  standalone: false,
  templateUrl: './detalle-turnados.component.html',
  styleUrl: './detalle-turnados.component.scss'
})
export class DetalleTurnadosComponent {
@Input() idAsunto: number | null = null;


  constructor(private fb: FormBuilder){}

   turnadoForm!: FormGroup; // Formulario para agregar nuevos turnados
  turnados: any = []; // Lista donde se almacenarán los turnados agregados

  unidadesResponsablesDS: any[] = [
    { id: 1, nombre: 'Departamento de Recursos Humanos' },
    { id: 2, nombre: 'Dirección de Finanzas' },
    { id: 3, nombre: 'Subsecretaría de Asuntos Legales' }
  ];

  instruccionesDS: any[] = [
    { id: 1, descripcion: 'Para su conocimiento' },
    { id: 2, descripcion: 'Para su atención y respuesta' },
    { id: 3, descripcion: 'Para archivo' },
    { id: 4, descripcion: 'Para elaboración de informe' }
  ];
    asuntos = [
    {
      idAsunto: 1,
      idTipoDocumento: 101,
      tipoDocumento: 'Oficio',
      noOficio: 'GOB-2024-001',
      esVolante: true,
      numeroVolante: 'VOL-9876',
      esGuia: false,
      numeroGuia: '',
      fechaDocumento: '2024-06-01',
      fechaRecepcion: '2024-06-03',
      remitenteNombre: 'Juan Alberto Maldonado Hérnandez',
      remitenteCargo: 'Director General',
      remitenteDependencia: 'Secretaría de Finanzas',
      dirigidoA: 'María López',
      dirigidoACargo: 'Jefa de Unidad',
      dirigidoADependencia: 'Unidad de Administración y Finanzas',
      descripcionAsunto:
        'Solicitud de validación presupuestal para elvSolicitud de validación presupuestal para el ejercicio fiscal 2024.Solicitud de validación presupuestal para el ejercicio fiscal 2024.   ejercicio fiscal 2024.Solicitud de validación presupuestal para el ejercicio fiscal 2024.',
      idTema: 1,
      Tema: 'Presupuesto',
      fechaCumplimiento: '2024-06-10',
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
      fechaRegistro: '2024-06-03',
      documento: {
        name: 'oficio_validacion.pdf',
        url: '#',
        size: '1.2MB',
        type: 'PDF',
      },
      anexos: [
        { name: 'anexo1.pdf', url: '#', size: '800KB', type: 'PDF' },
        { name: 'anexo2.docx', url: '#', size: '1MB', type: 'Word' },
      ],
      asignaciones: [],
      observaciones: 'lorem ipsum dolor sit amet, cons... ',
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
      fechaDocumento: '2024-06-05',
      fechaRecepcion: '2024-06-06',
      remitenteNombre: 'Lucía Ramírez',
      remitenteCargo: 'Subdirectora',
      remitenteDependencia: 'Recursos Humanos',
      dirigidoA: 'Dirección General',
      dirigidoACargo: 'Director',
      dirigidoADependencia: 'Oficina Central',
      descripcionAsunto: 'Notificación de cambios en política interna.',
      idTema: 2,
      Tema: 'Políticas Internas',
      fechaCumplimiento: '2024-06-15',
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
      fechaRegistro: '2024-06-06',
      documento: {
        name: 'circular_cambios.pdf',
        url: '#',
        size: '950KB',
        type: 'PDF',
      },
      anexos: [
        { name: 'anexo1.pdf', url: '#', size: '800KB', type: 'PDF' },
        { name: 'anexo2.docx', url: '#', size: '1MB', type: 'Word' },
      ],
      asignaciones: [],
      observaciones: 'lorem ipsum dolor sit amet, cons... ',
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
      fechaDocumento: '2024-05-20',
      fechaRecepcion: '2024-05-21',
      remitenteNombre: 'Andrés Herrera',
      remitenteCargo: 'Analista',
      remitenteDependencia: 'Planeación',
      dirigidoA: 'Coordinador General',
      dirigidoACargo: 'Coordinador',
      dirigidoADependencia: 'Dirección de Planeación',
      descripcionAsunto: 'Seguimiento a metas institucionales.',
      idTema: 3,
      Tema: 'Planeación Estratégica',
      fechaCumplimiento: '2024-06-01',
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
      fechaRegistro: '2024-05-21',
      documento: {
        name: 'memorandum_metas.pdf',
        url: '#',
        size: '600KB',
        type: 'PDF',
      },
      anexos: [
        { name: 'anexo1.pdf', url: '#', size: '800KB', type: 'PDF' },
        { name: 'anexo2.docx', url: '#', size: '1MB', type: 'Word' },
      ],
      asignaciones: [],
      observaciones: 'lorem ipsum dolor sit amet, cons... ',
    },
  ];
  tabActiva = 'detalles';
  asuntoSeleccionado: any = null;
  ngOnChanges() {
    if (this.idAsunto) {
      this.cargarDetalle(this.idAsunto);
    }
  }
  cargarDetalle(id: number) {
    // Aquí podrías llamar a un servicio para obtener los detalles del asunto
    this.asuntoSeleccionado = this.asuntos.find(a => a.idAsunto === id) || null;
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'fas fa-clock';
      case 'en_progreso':
        return 'fas fa-edit';
      case 'Concluido':
        return 'fas fa-check';
      default:
        return 'x-circle';
    }
  }
  estadoColors: { [key: string]: string } = {
  pendiente: 'bg-deep-blue  text-white',
  en_progreso: 'bg-purple text-white',
  Concluido: 'bg-success text-white',
  };

  prioridadColors: { [key: string]: string } = {
    alta: 'bg-primary text-white',
    media: 'bg-gold text-white',
    baja: 'bg-secondary text-white',
  };

}
