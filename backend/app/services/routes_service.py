from pydantic import EmailStr
from typing import List
from db.models.route import Route
from db.repositories.repository import Repository
from db.repositories.routes_repository import RoutesRepository
from datetime import datetime, timedelta

class RoutesService: 
    def __init__(self): 
        self.routes_repository = RoutesRepository()
    
    async def get_best_route(self, origin_city: str, destination_city: str, travel_time: datetime, low_cost: bool, best_eco: bool, group_members: int = 1) -> Route | None:
        return await self.routes_repository.get_best_route(origin_city, destination_city, travel_time, low_cost, best_eco, group_members)