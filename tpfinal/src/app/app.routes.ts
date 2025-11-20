import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'tatuadoras',
    loadComponent: () =>
      import('./pages/tatuadoras/tatuadoras').then((m) => m.TatuadorasComponent),
  },
  {
    path: 'turnos',
    loadComponent: () =>
      import('./pages/turnos/turnos').then((m)=>m.TurnosComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin').then((m) => m.AdminComponent),
  },
  {
  path: 'perfil',
  loadComponent: () =>
    import('./pages/perfil/perfil').then(m => m.PerfilComponent)
},

  {
    path: '**',
    redirectTo: 'home'
  }
];

