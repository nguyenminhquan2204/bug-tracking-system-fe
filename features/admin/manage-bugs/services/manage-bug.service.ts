/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from "@/packages/plugins/axios";
import { ApiService } from "@/packages/plugins/axios/api";
import { IBodyResponse } from "@/packages/utils";
import { MANAGE_BUG_API_BASE_PATH } from "../constants";

class ManageBugSerive extends ApiService { 
   getSummaryBugHeader(projectId: number, query: any): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/dashboard/${projectId}/header`, { params: query });
   }

   getSummaryBugBody(projectId: number, query: any): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/dashboard/${projectId}/body`, { params: query });
   }
}

export const manageBugSerive = new ManageBugSerive(
  { baseUrl: MANAGE_BUG_API_BASE_PATH },
  axiosService,
);
