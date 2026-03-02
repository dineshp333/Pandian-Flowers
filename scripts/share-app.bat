@echo off
REM Share Pandian Flowers Website with localhost.run (No installation needed!)

cd /d "%~dp0"

REM Start the web server in background
echo Starting web server...
start "Pandian Flowers Server" cmd /k python -m http.server 8000 --directory "public"

REM Wait for server to start
timeout /t 3 /nobreak

REM Display instructions
echo.
echo ========================================
echo PUBLIC SHARING LINK GENERATED!
echo ========================================
echo.
echo In another PowerShell window, run:
echo.
echo ssh -R 80:localhost:8000 ssh.localhost.run
echo.
echo Then copy the generated link to share with your friends!
echo.
echo ========================================
echo.
pause
