This directory contains the backend implementation of the Live Video/Audio Transcript application using FastAPI and WebSockets.

## Project Structure

- **app/**: Contains the main application code.
  - **main.py**: Entry point for the FastAPI application. Initializes the app and sets up middleware.
  - **api/**: Contains the WebSocket routes.
    - **websocket.py**: Handles WebSocket connections and manages real-time audio/video streaming.
  - **services/**: Contains service logic.
    - **whisper_service.py**: Integration logic for the Whisper AI service.
  - **models/**: Contains data models.
    - **transcript.py**: Defines the data model for transcripts.

## Setup Instructions

1. **Install Local Virtual Environment**:
   ```
   uv venv --python 3.12.0
   ```

Then activate:

    ```
    source .venv/bin/activate
    ```

2. **Install Dependencies**:
   Navigate to the backend directory and install the required packages using:

   ```
   pip install -r requirements.txt
   ```

3. **Run the Application**:
   Start the FastAPI application using:

   ```
   uvicorn app.main:app --reload
   ```

4. **Access the API**:
   The API will be available at `http://localhost:8000`. You can access the WebSocket endpoint at `ws://localhost:8000/ws`.

## Usage Details

- The backend handles real-time audio/video streaming and transcription using WebSockets.
- It integrates with the Whisper AI service for speech-to-text processing.

## Additional Notes

- Ensure that you have the necessary permissions and configurations for audio/video capture in your environment.
- Refer to the individual service and model files for more detailed implementation information.
