@echo off
echo ================================================
echo ENERGY BOOST COMMERCE
echo ================================================
echo.
echo Iniciando Backend (Puerto 5000)...
start "Backend" cmd /k "cd /d %~dp0backend && py app.py"

echo Iniciando Frontend (Puerto 8080)...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ================================================
echo Ambos servicios iniciados:
echo - Frontend: http://localhost:8080
echo - Backend:  http://localhost:5000
echo.
echo Presiona cualquier tecla para salir...
pause >nul