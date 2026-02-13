/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { profileService } from '../services/profile.service';
import { IUser } from '@/packages/interfaces';

interface States {
  loading: boolean,
  error: string | null,
  profile: IUser | null
}

interface Actions {
   setLoading: (loading: boolean) => void,
   setError: (message: string | null) => void,
   setProfile: (user: IUser | null) => void,
   
   getProfile: () => void,

   resetState: () => void
}

const intialState: States = {
  loading: false,
  error: null,
  profile: null
}

export const useProfileStore = create<States & Actions>((set, get) => ({
   ...intialState,

   setLoading: (loading: boolean) => set({ loading }),

   setError: (message) => set({ error: message }),

   setProfile: (user: IUser | null ) => set({ profile: user }),

   getProfile: async () => {
      try {
         set(() => ({ loading: true }));
         const response: any = await profileService.getProfile();
         set(() => ({
            profile: response || null
         }));
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   resetState: () => set({ ...intialState }),
}))
