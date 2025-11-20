import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';  

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';
  errorMsg = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  login() {
    this.api.login(this.email, this.password).subscribe((users: any) => {
      if (users.length === 1) {
        localStorage.setItem('user', JSON.stringify(users[0]));
        this.router.navigate(['/home']);
      } else {
        this.errorMsg = 'Email o contraseña incorrectos';
      }
    });
  }
}
