@echo off
echo Starting Skill Tree Backend...
cd backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
if not exist database\skilltree.db (
    echo Initializing database...
    call npm run init-db
)
echo Starting server...
call npm run dev

