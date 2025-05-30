# pylint: disable=import-error
import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends

from src.services.whisper_service import WhisperService


websocket_router = APIRouter()

ACTIVE_CONNECTIONS: list[WebSocket] = []


def get_whisper_service():
    return WhisperService()


@websocket_router.websocket("/ws/transcribe")
async def websocket_endpoint(
    websocket: WebSocket,
    whisper_service: WhisperService = Depends(get_whisper_service),
):
    xid_message = {
        "xId": None,
        "service": "",
        "details": "",
    }
    await websocket.accept()
    ACTIVE_CONNECTIONS.append(websocket)
    try:
        while True:
            message = await websocket.receive()

            if "bytes" in message:
                audio_data = message["bytes"]

                xid_message["service"] = "WhisperService"
                xid_message["details"] = "transcribe(audio_data)"
                await broadcast_message(xid_message)

                transcripts_with_timestamps = whisper_service.transcribe(audio_data)

                xid_message["service"] = "WhisperIntegration (AI)"
                xid_message["details"] = "get_transcription_with_timestamps(temp_audio)"
                await broadcast_message(xid_message)

                # await broadcast_message(
                #     {
                #         "event": "transcription",
                #         "transcripts": transcripts_with_timestamps,
                #     }
                # )
                await websocket.send_json(
                    {
                        "event": "transcription",
                        "transcripts": transcripts_with_timestamps,
                    }
                )
            elif "text" in message:
                text_message = message["text"]
                xid = get_by_key(text_message, "xId")
                if xid:
                    xid_message["xId"] = xid
                    xid_message["service"] = "Backend"
                    xid_message["details"] = "WebSocket (audio chunk)"
                else:
                    xid_message["xId"] = None
                    xid_message["service"] = "Stop"
                    xid_message["details"] = None
                await broadcast_message(xid_message)
    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS.remove(websocket)


def get_by_key(message: str, key: str) -> str | None:
    try:
        xid = json.loads(message).get(key, None)
        return xid
    except json.JSONDecodeError:
        return None


async def broadcast_message(message: dict, delay: float = 1):
    disconnected = []
    for connection in ACTIVE_CONNECTIONS:
        try:
            await connection.send_json(message)
            await asyncio.sleep(delay)
        except RuntimeError as e:
            print(f"Error sending message to {connection}: {e}")
            disconnected.append(connection)

    # Remove disconnected websockets
    for connection in disconnected:
        if connection in ACTIVE_CONNECTIONS:
            ACTIVE_CONNECTIONS.remove(connection)
