package com.houserent.repository;

import com.houserent.entity.House;
import com.houserent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HouseRepository extends JpaRepository<House, Long>, JpaSpecificationExecutor<House> {
    List<House> findByLandlordOrderByCreatedAtDesc(User landlord);
    List<House> findByLandlordAndStatusOrderByCreatedAtDesc(User landlord, String status);
    List<House> findByStatusOrderByCreatedAtDesc(String status);
}
