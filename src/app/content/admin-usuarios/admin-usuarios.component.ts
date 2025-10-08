import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogoService } from '../../../api/catalogo/catalogo.service';
import { UsuarioService } from '../../../api/usuario/usuario.service';
import { ModalManagerService } from '../../components/shared/modal-manager.service';
import { UtilsService } from '../../services/utils.service';
import { TipoToast } from '../../../api/entidades/enumeraciones';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-usuarios',
  standalone: false,
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.scss',
})
export class AdminUsuariosComponent {
  @ViewChild('crearUsuarioModal', { static: true }) crearUsuarioModal!: TemplateRef<any>;
  @ViewChild('editarUsuarioModal', { static: true }) editarUsuarioModal!: TemplateRef<any>;
  @ViewChild('eliminarUsuarioModal', { static: true }) eliminarUsuarioModal!: TemplateRef<any>;
  @ViewChild('logModal', { static: true }) logModal!: TemplateRef<any>;

  usuario: any = null;
  Math = Math;
  personal: any = [];
  paginaPersonal: any[] = []; // Lista que se muestra por página
  searchTerm: string = '';
filteredPersonal: any[] = []; // Lista filtrada

  pageSize: number = 10; // Elementos por página
  currentPage: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];

  usuarioForm!: FormGroup;
  rolesUsuario: any = [];
  usuarioSeleccionado:any = null;
  dependenciasList:any = null;

  userlogs:any = [];
  constructor(
    private fb: FormBuilder,
    private catalogoApi: CatalogoService,
    private usuarioApi: UsuarioService,
    private modalManager: ModalManagerService,
    private utils: UtilsService,
    private router: Router

  ) {}

  ngOnInit(): void {
    const session =  localStorage.getItem('session');
    if (!session) {
    this.router.navigate(['/']);
    this.utils.MuestrasToast(TipoToast.Info, "¡La sesión ha caducado!"); // corregido MuestraToast
    }
    this.usuario = JSON.parse(session!);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerUsuarios();

  }



 updatePaginaPersonal() {
  const start = this.currentPage * this.pageSize;
  const end = start + this.pageSize;
  this.paginaPersonal = this.filteredPersonal.slice(start, end);
}
prevPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.updatePaginaPersonal();
    this.updateVisiblePages();
  }
}

nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.updatePaginaPersonal();
    this.updateVisiblePages();
  }
}

goToPage(page: number) {
  this.currentPage = page;
  this.updatePaginaPersonal();
  this.updateVisiblePages();
}
updateVisiblePages() {
  const total = this.totalPages;
  const current = this.currentPage;
  const visibleCount = 5;

  let start = Math.max(current - Math.floor(visibleCount / 2), 0);
  let end = start + visibleCount;

  if (end > total) {
    end = total;
    start = Math.max(end - visibleCount, 0);
  }

  this.visiblePages = [];
  for (let i = start; i < end; i++) {
    this.visiblePages.push(i);
  }
}
applyFilter() {
  const term = this.searchTerm.toLowerCase();

  this.filteredPersonal = this.personal.filter((persona: any) => {
    return (
      persona.nombre.toLowerCase().includes(term) ||
      persona.primerApellido.toLowerCase().includes(term) ||
      persona.segundoApellido.toLowerCase().includes(term) ||
      persona.correo.toLowerCase().includes(term) ||
      persona.nombreRol.toLowerCase().includes(term) ||
      persona.area.toLowerCase().includes(term) ||
      (persona.fechaRegistro && persona.fechaRegistro.toString().toLowerCase().includes(term))
    );
  });

  this.totalPages = Math.ceil(this.filteredPersonal.length / this.pageSize);
  this.currentPage = 0;
  this.updateVisiblePages();
  this.updatePaginaPersonal(); // ✅ Muy importante: actualizar la página visible después del filtro
}

/* formularios */
initForm(){
      this.usuarioForm = this.fb.group({
      idUsuario:[null],
      idUsuarioRol: [null, Validators.required],
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', ],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      usuarioNombre: ['', Validators.required],
      idDependencia: [null, Validators.required],
      idUsuarioModifica:[null,Validators.required]
    });
}
  getValidationStatus(controlName: string): 'valid' | 'invalid' | 'neutral' {
    const control = this.usuarioForm.get(controlName);

    if (!control || !control.touched) {
      return 'neutral';
    }

    if (control.errors && (control.errors['required'] || control.invalid)) {
      return 'invalid';
    }

    return 'valid';
  }


