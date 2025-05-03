from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from services.recommended_places_service import RecommendedPlacesService

router = APIRouter()
recommended_places_service = RecommendedPlacesService()

class CityRequest(BaseModel):
    city: str

@router.post("/recommended-places")
async def get_recommended_places(request: CityRequest):
    
    try:
        recommended_places = await recommended_places_service.get_recommended_places(request.city)
        
        if not recommended_places:
            raise HTTPException(status_code=404, detail="No recommended places found")
        
        return {"recommended_places": recommended_places}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")