from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from uuid import UUID

class Group(BaseModel):
    id: UUID
    name: str
    members: List[str]
    created_at: datetime
    updated_at: datetime