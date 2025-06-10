@echo off
echo 🔄 RESTARTING PORTFOLIO WITH CORS/PROXY FIXES
echo.

echo 🛑 Stopping any existing processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1

echo 🧹 Clearing ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /pid %%a /f >nul 2>&1

echo ✅ Clean restart in progress...
echo.

echo 🚀 Starting backend server with enhanced CORS...
start "Backend Server" cmd /k "cd backend && echo Starting backend with aggressive CORS fix... && npm run dev"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo 🎨 Starting frontend with Vite proxy...
echo.
echo 🔗 Frontend: http://localhost:5173
echo 🧪 Test Page: http://localhost:5173/test-backend  
echo 🔐 Admin Login: http://localhost:5173/admin/login
echo 📊 Dashboard: http://localhost:5173/admin/dashboard
echo.
echo 💡 Expected: All tests should be GREEN now!
echo.

npm run dev
