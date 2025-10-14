import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManagerService } from '../../../components/shared/modal-manager.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ColorsEnum } from '../../../entidades/colors.enum';
import { AsuntoService } from '../../../../api/asunto/asunto.service';
import { UtilsService } from '../../../services/utils.service';
import { TipoToast } from '../../../../api/entidades/enumeraciones';
import { environment } from '../../../../environments/environment';
import { CatalogoService } from '../../../../api/catalogo/catalogo.service';

@Component({
  selector: 'app-detalle-asuntos',
  standalone: false,
  templateUrl: './detalle-asuntos.component.html',
  styleUrl: './detalle-asuntos.component.scss',
})
export class DetalleAsuntosComponent {
  @ViewChild('turnarModal', { static: true }) turnarModal!: TemplateRef<any>;
  @ViewChild('agregarAnexosModal', { static: true })
  agregarAnexosModal!: TemplateRef<any>;
  @ViewChild('confirmModal', { static: true }) confirmModal!: TemplateRef<any>;
  @ViewChild('concluirModal', { static: true })
  concluirModal!: TemplateRef<any>;
  @ViewChild('reemplazarDocumentoModal', { static: true })
  reemplazarDocumentoModal!: TemplateRef<any>;
  @ViewChild('verDocumentoModal', { static: true })
  verDocumentoModal!: TemplateRef<any>;
  @ViewChild('eliminarDocumentoModal', { static: true })
  eliminarDocumentoModal!: TemplateRef<any>;

  @Input() idAsunto: number | null = null;
  @Output() cambio = new EventEmitter<string>();

  baseurl = environment.baseurl;
  turnadoForm!: FormGroup;
  conclusionForm!: FormGroup;
  reemplazarDocumentoForm!: FormGroup;
  agregarAnexoForm!: FormGroup;

  unidadesResponsablesDS: any[] = [];
  instruccionesDS: any[] = [];

  tipoDocumentoDS: any[] = [];
  temaDS: any[] = [];
  medioDS: any[] = [];
  dependenciaDS: any[] = [];

  turnados: any[] = []; /* turnados por cargar */
  turnadosAsunto: any[] = [];

  documentoReemplazo: any = null;
  anexosCargados: any[] = [];
  fileState = new Map<string, { file: File | null; name: string | null }>();

  documentoVisor: any = null;
  documentVisorURL: SafeResourceUrl | null = null;
  documentoStringURL: string = '';

  isDragOver: boolean = false;

  editar: Boolean = false;
  asuntoSeleccionadoModificado: Boolean = false;

  tabActiva = 'detalles';
  usuario: any = null;
  asuntoSeleccionado: any = null;

  documentoPrincipal: any = null;
  anexos: any[] = [];
  respuestasDocs: any[] = [];
  documentoConclusion: any = null;

  historial: any = null;

