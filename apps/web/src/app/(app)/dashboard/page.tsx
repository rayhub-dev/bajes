"use client";

import { useState } from "react";
import { MonthNavigator } from "@/components/layouts/MonthNavigator";
import { HeroCard } from "@/components/features/Dashboard/HeroCard";
import { SummaryCard } from "@/components/features/Dashboard/SummaryCard";
import { RecentTransactions } from "@/components/features/Dashboard/RecentTransactions";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/Skeleton";

const ExpenseDonutChart = dynamic(
  () =>
    import("@/components/features/Dashboard/ExpenseDonutChart").then(
      (mod) => mod.ExpenseDonutChart,
    ),
  { loading: () => <ChartSkeleton />, ssr: false },
);

export default function DashboardPage(): React.ReactElement {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Halo Bestie! 👋
          </p>
          <h1 className="font-display text-xl font-bold uppercase">Dashboard</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-bajes-black bg-bajes-pink text-lg shadow-brutal-sm">
          🧑
        </div>
      </div>

      {/* Month Navigator */}
      <MonthNavigator
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {/* Hero Card */}
      <HeroCard
        remainingCents={450000}
        totalBudgetCents={2500000}
        hasBudget={true}
        totalIncomeCents={7500000}
        totalExpenseCents={2050000}
      />

      {/* Summary */}
      <SummaryCard totalIncomeCents={7500000} totalExpenseCents={2050000} />

      {/* Donut Chart */}
      <ExpenseDonutChart categories={[]} />

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
