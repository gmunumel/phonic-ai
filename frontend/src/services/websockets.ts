let socket: WebSocket | null = null;
let xIdCallback:
  | ((xId: string | null, service: string, details: string | null) => void)
  | null = null;
let transcriptionCallback:
  | ((
      transcripts: Array<{
        id: number;
        text: string;
        start: number;
        end: number;
      }>
    ) => void)
  | null = null;
let connectionStatusCallback: ((connected: boolean) => void) | null = null;

const WAIT_TIME_BEFORE_RECONNECT_MS = Number(
  process.env.WAIT_TIME_BEFORE_RECONNECT_MS || 30000 // 30 seconds
);

export const connectWebSocket = () => {
  const wsUrl =
    process.env.REACT_APP_BACKEND_URL?.replace(/^http/, "ws") +
      "/ws/transcribe" || "ws://localhost:8000/ws/transcribe";
  console.log("Connecting to WebSocket server at:", wsUrl);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("Connected to WebSocket server");
    if (connectionStatusCallback) connectionStatusCallback(true);
  };

  socket.onclose = (event) => {
    if (connectionStatusCallback) connectionStatusCallback(false);
    // Custom close code
    if (event.code === 4000) {
      // Wait before reconnecting
      setTimeout(() => {
        connectWebSocket();
      }, WAIT_TIME_BEFORE_RECONNECT_MS);
    } else {
      // Handle other close reasons
    }
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  socket.onmessage = (event) => {
    if (typeof event.data === "string") {
      if (event.data.includes("Rate limit exceeded")) {
        window.dispatchEvent(
          new CustomEvent("rate-limit-error", { detail: event.data })
        );
        return;
      }
      if (event.data.toLowerCase().includes("error")) {
        window.dispatchEvent(
          new CustomEvent("generic-error", { detail: event.data })
        );
        return;
      }
    }

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
  if (isWebSocketConnected()) {
    socket.send(JSON.stringify({ xId }));
  }
};

export const sendMessage = (message: string) => {
  if (isWebSocketConnected()) {
    socket.send(JSON.stringify({ message }));
  }
};

export const onXIdReceived = (
  callback: (xId: string, service: string, details: string) => void
) => {
  xIdCallback = callback;
};

export const sendAudioChunk = (blob: Blob) => {
  if (isWebSocketConnected()) {
    blob.arrayBuffer().then((buffer) => {
      socket.send(buffer);
    });
  }
};

export const onTranscriptionReceived = (
  callback: (
    transcripts: Array<{ id: number; text: string; start: number; end: number }>
  ) => void
) => {
  transcriptionCallback = callback;
};

export const isWebSocketConnected = () =>
  socket && socket.readyState === WebSocket.OPEN;

export const onConnectionStatusChange = (
  callback: (connected: boolean) => void
) => {
  connectionStatusCallback = callback;
};
