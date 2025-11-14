-- =====================================================
-- Sample Data for Reservation & Graph System (MariaDB Compatible)
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

-- Direct insert approach for MariaDB compatibility
INSERT INTO distances (city1_id, city2_id, distance) VALUES
((SELECT id FROM cities WHERE name = 'Mexico City'), (SELECT id FROM cities WHERE name = 'Guadalajara'), 500.00),
((SELECT id FROM cities WHERE name = 'Mexico City'), (SELECT id FROM cities WHERE name = 'Monterrey'), 900.00),
((SELECT id FROM cities WHERE name = 'Mexico City'), (SELECT id FROM cities WHERE name = 'Cancun'), 1600.00),
((SELECT id FROM cities WHERE name = 'Mexico City'), (SELECT id FROM cities WHERE name = 'Puebla'), 130.00),
((SELECT id FROM cities WHERE name = 'Guadalajara'), (SELECT id FROM cities WHERE name = 'Monterrey'), 700.00),
((SELECT id FROM cities WHERE name = 'Monterrey'), (SELECT id FROM cities WHERE name = 'Tijuana'), 1200.00),
((SELECT id FROM cities WHERE name = 'Cancun'), (SELECT id FROM cities WHERE name = 'Merida'), 320.00),
((SELECT id FROM cities WHERE name = 'Puebla'), (SELECT id FROM cities WHERE name = 'Oaxaca'), 350.00),
((SELECT id FROM cities WHERE name = 'Guadalajara'), (SELECT id FROM cities WHERE name = 'San Luis Potosi'), 280.00),
((SELECT id FROM cities WHERE name = 'Veracruz'), (SELECT id FROM cities WHERE name = 'Mexico City'), 400.00),
((SELECT id FROM cities WHERE name = 'Oaxaca'), (SELECT id FROM cities WHERE name = 'Mexico City'), 550.00),
((SELECT id FROM cities WHERE name = 'Merida'), (SELECT id FROM cities WHERE name = 'Mexico City'), 1250.00);

-- =====================================================
-- SAMPLE RESERVATIONS (based on Sprint 1 examples)
-- =====================================================

INSERT INTO reservations (
    id, customer_name, customer_email, customer_phone, 
    reservation_date, reservation_time, party_size, 
    status, special_requests
) VALUES
-- Today and future reservations
('RSV-001', 'Juan Perez', 'juan.perez@email.com', '+52-555-1234', 
 '2025-11-12', '19:30:00', 4, 'CONFIRMED', 'Mesa cerca de la ventana'),

('RSV-002', 'Maria Garcia', 'maria.garcia@email.com', '+52-555-5678', 
 '2025-11-12', '20:00:00', 2, 'PENDING', 'Vegetariano'),

('RSV-003', 'Carlos Lopez', 'carlos.lopez@email.com', '+52-555-9876', 
 '2025-11-13', '18:45:00', 6, 'CONFIRMED', 'Celebracion de cumpleanos'),

('RSV-004', 'Ana Martinez', 'ana.martinez@email.com', '+52-555-4321', 
 '2025-11-13', '19:15:00', 3, 'PENDING', NULL),

('RSV-005', 'Roberto Sanchez', 'roberto.sanchez@email.com', '+52-555-8765', 
 '2025-11-14', '20:30:00', 8, 'CONFIRMED', 'Cena de empresa'),

('RSV-006', 'Elena Torres', 'elena.torres@email.com', '+52-555-2468', 
 '2025-11-15', '19:00:00', 2, 'PENDING', 'Aniversario'),

('RSV-007', 'Fernando Ruiz', 'fernando.ruiz@email.com', '+52-555-1357', 
 '2025-11-16', '18:30:00', 5, 'CONFIRMED', NULL),

-- Past reservations for testing
('RSV-008', 'Sofia Morales', 'sofia.morales@email.com', '+52-555-9753', 
 '2025-11-08', '19:45:00', 4, 'COMPLETED', 'Todo perfecto'),

('RSV-009', 'Diego Herrera', 'diego.herrera@email.com', '+52-555-8642', 
 '2025-11-09', '20:15:00', 3, 'NO_SHOW', 'No se presento'),

('RSV-010', 'Carmen Jimenez', 'carmen.jimenez@email.com', '+52-555-7531', 
 '2025-11-10', '18:00:00', 7, 'CANCELLED', 'Cambio de planes'),

-- Future reservations for different scenarios
('RSV-011', 'Luis Vargas', 'luis.vargas@email.com', '+52-555-6420', 
 '2025-11-17', '19:30:00', 2, 'CONFIRMED', 'Cita romantica'),

('RSV-012', 'Patricia Mendoza', 'patricia.mendoza@email.com', '+52-555-5309', 
 '2025-11-18', '20:45:00', 4, 'PENDING', 'Sin gluten'),

('RSV-013', 'Ricardo Castro', 'ricardo.castro@email.com', '+52-555-4198', 
 '2025-11-19', '18:15:00', 6, 'CONFIRMED', 'Reunion familiar'),

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
SELECT 'Cities with their connection count' as info;
SELECT c.name, COUNT(d.id) as connections 
FROM cities c 
LEFT JOIN distances d ON c.id = d.city1_id OR c.id = d.city2_id 
GROUP BY c.id, c.name 
ORDER BY connections DESC;

SELECT 'Upcoming reservations' as info;
SELECT 
    id, customer_name, reservation_date, reservation_time, 
    party_size, status 
FROM reservations 
WHERE reservation_date >= CURDATE() 
ORDER BY reservation_date, reservation_time 
LIMIT 5;

SELECT 'Database setup completed successfully!' as status;