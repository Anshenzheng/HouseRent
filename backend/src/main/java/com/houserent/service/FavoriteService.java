package com.houserent.service;

import com.houserent.entity.Favorite;
import com.houserent.entity.House;
import com.houserent.entity.User;
import com.houserent.repository.FavoriteRepository;
import com.houserent.repository.HouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public Favorite toggleFavorite(Long houseId) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("用户未登录");
        }

        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new RuntimeException("房源不存在"));

        if (house.getLandlord().getId().equals(currentUser.getId())) {
            throw new RuntimeException("不能收藏自己发布的房源");
        }

        if (favoriteRepository.existsByUserAndHouse(currentUser, house)) {
            favoriteRepository.deleteByUserAndHouse(currentUser, house);
            return null;
        } else {
            Favorite favorite = new Favorite();
            favorite.setUser(currentUser);
            favorite.setHouse(house);
            return favoriteRepository.save(favorite);
        }
    }

    public List<Favorite> getMyFavorites() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("用户未登录");
        }
        return favoriteRepository.findByUserOrderByCreatedAtDesc(currentUser);
    }

    public boolean isFavorite(Long houseId) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return false;
        }

        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new RuntimeException("房源不存在"));

        return favoriteRepository.existsByUserAndHouse(currentUser, house);
    }
}
