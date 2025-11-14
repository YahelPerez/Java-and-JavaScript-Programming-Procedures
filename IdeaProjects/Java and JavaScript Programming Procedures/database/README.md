# 🗄️ Database Documentation

## Overview

This database schema supports the **Reservation Graph System** project, integrating both Sprint 1 (Java Reservations) and Sprint 2 (JavaScript Graph) modules into a unified data layer.

## Database Structure

### 📊 **Tables**

#### `reservations`
Stores reservation data from Sprint 1 Java system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Unique reservation identifier |
| `customer_name` | VARCHAR(100) | NOT NULL | Customer full name |
| `customer_email` | VARCHAR(100) | NULL | Customer email address |
| `customer_phone` | VARCHAR(20) | NULL | Customer phone number |
| `reservation_date` | DATE | NOT NULL | Date of reservation |
| `reservation_time` | TIME | NOT NULL | Time of reservation |
| `party_size` | INT | NOT NULL, CHECK > 0 | Number of guests |
| `status` | ENUM | NOT NULL, DEFAULT 'PENDING' | Reservation status |
| `special_requests` | TEXT | NULL | Special requests or notes |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | AUTO UPDATE | Record modification time |

**Status Values:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`

#### `cities`
Stores city data from Sprint 2 Graph system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY | Unique city identifier |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | City name |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | AUTO UPDATE | Record modification time |

#### `distances`
Stores distances between cities (bidirectional edges).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY | Unique distance record ID |
| `city1_id` | INT | NOT NULL, FOREIGN KEY | First city ID |
| `city2_id` | INT | NOT NULL, FOREIGN KEY | Second city ID |
| `distance` | DECIMAL(8,2) | NOT NULL, CHECK > 0 | Distance in kilometers |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | AUTO UPDATE | Record modification time |

**Constraints:**
- Foreign keys to `cities` table with CASCADE DELETE
- Check constraint: `city1_id != city2_id` (no self-loops)
- Unique constraint on `(LEAST(city1_id, city2_id), GREATEST(city1_id, city2_id))` (bidirectional uniqueness)

### 📈 **Views**

#### `reservation_summary`
Aggregated reservation data by date and status.
```sql
SELECT DATE(reservation_date) as date, status, COUNT(*) as count, SUM(party_size) as total_guests
FROM reservations GROUP BY DATE(reservation_date), status;
```

#### `city_connections`
Human-readable city connections with names instead of IDs.
```sql
SELECT c1.name as city1, c2.name as city2, d.distance, d.created_at
FROM distances d JOIN cities c1 ON d.city1_id = c1.id JOIN cities c2 ON d.city2_id = c2.id;
```

#### `city_stats`
Statistics for each city including connection count and average distance.
```sql
SELECT c.id, c.name, COUNT(DISTINCT connections) as connections_count, AVG(d.distance) as avg_distance
FROM cities c LEFT JOIN distances d ON ... GROUP BY c.id, c.name;
```

### 🔧 **Stored Procedures**

#### `AddBidirectionalDistance(city1_name, city2_name, distance)`
Safely adds a bidirectional distance between two cities with validation.

#### `GetNearbyCities(city_name, max_distance)`
Returns all cities within a specified distance from a given city, sorted by distance.

## 🔐 **Security**

### Database User
- **Username:** `reservation_app`
- **Password:** `SecurePass123!` (change in production)
- **Permissions:** SELECT, INSERT, UPDATE, DELETE, EXECUTE
- **Scope:** `reservation_graph_system` database only

### Best Practices
- Use prepared statements in applications
- Validate input data before database operations
- Implement connection pooling
- Regular backups recommended

## 📊 **Sample Data**

### Cities (10 Mexican cities)
- Mexico City, Guadalajara, Monterrey, Cancun, Tijuana
- Puebla, Merida, Oaxaca, San Luis Potosi, Veracruz

### Distances (12 bidirectional routes)
Examples:
- Mexico City ↔ Guadalajara: 500 km
- Mexico City ↔ Monterrey: 900 km
- Mexico City ↔ Puebla: 130 km

### Reservations (15 sample reservations)
- Mix of different statuses: PENDING, CONFIRMED, COMPLETED, NO_SHOW, CANCELLED
- Date range: November 8-21, 2025
- Various party sizes: 2-8 guests

## 🚀 **Performance Optimizations**

### Indexes
- **reservations:** `reservation_date`, `customer_email`, `status`, `(reservation_date, reservation_time)`
- **cities:** `name`
- **distances:** `city1_id`, `city2_id`, `distance`

### Configuration
- InnoDB storage engine for ACID compliance
- UTF8MB4 character set for emoji support
- Query cache enabled (256MB)
- Buffer pool optimization (1GB)

## 🔗 **Connection Strings**

### Java/Spring Boot
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/reservation_graph_system?useSSL=false&serverTimezone=America/Mexico_City
spring.datasource.username=reservation_app
spring.datasource.password=SecurePass123!
```

### Node.js/Sequelize
```javascript
const sequelize = new Sequelize('mysql://reservation_app:SecurePass123!@localhost:3306/reservation_graph_system');
```

### Direct MySQL
```bash
mysql -h localhost -P 3306 -u reservation_app -p reservation_graph_system
```

## 📋 **Setup Instructions**

### Option 1: Windows
```cmd
cd database
setup.bat
```

### Option 2: Manual Setup
```sql
mysql -u root -p < scripts/01_create_schema.sql
mysql -u root -p < scripts/02_sample_data.sql
```

### Option 3: Linux/Mac
```bash
cd database
chmod +x setup.sh
./setup.sh
```

## 🧪 **Testing Queries**

### Verify Setup
```sql
-- Check data counts
SELECT 'Cities' as table_name, COUNT(*) as count FROM cities
UNION ALL
SELECT 'Distances', COUNT(*) FROM distances  
UNION ALL
SELECT 'Reservations', COUNT(*) FROM reservations;

-- Test graph functionality
CALL GetNearbyCities('Mexico City', 600);

-- Test reservation queries
SELECT * FROM reservations WHERE reservation_date >= CURDATE() ORDER BY reservation_date;
```

## 🔄 **Migration Strategy**

When connecting existing Sprint 1 and Sprint 2 code:

1. **Java (Sprint 1):** Update `ReservationService` to use MySQL instead of in-memory storage
2. **JavaScript (Sprint 2):** Update `Graph` class to persist data in MySQL
3. **API Layer:** Create REST endpoints that read/write to MySQL
4. **Frontend:** Connect React components to API endpoints

## 📝 **Notes**

- Database designed to handle bidirectional graph relationships efficiently
- Reservation system maintains compatibility with existing Java model
- Prepared for scaling with proper indexing and constraints
- Sample data reflects Mexican geography for realistic testing
- Ready for production with proper security configurations