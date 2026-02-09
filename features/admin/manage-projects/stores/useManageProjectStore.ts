import { DEFAULT_GET_LIST_QUERY } from "@/packages/utils"
import { IProject, IProjectGetListQuery } from "../interface"
import { create } from "zustand"
import { manageProjectService } from "../services/manage-project.service"
import { IUser } from "../../manage-users/inferface"
import { manageUserService } from "../../manage-users/services/manage-user.service"

interface States {
  isOpenEditProjectDialog: boolean
  isOpenDeleteProjectDialog: boolean
  loading: boolean
  projectGetListQuery: IProjectGetListQuery
  totalItems: number
  projectList: IProject[]
  selectedProject: IProject | null
  adminList: IUser[]
}

interface Actions {
  setIsOpenEditProjectDialog: (open: boolean) => void
  setIsOpenDeleteProjectDialog: (open: boolean) => void
  setLoading: (loading: boolean) => void
  setTotalItems: (totalItems: number) => void
  setProjectGetListQuery: (
    query: Partial<IProjectGetListQuery>,
    opt?: { reloadList?: boolean }
  ) => void
  setProjectList: (projectList: IProject[]) => void
  setSelectedProject: (project: IProject | null) => void

  getProjectList: () => Promise<void>
  getAdminList: () => Promise<void>

  resetState: () => void
}

const initialState: States = {
  isOpenEditProjectDialog: false,
  isOpenDeleteProjectDialog: false,
  loading: false,
  projectGetListQuery: { ...DEFAULT_GET_LIST_QUERY },
  totalItems: 0,
  projectList: [],
  selectedProject: null,
  adminList: []
}

export const useManageProjectStore = create<States & Actions>((set, get) => ({
  ...initialState,

  setIsOpenEditProjectDialog: (open) =>
    set({ isOpenEditProjectDialog: open }),

  setIsOpenDeleteProjectDialog: (open) =>
    set({ isOpenDeleteProjectDialog: open }),

  setLoading: (loading) => set({ loading }),

  setTotalItems: (totalItems) => set({ totalItems }),

  setProjectGetListQuery: (query, opt) => {
    set((state) => ({
      projectGetListQuery: {
        ...state.projectGetListQuery,
        ...query,
      },
    }))

    const { reloadList = true } = opt ?? {}
    if (reloadList) get().getProjectList()
  },

  setProjectList: (projectList) => set({ projectList }),

  setSelectedProject: (project) => set({ selectedProject: project }),

  getProjectList: async () => {
    try {
      set({ loading: true })
      const response = await manageProjectService.getProjectList(
        get().projectGetListQuery
      )

      set({
        projectList: response?.data?.items ?? [],
        totalItems: response?.data?.totalItems ?? 0,
      })
    } catch (error) {
      console.error("Get project list error:", error)
    } finally {
      set({ loading: false })
    }
  },

  getAdminList: async () => {
    try {
      set({ loading: true })
      const response = await manageUserService.getAdminList();
      set(() => ({
        adminList: response?.data?.items ?? []
      }))
    } catch {
      set({ loading: false })
      
    } finally {
      set({ loading: false })
    }
  },

  resetState: () => set({ ...initialState }),
}))
