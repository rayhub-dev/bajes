"use client";

import { useState, useMemo } from "react";
import { MonthNavigator } from "@/components/layouts/MonthNavigator";
import { BudgetList } from "@/components/features/BudgetList/BudgetList";
import { BudgetForm } from "@/components/features/BudgetForm/BudgetForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils/currency";
import { useBudgets, useUpsertBudget, useDeleteBudget } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { useAuthStore } from "@/store/auth";
import type { BudgetWithSpentDTO } from "@bajes/types";

interface SelectedBudget {
  id: string;
  categoryId: string;
  categoryIcon: string;
  categoryName: string;
  currentBudgetCents: number;
  spentCents: number;
}

export default function BudgetPage(): React.ReactElement {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedBudget, setSelectedBudget] = useState<SelectedBudget | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const { data: budgets, isLoading } = useBudgets(year, month);
  const { data: categories } = useCategories();
  const upsertMutation = useUpsertBudget();
  const deleteMutation = useDeleteBudget();
  const { isInitializing } = useAuthStore();

  const budgetListData = useMemo(() => {
    if (!budgets) return [];
    return budgets.map((b: BudgetWithSpentDTO) => ({
      id: b.id,
      categoryId: b.categoryId,
      categoryIcon: b.category.icon,
      categoryName: b.category.name,
      categoryColor: b.category.color,
      budgetCents: b.amountCents,
      spentCents: b.spentCents,
    }));
  }, [budgets]);

  const { totalBudget, remaining } = useMemo(() => {
    if (!budgets) return { totalBudget: 0, remaining: 0 };
    const total = budgets.reduce((sum: number, b: BudgetWithSpentDTO) => sum + b.amountCents, 0);
    const spent = budgets.reduce((sum: number, b: BudgetWithSpentDTO) => sum + b.spentCents, 0);
    return { totalBudget: total, remaining: total - spent };
  }, [budgets]);

  const handleItemTap = (budgetId: string): void => {
    const budget = budgets?.find((b: BudgetWithSpentDTO) => b.id === budgetId);
    if (budget) {
      setSelectedBudget({
        id: budget.id,
        categoryId: budget.categoryId,
        categoryIcon: budget.category.icon,
        categoryName: budget.category.name,
        currentBudgetCents: budget.amountCents,
        spentCents: budget.spentCents,
      });
    }
  };

  const handleSubmit = (amountCents: number): void => {
    if (!selectedBudget) return;
    upsertMutation.mutate({
      categoryId: selectedBudget.categoryId,
      amountCents,
      periodType: "MONTHLY",
      periodYear: year,
      periodMonth: month,
      notifyAt: 80,
    });
  };

  const handleRemove = (): void => {
    if (!selectedBudget) return;
    deleteMutation.mutate(selectedBudget.id);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 md:px-6 lg:px-8 lg:py-8">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-xl font-bold uppercase lg:text-2xl">Bajes (Budget)</h1>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={() => setShowCategoryPicker(true)}>
            + Tambah Bajes
          </Button>
          <MonthNavigator
            year={year}
            month={month}
            onChange={(y, m) => {
              setYear(y);
              setMonth(m);
            }}
          />
        </div>
      </div>

      {/* Responsive grid: summary + list side by side on desktop */}
      {isLoading || isInitializing ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CardSkeleton />
          </div>
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Total Budget Summary */}
          <div className="lg:col-span-1">
            <Card variant="yellow">
              <div className="flex items-center justify-between lg:flex-col lg:items-start lg:gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-bajes-black/60">
                    Total Bajes
                  </p>
                  <p className="font-display text-2xl font-bold text-bajes-black">
                    {formatCurrency(totalBudget)}
                  </p>
                </div>
                <div className="text-right lg:text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-bajes-black/60">
                    Sisa
                  </p>
                  <p className="font-display text-lg font-bold text-bajes-black">
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Budget List */}
          <div className="lg:col-span-2">
            <BudgetList budgets={budgetListData} onItemTap={handleItemTap} />
          </div>
        </div>
      )}

      {/* Category Picker for new budget */}
      {showCategoryPicker && categories && (
        <Card>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Pilih Kategori
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories
              .filter((c) => c.type === "EXPENSE")
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedBudget({
                      id: "new",
                      categoryId: cat.id,
                      categoryIcon: cat.icon,
                      categoryName: cat.name,
                      currentBudgetCents: 0,
                      spentCents: 0,
                    });
                    setShowCategoryPicker(false);
                  }}
                  className="flex items-center gap-2 rounded-xl border-2 border-gray-200 p-3 text-left hover:border-bajes-yellow hover:bg-bajes-yellow/10 dark:border-white/10 dark:hover:border-bajes-yellow"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-semibold">{cat.name}</span>
                </button>
              ))}
          </div>
        </Card>
      )}

      {/* Budget Form Bottom Sheet */}
      {selectedBudget && (
        <BudgetForm
          isOpen={true}
          onClose={() => setSelectedBudget(null)}
          categoryIcon={selectedBudget.categoryIcon}
          categoryName={selectedBudget.categoryName}
          currentBudgetCents={selectedBudget.currentBudgetCents}
          spentCents={selectedBudget.spentCents}
          onSubmit={handleSubmit}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
