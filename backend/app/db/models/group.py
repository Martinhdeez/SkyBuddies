from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from uuid import UUID
from db.models.travel_filter import TravelFilter 

class GroupVisibility(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"

class Group(BaseModel):
    id: Optional[str] = Field(default=None, title="id")
    name: str
    members: List[str]
    visibility: Optional[GroupVisibility] = Field(default=GroupVisibility.PUBLIC, title="visibility")
    travel_filter_mean: Optional[TravelFilter] = Field(default=None, title="travel_filter")
    users_travel_filter: Optional[List[TravelFilter]] = Field(default=[], title="users_travel_filter")
    admins: Optional[List[str]] = Field(default=[], title="admins")
    updated_at: datetime = Field(default=datetime.now(), title="updated_at")
    created_at: datetime = Field(default=datetime.now(), title="created_at")