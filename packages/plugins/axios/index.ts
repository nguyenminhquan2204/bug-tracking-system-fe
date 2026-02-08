/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dayjs from '../../plugins/dayjs';
import { HttpStatus, isJson, SupportLanguage, PageRouter } from '../../utils';
import { IBodyResponse } from '../../utils/interfaces';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
// import { clearAuthTokens } from '@/features/auth/utils/logout';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export enum HeaderKey {
  ACCEPT_LANGUAGE = 'Accept-Language',
  CONTENT_TYPE = 'Content-Type',
  TIME_ZONE = 'X-Timezone',
  TIME_ZONE_NAME = 'X-Timezone-Name',
  AUTHORIZATION = 'Authorization',
}

export enum COOKIES_KEY {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

export const options: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  } as unknown as AxiosRequestHeaders,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  responseType: 'json',
};

const axiosInstance = axios.create(options);

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get(COOKIES_KEY.ACCESS_TOKEN);

  Object.assign(config, {
    headers: {
      [HeaderKey.TIME_ZONE]: dayjs().format('Z'),
      [HeaderKey.TIME_ZONE_NAME]: dayjs.tz.guess(),
      [HeaderKey.ACCEPT_LANGUAGE]: SupportLanguage.EN,
      [HeaderKey.CONTENT_TYPE]: 'application/json',
      [HeaderKey.AUTHORIZATION]: accessToken ? `Bearer ${accessToken}` : '',
      ...config.headers,
    },
  });
  return config;
});

const handleNetworkError = (error: any) => ({
  ...(error?.request?.data || {}),
  success: false,
  isRequestError: true,
  message: 'Network error, please try again later',
  code: HttpStatus.SERVICE_UNAVAILABLE,
});

const handleResponseError = (error: any) => {
  if (error.response.status === HttpStatus.UNAUTHORIZED) {
    // Handle unauthorized - could dispatch event here
    console.log('Unauthorized access');
  }
  console.log('handleResponseError', error);

  const parsedData =
    typeof error?.response?.data === 'string'
      ? JSON.parse(error.response.data)
      : error?.response?.data;

  console.log('ParsedData', parsedData);

  return {
    code: error?.response?.status,
    ...(parsedData || {}),
    success: false,
  };
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('Axios response', response);
    if (response.config.responseType === 'blob') {
      return response; 
    }

    if (typeof response?.data === 'string') {
      response.data = isJson(response.data) ? JSON.parse(response.data) : null;
    }
    // response.data.success = true;
    return response.data;
  },
  async (error) => {
    const originalRequest: any = error.config;

    // Check if error is 401 Unauthorized and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log(
        '[Axios Interceptor] 401 Unauthorized detected, attempting token refresh',
      );
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers[HeaderKey.AUTHORIZATION] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      isRefreshing = true;

      const refreshToken = Cookies.get(COOKIES_KEY.REFRESH_TOKEN);
      if (!refreshToken) {
        console.log('[Axios Interceptor] No refresh token found, clearing auth tokens');
        isRefreshing = false;
        // clearAuthTokens();
        // Redirect to login if in browser environment
        if (typeof window !== 'undefined') {
          window.location.href = PageRouter.LOGIN;
        }
        return Promise.reject(error);
      }

      try {
        // Construct refresh URL - use axiosInstance baseURL to ensure correct path
        const baseURL =
          axiosInstance.defaults.baseURL || process.env.NEXT_PUBLIC_API_URL || '';
        // Check if baseURL already includes /api/v1, if not add it
        const refreshUrl = baseURL.includes('/api/v1')
          ? `${baseURL}/auth/refresh`
          : `${baseURL}/api/v1/auth/refresh`;

        console.log('[Axios Interceptor] Calling refresh token endpoint:', refreshUrl);
        const response = await axios.post(
          refreshUrl,
          {},
          {
            headers: {
              [HeaderKey.AUTHORIZATION]: `Bearer ${refreshToken}`,
            },
          },
        );

        // Raw axios response structure: response.data = { success: true, data: { accessToken: "...", refreshToken: "..." } }
        const responseData = response.data?.data || response.data;
        const newAccessToken = responseData?.accessToken;
        const newRefreshToken = responseData?.refreshToken;

        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }

        // Update access token
        Cookies.set(COOKIES_KEY.ACCESS_TOKEN, newAccessToken);
        console.log('[Axios Interceptor] Access token refreshed successfully');

        // Update refresh token if a new one is provided (token rotation)
        if (newRefreshToken) {
          Cookies.set(COOKIES_KEY.REFRESH_TOKEN, newRefreshToken);
          console.log('[Axios Interceptor] Refresh token rotated');
        }

        // Update the original request headers properly
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers[HeaderKey.AUTHORIZATION] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        console.log('[Axios Interceptor] Retrying original request with new token');
        return axiosInstance(originalRequest);
      } catch (err: any) {
        console.error(
          '[Axios Interceptor] Refresh token failed:',
          err?.response?.status || err?.message,
        );
        // If refresh token is invalid/expired, clear all tokens and redirect to login
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          console.log(
            '[Axios Interceptor] Refresh token invalid/expired, clearing auth tokens and redirecting to login',
          );
          // clearAuthTokens();
          // Redirect to login if in browser environment
          if (typeof window !== 'undefined') {
            window.location.href = PageRouter.LOGIN;
          }
        }
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response?.status === 401) {
      // 401 but already retried or no refresh token - log for debugging
      console.log('[Axios Interceptor] 401 error but not refreshing:', {
        hasRetry: originalRequest._retry,
        hasRefreshToken: !!Cookies.get(COOKIES_KEY.REFRESH_TOKEN),
      });
    }

    if (error.code === 'ERR_NETWORK') {
      return handleNetworkError(error);
    }
    if (error.response) {
      return handleResponseError(error) as IBodyResponse<unknown>;
    }
    return {
      success: false,
      message: 'System error, please try again later',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  },
);

export default axiosInstance;
