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
  
  selectFields: any = ['medio', 'recepcion', 'prioridad'];


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
    { name: 'remitenteNombre', label: 'Remitente Nombre' },
    { name: 'remitenteCargo', label: 'Remitente Cargo' },
    { name: 'remitenteDependencia', label: 'Remitente Dependencia' },
    { name: 'dirigidoA', label: 'Dirigido A' },
    { name: 'dirigidoACargo', label: 'Dirigido A Cargo' },
    { name: 'dirigidoADependencia', label: 'Dirigido A Dependencia' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.documentoForm = this.fb.group({
      noOficio: ['', Validators.required],
      esVolante: [false],
      esGuia: [false],
      fechaDocumento: ['', [Validators.required, this.fechaMaximaValidator()]],
      fechaRecepcion: [today],
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
}