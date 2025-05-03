from fastapi import APIRouter, HTTPException, status
from services.group_service import GroupService
from db.models.group import Group
from routers.dto.group_dto import CreateGroupDTO, MembersGroupDTO
from starlette.responses import JSONResponse
from typing import List
from db.models.travel_filter import TravelFilter

router = APIRouter(
    prefix="/groups",
    tags=["groups"],
    responses={404: {"description": "Not found"}},  
)

group_service = GroupService()

@router.get("", response_model=list[Group])
async def get_groups():
    group = await group_service.get_all_groups()
    return list(group) 

@router.get("/{group_id}", response_model=Group)
async def get_group(group_id: str):
    return await group_service.get_group_by_id(group_id)


@router.post("/recommendations/{user_id}", response_model=list[Group])
async def get_recomendations(
    user_id: str,
    travel_filter: TravelFilter
) -> list[Group]:
    return await group_service.get_recommended_groups_for_user(user_id, travel_filter)

@router.get("/user/{user_id}", response_model=list[Group])
async def get_groups_by_user_id(user_id: str) -> List[Group]:
    groups = await group_service.get_groups_by_user_id(user_id)
    if not groups:
        raise HTTPException(status_code=404, detail="No groups found for this user")
    return groups

@router.post("", response_model=Group, status_code=201)
async def create_group(
    group_dto: CreateGroupDTO
) -> Group:
    # Verificar si el username ya está en uso por otro usuario
    if await group_service.get_group_by_name(group_dto.name):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The group name already exists",
        )

    group_data = group_dto.model_dump()
    group = Group(**group_data)

    group = await group_service.add_group(group)
    return group


@router.put("/{group_id}", response_model=Group)
async def update_group(
    group_dto: CreateGroupDTO,
    group_id: str
) -> Group:
    # 1. Buscar el grupo actual
    existing_group = await group_service.get_group_by_id(group_id)
    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")

    # 2. Comprobar si el nuevo nombre ya está en uso por otro grupo
    group_with_same_name = await group_service.get_group_by_name(group_dto.name)
    if group_with_same_name and group_with_same_name.id != group_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The group name already exists",
        )

    # 3. Actualizar el grupo
    updated_group = await group_service.update_group(group_id, group_dto)
    if not updated_group:
        raise HTTPException(status_code=500, detail="Failed to update group")

    return updated_group



@router.delete("/{group_id}")
async def delete_user(
    group_id: str,
):
    success = await group_service.delete_group(group_id)
    if success:
        return {"message": "Group deleted successfully"}
    
    raise HTTPException(status_code=400, detail="Group not found")


@router.post("/{group_id}/add/members", response_model=Group)
async def add_members(
    group_id: str,
    members_dto: MembersGroupDTO
) -> Group:
    # 1. Buscar el grupo actual
    existing_group = await group_service.get_group_by_id(group_id)
    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")

    # 2. Agregar miembros al grupo
    success = await group_service.add_members(group_id, members_dto.members)
    if success:
        # 3. Obtener el grupo actualizado y devolverlo
        updated_group = await group_service.get_group_by_id(group_id)
        return updated_group  # Esto debe cumplir con el modelo Group
    else:
        raise HTTPException(status_code=400, detail="Failed to add members")
    
@router.post("/{group_id}/remove/members", response_model=Group)
async def remove_members(
    group_id: str,
    members_dto: MembersGroupDTO
) -> Group:
    # 1. Buscar el grupo actual
    existing_group = await group_service.get_group_by_id(group_id)
    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")


    if await group_service.remove_members(group_id, members_dto.members):
        return await group_service.get_group_by_id(group_id)
            
    else:
        raise HTTPException(status_code=400, detail="Failed to remove members")