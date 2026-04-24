package com.houserent.controller;

import com.houserent.entity.Favorite;
import com.houserent.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:4200")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/toggle/{houseId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long houseId) {
        try {
            Favorite favorite = favoriteService.toggleFavorite(houseId);
            return ResponseEntity.ok(favorite);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyFavorites() {
        try {
            List<Favorite> favorites = favoriteService.getMyFavorites();
            return ResponseEntity.ok(favorites);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check/{houseId}")
    public ResponseEntity<Boolean> isFavorite(@PathVariable Long houseId) {
        try {
            boolean isFavorite = favoriteService.isFavorite(houseId);
            return ResponseEntity.ok(isFavorite);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(false);
        }
    }
}
