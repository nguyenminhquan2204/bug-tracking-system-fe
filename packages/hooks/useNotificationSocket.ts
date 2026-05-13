import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export const useNotificationSocket = (userId?: number) => {
  useEffect(() => {
    if (!userId) return;

    const socket = getSocket('notification');

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_notification", { userId });

  }, [userId]);
};