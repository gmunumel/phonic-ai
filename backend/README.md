# Backend

This directory contains the backend implementation of the Live Audio Transcript application using FastAPI and WebSockets.

## Project Structure

- **app/**: Contains the main application code.
  - **main.py**: Entry point for the FastAPI application. Initializes the app and sets up middleware.
  - **api/**: Contains the WebSocket routes.
    - **websocket.py**: Handles WebSocket connections and manages real-time audio streaming.
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
   uv pip install .
   ```

3. **Run the Application**:
   Start the FastAPI application using:

   ```
   export $(cat .env | xargs) && uvicorn src.app:app --reload
   ```

   The `export` command is to set up a `PYTHONPATH` based on value in `.env` file.

4. **Test the Application**:

   ```
   pytest -v
   ```

5. **Access the API**:
   The API will be available at `http://localhost:8000`. You can access the WebSocket endpoint at `ws://localhost:8000/ws`.

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables (adjust if necessary):

| Variable                    | Description                                  | Example Value               |
| --------------------------- | -------------------------------------------- | --------------------------- |
| `PYTHONPATH`                | Path to the external `ai` package directory. | `/home/<user>/phonic-ai/ai` |
| `REDIS_URL`                 | Redis server url.                            | `redis://localhost:6379`    |
| `MAX_RECORDINGS_PER_MINUTE` | Maximum recordings per minute.               | 40                          |
| `MAX_RECORDINGS_PER_HOUR`   | Maximum recordings per hour.                 | 120                         |
| `MAX_RECORDINGS_PER_DAY`    | Maximum recordings per day.                  | 200                         |

## Usage Details

- The backend handles real-time audio streaming and transcription using WebSockets.
- It integrates with the Whisper AI service for speech-to-text processing, located in [AI](../ai/) folder.

## Additional Notes

- Ensure that you have the necessary permissions and configurations for audio capture in your environment.
- Refer to the individual service and model files for more detailed implementation information.
