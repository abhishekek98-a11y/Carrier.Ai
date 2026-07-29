import PyPDF2
from .career_data import MASTER_SKILLS
import re

class ResumeAnalyzer:
    def extract_text_from_pdf(self, file_path: str) -> str:
        text = ""
        try:
            with open(file_path, "rb") as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            print(f"Error extracting PDF: {e}")
        return text

    def extract_skills(self, text: str) -> list[str]:
        text_lower = text.lower()
        extracted = []
        for skill in MASTER_SKILLS:
            # Simple word boundary regex to find skills
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                extracted.append(skill)
        return extracted

    def calculate_resume_score(self, text: str, skills: list) -> float:
        score = 0.0
        text_lower = text.lower()
        
        if "education" in text_lower or "university" in text_lower or "college" in text_lower:
            score += 20
        if "skills" in text_lower or "technologies" in text_lower:
            score += 20
        if "projects" in text_lower or "portfolio" in text_lower:
            score += 20
        if "experience" in text_lower or "employment" in text_lower or "work history" in text_lower:
            score += 15
        if "certification" in text_lower or "certificates" in text_lower:
            score += 10
            
        skill_bonus = min(15, len(skills) * 1.5)
        score += skill_bonus
        
        return min(100.0, score)

    def calculate_ats_score(self, text: str, skills: list) -> float:
        score = 0.0
        text_lower = text.lower()
        
        # Keyword density
        if len(skills) > 10:
            score += 30
        elif len(skills) > 5:
            score += 20
        else:
            score += 10
            
        # Section headers
        headers = ["education", "experience", "skills", "projects"]
        header_count = sum(1 for h in headers if h in text_lower)
        score += (header_count / 4.0) * 25
        
        # No images/tables warning (hard to detect perfectly in raw text, assume ok if length is reasonable)
        score += 15
        
        # Contact info
        has_email = "@" in text
        has_phone = re.search(r'\d{10}', text)
        if has_email: score += 7.5
        if has_phone: score += 7.5
        
        # Length
        word_count = len(text.split())
        if 200 <= word_count <= 1000:
            score += 15
        elif word_count > 1000:
            score += 10
        else:
            score += 5
            
        return min(100.0, score)

    def get_strengths(self, text: str, skills: list) -> list[str]:
        strengths = []
        if len(skills) > 8:
            strengths.append("Good number of technical skills mentioned.")
        text_lower = text.lower()
        if "experience" in text_lower:
            strengths.append("Has professional experience section.")
        if "projects" in text_lower:
            strengths.append("Project portfolio is included.")
        if len(strengths) == 0:
            strengths.append("Clean text formatting.")
        return strengths

    def get_weaknesses(self, text: str, skills: list) -> list[str]:
        weaknesses = []
        text_lower = text.lower()
        if len(skills) < 5:
            weaknesses.append("Very few technical skills identified.")
        if "projects" not in text_lower:
            weaknesses.append("Missing projects/portfolio section.")
        word_count = len(text.split())
        if word_count < 200:
            weaknesses.append("Resume is too short, lacks detail.")
        return weaknesses

    def get_suggestions(self, text: str, skills: list) -> list[str]:
        suggestions = []
        text_lower = text.lower()
        if "linkedin.com" not in text_lower:
            suggestions.append("Add a link to your LinkedIn profile.")
        if "github.com" not in text_lower:
            suggestions.append("Add a link to your GitHub profile.")
        if len(skills) < 5:
            suggestions.append("Explicitly list more industry-relevant skills and tools.")
        if "certification" not in text_lower:
            suggestions.append("Consider adding a certifications section if you have any.")
        return suggestions

    def analyze(self, file_path: str) -> dict:
        text = self.extract_text_from_pdf(file_path)
        skills = self.extract_skills(text)
        
        return {
            "extracted_text": text,
            "resume_score": self.calculate_resume_score(text, skills),
            "ats_score": self.calculate_ats_score(text, skills),
            "extracted_skills": skills,
            "strengths": self.get_strengths(text, skills),
            "weaknesses": self.get_weaknesses(text, skills),
            "missing_sections": [s for s in ["experience", "projects", "education", "skills"] if s not in text.lower()],
            "suggestions": self.get_suggestions(text, skills)
        }
