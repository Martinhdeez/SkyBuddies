from typing import Optional, Text
from pydantic import BaseModel, EmailStr, Field
from db.models.group import GroupVisibility

class CreateGroupDTO(BaseModel):
    name: Text
    members: Optional[list[str]] = Field(default=list, title="Members of the group")
    visibility: Optional[GroupVisibility] = Field(default=GroupVisibility.PUBLIC, title="Visibility of the group")


class MembersGroupDTO(BaseModel):
    members: Optional[list[str]] = Field(default=list, title="Members of the group")