@echo off
echo 🧪 TESTING PORTFOLIO BACKEND
echo.

echo Testing backend health...
curl -s http://localhost:3002/api/health
echo.
echo.

echo Testing projects endpoint...
curl -s http://localhost:3002/api/projects
echo.
echo.

echo Testing admin login...
curl -s -X POST http://localhost:3002/admin/login -H "Content-Type: application/json" -d "{\"password\":\"selma2024\"}"
echo.
echo.

echo ✅ Backend tests complete!
pause
