package com.reservation.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.assertj.core.api.Assertions.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Unit tests for the Reservation model class
 */
class ReservationTest {

    private Reservation reservation;
    private LocalDate testDate;
    private LocalTime testTime;

    @BeforeEach
    void setUp() {
        testDate = LocalDate.of(2024, 12, 25);
        testTime = LocalTime.of(19, 30);
        reservation = new Reservation();
    }

    @Test
    void testDefaultConstructor() {
        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.PENDING);
        assertThat(reservation.getId()).isNull();
        assertThat(reservation.getCustomerName()).isNull();
        assertThat(reservation.getCustomerEmail()).isNull();
        assertThat(reservation.getReservationDate()).isNull();
        assertThat(reservation.getReservationTime()).isNull();
        assertThat(reservation.getNumberOfGuests()).isEqualTo(0);
    }

    @Test
    void testParameterizedConstructor() {
        Reservation paramReservation = new Reservation("RES001", "John Doe", "john@example.com",
                testDate, testTime, 4);

        assertThat(paramReservation.getId()).isEqualTo("RES001");
        assertThat(paramReservation.getCustomerName()).isEqualTo("John Doe");
        assertThat(paramReservation.getCustomerEmail()).isEqualTo("john@example.com");
        assertThat(paramReservation.getReservationDate()).isEqualTo(testDate);
        assertThat(paramReservation.getReservationTime()).isEqualTo(testTime);
        assertThat(paramReservation.getNumberOfGuests()).isEqualTo(4);
        assertThat(paramReservation.getStatus()).isEqualTo(ReservationStatus.PENDING);
    }

    @Test
    void testSettersAndGetters() {
        reservation.setId("RES002");
        reservation.setCustomerName("Jane Smith");
        reservation.setCustomerEmail("jane@example.com");
        reservation.setCustomerPhone("+1-555-0123");
        reservation.setReservationDate(testDate);
        reservation.setReservationTime(testTime);
        reservation.setNumberOfGuests(2);
        reservation.setSpecialRequests("Window table please");
        reservation.setStatus(ReservationStatus.CONFIRMED);

        assertThat(reservation.getId()).isEqualTo("RES002");
        assertThat(reservation.getCustomerName()).isEqualTo("Jane Smith");
        assertThat(reservation.getCustomerEmail()).isEqualTo("jane@example.com");
        assertThat(reservation.getCustomerPhone()).isEqualTo("+1-555-0123");
        assertThat(reservation.getReservationDate()).isEqualTo(testDate);
        assertThat(reservation.getReservationTime()).isEqualTo(testTime);
        assertThat(reservation.getNumberOfGuests()).isEqualTo(2);
        assertThat(reservation.getSpecialRequests()).isEqualTo("Window table please");
        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
    }

    @Test
    void testEquals() {
        Reservation res1 = new Reservation("RES001", "John Doe", "john@example.com",
                testDate, testTime, 4);
        Reservation res2 = new Reservation("RES001", "Jane Smith", "jane@example.com",
                testDate.plusDays(1), testTime.plusHours(1), 2);
        Reservation res3 = new Reservation("RES002", "John Doe", "john@example.com",
                testDate, testTime, 4);

        assertThat(res1).isEqualTo(res2); // Same ID
        assertThat(res1).isNotEqualTo(res3); // Different ID
        assertThat(res1).isNotEqualTo(null);
        assertThat(res1).isEqualTo(res1); // Same object
    }

    @Test
    void testHashCode() {
        Reservation res1 = new Reservation("RES001", "John Doe", "john@example.com",
                testDate, testTime, 4);
        Reservation res2 = new Reservation("RES001", "Jane Smith", "jane@example.com",
                testDate.plusDays(1), testTime.plusHours(1), 2);

        assertThat(res1.hashCode()).isEqualTo(res2.hashCode()); // Same ID should have same hash
    }

    @Test
    void testToString() {
        reservation.setId("RES001");
        reservation.setCustomerName("John Doe");
        reservation.setCustomerEmail("john@example.com");
        reservation.setReservationDate(testDate);
        reservation.setReservationTime(testTime);
        reservation.setNumberOfGuests(4);

        String result = reservation.toString();

        assertThat(result).contains("RES001");
        assertThat(result).contains("John Doe");
        assertThat(result).contains("john@example.com");
        assertThat(result).contains(testDate.toString());
        assertThat(result).contains(testTime.toString());
        assertThat(result).contains("4");
        assertThat(result).contains("Pending");
    }

    @Test
    void testEqualsWithNullId() {
        Reservation res1 = new Reservation();
        Reservation res2 = new Reservation();

        assertThat(res1).isEqualTo(res2); // Both have null IDs
    }

    @Test
    void testEqualsWithDifferentClasses() {
        Reservation res = new Reservation("RES001", "John Doe", "john@example.com",
                testDate, testTime, 4);
        String notAReservation = "Not a reservation";

        assertThat(res).isNotEqualTo(notAReservation);
    }
}