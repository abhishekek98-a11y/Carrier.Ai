from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from .. import models, schemas, auth, database
from ..ai.chatbot import CareerChatbot

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])
chatbot = CareerChatbot()

@router.post("/ask")
def ask_chatbot(
    request: schemas.ChatRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    user_skills = []
    user_career = ""

    if profile:
        user_skills = json.loads(profile.skills) if profile.skills else []
        interests = json.loads(profile.interests) if profile.interests else []
        user_career = interests[0] if interests else ""

    result = chatbot.respond(request.message, user_skills, user_career)

    chat_entry = models.ChatHistory(
        user_id=current_user.id,
        message=request.message,
        response=result["response"]
    )
    db.add(chat_entry)
    db.commit()

    return result

@router.get("/history")
def get_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    history = db.query(models.ChatHistory).filter(
        models.ChatHistory.user_id == current_user.id
    ).order_by(models.ChatHistory.created_at.asc()).limit(50).all()

    return [
        {
            "message": h.message,
            "response": h.response,
            "created_at": h.created_at.isoformat() if h.created_at else None
        }
        for h in history
    ]
