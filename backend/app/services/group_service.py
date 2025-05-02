from pydantic import EmailStr
from db.models.user import Group
from db.repositories.repository import Repository
from db.repositories.user_repository import GroupRepository
from datetime import datetime, timedelta

class UserService:
    def __init__(self):
        self.group_repository = GroupRepository()

    async def add_group(self, group : Group):
        return await self.group_repository.add_data(group)

    async def get_group_by_name(self, username: str) -> Group | None:
        return await self.group_repository.get_group_by_name(username)


    async def get_group_by_id(self, uid: str):
        return self.group_repository.get_data(uid)

    async def get_all_groups(self):
        return self.group_repository.get_all_data()

    async def update_group(self, uid: str, update_data: dict):
        return self.group_repository.update_data(uid, update_data)

    async def delete_group(self, uid: str):
        return self.group_repository.delete_data(uid)

    async def add_members(self, uid: str, members: list[str]) -> bool:
        return await self.group_repository.add_members(uid, members)
    
    async def remove_members(self, uid: str, members: list[str]) -> bool:
        return await self.group_repository.remove_members(uid, members)
    
