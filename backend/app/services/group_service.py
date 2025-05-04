from pydantic import BaseModel
from typing import List, Optional
from db.models.group import Group
from db.models.travel_filter import TravelFilter
from db.repositories.group_repository import GroupRepository, GroupVisibility
from datetime import datetime, timedelta


# Función para aplanar las preferencias de TravelFilter a un diccionario plano
def flatten_travel_filter(tf: TravelFilter) -> dict:
    flat = {}
    if not tf:
        return flat
    for field in tf.__fields__:
        value = getattr(tf, field)
        if isinstance(value, BaseModel):
            for subfield in value.__fields__:
                flat_key = f"{field}.{subfield}"
                flat[flat_key] = getattr(value, subfield, False)
        else:
            flat[field] = value if value is not None else False
    return flat


# Función para calcular la distancia de Hamming entre dos diccionarios
def hamming_distance(dict1: dict, dict2: dict) -> float:
    keys = set(dict1.keys()).union(set(dict2.keys()))
    distance = 0
    for key in keys:
        v1 = dict1.get(key, False)
        v2 = dict2.get(key, False)
        distance += 1 if v1 != v2 else 0
    return distance


class GroupService:
    def __init__(self):
        self.group_repository = GroupRepository()

    async def add_group(self, group: Group):
        return await self.group_repository.add_data(group)

    async def get_groups_by_user_id(self, user_id: str) -> List[Group]:
        return await self.group_repository.get_all_groups_by_user(user_id)

    async def get_group_by_name(self, username: str) -> Optional[Group]:
        return await self.group_repository.get_group_by_name(username)

    async def get_group_by_id(self, uid: str) -> Optional[Group]:
        return await self.group_repository.get_data(uid)

    async def get_all_public_groups(self) -> List[Group]:
        return await self.group_repository.get_all_public_groups()

    async def get_group_by_code(self, code: str) -> Optional[Group]:
        return await self.group_repository.get_group_by_code(code)
    
    async def update_group(self, uid: str, update_data: dict):
        return await self.group_repository.update_data(uid, update_data)

    async def delete_group(self, uid: str):
        return await self.group_repository.delete_data(uid)

    async def add_members(self, uid: str,members: List[str], preferences: List[TravelFilter]) -> bool:
        return await self.group_repository.add_members(uid, members, preferences)

    async def remove_members(self, uid: str, members: List[str]) -> bool:
        return await self.group_repository.remove_members(uid, members)

    async def get_recommended_groups_for_user(self, user_id: str, user_preferences: TravelFilter, limit: int = 3) -> List[Group]:
        # Convertir las preferencias del usuario en un diccionario plano
        user_vector = flatten_travel_filter(user_preferences)

        # Obtener todos los grupos públicos
        groups = await self.group_repository.get_all_others_public_groups(user_id)
        scored_groups = []

        # Comparar las preferencias del usuario con las de cada grupo
        for group in groups:
            group_filter_data = group.travel_filter_mean
        
            group_vector = flatten_travel_filter(group_filter_data)

            # Calcular la distancia (similitud) entre las preferencias del usuario y las del grupo
            distance = hamming_distance(user_vector, group_vector)
            scored_groups.append((distance, group))

        # Ordenar los grupos por la distancia (menor distancia = mayor afinidad)
        scored_groups.sort(key=lambda x: x[0])

        # Devolver los grupos más afines (limitados por el parámetro 'limit')
        return [group[1] for group in scored_groups[:limit]]
