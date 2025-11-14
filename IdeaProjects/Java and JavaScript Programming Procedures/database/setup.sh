#!/bin/bash
# =====================================================
# MySQL Setup Script for Reservation Graph System
# Project: Java and JavaScript Programming Procedures
# Author: YahelPerez
# Date: November 11, 2025
# =====================================================

echo "🗄️  Setting up MySQL Database for Reservation Graph System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    print_error "MySQL is not installed. Please install MySQL first."
    print_info "Download from: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

print_status "MySQL found!"

# Get MySQL root password
echo -e "${BLUE}Enter MySQL root password:${NC}"
read -s ROOT_PASSWORD

# Test MySQL connection
if ! mysql -u root -p"$ROOT_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    print_error "Cannot connect to MySQL. Please check your root password."
    exit 1
fi

print_status "Connected to MySQL!"

# Create database and run scripts
print_info "Creating database schema..."
mysql -u root -p"$ROOT_PASSWORD" < scripts/01_create_schema.sql

if [ $? -eq 0 ]; then
    print_status "Database schema created successfully!"
else
    print_error "Failed to create database schema."
    exit 1
fi

print_info "Inserting sample data..."
mysql -u root -p"$ROOT_PASSWORD" < scripts/02_sample_data.sql

if [ $? -eq 0 ]; then
    print_status "Sample data inserted successfully!"
else
    print_error "Failed to insert sample data."
    exit 1
fi

# Verify installation
print_info "Verifying installation..."
CITY_COUNT=$(mysql -u root -p"$ROOT_PASSWORD" -D reservation_graph_system -s -e "SELECT COUNT(*) FROM cities;")
RESERVATION_COUNT=$(mysql -u root -p"$ROOT_PASSWORD" -D reservation_graph_system -s -e "SELECT COUNT(*) FROM reservations;")
DISTANCE_COUNT=$(mysql -u root -p"$ROOT_PASSWORD" -D reservation_graph_system -s -e "SELECT COUNT(*) FROM distances;")

echo
print_status "Database setup completed! Summary:"
echo "  📍 Cities: $CITY_COUNT"
echo "  📅 Reservations: $RESERVATION_COUNT"
echo "  🛣️  Distances: $DISTANCE_COUNT"
echo

print_info "Database details:"
echo "  🔗 Host: localhost:3306"
echo "  🗄️  Database: reservation_graph_system"
echo "  👤 App User: reservation_app"
echo "  🔑 Password: SecurePass123!"
echo

print_warning "Next steps:"
echo "  1. Copy .env.example to .env and update passwords"
echo "  2. Configure your applications to use the database"
echo "  3. Test the connection from your apps"
echo

print_status "MySQL setup completed successfully!"
echo "🎉 Ready to build the REST API and React frontend!"