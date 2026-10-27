"""
Golden Dataset & Regression Tests for Master Multi-Agent Pipeline.
Verifies that the entire system preserves the "sentido geral da coisa"
across real calibrated essays of different score tiers.
"""
import pytest
import json
import os
from app.agents.orchestrator import MasterOrchestrator
from app.schemas.models import SubmissionRequest

PRESETS_PATH = os.path.join(os.path.dirname(__file__), "..", "app", "data", "corpus", "presets.json")

@pytest.fixture
def orchestrator():
    return MasterOrchestrator()

@pytest.fixture
def presets():
    with open(PRESETS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def test_preset_nota_1000_evaluation(orchestrator, presets):
    p1000 = next(p for p in presets if p["tag"] == "nota_1000")
    req = SubmissionRequest(theme=p1000["theme"], text=p1000["text"])
    result = orchestrator.process_submission(req)

    assert result.total_score >= 960, f"Expected >= 960, got {result.total_score}"
    assert result.metrics.total_paragraphs == 4
    assert result.metrics.interparagraph_connectors_count >= 2
    assert result.competency_scores["C5"].score == 200
    assert len(result.annotations) == 0 or all(a.severity != "erro" for a in result.annotations)

def test_preset_nota_920_evaluation(orchestrator, presets):
    p920 = next(p for p in presets if p["tag"] == "nota_920")
    req = SubmissionRequest(theme=p920["theme"], text=p920["text"])
    result = orchestrator.process_submission(req)

    assert 880 <= result.total_score <= 960, f"Expected 880-960, got {result.total_score}"
    # Check that comma deviation was detected
    comma_errors = [a for a in result.annotations if "Vírgula" in a.title]
    assert len(comma_errors) >= 1
    # Check that C5 has attention for missing detailing
    detail_errors = [a for a in result.annotations if "Detalhamento" in a.title]
    assert len(detail_errors) >= 1

def test_preset_nota_760_evaluation(orchestrator, presets):
    p760 = next(p for p in presets if p["tag"] == "nota_760")
    req = SubmissionRequest(theme=p760["theme"], text=p760["text"])
    result = orchestrator.process_submission(req)

    assert 680 <= result.total_score <= 840, f"Expected 680-840, got {result.total_score}"
    # Missing connector in D2 flagged
    c4_flags = [a for a in result.annotations if a.competency == "C4" and a.severity == "atencao"]
    assert len(c4_flags) >= 1

def test_preset_nota_560_evaluation(orchestrator, presets):
    p560 = next(p for p in presets if p["tag"] == "nota_560")
    req = SubmissionRequest(theme=p560["theme"], text=p560["text"])
    result = orchestrator.process_submission(req)

    assert result.total_score <= 640, f"Expected <= 640, got {result.total_score}"
    # Colloquialisms flagged
    colloquials = [a for a in result.annotations if "Coloquialismo" in a.title]
    assert len(colloquials) >= 1
