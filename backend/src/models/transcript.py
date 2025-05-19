from dataclasses import dataclass


@dataclass(frozen=True)
class Transcript:
    text: str
    timestamps: list

    def to_dict(self):
        return {"text": self.text, "timestamps": self.timestamps}
