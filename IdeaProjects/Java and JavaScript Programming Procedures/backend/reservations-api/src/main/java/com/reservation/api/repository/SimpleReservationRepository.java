package com.reservation.api.repository;

import com.reservation.api.entity.SimpleReservation;
import com.reservation.api.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for SimpleReservation entity with MySQL database operations
 */
@Repository
public interface SimpleReservationRepository extends JpaRepository<SimpleReservation, Long> {

    /**
     * Find all reservations by status
     */
    List<SimpleReservation> findByStatus(ReservationStatus status);

    /**
     * Find all reservations by city ID
     */
    List<SimpleReservation> findByCityId(Long cityId);

    /**
     * Find reservations by customer name containing (case insensitive)
     */
    List<SimpleReservation> findByCustomerNameContainingIgnoreCase(String customerName);

    /**
     * Count total reservations
     */
    @Query("SELECT COUNT(r) FROM SimpleReservation r")
    long countTotalReservations();

    /**
     * Count reservations by status
     */
    long countByStatus(ReservationStatus status);

    /**
     * Find reservations with guests count greater than specified number
     */
    List<SimpleReservation> findByNumberOfGuestsGreaterThan(Integer numberOfGuests);
}