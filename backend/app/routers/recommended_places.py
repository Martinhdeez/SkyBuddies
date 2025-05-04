from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from db.models.photo import Photo
from services.recommended_places_service import RecommendedPlacesService
from services.photos_service import PhotosService

router = APIRouter()
recommended_places_service = RecommendedPlacesService()
photos_service = PhotosService()

class CityRequest(BaseModel):
    city: str

@router.post("/recommended-places")
async def get_recommended_places(request: CityRequest):
    try:
        print(f"Fetching recommended places for city: {request.city}")
        recommended_places = await recommended_places_service.get_recommended_places(request.city, max_val=3)
        
        if not recommended_places:
            raise HTTPException(status_code=404, detail="No recommended places found")
        
        photos = []
        for place in recommended_places:
            try:
                print(f"Fetching photo for place: {place}")
                photo = photos_service.get_photo(place)
                if photo:
                    photos.append(photo.url)
            except Exception as e:
                print(f"Error fetching photo for place {place}: {str(e)}")
                continue

        return {
            "city": request.city,
            "recommended_places": recommended_places,
            "photos": photos
        }
    except HTTPException as e:
        print(f"HTTPException: {str(e)}")
        raise e
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")