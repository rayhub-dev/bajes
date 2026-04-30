"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, X } from "lucide-react";
import { useState } from "react";

function PushBanner(): React.ReactElement | null {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleEnable = (): void => {
    // TODO: Request notification permission + subscribe to push
    console.log("Request push permission");
    setDismissed(true);
  };

  return (
    <Card variant="yellow" className="relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 p-1 transition-opacity hover:opacity-70"
      >
        <X size={16} strokeWidth={3} />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-bajes-black bg-white shadow-brutal-sm">
          <Bell size={20} strokeWidth={3} />
        </div>
        <div className="flex-1">
          <p className="font-display text-sm font-bold uppercase">Aktifkan Notifikasi 🔔</p>
          <p className="mb-3 mt-0.5 text-xs text-bajes-black/70">
            Biar lo tau kalo bajes udah mau limit. Gak bakal spam, janji!
          </p>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleEnable}
              className="!bg-bajes-black !text-white"
            >
              Aktifkan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="!border-transparent"
            >
              Nanti aja
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export { PushBanner };
