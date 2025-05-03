from db.repositories.chat_repository import ChatRepository
from db.models.chat import Chat
from datetime import datetime 

class ChatService:
    def __init__(self): 
        self.repository = ChatRepository()

    async def add_chat(self, chat_model: Chat):
        chat_model.updated_at = datetime.now()
        chat_model.created_at = datetime.now()
        return await self.repository.add_data(chat_model)

    async def get_chat_by_chat_id(self, chat_id: str):
        return await self.repository.get_chat_by_chat_id(chat_id)

    async def add_message_to_chat(self, chat_id: str, message_id: str):
        await self.repository.add_message(chat_id, message_id)

    async def delete_chat_by_id(self, chat_id: str): 
        if not await self.repository.delete_data(chat_id):
            raise ValueError("The chat could not be deleted")
        return True