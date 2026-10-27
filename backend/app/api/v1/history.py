"""
API Endpoints: Student Submission History & Performance Analytics.
"""
from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.models import SubmissionHistoryItem, StudentAnalytics
from app.repositories.deps import get_enem_repository

router = APIRouter()
repository = get_enem_repository()

@router.get("/history", response_model=List[SubmissionHistoryItem])
async def get_history(profile_id: str = Query("default")):
    return await repository.get_history(profile_id)

@router.get("/analytics", response_model=StudentAnalytics)
async def get_analytics(profile_id: str = Query("default")):
    return await repository.get_analytics(profile_id)
