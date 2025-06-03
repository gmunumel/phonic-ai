import React, { useEffect, useState } from "react";
import Recorder from "components/Recorder";
import Transcript from "components/Transcript";
import SequenceDiagram from "components/SequenceDiagram";
import {
  connectWebSocket,
  onConnectionStatusChange,
} from "services/websockets";
import styles from "components/Manager.module.css";

const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    onConnectionStatusChange(setWsConnected);
    connectWebSocket();
  }, []);

  useEffect(() => {
    if (wsConnected) {
      setErrorMessage(null);
    }
  }, [wsConnected]);

  useEffect(() => {
    const handleGenericError = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setErrorMessage(
        "An error occurred: " +
          (customEvent.detail ||
            "Unknown error." + "\nPlease refresh the page or try again later.")
      );
    };
    const handleRateLimitError = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setErrorMessage(
        "Rate limit exceeded. Please wait before trying again.\n" +
          (customEvent.detail || "")
      );
    };

    window.addEventListener("generic-error", handleGenericError);
    window.addEventListener("rate-limit-error", handleRateLimitError);

    return () => {
      window.removeEventListener("generic-error", handleGenericError);
      window.removeEventListener("rate-limit-error", handleRateLimitError);
    };
  }, []);

  return (
    <>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>Live Audio Transcript</h2>
        <h3 className={styles.subtitle}>
          Audio files are not shared or stored in any way.
        </h3>
        <h3 className={styles.demoNote}>
          This application is for demo purposes
        </h3>
        <p className={styles.instructions}>
          <b>Code can be viewed in: </b>
          <a
            href="https://github.com/gmunumel/phonic-ai"
            className={styles.codeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/gmunumel/phonic-ai
          </a>
        </p>
        <p className={styles.instructions}>
          <b>How to use it:</b> Click on the REC button and start speaking to
          the mic. Transcriptions should appear automatically.
        </p>
        <p className={styles.techList}>
          Technologies used:{" "}
          <a href="https://react.dev/" target="_blank">
            React
          </a>
          ,{" "}
          <a href="https://recordrtc.org/" target="_blank">
            RecordRTC
          </a>
          ,{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
            target="_blank"
          >
            Web Sockets
          </a>
          ,{" "}
          <a href="https://fastapi.tiangolo.com/" target="_blank">
            FastAPI
          </a>
          ,{" "}
          <a href="https://mermaid.js.org/" target="_blank">
            Mermaid
          </a>
          ,{" "}
          <a href="https://openai.com/index/whisper/" target="_blank">
            Whisper AI
          </a>
        </p>
      </div>
      <Recorder />
      {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}
      <div className={styles.flexRow}>
        <Transcript />
        <SequenceDiagram />
      </div>
    </>
  );
};

export default App;
