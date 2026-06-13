from fastapi import APIRouter, HTTPException
from typing import List
from schemas.response_schema import FarmHistoryRecord, DailyBriefingResponse, DashboardSummaryResponse
from services.db_service import get_history, get_dashboard_summary
from services.ai_service import generate_daily_briefing

router = APIRouter()

@router.get("/farm-history", response_model=List[FarmHistoryRecord])
async def farm_history_endpoint():
    try:
        return get_history(limit=20)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard-summary", response_model=DashboardSummaryResponse)
async def dashboard_summary_endpoint():
    try:
        summary_data = get_dashboard_summary()
        return DashboardSummaryResponse(**summary_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/daily-briefing", response_model=DailyBriefingResponse)
async def daily_briefing_endpoint():
    try:
        history = get_history(limit=5)
        briefing = generate_daily_briefing(history)
        return DailyBriefingResponse(**briefing)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
