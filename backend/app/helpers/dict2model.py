from db.models.user import User
from db.models.group import Group

def convert_user_to_model(user_dict: dict) -> User:
    return User(**user_dict)

def convert_group_to_model(group_dict: dict) -> Group:
    return Group(**group_dict)