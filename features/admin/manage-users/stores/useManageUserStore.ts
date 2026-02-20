import { DEFAULT_GET_LIST_QUERY } from "@/packages/utils";
import { IUserGetListQuery } from "../inferface";
import { create } from "zustand";
import { manageUserService } from '../services/manage-user.service';
import { IRole, IUser } from "@/packages/interfaces";

interface States {
   isOpenEditUserDialog: boolean,
   isOpenDeleteUserDialog: boolean,
   loading: boolean,
   userGetListQuery: IUserGetListQuery,
   totalItems: number,
   userList: IUser[],
   roleList: IRole[],
   selectedUser: IUser | null,
}

interface Actions {
   setIsOpenEditUserDialog: (open: boolean) => void,
   setIsOpenDeleteUserDialog: (open: boolean) => void,
   setLoading: (loading: boolean) => void,
   setTotalItems: (totalItems: number) => void,
   setUserGetListQuery: (query: IUserGetListQuery, opt?: { reloadList?: boolean }) => void,
   setUserList: (userList: IUser[]) => void,
   setRoleList: (roleList: IRole[]) => void,
   setSelectedUser: (user: IUser) => void,

   getUserList: () => Promise<void>,
   getRoleList: () => Promise<void>,

   resetState: () => void,
}

const intialState: States = {
   isOpenEditUserDialog: false,
   isOpenDeleteUserDialog: false,
   loading: false,
   userGetListQuery: { ...DEFAULT_GET_LIST_QUERY },
   totalItems: 0,
   userList: [],
   roleList: [],
   selectedUser: null,
}

export const useManageUserStore = create<States & Actions>((set, get) => ({
   ...intialState,

   setIsOpenEditUserDialog: (open: boolean) => set({ isOpenEditUserDialog: open }),

   setIsOpenDeleteUserDialog: (open: boolean) => set({ isOpenDeleteUserDialog: open }),

   setLoading: (loading: boolean) => set({ loading }),

   setTotalItems: (totalItems: number) => set({ totalItems }),

   setUserGetListQuery: (query: IUserGetListQuery, opt?: { reloadList?: boolean }) => {
      set((state) => ({
         userGetListQuery: { ...state.userGetListQuery, ...query },
      }));

      const { reloadList = true } = opt ?? {};

      if (reloadList) {
         get().getUserList();
      }
   },

   setUserList: (userList: IUser[]) => set({ userList: userList }),

   setRoleList: (roleList: IRole[]) => set({ roleList: roleList }),

   setSelectedUser: (user: IUser) => set({ selectedUser: user }),

   getUserList: async () => {
      try {
         set(() => ({ loading: true }));
         const response = await manageUserService.getUserList(get().userGetListQuery);
         set(() => ({
           userList: response?.data?.items ?? [],
           totalItems: response?.data?.totalItems ?? 0,
         }));
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

   getRoleList: async () => {
      try {
         set(() => ({ loading: true }));
         const response = await manageUserService.getRoleList();
         set(() => ({
           roleList: response?.data?.items ?? [],
         }));
      } catch {
         set(() => ({ loading: false }));
      } finally {
         set(() => ({ loading: false }));
      }
   },

  resetState: () => set({ ...intialState }),
}))