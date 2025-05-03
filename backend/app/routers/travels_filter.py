from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from services.filter_service import FilterService
from db.models.travel_filter import TravelFilter

router = APIRouter(
    prefix="/filters",
    tags=["filters"],
    responses={404: {"description": "Not found"}},
)

filter_service = FilterService()

@router.get("/{filter_id}", response_model=TravelFilter)
async def get_filter(filter_id: str):
    return await filter_service.get_filter_by_id(filter_id)

@router.post("", response_model=TravelFilter, status_code=201)
async def create_filter(filter_dto: TravelFilter):  
    filter = FilterService()  # Create the service instance
    return await filter_service.add_filter(filter_dto)

@router.put("/{filter_id}", response_model=TravelFilter)  # Adjusted to return TravelFilter
async def update_filter(filter_dto: TravelFilter, filter_id: str):
    existing_filter = await filter_service.get_filter_by_id(filter_id)
    if not existing_filter:
        raise HTTPException(status_code=404, detail="filter not found")


    success = await filter_service.update_filter(filter_id, filter_dto)
    if success:
        return await filter_service.get_filter_by_id(filter_id)

    raise HTTPException(status_code=400, detail="filter not found")

@router.delete("/{filter_id}")
async def delete_filter(filter_id: str):
    success = await filter_service.delete_filter_by_id(filter_id)
    if success:
        return JSONResponse(
            content={"message": "filter deleted successfully"},
            status_code=status.HTTP_200_OK,
        )
    
    raise HTTPException(status_code=400, detail="filter not found")
