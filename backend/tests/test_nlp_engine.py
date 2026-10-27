"""
Unit Tests for the Deterministic NLP Engine.
Tests segmentation, TTR calculation, C4 connector checks, C5 extraction, and character offsets.
"""
import pytest
from app.engine.nlp_engine import NLPEngine

@pytest.fixture
def nlp():
    return NLPEngine()

def test_metrics_computation(nlp):
    text = (
        "Na obra Casa-Grande e Senzala, o sociólogo expõe as raízes patriarcais da sociedade.\n\n"
        "Em primeira análise, a negligência estatal perpetua essa problemática.\n\n"
        "Ademais, a cumplicidade social reforça a invisibilidade do problema.\n\n"
        "Portanto, cabe ao Ministério da Educação criar campanhas a fim de mitigar o impasse."
    )
    metrics = nlp.compute_metrics(text)
    assert metrics.total_paragraphs == 4
    assert metrics.total_words > 30
    assert metrics.type_token_ratio > 0.5
    assert metrics.interparagraph_connectors_count >= 2

def test_c4_connector_detection(nlp):
    text_with_conn = (
        "Introdução sobre o tema.\n\n"
        "Em primeira análise, o primeiro argumento se desenvolve.\n\n"
        "Ademais, o segundo argumento complementa a tese.\n\n"
        "Portanto, medidas são necessárias."
    )
    annotations = nlp.extract_annotations(text_with_conn)
    missing_c4 = [a for a in annotations if a.competency == "C4" and a.severity == "atencao"]
    assert len(missing_c4) == 0  # No missing connectors!

def test_c4_missing_connector_detection(nlp):
    text_without_conn = (
        "Introdução sobre o tema.\n\n"
        "O governo não faz o trabalho correto na saúde.\n\n"
        "As pessoas também não ajudam o próximo.\n\n"
        "Tem que mudar isso urgente."
    )
    annotations = nlp.extract_annotations(text_without_conn)
    missing_c4 = [a for a in annotations if a.competency == "C4" and a.severity == "atencao"]
    assert len(missing_c4) >= 2  # Detected missing connectors in D1, D2 and/or C5

def test_c5_element_extraction_and_offsets(nlp):
    conclusion = (
        "Portanto, cabe ao Ministério da Educação, órgão responsável pelas diretrizes pedagógicas, "
        "instituir oficinas nas escolas, por meio de palestras interativas, a fim de conscientizar os jovens."
    )
    annotations = nlp.extract_annotations(conclusion)
    # Check that agent was praised
    agent_praise = [a for a in annotations if a.competency == "C5" and a.severity == "elogio"]
    assert len(agent_praise) >= 1
    # Check offsets validity
    for a in annotations:
        assert a.range.start >= 0
        assert a.range.end > a.range.start
        # Substring in text
        assert conclusion[a.range.start:a.range.end] == a.original_text

def test_colloquialism_detection(nlp):
    text = "O cinema é uma coisa muito legal pra ir no fim de semana."
    annotations = nlp.extract_annotations(text)
    c1_errors = [a for a in annotations if a.competency == "C1" and a.severity == "erro"]
    assert len(c1_errors) >= 1
    error_texts = [a.original_text.lower() for a in c1_errors]
    assert any("pra" in t or "muito legal" in t or "coisa" in t for t in error_texts)

def test_comma_between_subject_and_predicate(nlp):
    text = "A negligência dos órgãos governamentais, perpetuam a invasão predatória de terras."
    annotations = nlp.extract_annotations(text)
    comma_errors = [a for a in annotations if "Vírgula proibida" in a.title]
    assert len(comma_errors) == 1
    assert "perpetuam" in comma_errors[0].original_text
