from fastapi import APIRouter, HTTPException
from schemas.chat_schema import ChatRequest
from schemas.response_schema import ChatResponse, ChatAnalysis
from services.ai_service import analyze_farmer_query
from services.db_service import save_query

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        analysis_data = analyze_farmer_query(request.message, request.language)
        
        # Save memory
        try:
            save_query(request.message, analysis_data)
        except Exception as e:
            print(f"Failed to save query to DB: {e}")
        
        analysis = ChatAnalysis(
            crop=analysis_data.get("crop", "Unknown"),
            issue=analysis_data.get("issue", "Unknown"),
            risk=analysis_data.get("risk", "Unknown"),
            recommendation=analysis_data.get("recommendation", "No recommendation available")
        )
        
        return ChatResponse(
            query=request.message,
            analysis=analysis
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
