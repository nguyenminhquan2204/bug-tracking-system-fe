/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { IBug } from "@/features/developer/my-projects/interface";
import { bugDevService } from "../services/bugDev.service";

interface States {
  loading: boolean;
  bugList: IBug[];
}

interface Actions {
  setLoading: (loading: boolean) => void;

  getMyBugsForDev: () => Promise<void>;

  updateBugStatusForDev: (bugId: number, status: any) => void;
  updateBugPriorityForDev: (bugId: number, priority: any) => void;

  resetState: () => void;
}

const initialState: States = {
  loading: false,
  bugList: [],
};

export const useManageBugDevStore = create<States & Actions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),

  getMyBugsForDev: async () => {
    try {
      set({ loading: true });

      const response = await bugDevService.getMyBugsForDev();
      set({
        bugList: response?.data
      })
    } catch (error) {
      console.log('Error in getMyBugsForTester: ', error);
    } finally {
      set({ loading: false });
    }
  },

  updateBugStatusForDev: (bugId, status) =>
    set((state) => ({
      bugList: state.bugList.map((bug) =>
        bug.id === bugId
          ? {
              ...bug,
              status,
            }
          : bug,
      ),
    })),

  updateBugPriorityForDev: (bugId, priority) =>
    set((state) => ({
      bugList: state.bugList.map((bug) =>
        bug.id === bugId
          ? {
              ...bug,
              priority,
            }
          : bug,
      ),
    })),

  resetState: () => set({ ...initialState }),
}));
