import { io, Socket } from "socket.io-client";

const sockets: Record<string, Socket> = {};

export const getSocket = (nameSpace: string) => {
  if (!sockets[nameSpace]) {
    sockets[nameSpace] = io(`http://localhost:8686/${nameSpace}`, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });
  }
  return sockets[nameSpace];
};
