from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from .database import engine, Base
from .routers import auth_router, profile_router, resume_router, career_router, roadmap_router, chatbot_router, dashboard_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CareerAI API",
    description="AI-Powered Career Guidance & Skill Gap Analysis System",
    version="1.0.0"
)

# CORS middleware - allow all origins for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(resume_router.router)
app.include_router(career_router.router)
app.include_router(roadmap_router.router)
app.include_router(chatbot_router.router)
app.include_router(dashboard_router.router)

# Create uploads directory
os.makedirs(os.path.join(os.path.dirname(__file__), "uploads"), exist_ok=True)

@app.get("/")
def root():
    return {
        "name": "CareerAI API",
        "version": "1.0.0",
        "description": "AI-Powered Career Guidance & Skill Gap Analysis System",
        "endpoints": {
            "auth": "/api/auth",
            "profile": "/api/profile",
            "resume": "/api/resume",
            "career": "/api/career",
            "roadmap": "/api/roadmap",
            "chatbot": "/api/chatbot",
            "dashboard": "/api/dashboard"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
