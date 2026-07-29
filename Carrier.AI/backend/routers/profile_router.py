from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from .. import models, schemas, auth, database

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("", response_model=schemas.ProfileResponse)
def get_profile(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    
    if not profile:
        profile = models.StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "cgpa": profile.cgpa,
        "college": profile.college,
        "semester": profile.semester,
        "interests": json.loads(profile.interests) if profile.interests else [],
        "skills": json.loads(profile.skills) if profile.skills else [],
        "aptitude_score": profile.aptitude_score,
        "updated_at": profile.updated_at
    }

@router.put("", response_model=schemas.ProfileResponse)
def update_profile(profile_data: schemas.ProfileRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    
    if not profile:
        profile = models.StudentProfile(user_id=current_user.id)
        db.add(profile)
        
    profile.cgpa = profile_data.cgpa
    profile.college = profile_data.college
    profile.semester = profile_data.semester
    profile.interests = json.dumps(profile_data.interests)
    profile.skills = json.dumps(profile_data.skills)
    profile.aptitude_score = profile_data.aptitude_score
    
    db.commit()
    db.refresh(profile)
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "cgpa": profile.cgpa,
        "college": profile.college,
        "semester": profile.semester,
        "interests": profile_data.interests,
        "skills": profile_data.skills,
        "aptitude_score": profile.aptitude_score,
        "updated_at": profile.updated_at
    }
