import { IProject } from "@/features/admin/manage-projects/interface";
import { create } from "zustand";
import { myProjectService } from "../services/myProject.service";
import { IBug, IBugs } from "../interface";
import { IUser } from "@/packages/interfaces";

interface States {
   loading: boolean,
   isOpenDrawerInfoProject: boolean,
   isOpenDrawerCreateBug: boolean,
   isOpenDialogEditBug: boolean,
   projectList: IProject[],
   selectedProject: IProject | null,
   bugs: IBugs | null,
   developerList: IUser[],
   bugDetail: IBug | null,
}

interface Actions {
   setLoading: (loading: boolean) => void,
   setIsOpenDrawerInfoProject: (open: boolean) => void,
   setIsOpenDrawerCreateBug: (open: boolean) => void,
   setIsOpenDialogEditBug: (open: boolean) => void,
   setSelectedProject: (project: IProject) => void,

   getMyProjects: () => Promise<void>,
   getProjectById: (projectId: number) => Promise<void>,
   getDevelopersInProject: (projectId: number) => Promise<void>,
   getBugs: (projectId: number) => Promise<void>,
   getBugDetailById: (bugId: number) => Promise<void>,

   patchUpdateBugStatus: (bugId: number, newStatus: string) => void,

   resetState: () => void,
}

const intialStates: States = {
   loading: false,
   isOpenDrawerInfoProject: false,
   isOpenDrawerCreateBug: false,
   isOpenDialogEditBug: false,
   projectList: [],
   selectedProject: null,
   bugs: null,
   developerList: [],
   bugDetail: null
}

export const useMyProjectStore = create<States & Actions>((set, get) => ({
   ...intialStates,

   setLoading: (loading: boolean) => set({ loading }),

   setIsOpenDrawerInfoProject: (open: boolean) => set({ isOpenDrawerInfoProject: open }), 

   setIsOpenDrawerCreateBug: (open: boolean) => set({ isOpenDrawerCreateBug: open }), 

   setIsOpenDialogEditBug: (open: boolean) => set({ isOpenDialogEditBug: open }),

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

   getProjectById: async (projectId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await myProjectService.getProjectById(projectId);
         set(() => ({
            selectedProject: response?.data ?? null
         }))
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   getDevelopersInProject: async (projectId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await myProjectService.getDevelopersInProject(projectId);
         set(() => ({
            developerList: response?.data?.developers ?? []
         }))
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   getBugs: async(projectId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await myProjectService.getBugs(projectId);
         set(() => ({
            bugs: response?.data?.bugs ?? null
         }))
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   }, 

   getBugDetailById: async (bugId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await myProjectService.getBugDetailById(bugId);
         set(() => ({
            bugDetail: response?.data ?? null
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