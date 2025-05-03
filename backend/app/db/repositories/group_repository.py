from pydantic import EmailStr
from db.models.group import Group, GroupVisibility
from db.repositories.repository import Repository
from db.client import groups_collection
from helpers.dict2model import convert_group_to_model
from typing import List
from datetime import datetime

class GroupRepository(Repository):
    def __init__(self):
        super().__init__(groups_collection, convert_group_to_model)

    async def get_group_by_name(self, name: str) -> Group | None:
        group = await self.data_collection.find_one({
            "name": name,
            "visibility": "public"  # Asegúrate de que este campo se guarda como string
        })
    
        return self.convert_helper(group) if group else None

    async def add_members(self, id: str, members: List[str]) -> bool:
        group = await self.data_collection.find_one({"id": id})
        if not group:
            return False

        # Filtrar miembros que ya están en el grupo
        existing_members = set(group.get("members", []))
        new_members = [member for member in members if member not in existing_members]

        if not new_members:
            return True  # No hay nuevos miembros para agregar

        # Agregar solo los nuevos miembros
        await self.data_collection.update_one(
            {"id": id},
            {"$push": {"members": {"$each": new_members}}}
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

    async def get_all_groups_by_user(self, user_id: str) -> List[Group]:
        # Usamos `find` para hacer la consulta a MongoDB y luego convertimos los resultados
        cursor = self.data_collection.find({"members": user_id})
        groups = await cursor.to_list(None)  # Convierte el cursor en una lista
        return [self.convert_helper(group) for group in groups]

    async def get_all_public_groups(self) -> List[Group]:
        # Usamos `find` para obtener solo los grupos públicos
        cursor = self.data_collection.find({"visibility": GroupVisibility.PUBLIC})
        groups = await cursor.to_list(None)  # Convierte el cursor en una lista
        return [self.convert_helper(group) for group in groups]
