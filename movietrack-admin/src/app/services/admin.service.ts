import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Stats
  getStats()              { return this.http.get<any>(`${this.base}/stats`); }
  getScoreDistribution()  { return this.http.get<any[]>(`${this.base}/stats/scores`); }
  getRegistrosPorMes()    { return this.http.get<any[]>(`${this.base}/stats/registros-por-mes`); }
  getFavoritosPorTipo()   { return this.http.get<any[]>(`${this.base}/stats/favoritos-por-tipo`); }
  getUsuariosActivos()    { return this.http.get<any[]>(`${this.base}/stats/usuarios-activos`); }
  getTopFavoritos()       { return this.http.get<any[]>(`${this.base}/top/favoritos`); }
  getRecentReviews()      { return this.http.get<any[]>(`${this.base}/recent-reviews`); }

  // Users
  getUsers()                          { return this.http.get<any[]>(`${this.base}/users`); }
  deleteUser(id: number)              { return this.http.delete(`${this.base}/users/${id}`); }
  changeRole(id: number, role: string){ return this.http.patch(`${this.base}/users/${id}/role?role=${role}`, {}); }

  // Reviews
  getReviews()              { return this.http.get<any[]>(`${this.base}/reviews`); }
  deleteReview(id: number)  { return this.http.delete(`${this.base}/reviews/${id}`); }

  // Content
  getContent()  { return this.http.get<any[]>(`${this.base}/content`); }
}