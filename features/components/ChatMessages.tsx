'use client';
import { formatTime } from "@/packages/helpers";
import { IMessage } from "@/packages/interfaces";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface Props {
  messages: IMessage[];
  currentUserId?: number;
}

export function ChatMessages({ messages, currentUserId }: Props) {
   const t = useTranslations("Admin.Chat");
   const messagesEndRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   if (!messages || messages.length === 0) {
      return (
         <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
            {t("noMessages")}
         </div>
      );
   }

   return (
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
         {messages.map((msg, index) => {
            const isMine = msg.senderId === currentUserId;
            return (
               <div
                  key={index}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
               >
                  <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-sm`}>
                     <div
                        className={`px-5 py-3 rounded-2xl text-sm shadow ${
                           isMine
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-blue-100 text-gray-800 rounded-bl-none"
                        }`}
                     >
                        {msg.content}
                     </div>
                     <span className="text-xs mt-1 text-gray-400">
                        {formatTime(msg.createdAt)}
                     </span>
                  </div>
               </div>
            );
         })}
         <div ref={messagesEndRef} />
      </div>
   );
}
