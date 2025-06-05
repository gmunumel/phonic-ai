# pylint: disable=import-error
import os
import json
import asyncio
import requests

from dotenv import load_dotenv
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends

from src.services.whisper_service import WhisperService
from src.services.redis_service import increment_and_check_limits
from src.models.transcript import Transcript
from src.log import logger

load_dotenv()

websocket_router = APIRouter()

ACTIVE_CONNECTIONS: list[WebSocket] = []

# counter = 0


def get_whisper_service():
    return WhisperService()


@websocket_router.websocket((os.getenv("APP_PREFIX") or "") + "/ws/transcribe")
async def websocket_endpoint(
    websocket: WebSocket,
    whisper_service: WhisperService = Depends(get_whisper_service),
):
    # global counter

    xid_message = {
        "xId": None,
        "service": "",
        "details": "",
    }
    ip = websocket.client.host if websocket.client is not None else None
    await websocket.accept()
    ACTIVE_CONNECTIONS.append(websocket)
    try:
        while True:
            message = await websocket.receive()
            # counter += 1

            allowed = await increment_and_check_limits(ip)
            if not allowed:
                # if counter >= 10:
                await close_websocket(
                    websocket, "Rate limit exceeded. Try again later."
                )
                break

            if "bytes" in message:
                audio_data = message["bytes"]

                xid_message["service"] = "WhisperService"
                xid_message["details"] = "transcribe(audio_data)"
                await broadcast_message(xid_message)

                transcripts = whisper_service.transcribe(audio_data)

                xid_message["service"] = "WhisperIntegration (AI)"
                xid_message["details"] = "get_transcription(temp_audio)"
                await broadcast_message(xid_message)

                await broadcast_message(
                    {
                        "event": "transcription",
                        "transcripts": Transcript.to_dict(transcripts),
                    },
                    delay=0.0,  # set to 0 in production
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
    except requests.exceptions.HTTPError as err:
        error_message = err.response.text if err.response else "HTTP error occurred"
        if err.response:
            logger.error(f"Status Code: {err.response.status_code}")
            logger.error(f"Headers: {err.response.headers}")
            logger.error(f"Body: {err.response.text}")
        else:
            logger.error("No response received.")
        await close_websocket(websocket, error_message)
    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS.remove(websocket)


async def close_websocket(websocket: WebSocket, message: str):
    await websocket.send_text(message)
    await websocket.close(code=4000, reason="Client not allowed")


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
            logger.error(f"Error sending message to {connection}: {e}")
            disconnected.append(connection)

    # Remove disconnected websockets
    for connection in disconnected:
        if connection in ACTIVE_CONNECTIONS:
            ACTIVE_CONNECTIONS.remove(connection)
