from pydantic import EmailStr
from db.models.user import User
from db.repositories import Repository
from db.repositories.user_repository import UserRepository
from datetime import datetime, timedelta

class UserService:
    def __init__(self):
        self.user_repository = UserRepository()

    async def add_user(self, user : User):
        from services.autentication_service import get_password_hash
        user.password = get_password_hash(user.password)
        return await self.user_repository.add_data(user)

    async def get_user_by_username(self, username: str) -> User | None:
        return await self.user_repository.get_user_by_username(username)
    
    def get_user_by_email(self, email: EmailStr):
        return self.user_repository.get_user_by_email(email)

    def get_user_by_username_or_email(self, username_or_email: str):
        return self.user_repository.get_user_by_username_or_email(username_or_email)

    def get_user_by_id(self, uid: str):
        return self.user_repository.get_data(uid)

    def get_all_users(self):
        return self.user_repository.get_all_data()

    def update_user(self, uid: str, update_data: dict):
        return self.user_repository.update_data(uid, update_data)

    def delete_user(self, uid: str):
        return self.user_repository.delete_data(uid)

    async def save_reset_token(self, uid: str, token: str): 
        exp_time = datetime.now() + timedelta(hours=1) # expirate in 1 hour
        await self.user_repository.save_reset_token(uid, token, exp_time)

    async def get_user_by_reset_token(self, token: str): 
        return await self.user_repository.get_user_by_reset_token(token)

    async def update_user_password(self, uid: str, new_password: str): 
        from services.autentication_service import get_password_hash
        hashed_passwd = get_password_hash(new_password) 
        return await self.user_repository.update_data(uid, {"password": hashed_passwd})

    async def delete_reset_token(self, uid: str): 
        await self.user_repository.delete_reset_token(uid)

    async def get_favorites_by_user(self, uid: str): 
        return await self.user_repository.get_favorite_properties(uid)

    async def add_favorite_property(self, uid: str, property_id: str): 
        return await self.user_repository.add_favorite_property(uid, property_id) 

    async def remove_favorite_property(self, uid: str, property_id: str):
        return await self.user_repository.remove_favorite_property(uid, property_id)
