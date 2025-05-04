from pydantic import BaseModel
from typing import Text 

class ChatDTO(BaseModel):
    sender_uid: Text
    group_id: Text

class ChatMessageDTO(BaseModel): 
    sender_uid: Text 
    message: Text
    chat_id: Text