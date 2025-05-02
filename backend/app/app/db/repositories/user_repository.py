from pydantic import EmailStr
from app.db.models.user import User
from app.db.repositories.repository import Repository
from app.db.client import users_collection
from app.helpers.dict2model import convert_user_to_model
from typing import List
from datetime import datetime

class UserRepository(Repository):
    def __init__(self):
        super().__init__(users_collection, convert_user_to_model)

    async def get_user_by_username(self, username: str) -> User | None:
        user = await self.data_collection.find_one({"username": username})
        return self.convert_helper(user) if user else None

    async def get_user_by_email(self, email: EmailStr) -> User | None:
        user = await self.data_collection.find_one({"email": str(email)})
        return self.convert_helper(user) if user else None

    async def get_user_by_username_or_email(self, username_or_email: str) -> User | None:
        user = await self.data_collection.find_one({
            "$or": [
                {"username": username_or_email},
                {"email": username_or_email}
            ]
        })
        return self.convert_helper(user) if user else None

    async def save_reset_token(self, uid: str, token: str, exp: datetime): 
        await self.data_collection.update_one(
            {"id": uid}, 
            {"$set": {"reset_token": token, "reset_token_expiry": exp}}
        )

    async def get_user_by_reset_token(self, token: str) -> User | None: 
        user = await self.data_collection.find_one({
            "reset_token": token, 
            "reset_token_expiry": {"$gt": datetime.now()}
        })
        return self.convert_helper(user) if user else None

    async def delete_reset_token(self, uid: str): 
        await self.data_collection.update_one(
            {"id": uid}, 
            {"$unset": {"reset_token": 1, "reset_token_expiry": 1}}
        )

