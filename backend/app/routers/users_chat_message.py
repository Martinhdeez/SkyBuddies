from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse
from pydantic import BaseModel
from db.models.chat import ChatMessage
from services.chat_message_service import ChatMessageService
from routers.dto.chat_dto import ChatMessageDTO

router = APIRouter(
    prefix="/users/chat/messages",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)
message_service = ChatMessageService()

class ChatRequest(BaseModel):
    chat_id: str

class UpdateChatRequest(BaseModel):
    chat_id: str
    n: int
    incr: int

@router.post("", response_model=List[ChatMessage])
async def get_all_messages_by_chat(
     chat: ChatRequest
):
    chat_id = chat.chat_id
    messages = await message_service.get_all_messages_by_chat_id(chat_id)
    if not messages:
        raise HTTPException(status_code=404, detail="No messages found")
    return messages

@router.post("/n", response_model=List[ChatMessage])
async def get_n_messages_by_chat(
    chat: UpdateChatRequest,
):
    chat_id = chat.chat_id
    n = chat.n
    incr = chat.incr
    messages = await message_service.get_n_messages_by_chat_id(chat_id, n, incr)
    if not messages:
        raise HTTPException(status_code=404, detail="No messages found")
    return messages


class MessageRequest(BaseModel):
    message_id: str
    message: str

@router.put("", status_code=200)
async def update_message(
        message_data: MessageRequest
):
    message_dict = {
        "message": message_data.message,
        "updated_at": datetime.now()
    }
    is_modified = await message_service.modify_message(message_data.message_id, message_dict)
    if not is_modified:
        raise HTTPException(
            status_code=400,
            detail="Error modifying message"
        )
    return JSONResponse(
        {
            "message": "Message updated successfuly",
            "status_code": 200
        }
    )

@router.delete("/{message_id}", status_code=200)
async def delete_message(
        message_id: str
):
    is_deleted = message_service.delete_message(message_id)
    if not is_deleted:
        raise HTTPException(
            status_code=400,
            detail="Error deleting message"
        )
    return JSONResponse(
        {
            "message": "Message deleted succesfully",
            "status_code": 200
        }
    )

@router.post("/add", response_model=ChatMessage)    
async def add_message(
    message: ChatMessageDTO
):
    message = await message_service.add_message(message)
    if not message:
        raise HTTPException(status_code=400, detail="Error adding message")
    return message