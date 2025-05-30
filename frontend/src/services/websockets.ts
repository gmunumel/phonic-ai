let socket: WebSocket | null = null;
let xIdCallback:
  | ((xId: string | null, service: string, details: string | null) => void)
  | null = null;
let transcriptionCallback:
  | ((segments: Array<{ text: string; start: number; end: number }>) => void)
  | null = null;

export const connectWebSocket = () => {
  const wsUrl =
    process.env.REACT_APP_BACKEND_URL?.replace(/^http/, "ws") +
      "/ws/transcribe" || "ws://localhost:8000/ws/transcribe";
  console.log("Connecting to WebSocket server at:", wsUrl);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("Connected to WebSocket server");
  };

  socket.onclose = () => {
    console.log("Disconnected from WebSocket server");
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.service && xIdCallback) {
        xIdCallback(data.xId, data.service, data.details);
      } else if (data.event === "transcription" && transcriptionCallback) {
        transcriptionCallback(data.transcripts);
      }
    } catch (e) {
      console.error("Failed to parse WebSocket message:", e);
    }
  };
};

export const sendXId = (xId: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ xId }));
  }
};

export const sendMessage = (message: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }));
  }
};

export const onXIdReceived = (
  callback: (xId: string, service: string, details: string) => void
) => {
  xIdCallback = callback;
};

export const sendAudioChunk = (blob: Blob) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    blob.arrayBuffer().then((buffer) => {
      socket.send(buffer);
    });
  }
};

export const onTranscriptionReceived = (
  callback: (
    segments: Array<{ text: string; start: number; end: number }>
  ) => void
) => {
  transcriptionCallback = callback;
};
