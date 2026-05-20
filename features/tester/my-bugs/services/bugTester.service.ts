/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from "@/packages/plugins/axios";
import { ApiService } from "@/packages/plugins/axios/api";
import { IBodyResponse } from "@/packages/utils";

class BugTesterService extends ApiService { 
   getMyBugsForTester(): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/my/tester`);
   }
}

export const bugTesterService = new BugTesterService(
  { baseUrl: 'bug' },
  axiosService,
);
