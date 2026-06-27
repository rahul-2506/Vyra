from fastapi import APIRouter
from services.market_service import get_market_prices

router = APIRouter()

@router.get("/market")
def get_market_data(location: str = "Local Mandi"):
    prices = get_market_prices(location)
    return {"location": location, "prices": prices}
