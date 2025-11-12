@echo off
echo Starting Cybersecurity Skill Tree Website...
echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > NUL
echo.
echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"
echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)
pause > NUL

