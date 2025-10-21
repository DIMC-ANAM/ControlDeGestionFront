import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManagerService } from '../../components/shared/modal-manager.service';
import { AsuntoService } from '../../../api/asunto/asunto.service';
import { UtilsService } from '../../services/utils.service';
import { TipoToast } from '../../../api/entidades/enumeraciones';
import { CatalogoService } from '../../../api/catalogo/catalogo.service';

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
  @ViewChild('respuestaRegistroModal', { static: true })
  respuestaRegistroModal!: TemplateRef<any>;

  documentoForm!: FormGroup;
  temas: any[] = [];

  tipoDocumentoDS: any[] = [];

  selectFields: any = ['medio', 'recepcion'];
  medio: any[] = [];
  recepcion: any[] = [];
  prioridad: any[] = [];

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

  /* respuesta del registro de asunto */

  response: any = null;
	date:any = new Date();

	// Calculamos la fecha restando 6 horas para UTC-6
	offsetDate:any = new Date(this.date.getTime() - 6 * 60 * 60 * 1000);

	// Usamos toISOString y cortamos para	 obtener "YYYY-MM-DDTHH:mm"
today:any = this.offsetDate.toISOString().slice(0, 16);
  usuario: any = null;
  constructor(
    private fb: FormBuilder,
    private modalManager: ModalManagerService,
    private asuntoApi: AsuntoService,
    private catalogoApi: CatalogoService,

    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    /* session stuff */
    /* roles stuff */
    this.usuario = JSON.parse(localStorage.getItem('session')!);

    this.consultarTipoDocumento();
    this.consultarTema();
    this.consultarPrioridad();
    this.consultarMedioRecepcion();

    this.initFormAsunto();
    this.validaCheckbox();
  }

  /* inicialización */

  initFormAsunto() {
    this.documentoForm = this.fb.group({
      idTipoDocumento: [null, Validators.required],
      noOficio: ['', Validators.required],
      esVolante: [false],
      numeroVolante: ['', Validators.maxLength(255)],
      esGuia: [false],
      numeroGuia: ['', Validators.maxLength(255)],
      fechaDocumento: ['', [Validators.required, this.fechaMaximaValidator()]],
      fechaRecepcion: [this.today, Validators.required],
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
      fechaCumplimiento: [null, [, this.fechaMinimaValidator()]],
      idMedio: ['', Validators.required],
      /* recepcion: ['', Validators.required], */
      idPrioridad: ['', Validators.required],
      idUsuarioRegistra: this.usuario.idUsuario,
      usuarioRegistra: this.usuario.nombreCompleto,
      idUnidadAdministrativa: 1 /* falta */,
      unidadAdministrativa: 'Recursos Humanos',
      observaciones: '',
	  autoTurnar: 0,
    });
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

toggleFechasValidators(checked: boolean): void {
  const fechaDocumentoControl = this.documentoForm.get('fechaDocumento');
  const fechaCumplimientoControl = this.documentoForm.get('fechaCumplimiento');

  if (!fechaDocumentoControl || !fechaCumplimientoControl) return;

  if (checked) {
    // Si está marcado el checkbox, quitamos los validadores
    fechaDocumentoControl.clearValidators();
    fechaCumplimientoControl.clearValidators();
  } else {
    // Si NO está marcado, aplicamos los validadores
    fechaDocumentoControl.setValidators([
      Validators.required,
      this.fechaMaximaValidator(),
    ]);
    fechaCumplimientoControl.setValidators([
      Validators.required,
      this.fechaMinimaValidator(),
    ]);
  }

  fechaDocumentoControl.updateValueAndValidity();
  fechaCumplimientoControl.updateValueAndValidity();
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
      const value = control.value;

      // Si el valor es nulo, undefined o cadena vacía, no hay error
      if (value === null || value === undefined || value === '') {
        return null;
      }

      const inputDate = new Date(value);
      const today = new Date();

      // Normalizar la fecha de hoy quitando la hora
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

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
      if (
        file.size > 5 * 1024 * 1024 ||
        !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
      ) {
        this.utils.MuestrasToast(
          TipoToast.Warning,
          'El archivo debe ser PDF, JPG, JPEG o PNG y no debe exceder los 5MB.'
        );
        return;
      }
      const originalName = file.name;
      const extension = originalName.substring(originalName.lastIndexOf('.')); // incluye el punto, ej: '.pdf'

      const nombreFinal = this.nombreDocumento.trim()
        ? this.nombreDocumento.trim() + extension
        : originalName;

      this.documento = {
        file: file,
        nombre: nombreFinal,
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
      if (
        file.size > 5 * 1024 * 1024 ||
        !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
      ) {
        this.utils.MuestrasToast(
          TipoToast.Warning,
          'El archivo debe ser PDF, JPG, JPEG o PNG y no debe exceder los 5MB.'
        );
        return;
      }

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
      onAccept: () => this.registrarAsunto(),
    });
  }
  openrespuestaRegistroModal() {
    this.modalManager.openModal({
      title: '<i class="fas fa-check m-2"></i> ¡Registro exitoso!',
      template: this.respuestaRegistroModal,
      showFooter: false,
      /* onAccept: () => this.documentoForm.reset() */
    });
  }

  /* web services */
  consultarTema() {
    this.catalogoApi.consultarTema().subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.temas = data.model;
        } else {
          this.utils.MuestrasToast(TipoToast.Warning, data.message);
        }
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  consultarPrioridad() {
    this.catalogoApi.consultarPrioridad().subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.prioridad = data.model;
        } else {
          this.utils.MuestrasToast(TipoToast.Warning, data.message);
        }
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  consultarTipoDocumento() {
    this.catalogoApi.consultarTipoDocumento().subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.tipoDocumentoDS = data.model;
        } else {
          this.utils.MuestrasToast(TipoToast.Warning, data.message);
        }
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  consultarMedioRecepcion() {
    this.catalogoApi.consultarMedioRecepcion().subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.medio = data.model;
        } else {
          this.utils.MuestrasToast(TipoToast.Warning, data.message);
        }
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }

  /* catalogos
   */
  registrarAsunto() {
    this.construirPayload().then((payload) => {
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
      this.response = data;
      this.openrespuestaRegistroModal();
	  this.documentoForm.reset();
	  this.documento = null;
	  this.anexos = [];
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
          tipoDocumento: 'Anexo',
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
        tipoDocumento: 'Documento principal',
      };
    }

    const anexosPayload = await this.convertirAnexos();

    this.documentoForm
      .get('fechaCompromiso')
      ?.valueChanges.subscribe((value) => {
        if (value === '') {
          this.documentoForm
            .get('fechaCompromiso')
            ?.setValue(null, { emitEvent: false });
        }
      });

    const payload = {
      documento: documentoPayload,
      ...this.documentoForm.value,
      anexos: anexosPayload,
    };

    return payload;
  }

  encontrarPorId(
    lista: any[],
    campo: string,
    valor: number,
    target: string
  ): string | undefined {
    return lista.find((item) => item[campo] == valor)?.[target] as
      | string
      | undefined;
  }
}
