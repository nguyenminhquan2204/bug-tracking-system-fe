/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils';

class ChatAdminService extends ApiService {
   getUsersChatAdmin(): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/chat-admin`);
   }

   postConversation(toUserId: number): Promise<IBodyResponse<any>> {
      return this.client.post(`/project-public/chat/conversation`, { toUserId});
   }

   getMessages(converId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`/project-public/message/${converId}`);
   }
} 

export const chatAdminService = new ChatAdminService(
  { baseUrl: '/user' },
  axiosService,
);
