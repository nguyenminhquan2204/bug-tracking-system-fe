/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { fileService } from '../services/file.service';

interface States {
  loading: boolean,
  error: string | null,
   files: any[]
}

interface Actions {
   setLoading: (loading: boolean) => void,
   setError: (message: string | null) => void,

   getFilesForConversation: (converId: number) => Promise<void>,

   resetState: () => void
}

const intialState: States = {
  loading: false,
  error: null,
  files: [],
}

export const useFileStore = create<States & Actions>((set, get) => ({
   ...intialState,

   setLoading: (loading: boolean) => set({ loading }),

   setError: (message) => set({ error: message }),

   getFilesForConversation: async (converId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await fileService.getFilesByConversationId(converId);
         set(() => ({
            files: response?.data || []
         }));
      } catch(error) {
         set(() => ({ loading: false }));
         console.log('Error fetching files for conversation', error);
      } finally {
         set(() => ({ loading: false }));
      }
   },

   resetState: () => set({ ...intialState }),
}))
