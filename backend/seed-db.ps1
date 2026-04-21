# Script pour initialiser et remplir la base de données SQLite
# Campus Shop Database Seeder (PowerShell version)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Campus Shop - Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "artisan")) {
    Write-Host "Error: artisan file not found. Please run this script from the backend directory." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found. Please create it first." -ForegroundColor Red
    Write-Host "You can copy from .env.example: copy .env.example .env" -ForegroundColor Yellow
    exit 1
}

# Check if PHP is installed
$phpCheck = php -v 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: PHP is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

Write-Host "PHP found!" -ForegroundColor Green
Write-Host ""

# Create database directory if it doesn't exist
if (-not (Test-Path "database")) {
    New-Item -ItemType Directory -Path "database" | Out-Null
}

Write-Host "Step 1: Clearing old database (if exists)..." -ForegroundColor Yellow
if (Test-Path "database\database.sqlite") {
    Remove-Item "database\database.sqlite"
    Write-Host "Old database removed." -ForegroundColor Green
}
Write-Host ""

Write-Host "Step 2: Creating fresh SQLite database..." -ForegroundColor Yellow
# Create empty SQLite database file
php -r "touch('database/database.sqlite');"
Write-Host "SQLite database created." -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Running migrations..." -ForegroundColor Yellow
php artisan migrate --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Migration failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Migrations completed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Seeding database with test data..." -ForegroundColor Yellow
php artisan db:seed --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Seeding failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Database seeding completed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database setup completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test accounts created:" -ForegroundColor Green
Write-Host "- Moderator: moderateur@campus.edu / password"
Write-Host "- Test user: jean@campus.edu / password"
Write-Host ""
Write-Host "The database is ready for development!" -ForegroundColor Green
Write-Host ""
