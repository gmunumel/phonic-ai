import React, { useState, useEffect } from "react";
import { onTranscriptionReceived } from "services/websockets";
import styles from "components/Transcript.module.css";

type Transcript = { id: number; text: string; start: number; end: number };

const Transcript: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);

  useEffect(() => {
    onTranscriptionReceived((transcripts: Transcript[]) => {
      setTranscripts((prev) => [...prev, ...transcripts]);
    });
  }, []);

  return (
    <div className={styles.transcriptContainer}>
      <h2>Live Transcription</h2>
      <ul>
        {transcripts.map((transcript, index) => (
          <li key={index}>
            <strong>
              [{transcript.start.toFixed(2)}s - {transcript.end.toFixed(2)}s]:
            </strong>{" "}
            {transcript.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transcript;
