import os
from pathlib import Path
from dotenv import load_dotenv, set_key

if os.environ.get("VERCEL"):
    ENV_PATH = Path('/tmp/.env')
else:
    # .env is in backend/
    ENV_PATH = Path(__file__).resolve().parents[1] / '.env'

# Touch .env if it doesn't exist
ENV_PATH.touch(exist_ok=True)

load_dotenv(dotenv_path=ENV_PATH)


def get_current_settings() -> dict:
    """Return current profile settings, reading fresh from env."""
    return {
        'GROQ_API_KEY': os.getenv('GROQ_API_KEY') or '',
        'OPENWEATHER_API_KEY': os.getenv('OPENWEATHER_API_KEY') or '',
        'GROQ_MODEL': os.getenv('GROQ_MODEL') or 'llama-3.3-70b-versatile',
        'GROQ_VISION_MODEL': os.getenv('GROQ_VISION_MODEL') or 'llama-3.2-11b-vision-preview',
        'GROQ_AUDIO_MODEL': os.getenv('GROQ_AUDIO_MODEL') or 'whisper-large-v3',
        'OPERATOR_NAME': os.getenv('OPERATOR_NAME') or 'Rahul Farmer',
        'FARM_DESIGNATION': os.getenv('FARM_DESIGNATION') or 'Vyra Primary Sector',
        'PREF_LANGUAGE': os.getenv('PREF_LANGUAGE') or 'en-US',
    }


def update_settings(data: dict) -> None:
    """Persist settings to .env and reload environment."""
    for key, value in data.items():
        set_key(str(ENV_PATH), key, value or '')
    # Reload so subsequent os.getenv calls reflect changes
    load_dotenv(dotenv_path=ENV_PATH, override=True)
    # Also update os.environ directly for running process
    for key, value in data.items():
        if value:
            os.environ[key] = value
        else:
            os.environ.pop(key, None)
