from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from uuid import UUID

class User(BaseModel):
    id: Optional[str] = Field(default=None, title="id")
    username: str 
    email: EmailStr
    full_name: Optional[str] = Field(default=None, title="full_name")
    password: str
    updated_at: datetime = Field(default=datetime.now(), title="updated_at")
    created_at: datetime = Field(default=datetime.now(), title="created_at")
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
                "id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "username": "Don Quixote",
                "full_name": "Miguel de Cervantes",
                "email": "quijote@example.com",
                "password": "$2b$12$iIPnJGo55f6whSS2tSSKhOKzHchUI4x7h68fMMrxh9XaQRGxh30di",
                "updated_at": "2022-02-15T15:47:34.568279",
                "created_at": "2022-02-15T15:47:34.568279"
        }
                
