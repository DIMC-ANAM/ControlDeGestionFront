import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  hiddenPassw:any=false;

  constructor(private router: Router) {}

  login() {

    this.router.navigate(['/dashboard']);
    /* if (this.username === 'admin' && this.password === 'demo') {
      localStorage.setItem('session', JSON.stringify({ user: this.username }));
    } else {
      this.error = 'Credenciales incorrectas';
    } */
  }
  sethidden(){
    this.hiddenPassw = !this.hiddenPassw;
  }
}
