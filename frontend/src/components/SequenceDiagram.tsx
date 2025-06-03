import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { stopRecord } from "store/recorderSlice";
import mermaid from "mermaid";
import { onXIdReceived } from "services/websockets";
import styles from "components/SequenceDiagram.module.css";

mermaid.initialize({});

const id = "diagram_" + Math.random().toString(36).substring(2, 10);
const WAIT_TIME_TO_RESET_DIAGRAM_MS = Number(
  process.env.WAIT_TIME_TO_RESET_DIAGRAM_MS || 4000 // 4 seconds
);

const SequenceDiagram: React.FC = () => {
  const isRecording = useSelector((state: any) => state.recorder.isRecording);
  const isMounted = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
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
      WhisperService->>WhisperIntegration (AI): get_transcription(temp_audio)
      WhisperIntegration (AI)-->>WhisperService: [transcripts: text, start, end]
      WhisperService-->>Backend: [transcripts: text, start, end]
      Backend-->>Frontend: WebSocket "transcription" event
      Frontend-->>User: Display live transcript
  
  %%{init:{'themeCSS':'g.actor-man line, g.actor-man circle, g:nth-of-type(10) line.actor-line { stroke: #66ff33; fill: #66ff33; }'}}%%
  `);
  const dispatch = useDispatch();

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
        "WhisperIntegration (AI): get_transcription(temp_audio)",
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

  const getBaseDiagram = () => {
    let newDiagram = diagram;
    newDiagram = newDiagram.replace(/\[[^\]:\s]+?\]/g, "");
    newDiagram = removeLastLine(newDiagram);
    return newDiagram;
  };

  const buildSequenceDiagramInitial = () => {
    let newDiagram = getBaseDiagram();

    newDiagram +=
      "%%{init:{'themeCSS':'g.actor-man line, g.actor-man circle, g:nth-of-type(10) line.actor-line { stroke: #66ff33; fill: #66ff33; }'}}%%";

    setDiagram(newDiagram);
  };

  const buildSequenceDiagramFirstStep = () => {
    let newDiagram = getBaseDiagram();

    newDiagram +=
      "%%{init:{'themeCSS':'g:nth-of-type(9) line.actor-line, g:nth-of-type(9) g rect { stroke: #66ff33; fill: #66ff33; }, g:nth-of-type(4) rect.actor-bottom { stroke: #66ff33; fill: #66ff33; }'}}%%";

    setDiagram(newDiagram);
  };

  useEffect(() => {
    const initializeMermaid = async () => {
      if (ref.current) {
        ref.current.innerHTML = diagram;
        const result = await mermaid.render(`mermaid-diagram-${id}`, diagram);
        if (!result) {
          console.error("Mermaid render failed");
          return;
        }
        const { svg, bindFunctions } = result;
        ref.current.innerHTML = svg;
        bindFunctions?.(ref.current);
      }
    };

    initializeMermaid();

    return () => {};
  }, [diagram, id]);

  useEffect(() => {
    onXIdReceived((xId: string, service: string, details: string) => {
      if (service === "Stop") {
        setTimeout(() => {
          buildSequenceDiagramInitial();
        }, WAIT_TIME_TO_RESET_DIAGRAM_MS);
      } else {
        buildSequenceDiagram(service, details, xId);
      }
    });
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      if (isRecording) {
        buildSequenceDiagramFirstStep();
      }
    }
  }, [isRecording]);

  useEffect(() => {
    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      console.error("Error received:", customEvent.detail);
      dispatch(stopRecord());
      setTimeout(() => {
        buildSequenceDiagramInitial();
      }, WAIT_TIME_TO_RESET_DIAGRAM_MS);
    };
    window.addEventListener("generic-error", errorHandler);
    window.addEventListener("rate-limit-error", errorHandler);
    return () => {
      window.removeEventListener("generic-error", errorHandler);
      window.removeEventListener("rate-limit-error", errorHandler);
    };
  }, []);

  return (
    <div id={id} className={styles.diagramContainer}>
      <h2>Sequence Diagram</h2>
      <div ref={ref} />
    </div>
  );
};

export default SequenceDiagram;
