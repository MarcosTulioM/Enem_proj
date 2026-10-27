"""
API Endpoints: Essay Correction via Multi-Agent Orchestrator.
"""
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.models import SubmissionRequest, CorrectionResult
from app.agents.orchestrator import MasterOrchestrator
from app.repositories.deps import get_enem_repository

router = APIRouter()
orchestrator = MasterOrchestrator()
repository = get_enem_repository()

@router.post("/correct", response_model=CorrectionResult)
async def correct_essay(request: SubmissionRequest):
    if len(request.text.strip()) < 50:
        raise HTTPException(status_code=400, detail="O texto deve conter pelo menos 50 caracteres para ser avaliado pela banca.")
    
    result = orchestrator.process_submission(request)
    profile_id = request.profile_id or "default"
    await repository.save_submission(profile_id, result)
    return result

@router.get("/submission/{submission_id}", response_model=CorrectionResult)
async def get_submission(submission_id: str):
    res = await repository.get_submission_detail(submission_id)
    if not res:
        raise HTTPException(status_code=404, detail="Correção não encontrada no histórico.")
    return res
