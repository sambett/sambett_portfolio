@echo off
echo 🧪 TESTING BACKEND CONNECTION
echo.

echo 📡 Checking if backend is running on port 3002...
netstat -ano | findstr :3002
echo.

echo 🔍 Testing backend health endpoint...
curl -s http://localhost:3002/api/health
echo.
echo.

echo 🔍 Testing admin login endpoint...
curl -s -X POST http://localhost:3002/admin/login -H "Content-Type: application/json" -d "{\"password\":\"selma2024\"}"
echo.
echo.

echo 🔍 Testing projects endpoint...
curl -s http://localhost:3002/api/projects
echo.
echo.

echo ✅ Backend test complete!
echo.
echo 💡 If you see JSON responses above, the backend is working.
echo 💡 If you see errors, the backend may not be running.
echo.
pause
