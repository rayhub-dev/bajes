"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api/client";
import type { UserDTO } from "@bajes/types";
import type { ApiSuccessResponse } from "@bajes/types";

const setAuthenticatedCookie = (): void => {
  document.cookie = "bajes-authenticated=true; Path=/; SameSite=Lax";
};

const clearAuthenticatedCookie = (): void => {
  document.cookie = "bajes-authenticated=; Path=/; Max-Age=0; SameSite=Lax";
};

const clearGuestModeCookie = (): void => {
  document.cookie = "bajes-guest-mode=; Path=/; Max-Age=0; SameSite=Lax";
};

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { setAuth, setIsInitializing, resetAuth } = useAuthStore();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const response = await apiClient.get<ApiSuccessResponse<UserDTO>>("/v1/auth/me", {
            headers: { Authorization: `Bearer ${session.access_token}` },
            timeout: 5000,
          });
          clearGuestModeCookie();
          setAuthenticatedCookie();
          setAuth(response.data.data, {
            id: session.user.id,
            userAgent: null,
            ipAddress: null,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(session.expires_at! * 1000).toISOString(),
          });
        }
      } catch {
        clearAuthenticatedCookie();
        resetAuth();
      } finally {
        setIsInitializing(false);
      }
    };

    void initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const response = await apiClient.get<ApiSuccessResponse<UserDTO>>("/v1/auth/me", {
            headers: { Authorization: `Bearer ${session.access_token}` },
            timeout: 5000,
          });
          clearGuestModeCookie();
          setAuthenticatedCookie();
          setAuth(response.data.data, {
            id: session.user.id,
            userAgent: null,
            ipAddress: null,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(session.expires_at! * 1000).toISOString(),
          });
        } catch {
          clearAuthenticatedCookie();
          resetAuth();
        }
      } else if (event === "SIGNED_OUT") {
        clearAuthenticatedCookie();
        resetAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, setIsInitializing, resetAuth]);

  return <>{children}</>;
}
