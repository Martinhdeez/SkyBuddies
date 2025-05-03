import motor.motor_asyncio
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")  
DATABASE_NAME = os.getenv("DATABASE_NAME")


client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
database = client[DATABASE_NAME]

users_collection = database["users"]
groups_collection = database["groups"]
chats_collection = database["chats"]
messages_collection = database["messages"]  
filters_collection = database["filters"]
routes_collection = database["routes"]
