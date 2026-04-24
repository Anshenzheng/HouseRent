import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HouseService } from '../../services/house.service';
import { House } from '../../models/house';

@Component({
  selector: 'app-my-houses',
  templateUrl: './my-houses.component.html',
  styleUrls: ['./my-houses.component.scss']
})
export class MyHousesComponent implements OnInit {
  houses: House[] = [];
  loading = false;
  error = '';
  success = '';

  constructor(
    private houseService: HouseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMyHouses();
  }

  loadMyHouses(): void {
    this.loading = true;
    this.houseService.getMyHouses().subscribe({
      next: (houses) => {
        this.houses = houses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = '加载失败，请稍后重试';
      }
    });
  }

  toggleStatus(house: House): void {
    this.houseService.toggleStatus(house.id).subscribe({
      next: () => {
        house.status = house.status === 'PUBLISHED' ? 'OFFLINE' : 'PUBLISHED';
        this.success = house.status === 'PUBLISHED' ? '已上架' : '已下架';
        setTimeout(() => this.success = '', 2000);
      },
      error: () => {
        this.error = '操作失败，请稍后重试';
      }
    });
  }

  deleteHouse(house: House): void {
    if (!confirm(`确定要删除房源「${house.title}」吗？`)) {
      return;
    }

    this.houseService.deleteHouse(house.id).subscribe({
      next: () => {
        this.houses = this.houses.filter(h => h.id !== house.id);
        this.success = '删除成功';
        setTimeout(() => this.success = '', 2000);
      },
      error: () => {
        this.error = '删除失败，请稍后重试';
      }
    });
  }

  getHouseImage(house: House): string {
    if (house.images) {
      const images = house.images.split(',');
      if (images.length > 0) {
        return images[0];
      }
    }
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20cozy%20apartment%20interior%20with%20wooden%20furniture%20and%20natural%20light%20minimalist%20home%20style&image_size=square_hd';
  }

  getStatusText(status: string): string {
    return status === 'PUBLISHED' ? '已上架' : '已下架';
  }
}
