from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProfileRequest(BaseModel):
    cgpa: Optional[float] = None
    college: Optional[str] = None
    semester: Optional[int] = None
    interests: List[str] = []
    skills: List[str] = []
    aptitude_score: Optional[float] = None

class ProfileResponse(ProfileRequest):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True

class ResumeAnalysis(BaseModel):
    filename: str
    resume_score: float
    ats_score: float
    extracted_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    missing_sections: List[str]
    suggestions: List[str]

class CareerRecommendation(BaseModel):
    career_name: str
    match_score: float
    description: str
    avg_salary: str
    growth: str
    required_skills: List[str]
    matching_skills: List[str]
    missing_skills: List[str]

class SkillGapResponse(BaseModel):
    target_career: str
    skill_match_percentage: float
    matching_skills: List[str]
    missing_skills: List[str]
    priority_skills: List[str]
    learning_suggestions: List[str]

class RoadmapResource(BaseModel):
    name: str
    url: str
    type: str

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    description: str
    duration: str
    resources: List[RoadmapResource]
    skills_gained: List[str]

class RoadmapResponse(BaseModel):
    career: str
    total_duration: str
    steps: List[RoadmapStep]

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]

class DashboardStats(BaseModel):
    career_score: float
    resume_score: float
    ats_score: float
    skills_count: int
    top_careers: List[str]
    skill_distribution: dict
    recent_activity: List[str]
