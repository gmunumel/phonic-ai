from dataclasses import dataclass


@dataclass(frozen=True)
class Transcript:
    id: int
    text: str
    start: float
    end: float

    @classmethod
    def from_dict(cls, data: dict) -> list["Transcript"]:
        if (
            not data
            or "transcripts" not in data
            or not isinstance(data["transcripts"], list)
        ):
            raise ValueError("Invalid data format for Transcript creation")
        transcripts = []
        for transcript in data["transcripts"]:
            if not all(key in transcript for key in ["id", "text", "start", "end"]):
                raise ValueError("Missing keys in transcript data")
            transcripts.append(
                cls(
                    id=transcript["id"],
                    text=transcript["text"],
                    start=transcript["start"],
                    end=transcript["end"],
                )
            )
        return transcripts

    @classmethod
    def to_dict(cls, transcripts: list["Transcript"]) -> list[dict]:
        return [
            {"id": t.id, "text": t.text, "start": t.start, "end": t.end}
            for t in transcripts
        ]

    def __repr__(self) -> str:
        return f"Transcript(id={self.id}, text={self.text}, start={self.start}, end={self.end})"
