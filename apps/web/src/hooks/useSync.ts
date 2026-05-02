import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";
import { syncPendingTransactions, pullTransactionsFromServer } from "@/lib/sync";

export function useSync() {
  const { user, isAuthenticated } = useAuthStore();
  const isOnline = useUiStore((s) => s.isOnline);
  const isSyncing = useUiStore((s) => s.isSyncing);

  const sync = useCallback(async () => {
    // Read isSyncing from store directly to avoid stale closure
    const currentlySyncing = useUiStore.getState().isSyncing;
    if (!isAuthenticated || !user || !isOnline || currentlySyncing) return;

    await syncPendingTransactions();
    await pullTransactionsFromServer(user.id);
  }, [isAuthenticated, user, isOnline]);

  // Sync on mount and when coming back online
  useEffect(() => {
    if (isAuthenticated && isOnline) {
      void sync();
    }
  }, [isAuthenticated, isOnline, sync]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      useUiStore.getState().setOnlineStatus(true);
      void sync();
    };
    const handleOffline = () => {
      useUiStore.getState().setOnlineStatus(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [sync]);

  return { sync, isSyncing };
}
