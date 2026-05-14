/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils';

class NotificationService extends ApiService {
   readNotification(id: number): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/read/${id}`);
   }

   getMyNotifications(): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}`);
   }

   
} 

export const notificationService = new NotificationService(
  { baseUrl: '/notification' },
  axiosService,
);
