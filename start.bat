@echo off
echo Starting Task Tracker...
echo.

start "Backend - Task Tracker" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend - Task Tracker" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
pause
