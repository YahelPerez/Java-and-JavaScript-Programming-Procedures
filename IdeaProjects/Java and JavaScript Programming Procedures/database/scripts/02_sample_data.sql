-- =====================================================
-- Sample Data for Reservation & Graph System
-- Project: Java and JavaScript Programming Procedures
-- Author: YahelPerez
-- Date: November 11, 2025
-- =====================================================

USE reservation_graph_system;

-- =====================================================
-- SAMPLE CITIES (based on Sprint 2 Graph examples)
-- =====================================================

INSERT INTO cities (name) VALUES
('Mexico City'),
('Guadalajara'),
('Monterrey'),
('Cancun'),
('Tijuana'),
('Puebla'),
('Merida'),
('Oaxaca'),
('San Luis Potosi'),
('Veracruz');

-- =====================================================
-- SAMPLE DISTANCES (matching Sprint 2 test data)
-- =====================================================

-- Using the stored procedure for consistent bidirectional storage
CALL AddBidirectionalDistance('Mexico City', 'Guadalajara', 500.00);
CALL AddBidirectionalDistance('Mexico City', 'Monterrey', 900.00);
CALL AddBidirectionalDistance('Mexico City', 'Cancun', 1600.00);
CALL AddBidirectionalDistance('Mexico City', 'Puebla', 130.00);
CALL AddBidirectionalDistance('Guadalajara', 'Monterrey', 700.00);
CALL AddBidirectionalDistance('Monterrey', 'Tijuana', 1200.00);
CALL AddBidirectionalDistance('Cancun', 'Merida', 320.00);
CALL AddBidirectionalDistance('Puebla', 'Oaxaca', 350.00);
CALL AddBidirectionalDistance('Guadalajara', 'San Luis Potosi', 280.00);
CALL AddBidirectionalDistance('Veracruz', 'Mexico City', 400.00);
CALL AddBidirectionalDistance('Oaxaca', 'Mexico City', 550.00);
CALL AddBidirectionalDistance('Merida', 'Mexico City', 1250.00);

-- =====================================================
-- SAMPLE RESERVATIONS (based on Sprint 1 examples)
-- =====================================================

INSERT INTO reservations (
    id, customer_name, customer_email, customer_phone, 
    reservation_date, reservation_time, party_size, 
    status, special_requests
) VALUES
-- Today and future reservations
('RSV-001', 'Juan Pérez', 'juan.perez@email.com', '+52-555-1234', 
 '2025-11-12', '19:30:00', 4, 'CONFIRMED', 'Mesa cerca de la ventana'),

('RSV-002', 'María García', 'maria.garcia@email.com', '+52-555-5678', 
 '2025-11-12', '20:00:00', 2, 'PENDING', 'Vegetariano'),

('RSV-003', 'Carlos López', 'carlos.lopez@email.com', '+52-555-9876', 
 '2025-11-13', '18:45:00', 6, 'CONFIRMED', 'Celebración de cumpleaños'),

('RSV-004', 'Ana Martínez', 'ana.martinez@email.com', '+52-555-4321', 
 '2025-11-13', '19:15:00', 3, 'PENDING', NULL),

('RSV-005', 'Roberto Sánchez', 'roberto.sanchez@email.com', '+52-555-8765', 
 '2025-11-14', '20:30:00', 8, 'CONFIRMED', 'Cena de empresa'),

('RSV-006', 'Elena Torres', 'elena.torres@email.com', '+52-555-2468', 
 '2025-11-15', '19:00:00', 2, 'PENDING', 'Aniversario'),

('RSV-007', 'Fernando Ruiz', 'fernando.ruiz@email.com', '+52-555-1357', 
 '2025-11-16', '18:30:00', 5, 'CONFIRMED', NULL),

-- Past reservations for testing
('RSV-008', 'Sofia Morales', 'sofia.morales@email.com', '+52-555-9753', 
 '2025-11-08', '19:45:00', 4, 'COMPLETED', 'Todo perfecto'),

('RSV-009', 'Diego Herrera', 'diego.herrera@email.com', '+52-555-8642', 
 '2025-11-09', '20:15:00', 3, 'NO_SHOW', 'No se presentó'),

('RSV-010', 'Carmen Jiménez', 'carmen.jimenez@email.com', '+52-555-7531', 
 '2025-11-10', '18:00:00', 7, 'CANCELLED', 'Cambio de planes'),

-- Future reservations for different scenarios
('RSV-011', 'Luis Vargas', 'luis.vargas@email.com', '+52-555-6420', 
 '2025-11-17', '19:30:00', 2, 'CONFIRMED', 'Cita romántica'),

('RSV-012', 'Patricia Mendoza', 'patricia.mendoza@email.com', '+52-555-5309', 
 '2025-11-18', '20:45:00', 4, 'PENDING', 'Sin gluten'),

('RSV-013', 'Ricardo Castro', 'ricardo.castro@email.com', '+52-555-4198', 
 '2025-11-19', '18:15:00', 6, 'CONFIRMED', 'Reunión familiar'),

('RSV-014', 'Gabriela Ramos', 'gabriela.ramos@email.com', '+52-555-3087', 
 '2025-11-20', '19:45:00', 3, 'PENDING', NULL),

('RSV-015', 'Miguel Flores', 'miguel.flores@email.com', '+52-555-1976', 
 '2025-11-21', '20:00:00', 5, 'CONFIRMED', 'Comida de negocios');

-- =====================================================
-- VERIFY DATA INSERTION
-- =====================================================

-- Check cities count
SELECT COUNT(*) as total_cities FROM cities;

-- Check distances count
SELECT COUNT(*) as total_distances FROM distances;

-- Check reservations count by status
SELECT status, COUNT(*) as count FROM reservations GROUP BY status;

-- Show some sample queries
SELECT 'Sample: Cities with connections' as query_type;
SELECT * FROM city_stats ORDER BY connections_count DESC LIMIT 5;

SELECT 'Sample: Upcoming reservations' as query_type;
SELECT 
    id, customer_name, reservation_date, reservation_time, 
    party_size, status 
FROM reservations 
WHERE reservation_date >= CURDATE() 
ORDER BY reservation_date, reservation_time 
LIMIT 5;

SELECT 'Sample: Cities near Mexico City (within 600km)' as query_type;
CALL GetNearbyCities('Mexico City', 600);

-- =====================================================
-- PERFORMANCE TEST QUERIES
-- =====================================================

-- Test reservation queries
EXPLAIN SELECT * FROM reservations WHERE reservation_date = '2025-11-12';
EXPLAIN SELECT * FROM reservations WHERE customer_email = 'juan.perez@email.com';
EXPLAIN SELECT * FROM reservations WHERE status = 'CONFIRMED';

-- Test graph queries  
EXPLAIN SELECT * FROM city_connections WHERE city1 = 'Mexico City';
EXPLAIN SELECT * FROM distances WHERE distance <= 500;

-- Show execution time for complex query
SELECT 
    r.reservation_date,
    COUNT(*) as reservations_count,
    SUM(r.party_size) as total_guests,
    AVG(r.party_size) as avg_party_size
FROM reservations r 
WHERE r.status IN ('CONFIRMED', 'PENDING')
GROUP BY r.reservation_date
ORDER BY r.reservation_date;

SELECT 'Database setup completed successfully!' as status;