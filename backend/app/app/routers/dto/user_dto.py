from typing import Optional, Text
from pydantic import BaseModel, EmailStr, Field
from db.models.user import UserRole

class RegisterUserDTO(BaseModel):
    username: Text
    email: EmailStr
    full_name: Optional[Text] = Field(default=None, title="full_name")
    password: Text

class LoginUserDTO(BaseModel):
    username_or_email: Text
    password: Text

class ForgotPasswordDTO(BaseModel):
    email: EmailStr

class ResetPasswordDTO(BaseModel):
    token: str
    new_password: str
