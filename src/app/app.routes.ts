import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/pages/main/main.component'),
    children: [
      { path: 'login', loadComponent: () => import('./auth/pages/login/login.component') },
      { path: '**', redirectTo: 'login' }
    ]
  },
  {
    path: 'tareas',
    loadComponent: () => import('./tareas/pages/tareas/tareas.component'),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./tareas/pages/home/home.component') },
      { path: 'tarjeta', loadComponent: () => import('./tareas/components/tareas-form/tareas-form.component').then(m => m.TareasFormComponent) }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
