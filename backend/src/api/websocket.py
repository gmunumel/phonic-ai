from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect


websocket_router = APIRouter()

active_connections: List[WebSocket] = []


@websocket_router.websocket("/ws/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await broadcast(data)
    except WebSocketDisconnect:
        active_connections.remove(websocket)


async def broadcast(message: str):
    for connection in active_connections:
        await connection.send_text(message)
