import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-detalle-turnados',
  standalone: false,
  templateUrl: './detalle-turnados.component.html',
  styleUrl: './detalle-turnados.component.scss'
})
export class DetalleTurnadosComponent {
  
@Input() asuntoInput: any | null = null;

  @ViewChild('responderModal', { static: true }) responderModal!: TemplateRef<any>;
  @ViewChild('rechazarModal', { static: true }) rechazarModal!: TemplateRef<any>;
  @ViewChild('confirmModal', { static: true }) confirmModal!: TemplateRef<any>;
  @ViewChild('verDocumentoModal', { static: true }) verDocumentoModal!: TemplateRef<any>;

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
  idUsuario = 1;
  turnadoSeleccionado: any = null;

  documentoPrincipal: any = null;
  anexos: any[] = [];


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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }


    ngOnChanges() {
    if (this.asuntoInput) {
      this.consultarDetallesAsunto(this.asuntoInput.idAsunto);
      /* entra */
      this.consultarExpedienteAsunto(this.asuntoInput.idAsunto);
      /*this.consultarHistorialAsunto(this.idAsunto); */      
    }
  }
   private createDocumentoForm(): FormGroup {
    return this.fb.group({ documento: [null, Validators.required] });
  }
  initFormConcluir() {
    this.conclusionForm = this.createDocumentoForm();
  }
  initFormRechazar() {
    this.rechazarForm = this.fb.group({
        motivoRechazo: [null, [Validators.required]]
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
    this.initFormConcluir();
    this.modalManager.openModal({
      title: '<i class ="fas fa-share m-2"> </i> Dar respuesta al turnado',
      template: this.responderModal,
      showFooter: false,
      onAccept: () => {},
      onCancel: () => URL.revokeObjectURL(this.documentoStringURL),
      width: '',
    });
  }
  openRechazarTurnado() {
    this.initFormRechazar();
    this.modalManager.openModal({
      title: '<i class ="fas fa-times-circle m-2"> </i> Rechazar turnado',
      template: this.rechazarModal,
      showFooter: false,
      onAccept: () => {},
      onCancel: () => null,
      width: '',
    });
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
        this.turnadoSeleccionado = data.model
      } else {
        this.utils.MuestrasToast(TipoToast.Warning, data.message);
      }
    }
    consultarExpedienteAsunto(id:number,muestraToast:boolean = false) {

        this.asuntoApi.consultarExpedienteAsunto({idAsunto: id}).subscribe(
          (data) => {
            this.onSuccessconsultarExpedienteAsunto(data, muestraToast);
          },
          (ex) => {
            this.documentoPrincipal = null;
            this.anexos =[];
           if  (muestraToast ) this.utils.MuestraErrorInterno(ex);
          } 
        );
        
      }
      onSuccessconsultarExpedienteAsunto(data: any, muestraToast:boolean) {
        if (data.status == 200) {
          this.documentoPrincipal = data.model.documento
          this.anexos = data.model.anexos
        } else {
          this.documentoPrincipal = null;
          this.anexos =[];
          if  (muestraToast )this.utils.MuestrasToast(TipoToast.Warning, data.message);
        
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
        /* this.turnadoSeleccionado = data.model */
        /* objeto historial */
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

}
