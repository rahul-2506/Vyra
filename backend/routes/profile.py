from fastapi import APIRouter, HTTPException
from schemas.profile_schema import ProfileSettings
from services.profile_service import get_current_settings, update_settings

router = APIRouter()

@router.get("/profile", response_model=ProfileSettings)
async def get_profile():
    """Return current profile settings from .env."""
    try:
        return ProfileSettings(**get_current_settings())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile", response_model=ProfileSettings)
async def update_profile(settings: ProfileSettings):
    """Update profile settings and persist to .env file."""
    try:
        update_settings(settings.dict())
        return ProfileSettings(**get_current_settings())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
