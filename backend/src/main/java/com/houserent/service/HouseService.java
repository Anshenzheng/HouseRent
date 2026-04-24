package com.houserent.service;

import com.houserent.dto.HouseRequest;
import com.houserent.entity.House;
import com.houserent.entity.User;
import com.houserent.repository.HouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HouseService {

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public House createHouse(HouseRequest request) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("用户未登录");
        }
        if (!"LANDLORD".equals(currentUser.getRole())) {
            throw new RuntimeException("只有房东可以发布房源");
        }

        House house = new House();
        house.setLandlord(currentUser);
        mapRequestToHouse(request, house);
        house.setStatus("PUBLISHED");

        return houseRepository.save(house);
    }

    @Transactional
    public House updateHouse(Long id, HouseRequest request) {
        House house = houseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("房源不存在"));

        User currentUser = authService.getCurrentUser();
        if (currentUser == null || !house.getLandlord().getId().equals(currentUser.getId())) {
            throw new RuntimeException("无权限修改此房源");
        }

        mapRequestToHouse(request, house);
        return houseRepository.save(house);
    }

    @Transactional
    public void toggleHouseStatus(Long id) {
        House house = houseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("房源不存在"));

        User currentUser = authService.getCurrentUser();
        if (currentUser == null || !house.getLandlord().getId().equals(currentUser.getId())) {
            throw new RuntimeException("无权限操作此房源");
        }

        if ("PUBLISHED".equals(house.getStatus())) {
            house.setStatus("OFFLINE");
        } else {
            house.setStatus("PUBLISHED");
        }

        houseRepository.save(house);
    }

    @Transactional
    public void deleteHouse(Long id) {
        House house = houseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("房源不存在"));

        User currentUser = authService.getCurrentUser();
        if (currentUser == null || !house.getLandlord().getId().equals(currentUser.getId())) {
            throw new RuntimeException("无权限删除此房源");
        }

        houseRepository.delete(house);
    }

    public Optional<House> getHouseById(Long id) {
        return houseRepository.findById(id);
    }

    public List<House> getMyHouses() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("用户未登录");
        }
        return houseRepository.findByLandlordOrderByCreatedAtDesc(currentUser);
    }

    public List<House> searchHouses(String keyword, String city, Integer minPrice, Integer maxPrice,
                                      Integer minArea, Integer maxArea, Integer bedroom,
                                      String houseType, String decoration) {
        Specification<House> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("status"), "PUBLISHED"));

            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(root.get("title"), "%" + keyword + "%"),
                        criteriaBuilder.like(root.get("district"), "%" + keyword + "%"),
                        criteriaBuilder.like(root.get("address"), "%" + keyword + "%")
                ));
            }

            if (city != null && !city.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("city"), city));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), BigDecimal.valueOf(minPrice)));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), BigDecimal.valueOf(maxPrice)));
            }

            if (minArea != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("area"), minArea));
            }

            if (maxArea != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("area"), maxArea));
            }

            if (bedroom != null) {
                predicates.add(criteriaBuilder.equal(root.get("bedroom"), bedroom));
            }

            if (houseType != null && !houseType.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("houseType"), houseType));
            }

            if (decoration != null && !decoration.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("decoration"), decoration));
            }

            query.orderBy(criteriaBuilder.desc(root.get("createdAt")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return houseRepository.findAll(spec);
    }

    private void mapRequestToHouse(HouseRequest request, House house) {
        house.setTitle(request.getTitle());
        house.setDescription(request.getDescription());
        house.setProvince(request.getProvince());
        house.setCity(request.getCity());
        house.setDistrict(request.getDistrict());
        house.setAddress(request.getAddress());
        house.setPrice(request.getPrice());
        house.setArea(request.getArea());
        house.setBedroom(request.getBedroom());
        house.setLivingRoom(request.getLivingRoom());
        house.setBathroom(request.getBathroom());
        house.setOrientation(request.getOrientation());
        house.setFloor(request.getFloor());
        house.setDecoration(request.getDecoration());
        house.setHouseType(request.getHouseType());
        house.setImages(request.getImages());
        house.setFacilities(request.getFacilities());
    }
}
