import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export const useChatSocket = (conversationId?: number) => {
  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket('chat');

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_conversation", { conversationId });

  }, [conversationId]);
};