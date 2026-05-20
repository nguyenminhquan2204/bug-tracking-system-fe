/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from "@/packages/plugins/axios";
import { ApiService } from "@/packages/plugins/axios/api";
import { IBodyResponse } from "@/packages/utils";

class BugDevService extends ApiService { 
   getMyBugsForDev(): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/my/dev`);
   }
}

export const bugDevService = new BugDevService(
  { baseUrl: 'bug' },
  axiosService,
);
