package com.reservation.exception;

/**
 * Exception thrown when trying to create an invalid reservation
 */
public class InvalidReservationException extends ReservationException {
    public InvalidReservationException(String message) {
        super("Invalid reservation: " + message);
    }
}