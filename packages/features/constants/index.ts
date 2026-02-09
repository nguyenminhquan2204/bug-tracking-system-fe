import { z } from 'zod';
import { Regex } from '@/packages/utils/constants';

// API Base paths
export const AUTH_ENDPOINTS = {
  ADMIN: '/auth/admin',
  USER: '/auth/user',
  COMMON: '/auth',
} as const;

// Login constants
export const LOGIN_ERROR_MESSAGES = {
  DEFAULT: 'Invalid email or password. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
} as const;

/* =======================
   Login Form
======================= */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(Regex.EMAIL, 'Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LOGIN_FORM_DEFAULT_VALUES: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

/* =======================
   Forgot Password Form
======================= */
export const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(Regex.EMAIL, 'Enter a valid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export const FORGOT_PASSWORD_FORM_DEFAULT_VALUES: ForgotPasswordFormValues = {
  email: '',
};

export const FORGOT_PASSWORD_ERROR_MESSAGES = {
  DEFAULT: 'Unable to send password reset email. Please try again.',
} as const;

/* =======================
   Set Password Form
======================= */
export const setPasswordFormSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must include a lowercase letter')
      .regex(/[A-Z]/, 'Password must include an uppercase letter')
      .regex(/[0-9]/, 'Password must include a number'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export type SetPasswordFormValues = z.infer<typeof setPasswordFormSchema>;

export const SET_PASSWORD_FORM_DEFAULT_VALUES: SetPasswordFormValues = {
  token: '',
  newPassword: '',
  confirmPassword: '',
};

export const SET_PASSWORD_ERROR_MESSAGES = {
  DEFAULT: 'Unable to set password. Please try again.',
  INVALID_TOKEN: 'Invalid or expired token. Please request a new password reset link.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
} as const;
