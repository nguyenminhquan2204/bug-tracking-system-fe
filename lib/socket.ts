import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (nameSpace: string) => {
  if (!socket) {
    socket = io(`http://localhost:8686/${nameSpace}`, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};