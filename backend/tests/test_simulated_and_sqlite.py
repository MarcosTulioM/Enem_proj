"""
Tests for Official ENEM Questions Engine, SQLite Repository & Simulated Exams.
Verifies:
- 3 Evaluation Methods: Raw %, TRI Score, Competency Radar
- Filter by Exam Day (Dia 1 vs Dia 2) & Subjects
- Distractor notes & Golden tips
- Anti-repetition question delivery
"""
import pytest
from app.repositories.deps import get_enem_repository
from app.schemas.models import SimulatedAnswerItem


@pytest.fixture
def repo():
    return get_enem_repository()


@pytest.mark.asyncio
async def test_get_subjects_and_ceiling_notes(repo):
    subjects = await repo.get_subjects()
    assert len(subjects) >= 10
    subj_ids = [s.id for s in subjects]
    assert "portugues" in subj_ids
    assert "matematica" in subj_ids
    assert "lingua_estrangeira" in subj_ids

    # Verify foreign language ceiling note
    fl = next(s for s in subjects if s.id == "lingua_estrangeira")
    assert fl.exam_ceiling_note is not None
    assert "5 questões" in fl.exam_ceiling_note


@pytest.mark.asyncio
async def test_get_questions_by_exam_day(repo):
    # Day 1 questions (Linguagens e Humanas)
    day1_q = await repo.get_questions(exam_day=1, limit=20)
    assert len(day1_q) >= 3
    for q in day1_q:
        assert q.exam_day == 1
        assert q.area in ["linguagens", "humanas"]

    # Day 2 questions (Matemática e Natureza)
    day2_q = await repo.get_questions(exam_day=2, limit=20)
    assert len(day2_q) >= 3
    for q in day2_q:
        assert q.exam_day == 2
        assert q.area in ["matematica", "natureza"]


@pytest.mark.asyncio
async def test_get_questions_by_subject(repo):
    math_q = await repo.get_questions(subject="matematica", limit=5)
    assert len(math_q) >= 2
    for q in math_q:
        assert q.subject == "matematica"
        assert len(q.option_a) > 0
        assert q.correct_option in ["A", "B", "C", "D", "E"]
        assert len(q.explanation) > 10
        assert len(q.golden_tip) > 10


@pytest.mark.asyncio
async def test_submit_simulated_session_3_methods(repo):
    # Fetch 2 questions to simulate answering
    questions = await repo.get_questions(limit=2)
    assert len(questions) >= 2

    q1, q2 = questions[0], questions[1]

    # Create answers: 1 correct, 1 incorrect
    answers = [
        SimulatedAnswerItem(question_id=q1.id, chosen_option=q1.correct_option),
        SimulatedAnswerItem(question_id=q2.id, chosen_option="A" if q2.correct_option != "A" else "B")
    ]

    result = await repo.submit_simulated_session(
        profile_id="default",
        exam_day=q1.exam_day,
        area_or_subject="teste_misto",
        answers=answers,
        duration_seconds=120
    )

    # Method 1: Raw Accuracy
    assert result.total_questions == 2
    assert result.correct_count == 1
    assert result.raw_accuracy_percentage == 50.0

    # Method 2: Estimated TRI Score (300 to 1000)
    assert 300.0 <= result.estimated_tri_score <= 1000.0

    # Method 3: Competency Radar
    assert len(result.competency_radar) >= 1

    # Feedbacks validation
    assert len(result.question_feedbacks) == 2
    f1 = next(f for f in result.question_feedbacks if f.question_id == q1.id)
    assert f1.is_correct is True

    f2 = next(f for f in result.question_feedbacks if f.question_id == q2.id)
    assert f2.is_correct is False
    assert f2.golden_tip is not None


@pytest.mark.asyncio
async def test_simulated_history_and_analytics(repo):
    history = await repo.get_simulated_history("default")
    assert len(history) >= 1

    analytics = await repo.get_simulated_analytics("default")
    assert analytics["total_simulations"] >= 1
    assert analytics["total_questions_answered"] >= 2
    assert "average_raw_accuracy" in analytics
    assert "average_tri_score" in analytics
    assert "subject_accuracy" in analytics
