"use client";

import { Card } from "@/components/ui/Card";
import { BudgetItem } from "./BudgetItem";

interface BudgetData {
  id: string;
  categoryId: string;
  categoryIcon: string;
  categoryName: string;
  categoryColor: string;
  budgetCents: number;
  spentCents: number;
}

interface BudgetListProps {
  budgets?: BudgetData[];
  onItemTap?: (budgetId: string) => void;
}

function BudgetList({ budgets = [], onItemTap }: BudgetListProps): React.ReactElement {
  if (budgets.length === 0) {
    return (
      <Card>
        <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
          Belum ada bajes yang diatur untuk bulan ini
        </p>
      </Card>
    );
  }

  return (
    <Card noPadding>
      <div className="divide-y divide-gray-100 px-4 dark:divide-white/10">
        {budgets.map((budget) => (
          <BudgetItem
            key={budget.id}
            categoryIcon={budget.categoryIcon}
            categoryName={budget.categoryName}
            categoryColor={budget.categoryColor}
            budgetCents={budget.budgetCents}
            spentCents={budget.spentCents}
            onTap={() => onItemTap?.(budget.id)}
          />
        ))}
      </div>
    </Card>
  );
}

export { BudgetList, type BudgetData };
