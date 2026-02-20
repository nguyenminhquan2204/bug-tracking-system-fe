"use client";

import { Loader2 } from "lucide-react";

export default function Loading({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {text}
        </p>
      </div>
    </div>
  );
}
