"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WifiOff } from "lucide-react";

export default function OfflinePage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bajes-bg px-6">
      <Card className="w-full max-w-sm text-center">
        <div className="mb-4 flex justify-center">
          <div className="border-3 flex h-16 w-16 items-center justify-center rounded-2xl border-bajes-black bg-bajes-yellow shadow-brutal">
            <WifiOff size={32} strokeWidth={3} />
          </div>
        </div>

        <h1 className="mb-2 font-display text-xl font-bold uppercase">Gak Ada Internet 😵</h1>
        <p className="mb-6 text-sm text-gray-500">
          Tenang, lo masih bisa pake beberapa fitur offline:
        </p>

        <div className="mb-6 space-y-2 text-left">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-bajes-green">✓</span>
            <span>Tambah transaksi (sync nanti)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-bajes-green">✓</span>
            <span>Lihat transaksi bulan ini (dari cache)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-bajes-green">✓</span>
            <span>Lihat dashboard (dari cache)</span>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={() => window.location.reload()}>
          Coba Lagi 🔄
        </Button>
      </Card>
    </div>
  );
}
