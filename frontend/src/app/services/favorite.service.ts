import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite';

const API_URL = 'http://localhost:8080/api/favorites';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  toggleFavorite(houseId: number): Observable<Favorite> {
    return this.http.post<Favorite>(`${API_URL}/toggle/${houseId}`, {});
  }

  getMyFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${API_URL}/my`);
  }

  isFavorite(houseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${API_URL}/check/${houseId}`);
  }
}
