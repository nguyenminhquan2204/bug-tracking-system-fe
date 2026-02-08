import Cookies from 'js-cookie';

export enum COOKIES_KEY {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
  USER_PROFILE = 'userProfile',
}

function getSecureOption(): boolean {
  return typeof window !== 'undefined'
    ? window.location.protocol === 'https:'
    : process.env.NODE_ENV === 'production';
}

export function setCredentials(credentials: {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}) {
  const { accessToken, refreshToken, expiresIn = 7 } = credentials;

  Cookies.set(COOKIES_KEY.ACCESS_TOKEN, accessToken, {
    secure: getSecureOption(),
    sameSite: 'lax',
    expires: expiresIn,
    path: '/',
  });

  Cookies.set(COOKIES_KEY.REFRESH_TOKEN, refreshToken, {
    secure: getSecureOption(),
    sameSite: 'lax',
    expires: expiresIn,
    path: '/',
  });
}

export function getCredential() {
  const accessToken = Cookies.get(COOKIES_KEY.ACCESS_TOKEN);
  const refreshToken = Cookies.get(COOKIES_KEY.REFRESH_TOKEN);
  return {
    accessToken,
    refreshToken,
  };
}

export function removeCredentials() {
  Cookies.remove(COOKIES_KEY.ACCESS_TOKEN);
  Cookies.remove(COOKIES_KEY.REFRESH_TOKEN);
}

export function removeAllCookies() {
  Object.values(COOKIES_KEY).forEach((key) => {
    Cookies.remove(key);
  });
}

export function setUserProfile(profile: any) {
  Cookies.set(COOKIES_KEY.USER_PROFILE, JSON.stringify(profile), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: 7,
    path: '/',
  });
}

export function getUserProfile() {
  try {
    const profile = Cookies.get(COOKIES_KEY.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch {
    return null;
  }
}
