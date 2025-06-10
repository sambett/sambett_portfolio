@echo off
echo ✨ MAGICAL PORTFOLIO STARTUP ✨
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
echo 🎯 Starting both servers...
echo.
echo 🔗 Frontend will be available at: http://localhost:5173
echo 🔗 Backend API will be available at: http://localhost:3001
echo 🔐 Admin Login: http://localhost:5173/admin/login
echo 📊 Admin Dashboard: http://localhost:5173/admin/dashboard
echo.
echo 💡 Demo Credentials:
echo    Username: admin
echo    Password: selma2024
echo.

REM Start both frontend and backend
npm run start:all
