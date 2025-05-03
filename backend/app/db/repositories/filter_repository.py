from pydantic import EmailStr
from db.models.user import User
from db.repositories.repository import Repository
from db.client import filters_collection 
from helpers.dict2model import convert_filter_to_model 
from typing import List
from datetime import datetime

class FilterRepository(Repository):
    def __init__(self): 
        super().__init__(filters_collection, convert_filter_to_model)