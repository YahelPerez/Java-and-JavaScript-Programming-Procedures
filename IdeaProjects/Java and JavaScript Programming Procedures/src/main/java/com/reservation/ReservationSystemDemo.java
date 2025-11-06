package com.reservation;

import com.reservation.model.Reservation;
import com.reservation.model.ReservationStatus;
import com.reservation.service.ReservationService;
import com.reservation.exception.ReservationException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Demo application showing reservation system functionality
 */
public class ReservationSystemDemo {
    
    public static void main(String[] args) {
        ReservationService service = new ReservationService();
        
        System.out.println("=== Reservation System Demo ===\n");
        
        try {
            // Create some sample reservations
            System.out.println("Creating sample reservations...");
            
            Reservation res1 = service.createReservation(
                "John Doe", "john@example.com", "+1-555-0101",
                LocalDate.now().plusDays(1), LocalTime.of(19, 30), 
                4, "Window table preferred"
            );
            System.out.println("✓ Created: " + res1.getId() + " for " + res1.getCustomerName());
            
            Reservation res2 = service.createReservation(
                "Jane Smith", "jane@example.com", "+1-555-0102",
                LocalDate.now().plusDays(2), LocalTime.of(20, 0), 
                2, "Anniversary dinner"
            );
            System.out.println("✓ Created: " + res2.getId() + " for " + res2.getCustomerName());
            
            Reservation res3 = service.createReservation(
                "Bob Johnson", "bob@example.com",
                LocalDate.now().plusDays(1), LocalTime.of(18, 0), 6
            );
            System.out.println("✓ Created: " + res3.getId() + " for " + res3.getCustomerName());
            
            // Confirm first reservation
            service.confirmReservation(res1.getId());
            System.out.println("✓ Confirmed reservation: " + res1.getId());
            
            // Cancel second reservation
            service.cancelReservation(res2.getId());
            System.out.println("✓ Cancelled reservation: " + res2.getId());
            
            System.out.println("\n=== Reservation Summary ===");
            System.out.println("Total reservations: " + service.getTotalReservations());
            
            // Show reservations by status
            List<Reservation> confirmed = service.getReservationsByStatus(ReservationStatus.CONFIRMED);
            System.out.println("Confirmed reservations: " + confirmed.size());
            
            List<Reservation> pending = service.getReservationsByStatus(ReservationStatus.PENDING);
            System.out.println("Pending reservations: " + pending.size());
            
            List<Reservation> cancelled = service.getReservationsByStatus(ReservationStatus.CANCELLED);
            System.out.println("Cancelled reservations: " + cancelled.size());
            
            // Show reservations for tomorrow
            LocalDate tomorrow = LocalDate.now().plusDays(1);
            List<Reservation> tomorrowReservations = service.getReservationsByDate(tomorrow);
            System.out.println("\nReservations for " + tomorrow + ": " + tomorrowReservations.size());
            for (Reservation res : tomorrowReservations) {
                System.out.println("  - " + res.getCustomerName() + " at " + res.getReservationTime() + 
                                 " (" + res.getStatus() + ")");
            }
            
            System.out.println("\n=== Demo completed successfully! ===");
            
        } catch (ReservationException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}