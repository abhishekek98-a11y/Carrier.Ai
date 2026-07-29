from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from .. import models, auth, database

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

SKILL_CATEGORIES = {
    "Programming": ["python", "java", "c++", "c", "c#", "javascript", "typescript", "ruby", "php", "swift", "kotlin", "go", "rust", "r", "bash"],
    "AI/ML": ["machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "data science", "nlp", "computer vision", "neural networks"],
    "Web Development": ["html", "css", "react", "angular", "vue.js", "svelte", "next.js", "node.js", "express.js", "django", "flask", "fastapi", "spring boot"],
    "Database": ["sql", "mysql", "postgresql", "oracle", "mongodb", "cassandra", "redis", "elasticsearch", "neo4j", "sql server"],
    "DevOps & Cloud": ["aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible", "ci/cd", "linux"],
    "Mobile": ["android", "ios", "react native", "flutter", "kotlin", "swift"],
    "Security": ["networking", "security", "cryptography", "penetration testing", "wireshark", "security analysis"],
    "Design": ["figma", "adobe xd", "wireframing", "prototyping", "ui/ux", "user research"],
    "Data & Analytics": ["data analysis", "data visualization", "tableau", "power bi", "statistics", "mathematics", "pandas", "numpy", "excel"],
    "Other": ["git", "github", "agile", "scrum", "api design", "rest api", "graphql", "microservices", "system design", "blockchain", "solidity"]
}

@router.get("/stats")
def get_stats(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    resume = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).order_by(models.Resume.uploaded_at.desc()).first()

    career_results = db.query(models.CareerResult).filter(
        models.CareerResult.user_id == current_user.id
    ).order_by(models.CareerResult.match_score.desc()).limit(5).all()

    chat_count = db.query(models.ChatHistory).filter(
        models.ChatHistory.user_id == current_user.id
    ).count()

    # Calculate career score (average of top 3)
    career_score = 0.0
    if career_results:
        top_scores = [r.match_score for r in career_results[:3]]
        career_score = round(sum(top_scores) / len(top_scores), 1)

    # Resume scores
    resume_score = resume.resume_score if resume and resume.resume_score else 0.0
    ats_score = resume.ats_score if resume and resume.ats_score else 0.0

    # Skills
    skills = json.loads(profile.skills) if profile and profile.skills else []
    skills_count = len(skills)

    # Top careers
    top_careers = [
        {"name": r.career_name, "score": r.match_score}
        for r in career_results
    ]

    # Skill distribution
    skill_distribution = {}
    skills_lower = [s.lower() for s in skills]
    for category, category_skills in SKILL_CATEGORIES.items():
        count = sum(1 for s in skills_lower if s in category_skills)
        if count > 0:
            skill_distribution[category] = count

    if not skill_distribution and skills:
        skill_distribution["Other"] = len(skills)

    # Recent activity
    recent_activity = []
    if profile and profile.updated_at:
        recent_activity.append({
            "action": "Updated profile",
            "icon": "🎓",
            "time": profile.updated_at.isoformat()
        })
    if resume and resume.uploaded_at:
        recent_activity.append({
            "action": f"Uploaded resume: {resume.filename}",
            "icon": "📄",
            "time": resume.uploaded_at.isoformat()
        })
    if career_results:
        recent_activity.append({
            "action": f"Got {len(career_results)} career recommendations",
            "icon": "🚀",
            "time": career_results[0].created_at.isoformat() if career_results[0].created_at else None
        })
    if chat_count > 0:
        recent_activity.append({
            "action": f"Had {chat_count} conversations with AI assistant",
            "icon": "🤖",
            "time": None
        })

    return {
        "career_score": career_score,
        "resume_score": resume_score,
        "ats_score": ats_score,
        "skills_count": skills_count,
        "top_careers": top_careers,
        "skill_distribution": skill_distribution,
        "recent_activity": recent_activity
    }
