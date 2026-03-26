'use client';
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const t = useTranslations("Admin.Chat");
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 bg-white border-t flex items-center gap-3">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder={t("input.placeholder")}
        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleSend}
        disabled={disabled}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition disabled:opacity-50"
      >
        {t("actions.send")}
      </button>
    </div>
  );
}
