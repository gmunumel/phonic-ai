import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startRecord, stopRecord } from "store/recorderSlice";
import { RecordRTCPromisesHandler } from "recordrtc";
import {
  sendXId,
  sendAudioChunk,
  sendMessage,
  isWebSocketConnected,
} from "services/websockets";
import styles from "components/Recorder.module.css";

const WAIT_TIME_BETWEEN_CHUNK_AUDIO_MS = Number(
  process.env.WAIT_TIME_BETWEEN_CHUNK_AUDIO_MS || 4000 // 4 seconds
);

const Recorder: React.FC = () => {
  const isPlaying = useSelector((state: any) => state.recorder.isRecording);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTCPromisesHandler | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const xIdRef = useRef<string | null>(null);
  const dispatch = useDispatch();

  const startRecording = async () => {
    if (!isWebSocketConnected()) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio recording is not supported in this browser/environment.");
      return;
    }
    dispatch(startRecord());
    xIdRef.current = Math.random().toString(36).substring(2, 15);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new RecordRTCPromisesHandler(stream, { type: "audio" });
    await recorder.startRecording();
    recorderRef.current = recorder;
    setIsRecording(true);

    intervalRef.current = setInterval(async () => {
      if (recorderRef.current) {
        await recorderRef.current.stopRecording();
        const blob = await recorderRef.current.getBlob();
        sendXId(xIdRef.current);
        sendAudioChunk(blob);
        xIdRef.current = Math.random().toString(36).substring(2, 15);
        await recorderRef.current.startRecording();
      }
    }, WAIT_TIME_BETWEEN_CHUNK_AUDIO_MS);
  };

  const stopRecording = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (recorderRef.current) {
      await recorderRef.current.stopRecording();
      const blob = await recorderRef.current.getBlob();
      const audioUrl = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      }
      sendXId(xIdRef.current);
      sendAudioChunk(blob);
      recorderRef.current.destroy();
      recorderRef.current = null;
      sendMessage("Stop");
      dispatch(stopRecord());
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recorderRef.current) recorderRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      stopRecording();
    }
  }, [isPlaying]);

  return (
    <div className={styles.recorderRow}>
      <button
        className={`${styles.button} ${isRecording ? styles.recording : ""}`}
        onClick={isRecording ? stopRecording : startRecording}
        aria-label={isRecording ? "Stop Recording" : "Start Recording"}
      >
        <span className={styles.icon}>
          {isRecording ? (
            // Stop icon (square)
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect x="8" y="8" width="16" height="16" fill="white" />
            </svg>
          ) : (
            // Record icon (circle)
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#e74c3c" />
            </svg>
          )}
        </span>
      </button>
      <span data-testid="rec-label" className={styles.recLabel}>
        REC
      </span>
      <br />
      <audio ref={audioRef} controls />
    </div>
  );
};

export default Recorder;
