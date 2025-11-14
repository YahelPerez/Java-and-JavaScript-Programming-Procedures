package com.reservation.api.repository;

import com.reservation.api.entity.Reservation;
import com.reservation.api.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for Reservation entity
 * Provides database access methods for reservations
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, String> {

    /**
     * Find reservations by date
     */
    List<Reservation> findByReservationDateOrderByReservationTimeAsc(LocalDate date);

    /**
     * Find reservations by status
     */
    List<Reservation> findByStatusOrderByReservationDateAscReservationTimeAsc(ReservationStatus status);

    /**
     * Find reservations by customer email
     */
    List<Reservation> findByCustomerEmailIgnoreCaseOrderByReservationDateDesc(String email);

    /**
     * Find reservations by customer name (partial match)
     */
    @Query("SELECT r FROM Reservation r WHERE LOWER(r.customerName) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "ORDER BY r.reservationDate DESC, r.reservationTime DESC")
    List<Reservation> findByCustomerNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find reservations between dates
     */
    List<Reservation> findByReservationDateBetweenOrderByReservationDateAscReservationTimeAsc(
            LocalDate startDate, LocalDate endDate);

    /**
     * Find upcoming reservations (from today onwards)
     */
    @Query("SELECT r FROM Reservation r WHERE r.reservationDate >= CURRENT_DATE " +
           "ORDER BY r.reservationDate ASC, r.reservationTime ASC")
    List<Reservation> findUpcomingReservations();

    /**
     * Find reservations for a specific date and status
     */
    List<Reservation> findByReservationDateAndStatusOrderByReservationTimeAsc(
            LocalDate date, ReservationStatus status);

    /**
     * Count reservations by status
     */
    long countByStatus(ReservationStatus status);

    /**
     * Count reservations for a specific date
     */
    long countByReservationDate(LocalDate date);

    /**
     * Find available slots for a date (custom query)
     */
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.reservationDate = :date AND r.status != 'CANCELLED'")
    long countActiveReservationsForDate(@Param("date") LocalDate date);

    /**
     * Get reservation statistics
     */
    @Query("SELECT r.status, COUNT(r) FROM Reservation r GROUP BY r.status")
    List<Object[]> getReservationStatistics();

    /**
     * Find reservations by party size
     */
    List<Reservation> findByPartySizeGreaterThanEqualOrderByReservationDateAsc(Integer minPartySize);

    /**
     * Check if email exists
     */
    boolean existsByCustomerEmail(String email);

    /**
     * Get today's reservations
     */
    @Query("SELECT r FROM Reservation r WHERE r.reservationDate = CURRENT_DATE " +
           "ORDER BY r.reservationTime ASC")
    List<Reservation> getTodaysReservations();

    /**
     * Get reservations for the next 7 days
     */
    @Query("SELECT r FROM Reservation r WHERE r.reservationDate BETWEEN CURRENT_DATE AND :endDate " +
           "ORDER BY r.reservationDate ASC, r.reservationTime ASC")
    List<Reservation> getReservationsForNextWeek(@Param("endDate") LocalDate endDate);
}