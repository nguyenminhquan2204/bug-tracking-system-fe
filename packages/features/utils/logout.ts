import Cookies from 'js-cookie';
import { COOKIES_KEY } from '@/packages/plugins/axios';
import { storage } from '@/packages/utils/storage';

/**
 * Clears all authentication tokens from storage
 * Removes tokens from cookies, localStorage, and sessionStorage
 */
export function clearAuthTokens(): void {
  // Clear cookies
  Cookies.remove(COOKIES_KEY.ACCESS_TOKEN);
  Cookies.remove(COOKIES_KEY.REFRESH_TOKEN);

  // Clear localStorage
  storage.removeItem(COOKIES_KEY.ACCESS_TOKEN);

  // Clear sessionStorage
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(COOKIES_KEY.ACCESS_TOKEN);
    sessionStorage.removeItem(COOKIES_KEY.REFRESH_TOKEN);
  }
}
