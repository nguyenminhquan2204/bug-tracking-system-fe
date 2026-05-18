import { IUser } from "@/packages/interfaces";
import { ICommonListQuery } from "@/packages/utils";

export interface IProjectGetListQuery extends ICommonListQuery {
  name?: string;
}

export interface IExpense {
  id: number;
  name: string;
  amount: number;
  description: string;
  paymentDate: string;
  currency: string;
  buyer: IUser;
  manager: IUser;
  status: string;
  category: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  receiptUrl?: string;
  buyerId?: number;
  managerId?: number;
}

export interface IExpenseGetListQuery extends ICommonListQuery {}
