"use client";

import { useState, useMemo } from "react";
import { MonthNavigator } from "@/components/layouts/MonthNavigator";
import { ReportSummary } from "@/components/features/Report/ReportSummary";
import { TopCategories } from "@/components/features/Report/TopCategories";
import { MonthComparison } from "@/components/features/Report/MonthComparison";
import { ExportButton } from "@/components/features/Report/ExportButton";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import type { TransactionDTO } from "@bajes/types";
import { useAuthStore } from "@/store/auth";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/Skeleton";

const DailyExpenseChart = dynamic(
  () =>
    import("@/components/features/Report/DailyExpenseChart").then((mod) => mod.DailyExpenseChart),
  { loading: () => <ChartSkeleton />, ssr: false },
);

function getMonthDateRange(year: number, month: number): { startDate: string; endDate: string } {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`;
  const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
  return { startDate, endDate };
}

function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

export default function ReportPage(): React.ReactElement {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const currentRange = getMonthDateRange(year, month);
  const prev = getPreviousMonth(year, month);
  const prevRange = getMonthDateRange(prev.year, prev.month);

  const { data: currentData, isLoading: isLoadingCurrent } = useTransactions({
    startDate: currentRange.startDate,
    endDate: currentRange.endDate,
    page: 1,
    pageSize: 100,
  });

  const { data: prevData, isLoading: isLoadingPrev } = useTransactions({
    startDate: prevRange.startDate,
    endDate: prevRange.endDate,
    page: 1,
    pageSize: 100,
  });

  const { isInitializing } = useAuthStore();
  const isLoading = isInitializing || isLoadingCurrent || isLoadingPrev;
  const currentTransactions = useMemo<TransactionDTO[]>(
    () => currentData?.data ?? [],
    [currentData?.data],
  );
  const prevTransactions = useMemo<TransactionDTO[]>(() => prevData?.data ?? [], [prevData?.data]);

  const { totalIncomeCents, totalExpenseCents } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const tx of currentTransactions) {
      if (tx.type === "INCOME") income += tx.amountCents;
      else expense += tx.amountCents;
    }
    return { totalIncomeCents: income, totalExpenseCents: expense };
  }, [currentTransactions]);

  const previousExpenseCents = useMemo(() => {
    let expense = 0;
    for (const tx of prevTransactions) {
      if (tx.type === "EXPENSE") expense += tx.amountCents;
    }
    return expense;
  }, [prevTransactions]);

  const topCategories = useMemo(() => {
    const categoryMap = new Map<
      string,
      { name: string; icon: string; color: string; totalCents: number }
    >();

    for (const tx of currentTransactions) {
      if (tx.type !== "EXPENSE") continue;
      const existing = categoryMap.get(tx.categoryId);
      if (existing) {
        existing.totalCents += tx.amountCents;
      } else {
        categoryMap.set(tx.categoryId, {
          name: tx.category.name,
          icon: tx.category.icon,
          color: tx.category.color,
          totalCents: tx.amountCents,
        });
      }
    }

    const sorted = [...categoryMap.values()]
      .sort((a, b) => b.totalCents - a.totalCents)
      .slice(0, 3);
    const totalExpense = sorted.reduce((sum, c) => sum + c.totalCents, 0);

    return sorted.map((cat) => ({
      ...cat,
      percentage: totalExpense > 0 ? Math.round((cat.totalCents / totalExpense) * 100) : 0,
    }));
  }, [currentTransactions]);

  const dailyData = useMemo(() => {
    const dayMap = new Map<number, number>();

    for (const tx of currentTransactions) {
      if (tx.type !== "EXPENSE") continue;
      const day = new Date(tx.transactionDate).getDate();
      dayMap.set(day, (dayMap.get(day) ?? 0) + tx.amountCents);
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        day,
        totalExpenseCents: dayMap.get(day) ?? 0,
      };
    });
  }, [currentTransactions, year, month]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 md:px-6 lg:px-8 lg:py-8">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-xl font-bold uppercase lg:text-2xl">Laporan Bulanan</h1>
        <MonthNavigator
          year={year}
          month={month}
          onChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
        />
      </div>

      {/* Responsive grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <div className="md:col-span-2">
            <ChartSkeleton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Summary */}
          <ReportSummary
            totalIncomeCents={totalIncomeCents}
            totalExpenseCents={totalExpenseCents}
          />

          {/* Month Comparison */}
          <MonthComparison
            currentExpenseCents={totalExpenseCents}
            previousExpenseCents={previousExpenseCents}
          />

          {/* Top Categories */}
          <TopCategories categories={topCategories} />

          {/* Daily Chart — full width */}
          <div className="md:col-span-2">
            <DailyExpenseChart data={dailyData} />
          </div>

          {/* Export — full width */}
          <div className="md:col-span-2">
            <ExportButton />
          </div>
        </div>
      )}
    </div>
  );
}
