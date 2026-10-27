"""
API Endpoints: 100+ Nota 1000 Real Essays Corpus & Interactive Explorer.
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from app.engine.rag_engine import RAGEngine
import random

router = APIRouter()
rag_engine = RAGEngine()

@router.get("/corpus-100", response_model=List[Dict[str, Any]])
async def list_corpus(
    year: Optional[int] = Query(None, description="Filtrar por ano (2015-2024)"),
    repertoire: Optional[str] = Query(None, description="Filtrar por categoria de repertório"),
    c5_agent: Optional[str] = Query(None, description="Filtrar por tipo de agente na C5"),
    search: Optional[str] = Query(None, description="Termo de busca textual"),
    limit: int = Query(100, ge=1, le=100)
):
    results = rag_engine.filter_essays(
        year=year,
        repertoire_category=repertoire,
        c5_agent=c5_agent,
        search_term=search
    )
    return results[:limit]

@router.get("/corpus-100/stats")
async def get_corpus_stats():
    essays = rag_engine.get_all_essays()
    years = sorted(list(set(e.get("year") for e in essays)))
    rep_categories = {}
    for e in essays:
        for cat in e.get("repertoire_categories", []):
            rep_categories[cat] = rep_categories.get(cat, 0) + 1
    
    total_words = sum(e.get("word_count", 0) for e in essays)
    avg_words = round(total_words / len(essays), 1) if essays else 0

    return {
        "total_essays": len(essays),
        "years_covered": years,
        "avg_words_per_essay": avg_words,
        "repertoire_distribution": rep_categories,
        "authentic_human_authors_percentage": 100
    }

@router.get("/corpus-100/random")
async def get_random_essay():
    essays = rag_engine.get_all_essays()
    if not essays:
        raise HTTPException(status_code=404, detail="Corpus de redações vazio.")
    return random.choice(essays)

@router.get("/corpus-100/{essay_id}")
async def get_essay(essay_id: str):
    essay = rag_engine.get_essay_by_id(essay_id)
    if not essay:
        raise HTTPException(status_code=404, detail="Redação não encontrada no corpus.")
    return essay
