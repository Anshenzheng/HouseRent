package com.houserent.service;

import com.houserent.dto.AppointmentRequest;
import com.houserent.entity.Appointment;
import com.houserent.entity.House;
import com.houserent.entity.User;
import com.houserent.repository.AppointmentRepository;
import com.houserent.repository.HouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public Appointment createAppointment(AppointmentRequest request) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("用户未登录");
        }
        if (!"TENANT".equals(currentUser.getRole())) {
            throw new RuntimeException("只有租客可以预约看房");
        }

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() -> new RuntimeException("房源不存在"));

        if (!"PUBLISHED".equals(house.getStatus())) {
            throw new RuntimeException("该房源已下架");
        }

        Appointment appointment = new Appointment();
        appointment.setHouse(house);
        appointment.setTenant(currentUser);
        appointment.setLandlord(house.getLandlord());
        appointment.setVisitDate(request.getVisitDate());
        appointment.setVisitTime(request.getVisitTime());
        appointment.setMessage(request.getMessage());
        appointment.setStatus("PENDING");

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("预约不存在"));

        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("用户未登录");
        }

        if (!appointment.getLandlord().getId().equals(currentUser.getId())) {
            throw new RuntimeException("无权限操作此预约");
        }

        if (!"PENDING".equals(appointment.getStatus())) {
            throw new RuntimeException("该预约已被处理");
        }

        if (!"ACCEPTED".equals(status) && !"REJECTED".equals(status)) {
            throw new RuntimeException("无效的预约状态");
        }

        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getMyAppointmentsAsTenant() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("用户未登录");
        }
        return appointmentRepository.findByTenantOrderByCreatedAtDesc(currentUser);
    }

    public List<Appointment> getMyAppointmentsAsLandlord() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("用户未登录");
        }
        return appointmentRepository.findByLandlordOrderByCreatedAtDesc(currentUser);
    }
}
