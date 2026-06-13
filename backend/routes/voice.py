from fastapi import APIRouter, File, UploadFile, HTTPException
from schemas.response_schema import VoiceQueryResponse, ChatAnalysis
from services.voice_service import transcribe_audio
from services.ai_service import analyze_farmer_query
from services.db_service import save_query

router = APIRouter()

@router.post("/voice-query", response_model=VoiceQueryResponse)
async def voice_query_endpoint(file: UploadFile = File(...)):
    try:
        # Many audio formats might not have an exact audio/ content type depending on the client (e.g. video/mp4 for m4a)
        # So we do a loose check or just attempt transcription
        if not (file.content_type.startswith("audio/") or file.content_type.startswith("video/") or file.content_type == "application/octet-stream"):
            raise HTTPException(status_code=400, detail=f"File content type {file.content_type} not supported. Please upload audio.")
            
        audio_bytes = await file.read()
        
        # 1. Convert speech to text
        transcript = transcribe_audio(audio_bytes, file.filename)
        
        if not transcript.strip():
            raise HTTPException(status_code=400, detail="Could not detect speech in the audio file.")
        
        # 2. Send transcript to existing agricultural analysis service
        analysis_data = analyze_farmer_query(transcript, "English")
        
        # Save memory
        try:
            save_query(transcript, analysis_data)
        except Exception as e:
            print(f"Failed to save voice query to DB: {e}")
        
        analysis = ChatAnalysis(
            crop=analysis_data.get("crop", "Unknown"),
            issue=analysis_data.get("issue", "Unknown"),
            risk=analysis_data.get("risk", "Unknown"),
            recommendation=analysis_data.get("recommendation", "No recommendation available")
        )
        
        return VoiceQueryResponse(
            transcript=transcript,
            analysis=analysis
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
