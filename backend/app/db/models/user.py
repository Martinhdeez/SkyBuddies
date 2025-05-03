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
