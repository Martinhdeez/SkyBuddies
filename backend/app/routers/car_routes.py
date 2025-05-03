from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from db.repositories.car_routes_repository import CarRoutesRepository

router = APIRouter()

class BestCarRouteRequest(BaseModel):
    origin_city: str
    destination_city: str
    pick_up_time: datetime
    drop_off_time: datetime
    low_cost: bool
    best_eco: bool
    driver_age: int  

@router.post("/best-car-route")
async def get_best_car_route(request: BestCarRouteRequest):
    repository = CarRoutesRepository()
    best_route = repository.get_best_car_route(
        origin_city=request.origin_city,
        destination_city=request.destination_city,
        pick_up_time=request.pick_up_time,
        drop_off_time=request.drop_off_time,
        low_cost=request.low_cost,
        best_eco=request.best_eco,
        driver_age=request.driver_age,
    )

    if not best_route:
        raise HTTPException(status_code=404, detail="No route found matching the criteria")

    return {"best_route": best_route}