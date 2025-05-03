from db.repositories.repository import Repository 
from db.models.chat import Chat
from typing import List
from db.client import chats_collection
from helpers.dict2model import convert_chat_to_model
from datetime import datetime

class ChatRepository(Repository):
    def __init__(self):
        super().__init__(chats_collection, convert_chat_to_model)

    async def get_chat_by_uid(self, uid: str) -> Chat | None:
        chat = await self.data_collection.find_one(
            {
                "sender_uid": uid
            }
        )
        if not chat:
            return None

        return self.convert_helper(chat)

    async def get_chat_by_uids_and_group_id(self, uid: str, group_id: str) -> Chat | None:
        chat = await self.data_collection.find_one(
            {
                "$and": [
                    {
                        "sender_uid": uid
                    },
                    {
                        "group_id": group_id 
                    }

                ]
            }
        )
        if not chat:
            return None

        return self.convert_helper(chat)


    async def get_all_chats_by_uid(self, uid: str) -> List[Chat]: 
        return self.data_collection.find({
            "sender_uid": uid
        }).sort("updated_at", -1)

    async def get_n_chats_by_uid(self, uid: str, n: int, incr: int) -> List[Chat]: 
        return self.data_collection.find({
            "sender_uid": uid
        }).sort("updated_at", -1).limit(n*incr)

    async def add_message(self, chat_id: str, message_id: str):
        await self.data_collection.update_one(
            {"id": chat_id},
            {
                "$push": {"messages": message_id},
                "$set": {"updated_at": datetime.now()}
            }
        )

    async def delete_message(self, chat_id: str, message_id: str):
        await self.data_collection.update_one({"id": chat_id}, {"$pull": {"messages": message_id}})