@echo off
echo 🚀 Starting Enhanced Portfolio Backend...
echo.
echo ✨ Features:
echo    📁 Project Management
echo    📄 CV Upload & Management  
echo    🏆 Certificate Upload & Management
echo    📤 Drag & Drop File Upload
echo    🔄 Version Control for CV
echo.

cd /d "%~dp0"

REM Start Backend in background
echo 🔧 Starting Backend...
cd backend
if exist server-enhanced-files.js (
    echo 📊 Using Enhanced Server with File Upload Capabilities
    start "Portfolio Backend" cmd /c "node server-enhanced-files.js"
) else if exist server.js (
    echo 📊 Using Standard Server
    start "Portfolio Backend" cmd /c "node server.js"
) else (
    echo ❌ No server file found!
    pause
    exit /b 1
)

REM Wait a moment for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

REM Start Frontend
echo 🎨 Starting Frontend...
cd ..
if exist package.json (
    echo 🚀 Launching Portfolio Frontend...
    npm run dev
) else (
    echo ❌ No package.json found!
    pause
    exit /b 1
)

pause
