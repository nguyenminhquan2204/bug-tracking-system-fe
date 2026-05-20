/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { IBug } from "@/features/developer/my-projects/interface";
import { bugTesterService } from "../services/bugTester.service";

interface States {
  loading: boolean;
  bugList: IBug[];
}

interface Actions {
  setLoading: (loading: boolean) => void;

  getMyBugsForTester: () => Promise<void>;

  updateBugStatusForTester: (bugId: number, status: any) => void;
  updateBugPriorityForTester: (bugId: number, priority: any) => void;

  resetState: () => void;
}

const initialState: States = {
  loading: false,
  bugList: [],
};

export const useManageBugTesterStore = create<States & Actions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),

  getMyBugsForTester: async () => {
    try {
      set({ loading: true });

      const response = await bugTesterService.getMyBugsForTester();
      set({
        bugList: response?.data
      })
    } catch (error) {
      console.log('Error in getMyBugsForTester: ', error);
    } finally {
      set({ loading: false });
    }
  },

  updateBugStatusForTester: (bugId, status) =>
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

  updateBugPriorityForTester: (bugId, priority) =>
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
