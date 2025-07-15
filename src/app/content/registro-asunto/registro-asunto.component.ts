import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManagerService } from '../../components/shared/modal-manager.service';

@Component({
  selector: 'app-registro-asunto',
  standalone: false,
  templateUrl: './registro-asunto.component.html',
  styleUrl: './registro-asunto.component.scss'
})
export class RegistroAsuntoComponent {
  @ViewChild('modalPrevisualizar', { static: true }) modalPrevisualizar!: TemplateRef<any>;
  @ViewChild('confirmModal', { static: true }) confirmModal!: TemplateRef<any>;

  documentoForm!: FormGroup;
  temas = ['Tema A', 'Tema B', 'Tema C'];
  tipoDocumentoDS = [
      "Abuso de autoridad",
      "Accidentes",
      "Acoso",
      "Acuerdo secretarial",
      "Adeudo",
      "Adscripción",
      "Agradecimientos y Felicitación",
      "Apertura",
      "Asignación de Clave",
      "Audiencia",
      "Auditoría",
      "Beca",
      "Cambio  ",
      "Comisiones y Licencias",
      "Conclusión laboral",
      "Derecho de Autor",
      "Designaciones",
      "Desistimiento",
      "Devolución de gastos",
      "Donación",
      "Edición de Libros",
      "Empleo",
  ];
  
  selectFields: any = ['medio', 'recepcion'];


  opciones:any [any] = {
  medio: [
    { id: 'email', nombre: 'Email' },
    { id: 'fisico', nombre: 'Físico' }
  ],
  recepcion: [
    { id: 'presencial', nombre: 'Presencial' },
    { id: 'digital', nombre: 'Digital' }
  ],
  prioridad: [
    { id: 'alta', nombre: 'Alta' },
    { id: 'media', nombre: 'Media' },
    { id: 'baja', nombre: 'Baja' }
  ]
};

  remitenteFields = [
    { name: 'remitenteNombre', label: 'Nombre del remitente' },
    { name: 'remitenteCargo', label: 'Cargo del remitente' },
    { name: 'remitenteDependencia', label: 'Dependencia del remitente' },
    { name: 'dirigidoA', label: 'Dirigido A' },
    { name: 'dirigidoACargo', label: 'Cargo' },
    { name: 'dirigidoADependencia', label: 'Dependencia' }
  ];

  documento: { file: File, nombre: string } | null = null;
  nombreDocumento: string = '';
  anexos: File[] = [];
  constructor(private fb: FormBuilder,
    private modalManager: ModalManagerService,
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.documentoForm = this.fb.group({
      idTipoDocumento: [null, Validators.required],
      noOficio: ['', Validators.required],
      esVolante: [false],
      numeroVolante: ['',Validators.maxLength(255)],
      esGuia: [false],
      numeroGuia: ['',Validators.maxLength(255)],
      fechaDocumento: ['', [Validators.required, this.fechaMaximaValidator()]],
      fechaRecepcion: [today, Validators.required ],
      remitenteNombre: ['', [Validators.required, Validators.maxLength(255)]],
      remitenteCargo: ['', [Validators.required, Validators.maxLength(255)]],
      remitenteDependencia: ['', [Validators.required, Validators.maxLength(255)]],
      dirigidoA: ['', [Validators.required, Validators.maxLength(255)]],
      dirigidoACargo: ['', [Validators.required, Validators.maxLength(255)]],
      dirigidoADependencia: ['', [Validators.required, Validators.maxLength(255)]],
      descripcionAsunto: ['', [Validators.required, Validators.maxLength(1000)]],
      tema: ['', Validators.required],
      fechaCumplimiento: ['', [Validators.required, this.fechaMinimaValidator()]],
      medio: ['', Validators.required],
      /* recepcion: ['', Validators.required], */
      prioridad: ['', Validators.required]
    });
    this.validaCheckbox()
  }

  validaCheckbox(){
    this.documentoForm.get('esVolante')?.valueChanges.subscribe(checked => {
      const campo = this.documentoForm.get('numeroVolante');
      if (checked) {
        campo?.setValidators([Validators.required]);
      } else {
        campo?.clearValidators();
      }
      campo?.updateValueAndValidity();
    });

    this.documentoForm.get('esGuia')?.valueChanges.subscribe(checked => {
      const campo = this.documentoForm.get('numeroGuia');
      if (checked) {
        campo?.setValidators([Validators.required]);
      } else {
        campo?.clearValidators();
      }
      campo?.updateValueAndValidity();
    });
  }

  fechaMaximaValidator() {
    return (control: any) => {
      const inputDate = new Date(control.value);
      const today = new Date();
      return inputDate > today ? { maxDate: true } : null;
    };
  }

  fechaMinimaValidator() {
    return (control: any) => {
      const inputDate = new Date(control.value);
      const today = new Date();
      return inputDate < today ? { minDate: true } : null;
    };
  }

  onSubmit(): void {
    if (this.documentoForm.valid) {
      console.log('Formulario enviado:', this.documentoForm.value);
    } else {
      this.documentoForm.markAllAsTouched();
    }
  }

  toggleFieldWithCheckbox(checkboxName: string, fieldName: string): void {
  const checkbox = this.documentoForm.get(checkboxName);
  const field = this.documentoForm.get(fieldName);

  checkbox?.valueChanges.subscribe((checked: boolean) => {
    if (checked) {
      field?.setValidators([Validators.required]);
    } else {
      field?.clearValidators();
      field?.setValue('');
    }
    field?.updateValueAndValidity();
  });
}

onDocumentoSeleccionado(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.documento = {
      file: input.files[0],
      nombre: this.nombreDocumento.trim() || input.files[0].name
    };
  }
}

borrarDocumento(): void {
  this.documento = null;
  const input = document.getElementById('documento') as HTMLInputElement;
  if (input) input.value = '';
  this.nombreDocumento = '';
}

onAnexoSeleccionado(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // Evitar duplicados por nombre de archivo
    if (!this.anexos.some(f => f.name === file.name)) {
      this.anexos.push(file);
    }

    // Limpiar input para permitir volver a seleccionar el mismo archivo
    input.value = '';
  }
}

borrarAnexo(file: File): void {
  this.anexos = this.anexos.filter(f => f !== file);
}

    getValidationStatus(controlName: string): 'valid' | 'invalid' | 'neutral' {
    const control = this.documentoForm.get(controlName);

    if (!control || !control.touched) {
      return 'neutral';
    }

    if (control.errors && (control.errors['required'] || control.invalid)) {
      return 'invalid';
    }

    return 'valid';
  }

    openModalPrev(){
    this.modalManager.openModal({
      title: '<i class="fas fa-check-double"></i> Previsualizar',
      template: this.modalPrevisualizar,     
      showFooter: true,
      width: '400px',
    });
  }
    openConfirmModal(){
    this.modalManager.openModal({
      title: 'Confirmar',
      template: this.confirmModal,     
      showFooter: true,
    });
  }
}