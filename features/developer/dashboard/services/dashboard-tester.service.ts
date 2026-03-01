/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils/interfaces';
import { DASHBOARD_TESTER_API_BASE_PATH } from '../constants';

class DashboardService extends ApiService {
   getDashboard(projectId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/dashboard/tester/${projectId}`);
   }
}

export const dashboardTesterService = new DashboardService(
  { baseUrl: DASHBOARD_TESTER_API_BASE_PATH },
  axiosService,
);
