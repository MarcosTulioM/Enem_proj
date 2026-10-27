"""
API Endpoints: Student Profiles Management.
"""
from typing import List
from fastapi import APIRouter
from pydantic import BaseModel
from app.schemas.models import StudentProfile
from app.repositories.deps import get_enem_repository

router = APIRouter()
repository = get_enem_repository()

class CreateProfileRequest(BaseModel):
    name: str

@router.get("/profiles", response_model=List[StudentProfile])
async def list_profiles():
    return await repository.get_profiles()

@router.post("/profiles", response_model=StudentProfile)
async def create_profile(req: CreateProfileRequest):
    return await repository.create_profile(req.name)

@router.delete("/profiles/{profile_id}", response_model=List[StudentProfile])
async def delete_profile(profile_id: str):
    return await repository.delete_profile(profile_id)

