"""
Abstract Repository Interface for Student Profiles, Essay History, and Analytics.
Follows Clean Architecture Ports & Adapters pattern to allow seamless future migration
to PostgreSQL, Supabase, Firebase or MongoDB.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.models import (
    StudentProfile,
    SubmissionHistoryItem,
    CorrectionResult,
    StudentAnalytics
)

class IStudentRepository(ABC):
    @abstractmethod
    async def create_profile(self, name: str) -> StudentProfile:
        pass

    @abstractmethod
    async def get_profiles(self) -> List[StudentProfile]:
        pass

    @abstractmethod
    async def delete_profile(self, profile_id: str) -> List[StudentProfile]:
        pass

    @abstractmethod
    async def save_submission(self, profile_id: str, result: CorrectionResult) -> str:
        pass

    @abstractmethod
    async def get_history(self, profile_id: str) -> List[SubmissionHistoryItem]:
        pass

    @abstractmethod
    async def get_submission_detail(self, submission_id: str) -> Optional[CorrectionResult]:
        pass

    @abstractmethod
    async def get_analytics(self, profile_id: str) -> StudentAnalytics:
        pass
