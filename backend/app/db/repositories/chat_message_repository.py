from db.repositories.repository import Repository 
from db.models.chat import ChatMessage 
from db.repositories.repository import Repository 
from typing import List
from db.client import messages_collection
from helpers.dict2model import convert_message_to_model

class MessageRepository(Repository): 
    def __init__(self): 
        super().__init__(messages_collection, convert_message_to_model)

    async def get_all_messages_by_chat_id(self, chat_id: str) -> List[ChatMessage]:
       cursor = self.data_collection.find({"chat_id": chat_id}).sort("updated_at", 1)
       messages = await cursor.to_list(length=None)
       return [self.convert_helper(message) for message in messages]

    async def get_n_messages_by_chat_id(self, chat_id: str, n: int, incr: int) -> List[ChatMessage]: 
        cursor =  self.data_collection.find({"chat_id": chat_id}).sort("updated_at", -1).limit(n*incr)
        messages = await cursor.to_list(length=None)
        return [self.convert_helper(message) for message in messages]