import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss'
})
export class Reviews implements OnInit {
  reviews: any[] = [];
  filtered: any[] = [];
  search = '';
  loading = true;
  error = '';

  constructor(private admin: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadReviews(); }

  loadReviews() {
    this.loading = true;
    this.admin.getReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.filtered = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar reviews';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this.filtered = this.reviews.filter(r =>
      r.user?.name?.toLowerCase().includes(q) ||
      r.content?.title?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q)
    );
    this.cdr.detectChanges();
  }

  deleteReview(id: number) {
    if (!confirm('¿Eliminar esta review?')) return;
    this.admin.deleteReview(id).subscribe({
      next: () => this.loadReviews()
    });
  }
}