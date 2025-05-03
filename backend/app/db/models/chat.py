from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class ChatMessage(BaseModel):
    id: Optional[str] = Field(default=None, title="id")
    sender_uid: str
    receiver_uid: str
    chat_id: str
    message: str
    favorite: Optional[bool] = Field(default=False, title="favorite")
    seen: Optional[bool] = Field(default=False, title="seen")
    updated_at: Optional[datetime] = Field(default=datetime.now(), title="updated_at")
    created_at:  Optional[datetime] = Field(default=datetime.now(), title="created_at")

    class Config:
        from_attributes = True


class Chat(BaseModel):
    id: Optional[str] = Field(default=None, title="id")
    sender_uid : str
    receiver_uid : str
    property_id: str
    messages : Optional[List[str]] = Field(default=[], title="messages") # id_message
    updated_at: Optional[datetime] = Field(default=datetime.now(), title="updated_at")
    created_at: Optional[datetime] = Field(default=datetime.now(), title="created_at")