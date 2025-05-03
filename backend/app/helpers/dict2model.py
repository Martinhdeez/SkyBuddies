from db.models.user import User
from db.models.group import Group
from db.models.chat import Chat
from db.models.chat import ChatMessage
from db.models.travel_filter import TravelFilter

def convert_user_to_model(user_dict: dict) -> User:
    return User(**user_dict)

def convert_group_to_model(group_dict: dict) -> Group:
    return Group(**group_dict)

def convert_chat_to_model(chat_dict: dict) -> Chat: 
    return Chat(**chat_dict)

def convert_message_to_model(message_dict: dict) -> ChatMessage: 
    return ChatMessage(**message_dict)

def convert_filter_to_model(filter_dict: dict) -> User:
    return TravelFilter(**filter_dict)