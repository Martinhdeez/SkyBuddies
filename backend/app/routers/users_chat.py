from http.client import HTTPResponse
from OpenSSL.rand import status
from starlette.responses import JSONResponse
from db.models.user import User
from services.chat_service import ChatService
from services.chat_message_service import ChatMessageService
from services.autentication_service import get_current_user
from fastapi import HTTPException, APIRouter, WebSocket, WebSocketDisconnect, Depends
from db.models.chat import Chat, ChatMessage
from typing import Dict, Annotated
from helpers.WSconnectionFactory import WSConnectionFactory 

router = APIRouter(
    prefix="/users/chat",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

ws_factory = WSConnectionFactory()
message_service = ChatMessageService()
chat_service = ChatService()

@router.post("/{receiver_id}/properties/{property_id}")
async def create_chat(
    receiver_id: str,
    property_id: str,
    sender: Annotated[User, Depends(get_current_user)]
):
    sender_id = sender.id

    if await chat_service.get_chat_by_uids(sender_id, receiver_id):
        raise HTTPException(status_code=409, detail="This chat already exists")

    chat_model = Chat(sender_uid=sender_id, receiver_uid=receiver_id, property_id=property_id)
    chat_db = await chat_service.add_chat(chat_model)
    return chat_db


@router.websocket("/{receiver_id}/properties/{property_id}")
async def ws_chat(
        websocket: WebSocket,
        receiver_id: str,
        property_id: str
):
    token = websocket.headers.get("Authorization")
    if not token:
        await websocket.send_text("Missing authentication token")
        await websocket.close()
        return

    user = await get_current_user(token)
    if not user:
        await websocket.send_text("Invalid token")
        await websocket.close()
        return


    sender_id = user.id
    chat = await chat_service.get_chat_by_uids_and_property_id(sender_id, receiver_id, property_id)
    if not chat:
        chat = await chat_service.add_chat(
            Chat(
            sender_uid=sender_id,
            receiver_uid=receiver_id,
            property_id=property_id
            )
        )

    chat_id = chat.id
    await ws_factory.connect(chat_id, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            message = data.strip()

            chat_message = ChatMessage(sender_uid=sender_id, message=message, receiver_uid=receiver_id, chat_id=chat_id)
            message = await message_service.add_message(chat_message)
            await chat_service.add_message_to_chat(chat_id, message.id)

    except WebSocketDisconnect:
        print(f"User {chat_id} disconected")
        await ws_factory.disconnect(chat_id, websocket)


@router.delete("{chat_id}", status_code=200)
async def delete_chat(
        chat_id: str
):
    is_deleted = chat_service.delete_chat_by_id(chat_id)
    if not is_deleted:
        raise HTTPException(
            status_code=400,
            detail="Error deleting chat"
        )
    return JSONResponse(
        {
            "message": "Chat deleted succesfully",
            "status_code": 200
        }
    )