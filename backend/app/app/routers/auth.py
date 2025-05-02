from fastapi import APIRouter, HTTPException, status, Depends
from app.routers.dto.user_dto import RegisterUserDTO, LoginUserDTO, ForgotPasswordDTO, ResetPasswordDTO
from app.db.models.token import Token
from app.services.autentication_service import *
from app.db.smtp_server.functions import send_reset_email
from datetime import timedelta
from jose import JWTError, jwt
import uuid

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={ status.HTTP_404_NOT_FOUND: {"message": "Not found"}}
)

@router.post("/register", response_model=User, status_code=201)
async def register(
    user_dto: RegisterUserDTO
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

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginUserDTO,
):
    user = await authenticate_user(login_data.username_or_email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generar un token de acceso con expiración
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"id": user.id ,"sub": user.username},
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/forgot-password", status_code=200)
async def forgot_password(user_dto: ForgotPasswordDTO):
    user = await user_service.get_user_by_email(user_dto.email)
    
    if not user or not user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this email does not exist",
        )

    # generate 1h-expirate token
    reset_token = str(uuid.uuid4())
    await user_service.save_reset_token(str(user.id), reset_token)  

    # send email
    await send_reset_email(user.email, reset_token)

    return {
        "message": "A password reset email has been sent.",
        "token": reset_token
    }


@router.post("/reset-password", status_code=200)
async def reset_password(reset_dto: ResetPasswordDTO):
    user = await user_service.get_user_by_reset_token(reset_dto.token)

    if not user or not user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )

    # save passwd
    await user_service.update_user_password(user.id, reset_dto.new_password)

    # expirate token
    await user_service.delete_reset_token(user.id)

    return {
        "message": "Password successfully reset."
    }

