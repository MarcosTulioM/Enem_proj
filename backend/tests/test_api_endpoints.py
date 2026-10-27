"""
Integration Tests for FastAPI REST Endpoints.
Uses Starlette TestClient to verify contracts and responses.
"""
import pytest
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_list_presets():
    response = client.get("/api/v1/presets")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4
    tags = [p["tag"] for p in data]
    assert "nota_1000" in tags
    assert "nota_920" in tags

def test_list_corpus_and_stats():
    response = client.get("/api/v1/corpus-100")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 100

    stats_resp = client.get("/api/v1/corpus-100/stats")
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert stats["total_essays"] == 100
    assert stats["authentic_human_authors_percentage"] == 100

def test_profiles_endpoints():
    get_resp = client.get("/api/v1/profiles")
    assert get_resp.status_code == 200
    profs = get_resp.json()
    assert len(profs) >= 1

    post_resp = client.post("/api/v1/profiles", json={"name": "Novo Estudante"})
    assert post_resp.status_code == 200
    created = post_resp.json()
    assert created["name"] == "Novo Estudante"

    del_resp = client.delete(f"/api/v1/profiles/{created['id']}")
    assert del_resp.status_code == 200
    remaining = del_resp.json()
    assert all(p["id"] != created["id"] for p in remaining)
    assert len(remaining) >= 1

def test_correct_essay_endpoint():
    payload = {
        "profile_id": "default",
        "theme": "Invisibilidade do trabalho de cuidado realizado pela mulher no Brasil",
        "text": (
            "Na obra Casa-Grande e Senzala, o sociólogo expõe as raízes patriarcais da sociedade.\n\n"
            "Em primeira análise, a negligência governamental agrava essa problemática.\n\n"
            "Ademais, a cumplicidade social reforça a invisibilidade do trabalho feminino.\n\n"
            "Portanto, cabe ao Ministério da Educação criar oficinas nas escolas, a fim de conscientizar a juventude."
        )
    }
    response = client.post("/api/v1/correct", json=payload)
    assert response.status_code == 200
    result = response.json()
    assert "total_score" in result
    assert "competency_scores" in result
    assert "examiner_alfa" in result
    assert "examiner_beta" in result
    assert "discrepancy_report" in result
    assert "annotations" in result
    assert "pedagogical_summary" in result
