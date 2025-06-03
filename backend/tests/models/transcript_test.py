import pytest
from src.models.transcript import Transcript


def test_transcript_from_dict_valid():
    data = {
        "transcripts": [
            {"id": 1, "text": "Hello", "start": 0.0, "end": 1.0},
            {"id": 2, "text": "World", "start": 1.0, "end": 2.0},
        ]
    }
    transcripts = Transcript.from_dict(data)
    assert len(transcripts) == 2
    assert transcripts[0].id == 1
    assert transcripts[0].text == "Hello"
    assert transcripts[1].end == 2.0


def test_transcript_from_dict_invalid_missing_transcripts():
    data = {}
    assert Transcript.from_dict(data) == []


def test_transcript_from_dict_invalid_missing_keys():
    data = {"transcripts": [{"id": 1, "text": "Hello", "start": 0.0}]}  # missing 'end'
    assert Transcript.from_dict(data) == []


def test_transcript_to_dict():
    transcripts = [
        Transcript(id=1, text="Hello", start=0.0, end=1.0),
        Transcript(id=2, text="World", start=1.0, end=2.0),
    ]
    result = Transcript.to_dict(transcripts)
    assert result == [
        {"id": 1, "text": "Hello", "start": 0.0, "end": 1.0},
        {"id": 2, "text": "World", "start": 1.0, "end": 2.0},
    ]


def test_transcript_repr():
    t = Transcript(id=1, text="Hello", start=0.0, end=1.0)
    assert repr(t) == "Transcript(id=1, text=Hello, start=0.0, end=1.0)"
