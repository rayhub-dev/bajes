"use client";

import { useState, useMemo } from "react";
import { MonthNavigator } from "@/components/layouts/MonthNavigator";
import { HeroCard } from "@/components/features/Dashboard/HeroCard";
import { SummaryCard } from "@/components/features/Dashboard/SummaryCard";
import { RecentTransactions } from "@/components/features/Dashboard/RecentTransactions";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CardSkeleton, ListItemSkeleton } from "@/components/ui/Skeleton";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuthStore } from "@/store/auth";

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

  const { user, isAuthenticated, isInitializing } = useAuthStore();

  // Build date range for current month
  const startDate = `${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`;
  const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

  const { data: txResponse, isLoading: txLoading } = useTransactions({
    startDate,
    endDate,
    pageSize: 100,
  });

  const transactions = useMemo(() => txResponse?.data ?? [], [txResponse?.data]);

  const totalIncomeCents = useMemo(
    () =>
      transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amountCents, 0),
    [transactions],
  );

  const totalExpenseCents = useMemo(
    () =>
      transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + t.amountCents, 0),
    [transactions],
  );

  // Recent transactions (last 5)
  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime(),
        )
        .slice(0, 5)
        .map((tx) => ({
          id: tx.id,
          categoryIcon: tx.category.icon,
          categoryName: tx.category.name,
          categoryColor: tx.category.color,
          note: tx.note ?? undefined,
          amountCents: tx.amountCents,
          type: tx.type,
          time: new Date(tx.createdAt)
            .toLocaleString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(" pukul", ","),
          syncStatus: "synced" as const,
        })),
    [transactions],
  );

  // Expense categories for donut chart
  const expenseCategories = useMemo(() => {
    const expenseTxs = transactions.filter((t) => t.type === "EXPENSE");
    const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amountCents, 0);
    if (totalExpense === 0) return [];

    const byCat = new Map<
      string,
      { name: string; icon: string; color: string; totalCents: number }
    >();
    for (const tx of expenseTxs) {
      const existing = byCat.get(tx.categoryId);
      if (existing) {
        existing.totalCents += tx.amountCents;
      } else {
        byCat.set(tx.categoryId, {
          name: tx.category.name,
          icon: tx.category.icon,
          color: tx.category.color,
          totalCents: tx.amountCents,
        });
      }
    }

    return Array.from(byCat.values())
      .sort((a, b) => b.totalCents - a.totalCents)
      .slice(0, 5)
      .map((cat) => ({
        ...cat,
        percentage: Math.round((cat.totalCents / totalExpense) * 100),
      }));
  }, [transactions]);

  // User display name
  const displayName =
    isAuthenticated && user ? (user.displayName ?? user.email.split("@")[0] ?? "User") : "Bestie";

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 md:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Halo {displayName}! 👋
          </p>
          <h1 className="font-display text-xl font-bold uppercase lg:text-2xl">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Theme toggle visible on mobile (sidebar has it on desktop) */}
          <ThemeToggle className="lg:hidden" />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-bajes-black bg-bajes-pink text-lg shadow-brutal-sm dark:border-white/20 dark:shadow-brutal-dark-sm">
            {user?.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={displayName}
                width={40}
                height={40}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <span className="font-bold">{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>
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

      {/* Responsive grid: single column on mobile, 2 columns on tablet+ */}
      {txLoading || isInitializing ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:col-span-2 xl:col-span-2">
            <CardSkeleton />
          </div>
          <div className="xl:col-span-1">
            <CardSkeleton />
          </div>
          <div className="md:col-span-1 xl:col-span-1">
            <ChartSkeleton />
          </div>
          <div className="space-y-1 md:col-span-1 xl:col-span-2">
            {[...Array(5)].map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* Hero Card — spans full width on mobile, 1 col on md */}
          <div className="md:col-span-2 xl:col-span-2">
            <HeroCard
              remainingCents={0}
              totalBudgetCents={0}
              hasBudget={false}
              totalIncomeCents={totalIncomeCents}
              totalExpenseCents={totalExpenseCents}
            />
          </div>

          {/* Summary — 1 col on xl */}
          <div className="xl:col-span-1">
            <SummaryCard
              totalIncomeCents={totalIncomeCents}
              totalExpenseCents={totalExpenseCents}
            />
          </div>

          {/* Donut Chart */}
          <div className="md:col-span-1 xl:col-span-1">
            <ExpenseDonutChart categories={expenseCategories} />
          </div>

          {/* Recent Transactions — takes more space */}
          <div className="md:col-span-1 xl:col-span-2">
            <RecentTransactions transactions={recentTransactions} />
          </div>
        </div>
      )}
    </div>
  );
}
