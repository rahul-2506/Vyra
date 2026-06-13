from pydantic import BaseModel
from typing import Optional

class ChatAnalysis(BaseModel):
    crop: str
    issue: str
    risk: str
    recommendation: str

class ChatResponse(BaseModel):
    query: str
    analysis: ChatAnalysis

class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    condition: str
    agricultural_advice: str

class HealthResponse(BaseModel):
    status: str

class CropDiagnosisResponse(BaseModel):
    crop: str
    disease: str
    severity: str
    recommendation: str

class VoiceQueryResponse(BaseModel):
    transcript: str
    analysis: ChatAnalysis

class FarmHistoryRecord(BaseModel):
    query: str
    analysis: dict
    timestamp: str

class DailyBriefingResponse(BaseModel):
    date: str
    summary: str
    recommendations: list[str]

class RecentActivityRecord(BaseModel):
    query: str
    timestamp: str

class DashboardSummaryResponse(BaseModel):
    total_queries: int
    last_query: str
    last_issue: str
    recent_activity: list[RecentActivityRecord]
