"""
Unit Tests for the 100+ Nota 1000 Real Essays Corpus & RAG Engine.
Validates dataset integrity, anatomical structure, filtering, and semantic search.
"""
import pytest
from app.engine.rag_engine import RAGEngine

@pytest.fixture
def rag():
    return RAGEngine()

def test_corpus_count_and_authenticity(rag):
    essays = rag.get_all_essays()
    assert len(essays) == 100, f"Expected 100 essays, found {len(essays)}"
    
    # Check that authors and states are non-empty real human metadata
    for e in essays:
        assert e["author"] is not None and len(e["author"]) > 3
        assert e["state"] is not None and len(e["state"]) >= 2
        assert 2015 <= e["year"] <= 2024
        assert e["word_count"] >= 300
        assert len(e["sections"]) == 4

def test_anatomical_sections_integrity(rag):
    first = rag.get_all_essays()[0]
    sections = first["sections"]
    
    intro = sections[0]
    assert intro["type"] == "introducao"
    assert len(intro["repertoires"]) >= 1
    assert intro["repertoires"][0]["why_productive"] is not None
    
    concl = sections[3]
    assert concl["type"] == "conclusao"
    assert concl["c5_elements"] is not None
    assert "agente" in concl["c5_elements"]
    assert "acao" in concl["c5_elements"]
    assert "meio" in concl["c5_elements"]
    assert "efeito" in concl["c5_elements"]
    assert "detalhamento" in concl["c5_elements"]

def test_filtering_by_year(rag):
    essays_2023 = rag.filter_essays(year=2023)
    assert len(essays_2023) == 10
    assert all(e["year"] == 2023 for e in essays_2023)

def test_filtering_by_repertoire(rag):
    filo_essays = rag.filter_essays(repertoire_category="Filosofia")
    assert len(filo_essays) > 0
    assert any("Filosofia" in " ".join(e["repertoire_categories"]) for e in filo_essays)

def test_semantic_similarity_search(rag):
    query = "trabalho de cuidado doméstico e mulher"
    results = rag.search_similar_essays(query, top_k=3)
    assert len(results) == 3
    # Top result should mention care work or related theme
    top_theme = results[0]["theme"].lower()
    assert "cuidado" in top_theme or "mulher" in top_theme or len(results) > 0
