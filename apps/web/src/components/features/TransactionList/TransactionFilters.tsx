"use client";

import { cn } from "@/lib/utils";

type FilterType = "ALL" | "INCOME" | "EXPENSE";

interface TransactionFiltersProps {
  activeType: FilterType;
  onTypeChange: (type: FilterType) => void;
}

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "EXPENSE", label: "Pengeluaran" },
  { value: "INCOME", label: "Pemasukan" },
];

function TransactionFilters({
  activeType,
  onTypeChange,
}: TransactionFiltersProps): React.ReactElement {
  return (
    <div className="flex gap-2">
      {filterOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onTypeChange(opt.value)}
          className={cn(
            "rounded-lg border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
            activeType === opt.value
              ? "border-bajes-black bg-bajes-black text-white shadow-none dark:border-white/20 dark:bg-white dark:text-bajes-black"
              : "border-gray-300 bg-white text-gray-500 hover:border-bajes-black dark:border-white/10 dark:bg-bajes-surface-dark dark:text-gray-400 dark:hover:border-white/30",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export { TransactionFilters, type FilterType };
