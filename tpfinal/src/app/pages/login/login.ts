import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';  
import { UserStateService } from '../../services/user-state.service';

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
  private router: Router,
  private userState: UserStateService
) {}

login() {
  this.api.login(this.email, this.password).subscribe((users: any) => {
    if (users.length === 1) {
      const user = users[0];

      localStorage.setItem('user', JSON.stringify(user));

      // NUEVO: avisamos al menú
      this.userState.setUser(user);

      this.router.navigate(['/home']);
    } else {
      this.errorMsg = 'Email o contraseña incorrectos';
    }
  });
}

}
