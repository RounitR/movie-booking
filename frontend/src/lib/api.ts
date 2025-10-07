import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/lib/auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8010";

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const newAccess = data?.access;
    if (!newAccess) return null;
    // Persist new access while keeping existing refresh
    setTokens({ access: newAccess, refresh });
    return newAccess;
  } catch {
    return null;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const token = getAccessToken();

  const makeHeaders = (access?: string) => ({
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...(init.headers || {}),
  });

  const doFetch = async (access?: string) =>
    fetch(url, {
      ...init,
      headers: makeHeaders(access),
      cache: "no-store",
    });

  let res = await doFetch(token || undefined);
  if (res.status === 401) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      res = await doFetch(newAccess);
    } else {
      // Clear tokens when refresh fails
      clearTokens();
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}