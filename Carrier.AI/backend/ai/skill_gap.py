from .career_data import CAREER_PROFILES

class SkillGapAnalyzer:
    def analyze(self, student_skills: list[str], target_career: str) -> dict:
        student_skills_lower = [s.lower() for s in student_skills]
        target_career_lower = target_career.lower()
        
        career_profile = next((c for c in CAREER_PROFILES if c["name"].lower() == target_career_lower), None)
        
        if not career_profile:
            return {
                "target_career": target_career,
                "skill_match_percentage": 0,
                "matching_skills": [],
                "missing_skills": [],
                "priority_skills": [],
                "learning_suggestions": ["Career not found in database."]
            }
            
        req_skills = career_profile["required_skills"]
        matching_skills = [s for s in req_skills.keys() if s in student_skills_lower]
        missing_skills_info = [{"skill": s, "weight": w} for s, w in req_skills.items() if s not in student_skills_lower]
        missing_skills_info.sort(key=lambda x: x["weight"], reverse=True)
        
        missing_skills = [s["skill"] for s in missing_skills_info]
        priority_skills = missing_skills[:3]
        
        match_percentage = (len(matching_skills) / len(req_skills)) * 100 if req_skills else 0
        
        suggestions = []
        if priority_skills:
            suggestions.append(f"Focus primarily on learning: {', '.join(priority_skills)}.")
            suggestions.append("Check the roadmap generator for step-by-step guidance on these skills.")
        if len(matching_skills) > 0:
            suggestions.append(f"Great job having {len(matching_skills)} required skills already!")
            
        return {
            "target_career": career_profile["name"],
            "skill_match_percentage": round(match_percentage, 1),
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "priority_skills": priority_skills,
            "learning_suggestions": suggestions
        }
