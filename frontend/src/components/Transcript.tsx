import React from "react";

const Transcript: React.FC<{
  transcripts: Array<{ text: string; timestamp: number }>;
}> = ({ transcripts }) => {
  return (
    <div>
      <h2>Live Transcription</h2>
      <ul>
        {transcripts.map((transcript, index) => (
          <li key={index}>
            <strong>
              {new Date(transcript.timestamp).toLocaleTimeString()}:
            </strong>{" "}
            {transcript.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transcript;
