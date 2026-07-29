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

# Include all API routers
app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(resume_router.router)
app.include_router(career_router.router)
app.include_router(roadmap_router.router)
app.include_router(chatbot_router.router)
app.include_router(dashboard_router.router)

# Create uploads directory
os.makedirs(os.path.join(os.path.dirname(__file__), "uploads"), exist_ok=True)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Serve frontend static files if available
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
