import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, AfterViewInit {

  @ViewChild('scoresChart') scoresChartRef!: ElementRef;
  @ViewChild('tipoChart') tipoChartRef!: ElementRef;
  @ViewChild('mesesChart') mesesChartRef!: ElementRef;

  stats: any = null;
  recentReviews: any[] = [];
  scoreDistribution: any[] = [];
  registrosPorMes: any[] = [];
  favoritosPorTipo: any[] = [];
  usuariosActivos: any[] = [];
  topFavoritos: any[] = [];
  loading = true;
  error = '';

  private chartsReady = false;
  private dataReady = false;

  constructor(private admin: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.chartsReady = true;
    if (this.dataReady) this.buildCharts();
  }

  loadData() {
    this.loading = true;
    Promise.all([
      this.admin.getStats().toPromise(),
      this.admin.getRecentReviews().toPromise(),
      this.admin.getScoreDistribution().toPromise(),
      this.admin.getRegistrosPorMes().toPromise(),
      this.admin.getFavoritosPorTipo().toPromise(),
      this.admin.getUsuariosActivos().toPromise(),
      this.admin.getTopFavoritos().toPromise(),
    ]).then(([stats, reviews, scores, meses, tipos, activos, top]) => {
      this.stats = stats;
      this.recentReviews = reviews as any[];
      this.scoreDistribution = scores as any[];
      this.registrosPorMes = meses as any[];
      this.favoritosPorTipo = tipos as any[];
      this.usuariosActivos = activos as any[];
      this.topFavoritos = top as any[];
      this.loading = false;
      this.dataReady = true;
      this.cdr.detectChanges();
      if (this.chartsReady) this.buildCharts();
    }).catch(() => {
      this.error = 'Error al cargar estadísticas';
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  buildCharts() {
    this.buildScoresChart();
    this.buildTipoChart();
    this.buildMesesChart();
  }

  buildScoresChart() {
    if (!this.scoresChartRef) return;
    new Chart(this.scoresChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.scoreDistribution.map(s => s.score),
        datasets: [{
          label: 'Reviews',
          data: this.scoreDistribution.map(s => s.total),
          backgroundColor: this.scoreDistribution.map(s =>
            s.score <= 4 ? 'rgba(229,9,20,0.8)' :
            s.score <= 6 ? 'rgba(255,152,0,0.8)' :
            'rgba(76,175,80,0.8)'
          ),
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#9e9e9e' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#9e9e9e' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  buildTipoChart() {
    if (!this.tipoChartRef) return;
    const movies = this.favoritosPorTipo.find(t => t.type === 'movie')?.total ?? 0;
    const tv = this.favoritosPorTipo.find(t => t.type === 'tv')?.total ?? 0;
    new Chart(this.tipoChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Películas', 'Series'],
        datasets: [{
          data: [movies, tv],
          backgroundColor: ['rgba(229,9,20,0.8)', 'rgba(74,144,217,0.8)'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#9e9e9e' } }
        }
      }
    });
  }

  buildMesesChart() {
    if (!this.mesesChartRef) return;
    new Chart(this.mesesChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.registrosPorMes.map(m => m.mes.substring(5)),
        datasets: [{
          label: 'Registros',
          data: this.registrosPorMes.map(m => m.total),
          backgroundColor: 'rgba(74,144,217,0.8)',
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#9e9e9e' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#9e9e9e' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  getScoreColor(score: number): string {
    if (score >= 7) return '#4CAF50';
    if (score >= 5) return '#FF9800';
    return '#E50914';
  }

  getWatchRatio(): number {
    if (!this.stats) return 0;
    const total = this.stats.contenido_visto + this.stats.contenido_pendiente;
    return total > 0 ? this.stats.contenido_visto / total : 0;
  }

  getMaxFavoritos(): number {
    return this.topFavoritos[0]?.total_favoritos ?? 1;
  }

  getMaxReviews(): number {
    return this.usuariosActivos[0]?.total_reviews ?? 1;
  }
}