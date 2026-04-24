package com.houserent.repository;

import com.houserent.entity.Appointment;
import com.houserent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByTenantOrderByCreatedAtDesc(User tenant);
    List<Appointment> findByLandlordOrderByCreatedAtDesc(User landlord);
    List<Appointment> findByTenantAndStatusOrderByCreatedAtDesc(User tenant, String status);
    List<Appointment> findByLandlordAndStatusOrderByCreatedAtDesc(User landlord, String status);
}
