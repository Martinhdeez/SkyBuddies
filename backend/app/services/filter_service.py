from pydantic import EmailStr
from db.repositories.repository import Repository
from db.repositories.filter_repository import FilterRepository
from datetime import datetime, timedelta

class FilterService:
    def __init__(self): 
        self.repository = FilterRepository()

    async def add_filter(self, filter_model): 
        filter_model.updated_at = datetime.now()
        filter_model.created_at = datetime.now()
        return await self.repository.add_data(filter_model)