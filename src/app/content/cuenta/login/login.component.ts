import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModalManagerService } from '../../../components/shared/modal-manager.service';
import { UsuarioService } from '../../../../api/usuario/usuario.service';
import { UtilsService } from '../../../services/utils.service';
import { TipoToast } from '../../../../api/entidades/enumeraciones';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('crearCuentaModal', { static: true })
  crearCuentaModal!: TemplateRef<any>;
  @ViewChild('olvidarContrasenaModal', { static: true })
  olvidarContrasenaModal!: TemplateRef<any>;

  username = '';
  password = '';
  error = '';
  hiddenPassw: any = false;
  recordar: boolean = false;

  crearCuentaForm!: FormGroup;
  loginForm!: FormGroup;


  constructor(
	private router: Router,
	private modalManager: ModalManagerService,
	private fb: FormBuilder,
  private usuarioApi: UsuarioService,
  private utils: UtilsService
  ) {}
ngOnInit(): void {
  this.initFormLogin(); // primero inicializa el form

  const session = localStorage.getItem('session');
  const userString = localStorage.getItem('user');

  if (session) {
    this.router.navigate(['/dashboard']);
    this.utils.MuestrasToast(TipoToast.Info, "¡Bienvenido!"); // corregido MuestraToast
  }

  if (userString) {
    try {
      const user = JSON.parse(userString);
      this.loginForm.patchValue(user);
      this.loginForm.markAllAsTouched();
    } catch (e) {
      console.error('Error parsing user JSON from localStorage', e);
    }
  }
}



/*   
  login() {
    if (this.username === 'admin' && this.password === 'demo') {
      this.router.navigate(['/dashboard']);
      localStorage.setItem('session', JSON.stringify({ user: this.username }));
    } else {
      this.error = 'Credenciales incorrectas. Intenta ingresar: usuario: admin | contraseña: demo';
    }
  } */
  sethidden() {
    this.hiddenPassw = !this.hiddenPassw;
  }

  initFormLogin(){
	this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]], // Validators.email
      password: ['', [Validators.required]]
    });
  }
  /* crear cuenta */

  initFormCrearCuenta(){
	this.crearCuentaForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      rfc: ['', [Validators.required, Validators.pattern(/^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})?$/i)]]
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


  openConfirmModal() {

	this.initFormCrearCuenta();
    this.modalManager.openModal({
      title: '<i class="fas fa-user-plus me-2"></i> Solicitar cuenta',
      template: this.crearCuentaModal,
      showFooter: false,
      onAccept: () => this.solicitudCrearCuenta(),
	  onCancel: () => this.crearCuentaForm.reset()
    });
  }
  solicitudCrearCuenta(){

	

  }

  /* olvidé mi contraseña */
  openOlvidarContrasenaModal() {	
    this.modalManager.openModal({
      title: '<i class="fas fa-user-lock me-2"></i> Recuperar contraseña',
      template: this.olvidarContrasenaModal,
      showFooter: false,
	   
      onAccept: () => null,
    });
  }

  /* LOGIN */

  login(){
    let payload = {
      email: this.loginForm.value.usuario,
      password: this.loginForm.value.password,
      idSistema: 1

    }
    if (this.loginForm.value.usuario === 'admin' && this.loginForm.value.password === 'demo') {
  localStorage.setItem('session', JSON.stringify({
    nombreUsuario: 'admin',
    idUsuario: 9999,
    unidadAdscripcion: 'ROOT',
    accesos:{
      idUsuarioRol: 9999,
    }
  }));

  setTimeout(() => {
    this.router.navigate(['/dashboard']);
  }, 0); 
  return;
}else{
    this.usuarioApi.logIn(payload).subscribe(
        (data) => {
          this.onSuccessLogin(data);
        },
        (ex) => {
          this.utils.MuestraErrorInterno(ex);
        }
      );
    }
  }
onSuccessLogin(data: any) {
  if (data.status == 200) {
    localStorage.setItem('session', JSON.stringify(data.model));

    if (this.recordar) {
      localStorage.setItem('user', JSON.stringify({
        
        usuario: this.loginForm.value.usuario,
        password: this.loginForm.value.password
      }));
    }

    this.router.navigate(['/dashboard']); // <-- ahora sí después
  } else {
    this.utils.MuestrasToast(TipoToast.Error, data.message);
  }
}
}
