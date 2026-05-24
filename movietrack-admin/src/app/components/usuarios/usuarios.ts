import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios implements OnInit {
  users: any[] = [];
  filtered: any[] = [];
  search = '';
  loading = true;
  error = '';

  constructor(private admin: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.loading = true;
    this.admin.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filtered = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this.filtered = this.users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
    this.cdr.detectChanges();
  }

  changeRole(id: number, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    this.admin.changeRole(id, newRole).subscribe({
      next: () => this.loadUsers()
    });
  }

  deleteUser(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.admin.deleteUser(id).subscribe({
      next: () => this.loadUsers()
    });
  }
}