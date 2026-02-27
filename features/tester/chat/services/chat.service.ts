/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils';

class ChatService extends ApiService {
   getUsersChat(): Promise<IBodyResponse<any>> {
      return this.client.get(`/project-public/chat/users`);
   }

   postConversation(toUserId: number): Promise<IBodyResponse<any>> {
      return this.client.post(`/project-public/chat/conversation`, { toUserId});
   }

   getMessages(converId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`/project-public/message/${converId}`);
   }
} 

export const chatService = new ChatService(
  { baseUrl: '/chat' },
  axiosService,
);
