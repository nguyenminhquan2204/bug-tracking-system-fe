/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { dashboardTesterService } from "../services/dashboard-tester.service";
import { IDashboardData } from "../interface";

interface States {
   loading: boolean,
   dashboardData: IDashboardData | null,
}

interface Actions {
   setLoading: (loading: boolean) => void,

   getDashboard: (projectId: number) => Promise<void>,

   resetState: () => void,
}

const intialState: States = {
   loading: false,
   dashboardData: null
}

export const useDashboardTesterStore = create<States & Actions>((set, get) => ({
   ...intialState,

   setLoading: (loading: boolean) => set({ loading }),

   getDashboard: async (projectId: number) => {
      try {
         set(() => ({ loading: true }))         
         const response = await dashboardTesterService.getDashboard(projectId);
         set(() => ({
            dashboardData: response?.data
         }))
      } catch {
         set(() => ({ loading: false }))
      } finally {
         set(() => ({ loading: false }))
      }
   },

   resetState: () => set({ ...intialState }),
}))