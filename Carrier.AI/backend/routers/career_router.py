from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json
from .. import models, schemas, auth, database
from ..ai.career_engine import CareerEngine
from ..ai.skill_gap import SkillGapAnalyzer

router = APIRouter(prefix="/api/career", tags=["career"])
engine = CareerEngine()
gap_analyzer = SkillGapAnalyzer()

class SkillGapRequest(BaseModel):
    target_career: str

@router.post("/recommend")
def get_recommendations(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(status_code=400, detail="Please complete your profile first")

    skills = json.loads(profile.skills) if profile.skills else []
    interests = json.loads(profile.interests) if profile.interests else []
    cgpa = profile.cgpa or 7.0
    aptitude = profile.aptitude_score or 60.0

    if not skills:
        raise HTTPException(status_code=400, detail="Please add skills to your profile first")

    recommendations = engine.recommend(skills, cgpa, interests, aptitude)

    # Clear old results and save new ones
    db.query(models.CareerResult).filter(
        models.CareerResult.user_id == current_user.id
    ).delete()

    for rec in recommendations[:10]:
        result = models.CareerResult(
            user_id=current_user.id,
            career_name=rec["career_name"],
            match_score=rec["match_score"],
            skill_gaps=json.dumps(rec.get("missing_skills", []))
        )
        db.add(result)

    db.commit()
    return recommendations

@router.post("/skill-gap")
def get_skill_gap(
    request: SkillGapRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(status_code=400, detail="Please complete your profile first")

    skills = json.loads(profile.skills) if profile.skills else []
    result = gap_analyzer.analyze(skills, request.target_career)
    return result

@router.get("/history")
def get_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    results = db.query(models.CareerResult).filter(
        models.CareerResult.user_id == current_user.id
    ).order_by(models.CareerResult.match_score.desc()).all()

    return [
        {
            "career_name": r.career_name,
            "match_score": r.match_score,
            "skill_gaps": json.loads(r.skill_gaps) if r.skill_gaps else [],
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in results
    ]
