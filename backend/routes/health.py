from fastapi import APIRouter
from schemas.response_schema import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_endpoint():
    return HealthResponse(status="healthy")
