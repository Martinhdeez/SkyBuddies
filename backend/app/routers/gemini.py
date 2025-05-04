from fastapi import APIRouter, HTTPException
from services.gemini_service import GeminiService
from db.models.travel_filter import TravelFilter

router = APIRouter()

gemini_service = GeminiService()

@router.post("/recommend-cities")
async def recommend_countries(travel_filter: TravelFilter):
    try:
        result = gemini_service.recommend_countries(travel_filter.model_dump())
        return {
            "recommended_cities": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")
