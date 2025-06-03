# pylint: disable=import-error
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.websocket import websocket_router


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
