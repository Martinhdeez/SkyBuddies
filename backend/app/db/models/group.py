from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from uuid import UUID

class GroupVisibility(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"

class Group(BaseModel):
    id: Optional[str] = Field(default=None, title="id")
    name: str
    members: List[str]
    visibility: Optional[GroupVisibility] = Field(default=GroupVisibility.PUBLIC, title="visibility")
    updated_at: datetime = Field(default=datetime.now(), title="updated_at")
    created_at: datetime = Field(default=datetime.now(), title="created_at")