from typing import List, Dict
import requests


class WhisperIntegration:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def transcribe_audio(self, audio_file_path: str) -> Dict:
        with open(audio_file_path, "rb") as audio_file:
            response = requests.post(
                self.api_url, files={"file": audio_file}, timeout=10
            )
            response.raise_for_status()
            return response.json()

    def transcribe_audio_stream(self, audio_stream: bytes) -> Dict:
        response = requests.post(self.api_url, data=audio_stream, timeout=10)
        response.raise_for_status()
        return response.json()

    def get_transcription_with_timestamps(self, audio_file_path: str) -> List[Dict]:
        transcription_result = self.transcribe_audio(audio_file_path)
        return transcription_result.get("segments", [])
