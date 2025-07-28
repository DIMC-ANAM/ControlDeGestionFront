import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManagerService } from '../../components/shared/modal-manager.service';
import { AsuntoService } from '../../../api/asunto/asunto.service';
import { UtilsService } from '../../services/utils.service';
import { TipoToast } from '../../../api/entidades/enumeraciones';

@Component({
  selector: 'app-registro-asunto',
  standalone: false,
  templateUrl: './registro-asunto.component.html',
  styleUrl: './registro-asunto.component.scss',
})
export class RegistroAsuntoComponent {
  @ViewChild('modalPrevisualizar', { static: true })
  modalPrevisualizar!: TemplateRef<any>;
  @ViewChild('confirmModal', { static: true }) confirmModal!: TemplateRef<any>;

  documentoForm!: FormGroup;
  temas = [
    { idTema: 1, tema: 'Tema A' },
    { idTema: 2, tema: 'Tema B' },
    { idTema: 3, tema: 'Tema C' },
  ];
  tipoDocumentoDS = [
    { id: 1, tipoDocumento: 'Oficio' },
    { id: 2, tipoDocumento: 'Circular' },
    { id: 3, tipoDocumento: 'Nota' },
  ];

  selectFields: any = ['medio', 'recepcion'];

  opciones: any[any] = {
    medio: [
      { id: '1', nombre: 'Email' },
      { id: '2', nombre: 'Físico' },
    ],
    recepcion: [
      { id: '1', nombre: 'Presencial' },
      { id: '2', nombre: 'Digital' },
    ],
    prioridad: [
      { id: '1', nombre: 'Alta' },
      { id: '2', nombre: 'Media' },
      { id: '3', nombre: 'Baja' },
    ],
  };

  remitenteFields = [
    { name: 'remitenteNombre', label: 'Nombre del remitente' },
    { name: 'remitenteCargo', label: 'Cargo del remitente' },
    { name: 'remitenteDependencia', label: 'Dependencia del remitente' },
    { name: 'dirigidoA', label: 'Dirigido A' },
    { name: 'dirigidoACargo', label: 'Cargo' },
    { name: 'dirigidoADependencia', label: 'Dependencia' },
  ];

  documento: { file: File; nombre: string } | null = null;
  nombreDocumento: string = '';
  anexos: File[] = [];
  constructor(
    private fb: FormBuilder,
    private modalManager: ModalManagerService,
    private asuntoApi: AsuntoService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.documentoForm = this.fb.group({
      idTipoDocumento: [null, Validators.required],
      noOficio: ['', Validators.required],
      esVolante: [false],
      numeroVolante: ['', Validators.maxLength(255)],
      esGuia: [false],
      numeroGuia: ['', Validators.maxLength(255)],
      fechaDocumento: ['', [Validators.required, this.fechaMaximaValidator()]],
      fechaRecepcion: [today, Validators.required],
      remitenteNombre: ['', [Validators.required, Validators.maxLength(255)]],
      remitenteCargo: ['', [Validators.required, Validators.maxLength(255)]],
      remitenteDependencia: [
        '',
        [Validators.required, Validators.maxLength(255)],
      ],
      dirigidoA: ['', [Validators.required, Validators.maxLength(255)]],
      dirigidoACargo: ['', [Validators.required, Validators.maxLength(255)]],
      dirigidoADependencia: [
        '',
        [Validators.required, Validators.maxLength(255)],
      ],
      descripcionAsunto: [
        '',
        [Validators.required, Validators.maxLength(1000)],
      ],
      idTema: ['', Validators.required],
      fechaCumplimiento: ['', [, this.fechaMinimaValidator()]],
      idMedio: ['', Validators.required],
      /* recepcion: ['', Validators.required], */
      idPrioridad: ['', Validators.required],
      idUsuarioRegistra: 1 /* falta!! */,
      usuarioRegistra: 'Andresillo' /* falta!! */,
      idUnidadAdministrativa: 1 /* falta */,
      unidadAdministrativa: 'Recursos Humanos',
      observaciones: '',
    });
    this.validaCheckbox();
  }

  validaCheckbox() {
    this.documentoForm.get('esVolante')?.valueChanges.subscribe((checked) => {
      const campo = this.documentoForm.get('numeroVolante');
      if (checked) {
        campo?.setValidators([Validators.required]);
      } else {
        campo?.clearValidators();
      }
      campo?.updateValueAndValidity();
    });

    this.documentoForm.get('esGuia')?.valueChanges.subscribe((checked) => {
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
    const file = input.files[0];
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.')); // incluye el punto, ej: '.pdf'

    const nombreFinal = this.nombreDocumento.trim()
      ? this.nombreDocumento.trim() + extension
      : originalName;

    this.documento = {
      file: file,
      nombre: nombreFinal
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
      if (!this.anexos.some((f) => f.name === file.name)) {
        this.anexos.push(file);
      }

      // Limpiar input para permitir volver a seleccionar el mismo archivo
      input.value = '';
    }
  }

  borrarAnexo(file: File): void {
    this.anexos = this.anexos.filter((f) => f !== file);
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

  openModalPrev() {
    this.modalManager.openModal({
      title: '<i class="fas fa-check-double"></i> Previsualizar',
      template: this.modalPrevisualizar,
      showFooter: true,
      width: '400px',
    });
  }
  openConfirmModal() {
    this.modalManager.openModal({
      title: 'Confirmar',
      template: this.confirmModal,
      showFooter: true,
    });
  }

  /* web services */
  registrarAsunto() {
    /* preparar payload */

    /* suscribirnos al servicio */
    
    this.construirPayload().then(payload => {
      console.log(payload);
      
      this.asuntoApi.registrarAsunto(payload).subscribe(
        (data) => {
          this.onSuccessregistrarAsunto(data);
        },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      } 
  );
});

  }
  onSuccessregistrarAsunto(data: any) {
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, data.message);
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // quitar encabezado
        resolve(base64String);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file); // convierte a base64
    });
  }
  private async convertirAnexos(): Promise<any[]> {
  if (!this.anexos || this.anexos.length === 0) return [];

  return Promise.all(
    this.anexos.map(async (file: File) => {
      const base64 = await this.fileToBase64(file);
      return {
        fileName: file.name,
        fileEncode64: base64,
        size: file.size,
        tipoDocumento: 'Anexo'
      };
    })
  );
}
  async construirPayload(): Promise<any> {
  let documentoPayload = null;

  if (this.documento && this.documento.file) {
    const base64 = await this.fileToBase64(this.documento.file);
    documentoPayload = {
      fileName: this.documento.nombre,
      fileEncode64: base64,
      size: this.documento.file.size,
      tipoDocumento: 'Documento principal'
    };
  }

  const anexosPayload = await this.convertirAnexos();

  const payload = {
    documento: documentoPayload,
    ...this.documentoForm.value,
    anexos: anexosPayload
  };

  return payload;
}
}
