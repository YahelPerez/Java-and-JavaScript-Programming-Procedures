-- Insert sample cities (matching the graph API data)
INSERT INTO city (id, name, description) VALUES 
(1, 'Ciudad de México', 'Capital de México'),
(2, 'Guadalajara', 'Perla Tapatía'),
(3, 'Monterrey', 'Sultana del Norte'),
(4, 'Puebla', 'Ciudad de los Ángeles'),
(5, 'Tijuana', 'Ciudad Fronteriza'),
(6, 'Cancún', 'Paraíso Turístico'),
(7, 'Mérida', 'Ciudad Blanca'),
(8, 'Querétaro', 'Ciudad Colonial'),
(9, 'Toluca', 'Ciudad de los Volcanes'),
(10, 'León', 'Capital del Calzado');

-- Insert sample reservations
INSERT INTO reservation (customer_name, reservation_date, status, city_id, number_of_guests) VALUES
('Juan Pérez', '2025-12-15', 'CONFIRMED', 1, 4),
('María González', '2025-12-20', 'PENDING', 2, 2),
('Carlos Rodríguez', '2025-12-25', 'CONFIRMED', 3, 6),
('Ana Martínez', '2025-11-30', 'CANCELLED', 4, 3),
('Luis Hernández', '2025-12-10', 'CONFIRMED', 5, 8);