import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8686/chat", {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};