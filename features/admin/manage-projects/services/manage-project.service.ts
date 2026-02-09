/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse, IGetListResponse } from '@/packages/utils/interfaces';
import { PROJECT_API_BASE_PATH } from '../constants';
import { IProject, IProjectGetListQuery } from '../interface';

class ManageProjectService extends ApiService {
  getProjectList(
    query: IProjectGetListQuery,
  ): Promise<IBodyResponse<IGetListResponse<IProject>>> {
    return this._getList<IProject>(query);
  }

  postCreateProject(payload: any): Promise<IBodyResponse<IProject>> {
    return this.client.post(`${this.baseUrl}`, payload);
  }

  patchUpdateProject(id: number, payload: any): Promise<IBodyResponse<any>> {
    return this.client.patch(`${this.baseUrl}/${id}`, payload);
  }

  deleteProject(id: number): Promise<IBodyResponse<any>> {
    return this.client.delete(`${this.baseUrl}/${id}`);
  }
}

export const manageProjectService = new ManageProjectService(
  { baseUrl: PROJECT_API_BASE_PATH },
  axiosService,
);
