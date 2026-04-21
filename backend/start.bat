@echo off
title CampusShop Dev

echo Starting CampusShop...

:: Terminal 1 — Vite (compilation CSS/JS)
start "Vite" cmd /k "cd /d %~dp0 && npm run dev"

:: Terminal 2 — NativePHP watch
start "NativePHP Watch" cmd /k "cd /d %~dp0 && php artisan native:watch"

:: Terminal 3 — Build Android
start "Android Build" cmd /k "cd /d %~dp0 && php artisan native:run android"

echo All terminals launched!
