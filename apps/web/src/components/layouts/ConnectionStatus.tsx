"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

function ConnectionStatus(): React.ReactElement | null {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = (): void => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = (): void => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 animate-slide-up lg:left-64">
      {!isOnline && (
        <div className="border-b-3 flex items-center justify-center gap-2 border-bajes-black bg-bajes-yellow px-4 py-2 dark:border-white/20">
          <WifiOff size={16} strokeWidth={3} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Mode offline — data akan disinkronkan
          </span>
        </div>
      )}
      {showReconnected && (
        <div className="border-b-3 flex items-center justify-center gap-2 border-bajes-black bg-bajes-green px-4 py-2 dark:border-white/20">
          <Wifi size={16} strokeWidth={3} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Kembali online — menyinkronkan data...
          </span>
        </div>
      )}
    </div>
  );
}

export { ConnectionStatus };
