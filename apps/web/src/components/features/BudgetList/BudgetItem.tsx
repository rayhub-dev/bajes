"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface BudgetItemProps {
  categoryIcon: string;
  categoryName: string;
  categoryColor: string;
  budgetCents: number;
  spentCents: number;
  onTap?: () => void;
}

function BudgetItem({
  categoryIcon,
  categoryName,
  categoryColor,
  budgetCents,
  spentCents,
  onTap,
}: BudgetItemProps): React.ReactElement {
  const percentage = budgetCents > 0 ? (spentCents / budgetCents) * 100 : 0;
  const remainingCents = budgetCents - spentCents;
  const isOver = remainingCents < 0;

  if (budgetCents === 0) {
    return (
      <button onClick={onTap} className="group flex w-full items-center gap-3 px-1 py-3 text-left">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-gray-300 text-xl opacity-50"
          style={{ backgroundColor: categoryColor + "20" }}
        >
          {categoryIcon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-400">{categoryName}</p>
          <p className="text-xs text-gray-400">Tap untuk set bajes</p>
        </div>
      </button>
    );
  }

  return (
    <button onClick={onTap} className="group w-full px-1 py-3 text-left">
      <div className="mb-2 flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-bajes-black text-xl shadow-brutal-sm"
          style={{ backgroundColor: categoryColor + "30" }}
        >
          {categoryIcon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{categoryName}</p>
          <p className="text-xs text-gray-500">
            {formatCurrency(spentCents)} / {formatCurrency(budgetCents)}
          </p>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "font-display text-sm font-bold",
              isOver ? "text-bajes-red" : "text-bajes-black",
            )}
          >
            {isOver
              ? `-${formatCurrency(Math.abs(remainingCents))}`
              : formatCurrency(remainingCents)}
          </p>
          <p
            className={cn(
              "text-[10px] font-bold uppercase",
              isOver ? "text-bajes-red" : "text-gray-500",
            )}
          >
            {isOver ? "Over budget!" : "tersisa"}
          </p>
        </div>
      </div>
      <ProgressBar percentage={percentage} showLabel size="md" />
    </button>
  );
}

export { BudgetItem };
