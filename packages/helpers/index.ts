export function getRandomColor(): string {
  const letters = '0123456789abcdef';
  let color = '#';

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