from db.repositories.chat_message_repository import MessageRepository
from db.models.chat import ChatMessage
from typing import List

class ChatMessageService:
    def __init__(self):
       self.repository = MessageRepository()

    async def add_message(self, message: ChatMessage):
        return await self.repository.add_data(message)

    async def get_message_by_id(self, message_id) -> ChatMessage | None:
        return await self.repository.get_data(message_id)

    async def modify_message(self, message_id: str, message: dict) -> bool:

        return await self.repository.update_data(message_id, message)

    async def get_all_messages_by_chat_id(self, chat_id: str) -> List[ChatMessage]:
        return await self.repository.get_all_messages_by_chat_id(chat_id)

    async def get_n_messages_by_chat_id(self, chat_id: str, n: int, incr: int) -> List[ChatMessage]:
        return await self.repository.get_n_messages_by_chat_id(chat_id, n, incr)

    async def delete_message(self, message_id) -> bool:
        return await self.repository.delete_data(message_id)