from typing import Optional, Text
from pydantic import BaseModel, EmailStr, Field

class CreateGroupDTO(BaseModel):
    name: Text
    members: Optional[list[str]] = Field(default=list, title="Members of the group")


class MembersGroupDTO(BaseModel):
    members: Optional[list[str]] = Field(default=list, title="Members of the group")