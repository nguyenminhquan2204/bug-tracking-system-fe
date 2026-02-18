/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils';
/**
 * Auth service that handles authentication operations
 * Can be configured with different base paths for admin/user endpoints
 */
export class ProfileService extends ApiService {
   getProfile() {
      return this.client.get(`${this.baseUrl}`);
   }

   changeAvatar(file: File): Promise<IBodyResponse<any>> {
      const formData = new FormData();
      formData.append('file', file);

      return this.client.post(`${this.baseUrl}/change-avatar`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
   }

   updateProfile(data: any): Promise<IBodyResponse<any>> {
      return this.client.patch(`${this.baseUrl}`, data);
   }
}

export const profileService = new ProfileService(
  { baseUrl: '/profile' },
  axiosService,
);
