/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils/interfaces';
import { PROJECT_PUBLIC_API_BASE_PATH } from '../constants';

class MyProjectService extends ApiService {
   getMyProject(): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}`);
   }

   postCreateBug(payload: any): Promise<IBodyResponse<any>> {
      return this.client.post(`/bug`, payload)
   }

   getBugs(projectId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`/bug/all/${projectId}`);
   }

   getBugDetailById(bugId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`/bug/${bugId}`)
   }

   getDevelopersInProject(projectId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`/project-public/developers/${projectId}`);
   }

   getProjectById(projectId: number): Promise<IBodyResponse<any>> {
      return this.client.get(`${this.baseUrl}/${projectId}`);
   }
     
   patchUpdateBugStatus(bugId: number, newStatus: string) {
      return this.client.patch(`/bug/${bugId}/status`, {
         status: newStatus.toUpperCase()
      })
   }

   patchEditBug(bugId: number, payload: any): Promise<IBodyResponse<any>> {
      return this.client.patch(`/bug/${bugId}`, payload);
   }

   uploadFile(file: File): Promise<IBodyResponse<any>> {
      const formData = new FormData();
      formData.append('file', file);

      return this.client.post('/file/images/upload', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
   }

   postComment(bugId: number, data: any): Promise<IBodyResponse<any>> {
      return this.client.post(`/bug/${bugId}`, data, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
   }
} 

export const myProjectService = new MyProjectService(
  { baseUrl: PROJECT_PUBLIC_API_BASE_PATH },
  axiosService,
);
