"""
Main FastAPI Application Entrypoint for ENEM Essay Evaluator.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.correction import router as correction_router
from app.api.v1.corpus import router as corpus_router
from app.api.v1.presets import router as presets_router
from app.api.v1.profiles import router as profiles_router
from app.api.v1.history import router as history_router
from app.api.v1.simulated import router as simulated_router

app = FastAPI(
    title="ENEM Multi-Agent Essay Evaluator API",
    description="Motor de Correção de Redações do ENEM baseado em Sub-Agentes, Regras Oficiais INEP, Corpus de 100 Redações Nota 1000 e Analytics.",
    version="1.0.0"
)

# Enable CORS for local development & production UI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(correction_router, prefix="/api/v1", tags=["Correção"])
app.include_router(corpus_router, prefix="/api/v1", tags=["Corpus Nota 1000"])
app.include_router(presets_router, prefix="/api/v1", tags=["Presets"])
app.include_router(profiles_router, prefix="/api/v1", tags=["Perfis"])
app.include_router(history_router, prefix="/api/v1", tags=["Histórico & Analytics"])
app.include_router(simulated_router, prefix="/api/v1", tags=["Simulado & Questões"])

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
dist_index = os.path.join(frontend_dist, "index.html")

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api")
async def api_info():
    return {
        "status": "online",
        "service": "ENEM Multi-Agent Essay Grader",
        "version": "1.0.0",
        "docs": "/docs"
    }

if os.path.exists(frontend_dist) and os.path.exists(dist_index):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_index():
        return FileResponse(dist_index)

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(dist_index)
else:
    @app.get("/")
    async def root_fallback():
        return {
            "status": "online",
            "service": "ENEM Multi-Agent Essay Grader",
            "version": "1.0.0",
            "docs": "/docs"
        }


