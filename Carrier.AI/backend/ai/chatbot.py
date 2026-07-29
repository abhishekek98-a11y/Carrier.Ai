import re

class CareerChatbot:
    def respond(self, message: str, user_skills: list[str], user_career: str) -> dict:
        msg_lower = message.lower()
        response = ""
        suggestions = []
        
        if re.search(r'\b(salary|pay|money)\b', msg_lower):
            response = f"Salaries vary widely by location and experience. For {user_career or 'most tech roles'}, entry-level positions often start around $60k-$80k, while senior roles can exceed $150k. Focus on building skills to maximize your earning potential."
            suggestions = ["How to negotiate salary?", "Highest paying tech skills"]
        
        elif re.search(r'\b(interview|prep|questions)\b', msg_lower):
            response = "For technical interviews, practice data structures and algorithms on LeetCode or HackerRank. Also, prepare STAR method stories for behavioral questions. Make sure to review your past projects thoroughly."
            suggestions = ["Common behavioral questions", "System design basics"]
            
        elif re.search(r'\b(resume|cv)\b', msg_lower):
            response = "A good tech resume should highlight your impact, not just your duties. Use metrics (e.g., 'Improved performance by 20%'). Keep it to one page if you have less than 5 years of experience."
            suggestions = ["Resume formatting tips", "How to list projects"]
            
        elif re.search(r'\b(skill|learn|study)\b', msg_lower):
            response = f"Based on your profile, you know {', '.join(user_skills[:3]) if user_skills else 'some basics'}. I'd recommend looking at our Skill Gap Analyzer to find exactly what you should learn next for your target career."
            suggestions = ["Generate learning roadmap", "Best free learning resources"]
            
        else:
            response = "I can help with career advice, interview preparation, resume tips, or skill learning strategies. What would you like to know more about?"
            suggestions = ["Interview tips", "Salary expectations", "Resume advice", "What skills to learn"]
            
        return {
            "response": response,
            "suggestions": suggestions
        }
