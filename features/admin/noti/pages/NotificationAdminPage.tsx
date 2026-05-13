"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useNotificationStore } from "../stores/useNotificationStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarStyle } from "@/packages/helpers";
import { getSocket } from "@/lib/socket";
import { useProfileStore } from "@/packages/features/stores/useProfileStore";
import { INotification } from "../interface";
import { notificationService } from "../services/notification.service";
import { toast } from "sonner";

export default function NotificationAdminPage() {
  const { profile } = useProfileStore();
  const socket = getSocket('notification');
  const { getMyNotifications, notificationList, totalItems, addNotification } = useNotificationStore(useShallow((state) => ({
    getMyNotifications: state.getMyNotifications,
    notificationList: state.notificationList,
    totalItems: state.totalItems,
    addNotification: state.addNotification
  })))

  const handleRead = async (noti: INotification) => {
    try {
      if(!noti) return;
      const response = await notificationService.readNotification(noti.id);
      if(response?.success) {
        toast.success('Readed');
        getMyNotifications();
      } else {
        toast.error(response?.message || 'Failed read notification');
      }
    } catch (error) {
      toast.error('An error occurred while read notification');
      console.log(error);
    }
  }

  useEffect(() => {
    getMyNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_notification', { userId: profile?.id });

    socket.on('receive_notification', (data) => {
      addNotification(data);
    });

    return () => {
      socket.off('receive_notification');
    };
  }, [socket, addNotification]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
          🔔 Notifications {totalItems}
        </h1>

        <div className="space-y-3">
          {notificationList && notificationList.length > 0 &&  notificationList.map((noti) => (
            <div
              key={noti.id}
              className={`flex items-start gap-4 p-4 rounded-xl shadow-sm border transition hover:shadow-md cursor-pointer
              ${
                noti.isRead
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  : "bg-blue-50 dark:bg-slate-800 border-blue-200"
              }`}
              onClick={() => handleRead(noti)}
            >
              <Avatar className="h-[50px] w-[50px] shadow-md ring-2 ring-white dark:ring-slate-700">
                <AvatarFallback
                  className={`bg-gradient-to-br ${getAvatarStyle(
                    noti.senderName
                  )} text-white font-bold text-lg flex items-center justify-center`}
                >
                  {noti.senderName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800 dark:text-white">
                    {noti.title}
                  </h2>

                  {!noti.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  <span className="font-medium">
                    {noti.senderName}
                  </span>{" "}
                  - {noti.content}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  {new Date(noti.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {notificationList.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            Không có thông báo nào
          </div>
        )}
      </div>
    </div>
  );
}