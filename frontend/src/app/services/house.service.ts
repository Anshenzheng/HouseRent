import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House, HouseRequest, HouseFilter } from '../models/house';

const API_URL = 'http://localhost:8080/api/houses';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  constructor(private http: HttpClient) { }

  searchHouses(filter: HouseFilter): Observable<House[]> {
    let params = new HttpParams();
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.city) params = params.set('city', filter.city);
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice);
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice);
    if (filter.minArea) params = params.set('minArea', filter.minArea);
    if (filter.maxArea) params = params.set('maxArea', filter.maxArea);
    if (filter.bedroom) params = params.set('bedroom', filter.bedroom);
    if (filter.houseType) params = params.set('houseType', filter.houseType);
    if (filter.decoration) params = params.set('decoration', filter.decoration);

    return this.http.get<House[]>(`${API_URL}/search`, { params });
  }

  getHouseById(id: number): Observable<House> {
    return this.http.get<House>(`${API_URL}/${id}`);
  }

  getMyHouses(): Observable<House[]> {
    return this.http.get<House[]>(`${API_URL}/my`);
  }

  createHouse(house: HouseRequest): Observable<House> {
    return this.http.post<House>(API_URL, house);
  }

  updateHouse(id: number, house: HouseRequest): Observable<House> {
    return this.http.put<House>(`${API_URL}/${id}`, house);
  }

  deleteHouse(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  toggleStatus(id: number): Observable<any> {
    return this.http.post(`${API_URL}/${id}/toggle-status`, {});
  }
}
