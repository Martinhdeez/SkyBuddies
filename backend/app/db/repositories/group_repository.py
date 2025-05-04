from typing import List, Optional, Type, TypeVar
from datetime import datetime
from collections import defaultdict
from pydantic import BaseModel
from fastapi import HTTPException

from db.models.mean_filter import MeanFilter
from db.models.group import Group, GroupVisibility
from db.models.travel_filter import (
    TravelFilter,
    Climate,
    Food,
    Weather,
    Activities,
    Events,
    Continents,
    Entorno,
)

from db.client import groups_collection
from db.repositories.repository import Repository
from helpers.dict2model import convert_group_to_model



def most_popular_filters(travel_filters: List[TravelFilter]) -> MeanFilter:
    filters_counter = MeanFilter()
    for travel_filter in travel_filters:
        if travel_filter.get("climate"):
            for(k, v) in travel_filter.get("climate").items():
                if v:
                    filters_counter.climate.increase_climate_counter(k)
                    
        if travel_filter.get("food"):
            for(k, v) in travel_filter.get("food").items():
                if v:
                    filters_counter.food.increase_food_counter(k)
                    
        if travel_filter.get("weather"):
            for(k, v) in travel_filter.get("weather").items():
                if v:
                    filters_counter.weather.increase_weather_counter(k)
                    
        if travel_filter.get("activities"):
            for(k, v) in travel_filter.get("activities").items():
                if v:
                    filters_counter.activities.increase_activities_counter(k)
        
        if travel_filter.get("events"):
            for(k, v) in travel_filter.get("events").items():
                if v:
                    filters_counter.events.increase_events_counter(k)
        
        if travel_filter.get("continents"):
            for(k, v) in travel_filter.get("continents").items():
                if v:
                    filters_counter.continents.increase_continents_counter(k)
                
        if travel_filter.get("entorno"):
            for(k, v) in travel_filter.get("entorno").items():
                if v:
                    filters_counter.entorno.increase_entorno_counter(k)
            
        if travel_filter.get("eco_travel"):
            filters_counter.increase_eco_travel_counter()    
        else :         
            filters_counter.increase_no_eco_travel_counter()  
        
        if travel_filter.get("low_cost"):
            filters_counter.increase_low_cost_counter()
        else :
            filters_counter.increase_no_low_cost_counter()
            
    return filters_counter.to_travel_filter()   


class GroupRepository(Repository):
    def __init__(self):
        super().__init__(groups_collection, convert_group_to_model)

    async def add_members(
        self, id: str, members: List[str], preferences: List[TravelFilter]
    ) -> bool:
        # Buscar el grupo
        group = await self.data_collection.find_one({"id": id})
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")


        # Añadir miembros y filtros de usuario
        await self.data_collection.update_one(
            {"id": id},
            {
                "$push": {
                    "members": {"$each": [member.model_dump() if hasattr(member, 'model_dump') else member for member in members]},
                    "users_travel_filter": {"$each": [filter.model_dump() if hasattr(filter, 'model_dump') else filter for filter in preferences]},
                },
                "$set": {"updated_at": datetime.now()},
            },
        )
        
        group = await self.data_collection.find_one({"id": id})
        print(f"Group after adding members: {group["users_travel_filter"]}")
        
        popular_filters = most_popular_filters(group["users_travel_filter"])
        print(f"Popular filters: {popular_filters}")
        popular_filters.departure_city = group['users_travel_filter'][0]['departure_city']
        await self.data_collection.update_one(
            {"id": id},
            {
                "$set": {
                    "travel_filter_mean": popular_filters.model_dump(mode="json", by_alias=True),
                    "updated_at": datetime.now(),
                }
            },
        )

        return True

    async def remove_members(self, id: str, members: List[str]) -> bool:
        group = await self.data_collection.find_one({"id": id})
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        await self.data_collection.update_one(
            {"id": id},
            {
                "$pull": {
                    "members": {"$in": members},
                    "users_travel_filter": {"user_id": {"$in": members}},
                },
                "$set": {"updated_at": datetime.now()},
            },
        )
        return True

    async def get_all_groups_by_user(self, user_id: str) -> List[Group]:
        cursor = self.data_collection.find({"members": user_id})
        docs = await cursor.to_list(None)
        return [self.convert_helper(d) for d in docs]

    async def get_all_public_groups(self) -> List[Group]:
        cursor = self.data_collection.find(
            {"visibility": GroupVisibility.PUBLIC}
        )
        docs = await cursor.to_list(None)
        
        print(f"Groups: {docs}")
        return [self.convert_helper(d) for d in docs]

    async def get_all_others_public_groups(self, user_id: str) -> List[Group]:
        cursor = self.data_collection.find(
            {"members": {"$ne": user_id}, "visibility": GroupVisibility.PUBLIC}
        )
        docs = await cursor.to_list(None)
        return [self.convert_helper(d) for d in docs]
        
    async def get_group_by_name(self, name: str) -> Optional[Group]:
        doc = await self.data_collection.find_one({"name": name})
        return self.convert_helper(doc) if doc else None
    
    async def get_group_by_code(self, code: str) -> Group:
        doc = await self.data_collection.find_one({"code": code})
        if not doc:
            return HTTPException(status_code=404, detail="Group not found")
        return self.convert_helper(doc)