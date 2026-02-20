/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProject } from "@/packages/interfaces";
import { create } from "zustand";
import { dashboardService } from "../services/dashboard.service";
import { IDashboardData } from "../interface";

interface States {
   loading: boolean,
   projects: IProject[],
   dashboardData: IDashboardData | null,
}

interface Actions {
   setLoading: (loading: boolean) => void,

   getAllProject: () => Promise<void>,
   getDashboard: (projectId: number) => Promise<void>,

   resetState: () => void,
}

const intialState: States = {
   loading: false,
   projects: [],
   dashboardData: null
}

export const useDashboardAdminStore = create<States & Actions>((set, get) => ({
   ...intialState,

   setLoading: (loading: boolean) => set({ loading }),

   getAllProject: async () => {
      try {
         set(() => ({ loading: true }))         
         const response = await dashboardService.getAllProject();
         set(() => ({
            projects: response?.data ?? []
         }))
      } catch {
         set(() => ({ loading: false }))
      } finally {
         set(() => ({ loading: false }))
      }
   },

   getDashboard: async (projectId: number) => {
      try {
         set(() => ({ loading: true }))         
         const response = await dashboardService.getDashboard(projectId);
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