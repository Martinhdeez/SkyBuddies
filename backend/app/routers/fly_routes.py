from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from db.repositories.fly_routes_repository import FlyRoutesRepository

router = APIRouter()

class BestFlyRouteRequest(BaseModel):
    origin_city: str
    destination_city: str
    travel_time: datetime
    low_cost: bool = True
    best_eco: bool = False
    group_members: int = 1

@router.post("/best-fly-route")
async def get_best_fly_route(request: BestFlyRouteRequest):
    repository = FlyRoutesRepository()
    best_route = repository.get_best_fly_route(
        origin_city=request.origin_city,
        destination_city=request.destination_city,
        travel_time=request.travel_time,
        low_cost=request.low_cost,
        best_eco=request.best_eco,
        group_members=request.group_members
    )

    if not best_route:
        raise HTTPException(status_code=404, detail="No route found matching the criteria")

    return {"best_route": best_route}