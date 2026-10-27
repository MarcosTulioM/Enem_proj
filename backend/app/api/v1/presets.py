"""
API Endpoints: 1-Click Test Presets (Nota 1000, 920, 760, 560).
"""
import json
import os
from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas.models import PresetEssay

router = APIRouter()
PRESETS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "corpus", "presets.json")

def load_presets() -> List[PresetEssay]:
    if os.path.exists(PRESETS_PATH):
        with open(PRESETS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [PresetEssay(**item) for item in data]
    return []

@router.get("/presets", response_model=List[PresetEssay])
async def list_presets():
    return load_presets()

@router.get("/presets/{preset_id}", response_model=PresetEssay)
async def get_preset(preset_id: str):
    presets = load_presets()
    for p in presets:
        if p.id == preset_id:
            return p
    raise HTTPException(status_code=404, detail="Preset de teste não encontrado.")
