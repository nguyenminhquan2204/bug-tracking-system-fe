/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from "@/packages/plugins/axios";
import { ApiService } from "@/packages/plugins/axios/api";
import { IBodyResponse, IGetListResponse } from "@/packages/utils/interfaces";
import { IExpense, IExpenseGetListQuery } from "../interface";
import { EXPENSE_API_BASE_PATH } from "../constants";
import { CreateExpenseType } from "../schema";

class ManageExpenseService extends ApiService {
  getExpenseList(
    projectId: number,
    query: IExpenseGetListQuery,
  ): Promise<IBodyResponse<IGetListResponse<IExpense>>> {
    return this.client.get(`${this.baseUrl}/project/${projectId}`, {
      params: query,
    });
  }

  getExpenseSummary(projectId: number): Promise<any> {
    return this.client.get(`${this.baseUrl}/project/${projectId}/summary`);
  }

  postCreateExpense(payload: CreateExpenseType): Promise<IBodyResponse<any>> {
    return this.client.post(`${this.baseUrl}`, payload);
  }

  updateExpense(id: number, payload: any): Promise<IBodyResponse<any>> {
    return this.client.patch(`${this.baseUrl}/${id}`, payload);
  }

  deleteExpense(id: number): Promise<IBodyResponse<any>> {
    return this.client.delete(`${this.baseUrl}/${id}`);
  }
}

export const manageExpenseService = new ManageExpenseService(
  { baseUrl: EXPENSE_API_BASE_PATH },
  axiosService,
);
