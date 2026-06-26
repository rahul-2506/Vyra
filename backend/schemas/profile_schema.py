from pydantic import BaseModel, Field

class ProfileSettings(BaseModel):
    GROQ_API_KEY: str = Field(default="", description="Groq API key")
    OPENWEATHER_API_KEY: str = Field(default="", description="OpenWeather API key")
    GROQ_MODEL: str = Field(default="llama-3.3-70b-versatile")
    GROQ_VISION_MODEL: str = Field(default="llama-3.2-11b-vision-preview")
    GROQ_AUDIO_MODEL: str = Field(default="whisper-large-v3")
    OPERATOR_NAME: str = Field(default="", description="Operator / farmer name")
    FARM_DESIGNATION: str = Field(default="", description="Farm designation / label")
