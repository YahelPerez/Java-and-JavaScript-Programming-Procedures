package com.reservation.api.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

/**
 * Direct Database Controller for Frontend Integration
 */
@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseReservationController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // DTO Class for Frontend
    public static class ReservationDTO {
        private String id;
        private String customerName;
        private LocalDate reservationDate;
        private String status;
        private Long cityId;
        private Integer numberOfGuests;

        // Constructors
        public ReservationDTO() {}

        public ReservationDTO(String id, String customerName, LocalDate reservationDate, 
                            String status, Long cityId, Integer numberOfGuests) {
            this.id = id;
            this.customerName = customerName;
            this.reservationDate = reservationDate;
            this.status = status;
            this.cityId = cityId;
            this.numberOfGuests = numberOfGuests;
        }

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public LocalDate getReservationDate() { return reservationDate; }
        public void setReservationDate(LocalDate reservationDate) { this.reservationDate = reservationDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Long getCityId() { return cityId; }
        public void setCityId(Long cityId) { this.cityId = cityId; }
        public Integer getNumberOfGuests() { return numberOfGuests; }
        public void setNumberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; }
    }

    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        try {
            String sql = "SELECT id, customer_name, reservation_date, status, 1 as city_id, party_size FROM reservations";
            
            List<ReservationDTO> reservations = jdbcTemplate.query(sql, new RowMapper<ReservationDTO>() {
                @Override
                public ReservationDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
                    ReservationDTO reservation = new ReservationDTO();
                    reservation.setId(rs.getString("id"));
                    reservation.setCustomerName(rs.getString("customer_name"));
                    reservation.setReservationDate(rs.getDate("reservation_date").toLocalDate());
                    reservation.setStatus(rs.getString("status"));
                    reservation.setCityId(rs.getLong("city_id"));
                    reservation.setNumberOfGuests(rs.getInt("party_size"));
                    return reservation;
                }
            });
            
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservationById(@PathVariable String id) {
        try {
            String sql = "SELECT id, customer_name, reservation_date, status, 1 as city_id, party_size FROM reservations WHERE id = ?";
            
            ReservationDTO reservation = jdbcTemplate.queryForObject(sql, new RowMapper<ReservationDTO>() {
                @Override
                public ReservationDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
                    ReservationDTO reservation = new ReservationDTO();
                    reservation.setId(rs.getString("id"));
                    reservation.setCustomerName(rs.getString("customer_name"));
                    reservation.setReservationDate(rs.getDate("reservation_date").toLocalDate());
                    reservation.setStatus(rs.getString("status"));
                    reservation.setCityId(rs.getLong("city_id"));
                    reservation.setNumberOfGuests(rs.getInt("party_size"));
                    return reservation;
                }
            }, id);
            
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@RequestBody ReservationDTO reservation) {
        try {
            // Generate new ID
            String newId = "RSV-" + String.format("%03d", System.currentTimeMillis() % 1000);
            
            String sql = "INSERT INTO reservations (id, customer_name, reservation_date, status, party_size, created_at, updated_at) " +
                        "VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
            
            jdbcTemplate.update(sql, newId, reservation.getCustomerName(), 
                              reservation.getReservationDate(), reservation.getStatus(), 
                              reservation.getNumberOfGuests());
            
            reservation.setId(newId);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(@PathVariable String id, @RequestBody ReservationDTO reservation) {
        try {
            String sql = "UPDATE reservations SET customer_name = ?, reservation_date = ?, status = ?, party_size = ?, updated_at = NOW() WHERE id = ?";
            
            int rowsAffected = jdbcTemplate.update(sql, reservation.getCustomerName(), 
                                                 reservation.getReservationDate(), reservation.getStatus(), 
                                                 reservation.getNumberOfGuests(), id);
            
            if (rowsAffected > 0) {
                reservation.setId(id);
                return ResponseEntity.ok(reservation);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable String id) {
        try {
            String sql = "DELETE FROM reservations WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, id);
            
            if (rowsAffected > 0) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByStatus(@PathVariable String status) {
        try {
            String sql = "SELECT id, customer_name, reservation_date, status, 1 as city_id, party_size FROM reservations WHERE status = ?";
            
            List<ReservationDTO> reservations = jdbcTemplate.query(sql, new RowMapper<ReservationDTO>() {
                @Override
                public ReservationDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
                    ReservationDTO reservation = new ReservationDTO();
                    reservation.setId(rs.getString("id"));
                    reservation.setCustomerName(rs.getString("customer_name"));
                    reservation.setReservationDate(rs.getDate("reservation_date").toLocalDate());
                    reservation.setStatus(rs.getString("status"));
                    reservation.setCityId(rs.getLong("city_id"));
                    reservation.setNumberOfGuests(rs.getInt("party_size"));
                    return reservation;
                }
            }, status);
            
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}