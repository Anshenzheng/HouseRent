package com.houserent.repository;

import com.houserent.entity.Favorite;
import com.houserent.entity.House;
import com.houserent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);
    Optional<Favorite> findByUserAndHouse(User user, House house);
    void deleteByUserAndHouse(User user, House house);
    boolean existsByUserAndHouse(User user, House house);
}
