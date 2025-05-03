from fastapi import WebSocket 
from typing import Dict, Optional, Tuple

class WSConnectionFactory: 
    def __init__(self): 
        self.active_connections: Dict[str, Tuple[Optional[WebSocket], Optional[WebSocket]]] = {}

    async def connect(self, chat_id: str, ws: WebSocket): 
        await ws.accept() # accept the connection - if not accepted, 403 forbidden
        if chat_id not in self.active_connections: 
            self.active_connections[chat_id] = (ws, None)
        else: 
            ws1, ws2 = self.active_connections[chat_id]
            if ws1 is None: 
                self.active_connections[chat_id] = (ws, ws2)
            elif ws2 is None: 
                self.active_connections[chat_id] = (ws1, ws)
            else: 
                await ws.close() # more of 2 connections are forbidden
                return

    async def disconnect(self, chat_id: str, ws: WebSocket): 
        if chat_id in self.active_connections: 
            ws1, ws2 = self.active_connections[chat_id]
            if ws1 == ws: 
                self.active_connections[chat_id] = (None, ws2)
            elif ws2 == ws: 
                self.active_connections[chat_id] = (ws1, None)

            # if all connections are closed, remove the chat of active connections
            if self.active_connections[chat_id] == (None, None):
                self.active_connections.pop(chat_id, None)