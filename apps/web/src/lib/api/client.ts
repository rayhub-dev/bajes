import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const DEFAULT_API_BASE_URL = "http://localhost:4000";

export const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env["NEXT_PUBLIC_API_URL"];

  if (!apiBaseUrl || apiBaseUrl.trim().length === 0) {
    return DEFAULT_API_BASE_URL;
  }

  return apiBaseUrl;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

// Request interceptor: attach Supabase access token
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") return config;
  if (config.headers.Authorization) return config;

  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Session not available — proceed without auth header
  }

  return config;
});

// Response interceptor: auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: refreshError } = await supabase.auth.refreshSession();

        if (!refreshError && data.session) {
          originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed — reject
      }
    }

    return Promise.reject(error);
  },
);
