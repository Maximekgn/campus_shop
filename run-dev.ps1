# Lancement du projet Campus Shop

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Lancement du projet Campus Shop" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Lancement du Backend (Laravel)
Write-Host "[1/2] Lancement du Backend (Laravel)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList '/k "cd backend && php artisan serve"' -NoNewWindow:$false

# Lancement du Frontend (Next.js avec Bun)
Write-Host "[2/2] Lancement du Frontend (Next.js)..." -ForegroundColor Green
Start-Process cmd -ArgumentList '/k "cd frontend && bun run dev"' -NoNewWindow:$false

Write-Host "`nLes deux terminaux ont été ouverts !" -ForegroundColor Gray
