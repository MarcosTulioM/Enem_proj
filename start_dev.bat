@echo off
title Corretor ENEM - Modo Desenvolvedor (Backend + Vite Frontend)
echo ==============================================================
echo    MODO DESENVOLVEDOR: Backend (8000) + Vite Frontend (5173)
echo ==============================================================

echo Iniciando Backend FastAPI...
start "ENEM Backend API" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Iniciando Frontend Vite com Hot-Reload...
start "ENEM Frontend Vite" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 >nul
start "" http://localhost:5173
echo Servidores iniciados!
