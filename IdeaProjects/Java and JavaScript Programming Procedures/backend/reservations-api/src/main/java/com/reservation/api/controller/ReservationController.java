package com.reservation.api.controller;

import com.reservation.api.entity.Reservation;
import com.reservation.api.entity.ReservationStatus;
import com.reservation.api.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Reservation management
 * Provides HTTP endpoints for reservation operations
 */
@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /**
     * GET /api/reservations - Get all reservations
     */
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    /**
     * GET /api/reservations/{id} - Get reservation by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable String id) {
        Optional<Reservation> reservation = reservationService.getReservationById(id);
        return reservation
                .map(r -> ResponseEntity.ok(r))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/reservations - Create new reservation
     */
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody Reservation reservation) {
        try {
            Reservation createdReservation = reservationService.createReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/reservations/{id} - Update reservation
     */
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable String id, 
            @Valid @RequestBody Reservation reservation) {
        try {
            Reservation updatedReservation = reservationService.updateReservation(id, reservation);
            return ResponseEntity.ok(updatedReservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/reservations/{id} - Delete reservation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable String id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/reservations/{id}/confirm - Confirm reservation
     */
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<Reservation> confirmReservation(@PathVariable String id) {
        try {
            Reservation confirmedReservation = reservationService.confirmReservation(id);
            return ResponseEntity.ok(confirmedReservation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/reservations/{id}/cancel - Cancel reservation
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable String id) {
        try {
            Reservation cancelledReservation = reservationService.cancelReservation(id);
            return ResponseEntity.ok(cancelledReservation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/reservations/{id}/complete - Complete reservation
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Reservation> completeReservation(@PathVariable String id) {
        try {
            Reservation completedReservation = reservationService.completeReservation(id);
            return ResponseEntity.ok(completedReservation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/reservations/{id}/no-show - Mark as no-show
     */
    @PatchMapping("/{id}/no-show")
    public ResponseEntity<Reservation> markAsNoShow(@PathVariable String id) {
        try {
            Reservation noShowReservation = reservationService.markAsNoShow(id);
            return ResponseEntity.ok(noShowReservation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/reservations/date/{date} - Get reservations by date
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Reservation>> getReservationsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Reservation> reservations = reservationService.getReservationsByDate(date);
        return ResponseEntity.ok(reservations);
    }

    /**
     * GET /api/reservations/status/{status} - Get reservations by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Reservation>> getReservationsByStatus(@PathVariable ReservationStatus status) {
        List<Reservation> reservations = reservationService.getReservationsByStatus(status);
        return ResponseEntity.ok(reservations);
    }

    /**
     * GET /api/reservations/customer/email/{email} - Get reservations by customer email
     */
    @GetMapping("/customer/email/{email}")
    public ResponseEntity<List<Reservation>> getReservationsByCustomerEmail(@PathVariable String email) {
        List<Reservation> reservations = reservationService.getReservationsByCustomerEmail(email);
        return ResponseEntity.ok(reservations);
    }

    /**
     * GET /api/reservations/customer/search?name={name} - Search reservations by customer name
     */
    @GetMapping("/customer/search")
    public ResponseEntity<List<Reservation>> searchReservationsByCustomerName(@RequestParam String name) {
        List<Reservation> reservations = reservationService.searchByCustomerName(name);
        return ResponseEntity.ok(reservations);
    }

    /**
     * GET /api/reservations/between - Get reservations between dates
     */
    @GetMapping("/between")
    public ResponseEntity<List<Reservation>> getReservationsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Reservation> reservations = reservationService.getReservationsBetweenDates(startDate, endDate);
        return ResponseEntity.ok(reservations);
    }

    /**
     * GET /api/reservations/upcoming - Get upcoming reservations
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<Reservation>> getUpcomingReservations() {
        List<Reservation> reservations = reservationService.getUpcomingReservations();
        return ResponseEntity.ok(reservations);
    }

    /**
     * GET /api/reservations/today - Get today's reservations
     */
    @GetMapping("/today")
    public ResponseEntity<List<Reservation>> getTodaysReservations() {
        List<Reservation> reservations = reservationService.getTodaysReservations();
        return ResponseEntity.ok(reservations);
    }

    /**
     * GET /api/reservations/stats - Get reservation statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<ReservationService.ReservationStats> getReservationStatistics() {
        ReservationService.ReservationStats stats = reservationService.getReservationStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Exception handler for validation errors
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(IllegalArgumentException e) {
        ErrorResponse error = new ErrorResponse("Validation Error", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    /**
     * Exception handler for runtime errors
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        ErrorResponse error = new ErrorResponse("Server Error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Error response class
     */
    public static class ErrorResponse {
        private String error;
        private String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        // Getters and setters
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}