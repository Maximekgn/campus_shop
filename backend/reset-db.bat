@echo off
REM Script pour réinitialiser complètement la base de données
REM Campus Shop Database Reset

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Campus Shop - Fresh Database Setup
echo ========================================
echo.

echo WARNING: This will DELETE all data in the database!
set /p response="Do you want to continue? (yes/no): "

if /i not "%response%"=="yes" (
    if /i not "%response%"=="y" (
        echo Operation cancelled.
        exit /b 0
    )
)

REM Check if we're in the right directory
if not exist "artisan" (
    echo Error: artisan file not found. Please run this script from the backend directory.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo Error: .env file not found. Please create it first.
    pause
    exit /b 1
)

echo.
echo Step 1: Clearing old database (if exists)...
if exist "database\database.sqlite" (
    del "database\database.sqlite"
    echo Old database removed.
)
echo.

echo Step 2: Clearing Laravel cache...
call php artisan cache:clear
echo Cache cleared.
echo.

echo Step 3: Creating fresh SQLite database...
php -r "touch('database/database.sqlite');"
echo SQLite database created.
echo.

echo Step 4: Running fresh migrations...
call php artisan migrate:fresh --force
if errorlevel 1 (
    echo Error: Migration failed!
    pause
    exit /b 1
)
echo Migrations completed successfully!
echo.

echo Step 5: Seeding database with test data...
call php artisan db:seed --force
if errorlevel 1 (
    echo Error: Seeding failed!
    pause
    exit /b 1
)
echo Database seeding completed successfully!
echo.

echo Step 6: Clearing cache again...
call php artisan cache:clear
call php artisan view:clear
echo Cache cleared.
echo.

echo ========================================
echo Fresh database setup completed!
echo ========================================
echo.
echo Test accounts created:
echo - Moderator: moderateur@campus.edu / password
echo - Test user: jean@campus.edu / password
echo.
echo The database is ready for development!
echo.
pause
