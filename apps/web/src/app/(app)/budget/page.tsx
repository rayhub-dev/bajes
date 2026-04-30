"use client";

import { useState } from "react";
import { MonthNavigator } from "@/components/layouts/MonthNavigator";
import { BudgetList } from "@/components/features/BudgetList/BudgetList";
import { BudgetForm } from "@/components/features/BudgetForm/BudgetForm";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/currency";

interface SelectedBudget {
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

  // Mock totals
  const totalBudget = 2500000;
  const totalSpent = 1670000;
  const remaining = totalBudget - totalSpent;

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-5">
      {/* Header */}
      <h1 className="font-display text-xl font-bold uppercase">Bajes (Budget)</h1>

      {/* Month Navigator */}
      <MonthNavigator
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {/* Total Budget Summary */}
      <Card variant="yellow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-bajes-black/60">
              Total Bajes
            </p>
            <p className="font-display text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-bajes-black/60">Sisa</p>
            <p className="font-display text-lg font-bold">{formatCurrency(remaining)}</p>
          </div>
        </div>
      </Card>

      {/* Budget List */}
      <BudgetList
        onItemTap={(id) => {
          // Mock: find budget by id and open form
          const mockBudgets: Record<string, SelectedBudget> = {
            "1": {
              categoryIcon: "🍜",
              categoryName: "Makanan & Minuman",
              currentBudgetCents: 1500000,
              spentCents: 850000,
            },
            "2": {
              categoryIcon: "🚗",
              categoryName: "Transportasi",
              currentBudgetCents: 500000,
              spentCents: 420000,
            },
            "3": {
              categoryIcon: "🛍️",
              categoryName: "Belanja",
              currentBudgetCents: 300000,
              spentCents: 350000,
            },
            "4": {
              categoryIcon: "📱",
              categoryName: "Tagihan",
              currentBudgetCents: 200000,
              spentCents: 50000,
            },
            "5": {
              categoryIcon: "🎮",
              categoryName: "Hiburan",
              currentBudgetCents: 0,
              spentCents: 54000,
            },
          };
          const budget = mockBudgets[id];
          if (budget) setSelectedBudget(budget);
        }}
      />

      {/* Budget Form Bottom Sheet */}
      {selectedBudget && (
        <BudgetForm
          isOpen={true}
          onClose={() => setSelectedBudget(null)}
          categoryIcon={selectedBudget.categoryIcon}
          categoryName={selectedBudget.categoryName}
          currentBudgetCents={selectedBudget.currentBudgetCents}
          spentCents={selectedBudget.spentCents}
        />
      )}
    </div>
  );
}
