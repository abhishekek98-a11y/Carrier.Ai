from .career_data import CAREER_PROFILES

class CareerEngine:
    def recommend(self, skills: list[str], cgpa: float, interests: list[str], aptitude_score: float) -> list[dict]:
        recommendations = []
        user_skills_lower = [s.lower() for s in skills]
        user_interests_lower = [i.lower() for i in interests]
        
        for career in CAREER_PROFILES:
            req_skills = career["required_skills"]
            
            # Skill match (50%)
            matching_skills = [s for s in req_skills.keys() if s in user_skills_lower]
            missing_skills = [s for s in req_skills.keys() if s not in user_skills_lower]
            
            skill_score = 0
            if len(req_skills) > 0:
                skill_score = (len(matching_skills) / len(req_skills)) * 50
                
            # Interest match (20%)
            interest_score = 0
            career_words = set(career["name"].lower().split() + career["description"].lower().split())
            interest_matches = sum(1 for i in user_interests_lower if i in career_words)
            if len(user_interests_lower) > 0:
                interest_score = min(20, (interest_matches / len(user_interests_lower)) * 20)
            else:
                interest_score = 10 # Default middle ground
                
            # CGPA factor (15%) - scale 0-10 to 0-15
            cgpa_val = cgpa if cgpa is not None else 7.0
            cgpa_score = (min(10.0, max(0.0, cgpa_val)) / 10.0) * 15
            
            # Aptitude factor (15%) - scale 0-100 to 0-15
            apt_val = aptitude_score if aptitude_score is not None else 70.0
            apt_score = (min(100.0, max(0.0, apt_val)) / 100.0) * 15
            
            total_score = skill_score + interest_score + cgpa_score + apt_score
            
            recommendations.append({
                "career_name": career["name"],
                "match_score": round(total_score, 1),
                "description": career["description"],
                "avg_salary": career["avg_salary"],
                "growth": career["growth"],
                "required_skills": list(req_skills.keys()),
                "matching_skills": matching_skills,
                "missing_skills": missing_skills
            })
            
        recommendations.sort(key=lambda x: x["match_score"], reverse=True)
        return recommendations[:10]
