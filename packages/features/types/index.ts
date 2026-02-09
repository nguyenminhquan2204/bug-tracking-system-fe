export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginSuccessData {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  user?: {
    id: string | number;
    name?: string;
    email?: string;
  };
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordSuccessData {
  message?: string;
}

export interface SetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface SetPasswordSuccessData {
  success?: boolean;
  message?: string;
}

export interface ValidateTokenPayload {
  token: string;
}

export enum TokenValidationReason {
  VALID = 'valid',
  INVALID = 'invalid',
  EXPIRED = 'expired',
  INVALID_USER = 'invalid_user',
  ALREADY_USED = 'already_used',
}

export interface ValidateTokenSuccessData {
  valid: boolean;
  reason: TokenValidationReason;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordSuccessData {
  message?: string;
  user?: {
    id: number | string;
    email?: string;
    name?: string;
  };
}
