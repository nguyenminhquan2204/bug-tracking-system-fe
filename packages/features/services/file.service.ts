/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils';
/**
 * Auth service that handles authentication operations
 * Can be configured with different base paths for admin/user endpoints
 */
export class FileService extends ApiService {
   getFilesByConversationId(conversationId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`/project-public/files/${conversationId}`);
   }

   uploadFile(file: File, conversationId: number): Promise<IBodyResponse<any>> {
      const formData = new FormData();
      formData.append('file', file);
      return this.client.post(`/project-public/upload-file/${conversationId}`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
   }
}

export const fileService = new FileService(
  { baseUrl: '/files' },
  axiosService,
);
