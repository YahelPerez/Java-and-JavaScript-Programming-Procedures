-- =====================================================
-- Reservation & Graph System Database Schema
-- Project: Java and JavaScript Programming Procedures
-- Author: YahelPerez
-- Date: November 11, 2025
-- =====================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS reservation_graph_system;
USE reservation_graph_system;

-- Set character set and collation
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: reservations (Sprint 1 - Java System)
-- =====================================================
CREATE TABLE reservations (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NULL,
    customer_phone VARCHAR(20) NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INT NOT NULL CHECK (party_size > 0),
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW') 
           DEFAULT 'PENDING' NOT NULL,
    special_requests TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_reservation_date (reservation_date),
    INDEX idx_customer_email (customer_email),
    INDEX idx_status (status),
    INDEX idx_datetime (reservation_date, reservation_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: cities (Sprint 2 - Graph System)
-- =====================================================
CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_city_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: distances (Sprint 2 - Graph Connections)
-- =====================================================
CREATE TABLE distances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city1_id INT NOT NULL,
    city2_id INT NOT NULL,
    distance DECIMAL(8,2) NOT NULL CHECK (distance > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (city1_id) REFERENCES cities(id) ON DELETE CASCADE,
    FOREIGN KEY (city2_id) REFERENCES cities(id) ON DELETE CASCADE,
    
    -- Ensure no self-loops and unique routes (bidirectional)
    CHECK (city1_id != city2_id),
    UNIQUE KEY unique_route (LEAST(city1_id, city2_id), GREATEST(city1_id, city2_id)),
    
    -- Indexes for performance
    INDEX idx_city1 (city1_id),
    INDEX idx_city2 (city2_id),
    INDEX idx_distance (distance)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VIEWS for easier querying
-- =====================================================

-- View for reservation summary
CREATE VIEW reservation_summary AS
SELECT 
    DATE(reservation_date) as date,
    status,
    COUNT(*) as count,
    SUM(party_size) as total_guests
FROM reservations 
GROUP BY DATE(reservation_date), status;

-- View for city connections (bidirectional)
CREATE VIEW city_connections AS
SELECT 
    c1.name as city1,
    c2.name as city2,
    d.distance,
    d.created_at
FROM distances d
JOIN cities c1 ON d.city1_id = c1.id
JOIN cities c2 ON d.city2_id = c2.id
ORDER BY d.distance;

-- View for city statistics
CREATE VIEW city_stats AS
SELECT 
    c.id,
    c.name,
    COUNT(DISTINCT CASE WHEN d.city1_id = c.id THEN d.city2_id 
                       WHEN d.city2_id = c.id THEN d.city1_id END) as connections_count,
    AVG(d.distance) as avg_distance
FROM cities c
LEFT JOIN distances d ON c.id = d.city1_id OR c.id = d.city2_id
GROUP BY c.id, c.name;

-- =====================================================
-- STORED PROCEDURES for business logic
-- =====================================================

DELIMITER //

-- Procedure to add bidirectional distance
CREATE PROCEDURE AddBidirectionalDistance(
    IN p_city1_name VARCHAR(100),
    IN p_city2_name VARCHAR(100),
    IN p_distance DECIMAL(8,2)
)
BEGIN
    DECLARE v_city1_id INT;
    DECLARE v_city2_id INT;
    DECLARE v_min_id INT;
    DECLARE v_max_id INT;
    
    -- Get city IDs
    SELECT id INTO v_city1_id FROM cities WHERE name = p_city1_name;
    SELECT id INTO v_city2_id FROM cities WHERE name = p_city2_name;
    
    -- Check if cities exist
    IF v_city1_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'City1 not found';
    END IF;
    
    IF v_city2_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'City2 not found';
    END IF;
    
    -- Ensure consistent ordering for bidirectional storage
    SET v_min_id = LEAST(v_city1_id, v_city2_id);
    SET v_max_id = GREATEST(v_city1_id, v_city2_id);
    
    -- Insert distance
    INSERT INTO distances (city1_id, city2_id, distance) 
    VALUES (v_min_id, v_max_id, p_distance);
END//

-- Procedure to get nearby cities
CREATE PROCEDURE GetNearbyCities(
    IN p_city_name VARCHAR(100),
    IN p_max_distance DECIMAL(8,2)
)
BEGIN
    SELECT 
        c.name as nearby_city,
        d.distance
    FROM cities base_city
    JOIN distances d ON (
        (base_city.id = d.city1_id AND c.id = d.city2_id) OR
        (base_city.id = d.city2_id AND c.id = d.city1_id)
    )
    JOIN cities c ON (
        (d.city1_id = c.id AND d.city2_id = base_city.id) OR
        (d.city2_id = c.id AND d.city1_id = base_city.id)
    )
    WHERE base_city.name = p_city_name 
    AND d.distance <= p_max_distance
    ORDER BY d.distance ASC;
END//

DELIMITER ;

-- =====================================================
-- DATABASE USER AND PERMISSIONS
-- =====================================================

-- Create application user (adjust password as needed)
CREATE USER IF NOT EXISTS 'reservation_app'@'localhost' IDENTIFIED BY 'SecurePass123!';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON reservation_graph_system.* TO 'reservation_app'@'localhost';
GRANT EXECUTE ON reservation_graph_system.* TO 'reservation_app'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Enable query cache (if available)
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 268435456; -- 256MB

-- Optimize InnoDB settings
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB (adjust based on available RAM)

SHOW TABLES;
DESCRIBE reservations;
DESCRIBE cities;
DESCRIBE distances;