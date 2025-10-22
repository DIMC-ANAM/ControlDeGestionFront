import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManagerService } from '../../../components/shared/modal-manager.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ColorsEnum } from '../../../entidades/colors.enum';
import { AsuntoService } from '../../../../api/asunto/asunto.service';
import { TurnadoService } from '../../../../api/turnado/turnado.service';
import { UtilsService } from '../../../services/utils.service';
import { TipoToast } from '../../../../api/entidades/enumeraciones';
import { environment } from '../../../../environments/environment';
import { CatalogoService } from '../../../../api/catalogo/catalogo.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-detalle-turnados',
  standalone: false,
  templateUrl: './detalle-turnados.component.html',
  styleUrl: './detalle-turnados.component.scss',
})
export class DetalleTurnadosComponent {
  @Input() asuntoInput: any | null = null;
  @Output() cambio = new EventEmitter<string>();
  baseurl = environment.baseurl;

  @ViewChild('turnarModal', { static: true }) turnarModal!: TemplateRef<any>;
  @ViewChild('responderModal', { static: true })
  responderModal!: TemplateRef<any>;
  @ViewChild('rechazarModal', { static: true })
  rechazarModal!: TemplateRef<any>;
  @ViewChild('confirmModal', { static: true }) confirmModal!: TemplateRef<any>;
  @ViewChild('verDocumentoModal', { static: true })
  verDocumentoModal!: TemplateRef<any>;

  turnados: any[] = []; /* turnados por cargar */
  conclusionForm!: FormGroup;
  reemplazarDocumentoForm!: FormGroup;
  rechazarForm!: FormGroup;

  anexosCargados: any[] = [];
  fileState = new Map<string, { file: File | null; name: string | null }>();

  documentoVisor: any = null;
  documentVisorURL: SafeResourceUrl | null = null;
  documentoStringURL: string = '';

  isDragOver: boolean = false;

  tabActiva = 'detalles';
  usuario: any = null;
  turnadoSeleccionado: any = null;
  turnadoDS: any = null;
  historial: any = [];
  documentoPrincipal: any = null;
  anexos: any[] = [];
  respuestasDocs: any[] = [];
  documentoConclusion: any = null;
  documentoRespuesta: any = null;

  dependenciaDS: any[] = [];
  turnadoForm!: FormGroup;
  turnadosAsunto: any[] = [];
  instruccionesDS: any[] = [];

