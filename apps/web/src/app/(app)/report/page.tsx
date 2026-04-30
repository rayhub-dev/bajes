"use client";

import { useState } from "react";
import { MonthNavigator } from "@/components/layouts/MonthNavigator";
import { ReportSummary } from "@/components/features/Report/ReportSummary";
import { TopCategories } from "@/components/features/Report/TopCategories";
import { MonthComparison } from "@/components/features/Report/MonthComparison";
import { ExportButton } from "@/components/features/Report/ExportButton";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/Skeleton";

const DailyExpenseChart = dynamic(
  () =>
    import("@/components/features/Report/DailyExpenseChart").then((mod) => mod.DailyExpenseChart),
  { loading: () => <ChartSkeleton />, ssr: false },
);

export default function ReportPage(): React.ReactElement {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-5">
      {/* Header */}
      <h1 className="font-display text-xl font-bold uppercase">Laporan Bulanan</h1>

      {/* Month Navigator */}
      <MonthNavigator
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {/* Summary */}
      <ReportSummary totalIncomeCents={7500000} totalExpenseCents={2050000} />

      {/* Month Comparison */}
      <MonthComparison currentExpenseCents={2050000} previousExpenseCents={1800000} />

      {/* Top Categories */}
      <TopCategories />

      {/* Daily Chart */}
      <DailyExpenseChart />

      {/* Export */}
      <ExportButton />
    </div>
  );
}
