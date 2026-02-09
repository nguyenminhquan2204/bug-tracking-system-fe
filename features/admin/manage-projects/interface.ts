import { ICommonListQuery } from "@/packages/utils"
import { IUser } from "../manage-users/inferface"

export interface IProject {
   id: number,
   isActive: boolean,
   name: string,
   description: string,
   startDate: string,
   endDate: string,
   status: string,
   manageUserId: number,
   managerUserInfo: IUser,

   createdAt: string,
   updatedAt: string,
   deletedAt:  null,
   createdBy: number | null,
   updatedBy: number | null,
   deletedBy: number | null
}

export interface IProjectGetListQuery extends ICommonListQuery {
   name?: string,
}