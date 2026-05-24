import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.error = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.error = 'No tienes permisos de administrador.';
          this.auth.logout();
        }
      },
      error: () => {
        this.error = 'Correo o contraseña incorrectos.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}