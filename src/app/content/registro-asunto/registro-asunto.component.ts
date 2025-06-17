import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-asunto',
  standalone: false,
  templateUrl: './registro-asunto.component.html',
  styleUrl: './registro-asunto.component.scss'
})
export class RegistroAsuntoComponent {
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

   documento: File | null = null;
  constructor(private fb: FormBuilder) {}

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
      recepcion: ['', Validators.required],
      prioridad: ['', Validators.required]
    });
  }

  isInvalid(field: string): boolean {
    const control = this.documentoForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  isRequired(field: string): boolean {
    const control = this.documentoForm.get(field);
    return !!(control  && (control.dirty || control.touched));
  }

  controlState(field: string): string {
    const control = this.documentoForm.get(field);
    if (!control) return '';
    if (control.touched) {
      return control.valid ? 'valid-state' : 'invalid-state';
    }
    return '';
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

/* files  */
  onDocumentoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.documento = input.files[0];
    }
	console.log(this.documento);
	
  }
  borrarDocumento(): void {
    this.documento = null;
    // También puedes limpiar el input si lo necesitas
    const input = document.getElementById('documento') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}