/*  MODALES */
openCrearUsuarioModal(usuarioDS: any, tramite:number) {
  /* 1 registro: 2 editar */
  this.consultarUsuarioRol();
  this.consultarDependencia();
  
    let title = '';
    switch (tramite) {
      case 1:
        this.initForm();
        this.usuarioForm.get('idUsuario')?.clearValidators();
          this.usuarioForm.get('idUsuario')?.updateValueAndValidity();
        this.usuarioForm.patchValue({
              idUsuarioModifica: this.usuario.idUsuario
          });
        title = '<i class="fas fa-user-plus me-2"></i> Crear nuevo usuario';
        break;
        case 2:
          this.initForm();

          this.usuarioForm.get('contrasena')?.disable();

          this.usuarioForm.get('idUsuario')?.clearValidators();
          this.usuarioForm.get('idUsuario')?.setValidators(Validators.required);
          this.usuarioForm.get('idUsuario')?.updateValueAndValidity();

          this.usuarioForm.get('contrasena')?.clearValidators();
          this.usuarioForm.get('usuarioNombre')?.clearValidators();
          this.usuarioForm.get('contrasena')?.updateValueAndValidity();
          this.usuarioForm.get('usuarioNombre')?.updateValueAndValidity();
          this.usuarioForm.patchValue({
              ... usuarioDS,
              idDependencia: usuarioDS.idDeterminante, // <-- aquí haces el match,
              idUsuario: usuarioDS.idUsuario, // <-- aquí haces el match
              idUsuarioModifica: this.usuario.idUsuario
          });
          title= '<i class="fas fa-user-edit me-2"></i> Detalles del usuario';
        break;
    
      default:
        break;
    }
this.modalManager.openModal({
      title: title,
      template: this.crearUsuarioModal,
      showFooter: false,
      onAccept: () => {
            if (this.usuarioForm.invalid) {
              this.usuarioForm.markAllAsTouched(); // Para forzar validación visual
              return;
            }
            /* mandar el call swithc tambien  */

            switch (tramite) {
              case 1:
                this.registrarUsuario();
              break;
                case 2:
                  this.actualizarUsuario();
                break;
              default:
                break;
            }
      }
        ,
      onCancel: () => null,
      width: '400px',
    });
  }
openActivacionModal(usuario:any) {
  this.usuarioSeleccionado = usuario;
this.modalManager.openModal({
      title: '<i class="fas fa-user-cog me-2"></i>Control de usuario',
      template: this.eliminarUsuarioModal,
      showFooter: true,
      onAccept: () => this.activarUsuario(),
      onCancel: () => null,
      /* width: '400px', */
    });
  }
openLogModal() {
  this.getUserlog();
this.modalManager.openModal({
      title: '<i class="fas fa-clock-rotate-left me-2"></i>Actividad reciente',
      template: this.logModal,
      showFooter: false,
      onAccept: () => {},
      onCancel: () => null,
      width: '400px',
    });
  }

  /* web services:  */

    consultarUsuarioRol() {
        this.catalogoApi.consultarUsuarioRol({idUsuarioRol:0}).subscribe(
          (data:any) => {
            if(data.status == 200){
              this.rolesUsuario = data.model
            }else{
             this.utils.MuestrasToast(TipoToast.Warning, data.message)
            }
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
          }
        );
    }
    consultarDependencia() {
        this.catalogoApi.consultarDependencia({idDependencia:1, opcion: 1}).subscribe(
          (data:any) => {
            if(data.status == 200){
              this.dependenciasList = data.model
            }else{
             this.utils.MuestrasToast(TipoToast.Warning, data.message)
            }
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
          }
        );
    }

    obtenerUsuarios (){

          this.usuarioApi.obtenerUsuarioAdmin({idUsuario:0}).subscribe(
          (data:any) => {
            if(data.status == 200){
              this.personal  = data.model;
              this.filteredPersonal = [...this.personal]; // Copia inicial
                this.totalPages = Math.ceil(this.filteredPersonal.length / this.pageSize);
                this.currentPage = 0;
                this.updateVisiblePages();
                this.updatePaginaPersonal();
            }else{
             this.utils.MuestrasToast(TipoToast.Warning, data.message);
            }
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
          }
        );

    }

    registrarUsuario(){
        let payload = this.usuarioForm.value;        
        
        this.usuarioApi.registrarUsuario(payload).subscribe(
          (data:any) => {
            if(data.status == 200){
              this.utils.MuestrasToast(TipoToast.Success, data.message);
            }else{
             this.utils.MuestrasToast(TipoToast.Warning, data.message);
            }
            this.obtenerUsuarios();
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
          }
        );

    }
    actualizarUsuario(){
        let payload = this.usuarioForm.value;
        this.usuarioApi.actualizarUsuario(payload).subscribe(
          (data:any) => {
            if(data.status == 200){
              this.utils.MuestrasToast(TipoToast.Success, data.message);
            }else{
             this.utils.MuestrasToast(TipoToast.Warning, data.message);
            }
            this.obtenerUsuarios();
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
          }
        );

    }
    activarUsuario(){
       
      this.usuarioApi.activarUsuario({
          idUsuario: this.usuarioSeleccionado.idUsuario,
          idUsuarioModifica: this.usuario.idUsuario

        }).subscribe(
          (data:any) => {
            if(data.status == 200){
              this.utils.MuestrasToast(TipoToast.Success, data.message);
            }else{
             this.utils.MuestrasToast(TipoToast.Warning, data.message);
            }
            this.obtenerUsuarios();
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
          }
        );

    }
    getUserlog(){
       
      this.usuarioApi.getUserlog({
          fechaInicio: null,
          fechaFin: null,
          limit: 20
        }).subscribe(
          (data:any) => {
            if(data.status == 200){
              this.userlogs = data.model
              this.utils.MuestrasToast(TipoToast.Success, data.message);

            }else{
             this.utils.MuestrasToast(TipoToast.Warning, data.message);
            }
            this.obtenerUsuarios();
          },
          (ex) => {
            this.utils.MuestraErrorInterno(ex);
          }
        );

    }
}
