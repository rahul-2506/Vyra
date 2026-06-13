import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
    GROQ_MODEL = "llama-3.3-70b-versatile"
    GROQ_VISION_MODEL = "llama-3.2-11b-vision-preview"
    GROQ_AUDIO_MODEL = "whisper-large-v3"

settings = Settings()
