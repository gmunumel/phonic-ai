# AI Integration

This directory contains the integration logic for the Whisper AI service, which is used for speech-to-text processing in the Live Video/Audio Transcript application.

## Files

- **whisper_integration.py**: This file contains the functions to interact with the Whisper API for converting audio input into text.



## Usage

- Import the functions from `whisper_integration.py` to utilize the speech-to-text capabilities in your application.
- This library is means to work as a imported library and not as standalone. 
- Library must be imported by _backend_. Please read backend [README](../backend/README.md) file.

### Install Local Virtual Environment

    uv venv --python 3.12.0

Then activate:

    source .venv/bin/activate

### Run Application

    python ai/whisper_integration.py

## Key Features

- Real-time transcription of audio input.
- Integration with FastAPI for seamless communication between the frontend and backend.
- Utilizes WebSockets for low-latency audio streaming.
