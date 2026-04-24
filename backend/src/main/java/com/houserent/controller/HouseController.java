package com.houserent.controller;

import com.houserent.dto.HouseRequest;
import com.houserent.entity.House;
import com.houserent.service.HouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/houses")
@CrossOrigin(origins = "http://localhost:4200")
public class HouseController {

    @Autowired
    private HouseService houseService;

    @PostMapping
    public ResponseEntity<?> createHouse(@Valid @RequestBody HouseRequest request) {
        try {
            House house = houseService.createHouse(request);
            return ResponseEntity.ok(house);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHouse(@PathVariable Long id, @Valid @RequestBody HouseRequest request) {
        try {
            House house = houseService.updateHouse(id, request);
            return ResponseEntity.ok(house);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHouse(@PathVariable Long id) {
        try {
            houseService.deleteHouse(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleHouseStatus(@PathVariable Long id) {
        try {
            houseService.toggleHouseStatus(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyHouses() {
        try {
            List<House> houses = houseService.getMyHouses();
            return ResponseEntity.ok(houses);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHouseById(@PathVariable Long id) {
        return houseService.getHouseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<House>> searchHouses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minArea,
            @RequestParam(required = false) Integer maxArea,
            @RequestParam(required = false) Integer bedroom,
            @RequestParam(required = false) String houseType,
            @RequestParam(required = false) String decoration) {
        List<House> houses = houseService.searchHouses(
                keyword, city, minPrice, maxPrice, minArea, maxArea, bedroom, houseType, decoration);
        return ResponseEntity.ok(houses);
    }
}
