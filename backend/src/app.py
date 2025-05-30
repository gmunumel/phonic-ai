# pylint: disable=import-error
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware

from src.api.websocket import websocket_router
from src.services.whisper_service import WhisperService


app = FastAPI()

# Middleware to allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include WebSocket routes
app.include_router(websocket_router)


# TODO : remove this endpoint or comment it out
# This is a temporary endpoint for testing purposes
def get_whisper_service():
    return WhisperService()


# TODO : remove this endpoint or comment it out
# This is a temporary endpoint for testing purposes
@app.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    whisper_service: WhisperService = Depends(get_whisper_service),
):
    audio_data = await file.read()
    result = whisper_service.transcribe(audio_data)
    return {"transcripts": result}
