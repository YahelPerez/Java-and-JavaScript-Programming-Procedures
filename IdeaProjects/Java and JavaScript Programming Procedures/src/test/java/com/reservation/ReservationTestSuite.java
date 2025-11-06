package com.reservation;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

/**
 * Test suite for all reservation module tests
 */
@Suite
@SuiteDisplayName("Reservation System Test Suite")
@SelectPackages({
    "com.reservation.model",
    "com.reservation.service", 
    "com.reservation.exception"
})
public class ReservationTestSuite {
    // This class remains empty. It is used only as a holder for the above annotations.
}