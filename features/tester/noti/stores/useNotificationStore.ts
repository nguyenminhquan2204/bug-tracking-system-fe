/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { notificationService } from "../services/notification.service";
import { INotification } from "../interface";

interface States {
   loading: boolean,
   totalItems: number,
   notificationList: INotification[]
}

interface Actions {
   setLoading: (loading: boolean) => void,

   addNotification: (noti: INotification) => void,

   getMyNotifications: () => Promise<void>,

   resetState: () => void,
}

const intialStates: States = {
   loading: false,
   totalItems: 0,
   notificationList: []
}

export const useNotificationStore = create<States & Actions>((set, get) => ({
   ...intialStates,

   setLoading: (loading: boolean) => set({ loading }),

   addNotification: (noti: INotification) => {
      const { notificationList } = get();
      set({
         notificationList: [...notificationList, noti],
         totalItems: get().totalItems + 1
      });
   },

   getMyNotifications: async () => {
      try {
         set(() => ({ loading: true }));
         const response = await notificationService.getMyNotifications();
         set(() => ({ 
            notificationList: response?.data?.items ?? [],
            totalItems: response?.data?.totalItems ?? 0
         }))
      } catch(error) {
         set(() => ({ loading: false }));
         console.log('Error from getMyNotifications: ', error);
      } finally {
         set(() => ({ loading: false }));
      }
   },
   
   resetState: () => set({ ...intialStates }),
}))