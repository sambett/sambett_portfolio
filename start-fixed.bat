@echo off
echo ✨ MAGICAL PORTFOLIO STARTUP (FIXED) ✨
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo.

REM Kill any processes using our ports
echo 🔧 Cleaning up ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /pid %%a /f >nul 2>&1

echo ✅ Ports cleaned
echo.

REM Install dependencies if not already installed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

echo.
echo 🚀 Starting both servers...
echo.
echo 📡 Backend will start on: http://localhost:3002
echo 🎨 Frontend will try: http://localhost:5173 (or next available)
echo.
echo 🔐 Admin Access:
echo    Login: http://localhost:[frontend-port]/admin/login  
echo    Username: admin
echo    Password: selma2024
echo.

REM Start backend first
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend server...
npm run dev

pause
