import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserStateService } from '../../services/user-state.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: ''
  };

  errorMsg = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private userState: UserStateService
  ) {}

  register() {
    this.errorMsg = '';

    
    const nuevoUsuario: Partial<User> & { password: string } = {
      id: Date.now(),
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      role: 'client'   
    };

    this.api.addUsuario(nuevoUsuario).subscribe({
      next: (created: User) => {
     
        this.auth.login(created);
        this.userState.setUser(created);

        
        this.router.navigate(['/turnos']);
      },
      error: err => {
        console.error('Error registrando usuario', err);
        this.errorMsg = 'No se pudo registrar el usuario';
      }
    });
  }
}
