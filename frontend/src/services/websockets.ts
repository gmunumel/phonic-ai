import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); // Adjust the URL as needed

export const connectWebSocket = () => {
  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });
};

export const sendMessage = (message: string) => {
  socket.emit("message", message);
};

export const onMessageReceived = (callback: (message: string) => void) => {
  socket.on("message", (message: string) => {
    callback(message);
  });
};
