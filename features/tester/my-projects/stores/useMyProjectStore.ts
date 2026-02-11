import { IProject } from "@/features/admin/manage-projects/interface";
import { create } from "zustand";
import { myProjectService } from "../services/myProject.service";
import { IBugs } from "../interface";

interface States {
   loading: boolean,
   isOpenDrawerInfoProject: boolean,
   isOpenDrawerCreateBug: boolean,
   projectList: IProject[],
   selectedProject: IProject | null,
   bugs: IBugs | null,
}

interface Actions {
   setLoading: (loading: boolean) => void,
   setIsOpenDrawerInfoProject: (open: boolean) => void,
   setIsOpenDrawerCreateBug: (open: boolean) => void,
   setSelectedProject: (project: IProject) => void,

   getMyProjects: () => Promise<void>,
   getBugs: () => Promise<void>,
   patchUpdateBugStatus: (bugId: number, newStatus: string) => void,

   resetState: () => void,
}

const intialStates: States = {
   loading: false,
   isOpenDrawerInfoProject: false,
   isOpenDrawerCreateBug: false,
   projectList: [],
   selectedProject: null,
   bugs: null
}

export const useMyProjectStore = create<States & Actions>((set, get) => ({
   ...intialStates,

   setLoading: (loading: boolean) => set({ loading }),

   setIsOpenDrawerInfoProject: (open: boolean) => set({ isOpenDrawerInfoProject: open }), 

   setIsOpenDrawerCreateBug: (open: boolean) => set({ isOpenDrawerCreateBug: open }), 

   setSelectedProject: (project: IProject) => set({ selectedProject: project }),
   
   getMyProjects: async () => {
      try {
         set(() => ({ loading: true }));
         const response = await myProjectService.getMyProject();
         set(() => ({
            projectList: response?.data?.projects ?? []
         }))
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   getBugs: async() => {
      try {
         set(() => ({ loading: true }));
         const response = await myProjectService.getBugs();
         set(() => ({
            bugs: response?.data?.bugs ?? null
         }))
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   }, 

   patchUpdateBugStatus: async (bugId: number, newStatus: string) => {
      try {
         set(() => ({ loading: true }));
         await myProjectService.patchUpdateBugStatus(bugId, newStatus);
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   resetState: () => set({ ...intialStates }),
}))