from pydantic import EmailStr
from db.repositories.repository import Repository
from db.repositories.filter_repository import FilterRepository
from datetime import datetime, timedelta
from db.models.travel_filter import TravelFilter

class FilterService:
    def __init__(self): 
        self.repository = FilterRepository()

    async def add_filter(self, filter_model): 
        return await self.repository.add_data(filter_model)
    
    async def update_filter(self, uid: str, update_data: dict):
        return await self.repository.update_data(uid, update_data)
    
    async def get_filter_by_id(self, uid: str) -> TravelFilter:
        return await self.repository.get_data(uid)
    
    async def get_one_filter(self):
        filters = await self.repository.get_all_data()
        if not filters:
            return None
        return filters[0]
    
    async def delete_filter_by_id(self, uid: str):
        return await self.repository.delete_data(uid)
    
    async def get_all_filters(self):
        return await self.repository.get_all_data()