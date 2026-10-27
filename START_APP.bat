@echo off
title Corretor de Redacoes do ENEM - Multi-Agentes
echo ==============================================================
echo    CORRETOR INTELIGENTE DE REDACOES DO ENEM (MULTI-AGENTES)
echo ==============================================================
echo [1/3] Verificando dependencias...
cd /d "%~dp0backend"

echo [2/3] Iniciando Servidor e Interface (Porta 8000)...
start "" http://localhost:8000

echo [3/3] Servidor ativo! Pressione Ctrl+C para encerrar.
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
