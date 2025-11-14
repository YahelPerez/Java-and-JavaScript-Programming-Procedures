package com.reservation.api.service;

import com.reservation.api.entity.Reservation;
import com.reservation.api.entity.ReservationStatus;
import com.reservation.api.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service layer for Reservation management
 * Contains business logic for reservation operations
 */
@Service
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    /**
     * Create a new reservation
     */
    public Reservation createReservation(Reservation reservation) {
        if (reservation.getId() == null || reservation.getId().isEmpty()) {
            reservation.setId(generateReservationId());
        }
        
        validateReservation(reservation);
        return reservationRepository.save(reservation);
    }

    /**
     * Get all reservations
     */
    @Transactional(readOnly = true)
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    /**
     * Get reservation by ID
     */
    @Transactional(readOnly = true)
    public Optional<Reservation> getReservationById(String id) {
        return reservationRepository.findById(id);
    }

    /**
     * Update reservation
     */
    public Reservation updateReservation(String id, Reservation updatedReservation) {
        return reservationRepository.findById(id)
                .map(existing -> {
                    existing.setCustomerName(updatedReservation.getCustomerName());
                    existing.setCustomerEmail(updatedReservation.getCustomerEmail());
                    existing.setCustomerPhone(updatedReservation.getCustomerPhone());
                    existing.setReservationDate(updatedReservation.getReservationDate());
                    existing.setReservationTime(updatedReservation.getReservationTime());
                    existing.setPartySize(updatedReservation.getPartySize());
                    existing.setSpecialRequests(updatedReservation.getSpecialRequests());
                    existing.setUpdatedAt(LocalDateTime.now());
                    return reservationRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    /**
     * Delete reservation
     */
    public void deleteReservation(String id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found with id: " + id);
        }
        reservationRepository.deleteById(id);
    }

    /**
     * Confirm reservation
     */
    public Reservation confirmReservation(String id) {
        return updateReservationStatus(id, ReservationStatus.CONFIRMED);
    }

    /**
     * Cancel reservation
     */
    public Reservation cancelReservation(String id) {
        return updateReservationStatus(id, ReservationStatus.CANCELLED);
    }

    /**
     * Complete reservation
     */
    public Reservation completeReservation(String id) {
        return updateReservationStatus(id, ReservationStatus.COMPLETED);
    }

    /**
     * Mark reservation as no-show
     */
    public Reservation markAsNoShow(String id) {
        return updateReservationStatus(id, ReservationStatus.NO_SHOW);
    }

    /**
     * Get reservations by date
     */
    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByDate(LocalDate date) {
        return reservationRepository.findByReservationDateOrderByReservationTimeAsc(date);
    }

    /**
     * Get reservations by status
     */
    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByStatus(ReservationStatus status) {
        return reservationRepository.findByStatusOrderByReservationDateAscReservationTimeAsc(status);
    }

    /**
     * Get reservations by customer email
     */
    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByCustomerEmail(String email) {
        return reservationRepository.findByCustomerEmailIgnoreCaseOrderByReservationDateDesc(email);
    }

    /**
     * Search reservations by customer name
     */
    @Transactional(readOnly = true)
    public List<Reservation> searchByCustomerName(String name) {
        return reservationRepository.findByCustomerNameContainingIgnoreCase(name);
    }

    /**
     * Get reservations between dates
     */
    @Transactional(readOnly = true)
    public List<Reservation> getReservationsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return reservationRepository.findByReservationDateBetweenOrderByReservationDateAscReservationTimeAsc(
                startDate, endDate);
    }

    /**
     * Get upcoming reservations
     */
    @Transactional(readOnly = true)
    public List<Reservation> getUpcomingReservations() {
        return reservationRepository.findUpcomingReservations();
    }

    /**
     * Get today's reservations
     */
    @Transactional(readOnly = true)
    public List<Reservation> getTodaysReservations() {
        return reservationRepository.getTodaysReservations();
    }

    /**
     * Get reservation statistics
     */
    @Transactional(readOnly = true)
    public ReservationStats getReservationStatistics() {
        List<Object[]> stats = reservationRepository.getReservationStatistics();
        ReservationStats reservationStats = new ReservationStats();
        
        for (Object[] row : stats) {
            ReservationStatus status = (ReservationStatus) row[0];
            Long count = (Long) row[1];
            
            switch (status) {
                case PENDING:
                    reservationStats.setPendingCount(count);
                    break;
                case CONFIRMED:
                    reservationStats.setConfirmedCount(count);
                    break;
                case CANCELLED:
                    reservationStats.setCancelledCount(count);
                    break;
                case COMPLETED:
                    reservationStats.setCompletedCount(count);
                    break;
                case NO_SHOW:
                    reservationStats.setNoShowCount(count);
                    break;
            }
        }
        
        reservationStats.setTotalCount(reservationRepository.count());
        return reservationStats;
    }

    // Private helper methods

    private String generateReservationId() {
        return "RSV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void validateReservation(Reservation reservation) {
        if (reservation.getReservationDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Reservation date cannot be in the past");
        }
        
        if (reservation.getPartySize() <= 0 || reservation.getPartySize() > 20) {
            throw new IllegalArgumentException("Party size must be between 1 and 20");
        }
        
        // Check for duplicate reservations (same email, date, time)
        if (reservation.getCustomerEmail() != null) {
            long existingCount = reservationRepository.findByReservationDateAndStatusOrderByReservationTimeAsc(
                    reservation.getReservationDate(), ReservationStatus.CONFIRMED).stream()
                    .filter(r -> r.getCustomerEmail() != null && 
                                r.getCustomerEmail().equalsIgnoreCase(reservation.getCustomerEmail()) &&
                                r.getReservationTime().equals(reservation.getReservationTime()))
                    .count();
            
            if (existingCount > 0) {
                throw new IllegalArgumentException("Customer already has a confirmed reservation at this time");
            }
        }
    }

    private Reservation updateReservationStatus(String id, ReservationStatus status) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setStatus(status);
                    reservation.setUpdatedAt(LocalDateTime.now());
                    return reservationRepository.save(reservation);
                })
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    /**
     * Inner class for reservation statistics
     */
    public static class ReservationStats {
        private Long totalCount = 0L;
        private Long pendingCount = 0L;
        private Long confirmedCount = 0L;
        private Long cancelledCount = 0L;
        private Long completedCount = 0L;
        private Long noShowCount = 0L;

        // Getters and setters
        public Long getTotalCount() { return totalCount; }
        public void setTotalCount(Long totalCount) { this.totalCount = totalCount; }

        public Long getPendingCount() { return pendingCount; }
        public void setPendingCount(Long pendingCount) { this.pendingCount = pendingCount; }

        public Long getConfirmedCount() { return confirmedCount; }
        public void setConfirmedCount(Long confirmedCount) { this.confirmedCount = confirmedCount; }

        public Long getCancelledCount() { return cancelledCount; }
        public void setCancelledCount(Long cancelledCount) { this.cancelledCount = cancelledCount; }

        public Long getCompletedCount() { return completedCount; }
        public void setCompletedCount(Long completedCount) { this.completedCount = completedCount; }

        public Long getNoShowCount() { return noShowCount; }
        public void setNoShowCount(Long noShowCount) { this.noShowCount = noShowCount; }
    }
}