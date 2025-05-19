# AI Integration for Live Video/Audio Transcript Application

This directory contains the integration logic for the Whisper AI service, which is used for speech-to-text processing in the Live Video/Audio Transcript application.

## Files

- **whisper_integration.py**: This file contains the functions to interact with the Whisper API for converting audio input into text.

## Setup Instructions

1. Ensure you have the necessary dependencies installed. Refer to the `requirements.txt` in the backend directory for any additional libraries that may be required.
2. Configure the Whisper API credentials if necessary.

## Usage

- Import the functions from `whisper_integration.py` to utilize the speech-to-text capabilities in your application.
- Follow the examples provided in the code to integrate with the FastAPI backend and the React frontend.

### Install Local Virtual Environment

    uv venv --python 3.12.0

Then activate:

    source .venv/bin/activate

## Key Features

- Real-time transcription of audio input.
- Integration with FastAPI for seamless communication between the frontend and backend.
- Utilizes WebSockets for low-latency audio streaming.
