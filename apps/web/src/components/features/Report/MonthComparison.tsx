"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MonthComparisonProps {
  currentExpenseCents: number;
  previousExpenseCents: number;
}

function MonthComparison({
  currentExpenseCents,
  previousExpenseCents,
}: MonthComparisonProps): React.ReactElement {
  const diff = currentExpenseCents - previousExpenseCents;
  const percentChange =
    previousExpenseCents > 0 ? Math.round((diff / previousExpenseCents) * 100) : 0;
  const isIncrease = diff > 0;

  return (
    <Card variant={isIncrease ? "red" : "green"} className={isIncrease ? "!text-white" : ""}>
      <p
        className={cn(
          "mb-2 text-xs font-bold uppercase tracking-wider",
          isIncrease ? "text-white/70" : "text-bajes-black/60",
        )}
      >
        vs Bulan Lalu
      </p>

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border-2 border-bajes-black",
            isIncrease ? "bg-white/20" : "bg-bajes-black/10",
          )}
        >
          {isIncrease ? (
            <TrendingUp size={20} strokeWidth={3} />
          ) : (
            <TrendingDown size={20} strokeWidth={3} />
          )}
        </div>

        <div>
          <p className="font-display text-lg font-bold">{formatCurrency(currentExpenseCents)}</p>
          <p
            className={cn(
              "text-xs font-bold",
              isIncrease ? "text-white/80" : "text-bajes-black/60",
            )}
          >
            {isIncrease ? "+" : ""}
            {percentChange}% dari bulan lalu
            {isIncrease ? " 📈 Ngerem woy!" : " 📉 Gokil, hemat!"}
          </p>
        </div>
      </div>
    </Card>
  );
}

export { MonthComparison };
