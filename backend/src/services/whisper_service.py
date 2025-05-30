# pylint: disable=import-error,no-name-in-module
import tempfile
from datetime import datetime
from ai.whisper_integration import WhisperIntegration  # type: ignore[import]


class WhisperService:
    def __init__(self):
        self.whisper = WhisperIntegration()

    def transcribe(self, audio_data: bytes) -> list[dict]:  # TODO list[Transcript]:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as temp_audio:
            temp_audio.write(audio_data)
            temp_audio.flush()
            result = self.whisper.get_transcription_with_timestamps(temp_audio.name)
            return result

    def save_transcript(self, transcript: str, timestamps: list[datetime]) -> dict:
        # Save the transcript with timestamps and return a structured response
        return {"event": "transcription", "text": transcript, "timestamps": timestamps}
