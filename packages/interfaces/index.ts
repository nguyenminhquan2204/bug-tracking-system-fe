/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUser {
   id: number,
   isActive: boolean,
   userName: string,
   email: string,
   roleId: number,
   role: IRole,
   imageId: number | null,
   avatar: any,
   createdAt: string,
   updatedAt: string,
   deletedAt: null,
   createdBy: number | null,
   updatedBy: number | null,
   deletedBy: number | null,
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
