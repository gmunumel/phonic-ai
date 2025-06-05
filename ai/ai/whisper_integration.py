import os
import requests
from dotenv import load_dotenv

# from .log import logger

load_dotenv()

OPENAI_API_URL = os.getenv(
    "OPENAI_API_URL", "https://api.openai.com/v1/audio/transcriptions"
)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class WhisperIntegration:
    def __init__(self):
        self.api_key = OPENAI_API_KEY
        self.api_url = OPENAI_API_URL

    def transcribe_audio(
        self, audio_file_path: str, model: str = "whisper-1", language: str = "en"
    ) -> dict:
        # logger.info("api_key: %s", self.api_key)
        # logger.info("api_url: %s", self.api_url)
        with open(audio_file_path, "rb") as audio_file:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            files = {
                "file": audio_file,
            }
            data = {
                "model": model,
                "response_format": "verbose_json",
                "language": language,
            }
            response = requests.post(
                self.api_url, headers=headers, files=files, data=data, timeout=30
            )
            response.raise_for_status()
            return response.json()
        # return {
        #     "transcripts": [
        #         {
        #             "id": 0,
        #             "start": 0.0,
        #             "end": 1.0,
        #             "text": "Hello, this is a test transcription.",
        #         },
        #         {
        #             "id": 1,
        #             "start": 1.0,
        #             "end": 2.0,
        #             "text": "This is the second segment of the transcription.",
        #         },
        #     ]
        # }

    def get_transcription(self, audio_file_path: str) -> dict:
        transcription_result = self.transcribe_audio(audio_file_path)
        return transcription_result
