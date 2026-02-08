/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse, IGetListResponse } from '@/packages/utils/interfaces';
import { IRole, IUser, IUserGetListQuery } from '../inferface';
import { USER_API_BASE_PATH } from '../constants';

class ManageUserService extends ApiService {
  getUserList(
    query: IUserGetListQuery,
  ): Promise<IBodyResponse<IGetListResponse<IUser>>> {
    return this._getList<IUser>(query);
  }

  getRoleList(): Promise<IBodyResponse<IGetListResponse<IRole>>> {
    return this.client.get(`/role?page=${1}&limit=${1000}`);
  }

  postCreateUser(payload: any): Promise<IBodyResponse<IUser>> {
    return this.client.post(`${this.baseUrl}`, payload);
  }

  patchUpdateUser(id: number, payload: any): Promise<IBodyResponse<any>> {
    return this.client.patch(`${this.baseUrl}/${id}`, payload);
  }

  deleteUser(id: number): Promise<IBodyResponse<any>> {
    return this.client.delete(`${this.baseUrl}/${id}`);
  }
}

export const manageUserService = new ManageUserService(
  { baseUrl: USER_API_BASE_PATH },
  axiosService,
);
