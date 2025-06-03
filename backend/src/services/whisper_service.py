# pylint: disable=import-error,no-name-in-module
import tempfile

from ai.whisper_integration import WhisperIntegration  # type: ignore[import]
from src.models.transcript import Transcript


class WhisperService:
    def __init__(self):
        self.whisper = WhisperIntegration()

    def transcribe(self, audio_data: bytes) -> list[Transcript]:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as temp_audio:
            temp_audio.write(audio_data)
            temp_audio.flush()
            result = self.whisper.get_transcription(temp_audio.name)
            transcripts = Transcript.from_dict(result)
            return transcripts
