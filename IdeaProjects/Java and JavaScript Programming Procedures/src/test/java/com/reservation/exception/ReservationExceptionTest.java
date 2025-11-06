package com.reservation.exception;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for reservation exception classes
 */
class ReservationExceptionTest {

    @Test
    void testReservationExceptionWithMessage() {
        String message = "Test exception message";
        ReservationException exception = new ReservationException(message);

        assertThat(exception.getMessage()).isEqualTo(message);
        assertThat(exception.getCause()).isNull();
    }

    @Test
    void testReservationExceptionWithMessageAndCause() {
        String message = "Test exception message";
        RuntimeException cause = new RuntimeException("Root cause");
        ReservationException exception = new ReservationException(message, cause);

        assertThat(exception.getMessage()).isEqualTo(message);
        assertThat(exception.getCause()).isEqualTo(cause);
    }

    @Test
    void testReservationNotFoundException() {
        String reservationId = "RES123";
        ReservationNotFoundException exception = new ReservationNotFoundException(reservationId);

        assertThat(exception.getMessage()).isEqualTo("Reservation not found with ID: " + reservationId);
        assertThat(exception).isInstanceOf(ReservationException.class);
    }

    @Test
    void testInvalidReservationException() {
        String message = "Invalid data provided";
        InvalidReservationException exception = new InvalidReservationException(message);

        assertThat(exception.getMessage()).isEqualTo("Invalid reservation: " + message);
        assertThat(exception).isInstanceOf(ReservationException.class);
    }

    @Test
    void testExceptionInheritance() {
        ReservationNotFoundException notFoundException = new ReservationNotFoundException("RES123");
        InvalidReservationException invalidException = new InvalidReservationException("test");

        assertThat(notFoundException).isInstanceOf(ReservationException.class);
        assertThat(invalidException).isInstanceOf(ReservationException.class);
        assertThat(notFoundException).isInstanceOf(Exception.class);
        assertThat(invalidException).isInstanceOf(Exception.class);
    }
}