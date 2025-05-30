import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import Recorder from "components/Recorder";
import Transcript from "components/Transcript";
import SequenceDiagram from "components/SequenceDiagram";
import {
  connectWebSocket,
  onTranscriptionReceived,
  onXIdReceived,
} from "services/websockets";
import styles from "components/Manager.module.css";

type Segment = { text: string; start: number; end: number };

const App: React.FC = () => {
  const isRecording = useSelector((state: any) => state.recorder.isRecording);
  const isMounted = useRef(false);
  const [transcripts, setTranscripts] = useState<Segment[]>([]);
  const [diagram, setDiagram] = useState(`
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant WhisperService
    participant WhisperIntegration (AI)

    User->>Frontend: Start Recording (Sends audio stream)
    Frontend->>Backend: WebSocket (audio chunk)
    Backend->>WhisperService: transcribe(audio_data)
    WhisperService->>WhisperIntegration (AI): get_transcription_with_timestamps(temp_audio)
    WhisperIntegration (AI)-->>WhisperService: [segments: text, start, end]
    WhisperService-->>Backend: [segments: text, start, end]
    Backend-->>Frontend: transcription event or HTTP response
    Frontend-->>User: Display live transcript

%%{init:{'themeCSS':'g.actor-man line, g.actor-man circle, g:nth-of-type(10) line.actor-line { stroke: #66ff33; fill: #66ff33; }'}}%%
`);

  const removeLastLine = (text: string) => {
    const lines = text.trimEnd().split("\n");
    if (lines.length > 1) {
      lines.pop();
      return lines.join("\n");
    }
    return text.trimEnd();
  };

  const buildSequenceDiagram = (
    service: string,
    details: string | null,
    xId: string | null
  ) => {
    const replacements: Record<string, string> = {
      Backend: "Backend: WebSocket (audio chunk)",
      WhisperService: "WhisperService: transcribe(audio_data)",
      "WhisperIntegration (AI)":
        "WhisperIntegration (AI): get_transcription_with_timestamps(temp_audio)",
    };
    const styles: Record<string, number> = {
      Backend: 1,
      WhisperService: 2,
      "WhisperIntegration (AI)": 3,
    };
    let newDiagram = diagram;

    let message = `${service}: ${details}`;
    if (xId) {
      message += ` [${xId}]`;
    }
    newDiagram = newDiagram.replace(`${service}: ${details}`, message);

    Object.entries(replacements).forEach(([key, value]) => {
      if (key !== service && xId) {
        newDiagram = newDiagram.replace(`${value} [${xId}]`, value);
      }
    });

    const topElement = 9 - styles[service];
    const bottomElement = 4 - styles[service];

    newDiagram = removeLastLine(newDiagram);
    newDiagram += `%%{init:{'themeCSS':'g:nth-of-type(${topElement}) line.actor-line, g:nth-of-type(${topElement}) g rect { stroke: #66ff33; fill: #66ff33; }, g:nth-of-type(${bottomElement}) rect.actor-bottom { stroke: #66ff33; fill: #66ff33; }'}}%%`;

    setDiagram(newDiagram);
  };

  const buildInitialSequenceDiagram = (isStarted: boolean) => {
    let newDiagram = diagram;

    newDiagram = newDiagram.replace(/\[[^\]:\s]+?\]/g, "");
    newDiagram = removeLastLine(newDiagram);

    if (isStarted) {
      newDiagram +=
        "%%{init:{'themeCSS':'g:nth-of-type(9) line.actor-line, g:nth-of-type(9) g rect { stroke: #66ff33; fill: #66ff33; }, g:nth-of-type(4) rect.actor-bottom { stroke: #66ff33; fill: #66ff33; }'}}%%";
    } else {
      newDiagram +=
        "%%{init:{'themeCSS':'g.actor-man line, g.actor-man circle, g:nth-of-type(10) line.actor-line { stroke: #66ff33; fill: #66ff33; }'}}%%";
    }

    setDiagram(newDiagram);
  };

  useEffect(() => {
    connectWebSocket();
    onXIdReceived((xId: string, service: string, details: string) => {
      if (service === "Stop") {
        setTimeout(() => {
          buildInitialSequenceDiagram(false);
        }, 4000);
      } else {
        buildSequenceDiagram(service, details, xId);
      }
    });
    onTranscriptionReceived((segments: Segment[]) => {
      setTranscripts((prev) => [...prev, ...segments]);
    });
  }, []);

  const sequenceDiagramId = useMemo(
    () => "diagram_" + Math.random().toString(36).substring(2, 10),
    []
  );

  useEffect(() => {
    if (!isMounted.current) return;
    if (isRecording) {
      buildInitialSequenceDiagram(true);
    }
  }, [isRecording]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
  }, []);

  return (
    <>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>Live Video/Audio Transcript</h1>
        <h3 className={styles.subtitle}>
          Audio files are not shared or stored in any way.
        </h3>
        <h3 className={styles.demoNote}>
          This application is for demo purposes
        </h3>
        <p className={styles.instructions}>
          <b>Code can be viewed in: </b>
          <a href="#" className={styles.codeLink}>
            github.com/your-repo
          </a>
        </p>
        <p className={styles.instructions}>
          <b>How to use it:</b> Click on the REC button and start speaking to
          the mic. Transcription should appear automatically.
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
      <div className={styles.flexRow}>
        <Transcript transcripts={transcripts} />
        <SequenceDiagram diagram={diagram} id={sequenceDiagramId} />
      </div>
    </>
  );
};

export default App;
