import requests
from config.settings import settings
from services.ai_service import generate_weather_advice

def get_weather_data(city: str) -> dict:
    api_key = settings.OPENWEATHER_API_KEY
    if not api_key or api_key == "your_openweather_api_key_here":
        return _mock_weather()
        
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Weather API Error: {e}")
        return _mock_weather()
    
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    condition = data["weather"][0]["description"]
    
    advice = generate_weather_advice(temp, humidity, condition, settings.PREF_LANGUAGE)
    
    return {
        "temperature": temp,
        "humidity": humidity,
        "condition": condition,
        "agricultural_advice": advice
    }

def _mock_weather():
    import random
    temp = random.randint(22, 35)
    humidity = random.randint(40, 80)
    condition = random.choice(["clear sky", "few clouds", "scattered clouds", "light rain"])
    advice = generate_weather_advice(temp, humidity, condition, settings.PREF_LANGUAGE)
    return {
        "temperature": temp,
        "humidity": humidity,
        "condition": condition,
        "agricultural_advice": advice
    }
