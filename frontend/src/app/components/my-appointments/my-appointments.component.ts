import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  error = '';
  success = '';
  activeTab = 'tenant';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLandlord()) {
      this.activeTab = 'landlord';
    }
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    const observable = this.activeTab === 'landlord'
      ? this.appointmentService.getMyAppointmentsAsLandlord()
      : this.appointmentService.getMyAppointmentsAsTenant();

    observable.subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = '加载失败，请稍后重试';
      }
    });
  }

  switchTab(tab: string): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.loadAppointments();
    }
  }

  acceptAppointment(id: number): void {
    this.appointmentService.acceptAppointment(id).subscribe({
      next: (appointment) => {
        const index = this.appointments.findIndex(a => a.id === id);
        if (index > -1) {
          this.appointments[index] = appointment;
        }
        this.success = '已接受预约';
        setTimeout(() => this.success = '', 2000);
      },
      error: () => {
        this.error = '操作失败，请稍后重试';
      }
    });
  }

  rejectAppointment(id: number): void {
    this.appointmentService.rejectAppointment(id).subscribe({
      next: (appointment) => {
        const index = this.appointments.findIndex(a => a.id === id);
        if (index > -1) {
          this.appointments[index] = appointment;
        }
        this.success = '已拒绝预约';
        setTimeout(() => this.success = '', 2000);
      },
      error: () => {
        this.error = '操作失败，请稍后重试';
      }
    });
  }

  getStatusText(status: string): string {
    const map: { [key: string]: string } = {
      'PENDING': '待确认',
      'ACCEPTED': '已接受',
      'REJECTED': '已拒绝'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'PENDING': 'badge-warning',
      'ACCEPTED': 'badge-success',
      'REJECTED': 'badge-danger'
    };
    return map[status] || 'badge-info';
  }

  getHouseImage(appointment: Appointment): string {
    if (appointment.house.images) {
      const images = appointment.house.images.split(',');
      if (images.length > 0) {
        return images[0];
      }
    }
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20cozy%20apartment%20interior%20with%20wooden%20furniture%20and%20natural%20light%20minimalist%20home%20style&image_size=square_hd';
  }
}
