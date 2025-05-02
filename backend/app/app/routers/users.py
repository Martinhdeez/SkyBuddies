from fastapi import APIRouter, HTTPException, status
from services.user_service import UserService
from db.models.user import User
from routers.dto.user_dto import UserDTO

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},  
)

user_service = UserService()

@router.get("", response_model=list[User])
async def get_users():
    users = await user_service.get_all_users()
    return list(users) 


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    return await user_service.get_user_by_id(user_id)


@router.post("", response_model=User, status_code=201)
async def create_user(
    user_dto: UserDTO
):
    # Verificar si el username ya está en uso por otro usuario
    if await user_service.get_user_by_username(user_dto.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The username already exists",
        )

    # Verificar si el email ya está en uso por otro usuario
    if await user_service.get_user_by_email(user_dto.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The email already exists",
        )

    user_data = user_dto.model_dump()
    user = User(**user_data)

    user = await user_service.add_user(user)
    return user

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_dto: UserDTO,
    user_id: str
):
    existing_user = await user_service.get_user_by_id(user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verificar si el username ya está en uso por otro usuario
    user_with_same_username = await user_service.get_user_by_username(user_dto.username)
    if user_with_same_username and str(user_with_same_username.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The username already exists",
        )

    # Verificar si el email ya está en uso por otro usuario
    user_with_same_email = await user_service.get_user_by_email(user_dto.email)
    if user_with_same_email and str(user_with_same_email.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The email already exists",
        )

    update_data = user_dto.model_dump()

    success = await user_service.update_user(user_id, update_data)
    if success:
        user = await user_service.get_user_by_id(user_id)
        return user  

    raise HTTPException(status_code=400, detail="User not found")


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
):
    success = await user_service.delete_user(user_id)
    if success:
        return {"message": "User deleted successfully"}
    
    raise HTTPException(status_code=400, detail="User not found")


