@echo off
setlocal

:: Nom de la fenêtre
title Campus Shop - Launcher

echo ==========================================
echo   Lancement du projet Campus Shop
echo ==========================================

:: Lancement du Backend (Laravel) dans un nouveau terminal
echo [1/2] Lancement du Backend (Laravel)...
start "Backend (Laravel)" cmd /k "cd backend && php artisan serve"

:: Lancement du Frontend (Next.js avec Bun) dans un nouveau terminal
echo [2/2] Lancement du Frontend (Next.js)...
start "Frontend (Next.js)" cmd /k "cd frontend && bun run dev"

echo.
echo ==========================================
echo   Les deux terminaux ont été ouverts !
echo ==========================================
echo Appuyez sur une touche pour quitter ce lanceur.
pause > nul