  noRequiereDocumento: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalManager: ModalManagerService,
    private sanitizer: DomSanitizer,
    public colors: ColorsEnum,
    private asuntoApi: AsuntoService,
    private utils: UtilsService,
    private catalogoApi: CatalogoService,
    private turnadoApi: TurnadoService,
	private sessionS: SessionService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.usuario = this.sessionS.getUsuario();
  }

  async ngOnChanges() {
    if (this.asuntoInput) {
      try {
        this.consultarDetalleTurnado(this.asuntoInput.idTurnado);
        this.consultarDetallesAsunto(this.asuntoInput.idAsunto);
        this.consultarExpedienteAsunto(this.asuntoInput.idAsunto);
      } catch (error) {
        // Manejo de error si alguna falla
        console.error('Error en la cadena de consultas', error);
      }
    }
  }

  initFormTurnado(): void {
    this.turnadoForm = this.fb.group({
      idUnidadResponsable: [null, Validators.required],
      idInstruccion: [null, Validators.required],
    });
  }
  private createDocumentoForm(): FormGroup {
    return this.fb.group({ documento: [null, Validators.required] });
  }
  private createconclusionForm(): FormGroup {
    return this.fb.group({
      documento: [
        null,
        this.getDocumentoValidators() /* Validators.required */,
      ],
      respuesta: [null, Validators.required],
    });
  }

  private getDocumentoValidators() {
    return !this.noRequiereDocumento ? Validators.required : null;
  }
  initFormConcluir() {
    this.conclusionForm = this.createconclusionForm();
  }
  initFormRechazar() {
    this.rechazarForm = this.fb.group({
      motivoRechazo: [null, [Validators.required]],
    });
  }
  initFormReemplazar() {
    this.reemplazarDocumentoForm = this.createDocumentoForm();
  }

  openDocumentoVisor(file: any) {
    if (!file) return;
    this.documentoStringURL = environment.baseurl + file.ruta;
    this.documentVisorURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.documentoStringURL
    );
    this.documentoVisor = file;
    this.modalManager.openModal({
      title: '',
      template: this.verDocumentoModal,
      showFooter: false,
      onAccept: () => {},
      onCancel: () => URL.revokeObjectURL(this.documentoStringURL),
      width: '400px',
    });
  }
  getValidationStatus(
    form: FormGroup,
    controlName: string
  ): 'valid' | 'invalid' | 'none' {
    const control = form.get(controlName);
    if (!control) return 'none';
    return control.valid && (control.dirty || control.touched)
      ? 'valid'
      : control.invalid && (control.dirty || control.touched)
      ? 'invalid'
      : 'none';
  }

  getFileName(key: string): string | null {
    const fileData = this.fileState.get(key);
    return fileData?.name || null;
  }

  clearFile(key: string) {
    this.fileState.set(key, { file: null, name: null });
  }

  openResponderModal() {
    if (
      [3, 4].includes(this.turnadoDS.idStatusTurnado) ||
      this.turnadoDS.idinstruccion == 1 ||
      this.turnadoDS.puedeResponder == 0
    ) {
      this.utils.MuestrasToast(
        TipoToast.Error,
        '¡Este turnado no puede responderse!'
      );
      this.utils.MuestrasToast(
        TipoToast.Warning,
        'Advertencia, se detectó el uso de manipulación del DOM.'
      );
      return;
    }
	this.noRequiereDocumento = false;
    this.initFormConcluir();
    this.modalManager.openModal({
      title: '<i class ="fas fa-share m-2"> </i> Dar respuesta al turnado',
      template: this.responderModal,
      showFooter: false,
      onAccept: () => this.contestarTurnado(),
      onCancel: () => {
        this.resetFormularioArchivo(this.conclusionForm);
        this.clearFile('concluir');
      },
      width: '',
    });
  }
  openRechazarTurnado() {
    this.initFormRechazar();
    this.modalManager.openModal({
      title: '<i class ="fas fa-times-circle m-2"> </i> Rechazar turnado',
      template: this.rechazarModal,
      showFooter: false,
      onAccept: () => this.rechazarTurnado(),
      onCancel: () => {
        this.resetFormularioArchivo(this.rechazarForm);
      },
      width: '',
    });
  }

  toggleNoRequiereDocumento(event: Event) {
    this.noRequiereDocumento = (event.target as HTMLInputElement).checked;
    const control = this.conclusionForm.get('documento');
    if (!control) return;

    if (this.noRequiereDocumento) {
      // quitar validador y limpiar valor/estado de archivo
      control.clearValidators();
      control.setValue(null);
		this.clearFile('concluir');
		this.resetFormularioArchivo(this.conclusionForm);

    } else {
      // restaurar validador obligatorio
      control.setValidators([Validators.required]);
    }
    control.updateValueAndValidity();
  }

  // Modal Abstraction
  private openModal(options: {
    title: string;
    template: TemplateRef<any>;
    onAccept: () => void;
    onCancel?: () => void;
    width?: string;
  }) {
    this.modalManager.openModal({
      title: options.title,
      template: options.template,
      showFooter: false,
      width: options.width ?? 'mediano',
      onAccept: options.onAccept,
      onCancel: options.onCancel,
    });
  }

  openTurnarModal() {
    this.consultarDependencia();
    this.consultarInstruccion();
    this.initFormTurnado();
    this.turnados = [...this.turnadosAsunto];
    this.openModal({
      title: 'Turnar asunto',
      template: this.turnarModal,
      onAccept: () => this.turnarAsunto(),
      onCancel: () => this.cancelarTurnado(),
    });
  }

  cancelarTurnado(): void {
    this.turnados = [];
    this.turnadoForm.reset();
  }

  contestarTurnado(): void {
    const estado = this.fileState.get('concluir');
    if (
		this.conclusionForm.valid && (this.noRequiereDocumento || estado?.file)
	){
      this.construirPayloadRespuestaTurnado().then((payload) => {
        this.turnadoApi.contestarTurnado(payload).subscribe(
          (data) => {
            this.onSuccessContestarTurnado(data);
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
          }
        );
      });
    } else {
      this.conclusionForm.markAllAsTouched();
    }
  }

  onSuccessContestarTurnado(data: any) {
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, data.message);
      this.consultarDetalleTurnado(this.turnadoDS.idTurnado);
      this.consultarExpedienteAsunto(this.turnadoDS.idTurnado);
      this.notificarCambio();
    } else {
      this.utils.MuestrasToast(TipoToast.Error, data.message);
    }
    this.resetFormularioArchivo(this.conclusionForm);
  }

  rechazarTurnado() {
    this.turnadoApi
      .rechazarTurnado({
        idTurnado: this.turnadoDS.idTurnado,
        idUsuarioModifica: this.usuario.idUsuario,
        motivoRechazo: this.rechazarForm.get('motivoRechazo')?.value,
      })
      .subscribe(
        (data) => {
          this.onSuccessRechazarTurnado(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
  }
  onSuccessRechazarTurnado(data: any) {
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, data.message);
      this.consultarDetalleTurnado(this.turnadoDS.idTurnado);
      this.notificarCambio();
    } else {
      this.utils.MuestrasToast(TipoToast.Error, data.message);
    }
  }

  /* ENDPOINTS */
  consultarDependencia() {
    this.catalogoApi
      .consultarDependencia({
        idDependencia: this.usuario.idDeterminante,
        opcion: 2,
      })
      .subscribe(
        (data) => {
          this.onSuccessconsultarDependencia(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
  }
  onSuccessconsultarDependencia(data: any) {
    if (data.status == 200) {
      this.dependenciaDS = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }
  turnarAsunto() {
    this.asuntoApi.turnarAsunto({ listaTurnados: this.turnados }).subscribe(
      (data) => {
        this.onSuccessturnarAsunto(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccessturnarAsunto(data: any) {
    if (data.status == 200) {
      this.consultarTurnadosAsunto(this.turnadoSeleccionado.idAsunto);
      this.utils.MuestrasToast(TipoToast.Success, data.message);
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
    this.turnados = [];
  }
  consultarTurnadosAsunto(id: number | any) {
    this.asuntoApi.consultarTurnados({ idAsunto: id }).subscribe(
      (data) => {
        this.onSuccessconsultarTurnadosAsunto(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccessconsultarTurnadosAsunto(data: any) {
    if (data.status == 200) {
      this.turnadosAsunto = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  consultarInstruccion() {
    this.catalogoApi
      .consultarInstruccion({ esUnidadAdministrativa: 1, esUnidadDeNegocio: 1 })
      .subscribe(
        (data) => {
          this.onSuccessconsultarInstruccion(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
  }
  onSuccessconsultarInstruccion(data: any) {
    if (data.status == 200) {
      this.instruccionesDS = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }
  addTurnado(): void {
    if (this.turnadoForm.valid) {
      const unidad = this.dependenciaDS.find(
        (u) => u.id == this.turnadoForm.get('idUnidadResponsable')?.value
      );
      const instruccion = this.instruccionesDS.find(
        (i) => i.idInstruccion == this.turnadoForm.get('idInstruccion')?.value
      );

      const nuevoTurnado = {
        idUnidadResponsable: unidad?.id,
        idInstruccion: instruccion?.idInstruccion,
      };

      if (
        unidad &&
        instruccion &&
        !this.turnados.some((t) => this.esTurnadoIgual(t, nuevoTurnado))
      ) {
        this.turnados.push({
          unidadResponsable: unidad.area,
          instruccion: instruccion.instruccion,
          idAsunto: this.turnadoSeleccionado.idAsunto,
          idUnidadResponsable: unidad.id,
          idInstruccion: instruccion.idInstruccion,
          idUsuarioAsigna: this.usuario.idUsuario,
          idTurnadoPadre: this.turnadoDS.idTurnado,
        });
        this.turnadoForm.reset();
      } else {
        this.utils.MuestrasToast(
          TipoToast.Warning,
          'Este turnado ya ha sido agregado.'
        );
      }
    } else {
      this.turnadoForm.markAllAsTouched();
    }
  }
  private esTurnadoIgual(a: any, b: any): boolean {
    return (
      a.idUnidadResponsable == b.idUnidadResponsable &&
      a.idInstruccion == b.idInstruccion
    );
  }

  removeTurnado(index: number): void {
    this.turnados.splice(index, 1);
  }

  /* auxiliares turnado  */
  /**
   * Compara si la lista temporal de turnados es diferente de los turnados reales del asunto.
   * @returns boolean
   */
  hayCambiosEnTurnados(): boolean {
    if (this.turnados.length !== this.turnadosAsunto.length) return true;

    const sortedTurnados = [...this.turnados].sort(this.comparadorTurnado);
    const sortedAsuntos = [...this.turnadosAsunto].sort(this.comparadorTurnado);

    for (let i = 0; i < sortedTurnados.length; i++) {
      if (
        sortedTurnados[i].idUnidadResponsable !==
          sortedAsuntos[i].idUnidadResponsable ||
        sortedTurnados[i].idInstruccion !== sortedAsuntos[i].idInstruccion
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Función auxiliar para ordenar turnados por unidad e instrucción.
   */
  private comparadorTurnado(a: any, b: any): number {
    if (a.idUnidadResponsable !== b.idUnidadResponsable) {
      return a.idUnidadResponsable - b.idUnidadResponsable;
    }
    return a.idInstruccion - b.idInstruccion;
  }
  /*  */
  consultarDetallesAsuntoPromise(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.asuntoApi.consultarDetallesAsunto({ idAsunto: id }).subscribe(
        (data) => {
          this.onSuccessconsultarDetallesAsunto(data);
          resolve(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
          reject(ex);
        }
      );
    });
  }
  consultarDetallesAsunto(id: number) {
    this.asuntoApi.consultarDetallesAsunto({ idAsunto: id }).subscribe(
      (data) => {
        this.onSuccessconsultarDetallesAsunto(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccessconsultarDetallesAsunto(data: any) {
    if (data.status == 200) {
      this.turnadoSeleccionado = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  consultarDetalleTurnadoPromise(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.turnadoApi.consultarDetalleTurnado({ idTurnado: id }).subscribe(
        (data) => {
          this.onSuccessconsultarDetalleTurnado(data);
          resolve(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
          reject(ex);
        }
      );
    });
  }
  consultarDetalleTurnado(id: number) {
    this.turnadoApi.consultarDetalleTurnado({ idTurnado: id }).subscribe(
      (data) => {
        this.onSuccessconsultarDetalleTurnado(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }

  onSuccessconsultarDetalleTurnado(data: any) {
    if (data.status == 200) {
      this.turnadoDS = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  consultarExpedienteAsuntoPromise(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.asuntoApi.consultarExpedienteAsunto({ idAsunto: id }).subscribe(
        (data) => {
          this.onSuccessconsultarExpedienteAsunto(data, false);
          resolve(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
          this.documentoPrincipal = null;
          this.documentoConclusion = null;
          this.anexos = [];
          this.respuestasDocs = []; /* validar rol de usuario */
          this.documentoRespuesta = null;
          reject(ex);
        }
      );
    });
  }

  consultarExpedienteAsunto(id: number, muestraToast: boolean = false) {
    this.asuntoApi.consultarExpedienteAsunto({ idAsunto: id }).subscribe(
      (data) => {
        this.onSuccessconsultarExpedienteAsunto(data, muestraToast);
      },
      (ex) => {
        this.documentoPrincipal = null;
        this.documentoConclusion = null;
        this.anexos = [];
        this.respuestasDocs = []; /* validar rol de usuario */
        this.documentoRespuesta = null;
        if (muestraToast) this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccessconsultarExpedienteAsunto(data: any, muestraToast: boolean) {
    if (data.status == 200) {
      this.documentoPrincipal = data.model.documentos.find(
        (doc: any) => doc.tipoDocumento === 'Documento principal'
      );
      this.documentoConclusion = data.model.documentos.find(
        (doc: any) => doc.tipoDocumento === 'Conclusión'
      );
      this.anexos = data.model.anexos;
      this.respuestasDocs = data.model.respuestas;

      this.documentoRespuesta = data.model.respuestas.find(
        (doc: any) => doc.idTurnado === this.turnadoDS.idTurnado
      );
    } else {
      this.documentoPrincipal = null;
      this.anexos = [];
      this.respuestasDocs = [];
      this.documentoRespuesta = null;
      if (muestraToast)
        this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  consultarHistorial(id: number) {
    this.asuntoApi.consultarHistorial({ idAsunto: id }).subscribe(
      (data) => {
        this.onSuccessconsultarHistorial(data);
      },
      (ex) => {
        this.utils.MuestrasToast(
          TipoToast.Info,
          'Funcionalidad en desarrollo.'
        );
        /*  this.utils.MuestraErrorInterno(ex); */
      }
    );
  }
  onSuccessconsultarHistorial(data: any) {
    if (data.status == 200) {
      /* objeto historial */
      this.historial = data.model;
      console.log(this.historial);
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }

  /* documentosRespuesta */

  onFileSelected(form: FormGroup, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.processFile(form, input.files);
  }

  onFileSelectedAnexos(form: FormGroup, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.processFile(form, input.files, true);
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

  onDrop(form: FormGroup, event: DragEvent, lista: boolean = false): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    this.processFile(form, event.dataTransfer?.files, lista);
  }

  private processFile(
    form: FormGroup,
    files: FileList | null | undefined,
    lista: boolean = false
  ): void {
    const isReemplazo = form == this.reemplazarDocumentoForm;

    const controlName = 'documento';
    const key = isReemplazo ? 'reemplazar' : 'concluir';

    if (!files || files.length === 0) {
      if (lista && this.anexosCargados.length > 0) {
        return;
      }
      // Si lista es true pero no hay archivos cargados, o si lista es false
      this.updateDocumentoControl(form, null, controlName);
      return;
    }

    if (lista) {
      Array.from(files).forEach((file) => {
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
        if (!this.anexosCargados.some((anexo) => anexo.name === file.name)) {
          this.anexosCargados.push(file);
        }
      });
      const first = this.anexosCargados[0].name ?? null;
      this.updateDocumentoControl(form, first, controlName);
    } else {
      const file = files[0];
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
      this.fileState.set(key, { file, name: file.name });
      this.updateDocumentoControl(form, file.name, controlName);
    }
  }
  private updateDocumentoControl(
    form: FormGroup,
    value: string | null,
    controlName: string
  ): void {
    const control = form.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  private resetFormularioArchivo(form: FormGroup): void {
    form.reset();
    this.fileState.set('concluir', { file: null, name: null });
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
  /* end auxiliares turnado  */

  async construirPayloadRespuestaTurnado(): Promise<any> {
    let documentoPayload = null;
    let documentoConclusion = this.fileState.get('concluir');

    if (documentoConclusion?.file) {
      const base64 = await this.fileToBase64(documentoConclusion.file);
      documentoPayload = {
        fileName: documentoConclusion.name,
        fileEncode64: base64,
        size: documentoConclusion.file.size,
        tipoDocumento: 'Respuesta turnado',
      };
    }

    const payload = {
      idUsuario: this.usuario.idUsuario,
      idAsunto: this.turnadoSeleccionado.idAsunto,
      idTurnado: this.asuntoInput.idTurnado,
      folio: this.turnadoSeleccionado.folio,
      documentos: [documentoPayload],
      respuesta: this.conclusionForm.get('respuesta')?.value || null,
      /* atendedor: ![1,7].includes(this.usuario.idUsuarioRol) ? true : false  */
      requiereTurnado: !this.noRequiereDocumento,
    };
    return payload;
  }

  /* event emmiter */
  notificarCambio() {
    this.cambio.emit('Not');
  }

  statusClass(idStatus: number): string {
    switch (idStatus) {
      case 1:
        return 'inicio';
      case 2:
        return 'tramite';
      case 3:
        return 'atendido';
      case 4:
        return 'rechazado';
      default:
        return '';
    }
  }
}
