# phonic-api

Live Video/Audio Transcript application that combines real-time audio/video streaming with AI-powered transcription.

## Project Structure

- **backend/**: Contains the FastAPI backend implementation.

  - **app/**: Main application code.
    - **main.py**: Entry point for the FastAPI application.
    - **api/**: WebSocket routes for real-time communication.
    - **services/**: Integration logic for Whisper AI service.
    - **models/**: Data models for the application.
  - **requirements.txt**: Lists dependencies for the backend.
  - **README.md**: Documentation for the backend.

- **frontend/**: Contains the React frontend implementation.

  - **public/**: Static files for the React application.
    - **index.html**: Main HTML file for the React app.
  - **src/**: Source code for the React application.
    - **App.tsx**: Main component of the React application.
    - **index.tsx**: Entry point for the React application.
    - **components/**: Reusable components for the application.
      - **Recorder.tsx**: Component for capturing audio/video input.
      - **Transcript.tsx**: Component for displaying live transcription.
    - **services/**: Logic for managing WebSocket connections.
      - **websocket.ts**: Functions to connect and communicate with the backend.
  - **package.json**: Configuration file for npm.
  - **tsconfig.json**: TypeScript configuration file.
  - **README.md**: Documentation for the frontend.

- **ai/**: Contains the integration logic for the Whisper AI service.
  - **whisper_integration.py**: Functions to interact with the Whisper API.
  - **README.md**: Documentation for the AI integration.

## Key Features

- Speak into the microphone to see live transcription.
- Save transcripts with timestamps.
- Combines AI with real-time streaming.
- Optimized for low latency (e.g., chunk audio every 2 seconds).

## Setup Instructions

1. Clone the repository.
2. Navigate to the `backend` directory and install dependencies using:
   ```
   pip install -r requirements.txt
   ```
3. Navigate to the `frontend` directory and install dependencies using:
   ```
   npm install
   ```
4. Start the backend server:
   ```
   uvicorn app.main:app --reload
   ```
5. Start the frontend application:
   ```
   npm start
   ```

## Remarks

This project leverages modern web technologies to provide a seamless experience for live transcription using AI.
