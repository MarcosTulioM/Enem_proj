"""
API Endpoints for Official ENEM Simulated Exams & Questions Engine.
Includes:
- Subject taxonomy and ceiling notes (e.g. 5 questions for foreign language)
- Question delivery filtered by exam day (1 or 2), area, or subject
- 3-Method evaluation:
  1. Raw Accuracy Percentage (%)
  2. Estimated TRI Item Response Theory Score (0 to 1000)
  3. Competency Radar & Gap Diagnosis
- History and longitudinal analytics
"""
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from app.schemas.models import (
    EnemQuestion,
    SubjectInfo,
    SimulatedSessionSubmit,
    SimulatedSessionResult,
    SimulatedHistoryItem
)
from app.repositories.deps import get_enem_repository

router = APIRouter()
repository = get_enem_repository()


@router.get("/simulated/subjects", response_model=List[SubjectInfo])
async def get_subjects():
    """Returns official ENEM subject taxonomy, knowledge areas, and exam ceiling notes."""
    return await repository.get_subjects()


@router.get("/simulated/questions", response_model=List[EnemQuestion])
async def get_questions(
    exam_day: Optional[int] = Query(None, description="1 para Humanas/Linguagens, 2 para Exatas/Natureza"),
    area: Optional[str] = Query(None, description="'linguagens', 'humanas', 'natureza', 'matematica'"),
    subject: Optional[str] = Query(None, description="Ex: 'portugues', 'historia', 'biologia', 'matematica'"),
    limit: int = Query(10, ge=1, le=50, description="Quantidade de questões desejada"),
    profile_id: Optional[str] = Query("default"),
    avoid_already_answered: bool = Query(False, description="Evita repetição de questões já respondidas pelo estudante")
):
    """Fetches authentic ENEM questions with randomized selection and anti-repetition filter."""
    return await repository.get_questions(
        exam_day=exam_day,
        area=area,
        subject=subject,
        limit=limit,
        profile_id=profile_id,
        avoid_already_answered=avoid_already_answered
    )


@router.post("/simulated/submit", response_model=SimulatedSessionResult)
async def submit_simulated_session(payload: SimulatedSessionSubmit):
    """
    Evaluates simulated exam session and calculates:
    1. Raw Accuracy Percentage
    2. Official INEP TRI item-response theory estimate
    3. Weakness radar across subjects
    Plus detailed distractor analysis, historical success rate, and golden tips.
    """
    if not payload.answers:
        raise HTTPException(status_code=400, detail="Nenhuma resposta foi enviada para avaliação.")

    return await repository.submit_simulated_session(
        profile_id=payload.profile_id,
        exam_day=payload.exam_day,
        area_or_subject=payload.area_or_subject,
        answers=payload.answers,
        duration_seconds=payload.duration_seconds
    )


@router.get("/simulated/history", response_model=List[SimulatedHistoryItem])
async def get_simulated_history(profile_id: str = Query("default")):
    """Returns history of simulated sessions for the student profile."""
    return await repository.get_simulated_history(profile_id)


@router.get("/simulated/analytics")
async def get_simulated_analytics(profile_id: str = Query("default")):
    """Returns unified 3-method analytics: Raw %, TRI Score, and Subject Radar."""
    return await repository.get_simulated_analytics(profile_id)
