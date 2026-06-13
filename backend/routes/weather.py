from fastapi import APIRouter, HTTPException
from schemas.response_schema import WeatherResponse
from services.weather_service import get_weather_data

router = APIRouter()

@router.get("/weather", response_model=WeatherResponse)
async def weather_endpoint(city: str):
    try:
        weather_data = get_weather_data(city)
        return WeatherResponse(**weather_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather data: {str(e)}")
