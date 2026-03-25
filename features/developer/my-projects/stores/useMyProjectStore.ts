import { create } from "zustand";
import { myProjectService } from "../services/myProject.service";
import { IBug, IBugGetListQuery, IBugHistory, IBugs } from "../interface";
import { IProject, IUser } from "@/packages/interfaces";

interface States {
   loading: boolean,
   isOpenDrawerInfoProject: boolean,
   isOpenDrawerCreateBug: boolean,
   isOpenDialogEditBug: boolean,
   projectList: IProject[],
   selectedProject: IProject | null,
   selectedProjectId: number | null,
   bugs: IBugs | null,
   developerList: IUser[],
   usersMention: IUser[],
   bugDetail: IBug | null,
   bugHistorys: IBugHistory[],
   bugGetListQuery: IBugGetListQuery,
}

interface Actions {
   setLoading: (loading: boolean) => void,
   setIsOpenDrawerInfoProject: (open: boolean) => void,
   setIsOpenDrawerCreateBug: (open: boolean) => void,
   setIsOpenDialogEditBug: (open: boolean) => void,
   setSelectedProject: (project: IProject) => void,
   setBugGetListQuery: (query: IBugGetListQuery, opt?: { reloadList?: boolean }) => void,

   getMyProjects: () => Promise<void>,
   getProjectById: (projectId: number) => Promise<void>,
   getUsersMention: (projectId: number) => Promise<void>,
   getDevelopersInProject: (projectId: number) => Promise<void>,
   getBugs: (projectId: number) => Promise<void>,
   getBugDetailById: (bugId: number) => Promise<void>,
   getBugHistoryById: (bugId: number) => Promise<void>,

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
   selectedProjectId: null,
   bugs: null,
   developerList: [],
   usersMention: [],
   bugDetail: null,
   bugHistorys: [],
   bugGetListQuery: {
      search: ''
   }
}

export const useMyProjectStore = create<States & Actions>((set, get) => ({
   ...intialStates,

   setLoading: (loading: boolean) => set({ loading }),

   setIsOpenDrawerInfoProject: (open: boolean) => set({ isOpenDrawerInfoProject: open }), 

   setIsOpenDrawerCreateBug: (open: boolean) => set({ isOpenDrawerCreateBug: open }), 

   setIsOpenDialogEditBug: (open: boolean) => set({ isOpenDialogEditBug: open }),

   setSelectedProject: (project: IProject) => set({ selectedProject: project }),

   setBugGetListQuery: (query: IBugGetListQuery, opt?: { reloadList?: boolean }) => {
      set((state) => ({
         bugGetListQuery: { ...state.bugGetListQuery, ...query },
      }));

      const { reloadList = true } = opt ?? {};

      if (reloadList) {
         get().getBugs(get().selectedProjectId ?? 0);
      }
   },
   
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

   getUsersMention: async (projectId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await myProjectService.getUsersMention(projectId);
         set(() => ({
            usersMention: response?.data ?? []
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
         set(() => ({ 
            loading: true,
            selectedProjectId: projectId 
         }));
         const response = await myProjectService.getBugs(projectId, get().bugGetListQuery);
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

   getBugHistoryById: async (bugId: number) => {
      try {
         set(() => ({ loading: true }));
         const response = await myProjectService.getBugHistoryById(bugId);
         set(() => ({
            bugHistorys: response?.data ?? null
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