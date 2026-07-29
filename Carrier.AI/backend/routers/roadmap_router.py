from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json
from .. import models, auth, database
from ..ai.roadmap_generator import RoadmapGenerator

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])
generator = RoadmapGenerator()

class RoadmapRequest(BaseModel):
    career: str

@router.post("/generate")
def generate_roadmap(
    request: RoadmapRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    current_skills = []
    if profile and profile.skills:
        current_skills = json.loads(profile.skills)

    try:
        roadmap = generator.generate(request.career, current_skills)
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate roadmap: {str(e)}")
