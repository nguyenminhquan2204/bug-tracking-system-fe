/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils/interfaces';
import { DASHBOARD_API_BASE_PATH } from '../constants';

class DashboardService extends ApiService {
   getAllProject(): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/all`)
   }

   getDashboard(projectId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/dashboard/${projectId}`);
   }
}

export const dashboardService = new DashboardService(
  { baseUrl: DASHBOARD_API_BASE_PATH },
  axiosService,
);
