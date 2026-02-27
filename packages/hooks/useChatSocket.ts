// hooks/useChatSocket.ts
import { useEffect } from "react";
import { socket, connectSocket } from "@/lib/socket";

export interface Message {
  id: number;
  senderId: number;
  content: string;
}

interface Props {
  onNewMessage: (message: Message) => void;
}

export const useChatSocket = ({ onNewMessage }: Props) => {
   useEffect(() => {
      connectSocket();

      socket.on("connect", () => {
         console.log("Connected:", socket.id);
      });

      socket.on("newMessage", onNewMessage);

      return () => {
         socket.off("newMessage", onNewMessage);
         socket.off("connect");
         // socket.disconnect();
      };
   }, [onNewMessage]);

   const sendMessage = (conversationId: number, content: string) => {
      socket.emit("sendMessage", { conversationId, content });
   };

   return { sendMessage };
};