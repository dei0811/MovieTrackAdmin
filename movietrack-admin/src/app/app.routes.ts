import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
  path: 'dashboard',
  loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
},
{
  path: 'usuarios',
  loadComponent: () => import('./components/usuarios/usuarios').then(m => m.Usuarios)
},
{
  path: 'reviews',
  loadComponent: () => import('./components/reviews/reviews').then(m => m.Reviews)
},
{
  path: 'contenido',
  loadComponent: () => import('./components/contenido/contenido').then(m => m.Contenido)
},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];