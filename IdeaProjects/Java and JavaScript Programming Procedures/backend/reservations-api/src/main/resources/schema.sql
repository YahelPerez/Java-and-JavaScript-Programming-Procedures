-- Schema for H2 Database
CREATE TABLE IF NOT EXISTS city (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS reservation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    reservation_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('CONFIRMED', 'PENDING', 'CANCELLED')),
    city_id BIGINT NOT NULL,
    number_of_guests INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city(id)
);