  constructor(
    private fb: FormBuilder,
    private modalManager: ModalManagerService,
    private sanitizer: DomSanitizer,
    public colors: ColorsEnum,
    private asuntoApi: AsuntoService,
    private utils: UtilsService,
    private catalogoApi: CatalogoService
  ) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('session')!);

    this.consultarUnidadAdministrativa();
    this.consultarInstruccion();
    this.consultarTipoDocumento();
    this.consultarTema();
    this.consultarMedioRecepcion();

    /*  */
    this.historial = {
      asuntoRegistrado: {
        idAsunto: 101,
        numeroOficio: 'OF/2025/123',
        fechaRegistro: '2025-10-06T09:30:00',
        usuarioRegistra: 'María López',
        fechaConclusion: '2025-10-08T15:45:00',
        usuarioConcluye: 'Luis Hernández',
        idStatusAsunto: 3,
        statusAsunto: 'Concluido',
      },
      turnados: [
        {
          idTurnado: 1,
          numeroTurnado: 1,
          fechaRegistro: '2025-10-06T10:00:00',
          usuarioTurno: 'María López',
          areaResponsable: 'Dirección de Planeación',
          idStatusTurnado: 3,
          statusTurnado: 'Atendido',
          fases: [
            {
              idStatusTurnado: 1,
              statusTurnado: 'Recibido',
              icon: 'fas fa-share',
              fecha: '2025-10-06T10:00:00',
              usuario: 'María López',
              nota: 'Se turna el asunto por primera vez.',
            },
            {
              idTurnado: 3,
              tipoOperacion: 'ASUNTO_TURNADO',
              numeroTurnado: 1,
              fechaModificacion: '2025-10-09 18:54:15',
              usuarioModifico: 'Jose Andres Reyes Cerdaa',
              areaResponsable: 'Dirección de Organización',
              idStatusTurnado: 1,
              statusTurnado: 'Recibido',
              nota: 'Se turna el asunto a: Área responsable',
            },

            ,
            {
              idStatusTurnado: 2,
              statusTurnado: 'En trámite',
              icon: 'fa-regular fa-clock',
              fecha: '2025-10-06T11:30:00',
              usuario: 'Carlos Méndez',
              nota: 'Recibido por el área responsable.',
            },
            {
              idStatusTurnado: 3,
              statusTurnado: 'Atendido',
              icon: 'fas fa-check',
              fecha: '2025-10-07T17:00:00',
              usuario: 'Carlos Méndez',
              nota: 'Se entrega respuesta al oficio.',
            },
          ],
        },
        {
          idTurnado: 2,
          numeroTurnado: 2,
          fechaRegistro: '2025-10-07T09:00:00',
          usuarioTurno: 'Luis Hernández',
          areaResponsable: 'Unidad Jurídica',
          idStatusTurnado: 4,
          statusTurnado: 'Rechazado',
          fases: [
            {
              idStatusTurnado: 1,
              statusTurnado: 'Recibido',
              icon: 'fas fa-share',
              fecha: '2025-10-07T09:00:00',
              usuario: 'Luis Hernández',
              nota: 'Turno a revisión jurídica.',
            },
            {
              idStatusTurnado: 2,
              statusTurnado: 'En trámite',
              icon: 'fa-regular fa-clock',
              fecha: '2025-10-07T10:15:00',
              usuario: 'Laura Torres',
              nota: 'Revisión en curso.',
            },
            {
              idStatusTurnado: 4,
              statusTurnado: 'Rechazado',
              icon: 'fas fa-circle-xmark',
              fecha: '2025-10-07T16:00:00',
              usuario: 'Laura Torres',
              nota: 'El asunto no procede legalmente.',
            },
          ],
        },
        {
          idTurnado: 3,
          numeroTurnado: 3,
          fechaRegistro: '2025-10-08T08:45:00',
          usuarioTurno: 'María López',
          areaResponsable: 'Dirección de Comunicación',
          idStatusTurnado: 2,
          statusTurnado: 'En trámite',
          fases: [
            {
              idStatusTurnado: 1,
              statusTurnado: 'Recibido',
              icon: 'fas fa-share',
              fecha: '2025-10-08T08:45:00',
              usuario: 'María López',
              nota: 'Se turna para difusión.',
            },
            {
              idStatusTurnado: 2,
              statusTurnado: 'En trámite',
              icon: 'fa-regular fa-clock',
              fecha: '2025-10-08T09:10:00',
              usuario: 'Rafael Díaz',
              nota: 'En proceso de redacción del comunicado.',
            },
          ],
        },
      ],
    };
  }

  ngOnChanges() {
    if (this.idAsunto) {
      this.consultarDetallesAsunto(this.idAsunto);
      this.consultarExpedienteAsunto(this.idAsunto);
      this.consultarTurnadosAsunto(this.idAsunto);
      this.asuntoSeleccionadoModificado = false;
      this.editar = false;
      this.consultarHistorial(this.idAsunto);
    }
  }

  /*  */

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
    this.initFormTurnado();
    this.turnados = [...this.turnadosAsunto];
    this.openModal({
      title: 'Turnar asunto',
      template: this.turnarModal,
      onAccept: () => this.turnarAsunto(),
      onCancel: () => this.cancelarTurnado(),
    });
  }

  openConcluirModal() {
    if (this.asuntoSeleccionado.puedeConcluir == 0) {
      this.utils.MuestrasToast(
        TipoToast.Error,
        'Este asunto no puede concluirse!'
      );
      this.utils.MuestrasToast(
        TipoToast.Warning,
        'Advertencia, se detectó el uso de manipulación del DOM.'
      );
      return;
    }
    this.initFormConcluir();
    this.openModal({
      title: 'Concluir asunto',
      template: this.concluirModal,
      onAccept: () => this.concluirAsunto(),
      onCancel: () => {
        this.resetFormularioArchivo(this.conclusionForm);
        this.clearFile('concluir');
      },
    });
  }

  openeliminarDocumentoModal(idDocumento: any) {
    /* id del documento!!!  */
    this.modalManager.openModal({
      title:
        " <i class= 'fas fa-warning me-2 text-warning'> </i> ¿Eliminar este documento?",
      template: this.eliminarDocumentoModal,
      showFooter: true,
      onAccept: () => this.eliminarDocumento(idDocumento),
    });
  }
  openReemplazarModal() {
    this.initFormReemplazar();
    this.openModal({
      title: 'Reemplazar documento',
      template: this.reemplazarDocumentoModal,
      onAccept: () => this.reemplazarDocumento(),
      onCancel: () => {
        this.resetFormularioArchivo(this.reemplazarDocumentoForm);
        this.clearFile('reemplazar');
      },
    });
  }

  openagregarAnexosModal() {
    this.initFormAnexos();
    this.openModal({
      title: '<i class="fas fa-folder-open m-2"></i> Agregar Anexos',
      template: this.agregarAnexosModal,
      onAccept: () => this.cargarAnexos(),
      onCancel: () => {
        this.resetFormularioArchivo(this.agregarAnexoForm);
        this.anexosCargados = [];
      },
    });
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

  initFormTurnado(): void {
    this.turnadoForm = this.fb.group({
      idUnidadResponsable: [null, Validators.required],
      idInstruccion: [null, Validators.required],
    });
  }

  private createDocumentoForm(): FormGroup {
    return this.fb.group({ documento: [null, Validators.required] });
  }

  initFormConcluir() {
    this.conclusionForm = this.createDocumentoForm();
  }
  initFormReemplazar() {
    this.reemplazarDocumentoForm = this.createDocumentoForm();
  }
  initFormAnexos() {
    this.agregarAnexoForm = this.createDocumentoForm();
  }

  concluirAsunto(): void {
    const estado = this.fileState.get('concluir');
    if (this.conclusionForm.valid && estado?.file) {
      this.construirPayloadConcluirAsunto().then((payload) => {
        this.asuntoApi.concluirAsunto(payload).subscribe(
          (data) => {
            this.onSuccessConcluirAsunto(data);
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

  onSuccessConcluirAsunto(data: any) {
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, data.message);
      this.resetFormularioArchivo(this.conclusionForm);
      this.clearFile('concluir');
      this.consultarDetallesAsunto(this.asuntoSeleccionado.idAsunto);
      this.consultarExpedienteAsunto(this.asuntoSeleccionado.idAsunto);
      this.notificarCambio();
    } else {
      this.utils.MuestrasToast(TipoToast.Error, data.message);
    }
  }

  cancelarTurnado(): void {
    this.turnados = [];
    this.turnadoForm.reset();
  }

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
        if (!this.anexosCargados.some((anexo) => anexo.name === file.name)) {
          this.anexosCargados.push(file);
        }
      });
      const first = this.anexosCargados[0].name ?? null;
      this.updateDocumentoControl(form, first, controlName);
    } else {
      const file = files[0];
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

  getFileName(key: string): string | null {
    const fileData = this.fileState.get(key);
    return fileData?.name || null;
  }

  clearFile(key: string) {
    this.fileState.set(key, { file: null, name: null });
  }

  borrarAnexoAgregado(index: number): void {
    this.anexosCargados.splice(index, 1);
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
          idAsunto: this.idAsunto,
          idUnidadResponsable: unidad.id,
          idInstruccion: instruccion.idInstruccion,
          idUsuarioAsigna: this.usuario.idUsuario,
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

  /* ENDPOINTS */
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
      this.asuntoSeleccionado = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
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
        this.respuestasDocs = [];
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
    } else {
      this.documentoPrincipal = null;
      this.documentoConclusion = null;
      this.anexos = [];
      this.respuestasDocs = [];
      if (muestraToast)
        this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
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
  consultarUnidadAdministrativa() {
    this.catalogoApi
      .consultarUnidadAdministrativa({
        esUnidadAdministrativa: 1,
        esUnidadDeNegocio: 1,
      })
      .subscribe(
        (data) => {
          this.onSuccessconsultarUnidadAdministrativa(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
  }
  onSuccessconsultarUnidadAdministrativa(data: any) {
    if (data.status == 200) {
      this.unidadesResponsablesDS = data.model;
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
  consultarTipoDocumento() {
    this.catalogoApi.consultarTipoDocumento().subscribe(
      (data) => {
        this.onSuccessconsultarTipoDocumento(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccessconsultarTipoDocumento(data: any) {
    if (data.status == 200) {
      this.tipoDocumentoDS = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }
  consultarDependencia() {
    /* if is gestor entonces:  {1,1}*/

    this.catalogoApi
      .consultarDependencia(
        /* {
        idDependencia: this.usuario.idDeterminante,
        opcion: 2
      } */ {
          idDependencia: 1,
          opcion: 1,
        }
      )
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
  consultarTema() {
    this.catalogoApi.consultarTema().subscribe(
      (data) => {
        this.onSuccessconsultarTema(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccessconsultarTema(data: any) {
    if (data.status == 200) {
      this.temaDS = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }
  consultarMedioRecepcion() {
    this.catalogoApi.consultarMedioRecepcion().subscribe(
      (data) => {
        this.onSuccessconsultarMedioRecepcion(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccessconsultarMedioRecepcion(data: any) {
    if (data.status == 200) {
      this.medioDS = data.model;
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
  }
  turnarAsunto() {
    console.log('this.turnados', this.turnados);
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
      this.consultarTurnadosAsunto(this.idAsunto);
      this.utils.MuestrasToast(TipoToast.Success, data.message);
      this.notificarCambio();
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
    this.turnados = [];
  }

  reemplazarDocumento() {
    this.construirPayloadReemplazoDocumento().then((payload) => {
      this.asuntoApi.reemplazarDocumento(payload).subscribe(
        (data) => {
          this.onSuccessreemplazarDocumento(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
    });
  }
  onSuccessreemplazarDocumento(data: any) {
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, data.message);
    } else {
      this.utils.MuestrasToast(TipoToast.Error, data.message);
    }
    this.resetFormularioArchivo(this.reemplazarDocumentoForm);
    this.consultarExpedienteAsunto(this.asuntoSeleccionado.idAsunto);
  }

  cargarAnexos() {
    this.construirPayloadAnexo().then((payload) => {
      this.asuntoApi.cargarAnexos(payload).subscribe(
        (data) => {
          this.onSuccesscargarAnexos(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
    });
  }
  onSuccesscargarAnexos(data: any) {
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, data.message);
    } else {
      this.utils.MuestrasToast(TipoToast.Error, data.message);
    }
    this.consultarExpedienteAsunto(this.asuntoSeleccionado.idAsunto);
    this.resetFormularioArchivo(this.agregarAnexoForm);
    this.anexosCargados = [];
  }

  eliminarDocumento(idDocumento: number) {
    this.asuntoApi
      .eliminarDocumento({ idDocumentAsunto: idDocumento })
      .subscribe(
        (data) => {
          this.onSuccesseliminarDocumento(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
  }
  onSuccesseliminarDocumento(data: any) {
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, data.message);
    } else {
      this.utils.MuestrasToast(TipoToast.Warning, data.message);
    }
    this.consultarExpedienteAsunto(this.asuntoSeleccionado.idAsunto);
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

  private async convertirAnexos(): Promise<any[]> {
    if (!this.anexosCargados || this.anexosCargados.length === 0) return [];

    return Promise.all(
      this.anexosCargados.map(async (file: File) => {
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

  async construirPayloadReemplazoDocumento(): Promise<any> {
    let documentoPayload = null;
    let documentoReemplazo = this.fileState.get('reemplazar');

    if (documentoReemplazo?.file) {
      const base64 = await this.fileToBase64(documentoReemplazo.file);
      documentoPayload = {
        fileName: documentoReemplazo.name,
        fileEncode64: base64,
        size: documentoReemplazo.file.size,
        tipoDocumento: 'Documento principal',
      };
    }

    const payload = {
      idAsunto: this.asuntoSeleccionado.idAsunto,
      folio: this.asuntoSeleccionado.folio,
      idDocumentoReemplazo: this.documentoPrincipal.idDocumentoAsunto,
      documento: documentoPayload,
      urlReemplazo: this.documentoPrincipal.ruta,
      idUsuarioRegistra: this.usuario.idUsuario,
    };

    return payload;
  }
  async construirPayloadAnexo(): Promise<any> {
    let documentoPayload = null;

    const anexosPayload = await this.convertirAnexos();

    const payload = {
      idAsunto: this.asuntoSeleccionado.idAsunto,
      idUsuarioRegistra: this.usuario.idUsuario,
      anexos: anexosPayload,
    };

    return payload;
  }

  async construirPayloadConcluirAsunto(): Promise<any> {
    let documentoPayload = null;
    let documentoConclusion = this.fileState.get('concluir');

    if (documentoConclusion?.file) {
      const base64 = await this.fileToBase64(documentoConclusion.file);
      documentoPayload = {
        fileName: documentoConclusion.name,
        fileEncode64: base64,
        size: documentoConclusion.file.size,
        tipoDocumento: 'Conclusión',
      };
    }

    const payload = {
      idAsunto: this.asuntoSeleccionado.idAsunto,
      folio: this.asuntoSeleccionado.folio,
      documentos: [documentoPayload],
      idUsuarioRegistra: this.usuario.idUsuario,
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

  guardarCambios() {
    let payload = {
      idAsunto: this.asuntoSeleccionado.idAsunto,
      idTipoDocumento: this.asuntoSeleccionado.idTipoDocumento,
      idTema: this.asuntoSeleccionado.idTema,
      noOficio: this.asuntoSeleccionado.noOficio,
      idMedio: this.asuntoSeleccionado.idMedio,
      observaciones: this.asuntoSeleccionado.observaciones,
      descripcionAsunto: this.asuntoSeleccionado.descripcionAsunto,
      idUsuarioModifica: this.usuario.idUsuario,
      fechaCumplimiento: this.formatearFechaParaBD(
        this.asuntoSeleccionado.fechaCumplimiento == ''
          ? null
          : this.asuntoSeleccionado.fechaCumplimiento
      ),
      fechaDocumento: this.formatearFechaParaBD(
        this.asuntoSeleccionado.fechaDocumento == ''
          ? null
          : this.asuntoSeleccionado.fechaDocumento
      ),
      remitenteNombre: this.asuntoSeleccionado.remitenteNombre,
      remitenteCargo: this.asuntoSeleccionado.remitenteCargo,
      remitenteDependencia: this.asuntoSeleccionado.remitenteDependencia,
      dirigidoA: this.asuntoSeleccionado.dirigidoA,
      dirigidoACargo: this.asuntoSeleccionado.dirigidoACargo,
    };
    this.asuntoApi.editarAsunto(payload).subscribe(
      (data) => {
        this.onSuccesseditarAsunto(data);
      },
      (ex) => {
        this.utils.MuestraErrorInterno(ex);
      }
    );
  }
  onSuccesseditarAsunto(data: any) {
    if (data.status == 200) {
      this.utils.MuestrasToast(TipoToast.Success, data.message);
      this.asuntoSeleccionadoModificado = false;
      this.editar = false;
      this.consultarDetallesAsunto(this.asuntoSeleccionado.idAsunto);
    } else {
      this.utils.MuestrasToast(TipoToast.Error, data.message);
    }
  }

  getFechaSoloFecha(key: keyof typeof this.asuntoSeleccionado): string {
    const fecha = this.asuntoSeleccionado?.[key];
    if (!fecha) return '';

    // Puede venir con espacio ' ' o 'T', separar y tomar solo fecha
    if (fecha.includes('T')) {
      return fecha.split('T')[0];
    }
    if (fecha.includes(' ')) {
      return fecha.split(' ')[0];
    }
    return fecha; // ya solo fecha
  }
  setFechaSoloFecha(
    key: keyof typeof this.asuntoSeleccionado,
    nuevaFecha: string
  ): void {
    if (!nuevaFecha) return;

    // Asumimos que la hora será 00:00:00 para completar el timestamp
    const valorCompleto = `${nuevaFecha} 00:00:00`;

    this.asuntoSeleccionado[key] = valorCompleto;
    this.asuntoSeleccionadoModificado = true;
  }

  getFechaHoraLocal(key: keyof typeof this.asuntoSeleccionado): string {
    const fechaISO = this.asuntoSeleccionado?.[key];
    if (!fechaISO) return '';

    // Extraemos directamente 'YYYY-MM-DDTHH:mm' sin conversión de zona horaria
    return fechaISO.substring(0, 16);
  }

  setFechaHoraLocal(
    key: keyof typeof this.asuntoSeleccionado,
    valor: string
  ): void {
    if (!valor) return;

    // Convertimos 'YYYY-MM-DDTHH:mm' a 'YYYY-MM-DD HH:mm:00' para el timestamp
    const valorParaGuardar = valor.replace('T', ' ') + ':00';

    this.asuntoSeleccionado[key] = valorParaGuardar;
    this.asuntoSeleccionadoModificado = true;
  }

  formatearFechaParaBD(fechaISO: string): string | null {
    if (!fechaISO) return null;
    // Quita la 'T' y la 'Z', y corta los milisegundos
    return fechaISO.replace('T', ' ').substring(0, 19);
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
