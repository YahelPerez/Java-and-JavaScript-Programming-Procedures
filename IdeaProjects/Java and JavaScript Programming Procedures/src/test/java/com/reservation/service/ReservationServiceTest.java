package com.reservation.service;

import com.reservation.model.Reservation;
import com.reservation.model.ReservationStatus;
import com.reservation.exception.ReservationException;
import com.reservation.exception.ReservationNotFoundException;
import com.reservation.exception.InvalidReservationException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Comprehensive unit tests for the ReservationService class
 */
class ReservationServiceTest {

    private ReservationService reservationService;
    private LocalDate futureDate;
    private LocalTime validTime;

    @BeforeEach
    void setUp() {
        reservationService = new ReservationService();
        futureDate = LocalDate.now().plusDays(1);
        validTime = LocalTime.of(19, 30);
    }

    // ==================== CREATE RESERVATION TESTS ====================

    @Test
    @DisplayName("Should create reservation with valid data")
    void testCreateReservationWithValidData() throws ReservationException {
        Reservation reservation = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        assertThat(reservation).isNotNull();
        assertThat(reservation.getId()).isNotNull();
        assertThat(reservation.getCustomerName()).isEqualTo("John Doe");
        assertThat(reservation.getCustomerEmail()).isEqualTo("john@example.com");
        assertThat(reservation.getReservationDate()).isEqualTo(futureDate);
        assertThat(reservation.getReservationTime()).isEqualTo(validTime);
        assertThat(reservation.getNumberOfGuests()).isEqualTo(4);
        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.PENDING);
    }

    @Test
    @DisplayName("Should create reservation with additional details")
    void testCreateReservationWithAdditionalDetails() throws ReservationException {
        Reservation reservation = reservationService.createReservation(
                "Jane Smith", "jane@example.com", "+1-555-0123",
                futureDate, validTime, 2, "Window table please");

        assertThat(reservation).isNotNull();
        assertThat(reservation.getCustomerPhone()).isEqualTo("+1-555-0123");
        assertThat(reservation.getSpecialRequests()).isEqualTo("Window table please");
    }

    @Test
    @DisplayName("Should generate unique reservation IDs")
    void testUniqueReservationIds() throws ReservationException {
        Reservation res1 = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);
        Reservation res2 = reservationService.createReservation(
                "Jane Smith", "jane@example.com", futureDate, validTime, 2);

        assertThat(res1.getId()).isNotEqualTo(res2.getId());
        assertThat(res1.getId()).startsWith("RES");
        assertThat(res2.getId()).startsWith("RES");
    }

    // ==================== VALIDATION TESTS ====================

    @Test
    @DisplayName("Should throw exception for null customer name")
    void testCreateReservationWithNullCustomerName() {
        assertThatThrownBy(() -> reservationService.createReservation(
                null, "john@example.com", futureDate, validTime, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Customer name is required");
    }

    @Test
    @DisplayName("Should throw exception for empty customer name")
    void testCreateReservationWithEmptyCustomerName() {
        assertThatThrownBy(() -> reservationService.createReservation(
                "   ", "john@example.com", futureDate, validTime, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Customer name is required");
    }

    @Test
    @DisplayName("Should throw exception for null customer email")
    void testCreateReservationWithNullCustomerEmail() {
        assertThatThrownBy(() -> reservationService.createReservation(
                "John Doe", null, futureDate, validTime, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Customer email is required");
    }

    @Test
    @DisplayName("Should throw exception for empty customer email")
    void testCreateReservationWithEmptyCustomerEmail() {
        assertThatThrownBy(() -> reservationService.createReservation(
                "John Doe", "   ", futureDate, validTime, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Customer email is required");
    }

    @ParameterizedTest
    @ValueSource(strings = {"invalid-email", "test@", "test.com", "a@b"})
    @DisplayName("Should throw exception for invalid email formats")
    void testCreateReservationWithInvalidEmail(String invalidEmail) {
        assertThatThrownBy(() -> reservationService.createReservation(
                "John Doe", invalidEmail, futureDate, validTime, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Invalid email format");
    }

    @Test
    @DisplayName("Should throw exception for null reservation date")
    void testCreateReservationWithNullDate() {
        assertThatThrownBy(() -> reservationService.createReservation(
                "John Doe", "john@example.com", null, validTime, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Reservation date is required");
    }

    @Test
    @DisplayName("Should throw exception for past reservation date")
    void testCreateReservationWithPastDate() {
        LocalDate pastDate = LocalDate.now().minusDays(1);
        assertThatThrownBy(() -> reservationService.createReservation(
                "John Doe", "john@example.com", pastDate, validTime, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Reservation date cannot be in the past");
    }

    @Test
    @DisplayName("Should throw exception for null reservation time")
    void testCreateReservationWithNullTime() {
        assertThatThrownBy(() -> reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, null, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Reservation time is required");
    }

    @ParameterizedTest
    @ValueSource(ints = {0, -1, -10})
    @DisplayName("Should throw exception for non-positive number of guests")
    void testCreateReservationWithInvalidGuestCount(int guests) {
        assertThatThrownBy(() -> reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, guests))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Number of guests must be positive");
    }

    @Test
    @DisplayName("Should throw exception for too many guests")
    void testCreateReservationWithTooManyGuests() {
        assertThatThrownBy(() -> reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 25))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Maximum 20 guests allowed");
    }

    // ==================== GET RESERVATION TESTS ====================

    @Test
    @DisplayName("Should retrieve existing reservation")
    void testGetExistingReservation() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);
        
        Reservation retrieved = reservationService.getReservation(created.getId());
        
        assertThat(retrieved).isEqualTo(created);
    }

    @Test
    @DisplayName("Should throw exception for non-existing reservation")
    void testGetNonExistingReservation() {
        assertThatThrownBy(() -> reservationService.getReservation("NON_EXISTING_ID"))
                .isInstanceOf(ReservationNotFoundException.class)
                .hasMessageContaining("Reservation not found with ID: NON_EXISTING_ID");
    }

    // ==================== UPDATE RESERVATION TESTS ====================

    @Test
    @DisplayName("Should update existing reservation")
    void testUpdateReservation() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        LocalDate newDate = futureDate.plusDays(1);
        LocalTime newTime = validTime.plusHours(1);
        
        Reservation updated = reservationService.updateReservation(
                created.getId(), "Jane Smith", "jane@example.com", newDate, newTime, 6);

        assertThat(updated.getId()).isEqualTo(created.getId());
        assertThat(updated.getCustomerName()).isEqualTo("Jane Smith");
        assertThat(updated.getCustomerEmail()).isEqualTo("jane@example.com");
        assertThat(updated.getReservationDate()).isEqualTo(newDate);
        assertThat(updated.getReservationTime()).isEqualTo(newTime);
        assertThat(updated.getNumberOfGuests()).isEqualTo(6);
    }

    @Test
    @DisplayName("Should throw exception when updating non-existing reservation")
    void testUpdateNonExistingReservation() {
        assertThatThrownBy(() -> reservationService.updateReservation(
                "NON_EXISTING_ID", "John Doe", "john@example.com", futureDate, validTime, 4))
                .isInstanceOf(ReservationNotFoundException.class);
    }

    @Test
    @DisplayName("Should validate data when updating reservation")
    void testUpdateReservationWithInvalidData() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        assertThatThrownBy(() -> reservationService.updateReservation(
                created.getId(), "", "john@example.com", futureDate, validTime, 4))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("Customer name is required");
    }

    // ==================== STATUS CHANGE TESTS ====================

    @Test
    @DisplayName("Should confirm reservation")
    void testConfirmReservation() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        reservationService.confirmReservation(created.getId());

        assertThat(created.getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
    }

    @Test
    @DisplayName("Should cancel reservation")
    void testCancelReservation() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        reservationService.cancelReservation(created.getId());

        assertThat(created.getStatus()).isEqualTo(ReservationStatus.CANCELLED);
    }

    @Test
    @DisplayName("Should complete reservation")
    void testCompleteReservation() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        reservationService.completeReservation(created.getId());

        assertThat(created.getStatus()).isEqualTo(ReservationStatus.COMPLETED);
    }

    @Test
    @DisplayName("Should mark reservation as no-show")
    void testMarkAsNoShow() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        reservationService.markAsNoShow(created.getId());

        assertThat(created.getStatus()).isEqualTo(ReservationStatus.NO_SHOW);
    }

    @Test
    @DisplayName("Should throw exception when confirming non-existing reservation")
    void testConfirmNonExistingReservation() {
        assertThatThrownBy(() -> reservationService.confirmReservation("NON_EXISTING_ID"))
                .isInstanceOf(ReservationNotFoundException.class);
    }

    @Test
    @DisplayName("Should throw exception when canceling non-existing reservation")
    void testCancelNonExistingReservation() {
        assertThatThrownBy(() -> reservationService.cancelReservation("NON_EXISTING_ID"))
                .isInstanceOf(ReservationNotFoundException.class);
    }

    @Test
    @DisplayName("Should throw exception when completing non-existing reservation")
    void testCompleteNonExistingReservation() {
        assertThatThrownBy(() -> reservationService.completeReservation("NON_EXISTING_ID"))
                .isInstanceOf(ReservationNotFoundException.class);
    }

    @Test
    @DisplayName("Should throw exception when marking non-existing reservation as no-show")
    void testMarkNonExistingReservationAsNoShow() {
        assertThatThrownBy(() -> reservationService.markAsNoShow("NON_EXISTING_ID"))
                .isInstanceOf(ReservationNotFoundException.class);
    }

    // ==================== DELETE RESERVATION TESTS ====================

    @Test
    @DisplayName("Should delete existing reservation")
    void testDeleteExistingReservation() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        boolean deleted = reservationService.deleteReservation(created.getId());

        assertThat(deleted).isTrue();
        assertThat(reservationService.reservationExists(created.getId())).isFalse();
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existing reservation")
    void testDeleteNonExistingReservation() {
        assertThatThrownBy(() -> reservationService.deleteReservation("NON_EXISTING_ID"))
                .isInstanceOf(ReservationNotFoundException.class);
    }

    // ==================== QUERY TESTS ====================

    @Test
    @DisplayName("Should get all reservations")
    void testGetAllReservations() throws ReservationException {
        reservationService.createReservation("John Doe", "john@example.com", futureDate, validTime, 4);
        reservationService.createReservation("Jane Smith", "jane@example.com", futureDate, validTime, 2);

        List<Reservation> all = reservationService.getAllReservations();

        assertThat(all).hasSize(2);
    }

    @Test
    @DisplayName("Should get reservations by status")
    void testGetReservationsByStatus() throws ReservationException {
        Reservation res1 = reservationService.createReservation("John Doe", "john@example.com", futureDate, validTime, 4);
        Reservation res2 = reservationService.createReservation("Jane Smith", "jane@example.com", futureDate, validTime, 2);
        
        reservationService.confirmReservation(res1.getId());

        List<Reservation> confirmed = reservationService.getReservationsByStatus(ReservationStatus.CONFIRMED);
        List<Reservation> pending = reservationService.getReservationsByStatus(ReservationStatus.PENDING);

        assertThat(confirmed).hasSize(1);
        assertThat(confirmed.get(0).getId()).isEqualTo(res1.getId());
        assertThat(pending).hasSize(1);
        assertThat(pending.get(0).getId()).isEqualTo(res2.getId());
    }

    @Test
    @DisplayName("Should get reservations by date")
    void testGetReservationsByDate() throws ReservationException {
        LocalDate date1 = futureDate;
        LocalDate date2 = futureDate.plusDays(1);

        reservationService.createReservation("John Doe", "john@example.com", date1, validTime, 4);
        reservationService.createReservation("Jane Smith", "jane@example.com", date2, validTime, 2);
        reservationService.createReservation("Bob Johnson", "bob@example.com", date1, validTime, 3);

        List<Reservation> date1Reservations = reservationService.getReservationsByDate(date1);
        List<Reservation> date2Reservations = reservationService.getReservationsByDate(date2);

        assertThat(date1Reservations).hasSize(2);
        assertThat(date2Reservations).hasSize(1);
    }

    @Test
    @DisplayName("Should get reservations by customer")
    void testGetReservationsByCustomer() throws ReservationException {
        String email1 = "john@example.com";
        String email2 = "jane@example.com";

        reservationService.createReservation("John Doe", email1, futureDate, validTime, 4);
        reservationService.createReservation("Jane Smith", email2, futureDate, validTime, 2);
        reservationService.createReservation("John Doe", email1, futureDate.plusDays(1), validTime, 3);

        List<Reservation> johnReservations = reservationService.getReservationsByCustomer(email1);
        List<Reservation> janeReservations = reservationService.getReservationsByCustomer(email2);

        assertThat(johnReservations).hasSize(2);
        assertThat(janeReservations).hasSize(1);
    }

    @Test
    @DisplayName("Should get total number of reservations")
    void testGetTotalReservations() throws ReservationException {
        assertThat(reservationService.getTotalReservations()).isEqualTo(0);

        reservationService.createReservation("John Doe", "john@example.com", futureDate, validTime, 4);
        assertThat(reservationService.getTotalReservations()).isEqualTo(1);

        reservationService.createReservation("Jane Smith", "jane@example.com", futureDate, validTime, 2);
        assertThat(reservationService.getTotalReservations()).isEqualTo(2);
    }

    @Test
    @DisplayName("Should check if reservation exists")
    void testReservationExists() throws ReservationException {
        Reservation created = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 4);

        assertThat(reservationService.reservationExists(created.getId())).isTrue();
        assertThat(reservationService.reservationExists("NON_EXISTING_ID")).isFalse();
    }

    @Test
    @DisplayName("Should clear all reservations")
    void testClearAllReservations() throws ReservationException {
        reservationService.createReservation("John Doe", "john@example.com", futureDate, validTime, 4);
        reservationService.createReservation("Jane Smith", "jane@example.com", futureDate, validTime, 2);

        assertThat(reservationService.getTotalReservations()).isEqualTo(2);

        reservationService.clearAllReservations();

        assertThat(reservationService.getTotalReservations()).isEqualTo(0);
        assertThat(reservationService.getAllReservations()).isEmpty();
    }

    // ==================== EDGE CASES AND BOUNDARY TESTS ====================

    @Test
    @DisplayName("Should handle maximum number of guests")
    void testMaximumNumberOfGuests() throws ReservationException {
        Reservation reservation = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 20);

        assertThat(reservation.getNumberOfGuests()).isEqualTo(20);
    }

    @Test
    @DisplayName("Should handle minimum number of guests")
    void testMinimumNumberOfGuests() throws ReservationException {
        Reservation reservation = reservationService.createReservation(
                "John Doe", "john@example.com", futureDate, validTime, 1);

        assertThat(reservation.getNumberOfGuests()).isEqualTo(1);
    }

    @Test
    @DisplayName("Should handle reservation for today")
    void testReservationForToday() throws ReservationException {
        LocalDate today = LocalDate.now();
        Reservation reservation = reservationService.createReservation(
                "John Doe", "john@example.com", today, validTime, 4);

        assertThat(reservation.getReservationDate()).isEqualTo(today);
    }

    @Test
    @DisplayName("Should handle empty special requests")
    void testEmptySpecialRequests() throws ReservationException {
        Reservation reservation = reservationService.createReservation(
                "John Doe", "john@example.com", "+1-555-0123",
                futureDate, validTime, 4, "");

        assertThat(reservation.getSpecialRequests()).isEmpty();
    }

    @Test
    @DisplayName("Should handle null special requests")
    void testNullSpecialRequests() throws ReservationException {
        Reservation reservation = reservationService.createReservation(
                "John Doe", "john@example.com", "+1-555-0123",
                futureDate, validTime, 4, null);

        assertThat(reservation.getSpecialRequests()).isNull();
    }
}