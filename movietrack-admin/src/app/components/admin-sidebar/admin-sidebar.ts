import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
styleUrl: './admin-sidebar.scss'
})
export class AdminSidebarComponent {

  menuItems = [
    { label: 'Dashboard',  icon: 'dashboard',    route: '/admin/dashboard' },
    { label: 'Usuarios',   icon: 'people',        route: '/admin/usuarios' },
    { label: 'Reviews',    icon: 'rate_review',   route: '/admin/reviews' },
    { label: 'Contenido',  icon: 'movie',         route: '/admin/contenido' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
  }
}