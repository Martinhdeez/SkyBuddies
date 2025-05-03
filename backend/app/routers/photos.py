from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.photos_service import PhotosService
from db.models.photo import Photo

class MonumentRequest(BaseModel):
    monument: str

router = APIRouter()

@router.post("/photos", response_model=Photo)
async def get_photo(request: MonumentRequest):
    service = PhotosService()
    try:
        photos = service.get_photo(request.monument)
        if not photos:
            raise HTTPException(status_code=404, detail="No photos found for the specified monument")
        return photos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")