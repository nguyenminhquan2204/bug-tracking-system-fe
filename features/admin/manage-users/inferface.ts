import { ICommonListQuery } from '@/packages/utils';
import { IProject } from '../manage-projects/interface';
import { IUser } from '@/packages/interfaces';

export interface IUserGetListQuery extends ICommonListQuery {
   userName?: string;
   roleId?: number | null;
}

export interface IMember {
   id: number,
   userId: number,
   projectId: number,
   user: IUser,
   project: IProject
}