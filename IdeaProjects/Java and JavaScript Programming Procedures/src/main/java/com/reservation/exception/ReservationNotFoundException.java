package com.reservation.exception;

/**
 * Exception thrown when a reservation is not found
 */
public class ReservationNotFoundException extends ReservationException {
    public ReservationNotFoundException(String reservationId) {
        super("Reservation not found with ID: " + reservationId);
    }
}