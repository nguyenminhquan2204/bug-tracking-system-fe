import { ICommonListQuery } from '@/packages/utils';
import { IProject } from '../manage-projects/interface';

export interface IUserGetListQuery extends ICommonListQuery {
   userName?: string;
   roleId?: number | null;
}

export interface IRole {
   id: number,
   isActive: boolean,
   name: string,
   description: string

   createdAt: string,
   updatedAt: string,
   deletedAt: null,

   createdBy: number | null,
   updatedBy: number | null,
   deletedBy: number | null,
}

export interface IUser {
   id: number,
   isActive: boolean,
   userName: string,
   email: string,
   roleId: number,
   role: IRole,
   imageId: number | null,

   createdAt: string,
   updatedAt: string,
   deletedAt: null,
   createdBy: number | null,
   updatedBy: number | null,
   deletedBy: number | null,
}

export interface IMember {
   id: number,
   userId: number,
   projectId: number,
   user: IUser,
   project: IProject
}