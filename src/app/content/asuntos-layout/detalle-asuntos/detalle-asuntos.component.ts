import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManagerService } from '../../../components/shared/modal-manager.service';

@Component({
  selector: 'app-detalle-asuntos',
  standalone: false,
  templateUrl: './detalle-asuntos.component.html',
  styleUrl: './detalle-asuntos.component.scss'
})
export class DetalleAsuntosComponent {
  /* componentes que seran trackados para hacer los templaetesref de los modales */
  @ViewChild('editarModal', { static: true }) editarModal!: TemplateRef<any>;
  @ViewChild('turnarModal', { static: true }) turnarModal!: TemplateRef<any>;
  @ViewChild('agregarAnexosModal', { static: true }) agregarAnexosModal!: TemplateRef<any>;
  @ViewChild('confirmModal', { static: true }) confirmModal!: TemplateRef<any>;
  @ViewChild('concluirModal', { static: true }) concluirModal!: TemplateRef<any>;
  @Input() idAsunto: number | null = null;
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

  conclusionForm!: FormGroup;
  selectedFileFinalizar: File | null = null;
  selectedFileNameFinalizar: string | null = null;
   isDragOver: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalManager: ModalManagerService,
  ){}

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

  /* modales */

  openTurnarModal(){
      this.initFormTurnado();
       this.modalManager.openModal({
      title: 'Turnar asunto',
      template: this.turnarModal,     
      showFooter: false,
      onAccept: () => this.finalizarTurnado(),         
      onCancel: () => this.cancelarTurnado(),
      width: 'mediano'
      
    });

  }
  openConcluirModal(){
      this.initFormConcluir();
       this.modalManager.openModal({
      title: 'Concluir asunto',
      template: this.concluirModal,     
      showFooter: false,
      onAccept: () => this.finalizarAsunto(),         
      /* limpiar variables!!! */
      /* onCancel: () => , */
      width: 'mediano'
      
    });

  }
    /* turnar */


  // Inicializa el formulario reactivo
  initFormTurnado(): void {
    this.turnadoForm = this.fb.group({
      unidadResponsable: [null, Validators.required],
      instruccion: [null, Validators.required]
    });
  }

  // Método para agregar un turnado a la lista
  addTurnado(): void {
    if (this.turnadoForm.valid) {
      console.log("entra");
      console.log(this.turnadoForm.value);
      
      const selectedUnidadId = this.turnadoForm.get('unidadResponsable')?.value;
      const selectedInstruccionId = this.turnadoForm.get('instruccion')?.value;

      // Encuentra el objeto completo de la unidad e instrucción seleccionadas
      const unidad = this.unidadesResponsablesDS.find(u => u.id == selectedUnidadId);
      const instruccion = this.instruccionesDS.find(i => i.id == selectedInstruccionId);

      console.log(unidad,instruccion);

      if (unidad && instruccion) {
        console.log("entra 2");
        

        // Verifica si el turnado ya existe para evitar duplicados (opcional)
        const exists = this.turnados.some((t: any) =>
          t.unidadResponsable.id === unidad.id && t.instruccion.id === instruccion.id
        );

        if (!exists) {

          this.turnados.push({ unidadResponsable: unidad, instruccion: instruccion });
          this.turnadoForm.reset({ unidadResponsable: null, instruccion: null }); // Resetea el formulario
        } else {
          alert('Este turnado (Unidad Responsable e Instrucción) ya ha sido agregado.');
        }
      }
    } else {
      // Marcar todos los campos como "touched" para que se muestren los mensajes de validación
      this.turnadoForm.markAllAsTouched();
    }
  }

  // Método para eliminar un turnado de la lista
  removeTurnado(index: number): void {
    this.turnados.splice(index, 1);
  }

  // Método para obtener el estado de validación de un campo
  getValidationStatus(form:FormGroup,controlName: string): 'valid' | 'invalid' | 'none' {
    const control = form.get(controlName);
    if (!control) {
      return 'none';
    }
    return control.valid && (control.dirty || control.touched) ? 'valid' :
           control.invalid && (control.dirty || control.touched) ? 'invalid' : 'none';
  }

  // Método para finalizar el proceso (ej. enviar datos al backend)
  finalizarTurnado(): void {
    console.log('Turnados a enviar:', this.turnados);
        
    // Aquí puedes emitir un evento, llamar a un servicio, etc.
  }

  // Método para cancelar el proceso
  cancelarTurnado(): void {
    this.turnados = []; // Limpia la lista de turnados
    this.turnadoForm.reset({ unidadResponsable: null, instruccion: null }); // Resetea el formulario   
    // Aquí puedes redirigir al usuario, cerrar un modal, etc.
  }

  /* concluir modal */
  initFormConcluir(): void {
    this.conclusionForm = this.fb.group({
      documentoCierre: [null, Validators.required] // El validador 'required' asegura que se seleccione un archivo
    });
  }

   // Maneja la selección de un archivo
  /* onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileFinalizar = input.files[0];
      this.selectedFileNameFinalizar = this.selectedFileFinalizar.name;
      // Actualiza el valor del FormControl para la validación
      this.conclusionForm.get('documentoCierre')?.setValue(this.selectedFileFinalizar);
    } else {
      this.selectedFileFinalizar = null;
      this.selectedFileNameFinalizar = null;
      this.conclusionForm.get('documentoCierre')?.setValue(null); // Limpia el valor si no hay archivo
    }
  } */


  // Función dummy para finalizar el asunto
  finalizarAsunto(): void {
    if (this.conclusionForm.valid && this.selectedFileFinalizar) {
      console.log('Asunto listo para finalizar.');
      console.log('Documento de cierre:', this.selectedFileFinalizar.name);

      // Aquí iría la lógica para subir el archivo y concluir el asunto
      // Por ejemplo, podrías llamar a un servicio:
      // this.asuntoService.concluirAsunto(this.selectedFile).subscribe(response => {
      //   console.log('Asunto finalizado con éxito', response);
      //   alert(`Asunto finalizado. Documento: ${this.selectedFile?.name}`);
      //   this.conclusionForm.reset();
      //   this.selectedFile = null;
      //   this.selectedFileNameFinalizar = null;
      // }, error => {
      //   console.error('Error al finalizar el asunto', error);
      //   alert('Hubo un error al finalizar el asunto.');
      // });

      alert(`¡Asunto finalizado con el documento: ${this.selectedFileNameFinalizar}! 🎉`);
      this.conclusionForm.reset();
      this.selectedFileFinalizar = null;
      this.selectedFileNameFinalizar = null;
    } else {
      console.error('Formulario inválido o archivo no seleccionado.');
      this.conclusionForm.markAllAsTouched(); // Para mostrar los errores de validación
    }
  }
   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.processFile(input.files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    this.processFile(files);
  }

  private processFile(files: FileList | null | undefined): void {
    if (files && files.length > 0) {
      this.selectedFileFinalizar = files[0];
      this.selectedFileNameFinalizar = this.selectedFileFinalizar.name;
      
      // *** MODIFICATION HERE ***
      // Instead of setting the File object, set a placeholder value (e.g., true or the file name)
      // to satisfy Validators.required for the form control.
      this.conclusionForm.get('documentoCierre')?.setValue(this.selectedFileFinalizar.name); // Or true, or 1, etc.
      
      this.conclusionForm.get('documentoCierre')?.markAsTouched();
      this.conclusionForm.get('documentoCierre')?.updateValueAndValidity();
    } else {
      this.selectedFileFinalizar = null;
      this.selectedFileNameFinalizar = null;
      
      // *** MODIFICATION HERE ***
      // Set the placeholder back to null if no file is selected
      this.conclusionForm.get('documentoCierre')?.setValue(null);
      
      this.conclusionForm.get('documentoCierre')?.markAsTouched();
      this.conclusionForm.get('documentoCierre')?.updateValueAndValidity();
    }
  }

}
