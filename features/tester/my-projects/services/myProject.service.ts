/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse, IGetListResponse } from '@/packages/utils/interfaces';
import { PROJECT_PUBLIC_API_BASE_PATH } from '../constants';

class MyProjectService extends ApiService {
   getMyProject(): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}`);
   }

   postCreateBug(payload: any): Promise<IBodyResponse<any>> {
      return this.client.post(`/bug`, payload)
   }

   getBugs(): Promise<IBodyResponse<any>> {
      return this.client.get('/bug/all');
   }

   patchUpdateBugStatus(bugId: number, newStatus: string) {
      return this.client.patch(`/bug/${bugId}/status`, {
         status: newStatus.toUpperCase()
      })
   }
}

export const myProjectService = new MyProjectService(
  { baseUrl: PROJECT_PUBLIC_API_BASE_PATH },
  axiosService,
);
