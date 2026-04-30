"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

interface MonthNavigatorProps {
  year: number;
  month: number; // 1-12
  onChange: (year: number, month: number) => void;
  disableFuture?: boolean;
}

function MonthNavigator({
  year,
  month,
  onChange,
  disableFuture = true,
}: MonthNavigatorProps): React.ReactElement {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const isFuture = year > currentYear || (year === currentYear && month >= currentMonth);

  const handlePrev = (): void => {
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  };

  const handleNext = (): void => {
    if (disableFuture && isFuture) return;
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={handlePrev}
        className="rounded-lg border-2 border-bajes-black bg-white p-2 shadow-brutal-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-gray-50"
      >
        <ChevronLeft size={18} strokeWidth={3} />
      </button>

      <h2 className="font-display text-base font-bold uppercase tracking-wide">
        {MONTH_NAMES[month - 1]} {year}
      </h2>

      <button
        onClick={handleNext}
        disabled={disableFuture && isFuture}
        className="rounded-lg border-2 border-bajes-black bg-white p-2 shadow-brutal-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm"
      >
        <ChevronRight size={18} strokeWidth={3} />
      </button>
    </div>
  );
}

export { MonthNavigator };
