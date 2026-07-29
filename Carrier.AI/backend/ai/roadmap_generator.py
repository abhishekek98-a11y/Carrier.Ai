from .career_data import CAREER_PROFILES

class RoadmapGenerator:
    def generate(self, career: str, current_skills: list[str]) -> dict:
        career_lower = career.lower()
        career_profile = next((c for c in CAREER_PROFILES if c["name"].lower() == career_lower), None)
        
        if not career_profile:
            return {
                "career": career,
                "total_duration": "Unknown",
                "steps": []
            }
            
        current_skills_lower = [s.lower() for s in current_skills]
        req_skills_sorted = sorted(career_profile["required_skills"].items(), key=lambda x: x[1])
        
        steps = []
        step_num = 1
        
        # Step 1: Basics
        if len(current_skills) == 0:
            steps.append({
                "step_number": step_num,
                "title": "Computer Science Fundamentals",
                "description": "Learn the basics of programming, data structures, and algorithms.",
                "duration": "4-6 weeks",
                "resources": [
                    {"name": "CS50", "url": "https://cs50.harvard.edu/x/", "type": "Course"}
                ],
                "skills_gained": ["algorithms", "data structures"]
            })
            step_num += 1
            
        # Add steps for missing skills
        for skill, weight in req_skills_sorted:
            if skill not in current_skills_lower:
                steps.append({
                    "step_number": step_num,
                    "title": f"Mastering {skill.title()}",
                    "description": f"Learn {skill} which is critical for {career_profile['name']}.",
                    "duration": "2-4 weeks",
                    "resources": career_profile["resources"][:1], # Use a relevant resource from profile
                    "skills_gained": [skill]
                })
                step_num += 1
                
        # Final step
        steps.append({
            "step_number": step_num,
            "title": "Build a Portfolio Project",
            "description": "Combine your skills to build a real-world project and add it to your resume.",
            "duration": "3-4 weeks",
            "resources": [{"name": "GitHub", "url": "https://github.com", "type": "Platform"}],
            "skills_gained": ["project management", "integration"]
        })
        
        return {
            "career": career_profile["name"],
            "total_duration": f"{len(steps) * 3} to {len(steps) * 4} weeks",
            "steps": steps
        }
