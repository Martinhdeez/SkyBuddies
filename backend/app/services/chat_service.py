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

    async def get_chat_by_uid(self, uid: str) -> Chat | None:
        return await self.repository.get_chat_by_uid(uid)

    async def get_chat_by_uid_and_group_id(self, uid: str, group_id: str):
        return await self.repository.get_chat_by_uid_and_group_id(uid, group_id)

    async def get_all_chats_by_id(self, uid: str):
        return await self.repository.get_all_chats_by_uid(uid)

    async def get_n_chats_by_id(self, uid: str, n: int, incr: int):
        return await self.repository.get_n_chats_by_uid(uid, n, incr)

    async def get_chat_by_id(self, chat_id: str):
        chat = await self.repository.get_data(chat_id)
        if not chat:
            raise ValueError("Chat not found")
        return chat

    async def add_message_to_chat(self, chat_id: str, message_id: str):
        await self.repository.add_message(chat_id, message_id)

    async def delete_chat_by_id(self, chat_id: str): 
        if not await self.repository.delete_data(chat_id):
            raise ValueError("The chat could not be deleted")
        return True