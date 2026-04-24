import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentRequest } from '../models/appointment';

const API_URL = 'http://localhost:8080/api/appointments';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  createAppointment(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(API_URL, request);
  }

  acceptAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${API_URL}/${id}/accept`, {});
  }

  rejectAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${API_URL}/${id}/reject`, {});
  }

  getMyAppointmentsAsTenant(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_URL}/my/tenant`);
  }

  getMyAppointmentsAsLandlord(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_URL}/my/landlord`);
  }
}
