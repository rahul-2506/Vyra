from groq import Groq
from config.settings import settings

def transcribe_audio(audio_bytes: bytes, filename: str) -> str:
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
        
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    print(f"[Vyra Voice Service] Transcribing {filename} using {settings.GROQ_AUDIO_MODEL}")
    
    try:
        transcription = client.audio.transcriptions.create(
            file=(filename, audio_bytes),
            model=settings.GROQ_AUDIO_MODEL,
        )
        return transcription.text
    except Exception as e:
        print("===== GROQ AUDIO ERROR =====")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Details: {str(e)}")
        print("=============================")
        raise Exception(f"Failed to transcribe audio: {str(e)}")
