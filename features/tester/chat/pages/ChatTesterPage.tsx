"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useChatStore } from "../stores/useChatStore";
import { useShallow } from "zustand/shallow";
import { IMessage, IUserChat } from "../interfaces";
import { useChatSocket } from "@/packages/hooks/useChatSocket";
import { useProfileStore } from "@/packages/features/stores/useProfileStore";
import { Loader2 } from "lucide-react";

export default function ChatTesterPage() {
  const profile = useProfileStore((state) => state.profile);
  const {
    getUsersChat,
    usersChat,
    postConversation,
    selectedConver,
    getMessages,
    messages,
    setMessages,
    addMessage,
    loading
  } = useChatStore(
    useShallow((state) => ({
      getUsersChat: state.getUsersChat,
      usersChat: state.usersChat,
      postConversation: state.postConversation,
      selectedConver: state.selectedConver,
      getMessages: state.getMessages,
      messages: state.messages,
      setMessages: state.setMessages,
      addMessage: state.addMessage,
      loading: state.loading
    }))
  );
  const socket = getSocket();
  const [selectedUser, setSelectedUser] = useState<IUserChat | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = profile?.id;

  useEffect(() => {
    getUsersChat();
  }, [getUsersChat]);

  useChatSocket(selectedConver?.id);

  useEffect(() => {
    if (!selectedUser) return;
    postConversation(selectedUser.id);
  }, [selectedUser, postConversation]);

  useEffect(() => {
    if (!selectedConver?.id) return;
    getMessages(selectedConver.id);
  }, [selectedConver?.id, getMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (data: IMessage) => {
      if (data.conversationId === selectedConver?.id) {
        addMessage(data);
      }
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket, selectedConver?.id, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !selectedUser || !currentUserId || !selectedConver?.id)
      return;

    const newMessage: IMessage = {
      id: 1,
      conversationId: selectedConver.id,
      senderId: currentUserId,
      content: input,
      isRead: false,
    };

    // Optimistic UI
    // addMessage(newMessage);

    socket.emit("send_message", {
      conversationId: selectedConver.id,
      senderId: currentUserId,
      content: input,
    });

    setInput("");
  };

  if (loading && !selectedConver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-100">
      <div className="w-50 bg-white border-r flex flex-col">
        <div className="text-xl font-bold p-4">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {usersChat?.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setMessages([]); // reset messages khi đổi user
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer transition ${
                selectedUser?.id === user.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                {user.username.charAt(0)}
              </div>
              <div className="font-medium">{user.username}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-3 p-4 bg-white border-b">
          <div className="font-semibold text-lg">
            {selectedUser?.username || "Select a user"}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-3 rounded-2xl max-w-sm text-sm shadow ${
                  msg.senderId === currentUserId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-blue-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white border-t flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={sendMessage}
            disabled={!selectedUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}