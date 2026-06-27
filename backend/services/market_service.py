import json
from groq import Groq
from config.settings import settings

def get_market_prices(location: str = "Local Mandi"):
    """
    Uses Groq to generate realistic, dynamic market prices for a given location,
    avoiding static mock data while bypassing the need for a dedicated Mandi API key.
    """
    if not settings.GROQ_API_KEY:
        return _fallback_prices()
        
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    prompt = f"""You are an agricultural market data API. 
Provide current, realistic estimated market prices (in INR per quintal) for 4 major crops in {location}.
Return ONLY a valid JSON array of objects with keys: "crop", "price" (integer), "trend" ("up", "down", or "stable"), and "change" (string like "+50", "-20", "0").
Example format:
[
  {{"crop": "Wheat", "price": 2350, "trend": "up", "change": "+50"}}
]
"""
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            temperature=0.3
        )
        content = response.choices[0].message.content
        # Try to parse JSON from response (handling potential markdown formatting)
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
            
        return json.loads(content.strip())
    except Exception as e:
        print(f"Groq Market API Error: {e}")
        return _fallback_prices()

def _fallback_prices():
    import random
    return [
        {"crop": "Wheat", "price": random.randint(2200, 2400), "trend": "up", "change": "+50"},
        {"crop": "Rice", "price": random.randint(3500, 3800), "trend": "down", "change": "-20"},
        {"crop": "Cotton", "price": random.randint(6800, 7100), "trend": "up", "change": "+120"},
        {"crop": "Soybean", "price": random.randint(4500, 4800), "trend": "stable", "change": "0"},
    ]
