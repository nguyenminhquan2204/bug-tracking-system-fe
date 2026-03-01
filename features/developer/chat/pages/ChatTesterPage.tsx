"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useChatTesterStore } from "../stores/useChatTesterStore";
import { useShallow } from "zustand/shallow";
import { useChatSocket } from "@/packages/hooks/useChatSocket";
import { useProfileStore } from "@/packages/features/stores/useProfileStore";
import { Loader2 } from "lucide-react";
import { IMessage, IUserChat } from "@/packages/interfaces";
import { ChatSidebar } from "@/features/components/ChatSiderbar";
import { ChatMessages } from "@/features/components/ChatMessages";
import { ChatInput } from "@/features/components/ChatInput";

export default function ChatTesterPage() {
  const profile = useProfileStore((state) => state.profile);
  const {
    getUsersChat,
    getAdminsChat,
    adminsChat,
    usersChat,
    postConversation,
    selectedConver,
    getMessages,
    messages,
    addMessage,
    loading
  } = useChatTesterStore(
    useShallow((state) => ({
      getUsersChat: state.getUsersChat,
      getAdminsChat: state.getAdminsChat,
      adminsChat: state.adminsChat,
      usersChat: state.usersChat,
      postConversation: state.postConversation,
      selectedConver: state.selectedConver,
      getMessages: state.getMessages,
      messages: state.messages,
      addMessage: state.addMessage,
      loading: state.loading
    }))
  );
  const socket = getSocket();
  const [selectedUser, setSelectedUser] = useState<IUserChat | null>(null);
  const currentUserId = profile?.id;

  useEffect(() => {
    const fetchApi = async () => {
      await Promise.all([
        getUsersChat(),
        getAdminsChat()
      ])
    }

    fetchApi();
  }, [getUsersChat, getAdminsChat]);

  useEffect(() => {
    const handleSelectFirstUser = () => {
      if (usersChat?.length > 0 && !selectedUser) {
        setSelectedUser(usersChat[0]);
      }
    }
    handleSelectFirstUser();
  }, [usersChat, selectedUser]);

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


  const sendMessage = (message: string) => {
    if (!message.trim() || !selectedUser || !currentUserId || !selectedConver?.id)
      return;

    socket.emit("send_message", {
      conversationId: selectedConver.id,
      senderId: currentUserId,
      content: message,
    });
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
      <ChatSidebar users={adminsChat} testers={usersChat} selectedUser={selectedUser} onSelect={setSelectedUser} />
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-3 p-4 bg-white border-b">
          <div className="font-semibold text-lg">
            {selectedUser?.username || "Select a user"}
          </div>
        </div>
        <ChatMessages messages={messages} currentUserId={currentUserId} />
        <ChatInput onSend={sendMessage} disabled={!selectedUser} />
      </div>
    </div>
  );
}