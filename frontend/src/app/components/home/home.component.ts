import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HouseService } from '../../services/house.service';
import { House, HouseFilter } from '../../models/house';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredHouses: House[] = [];
  searchKeyword = '';
  searchCity = '';
  loading = false;

  cities = ['', '北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安'];

  constructor(
    private houseService: HouseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFeaturedHouses();
  }

  loadFeaturedHouses(): void {
    this.loading = true;
    this.houseService.searchHouses({}).subscribe({
      next: (houses) => {
        this.featuredHouses = houses.slice(0, 6);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const filter: HouseFilter = {};
    if (this.searchKeyword) filter.keyword = this.searchKeyword;
    if (this.searchCity) filter.city = this.searchCity;
    this.router.navigate(['/houses'], { queryParams: filter });
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
