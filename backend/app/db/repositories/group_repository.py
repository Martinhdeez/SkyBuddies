from pydantic import EmailStr
from db.models.user import User
from db.repositories.repository import Repository
from db.client import groups_collection
from helpers.dict2model import convert_group_to_model
from typing import List
from datetime import datetime

class GroupRepository(Repository):
    def __init__(self):
        super().__init__(groups_collection, convert_group_to_model)

    async def get_group_by_name(self, name: str) -> User | None:
        group = await self.data_collection.find_one({"name": name})
        return self.convert_helper(group) if group else None

async def add_members(self, id: str, members: List[str]) -> bool:
    group = await self.data_collection.find_one({"id": id})
    if not group:
        return False

    await self.data_collection.update_one(
        {"id": id},
        {"$push": {"members": {"$each": members}}}
    )
    return True

async def remove_members(self, id: str, members: List[str]) -> bool:
    group = await self.data_collection.find_one({"id": id})
    if not group:
        return False

    await self.data_collection.update_one(
        {"id": id},
        {"$pull": {"members": {"$in": members}}}
    )
    return True

    

