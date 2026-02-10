/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
/**
 * Auth service that handles authentication operations
 * Can be configured with different base paths for admin/user endpoints
 */
export class ProfileService extends ApiService {
   getProfile() {
      return this.client.get(`${this.baseUrl}`);
   }
}

export const profileService = new ProfileService(
  { baseUrl: '/profile' },
  axiosService,
);
