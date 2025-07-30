import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManagerService } from '../../../components/shared/modal-manager.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ColorsEnum } from '../../../entidades/colors.enum';
import { AsuntoService } from '../../../../api/asunto/asunto.service';
import { UtilsService } from '../../../services/utils.service';
import { TipoToast } from '../../../../api/entidades/enumeraciones';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detalle-asuntos',
  standalone: false,
  templateUrl: './detalle-asuntos.component.html',
  styleUrl: './detalle-asuntos.component.scss',
})
export class DetalleAsuntosComponent {
  @ViewChild('editarModal', { static: true }) editarModal!: TemplateRef<any>;
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

  @Input() idAsunto: number | null = null;

  turnadoForm!: FormGroup;
  conclusionForm!: FormGroup;
  reemplazarDocumentoForm!: FormGroup;
  agregarAnexoForm!: FormGroup;

  unidadesResponsablesDS: any[] = [
    { id: 1, nombre: 'Departamento de Recursos Humanos' },
    { id: 2, nombre: 'Dirección de Finanzas' },
    { id: 3, nombre: 'Subsecretaría de Asuntos Legales' },
  ];

  instruccionesDS: any[] = [
    { id: 1, descripcion: 'Para su conocimiento' },
    { id: 2, descripcion: 'Para su atención y respuesta' },
    { id: 3, descripcion: 'Para archivo' },
    { id: 4, descripcion: 'Para elaboración de informe' },
  ];
  turnados: any[] = [];

  anexosCargados: any[] = [];
  fileState = new Map<string, { file: File | null; name: string | null }>();

  documentoVisor: any = null;
  documentVisorURL: SafeResourceUrl | null = null;
  documentoStringURL: string = '';

  isDragOver: boolean = false;

  editar:Boolean = false;
  asuntoSeleccionadoModificado:Boolean = false;

  tabActiva = 'detalles';
  asuntoSeleccionado: any = null;

  documentoPrincipal: any = null;
  anexos: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private modalManager: ModalManagerService,
    private sanitizer: DomSanitizer,
    public colors: ColorsEnum,
    private asuntoApi: AsuntoService, 
    private utils: UtilsService
  ) {}

  ngOnChanges() {
    if (this.idAsunto) {
      this.consultarDetallesAsunto(this.idAsunto);
      this.consultarExpedienteAsunto(this.idAsunto);
/*       this.consultarTurnadosAsunto(this.idAsunto);
      this.consultarHistorialAsunto(this.idAsunto); */
      /* this.cargarDetalle(this.idAsunto); */
    }
  }

  /*  */

/*  cargarDetalle(id: number) {
    this.asuntoSeleccionado =
      this.asuntos.find((a) => a.idAsunto === id) || null;
  } */

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
    this.initFormTurnado();
    this.openModal({
      title: 'Turnar asunto',
      template: this.turnarModal,
      onAccept: () => this.finalizarTurnado(),
      onCancel: () => this.cancelarTurnado(),
    });
  }

  openConcluirModal() {
    this.initFormConcluir();
    this.openModal({
      title: 'Concluir asunto',
      template: this.concluirModal,
      onAccept: () => this.finalizarAsunto(),
      onCancel: () => {
        this.resetFormularioArchivo(this.conclusionForm);
        this.clearFile('concluir');
      },
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
      onAccept: () => this.agregarAnexos(),
      onCancel: () => this.resetFormularioArchivo(this.agregarAnexoForm),
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
      unidadResponsable: [null, Validators.required],
      instruccion: [null, Validators.required],
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

  finalizarAsunto(): void {
    const estado = this.fileState.get('concluir');
    if (this.conclusionForm.valid && estado?.file) {
      alert(`¡Asunto finalizado con el documento: ${estado.name}! 🎉`);
      this.resetFormularioArchivo(this.conclusionForm);
    } else {
      this.conclusionForm.markAllAsTouched();
    }
  }

  finalizarTurnado(): void {
    console.log('Turnados a enviar:', this.turnados);
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

  private processFile( form: FormGroup, files: FileList | null | undefined, lista: boolean = false ): void {
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

  reemplazarDocumento() {
    console.log('Documento reemplazado');
    this.resetFormularioArchivo(this.reemplazarDocumentoForm);
  }

  agregarAnexos() {
    console.log('Anexos agregados');
    this.resetFormularioArchivo(this.agregarAnexoForm);
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
      const unidadId = this.turnadoForm.get('unidadResponsable')?.value;
      const instruccionId = this.turnadoForm.get('instruccion')?.value;
      const unidad = this.unidadesResponsablesDS.find((u) => u.id == unidadId);
      const instruccion = this.instruccionesDS.find(
        (i) => i.id == instruccionId
      );
      if (
        unidad &&
        instruccion &&
        !this.turnados.some(
          (t) =>
            t.unidadResponsable.id === unidad.id &&
            t.instruccion.id === instruccion.id
        )
      ) {
        this.turnados.push({ unidadResponsable: unidad, instruccion });
        this.turnadoForm.reset();
      } else {
        alert('Este turnado ya ha sido agregado.');
      }
    } else {
      this.turnadoForm.markAllAsTouched();
    }
  }

  removeTurnado(index: number): void {
    this.turnados.splice(index, 1);
  }



  /* ENDPOINTS */
    consultarDetallesAsunto(id:number) {

        this.asuntoApi.consultarDetallesAsunto({idAsunto: id}).subscribe(
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
        this.asuntoSeleccionado = data.model
      } else {
        this.utils.MuestrasToast(TipoToast.Warning, data.message);
      }
    }
    consultarExpedienteAsunto(id:number) {

        this.asuntoApi.consultarExpedienteAsunto({idAsunto: id}).subscribe(
          (data) => {
            this.onSuccessconsultarExpedienteAsunto(data);
          },
          (ex) => {
          this.utils.MuestraErrorInterno(ex);
        } 
    );

    }
    onSuccessconsultarExpedienteAsunto(data: any) {
      if (data.status == 200) {
        this.documentoPrincipal = data.model.documento
        this.anexos = data.model.anexos
      } else {
        this.utils.MuestrasToast(TipoToast.Warning, data.message);
      }
    }
    consultarTurnadosAsunto(id:number) {

        this.asuntoApi.consultarTurnadosAsunto({idAsunto: id}).subscribe(
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
        /* this.asuntoSeleccionado = data.model */
        /* lista de turnados  */
      } else {
        this.utils.MuestrasToast(TipoToast.Warning, data.message);
      }
    }
    consultarHistorialAsunto(id:number) {

        this.asuntoApi.consultarHistorialAsunto({idAsunto: id}).subscribe(
          (data) => {
            this.onSuccessconsultarHistorialAsunto(data);
          },
          (ex) => {
          this.utils.MuestraErrorInterno(ex);
        } 
    );

    }
    onSuccessconsultarHistorialAsunto(data: any) {
      if (data.status == 200) {
        /* this.asuntoSeleccionado = data.model */
        /* objeto historial */
      } else {
        this.utils.MuestrasToast(TipoToast.Warning, data.message);
      }
    }

}
