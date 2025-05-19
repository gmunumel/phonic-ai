import React, { useEffect, useRef, useState } from "react";
import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc";

const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<RecordRTCPromisesHandler | null>(
    null
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newRecorder = new RecordRTCPromisesHandler(stream, {
      type: "audio",
    });
    await newRecorder.startRecording();
    setRecorder(newRecorder);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (recorder) {
      await recorder.stopRecording();
      const audioBlob = await recorder.getBlob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      }
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recorder) {
        recorder.destroy();
      }
    };
  }, [recorder]);

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default Recorder;
