"use client";

import { Message, useChatSocket } from "@/packages/hooks/useChatSocket";
import { useCallback, useEffect, useRef, useState } from "react";

interface User {
  id: number;
  name: string;
  online?: boolean;
}

export default function ChatPage() {
  const currentUserId = 1;

  const [users] = useState<User[]>([
    { id: 2, name: "Nguyen Van A", online: true },
    { id: 3, name: "Tran Thi B", online: false },
    { id: 4, name: "Le Van C", online: true },
  ]);

  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Hook socket
  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const { sendMessage } = useChatSocket({
    onNewMessage: handleNewMessage,
  });

  // ✅ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(selectedUser.id, input);
    setInput("");
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="text-xl font-bold p-4">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setMessages([]); // reset messages khi đổi user
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer transition ${
                selectedUser.id === user.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {user.name.charAt(0)}
                </div>
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="font-medium">{user.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-white border-b">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              {selectedUser.name.charAt(0)}
            </div>
            {selectedUser.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <div className="font-semibold">{selectedUser.name}</div>
            <div className="text-sm text-green-500">
              {selectedUser.online ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
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

        {/* Input */}
        <div className="p-4 bg-white border-t flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}