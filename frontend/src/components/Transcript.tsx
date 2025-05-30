import React from "react";
import styles from "components/Transcript.module.css";

const Transcript: React.FC<{
  transcripts: Array<{ text: string; start: number; end: number }>;
}> = ({ transcripts }) => {
  return (
    <div className={styles.transcriptContainer}>
      <h2>Live Transcription</h2>
      <ul>
        {transcripts.map((segment, index) => (
          <li key={index}>
            <strong>
              [{segment.start.toFixed(2)}s - {segment.end.toFixed(2)}s]:
            </strong>{" "}
            {segment.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transcript;
