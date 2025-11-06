package com.reservation.service;

import com.reservation.model.Reservation;
import com.reservation.model.ReservationStatus;
import com.reservation.exception.ReservationException;
import com.reservation.exception.ReservationNotFoundException;
import com.reservation.exception.InvalidReservationException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service class for managing reservations
 */
public class ReservationService {
    private final Map<String, Reservation> reservations;
    private final Random random;

    public ReservationService() {
        this.reservations = new ConcurrentHashMap<>();
        this.random = new Random();
    }

    /**
     * Creates a new reservation
     */
    public Reservation createReservation(String customerName, String customerEmail, 
                                       LocalDate reservationDate, LocalTime reservationTime, 
                                       int numberOfGuests) throws ReservationException {
        validateReservationData(customerName, customerEmail, reservationDate, reservationTime, numberOfGuests);
        
        String id = generateReservationId();
        Reservation reservation = new Reservation(id, customerName, customerEmail, 
                                                reservationDate, reservationTime, numberOfGuests);
        
        reservations.put(id, reservation);
        return reservation;
    }

    /**
     * Creates a reservation with additional details
     */
    public Reservation createReservation(String customerName, String customerEmail, String customerPhone,
                                       LocalDate reservationDate, LocalTime reservationTime, 
                                       int numberOfGuests, String specialRequests) throws ReservationException {
        Reservation reservation = createReservation(customerName, customerEmail, reservationDate, 
                                                  reservationTime, numberOfGuests);
        reservation.setCustomerPhone(customerPhone);
        reservation.setSpecialRequests(specialRequests);
        return reservation;
    }

    /**
     * Retrieves a reservation by ID
     */
    public Reservation getReservation(String id) throws ReservationNotFoundException {
        Reservation reservation = reservations.get(id);
        if (reservation == null) {
            throw new ReservationNotFoundException(id);
        }
        return reservation;
    }

    /**
     * Updates an existing reservation
     */
    public Reservation updateReservation(String id, String customerName, String customerEmail,
                                       LocalDate reservationDate, LocalTime reservationTime,
                                       int numberOfGuests) throws ReservationException {
        Reservation reservation = getReservation(id);
        validateReservationData(customerName, customerEmail, reservationDate, reservationTime, numberOfGuests);
        
        reservation.setCustomerName(customerName);
        reservation.setCustomerEmail(customerEmail);
        reservation.setReservationDate(reservationDate);
        reservation.setReservationTime(reservationTime);
        reservation.setNumberOfGuests(numberOfGuests);
        
        return reservation;
    }

    /**
     * Confirms a reservation
     */
    public void confirmReservation(String id) throws ReservationNotFoundException {
        Reservation reservation = getReservation(id);
        reservation.setStatus(ReservationStatus.CONFIRMED);
    }

    /**
     * Cancels a reservation
     */
    public void cancelReservation(String id) throws ReservationNotFoundException {
        Reservation reservation = getReservation(id);
        reservation.setStatus(ReservationStatus.CANCELLED);
    }

    /**
     * Marks a reservation as completed
     */
    public void completeReservation(String id) throws ReservationNotFoundException {
        Reservation reservation = getReservation(id);
        reservation.setStatus(ReservationStatus.COMPLETED);
    }

    /**
     * Marks a reservation as no-show
     */
    public void markAsNoShow(String id) throws ReservationNotFoundException {
        Reservation reservation = getReservation(id);
        reservation.setStatus(ReservationStatus.NO_SHOW);
    }

    /**
     * Deletes a reservation
     */
    public boolean deleteReservation(String id) throws ReservationNotFoundException {
        if (!reservations.containsKey(id)) {
            throw new ReservationNotFoundException(id);
        }
        return reservations.remove(id) != null;
    }

    /**
     * Gets all reservations
     */
    public List<Reservation> getAllReservations() {
        return new ArrayList<>(reservations.values());
    }

    /**
     * Gets reservations by status
     */
    public List<Reservation> getReservationsByStatus(ReservationStatus status) {
        return reservations.values().stream()
                .filter(r -> r.getStatus() == status)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    /**
     * Gets reservations for a specific date
     */
    public List<Reservation> getReservationsByDate(LocalDate date) {
        return reservations.values().stream()
                .filter(r -> r.getReservationDate().equals(date))
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    /**
     * Gets reservations for a customer
     */
    public List<Reservation> getReservationsByCustomer(String customerEmail) {
        return reservations.values().stream()
                .filter(r -> r.getCustomerEmail().equals(customerEmail))
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    /**
     * Gets the total number of reservations
     */
    public int getTotalReservations() {
        return reservations.size();
    }

    /**
     * Checks if a reservation exists
     */
    public boolean reservationExists(String id) {
        return reservations.containsKey(id);
    }

    /**
     * Clears all reservations (for testing purposes)
     */
    public void clearAllReservations() {
        reservations.clear();
    }

    private void validateReservationData(String customerName, String customerEmail, 
                                       LocalDate reservationDate, LocalTime reservationTime,
                                       int numberOfGuests) throws InvalidReservationException {
        if (customerName == null || customerName.trim().isEmpty()) {
            throw new InvalidReservationException("Customer name is required");
        }
        
        if (customerEmail == null || customerEmail.trim().isEmpty()) {
            throw new InvalidReservationException("Customer email is required");
        }
        
        if (!isValidEmail(customerEmail)) {
            throw new InvalidReservationException("Invalid email format");
        }
        
        if (reservationDate == null) {
            throw new InvalidReservationException("Reservation date is required");
        }
        
        if (reservationDate.isBefore(LocalDate.now())) {
            throw new InvalidReservationException("Reservation date cannot be in the past");
        }
        
        if (reservationTime == null) {
            throw new InvalidReservationException("Reservation time is required");
        }
        
        if (numberOfGuests <= 0) {
            throw new InvalidReservationException("Number of guests must be positive");
        }
        
        if (numberOfGuests > 20) {
            throw new InvalidReservationException("Maximum 20 guests allowed per reservation");
        }
    }

    private boolean isValidEmail(String email) {
        return email.contains("@") && email.contains(".") && email.length() > 5;
    }

    private String generateReservationId() {
        String prefix = "RES";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String randomSuffix = String.format("%04d", random.nextInt(10000));
        return prefix + timestamp + randomSuffix;
    }
}