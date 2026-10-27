"""
Unit Tests for LocalFileStudentRepository.
Tests profile management, submission persistence, score analytics, and recurring issue detection.
"""
import pytest
import os
import shutil
import tempfile
from datetime import datetime
from app.repositories.local_repository import LocalFileStudentRepository
from app.schemas.models import (
    CorrectionResult,
    CompetencyScore,
    ExaminerScore,
    DiscrepancyReport,
    TextMetrics,
    PedagogicalMentorSummary,
    AnnotationSpan,
    RangeOffset
)

@pytest.fixture
def temp_repo():
    temp_dir = tempfile.mkdtemp()
    repo = LocalFileStudentRepository(storage_dir=temp_dir)
    yield repo
    shutil.rmtree(temp_dir, ignore_errors=True)

def create_mock_correction(sub_id: str, profile_id: str, total_score: int, c1_score: int = 160) -> CorrectionResult:
    comp_scores = {
        f"C{i}": CompetencyScore(
            competency=f"C{i}",
            name=f"Competência {i}",
            score=c1_score if i == 1 else (total_score - c1_score) // 4,
            level=4,
            description="Bom desempenho.",
            strengths=[],
            improvements=[],
            evidence=[]
        )
        for i in range(1, 6)
    }
    return CorrectionResult(
        id=sub_id,
        timestamp=datetime.now(),
        profile_id=profile_id,
        theme="Tema de Teste",
        text="Texto de teste da redação submetida.",
        total_score=total_score,
        competency_scores=comp_scores,
        examiner_alfa=ExaminerScore(examiner_name="Alfa", focus="Norma", scores={"C1": 160}, total=160, rationale="OK"),
        examiner_beta=ExaminerScore(examiner_name="Beta", focus="Tema", scores={"C1": 160}, total=160, rationale="OK"),
        discrepancy_report=DiscrepancyReport(has_discrepancy=False, discrepant_competencies=[], total_diff=0, auditor_intervened=False, final_decision_summary="OK"),
        annotations=[
            AnnotationSpan(
                id="ann-test-1",
                competency="C1",
                severity="erro",
                range=RangeOffset(start=0, end=10, paragraph=1),
                original_text="pra fazer",
                title="Marca de Coloquialismo / Oralidade",
                description="Uso informal",
                layperson_tip="Use para",
                suggested_fix="para fazer"
            )
        ],
        metrics=TextMetrics(
            total_words=350,
            total_paragraphs=4,
            total_sentences=12,
            avg_words_per_sentence=29.1,
            avg_words_per_paragraph=87.5,
            type_token_ratio=0.55,
            interparagraph_connectors_count=2,
            interparagraph_connectors_found=["P2", "P3"],
            c5_elements_present={"agente": True}
        ),
        pedagogical_summary=PedagogicalMentorSummary(
            greeting="Olá!",
            overall_verdict="Bom trabalho",
            greatest_strength="C1",
            primary_focus_area="C5",
            suggested_action_plan=["Passo 1"],
            inspirational_quote="Força!"
        ),
        similar_benchmarks=[]
    )

@pytest.mark.asyncio
async def test_create_and_list_profiles(temp_repo):
    profiles = await temp_repo.get_profiles()
    assert len(profiles) >= 1  # Default profile exists
    
    new_prof = await temp_repo.create_profile("Marcos Estudante")
    assert new_prof.name == "Marcos Estudante"
    
    all_profs = await temp_repo.get_profiles()
    assert any(p.name == "Marcos Estudante" for p in all_profs)

@pytest.mark.asyncio
async def test_save_and_fetch_history(temp_repo):
    corr1 = create_mock_correction("corr-001", "user-1", 720)
    corr2 = create_mock_correction("corr-002", "user-1", 840)

    await temp_repo.save_submission("user-1", corr1)
    await temp_repo.save_submission("user-1", corr2)

    history = await temp_repo.get_history("user-1")
    assert len(history) == 2
    assert history[0].total_score in [720, 840]

@pytest.mark.asyncio
async def test_analytics_and_recurring_issues(temp_repo):
    corr1 = create_mock_correction("corr-001", "user-2", 720)
    corr2 = create_mock_correction("corr-002", "user-2", 800)

    await temp_repo.save_submission("user-2", corr1)
    await temp_repo.save_submission("user-2", corr2)

    analytics = await temp_repo.get_analytics("user-2")
    assert analytics.total_essays == 2
    assert analytics.average_score == 760.0
    assert analytics.highest_score == 800
    assert len(analytics.score_progression) == 2
    # Check that the repeated colloquialism error was flagged as recurring!
    assert len(analytics.recurring_issues) >= 1
    assert "Coloquialismo" in analytics.recurring_issues[0].issue_type
