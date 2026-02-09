/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosService from '@/packages/plugins/axios';
import { ApiService } from '@/packages/plugins/axios/api';
import { IBodyResponse } from '@/packages/utils/interfaces';
import type {
  LoginPayload,
  LoginSuccessData,
  ForgotPasswordPayload,
  ForgotPasswordSuccessData,
  SetPasswordPayload,
  SetPasswordSuccessData,
  ValidateTokenPayload,
  ValidateTokenSuccessData,
  ChangePasswordPayload,
  ChangePasswordSuccessData,
} from '../types';

/**
 * Auth service that handles authentication operations
 * Can be configured with different base paths for admin/user endpoints
 */
export class AuthService extends ApiService {
  login(payload: LoginPayload): Promise<IBodyResponse<LoginSuccessData>> {
    const requestBody = this.beforeCreate(payload);
    return this.client.post(`${this.baseUrl}/login`, requestBody);
  }

  forgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<IBodyResponse<ForgotPasswordSuccessData>> {
    const requestBody = this.beforeCreate(payload);
    return this.client.post(`${this.baseUrl}/forgot-password`, requestBody);
  }

  setPassword(
    payload: SetPasswordPayload,
  ): Promise<IBodyResponse<SetPasswordSuccessData>> {
    const requestBody = this.beforeCreate(payload);
    return this.client.post(`${this.baseUrl}/set-password`, requestBody);
  }

  validateToken(
    payload: ValidateTokenPayload,
  ): Promise<IBodyResponse<ValidateTokenSuccessData>> {
    const requestBody = this.beforeCreate(payload);
    return this.client.post(`${this.baseUrl}/validate-token`, requestBody);
  }

  logout(refreshToken: string): Promise<IBodyResponse<void>> {
    return this.client.post(`${this.baseUrl}/logout`, { refreshToken });
  }

  changePassword(
    payload: ChangePasswordPayload,
  ): Promise<IBodyResponse<ChangePasswordSuccessData>> {
    const requestBody = this.beforeCreate(payload);
    return this.client.put(`${this.baseUrl}/change-password`, requestBody);
  }

  getInformation(): Promise<IBodyResponse<any>> {
    return this.client.get(`/users/me`);
  }
}

export const authService = new AuthService(
  { baseUrl: '/auth' },
  axiosService,
);
