from pydantic import EmailStr
from typing import List
from backend.app.db.models.fly_route import FlyRoute
from db.repositories.repository import Repository
from db.repositories.fly_routes_repository import FlyRoutesRepository
from datetime import datetime, timedelta

class FlyRoutesService: 
    def __init__(self): 
        self.fly_routes_repository = FlyRoutesRepository()
    
    async def get_best_fly_route(self, origin_city: str, destination_city: str, travel_time: datetime, low_cost: bool, best_eco: bool, group_members: int = 1) -> FlyRoute | None:
        return await self.fly_routes_repository.get_best_fly_route(origin_city, destination_city, travel_time, low_cost, best_eco, group_members)