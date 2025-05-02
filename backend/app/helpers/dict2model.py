from db.models.user import User

def convert_user_to_model(user_dict: dict) -> User:
    return User(**user_dict)

