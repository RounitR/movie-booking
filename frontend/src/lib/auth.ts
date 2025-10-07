export type Tokens = { access: string; refresh: string };

const ACCESS_KEY = "mb_access_token";
const REFRESH_KEY = "mb_refresh_token";

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
};

export const setTokens = ({ access, refresh }: Tokens) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, access);
  window.localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
};