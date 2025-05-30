from dataclasses import dataclass


@dataclass(frozen=True)
class Transcript:
    text: str
    timestamps: list  # list[datetime]

    def to_dict(self):
        return {"text": self.text, "timestamps": self.timestamps}

    def __repr__(self) -> str:
        return f"Transcript(text={self.text}, timestamps={self.timestamps})"
