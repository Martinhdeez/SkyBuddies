from pydantic import BaseModel
import uuid
from typing import List

class Repository:
    def __init__(self, data_collection, convert_helper) -> None:
        self.data_collection = data_collection
        self.convert_helper = convert_helper

    async def get_all_data(self) -> List[BaseModel]:
        data = await self.data_collection.find().to_list(length=100)
        return [self.convert_helper(data_item) for data_item in data]

    async def add_data(self, data: BaseModel) -> BaseModel:
        data.id = str(uuid.uuid4())  
        data_dict = data.model_dump()

        print(f"[DEBUG] Dumped data: {data_dict}\n\n\n [DEBUG] Values: {data_dict.values()}")

        try:
            await self.data_collection.insert_one(data_dict) 
            return data
        except Exception as e:
            print(f"Error inserting data: {e}")
            return None

    async def get_data(self, uid: str) -> BaseModel | None:
        try:
            data = await self.data_collection.find_one({"id": uid})
            if not data:
                return None
            return self.convert_helper(data)
        except Exception as e:
            print(f"Error retrieving data: {e}")
            return None

    async def update_data(self, uid: str, update_data: dict) -> bool:
        try:
            updated_data = await self.data_collection.update_one({"id": uid}, {"$set": update_data})
            return updated_data.modified_count > 0
        except Exception as e:
            print(f"Error updating data: {e}")
            return False

    async def delete_data(self, uid: str) -> bool:
        try:
            deleted_data = await self.data_collection.delete_one({"id": uid})
            return deleted_data.deleted_count > 0
        except Exception as e:
            print(f"Error deleting data: {e}")
            return False
