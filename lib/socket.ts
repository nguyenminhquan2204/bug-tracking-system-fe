import { io } from "socket.io-client";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const socket = io(`${BASE_URL}/chat`, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = () => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.log("No token found");
    return;
  }

  socket.auth = {
    accessToken: token,
  };

  socket.connect();
};