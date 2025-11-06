package com.reservation.model;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for the ReservationStatus enum
 */
class ReservationStatusTest {

    @Test
    void testEnumValues() {
        ReservationStatus[] values = ReservationStatus.values();
        assertThat(values).hasSize(5);
        assertThat(values).containsExactly(
                ReservationStatus.PENDING,
                ReservationStatus.CONFIRMED,
                ReservationStatus.CANCELLED,
                ReservationStatus.COMPLETED,
                ReservationStatus.NO_SHOW
        );
    }

    @Test
    void testDisplayNames() {
        assertThat(ReservationStatus.PENDING.getDisplayName()).isEqualTo("Pending");
        assertThat(ReservationStatus.CONFIRMED.getDisplayName()).isEqualTo("Confirmed");
        assertThat(ReservationStatus.CANCELLED.getDisplayName()).isEqualTo("Cancelled");
        assertThat(ReservationStatus.COMPLETED.getDisplayName()).isEqualTo("Completed");
        assertThat(ReservationStatus.NO_SHOW.getDisplayName()).isEqualTo("No Show");
    }

    @Test
    void testToString() {
        assertThat(ReservationStatus.PENDING.toString()).isEqualTo("Pending");
        assertThat(ReservationStatus.CONFIRMED.toString()).isEqualTo("Confirmed");
        assertThat(ReservationStatus.CANCELLED.toString()).isEqualTo("Cancelled");
        assertThat(ReservationStatus.COMPLETED.toString()).isEqualTo("Completed");
        assertThat(ReservationStatus.NO_SHOW.toString()).isEqualTo("No Show");
    }

    @Test
    void testValueOf() {
        assertThat(ReservationStatus.valueOf("PENDING")).isEqualTo(ReservationStatus.PENDING);
        assertThat(ReservationStatus.valueOf("CONFIRMED")).isEqualTo(ReservationStatus.CONFIRMED);
        assertThat(ReservationStatus.valueOf("CANCELLED")).isEqualTo(ReservationStatus.CANCELLED);
        assertThat(ReservationStatus.valueOf("COMPLETED")).isEqualTo(ReservationStatus.COMPLETED);
        assertThat(ReservationStatus.valueOf("NO_SHOW")).isEqualTo(ReservationStatus.NO_SHOW);
    }

    @Test
    void testValueOfInvalidValue() {
        assertThatThrownBy(() -> ReservationStatus.valueOf("INVALID"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}