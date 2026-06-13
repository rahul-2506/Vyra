import requests
from config.settings import settings
from services.ai_service import generate_weather_advice

def get_weather_data(city: str) -> dict:
    api_key = settings.OPENWEATHER_API_KEY
    if not api_key:
        raise ValueError("OpenWeather API key not configured. Please set OPENWEATHER_API_KEY in .env")
        
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    condition = data["weather"][0]["description"]
    
    advice = generate_weather_advice(temp, humidity, condition)
    
    return {
        "temperature": temp,
        "humidity": humidity,
        "condition": condition,
        "agricultural_advice": advice
    }
