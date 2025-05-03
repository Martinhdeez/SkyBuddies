from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from db.repositories.fly_routes_repository import FlyRoutesRepository
from services.group_service import GroupService
from db.models.travel_filter import TravelFilter
from services.gemini_service import GeminiService

class BestFlyRouteRequest(BaseModel): 
    travel_filter: TravelFilter
    group_id: str
    destination_city: str

router = APIRouter()
group_service = GroupService()
gemini_service = GeminiService()

async def process_filters(info: BestFlyRouteRequest):
    travel_time = info.travel_filter.date
    eco_travel = info.travel_filter.eco_travel
    low_cost = info.travel_filter.low_cost
    origin_city = info.travel_filter.departure_city
    group = await group_service.get_group_by_id(info.group_id)
    destination_city = info.destination_city

    return {
        "travel_time": travel_time,
        "eco_travel": eco_travel,
        "low_cost": low_cost,
        "origin_city": origin_city,
        "destination_city": destination_city,
        "group_members": len(group.members) if group else 0
    }

@router.post("/best-fly-route")
async def get_best_fly_route(request: BestFlyRouteRequest):
    repository = FlyRoutesRepository()

    params = await process_filters(request)

    origin_city = params["origin_city"].upper()
    destination_city = params["destination_city"].upper()

    try:
        best_route = repository.get_best_fly_route_with_retry(
            origin_city=origin_city,
            destination_city=destination_city,
            travel_time=params["travel_time"],
            low_cost=params["low_cost"],
            best_eco=params["eco_travel"],
            group_members=params["group_members"],
            retries=3
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching the best route: {str(e)}"
        )

    if not best_route:
        raise HTTPException(status_code=404, detail="No route found matching the criteria")

    return {"best_route": best_route}