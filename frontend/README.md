# Frontend

This directory contains the frontend application for the Live Audio Transcript project, built using React and RecordRTC.

## Getting Started

To get started with the frontend application, follow these steps:

1. **Install Dependencies**: Navigate to the `frontend` directory and run the following command to install the necessary dependencies:

   ```
   npm install
   ```

2. **Run the Application**: After installing the dependencies, you can start the development server with:

   ```
   npm start
   ```

   This will launch the application in your default web browser.

3. **Test the Application**:

   ```
   npm test
   ```

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables (adjust if necessary):

| Variable                           | Description                                                          | Example Value           |
| ---------------------------------- | -------------------------------------------------------------------- | ----------------------- |
| `REACT_APP_BACKEND_URL`            | Url for connecting to the backend server.                            | `http://localhost:8000` |
| `WAIT_TIME_BEFORE_RECONNECT_MS`    | Wait time before attempt to reconnect to web socket in milliseconds. | 30000                   |
| `WAIT_TIME_TO_RESET_DIAGRAM_MS`    | Wait time to reset diagram to initial position in milliseconds.      | 4000                    |
| `WAIT_TIME_BETWEEN_CHUNK_AUDIO_MS` | Wait time to send audio chunks in milliseconds.                      | 4000                    |

## Project Structure

The frontend project is structured as follows:

- `public/index.html`: The main HTML file that serves as the entry point for the React application.
- `src/App.tsx`: The main component that sets up routing and layout for the application.
- `src/index.tsx`: The entry point for the React application that renders the App component.
- `src/components/Manager.tsx`: A centralized component to handle components: `Recorder`, `Transcript` and `SequenceDiagram`.
- `src/components/Recorder.tsx`: A component that captures audio input using RecordRTC.
- `src/components/Transcript.tsx`: A component that displays the live transcription of audio input.
- `src/components/SequenceDiagram.tsx`: A component to display and manipulate the sequence diagram made with _mermaid_.
- `src/services/websocket.ts`: Contains logic for managing WebSocket connections to the backend.

## Key Features

- Real-time audio capture using RecordRTC.
- Live transcription display of captured audio.
- WebSocket integration for real-time communication with the backend.

## Remarks

This frontend application is designed to work seamlessly with the FastAPI backend and Whisper AI integration for a complete live transcription experience.
