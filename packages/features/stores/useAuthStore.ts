/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import Cookies from 'js-cookie';
import { COOKIES_KEY } from '@/packages/plugins/axios';
import { IBodyResponse } from '@/packages/utils/interfaces';
import { LOGIN_ERROR_MESSAGES } from '../constants';
import type { LoginPayload, LoginSuccessData } from '../types';
import { authService } from '../services/auth.service';
import { clearAuthTokens } from '../utils/logout';

interface States {
  loading: boolean,
  error: string | null
}

interface Actions {
  setLoading: (loading: boolean) => void,
  setError: (message: string | null) => void,

  login: (payload: LoginPayload) => void,
  logout: () => Promise<IBodyResponse<void>>;

  resetState: () => void
}

const intialState: States = {
  loading: false,
  error: null
}

export const useAuthStore = create<States & Actions>((set, get) => ({
  ...intialState,

  setLoading: (loading: boolean) => set({ loading }),

  setError: (message) => set({ error: message }),

  login: async (payload) => {
    set({ loading: true, error: null });

    try {
      const response = await authService.login(payload);
      if (!response?.success) {
        set({
          loading: false,
          error: response?.message || LOGIN_ERROR_MESSAGES.DEFAULT,
        });
      } else {
        const tokens = response.data as unknown as LoginSuccessData;
        if (tokens?.accessToken) {
          Cookies.set(COOKIES_KEY.ACCESS_TOKEN, tokens.accessToken);
        }
        if (tokens?.refreshToken) {
          Cookies.set(COOKIES_KEY.REFRESH_TOKEN, tokens.refreshToken);
        }
        set({ loading: false, error: null });
      }

      return response;
    } catch (error) {
      set({
        loading: false,
        error: LOGIN_ERROR_MESSAGES.DEFAULT,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });

    try {
      // Call logout endpoint (clears refresh token cookie on backend)
      const refreshToken = Cookies.get(COOKIES_KEY.REFRESH_TOKEN);
      if(!refreshToken) {
        return {
          success: false,
          message: 'Log out failed',
          data: undefined,
        } as IBodyResponse<void>;
      }
      const response = await authService.logout(refreshToken);

      // Clear all tokens from frontend storage regardless of response
      clearAuthTokens();

      set({ loading: false, error: null });

      return response;
    } catch (error: any) {
      // Even if logout fails, clear tokens on frontend
      clearAuthTokens();

      set({
        loading: false,
        error: error?.message || 'Logout failed',
      });

      // Still return success to allow navigation
      return {
        success: true,
        message: 'Logged out',
        data: undefined,
      } as IBodyResponse<void>;
    }
  },

  resetState: () => set({ ...intialState }),
}))
