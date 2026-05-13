export function getRandomColor(): string {
  const letters = "0123456789abcdef";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

export function formatTime(date: Date | string) {
  const d = new Date(date);
  const now = new Date();

  const isSameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return `${d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  })} ${d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export const statusStyles: Record<string, string> = {
  INIT: "border-gray-400 bg-gray-400/10 text-gray-600",
  PENDING: "border-yellow-500 bg-yellow-500/10 text-yellow-600",
  IN_PROGRESS: "border-blue-500 bg-blue-500/10 text-blue-600",
  COMPLETED: "border-green-500 bg-green-500/10 text-green-600",
  CANCELLED: "border-red-500 bg-red-500/10 text-red-600",
  ARCHIVED: "border-purple-500 bg-purple-500/10 text-purple-600",
};

export const getAvatarStyle = (name: string) => {
  const colors = [
    "from-red-400 to-red-600",
    "from-green-400 to-green-600",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-yellow-400 to-yellow-600",
    "from-indigo-400 to-indigo-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};