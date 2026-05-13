import { useEffect } from "react";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { useNotificationStore } from "@/features/developer/noti/stores/useNotificationStore";

export const useNotificationSocket = (userId?: number) => {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket("notification");

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_notification", { userId });

    socket.on("receive_notification", (data) => {
      addNotification(data);
      toast.info("You have a new notification");
    });

    return () => {
      socket.off("receive_notification");
    };
  }, [userId, addNotification]);
};
