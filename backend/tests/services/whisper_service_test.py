from unittest.mock import patch
from src.services.whisper_service import WhisperService


def test_whisper_service_transcribe_returns_transcripts():
    fake_audio = b"fake audio data"
    fake_result = {
        "transcripts": [
            {"id": 1, "text": "Hello", "start": 0.0, "end": 1.0},
            {"id": 2, "text": "World", "start": 1.0, "end": 2.0},
        ]
    }
    fake_transcripts = ["t1", "t2"]

    with patch(
        "src.services.whisper_service.WhisperIntegration"
    ) as mock_whisper_integration, patch(
        "src.services.whisper_service.Transcript"
    ) as mock_transcript:
        mock_whisper = mock_whisper_integration.return_value
        mock_whisper.get_transcription.return_value = fake_result
        mock_transcript.from_dict.return_value = fake_transcripts

        service = WhisperService()
        result = service.transcribe(fake_audio)

        mock_whisper.get_transcription.assert_called_once()
        mock_transcript.from_dict.assert_called_once_with(fake_result)
        assert result == fake_transcripts
