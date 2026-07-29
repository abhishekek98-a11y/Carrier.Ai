from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import json, os, shutil
from .. import models, schemas, auth, database
from ..ai.resume_analyzer import ResumeAnalyzer

router = APIRouter(prefix="/api/resume", tags=["resume"])
analyzer = ResumeAnalyzer()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, f"user_{current_user.id}_{file.filename}")

    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        analysis = analyzer.analyze(file_path)
    except Exception as e:
        analysis = {
            "extracted_text": "",
            "extracted_skills": [],
            "resume_score": 45.0,
            "ats_score": 40.0,
            "strengths": ["Resume was uploaded successfully"],
            "weaknesses": ["Could not fully parse the PDF content"],
            "missing_sections": ["Unable to detect sections"],
            "suggestions": ["Try uploading a text-based PDF (not scanned image)"]
        }

    existing = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    if existing:
        existing.filename = file.filename
        existing.extracted_text = analysis.get("extracted_text", "")
        existing.extracted_skills = json.dumps(analysis.get("extracted_skills", []))
        existing.resume_score = analysis.get("resume_score", 0)
        existing.ats_score = analysis.get("ats_score", 0)
        resume = existing
    else:
        resume = models.Resume(
            user_id=current_user.id,
            filename=file.filename,
            extracted_text=analysis.get("extracted_text", ""),
            extracted_skills=json.dumps(analysis.get("extracted_skills", [])),
            resume_score=analysis.get("resume_score", 0),
            ats_score=analysis.get("ats_score", 0)
        )
        db.add(resume)

    db.commit()
    db.refresh(resume)

    return {
        "filename": file.filename,
        "resume_score": analysis.get("resume_score", 0),
        "ats_score": analysis.get("ats_score", 0),
        "extracted_skills": analysis.get("extracted_skills", []),
        "strengths": analysis.get("strengths", []),
        "weaknesses": analysis.get("weaknesses", []),
        "missing_sections": analysis.get("missing_sections", []),
        "suggestions": analysis.get("suggestions", [])
    }

@router.get("/analysis")
def get_analysis(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    resume = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).order_by(models.Resume.uploaded_at.desc()).first()

    if not resume:
        return None

    return {
        "filename": resume.filename,
        "resume_score": resume.resume_score or 0,
        "ats_score": resume.ats_score or 0,
        "extracted_skills": json.loads(resume.extracted_skills) if resume.extracted_skills else [],
        "strengths": [],
        "weaknesses": [],
        "missing_sections": [],
        "suggestions": []
    }
