@echo off
REM Script pour initialiser et remplir la base de données SQLite
REM Campus Shop Database Seeder

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Campus Shop - Database Setup Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "artisan" (
    echo Error: artisan file not found. Please run this script from the backend directory.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo Error: .env file not found. Please create it first.
    echo You can copy from .env.example: copy .env.example .env
    pause
    exit /b 1
)

echo Checking PHP installation...
php -v >nul 2>&1
if errorlevel 1 (
    echo Error: PHP is not installed or not in PATH.
    pause
    exit /b 1
)

echo PHP found!
echo.

REM Create database directory if it doesn't exist
if not exist "database" mkdir database

echo Step 1: Clearing old database (if exists)...
if exist "database\database.sqlite" (
    del "database\database.sqlite"
    echo Old database removed.
)
echo.

echo Step 2: Creating fresh SQLite database...
REM Create empty SQLite database file
php -r "touch('database/database.sqlite');"
echo SQLite database created.
echo.

echo Step 3: Running migrations...
call php artisan migrate --force
if errorlevel 1 (
    echo Error: Migration failed!
    pause
    exit /b 1
)
echo Migrations completed successfully!
echo.

echo Step 4: Seeding database with test data...
call php artisan db:seed --force
if errorlevel 1 (
    echo Error: Seeding failed!
    pause
    exit /b 1
)
echo Database seeding completed successfully!
echo.

echo ========================================
echo Database setup completed!
echo ========================================
echo.
echo Test accounts created:
echo - Moderator: moderateur@campus.edu / password
echo - Test user: jean@campus.edu / password
echo.
echo The database is ready for development!
echo.
pause
