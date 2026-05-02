"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/currency";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardProps {
  totalIncomeCents: number;
  totalExpenseCents: number;
}

function SummaryCard({
  totalIncomeCents,
  totalExpenseCents,
}: SummaryCardProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Income */}
      <Card className="!p-4">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-bajes-black bg-bajes-green/30 dark:border-white/20">
            <TrendingUp size={14} strokeWidth={3} className="text-green-700 dark:text-green-400" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Masuk
          </span>
        </div>
        <p className="font-display text-lg font-bold text-green-600 dark:text-green-400">
          {formatCurrency(totalIncomeCents)}
        </p>
      </Card>

      {/* Expense */}
      <Card className="!p-4">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-bajes-black bg-bajes-red/20 dark:border-white/20">
            <TrendingDown size={14} strokeWidth={3} className="text-bajes-red" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Keluar
          </span>
        </div>
        <p className="font-display text-lg font-bold text-bajes-red">
          {formatCurrency(totalExpenseCents)}
        </p>
      </Card>
    </div>
  );
}

export { SummaryCard };
