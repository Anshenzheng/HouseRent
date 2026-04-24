import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../models/favorite';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.scss']
})
export class MyFavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  loading = false;
  error = '';
  success = '';

  constructor(
    private favoriteService: FavoriteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.favoriteService.getMyFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = '加载失败，请稍后重试';
      }
    });
  }

  toggleFavorite(favorite: Favorite): void {
    this.favoriteService.toggleFavorite(favorite.house.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.house.id !== favorite.house.id);
        this.success = '已取消收藏';
        setTimeout(() => this.success = '', 2000);
      },
      error: () => {
        this.error = '操作失败，请稍后重试';
      }
    });
  }

  getHouseImage(favorite: Favorite): string {
    if (favorite.house.images) {
      const images = favorite.house.images.split(',');
      if (images.length > 0) {
        return images[0];
      }
    }
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20cozy%20apartment%20interior%20with%20wooden%20furniture%20and%20natural%20light%20minimalist%20home%20style&image_size=square_hd';
  }
}
