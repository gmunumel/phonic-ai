from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.websocket import websocket_router

app = FastAPI()

# Middleware to allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include WebSocket routes
app.include_router(websocket_router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Live Video/Audio Transcript API!"}
