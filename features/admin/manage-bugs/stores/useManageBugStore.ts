/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { ISummaryBug } from "../interface";
import { manageBugSerive } from "../services/manage-bug.service";
import { IBug } from "@/features/developer/my-projects/interface";

interface States {
  loading: boolean;
  summary: ISummaryBug | null;
  bugList: IBug[];
}

interface Actions {
  setLoading: (loading: boolean) => void;

  getSummaryBugHeader: (projectId: number, query: any) => Promise<void>;
  getSummaryBugBody: (projectId: number, query: any) => Promise<void>;

  updateBugStatus: (bugId: number, status: any) => void;

  resetState: () => void;
}

const initialState: States = {
  loading: false,
  summary: null,
  bugList: [],
};

export const useManageBugStore = create<States & Actions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),

  getSummaryBugHeader: async (projectId: number, query: any) => {
    try {
      set({ loading: true });
      const response = await manageBugSerive.getSummaryBugHeader(
        projectId,
        query,
      );
      set({
        summary: response?.data ?? null,
      });
    } catch (error) {
      console.error("getSummaryBugHeader error:", error);
    } finally {
      set({ loading: false });
    }
  },

  getSummaryBugBody: async (projectId: number, query: any) => {
    try {
      set({ loading: true });
      const response = await manageBugSerive.getSummaryBugBody(
        projectId,
        query,
      );
      set({
        bugList: response?.data?.items ?? [],
      });
    } catch (error) {
      console.error("getSummaryBugHeader error:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateBugStatus: (bugId, status) =>
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

  resetState: () => set({ ...initialState }),
}));
