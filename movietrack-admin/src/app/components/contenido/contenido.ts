import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-contenido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contenido.html',
  styleUrl: './contenido.scss'
})
export class Contenido implements OnInit {
  content: any[] = [];
  filtered: any[] = [];
  search = '';
  tipoFilter = '';
  loading = true;
  error = '';

  constructor(private admin: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadContent(); }

  loadContent() {
    this.loading = true;
    this.admin.getContent().subscribe({
      next: (data) => {
        this.content = data;
        this.filtered = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar contenido';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filtered = this.content.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(q);
      const matchTipo = this.tipoFilter === '' || item.type === this.tipoFilter;
      return matchSearch && matchTipo;
    });
    this.cdr.detectChanges();
  }
}