import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../services/house.service';
import { House, HouseFilter } from '../../models/house';

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.scss']
})
export class HouseListComponent implements OnInit {
  houses: House[] = [];
  loading = false;
  filter: HouseFilter = {};

  cities = ['', '北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安'];
  priceRanges = [
    { label: '价格不限', min: null, max: null },
    { label: '2000以下', min: null, max: 2000 },
    { label: '2000-4000', min: 2000, max: 4000 },
    { label: '4000-6000', min: 4000, max: 6000 },
    { label: '6000-8000', min: 6000, max: 8000 },
    { label: '8000以上', min: 8000, max: null }
  ];
  bedroomOptions = [
    { label: '户型不限', value: null },
    { label: '一室', value: 1 },
    { label: '两室', value: 2 },
    { label: '三室', value: 3 },
    { label: '四室及以上', value: 4 }
  ];
  houseTypes = ['', '公寓', '住宅', '别墅', '商铺'];
  decorations = ['', '毛坯', '简装', '精装', '豪装'];

  selectedPriceRange = 0;
  selectedBedroom: number | null = null;

  constructor(
    private houseService: HouseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = {
        keyword: params['keyword'] || '',
        city: params['city'] || ''
      };
      this.searchHouses();
    });
  }

  searchHouses(): void {
    this.loading = true;
    this.houseService.searchHouses(this.filter).subscribe({
      next: (houses) => {
        this.houses = houses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPriceRangeChange(index: number): void {
    this.selectedPriceRange = index;
    const range = this.priceRanges[index];
    this.filter.minPrice = range.min;
    this.filter.maxPrice = range.max;
  }

  onBedroomChange(value: number | null): void {
    this.selectedBedroom = value;
    this.filter.bedroom = value;
  }

  resetFilter(): void {
    this.filter = {};
    this.selectedPriceRange = 0;
    this.selectedBedroom = null;
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
}
