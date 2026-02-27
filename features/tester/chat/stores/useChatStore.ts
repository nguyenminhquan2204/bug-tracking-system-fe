import { create } from "zustand";
import { chatService } from "../services/chat.service";
import { IConver, IMessage, IUserChat } from "../interfaces";

interface States {
   loading: boolean,
   usersChat: IUserChat[],
   selectedConver: IConver | null
   messages: IMessage[]
}

interface Actions {
   setLoading: (loading: boolean) => void,
   setMessages: (messages: IMessage[]) => void,
   
   getUsersChat: () => Promise<void>,
   getMessages: (converId: number) => Promise<void>,

   postConversation: (toUserId: number) => Promise<void>,

   resetState: () => void,
   addMessage: (message: IMessage) => void
}

const intialStates: States = {
   loading: false,
   usersChat: [],
   selectedConver: null,
   messages: []
}

export const useChatStore = create<States & Actions>((set, get) => ({
   ...intialStates,

   setLoading: (loading) => set({ loading }),

   setMessages: (messages) => set({ messages }),

   getUsersChat: async () => {
      try {
         set(() => ({ loading: true }));
         const response = await chatService.getUsersChat();
         set(() => ({ usersChat: response?.data ?? [] }));         
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   postConversation: async(toUserId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await chatService.postConversation(toUserId);
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
         const response = await chatService.getMessages(converId);
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