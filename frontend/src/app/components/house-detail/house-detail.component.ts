import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '../../services/house.service';
import { FavoriteService } from '../../services/favorite.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { House } from '../../models/house';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.scss']
})
export class HouseDetailComponent implements OnInit {
  house: House | null = null;
  loading = true;
  isFavorite = false;
  error = '';
  success = '';
  showAppointmentModal = false;

  appointmentForm: FormGroup;
  appointmentLoading = false;

  timeOptions = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HouseService,
    private favoriteService: FavoriteService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.appointmentForm = this.formBuilder.group({
      visitDate: [today, Validators.required],
      visitTime: ['', Validators.required],
      message: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadHouse(+id);
    }
  }

  loadHouse(id: number): void {
    this.loading = true;
    this.houseService.getHouseById(id).subscribe({
      next: (house) => {
        this.house = house;
        this.loading = false;
        
        if (this.authService.isLoggedIn()) {
          this.checkFavorite(id);
        }
      },
      error: () => {
        this.loading = false;
        this.error = '房源不存在';
      }
    });
  }

  checkFavorite(houseId: number): void {
    this.favoriteService.isFavorite(houseId).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
      }
    });
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (!this.house) return;

    this.favoriteService.toggleFavorite(this.house.id).subscribe({
      next: () => {
        this.isFavorite = !this.isFavorite;
        this.success = this.isFavorite ? '已添加到收藏' : '已取消收藏';
        setTimeout(() => this.success = '', 2000);
      },
      error: (err) => {
        this.error = err.error || '操作失败';
      }
    });
  }

  openAppointmentModal(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (this.authService.isLandlord()) {
      this.error = '房东无法预约看房';
      return;
    }

    this.showAppointmentModal = true;
    this.appointmentForm.reset({
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: '',
      message: ''
    });
  }

  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
    this.error = '';
  }

  get f() { return this.appointmentForm.controls; }

  submitAppointment(): void {
    if (this.appointmentForm.invalid || !this.house) {
      return;
    }

    this.appointmentLoading = true;
    this.error = '';

    const request = {
      houseId: this.house.id,
      visitDate: this.f['visitDate'].value,
      visitTime: this.f['visitTime'].value,
      message: this.f['message'].value || undefined
    };

    this.appointmentService.createAppointment(request).subscribe({
      next: () => {
        this.success = '预约成功！请等待房东确认';
        this.appointmentLoading = false;
        setTimeout(() => {
          this.closeAppointmentModal();
          this.success = '';
        }, 2000);
      },
      error: (err) => {
        this.error = err.error || '预约失败，请稍后重试';
        this.appointmentLoading = false;
      }
    });
  }

  getHouseImages(): string[] {
    if (!this.house?.images) {
      return [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20cozy%20apartment%20living%20room%20with%20wooden%20furniture%20minimalist%20home%20style&image_size=square_hd',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20bedroom%20with%20wooden%20floor%20and%20natural%20light%20cozy%20home&image_size=square_hd',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20kitchen%20with%20wooden%20cabinets%20minimalist%20design&image_size=square_hd'
      ];
    }
    return this.house.images.split(',');
  }

  getFacilities(): string[] {
    if (!this.house?.facilities) {
      return [];
    }
    return this.house.facilities.split(',');
  }
}
