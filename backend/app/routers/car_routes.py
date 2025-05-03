from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from db.repositories.car_routes_repository import CarRoutesRepository

router = APIRouter()

class BestCarRouteRequest(BaseModel):
    market: str  
    locale: str  
    currency: str  
    pick_up_time: datetime  
    drop_off_time: datetime 
    pick_up_location: str 
    drop_off_location: Optional[str] = None  
    driver_age: int  
    low_cost: bool  
    best_eco: bool 

@router.post("/best-car-route")
async def get_best_car_route(request: BestCarRouteRequest):
    repository = CarRoutesRepository()
    best_route = repository.get_best_car_route(
        market=request.market,
        locale=request.locale,
        currency=request.currency,
        pick_up_time=request.pick_up_time,
        drop_off_time=request.drop_off_time,
        pick_up_location=request.pick_up_location,
        drop_off_location=request.drop_off_location,
        driver_age=request.driver_age, 
        low_cost=request.low_cost,
        best_eco=request.best_eco
    )

    if not best_route:
        raise HTTPException(status_code=404, detail="No route found matching the criteria")

    return {"best_route": best_route}