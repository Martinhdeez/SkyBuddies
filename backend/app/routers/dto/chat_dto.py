from pydantic import BaseModel
from typing import Text 

class ChatDTO(BaseModel):
    sender_uid: Text
    receiver_uid: Text
    property_id: Text

class ChatMessageDTO(BaseModel): 
    sender_uid: Text 
    receiver_uid: Text
    favorite: bool 
    seen: bool