import json
from groq import Groq
from config.settings import settings

def analyze_farmer_query(message: str, language: str) -> dict:
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    system_prompt = """You are Vyra, an agricultural AI assistant.
Analyze farmer queries and return highly structured agricultural responses as valid JSON.

Format your response EXACTLY like this:
{
  "crop": "crop name",
  "issue": "identified issue",
  "risk": "risk level or potential damage",
  "recommendation": "practical solution"
}

Recommendations should be practical, concise, and farmer-friendly. Reply ONLY with valid JSON."""

    user_prompt = f"Language: {language}\nQuery: {message}"

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model=settings.GROQ_MODEL,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print("===== GROQ ERROR =====")
        print(str(e))
        print("======================")
        return {
            "crop": "Unknown",
            "issue": "Unable to determine",
            "risk": "Unknown",
            "recommendation": "Please consult a local agricultural expert and try again."
        }

from datetime import datetime

def generate_daily_briefing(history: list) -> dict:
    if not settings.GROQ_API_KEY:
        return {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "summary": "Briefing unavailable. Missing API Key.",
            "recommendations": ["Configure API key to see recommendations."]
        }
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    history_str = json.dumps(history, indent=2) if history else "No recent history."
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    system_prompt = f"""You are Vyra, a professional agricultural AI co-pilot.
Generate a daily agricultural briefing.
Current date: {current_date}
Recent farm history: {history_str}

General farming best practices should also be considered.

Format EXACTLY as valid JSON:
{{
  "date": "{current_date}",
  "summary": "1-2 sentences summarizing farm conditions",
  "recommendations": [
    "practical recommendation 1",
    "practical recommendation 2",
    "practical recommendation 3"
  ]
}}
Reply ONLY with valid JSON.
"""

    try:
        response = client.chat.completions.create(
            messages=[{"role": "system", "content": system_prompt}],
            model=settings.GROQ_MODEL,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print("===== GROQ DAILY BRIEFING ERROR =====")
        print(str(e))
        print("=====================================")
        return {
            "date": current_date,
            "summary": "Conditions appear favorable for crop monitoring and irrigation planning.",
            "recommendations": [
                "Inspect crops for nutrient deficiencies.",
                "Monitor irrigation schedules.",
                "Avoid unnecessary fertilizer application."
            ]
        }

def generate_weather_advice(temperature: float, humidity: float, condition: str) -> str:
    if not settings.GROQ_API_KEY:
        return "Monitor your crops closely given current weather conditions."
        
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    system_prompt = "You are Vyra, an agricultural AI assistant. Provide a brief, one-sentence practical agricultural advice based on the current weather. Reply ONLY with the advice."
    user_prompt = f"Weather: {condition}, Temp: {temperature}C, Humidity: {humidity}%"
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model=settings.GROQ_MODEL
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("===== GROQ ERROR =====")
        print(str(e))
        print("======================")
        return "Monitor your crops closely given current weather conditions."
