from typing import Optional, Text, List
from pydantic import BaseModel, EmailStr, Field
from db.models.group import GroupVisibility
from db.models.travel_filter import TravelFilter

class CreateGroupDTO(BaseModel):
    name: Text
    visibility: Optional[GroupVisibility] = Field(default=GroupVisibility.PUBLIC, title="Visibility of the group")
    users_travel_filter: List[TravelFilter]  #solo uno 
    members: List[str]  # user_id

class AddMembersGroupDTO(BaseModel):
    users_travel_filter: List[TravelFilter]
    members: List[str] 
    
class DeleteMembersGroupDTO(BaseModel):
    members: List[str]