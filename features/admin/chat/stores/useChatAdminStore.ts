import { create } from "zustand";
import { chatAdminService } from "../services/chatAdmin.service";
import { IConver, IMessage, IUserChat } from "@/packages/interfaces";

interface States {
   loading: boolean,
   adminsChat: IUserChat[],
   testersChat: IUserChat[],
   developersChat: IUserChat[],
   selectedConver: IConver | null
   messages: IMessage[]
}

interface Actions {
   setLoading: (loading: boolean) => void,
   setMessages: (messages: IMessage[]) => void,
   
   getUsersChatAdmin: () => Promise<void>,
   getMessages: (converId: number) => Promise<void>,

   postConversation: (toUserId: number) => Promise<void>,

   resetState: () => void,
   addMessage: (message: IMessage) => void
}

const intialStates: States = {
   loading: false,
   adminsChat: [],
   testersChat: [],
   developersChat: [],
   selectedConver: null,
   messages: []
}

export const useChatAdminStore = create<States & Actions>((set, get) => ({
   ...intialStates,

   setLoading: (loading) => set({ loading }),

   setMessages: (messages) => set({ messages }),

   getUsersChatAdmin: async () => {
      try {
         set(() => ({ loading: true }));
         const response = await chatAdminService.getUsersChatAdmin();
         set(() => ({ 
            adminsChat: response?.data.Admin ?? [], 
            testersChat: response?.data.Tester ?? [], 
            developersChat: response?.data.Developer ?? [], 
         }));         
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   postConversation: async(toUserId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await chatAdminService.postConversation(toUserId);
         set(() => ({ selectedConver: response?.data ?? null }));
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   getMessages: async (converId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await chatAdminService.getMessages(converId);
         set(() => ({ messages: response?.data ?? [] }));
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   resetState: () => set({ ...intialStates }),

   addMessage: (message) => set((state) => ({ messages: [...state.messages, message] }))
}))