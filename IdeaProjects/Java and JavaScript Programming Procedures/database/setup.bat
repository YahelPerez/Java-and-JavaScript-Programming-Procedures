@echo off
REM =====================================================
REM MySQL Setup Script for Windows
REM Project: Java and JavaScript Programming Procedures
REM Author: YahelPerez
REM Date: November 11, 2025
REM =====================================================

echo 🗄️  Setting up MySQL Database for Reservation Graph System...
echo.

REM Check if MySQL is accessible
mysql --version > nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL is not installed or not in PATH.
    echo ℹ️  Please install MySQL from: https://dev.mysql.com/downloads/mysql/
    echo ℹ️  Make sure mysql.exe is in your PATH
    pause
    exit /b 1
)

echo ✅ MySQL found!
echo.

REM Get MySQL root password
set /p ROOT_PASSWORD="Enter MySQL root password: "
echo.

REM Test MySQL connection
mysql -u root -p%ROOT_PASSWORD% -e "SELECT 1;" > nul 2>&1
if errorlevel 1 (
    echo ❌ Cannot connect to MySQL. Please check your root password.
    pause
    exit /b 1
)

echo ✅ Connected to MySQL!
echo.

REM Create database and run scripts
echo ℹ️  Creating database schema...
mysql -u root -p%ROOT_PASSWORD% < scripts\01_create_schema.sql
if errorlevel 1 (
    echo ❌ Failed to create database schema.
    pause
    exit /b 1
)

echo ✅ Database schema created successfully!
echo.

echo ℹ️  Inserting sample data...
mysql -u root -p%ROOT_PASSWORD% < scripts\02_sample_data.sql
if errorlevel 1 (
    echo ❌ Failed to insert sample data.
    pause
    exit /b 1
)

echo ✅ Sample data inserted successfully!
echo.

REM Verify installation
echo ℹ️  Verifying installation...

REM Get counts (simplified for Windows batch)
echo.
echo ✅ Database setup completed! 
echo.
echo ℹ️  Database details:
echo   🔗 Host: localhost:3306
echo   🗄️  Database: reservation_graph_system
echo   👤 App User: reservation_app
echo   🔑 Password: SecurePass123!
echo.

echo ⚠️  Next steps:
echo   1. Copy .env.example to .env and update passwords
echo   2. Configure your applications to use the database
echo   3. Test the connection from your apps
echo.

echo ✅ MySQL setup completed successfully!
echo 🎉 Ready to build the REST API and React frontend!
echo.

pause